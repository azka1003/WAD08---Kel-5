<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kost;
use Illuminate\Http\Request;

class KostController extends Controller
{
    public function index(Request $request)
    {
        $kosts = Kost::getAll($request->query('search'));

        return response()->json([
            'status'  => true,
            'message' => 'Berhasil mengambil daftar kost',
            'data'    => $kosts
        ], 200);
    }

    public function show($id)
    {
        $kost = Kost::getById($id);

        if (!$kost) {
            return response()->json([
                'status'  => false,
                'message' => 'Data kost tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Berhasil mengambil detail kost',
            'data'    => $kost
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'address'     => 'required|string',
            'area'        => 'required|string|max:255',
            'price'       => 'required|numeric',
            'rooms'       => 'nullable|integer',
            'years'       => 'nullable|integer',
            'description' => 'nullable|string',
            'img'         => 'nullable|string',
        ]);

        $kost = Kost::create($validated);

        return response()->json([
            'status'  => true,
            'message' => 'Kost berhasil ditambahkan',
            'data'    => $kost
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kostExists = Kost::getById($id);
        if (!$kostExists) {
            return response()->json(['status' => false, 'message' => 'Kost tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'address'     => 'sometimes|string',
            'area'        => 'sometimes|string',
            'price'       => 'sometimes|numeric',
            'rooms'       => 'nullable|integer',
            'years'       => 'nullable|integer',
            'description' => 'nullable|string',
            'img'         => 'nullable|string',
        ]);

        $updatedKost = Kost::update($id, $validated);

        return response()->json([
            'status'  => true,
            'message' => 'Data kost berhasil diperbarui',
            'data'    => $updatedKost
        ], 200);
    }

    public function destroy($id)
    {
        $deleted = Kost::delete($id);

        if (!$deleted) {
            return response()->json(['status' => false, 'message' => 'Kost gagal dihapus/tidak ditemukan'], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Kost berhasil dihapus'
        ], 200);
    }
}