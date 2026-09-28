<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kost;

class KostController extends Controller
{
    public function index()
    {
        $kosts = Kost::all();

        return response()->json([
            'success' => true,
            'data' => $kosts
        ]);
    }

    public function show(string $id)
    {
        $kost = Kost::find($id);

        if (!$kost) {
            return response()->json([
                'success' => false,
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $kost
        ]);
    }
}