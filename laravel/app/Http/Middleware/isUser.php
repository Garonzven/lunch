<?php

namespace App\Http\Middleware;

use Closure;

class isUser
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

        if($action != 'U')
        {
          return response()->json(['message'=>'Not Authorize', 'code' => '403']);
        }

        return $next($request);
    }
}
