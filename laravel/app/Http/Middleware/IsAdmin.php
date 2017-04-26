<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
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

        
        if($users->id_profile == 1)
        {
            return response()->json(['message' => 'al fin nojoda','code' => '200'],200);
        }
        
        return $next($request);
    }
}
