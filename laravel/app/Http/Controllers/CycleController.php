<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Dish;
use App\Cycle;
use App\User;
use App\Log;
use App\Order;
use App\Cycle_dish;
use JWTAuth;
use Mail;

class CycleController extends Controller
{
    public function idUser()
    {
      $users = JWTAuth::parseToken()->authenticate();
      return $users->id;
    }

   public function registerCycle(Request $request)
    {
      $userToken = JWTAuth::parseToken()->ToUser();
      $cycle = Cycle::create([

        'initial_date' => $request->get('init'),
        'closing_date' => $request->get('close'),
        'limit_date' => $request->get('limit'),
      ]);
      $value = ''.$cycle->initial_date.', '.$cycle->closing_date.', '.$cycle->limit_date.'';
      $field = 'initial_date, closing_date, limit_date';
      $logs = Log::create([
        'id_user' => $this->idUser(),
        'action' => 'Create new cycle',
        'table' => 'cycles',
        'fields' => $field,
        'value' => $value,
      ]);

      $data = $request->get('data');
      $value = '';
      foreach($data as $val)
      {
        foreach($val['id_dishes'] as $key)
        {
          $dish =  Cycle_Dish::create([
            'id_cycle' => $cycle->id,
            'id_dish' => $key,
            'date_cycle' => $val['date_cycle'],
          ]);
          $data = '['.$cycle->id.', '.$key.', '.$val['date_cycle'].'], ';
          $value = ''.$value.''.$data.'';
        }
      }

      $logs = Log::create([
        'id_user' => $this->idUser(),
        'action' => 'Assign dishes to the cycle',
        'table' => 'cycle_dishes',
        'fields' => 'id_cycle, id_dish, date_cycle',
        'value' => $value,
      ]);

      $listUser = User::select('email')->get();
        $array = [];
        foreach($listUser as $key)
        {
           $array = array_prepend($array, $key->email);
        }

          Mail::send('mails.welcome', ['data' => $data], function($message) use($array){
            $message->to($array)->subject('New Menu');
        });
      return response()->json(['data'=> $cycle, 'message'=>'cycle created', 'code' => '201']);
    }
    public function searchCycleList()
    {
      $dt = date('Y-m-d H:i:s');
      //$dt = '2017-05-14 00:00:00';

      $cycle = Cycle::where('initial_date','>',$dt)
      ->where('closing_date','<',$dt)
      ->orWhere('initial_date', '=', $dt)
      ->orWhere('closing_date', '=', $dt)
      ->orWhere('initial_date', '>', $dt)
      ->where('closing_date','>',$dt)
      ->limit(1)
      ->get();

      if(count($cycle)==0)
      {
        return response()->json([ 'message' => 'Not exist cycle active', 'code' => '404']);
      }

      $val = new Cycle();

      foreach($cycle as $key)
      {
        $val->id = $key->id;
        $val->initial_date = $key->initial_date;
        $val->closing_date = $key->closing_date;
      }

      $anterior = Cycle::select('id', 'initial_date', 'closing_date', 'limit_date')
      ->where('id', '<=', $val->id)
      ->limit(3)
      ->orderBy('id', 'DESC')
      ->get();

      foreach ($anterior as $key){

        if($val->id == $key->id){
         $key->active =  1;
        }
        else{
         $key->active =  0;
        }
      }

      $posterior = Cycle::select('id', 'initial_date', 'closing_date', 'limit_date')
      ->where('id', '>', $val->id)
      ->limit(2)
      ->get();

      foreach ($posterior as $key) {
         $key->active =  2;
      }

      $union = $posterior->merge($anterior);

      $union = $union->sortBy(function($col)
        {
            return $col;
        })->values()->all();

      foreach($union as $key)
      {
            $val = \DB::table('dishes')
            ->join('cycle_dishes','dishes.id','=','cycle_dishes.id_dish')
            ->select('cycle_dishes.id_dish','cycle_dishes.id_cycle', 'cycle_dishes.date_cycle','dishes.title','dishes.description')
            ->where('cycle_dishes.id_cycle', '=', $key->id)
            ->orderBy('cycle_dishes.date_cycle')
            ->get();

            $key = array_add($key, 'dishes', $val);
      }
        return response()->json(['data' => $union, 'message' => 'Cycle List', 'code' => '200']);
    }

    public function searchCycleActive()
    {
      $dt = date('Y-m-d H:i:s');


      $cycle = Cycle::where('initial_date','>',$dt)
      ->where('closing_date','<',$dt)
      ->orWhere('initial_date', '=', $dt)
      ->orWhere('closing_date', '=', $dt)
      ->orWhere('initial_date', '>', $dt)
      ->where('closing_date','>',$dt)
      ->limit(1)
      ->get();

      if(count($cycle)==0)
      {
        return response()->json([ 'message' => 'Not exist cycle active', 'code' => '404']);
      }

      $valores = new Cycle();

      foreach($cycle as $key)
      {
        $valores->id = $key->id;
        $valores->initial_date = $key->initial_date;
        $valores->closing_date = $key->closing_date;
      }

    $active = \DB::table('dishes')
            ->join('cycle_dishes','dishes.id','=','cycle_dishes.id_dish')
            ->select('cycle_dishes.id_dish','cycle_dishes.id_cycle', 'cycle_dishes.date_cycle','dishes.title','dishes.description')
            ->where('cycle_dishes.id_cycle', '=', $valores->id)
            ->orderBy('cycle_dishes.date_cycle')
            ->get();

            $valores = array_add($valores, 'dishes', $active);

        return response()->json(['data' => $valores, 'message' => 'Cycle List', 'code' => '200']);
    }
    public function updateCycle(Request $request)//falta las notificaciones
    {
        $dt = date('Y-m-d H:i:s');

        $id = $request->get('id');
        $cycle = Cycle::where('initial_date','>',$dt)
        ->where('closing_date','<',$dt)
        ->orWhere('initial_date', '=', $dt)
        ->orWhere('closing_date', '=', $dt)
        ->orWhere('initial_date', '>', $dt)
        ->where('closing_date','>',$dt)
        ->limit(1)
        ->get();

        //dd($cycle);

        if(count($cycle)==0)
        {
            return response()->json([ 'message' => 'Not exist cycle active', 'code' => '404']);
        }

        $valores = new Cycle();
        foreach($cycle as $key)
        {
            $valores->id = $key->id;
            $valores->initial_date = $key->initial_date;
            $valores->closing_date = $key->closing_date;
        }

        if($valores->id < $id)
        {
            return response()->json([ 'message' => 'You can not change an inactive cycle', 'code' => '404']);
        }

        $deleteDish = Cycle_dish::where('id_cycle', $id)->orderBy('date_cycle')->get();

        //dd($deleteDish);
        $collection = collect([]);
        foreach($deleteDish as $key)
        {
            if(!$collection->contains($key->date_cycle))
            {
                $collection->push($key->date_cycle);
                $collection->all();
            }

            $var = Cycle_dish::find($key->id);
            $var->delete();
        }
        foreach($collection as $key)
        {

            $orders = Order::where('date_order', '=', $key)->update([
              'id_dish' => 1,
            ]);
        }

        $data = $request->get('data');

        foreach($data as $val)
        {
          foreach($val['id_dishes'] as $key)
          {
            $dish =  Cycle_Dish::create([
              'id_cycle' => $id,
              'id_dish' => $key,
              'date_cycle' => $val['date_cycle'],
            ]);
          }
        }

        $listUser = User::select('email')->get();
        $array = [];
        foreach($listUser as $key)
        {
           $array = array_prepend($array, $key->email);
        }

          Mail::send('mails.newlunch', ['primero' => $collection->first()], function($message) use($array){
            $message->to($array)->subject('New Menu');
        });



        return response()->json(['message' => 'Update cycle', 'code' => '200']);
    }

}
