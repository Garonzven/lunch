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
      $userToken = JWTAuth::parseToken()->ToUser();
      $cycle = Cycle::create([

        'initial_date' => $request->get('init'),
        'closing_date' => $request->get('close'),
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
      $dt = date('Y-m-d H:i:s');
    //  dd($dt);
      $cycle = Cycle::where('initial_date','>=',$dt)->where('closing_date','<=',$dt)->orWhere('initial_date', '<', $dt)->get();
      dd($cycle->toArray());
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
        $dt = date('Y-m-d H:i:s');
        $cycle = Cycle::where('initial_date','>=',$dt)->where('closing_date','<=',$dt)->orWhere('initial_date', '<', $dt);
        dd($cycle);

    }

}
