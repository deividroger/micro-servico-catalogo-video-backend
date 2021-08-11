<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['namespace'=>'Api'],function(){

    $exceptCreateAndEdit =[
        'except' => ['create','edit']
    ];

    Route::resource('categories', 'CategoryController',$exceptCreateAndEdit);
    Route::delete('categories', 'CategoryController@destroyCollection');

    Route::resource('genres', 'GenreController',$exceptCreateAndEdit);
    Route::delete('genres', 'genres@destroyCollection');

    Route::resource('cast_members', 'CastMemberController',$exceptCreateAndEdit);
    Route::delete('cast_members', 'cast_members@destroyCollection');

    Route::resource('videos', 'VideoController',$exceptCreateAndEdit);
    Route::delete('videos', 'videos@destroyCollection');
});