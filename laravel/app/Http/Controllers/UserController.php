<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\User;
use JWTAuth;
use Mail;
class UserController extends Controller
{
    public function registerUser(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $find = User::where('email', $request->input('email'))->get();
      if(count($find)==0)
      {
          return response()->json(['message'=>'email exists','code'=>'404']);
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
        'change_pass' => true,
        'id_profile' => $request->input('id_profile'),
      ]);
      Mail::send('mails.welcome', ['data' => $user,'password' => $password], function($message) use($user){
        $message->to($user->email, 'To:'. $user->name)->subject('Verify account');});

      return response()->json(['message'=>'user has created', 'data'=>$user,'code'=>'201']);

    }
    public function searchUserlist()
    {
        $user = User::all();
        return response()->json(['data' => $user, 'message' => 'User List','code'=>'200']);
    }
    public function updateUser(Request $request)
    {

        $find = User::where('email', $request->input('email'))->get();
        if(count($find)==0)
        {
            return response()->json(['message'=>'user not found','code'=>'404']);
        }
        $user = User::where('email', $request->get('email'))
        ->update(['name' =>$request->input('name'),
        'jobtitle' => $request->input('jobtitle'),
        'country' => $request->input('country'),
        'city' => $request->input('city'),
        'phone' => $request->input('phone'),
        'email' => $request->input('email'),
        'photo' => $request->input('photo'),
        'id_profile' => $request->input('id_profile'),
      ]);

        return response()->json(['data'=>$user,'message'=>'user has modificade','code'=>'200']);
    }
    public function recoveryPassword(Request $request)
   {
       $users = User::select('name', 'email')->where('email', $request->get('email'))->get();

      if(count($users)==0)
       {
          return response()->json(['message' => 'email not exists','code'=>'404']);
       }

       $vals = new User();

       foreach($users as $user)
       {
           $vals->name = $user->name;
           $vals->email = $user->email;
       }
       $vals->password = str_random(10);

       $dish = User::where('email', $vals->email)->update([
                'password' => bcrypt($vals->password),
                'change_pass' => true,
                ]);

      Mail::send('mails.welcome', ['data' => $vals, 'password' => $vals->password], function($message) use($vals){
               $message->to($vals->email, 'To:'. $vals->name)->subject('Change password');
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

        return response()->json(['message' => 'User delete','code'=>'200']);
    }
    public function changePassword(Request $request)
    {
       $password = User::where('email', $request->get('email'))->update([
         'password' => bcrypt($request->get('password')),
         'change_pass' => false,
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
