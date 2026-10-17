<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KostController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\KostSearchController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;

// Testing Route
Route::get('/test', function () {
    return response()->json([
        'status' => true,
        'message' => 'REST API Hunika berhasil!'
    ]);
});

// Fitur Kost
Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);
Route::post('/kost', [KostController::class, 'store']);
Route::put('/kost/{id}', [KostController::class, 'update']);
Route::delete('/kost/{id}', [KostController::class, 'destroy']);
Route::get('/kost/{id}/fasilitas', [KostController::class, 'facilities']);

// Fitur Review
Route::get('/kost/{kost_id}/reviews', [ReviewController::class, 'index']);

// Fitur Pencarian Kost & Filter
Route::get('/kost/search', [KostSearchController::class, 'search']);
Route::get('/kost/filter', [KostSearchController::class, 'filter']);
Route::get('/kost', [KostSearchController::class, 'indexArea']);

// Untuk Register dan Login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected Routes
Route::middleware(['jwt'])->group(function () {
    Route::post('/kost/{kost_id}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']); // <-- Rute Hapus Review
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::post('/payments/{id}/proof', [PaymentController::class, 'uploadProof']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});


// --- API TERTUTUP (Wajib Token & Wajib Admin) ---
Route::middleware(['jwt', 'admin'])->group(function () {
    Route::post('/kost', [KostController::class, 'store']);    // Tambah kost
    Route::put('/kost/{id}', [KostController::class, 'update']); // Ubah kost
    Route::delete('/kost/{id}', [KostController::class, 'destroy']); // Hapus kost
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);
    Route::put('/payments/{id}', [PaymentController::class, 'updateStatus']);
});
