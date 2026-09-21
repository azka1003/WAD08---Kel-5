<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KostController;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'REST API Hunika berhasil!',
    ]);
});

Route::get('/kost', [KostController::class, 'index']);
Route::get('/kost/{id}', [KostController::class, 'show']);