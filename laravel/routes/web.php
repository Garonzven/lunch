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
});

Route::put('recovery',['uses'=>'UserController@recoveryPassword']);

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
	Route::put('update',['uses'=>'UserController@updateUser','middleware'=>'jwt.auth']);
  Route::put('change',['uses'=>'UserController@changePassword','middleware'=>'jwt.auth']);
	Route::delete('delete',['uses'=>'UserController@deleteUser','middleware'=>'jwt.auth']);
});

Route::group(['prefix'=>'dish','middleware'=>['cors', 'jwt.auth', 'admin']],function(){
	Route::post('register',['uses'=>'DishController@registerDish']);
	Route::get('find',['uses'=>'DishController@searchDishList','middleware'=>'jwt.auth']);
	Route::get('find/{id}',['uses'=>'DishController@searchDish','middleware'=>'jwt.auth']);
	Route::put('update/{id}',['uses'=>'DishController@updateDish','middleware'=>'jwt.auth']);
	Route::delete('delete/{id}',['uses'=>'DishController@deleteDish','middleware'=>'jwt.auth']);
});

Route::group(['prefix'=>'cycle', 'middleware'=> ['jwt.auth', 'admin','cors']],function(){
	Route::post('register',['uses'=>'CycleController@registerCycle']);
	Route::get('find',['uses'=>'CycleController@searchCycleList','middleware'=>'jwt.auth']);
	Route::put('update',['uses'=>'CycleController@updateCycle','middleware'=>'jwt.auth']);
	Route::delete('delete/{id}',['uses'=>'CycleController@deleteCyle','middleware'=>'jwt.auth']);
});
