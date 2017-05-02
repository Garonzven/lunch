<?php

namespace App\Http\Controllers;
use App\Log;
use JWTAuth;

use Illuminate\Http\Request;

class ReportController extends Controller
{
  public function idUser()
  {
    $users = JWTAuth::parseToken()->authenticate();
    return $users->id;
  }
  public function generateReportCycle(Request $request)
   {
     $userToken = JWTAuth::parseToken()->ToUser();

     $logs = Log::create([
       'id_user' => $this->idUser(),
       'action' => 'Create new orders',
       'table' => 'cycles',
       'fields' => 'id_user, id_dish, date_order',
       'value' => $value,
     ]);

     return response()->json(['data'=> $collection, 'message'=>'order created', 'code' => '201']);
   }
}
