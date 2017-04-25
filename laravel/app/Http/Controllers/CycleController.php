<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CycleController extends Controller
{
   public function registerCycle(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $dish = Dish::create([
        'title' => $request->get('title'),
        'description' => $request->get('description'),
        'id_provider' => $request->get('id_provider'),
      ]);
    
      return response()->json(['message'=>'dish created', 'data'=> $dish],201);
    }
    public function searchDishList()
    {
        $dish = Dish::all();
        return response()->json(['data' => $dish, 'message' => 'Dish List'],200);
    }
    public function searchDish($id)//Puede estar que no creo
    {
        $dish = Dish::find($id);
        if(count($dish)>0)
        {
            return response()->json(['data' => $dish, 'message' => 'Dish find'],200);
        }
        return response()->json(['message' => 'Dish not find'],404);
    }
    public function updateDish(Request $request, $id)
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
    public function deleteDish($id)
    {
        $dish = Dish::find($id);
        $dish->delete();
        return response()->json(['message' => 'Dish delete'],200);
    }
    public function restoreDish($id)
    {
        $dish = Dish::withTrashed()->where('id', $id)->first();
        $dish->restore();
        return response()->json(['data' => $dish, 'message' => 'User restore'], 200);
    }
    public function searchDishTitle($title)
    {
            $dish = Dish::name($title)->get();
            if(count($dish)>0)
            {
                return response()->json(['data' => $dish, 'message' => 'Search for title'],200);
            }
            return response()->json(['message' => 'Search fail'],404);
    }
}
