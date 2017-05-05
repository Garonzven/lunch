<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Dish;
use App\Log;
use App\Order;
use App\Cycle;
use App\Cycle_dish;
use JWTAuth;
use Mail;

class OrderController extends Controller
{
  public function idUser()
  {
    $users = JWTAuth::parseToken()->authenticate();
    return $users->id;
  }

  public function registerOrder(Request $request)
   {
     $userToken = JWTAuth::parseToken()->ToUser();

     $data = $request->get('dishes');
     $id = $this->idUser();
     $collections = collect([]);

     foreach($data as $key)
     {
       $find = Order::where('id_user', $id)->where('date_order', '=', $key['date_order'])->get();
       if(count($find)>0)
       {
         $val = Order::where('id_user', $id)->where('date_order', '=', $key['date_order'])->update([
           'id_dish' => $key['id_dish'],
         ]);
         $collections->push($find);
       }
     }
     
     if($collections->isNotEmpty())
     {
       return response()->json(['data'=> $collections, 'message'=>'Order has been Update', 'code' => '200']);
     }

     $collection = collect([]);
     $value = '';
     foreach($data as $val)
     {
         $order = Order::create([
           'id_user' =>$id,
           'id_dish' => $val['id_dish'],
           'date_order' => $val['date_order'],
           'observation' => '',
         ]);
         $data = ''.$id.', '.$val['id_dish'].','.$val['date_order'].'';
         $value = ''.$value.', '.$data.'';

        $collection->push($order);
     }

     $logs = Log::create([
       'id_user' => $this->idUser(),
       'action' => 'Create new orders',
       'table' => 'cycles',
       'fields' => 'id_user, id_dish, date_order',
       'value' => $value,
     ]);

     return response()->json(['data'=> $collection, 'message'=>'Order has been Created', 'code' => '201']);
   }

   public function searchCycleActive()
   {
     $dt = date('Y-m-d H:i:s');


     $cycle = Cycle::where('initial_date','<',$dt)
     ->where('closing_date','>',$dt)
     ->orWhere('initial_date', '=', $dt)
     ->orWhere('closing_date', '=', $dt)
     ->orWhere('initial_date', '>', $dt)
     ->where('closing_date','>',$dt)
     ->limit(1)
     ->get();

     if(count($cycle)==0)
     {
       return response()->json([ 'message' => 'Not exist cycle active', 'code' => '404']);
     }

     $valores = new Cycle();

     foreach($cycle as $key)
     {
       $valores->id = $key->id;
       $valores->initial_date = $key->initial_date;
       $valores->closing_date = $key->closing_date;
     }

   $active = \DB::table('dishes')
           ->join('cycle_dishes','dishes.id','=','cycle_dishes.id_dish')
           ->select('cycle_dishes.id_dish','cycle_dishes.id_cycle', 'cycle_dishes.date_cycle','dishes.title','dishes.description' ,'cycle_dishes.deleted_at')
           ->where('cycle_dishes.id_cycle', '=', $valores->id)
           ->whereNull('cycle_dishes.deleted_at')
           ->orderBy('cycle_dishes.date_cycle')
           ->get();

           $valores = array_add($valores, 'dishes', $active);

       return response()->json(['data' => $valores, 'message' => 'Cycle List', 'code' => '200']);
   }
}
