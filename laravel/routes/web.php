<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return view('welcome');
});

Route::get('date', function(){
  $dt = date('Y-m-d');
  return response()->json(['date' => $dt, 'code' => '200']);
})->middleware('cors');

Route::put('recovery',['uses'=>'UserController@recoveryPassword'])->middleware('cors');

Route::group(['prefix'=>'login', 'middleware'=>'cors'],function(){
	Route::post('signin','Auth\LoginController@authenticate');
  	Route::get('profile', 'Auth\LoginController@sendProfile');
	Route::group(['middleware' => ['jwt.auth', 'jwt.refresh']], function ()
        {
			Route::post('signout', 'Auth\LoginController@logout');
        });
});
Route::group(['prefix'=>'user', 'middleware'=> ['jwt.auth', 'admin','cors']],function(){
	Route::post('register',['uses'=>'UserController@registerUser']);
	Route::get('findlist',['uses'=>'UserController@searchUserlist']);
	Route::put('update',['uses'=>'UserController@updateUser']);
  	Route::put('change',['uses'=>'UserController@changePassword']);
	Route::delete('delete',['uses'=>'UserController@deleteUser']);
});

Route::group(['prefix'=>'dish','middleware'=>['cors', 'jwt.auth', 'admin']],function(){
	Route::post('register',['uses'=>'DishController@registerDish']);
	Route::get('find',['uses'=>'DishController@searchDishList']);
	Route::get('find/{id}',['uses'=>'DishController@searchDish']);
	Route::put('update/{id}',['uses'=>'DishController@updateDish']);
	Route::delete('delete/{id}',['uses'=>'DishController@deleteDish']);
});

Route::group(['prefix'=>'cycle', 'middleware'=> ['jwt.auth', 'admin','cors']],function(){
	Route::post('register',['uses'=>'CycleController@registerCycle']);
	Route::get('find',['uses'=>'CycleController@searchCycleList']);
  	Route::get('active',['uses'=>'CycleController@searchCycleActive']);
	Route::put('update',['uses'=>'CycleController@updateCycle']);
});

Route::group(['prefix'=>'order', 'middleware'=> ['jwt.auth', 'user', 'cors']],function(){
	Route::post('register',['uses'=>'OrderController@registerOrder']);
  	Route::get('active',['uses'=>'OrderController@searchCycleActive']);
});

Route::put('reportCycle',['uses'=>'ReportController@generateReportCycle','middleware'=> ['jwt.auth', 'watcher', 'cors']]);

Route::get('reportLog',['uses'=>'ReportController@generateReportLog', 'middleware'=> ['jwt.auth', 'admin', 'cors']]);

Route::get('cyclelist',['uses'=>'ReportController@listCycle', 'middleware'=> ['jwt.auth', 'watcher', 'cors']]);