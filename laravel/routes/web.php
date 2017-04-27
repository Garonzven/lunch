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


Route::resource('cycle', 'CycleController');
#Route::post('register',['uses'=>'UserController@registerUser']);

Route::group(['prefix'=>'login', 'middleware'=>['cors']],function(){
	Route::post('signin','Auth\LoginController@authenticate');
  	Route::get('profile', 'Auth\LoginController@sendProfile');
	Route::group(['middleware' => ['jwt.auth', 'jwt.refresh']], function ()
        {
					Route::post('signout', 'Auth\LoginController@logout');
          #Route::post('getUserInfo', 'api\v2\UserController@getUserInfo');
        });
});
Route::put('recovery',['uses'=>'UserController@recoveryPassword']);
Route::group(['prefix'=>'user', 'middleware'=> ['jwt.auth', 'admin']],function(){
	Route::post('register',['uses'=>'UserController@registerUser']);
	Route::get('findlist',['uses'=>'UserController@searchUserlist']);
	#Route::get('find/{email}',['uses'=>'UserController@searchUser','middleware'=>'jwt.auth']);
	#Route::get('findname/{name}',['uses'=>'UserController@searchUserName','middleware'=>'jwt.auth']);
	Route::put('update',['uses'=>'UserController@updateUser','middleware'=>'jwt.auth']);
  	Route::put('change',['uses'=>'UserController@changePassword','middleware'=>'jwt.auth']);
	//Route::put('restore/{id}',['uses'=>'UserController@restoreUser','middleware'=>'jwt.auth']);
	Route::delete('delete',['uses'=>'UserController@deleteUser','middleware'=>'jwt.auth']);
});

Route::group(['prefix'=>'dish'],function(){
	Route::post('register',['uses'=>'DishController@registerDish']);
	Route::get('find',['uses'=>'DishController@searchDishList','middleware'=>'jwt.auth']);
	Route::get('find/{id}',['uses'=>'DishController@searchDish','middleware'=>'jwt.auth']);
	//Route::get('findname/{title}',['uses'=>'DishController@searchDishTitle','middleware'=>'jwt.auth']);
	Route::put('update/{id}',['uses'=>'DishController@updateDish','middleware'=>'jwt.auth']);
	//Route::put('restore/{id}',['uses'=>'DishController@restoreDish','middleware'=>'jwt.auth']);
	Route::delete('delete/{id}',['uses'=>'DishController@deleteDish','middleware'=>'jwt.auth']);
});

Route::group(['prefix'=>'cycle', 'middleware'=> ['jwt.auth', 'admin']],function(){
	Route::post('register',['uses'=>'CycleController@registerCycle']);
	Route::get('find',['uses'=>'CycleController@searchCycleList','middleware'=>'jwt.auth']);
	//Route::get('find/{id}',['uses'=>'CycleController@searchCycle','middleware'=>'jwt.auth']);
	//Route::get('findname/{title}',['uses'=>'CycleController@searchCyclyTitle','middleware'=>'jwt.auth']);
	Route::put('update',['uses'=>'CycleController@updateCycle','middleware'=>'jwt.auth']);
	//Route::put('restore/{id}',['uses'=>'CycleController@restoreDish','middleware'=>'jwt.auth']);
	Route::delete('delete/{id}',['uses'=>'CycleController@deleteCyle','middleware'=>'jwt.auth']);
});
