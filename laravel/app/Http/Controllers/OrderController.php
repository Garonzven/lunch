<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Dish;
use App\Order;
use App\Cycle;
use App\Cycle_dish;
use JWTAuth;
use Mail;

class OrderController extends Controller
{
  public function registerOrder(Request $request)
   {
     $userToken = JWTAuth::parseToken()->ToUser();

     $data = $request->get('dishes');
     $result;
     foreach($data as $val)
     {
         $order = Order::create([
           'id_user' => $request->get('id_user'),
           'id_dish' => $val['id_dish'],
           'date_order' => $val['date_order'],
           'observation' => '',
         ]);
        $val= array_add($val, 'order', $order);
     }
     return response()->json(['data'=> $val, 'message'=>'order created', 'code' => '201']);
   }
}
