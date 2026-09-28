<?php
namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Kost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KostController extends Controller
{
    // GET /api/kost
    public function index(Request $request)
    {
        if ($request->hasAny(['keyword', 'area', 'type', 'tier'])) {
            $kosts = Kost::searchAndFilter(
                $request->query('keyword'),
                $request->query('area'),
                $request->query('type'),
                $request->query('tier')
            );
        } else {
            $kosts = Kost::getAll();
        }

        return response()->json([
            'status' => 'success',
            'data' => $kosts
        ], 200);
    }

    // GET /api/kost/{id}
    public function show($id)
    {
        $kost = Kost::findById($id);

        if (!$kost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $kost
        ], 200);
    }

    // POST /api/kost
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'address'     => 'required|string',
            'area'        => 'required|string|max:100',
            'type'        => 'required|in:kos,kontrakan',
            'tier'        => 'required|in:basic,standard,premium',
            'price'       => 'required|numeric|min:0',
            'rooms'       => 'required|integer|min:1',
            'years'       => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'img'         => 'nullable|string|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        Kost::create($request->all());

        return response()->json([
            'status'  => 'success',
            'message' => 'Kost berhasil ditambahkan'
        ], 201);
    }

    // PUT /api/kost/{id}
    public function update(Request $request, $id)
    {
        $kost = Kost::findById($id);

        if (!$kost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'address'     => 'required|string',
            'area'        => 'required|string|max:100',
            'type'        => 'required|in:kos,kontrakan',
            'tier'        => 'required|in:basic,standard,premium',
            'price'       => 'required|numeric|min:0',
            'rooms'       => 'required|integer|min:1',
            'years'       => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'img'         => 'nullable|string|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        Kost::update($id, $request->all());

        return response()->json([
            'status'  => 'success',
            'message' => 'Data kost berhasil diperbarui'
        ], 200);
    }

    // DELETE /api/kost/{id}
    public function destroy($id)
    {
        $kost = Kost::findById($id);

        if (!$kost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        Kost::delete($id);

        return response()->json([
            'status'  => 'success',
            'message' => 'Kost berhasil dihapus'
        ], 200);
    }

    // GET /api/kost/{id}/fasilitas
    public function facilities($id)
    {
        $facilities = Kost::getFacilities($id);

        return response()->json([
            'status' => 'success',
            'data'   => $facilities
        ], 200);
    }
}