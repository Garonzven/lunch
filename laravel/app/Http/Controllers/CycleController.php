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
      return response()->json(['data'=> $cycle, 'message'=>'cycle created', 'code' => '201'],201);
    }
    public function searchCycleList()
    {
        $cycle = Cycle::all();
        return response()->json(['data' => $cycle, 'message' => 'Cycle List', 'code' => '200'],200);
    }
    public function searchCycle($id)//Puede estar que no creo
    {
        $cycle = Cycle::find($id);
        if(count($cycle)>0)
        {
            return response()->json(['data' => $dish, 'message' => 'Dish find', 'code' => '200'],200);
        }
        return response()->json(['message' => 'Dish not find', 'code' => '404'],404);

        dd($cycle);
        return response()->json(['data' => $cycle, 'message' => 'Dish List'],200);
    }
    public function updateCycle(Request $request, $id)
    {
        $cycle = Cycle::find($id)->get();

        if(!$cycle){
          return response()->json(['message'=>'not found the dish', 'code' => '404'],404);
        }
         $vals =\DB::table('dish')->where('id', $id)->update(['title' =>$request->input('title'),
        'description' => $request->input('description'),
        'id_provider' => $request->input('id_provider'),
      ]);
        return response()->json(['data'=>$dish,'message'=>'dish has modificade', 'code' => '200'],200);
    }

    public function deleteDish($id)
    {
        $dish = Dish::find($id);
        $dish->delete();
        return response()->json(['message' => 'Dish delete', 'code' => '200'],200);
    }
    public function restoreDish($id)
    {
        $dish = Dish::withTrashed()->where('id', $id)->first();
        $dish->restore();
        return response()->json(['data' => $dish, 'message' => 'User restore', 'code' => '200'], 200);
    }
    public function searchDishTitle($title)
    {
            $dish = Dish::name($title)->get();
            if(count($dish)>0)
            {
                return response()->json(['data' => $dish, 'message' => 'Search for title', 'code' => '200'],200);
            }
            return response()->json(['message' => 'Search fail', 'code' => '404'],404);
    }
}
