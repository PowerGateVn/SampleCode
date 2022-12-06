<?php
Route::group(['namespace' => 'Infos\Users\Controllers', 'prefix' => 'user', 'middleware' => ['isLogin', 'cors']], function() {
    Route::resource('user', 'UserController');
    Route::get('/all', [
        'as' => 'all_user',
        'uses' => 'UserController@index'
    ]);
    Route::post('/edit/{id}', [
        'as' => 'all_user',
        'uses' => 'UserController@updateUserInfos'
    ]);
});