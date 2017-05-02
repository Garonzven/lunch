<?php

namespace App\Http\Controllers;
use App\Log;
use JWTAuth;

use Illuminate\Http\Request;

use Tymon\JWTAuth\Exceptions\JWTException;
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


     $dishes = Cycle_dish::select('id_dish', 'date_cycle')->where('id_cycle', $id)->orderBy('date_cycle')->get();
     $sum = 0;
     foreach($dishes as $key)
     {
        $fecha = $this->nameDate($key->date_cycle);
        $key = array_add($key, 'day', $fecha);
        $var = Order::where('id_dish', $key->id_dish)->where('date_order', $key->date_cycle)->count();
        $sum = $sum + $var;
        $key = array_add($key, 'count', $var);
        $dish = Dish::select('title')->where('id', $key->id_dish)->get();
        foreach($dish as $val)
        {
          $key = array_add($key, 'title', $val->title); 
        }     
        
     }
     //dd($sum);

     $pdf = PDF::loadView('reports.report', $dishes);
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
