<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\PDF;
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
        case 0: return "Sunday"; break;
        case 1: return "Monday"; break;
        case 2: return "Tuesday"; break;
        case 3: return "Wednesday"; break;
        case 4: return "Thursday"; break;
        case 5: return "Friday"; break;
        case 6: return "Saturday"; break;
      }
  }
  public function generateReportCycle(Request $request)
   {
     $userToken = JWTAuth::parseToken()->ToUser();
     $id = $request->get('id');

     $dishes = Cycle_dish::select('date_cycle')->where('id_cycle', $id)->distinct()->orderBy('date_cycle')->get();
    //  dd($dishes);
     $fechas = collect([]);
     foreach($dishes as $key)
     {
      $fecha = $this->nameDate($key->date_cycle);
      $key = array_add($key, 'day', $fecha);
      $dish = Cycle_dish::select('id_dish')->where('date_cycle', $key->date_cycle)->get();
      $key = array_add($key, 'dish', $dish);
     }
     //dd($dishes->toArray());
     $sum = 0;
     foreach($dishes as $key)
     {
       foreach($key->dish as $val)
       {
            //$var = Order::where('id_dish', $key->id_dish)->where('date_order', $key->date_cycle)->count();
            $var = Order::where('id_dish', $val->id_dish)->where('date_order', $key->date_cycle)->count();
            $sum = $sum + $var;
            $val = array_add($val, 'count', $var);
            $dish = Dish::select('title')->where('id', $val->id_dish)->get();
            foreach($dish as $valor)
            {
              $val = array_add($val, 'title', $valor->title);
            }
       }
     }

    //  foreach($dishes as $key)
    //  {
    //     $fecha = $this->nameDate($key->date_cycle);
    //     $key = array_add($key, 'day', $fecha);
    //     $var = Order::where('id_dish', $key->id_dish)->where('date_order', $key->date_cycle)->count();
    //     $sum = $sum + $var;
    //     $key = array_add($key, 'count', $var);
    //     $dish = Dish::select('title')->where('id', $key->id_dish)->get();
    //     foreach($dish as $val)
    //     {
    //       $key = array_add($key, 'title', $val->title);
    //     }
     //
    //  }
     //dd($sum);

     $pdf = \PDF::loadView('reports.report', compact('dishes', 'sum'));
      return $pdf->download('archivo.pdf');

    /* $logs = Log::create([
       'id_user' => $this->idUser(),
       'action' => 'Generate reports',
       'table' => 'cycles',
       'fields' => 'id_user, id_dish, date_order',
       'value' => $value,
     ]);*/


   }
}
