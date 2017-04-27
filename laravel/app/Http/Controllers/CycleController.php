<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Dish;
use App\Cycle;
use App\Cycle_dish;
use JWTAuth;
use Mail;

class CycleController extends Controller
{
   public function registerCycle(Request $request)
    {
      $exist = updateCycle();
      if($exist){

      }
      $userToken = JWTAuth::parseToken()->ToUser();
      $cycle = Cycle::create([
        'closing_date' => $request->get('close'),
        'initial_date' => $request->get('init'),
      ]);

      $data = $request->get('data');


      foreach($data as $val)
      {
        foreach($val['id_dishes'] as $key)
        {
          $dish =  Cycle_Dish::create([
            'id_cycle' => $cycle->id,
            'id_dish' => $key,
            'date_cycle' => $val['date_cycle'],
          ]);
        }
      }
      return response()->json(['data'=> $cycle, 'message'=>'cycle created', 'code' => '201']);
    }
    public function searchCycleList()
    {
        $cycle = Cycle::all();
        return response()->json(['data' => $cycle, 'message' => 'Cycle List', 'code' => '200']);
    }
    public function searchCycle($id)//Puede estar que no creo
    {
        $cycle = Cycle::find($id);
        if(count($cycle)>0)
        {
            return response()->json(['data' => $dish, 'message' => 'Dish find', 'code' => '200']);
        }
        return response()->json(['message' => 'Dish not find', 'code' => '404']);

        dd($cycle);
        return response()->json(['data' => $cycle, 'message' => 'Dish List', 'code' => '200']);
    }
    public function updateCycle()
    {
        $cycle = Cycle::first();

        if(!$cycle)
        {
          return false;
        }

        return true;
    }

}
