<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;
use JWTAuth;
use App\User;
class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    #use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    /*public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }*/
    public function authenticate(Request $request)
   {
       $this->validate($request, [
           'email'=>'required|email',
           'password'=>'required']);
       // grab credentials from the request
       $credentials = $request->only('email', 'password');
      #dd($credentials);
       try {
           $token = JWTAuth::attempt($credentials);
           #dd($token);
           // attempt to verify the credentials and create a token for the user
           if (! $token) {
               return response()->json(['error' => 'invalid_credentials'], 401);
           }
       } catch (JWTException $e) {
           // something went wrong whilst attempting to encode the token
           return response()->json(['error' => 'could_not_create_token'], 500);
       }
       $user= User::where('email',$request->email)->first();
       // all good so return the token
       return response()->json(['token'=>$token,'user'=>$user],200);
   }

   public function logout (Request $request)
  {
      $this->validate($request, [
          'token' => 'required'
      ]);

      JWTAuth::invalidate($request->input('token'));
      return response()->json(['message'=>'user has logout'],200);
  }


}
