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

Route::resource('dish', 'DishController');
Route::resource('cycle', 'CycleController');
#Route::post('register',['uses'=>'UserController@registerUser']);
Route::group(['prefix'=>'login'],function(){
	Route::post('signin','Auth\LoginController@authenticate');
});

Route::group(['prefix'=>'user'],function(){
	Route::post('register',['uses'=>'UserController@registerUser']);
	Route::get('find',['uses'=>'UserController@searchUserlist','middleware'=>'jwt.auth']);
	Route::get('find/{id}',['uses'=>'UserController@searchUser','middleware'=>'jwt.auth']);
	Route::get('findname/{name}',['uses'=>'UserController@searchUserName','middleware'=>'jwt.auth']);
	Route::put('update',['uses'=>'UserController@updateUser','middleware'=>'jwt.auth']);
	Route::put('restore/{id}',['uses'=>'UserController@restoreUser','middleware'=>'jwt.auth']);
	Route::put('recovery',['uses'=>'UserController@recoveryPassword','middleware'=>'jwt.auth']);
	Route::delete('delete/{id}',['uses'=>'UserController@deleteUser','middleware'=>'jwt.auth']);
});

Route::group(['prefix' => 'api/v1'], function(){

	Route::get('user/searchId/{id}', 'UserController@searchId');
	Route::delete('user/delete/{id}', 'UserController@deleteUser');
	Route::put('user/update/{id}', 'UserController@updateUser');
	Route::post('user/create', 'UserController@createUser');
	Route::get('user/searchAll', 'UserController@searchAllUser');
	Route::put('user/restore/{id}', 'UserController@restoreUser');
	Route::get('user/searchName/{name}', 'UserController@searchName');

});
