<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use App\Log;
use JWTAuth;
use Mail;
class UserController extends Controller
{
    public function idUser()
    {
      $users = JWTAuth::parseToken()->authenticate();
      return $users->id;
    }

    public function registerUser(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $find = User::where('email', $request->input('email'))->get();
      if(count($find)!=0)
      {
          return response()->json(['message'=>'email not exists','code'=>'404']);
      }
      $password = str_random(10);
      $user = User::create([
        'name' => $request->input('name'),
        'jobtitle' =>$request->input('jobtitle'),
        'country' => $request->input('country'),
        'city' => $request->input('city'),
        'phone' => $request->input('phone'),
        'email' => $request->input('email'),
        'photo' => $request->input('photo'),
        'password' => bcrypt($password),
        'change_pass' => false,
        'id_profile' => $request->input('id_profile'),
      ]);
      $values = ''.$request->input('name').', '.$request->input('jobtitle').', '.$request->input('country').', '.$request->input('city').', '.$request->input('phone').', '.$request->input('email').', '.$request->input('id_profile').'';
      $fields = 'name, jobtitle, country, city, phone, email, id_profile';
      $logs = Log::create([
        'id_user' => $this->idUser(),
        'action' => 'Create new user',
        'table' => 'users',
        'fields' => $fields,
        'value' => $values,
      ]);

      Mail::send('mails.welcome', ['data' => $user, 'password' => $password], function($message) use($user){
        $message->to($user->email, 'To:'. $user->name)->subject('Verify account');
        $message->from('system@garonz.com','garonz');
      });

      return response()->json(['message'=>'User has been created', 'data'=>$user,'code'=>'201']);


    }
    public function searchUserlist()
    {
        $user = User::all();
        return response()->json(['data' => $user, 'message' => 'User List','code'=>'200']);
    }
    public function updateUser(Request $request)
    {
        $bandera = false;

        if($request->input('emailold') == $request->input('emailnew'))
        {
            $bandera = true;
        }
        $find = User::where('email', $request->input('emailold'))->get();
        if(count($find)==0)
        {
            return response()->json(['message'=>'User not found','code'=>'404']);
        }
        $findnew = User::where('email', $request->input('emailnew'))->get();

        if(count($findnew)>0 && $bandera == false)
        {
          return response()->json(['message'=>'The email entered is already used','code'=>'304']);
        }

        $user = User::where('email', $request->get('emailold'))
        ->update(['name' =>$request->input('name'),
        'jobtitle' => $request->input('jobtitle'),
        'country' => $request->input('country'),
        'city' => $request->input('city'),
        'phone' => $request->input('phone'),
        'email' => $request->input('emailnew'),
        'photo' => $request->input('photo'),
        'id_profile' => $request->input('id_profile'),
      ]);

      /*$values = ''.$request->input('name').', '.$request->input('jobtitle').', '.$request->input('country').', '.$request->input('city').', '.$request->input('phone').', '.$request->input('emailnew').', '.$request->input('id_profile').'';
      $fields = 'name, jobtitle, country, city, phone, email, id_profile';
      $logs = Log::create([
        'id_user' => $this->idUser(),
        'action' => 'Update user',
        'table' => 'users',
        'fields' => $fields,
        'value' => $values,
      ]);*/

        return response()->json(['data'=>$user,'message'=>'User has been updated','code'=>'200']);



    }
    public function recoveryPassword(Request $request)
   {
      $users = User::select('id', 'name', 'email')->where('email', $request->get('email'))->get();
      if(count($users)==0)
       {
          return response()->json(['message' => 'email not exists','code'=>'404']);
       }

       $vals = new User();

       foreach($users as $user)
       {
          $vals->id = $user->id;
          $vals->name = $user->name;
          $vals->email = $user->email;
       }
       $vals->password = str_random(10);

       $user = User::where('email', $vals->email)->update([
                'password' => bcrypt($vals->password),
                'change_pass' => true,
                ]);

      $logs = Log::create([
        'id_user' => $vals->id,
                  'action' => 'Recovery password',
                  'table' => 'users',
                  'fields' => 'password, change_pass',
                  'value' => 'true'.'secret',
                ]);

      Mail::send('mails.example', ['data' => $vals, 'password' => $vals->password], function($message) use($vals){
               $message->to($vals->email, 'To:'. $vals->name)->subject('Recovery password');
               $message->from('system@garonz.com','garonz');
               });

      return response()->json([
                 'user' => $vals,
                 'message' => 'Please check your email for a message with your provisional password',
                 'code'=>'200']);
   }
    public function deleteUser(Request $request)
    {
        $find = User::where('email', $request->get('email'));

        $find->delete();

        $logs = Log::create([
          'id_user' => $this->idUser(),
          'action' => 'Delete user',
          'table' => 'users',
          'fields' => 'All',
          'value' => 'All',
        ]);


        return response()->json(['message' => 'User has been deleted','code'=>'200']);
    }
    public function changePassword(Request $request)
    {
      $users = JWTAuth::parseToken()->authenticate();

     $password = User::where('email', $users->email)->update([
         'password' => bcrypt($request->get('password')),
         'change_pass' => false,
       ]);


       $logs = Log::create([
         'id_user' => $this->idUser(),
         'action' => 'Change password',
         'table' => 'users',
         'fields' => 'password',
         'value' => 'secret',
       ]);
       return response()->json(['message' => 'Your password has been successfully changed','code'=>'200']);
    }

  /*  public function restoreUser(Request $request)
    {
        $user = User::withTrashed()->where('email', $request->get('email'))->first();
        $user->restore();
        return response()->json(['user' => $user, 'message' => 'User restore'], 200);
    }*/



}
