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
     $id = $request->get('id_user');
     $collections = collect([]);

     foreach($data as $key)
     {
       $find = Order::where('id_user', $id)->where('date_order', '=', $key['date_order']);
       $find->delete();
       $collections->push($find);
     }
     $collection = collect([]);
     foreach($data as $val)
     {
         $order = Order::create([
           'id_user' =>$id,
           'id_dish' => $val['id_dish'],
           'date_order' => $val['date_order'],
           'observation' => '',
         ]);
        $collection->push($order);
     }
     return response()->json(['data'=> $collection, 'message'=>'order created', 'code' => '201']);
   }
}
