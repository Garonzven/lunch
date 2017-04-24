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
    private function validate($data){
      if (!$data) {
        return response()->json(['message'=>'not found the user'],404);
      }
    }
    public function registerUser(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $user = new User([
        'name' => $request->get('name'),
        'last_name' => $request->get('last_name'),
        'dni' => $request->get('dni'),
        'country' => $request->get('country'),
        'city' => $request->get('city'),
        'phone' => $request->get('phone'),
        'email' => $request->get('email'),
        'photo' => $request->get('photo'),
        'password' => bcrypt($request->get('password')),#str_random(10),
        'change_pass' => $request->get('change_pass'),
        'id_profile' => $request->get('id_profile')
      ]);
      $user->save();
      Mail::send('welcome', ['data' => $user], function($message) use($user){
        $message->to($user->email, 'To:'. $user->name)->subject('Verify account');});
      #return response()->json(['message'=>'user has created'],201);
      return response()->json(['message'=>'user has created', 'data'=>$user],201);

    }
    public function searchUserlist()
    {
        $user = User::all();
        return response()->json(['data' => $user, 'message' => 'User List'],200);
    }
    public function searchUser(Request $request)
    {
        $user = \DB::table('users')->where('email', $request->get('email'))->get();
        $this->validate($user);
        return response()->json(['data' => $user, 'message' => 'User find'],200);

    }
    public function updateUser(Request $request)
    {
        $user = \DB::table('users')->where('email', $request->get('email'))->get();
        $this->validate($user);
        $user->name = $request->input('name');
        $user->last_name = $request->input('last_name');
        $user->dni = $request->input('dni');
        $user->country = $request->input('country');
        $user->city = $request->input('city');
        $user->phone = $request->input('phone');
        $user->country = $request->input('photo');
        $user->name = $request->input('email')
        $user->id_profile = $request->input('id_profile');
        $user->save();
        return response()->json(['data'=>$user,'message'=>'user has modificade'],200);

        /*$user = \DB::table('users')->where('id', $id)->update(['name' => $request->get('name'), 'photo' => $request->get('photo')]);//Falta definir que campos pueden ser actualizados
        return response()->json(['user' => $user, 'message' => 'User update'],200);*/
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
       if(count($user)>0)
           {
               $change = \DB::table('users')->where('email', $vals->email)->update(['password' => $vals->password, 'change_pass' => true]);
               Mail::send('welcome', ['data' => $vals], function($message) use($vals){
               $message->to($vals->email, 'To:'. $vals->name)->subject('Change password');
               });
               return response()->json(['user' => $vals, 'message' => 'Send new password'],200);
           }
           return response()->json(['message' => 'email not exists'],404);
   }
    public function deleteUser(Request $request)
    {
        $user = \DB::table('users')->where('email', $request->get('email'))->get();
        $this->validate($user);
        $user->delete();
        return response()->json(['message' => 'User delete'],200);


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
    public function searchUserName($name)
    {
            $user = User::name($name)->get();
            if(!count($user)==0)
            {
                return response()->json(['user' => $user, 'message' => 'Search for name'],200);
            }
            return response()->json(['message' => 'Search fail'],400);
    }*/
    /*public function searchId($id)
    {
        $user = User::find($id);
        if(!count($user)==0)
        {
            return response()->json(['data' => $user, 'message' => 'User find'],200);
        }
        return response()->json(['message' => 'User not find'],404);
    }
    public function deleteUser($id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json(['message' => 'User delete'],200);
    }
    public function updateUser(Request $request, $id)
    {

        $user = \DB::table('users')->where('id', $id)->update(['name' => $request->get('name'), 'photo' => $request->get('photo')]);//Falta definir que campos pueden ser actualizados

          return response()->json(['user' => $user, 'message' => 'User update'],200);
    }
    public function createUser(Request $request)
    {
        $exists = \DB::table('users')->select('dni', 'email')->where('dni',$request->get('dni'))->orWhere('email', $request->get('email'))->get();

         $field = new User();
          if(count($exists)==0)
          {
            $field->name = $request->get('name');
            $field->last_name = $request->get('last_name');
            $field->dni= $request->get('dni');
            $field->country = $request->get('country');
            $field->city = $request->get('city');
            $field->phone = $request->get('phone');
            $field->email = $request->get('email');
            $field->photo = $request->get('photo');
            $field->password = bcrypt($request->get('password'));
            $field->change_pass = $request->get('change_pass');
            $field->id_profile = $request->get('id_profile');
            $field->save();

            return response()->json(['message' => 'User created'],201);
          }
          return response()->json(['message' => 'user repeated', 'user' => $exists],400);
    }
    public function searchAllUser()
    {
        $user = User::all();

        return response()->json(['data' => $user, 'message' => 'User List'],200);
    }
    public function restoreUser($id)
    {
        $user = User::withTrashed()->where('id', $id)->first();
        $user->restore();
        return response()->json(['user' => $user, 'message' => 'User restore'], 200);
    }

    public function searchName($name)
    {
            $user = User::name($name)->get();
            if(!count($user)==0)
            {
                return response()->json(['user' => $user, 'message' => 'Search for name'],200);
            }
            return response()->json(['message' => 'Search fail'],400);
    }*/
}
