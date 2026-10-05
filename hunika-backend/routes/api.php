<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\KostSearchController;

// Testing Route
Route::get('/test', function () {
    return response()->json([
        'status' => true,
        'message' => 'REST API Hunika berhasil!'
    ]);
});

// Fitur Kost & Filter
Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);
Route::post('/kost', [KostController::class, 'store']);
Route::put('/kost/{id}', [KostController::class, 'update']);
Route::delete('/kost/{id}', [KostController::class, 'destroy']);
Route::get('/kost/{id}/fasilitas', [KostController::class, 'facilities']);

<<<<<<< HEAD
// Fitur Review
Route::get('/kost/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/kost/{id}/reviews', [ReviewController::class, 'store']);
Route::put('/reviews/{id}', [ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
=======
// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/payments/{booking_id}', [PaymentController::class, 'uploadProof']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});

Route::get('/kost/search', [KostSearchController::class, 'search']);
Route::get('/kost/filter', [KostSearchController::class, 'filter']);

Route::get('/kost', [KostSearchController::class, 'indexArea']);

Route::post('/payments', [PaymentController::class, 'store']);
Route::get('/payments/{id}', [PaymentController::class, 'show']);
Route::put('/payments/{id}', [PaymentController::class, 'updateStatus']);
Route::post('/payments/{id}/proof', [PaymentController::class, 'uploadProof']);
>>>>>>> 2d1eedadb7b3ace18793fc2496797f88a308b010
