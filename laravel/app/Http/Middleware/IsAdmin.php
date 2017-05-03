<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
use App\Role;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;
use JWTAuth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $users = JWTAuth::parseToken()->authenticate();
        //$user= User::select('id_profile')->where('email',$request->email)->get();

        $find = Role::where('id_profile', $users->id_profile)->get();
        $action = "";
        foreach($find as $val)
        {
            $action = $val->action;
        }

        if($action != 'AUW')
        {
          return response()->json(['message'=>'Not Authorize Admin', 'code' => '403'],403);
        }

        return $next($request);
    }
}
