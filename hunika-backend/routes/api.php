<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'REST API Hunika berhasil!',
    ]);
});
//public routes 
Route::post('/login', [AuthController::class, 'login']);
Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);

//protected routes (need login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/payments/{booking_id}', [PaymentController::class, 'uploadProof']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});