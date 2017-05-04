<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\PDF;
use App\Http\Controllers\DB;
use App\Dish;
use App\Log;
use App\Order;
use App\Cycle;
use App\Cycle_dish;
use JWTAuth;
use Mail;

class ReportController extends Controller
{
  public function idUser()
  {
    $users = JWTAuth::parseToken()->authenticate();
    return $users->id;
  }
  public function nameDate($fecha)
  {
      $fecha = date("w",strtotime($fecha));
      switch ($fecha)
      {
        case 0: return "SUN"; break;
        case 1: return "MON"; break;
        case 2: return "TUE"; break;
        case 3: return "WED"; break;
        case 4: return "THU"; break;
        case 5: return "FRI"; break;
        case 6: return "SAT"; break;
      }
  }
  public function generateReportCycle(Request $request)
   {
     $init=[];
     $close=[]; 
     $userToken = JWTAuth::parseToken()->ToUser();
     $id = $request->get('id');

     $dishes = Cycle_dish::select('date_cycle')->where('id_cycle', $id)->distinct()->orderBy('date_cycle')->get();

     $fechas = collect([]);
     foreach($dishes as $key)
     {
      $cicle_date = Cycle::select('initial_date', 'closing_date')->where('id', $id)->get();
      foreach ($cicle_date as $val) {
        $init= array_add($key, 'initial',  date('Y/m/d', strtotime($val->initial_date)));
        $close= array_add($key, 'closing', date('Y/m/d', strtotime($val->closing_date)));
      }
      $key->date_cycle = date('Y/m/d', strtotime($key->date_cycle));
      $fecha = $this->nameDate($key->date_cycle);
      $key = array_add($key, 'day', $fecha);
      $dish = Cycle_dish::select('id_dish')->where('date_cycle', $key->date_cycle)->get();
      $key = array_add($key, 'dish', $dish);
     }

     $sum = 0;
     foreach($dishes as $key)
     {
      $sumDay=0;
       foreach($key->dish as $val)
       {
            $var = Order::where('id_dish', $val->id_dish)->where('date_order', $key->date_cycle)->where('id_dish' ,'!=', 1 )->count();
            $sumDay = $sumDay + $var;
            $sum = $sum + $var;
            $val = array_add($val, 'count', $var);
            $dish = Dish::select('title')->where('id', $val->id_dish)->get();
            foreach($dish as $valor)
            {
              $val = array_add($val, 'title', $valor->title);
            }
       }
       $key = array_add($key, 'daycount', $sumDay);
       $sumDay = 0;
     }

    $logs = Log::create([
       'id_user' => $this->idUser(),
       'action' => 'Generate reports',
       'table' => 'orders',
       'fields' => 'All',
       'value' => 'PDF',
     ]);

     $pdf = \PDF::loadView('reports.report', compact('dishes', 'sum', 'init','close'));
      return $pdf->download('archivo.pdf');
   }

   public function listcycle()
   {
      $cycle = Cycle::select('id','initial_date','closing_date')->get();
      if(count($cycle)==0)
      {
          return response()->json(['message' => 'Not found cycle', 'code' => '404']);
      }
      foreach($cycle as $key)
      {
          $dishes = Cycle_dish::select('date_cycle')->where('id_cycle', $key->id)->distinct()->get();
          $key = array_add($key, 'dishes', $dishes);
      }
      $array =[];
      foreach ($cycle as $key) {
          foreach ($key->dishes as $val) {
               $user = \DB::table('users')
            ->join('orders','users.id','=','orders.id_user')
            ->select('users.id')
            ->where('orders.date_order', '=', $val->date_cycle)
            ->orderBy('orders.id_user', 'DESC')
            ->get();


            foreach($user as $valor)
            {
                $array = array_prepend($array, $valor->id);
            }

            $users = \DB::table('users')
                    ->select('id')
                    ->whereNotIn('id', $array)
                    ->get();

            if(count($users)>0)
            {
              $key = array_add($key, 'remaining', true);
            }
            else
            {
              $key = array_add($key, 'remaining', false);
            }
          }
      }
      return response()->json(['data' => $cycle, 'message' => 'Cycle List', 'code' => '200']);
      

   }
}
