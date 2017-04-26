<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CycleController extends Controller
{
   public function registerCycle(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $cycle = Cycle::create([
        'closing_date' => $request->get('closing_date'),
        'initial_date' => $request->get('initial_date'),
        'remark' => $request->get('remark'),
      ]);
    
      return response()->json(['message'=>'dish created', 'data'=> $dish],201);
    }
    public function searchCycleList()
    {
        $cycle = Cycle::all();
        dd($cycle):
        return response()->json(['data' => $cycle, 'message' => 'Dish List'],200);
    }
    public function updateCycle(Request $request, $id)
    {
        $dish = Dish::find($id)->get();

        if(!$dish){
          return response()->json(['message'=>'not found the dish'],404);
        }
         $vals =\DB::table('dish')->where('id', $id)->update(['title' =>$request->input('title'),
        'description' => $request->input('description'),
        'id_provider' => $request->input('id_provider'),
      ]);
        return response()->json(['data'=>$dish,'message'=>'dish has modificade'],200);
    }

}
