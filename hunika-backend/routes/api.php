<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\Api\ReviewController;

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

// Fitur Review
Route::get('/kost/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/kost/{id}/reviews', [ReviewController::class, 'store']);
Route::put('/reviews/{id}', [ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);