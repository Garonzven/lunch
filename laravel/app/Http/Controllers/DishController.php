<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Dish;
use App\Log;
use JWTAuth;
use Mail;
class DishController extends Controller
{

    public function idUser()
    {
      $users = JWTAuth::parseToken()->authenticate();
      return $users->id;
    }

   public function registerDish(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();

      $dish = Dish::create([
        'title' => $request->get('title'),
        'description' => $request->get('description'),
        'id_provider' => $request->get('id_provider'),
      ]);

      $logs = Log::create([
        'id_user' => $this->idUser(),
        'action' => 'Create new dish',
        'table' => 'dishes',
        'fields' => 'title, descrption, id_provider',
        'value' => ''.$request->get('title').', '.$request->get('description').', '.$request->get('id_provider'),
      ]);

      return response()->json(['data'=> $dish, 'message'=>'Dish has been Created', 'code'=>'201']);
    }
    public function searchDishList()
    {
        $dish = Dish::all();
        return response()->json(['data' => $dish, 'message' => 'Dish list', 'code'=>'200']);
    }
    public function searchDish($id)//Puede estar que no creo
    {
        $dish = Dish::find($id);

        if(count($dish)>0)
        {
            return response()->json(['data' => $dish, 'message' => 'Dish find', 'code'=>'200']);
        }
        return response()->json(['message' => 'Dish not find', 'code'=>'404']);
    }
    public function updateDish(Request $request, $id)
    {
        $dish = Dish::where('id', $id)->update([
            'title' =>$request->get('title'),
            'description' => $request->get('description'),
        ]);

        $logs = Log::create([
          'id_user' => $this->idUser(),
          'action' => 'Update dish',
          'table' => 'dishes',
          'fields' => 'title, descrption',
          'value' => ''.$request->get('title').', '.$request->get('description'),
        ]);

        return response()->json(['data'=>$dish,'message'=>'Dish has been Updated', 'code'=>'200']);
    }
    public function deleteDish($id)
    {
        $dish = Dish::find($id);
        $dish->delete();

        $logs = Log::create([
          'id_user' => $this->idUser(),
          'action' => 'Delete dish',
          'table' => 'dishes',
          'fields' => 'All',
          'value' => 'All',
        ]);
        return response()->json(['message' => 'Dish has been Delete', 'code'=>'200']);
    }
}
