<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\Api\UserController;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'REST API Hunika berhasil!',
    ]);
});

Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);