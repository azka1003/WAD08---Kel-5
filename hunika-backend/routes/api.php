<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\KostSearchController;
use Illuminate\Support\Facades\Route;

// Testing Route
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'REST API Hunika berhasil!',
    ]);
});

// Public Routes (Bisa diakses tanpa login)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/payments/{booking_id}', [PaymentController::class, 'uploadProof']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});

Route::get('/kost/search', [KostSearchController::class, 'search']);
Route::get('/kost/filter', [KostSearchController::class, 'filter']);

Route::get('/kost', [KostSearchController::class, 'indexArea']);