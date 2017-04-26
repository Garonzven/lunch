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
      $password = str_random(10);
      $user = new User([
        'name' => $request->get('name'),
        'last_name' => $request->get('last_name'),
        'dni' => $request->get('dni'),
        'country' => $request->get('country'),
        'city' => $request->get('city'),
        'phone' => $request->get('phone'),
        'email' => $request->get('email'),
        'photo' => $request->get('photo'),
        'password' => bcrypt($password),
        'change_pass' => $request->get('change_pass'),
        'id_profile' => $request->get('id_profile')
      ]);
      $user->save();
      Mail::send('welcome', ['data' => $user,'password'=>$password], function($message) use($user){
        $message->to($user->email, 'To:'. $user->name)->subject('Verify account');});
      return response()->json(['message'=>'user has created', 'data'=>$user,'code'=>'201'],201);

    }
    public function searchUserlist()
    {
        $user = User::all();
        return response()->json(['data' => $user, 'message' => 'User List','code'=>'200'],200);
    }
    public function updateUser(Request $request)
    {
        $email = \DB::table('users')->where('email', $request->get('email'))->get();

        if ($this->validation($email)) {
          return response()->json(['message'=>'not found the user','code'=>'404'],404);
        }
        #dd($email);
        $user =\DB::table('users')->where('email', $request->get('email'))
        ->update(['name' =>$request->input('name'),
        'last_name' => $request->input('last_name'),
        'dni' => $request->input('dni'),
        'country' => $request->input('country'),
        'city' => $request->input('city'),
        'phone' => $request->input('phone'),
        'email' => $request->input('email'),
        'photo' => $request->input('photo'),
        'id_profile' => $request->input('id_profile'),
      ]);

        return response()->json(['data'=>$user,'message'=>'user has modificade','code'=>'200'],200);
    }
    public function recoveryPassword(Request $request)
   {
       $users = \DB::table('users')->select('name', 'email')->where('email', $request->get('email'))->get();
       $vals = new User();
       foreach($users as $user)
       {
           $vals->name = $user->name;
           $vals->email = $user->email;
       }
       $vals->password = str_random(10);
       if(count($users)>0)
           {
               $change = \DB::table('users')->where('email', $vals->email)->update(['password' => bcrypt($vals->password), 'change_pass' => true]);
               Mail::send('mails.welcome', ['data' => $vals], function($message) use($vals){
               $message->to($vals->email, 'To:'. $vals->name)->subject('Change password');
               });
               return response()->json([
                 'user' => $vals,
                 'message' => 'PLease check your emai for a message with your provisional password',
                 'code'=>'200'],200);
           }
           return response()->json(['message' => 'email not exists','code'=>'404'],404);
   }
    public function deleteUser(Request $request)
    {

        $users = User::where('email', $request->get('email'))->get();
        #dd($user);
        $vals = new User();
        foreach($users as $user){$vals->id = $user->id;}
        #dd($vals);
        $find =User::find($vals);
        #dd($find);
        $find->delete();
        return response()->json(['message' => 'User delete','code'=>'200'],200);


    }
    public function changePassword(Request $request)
    {
       $password = User::where('email', $request->get('email'))->update([
         'password' => bcrypt($request->get('password')),
       ]);
       return response()->json(['message' => 'Your password has been successfully changed','code'=>'200'],200);
    }
    public function validation($data){
      /*if (!$data) {
        return response()->json(['message'=>'not found the user'],404);
      }*/
      if (count($data)==0) {
        return true;
      }
    }
    /*
    //restore a user in de db
    public function restoreUser(Request $request)
    {
        $user = User::withTrashed()->where('email', $request->get('email'))->first();
        $user->restore();
        return response()->json(['user' => $user, 'message' => 'User restore'], 200);
    }
    //search name
    */
}
