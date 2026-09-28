<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kost;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // GET /api/kost/{id}/reviews
    public function index($kostId)
    {
        $kost = Kost::findById($kostId);

        if (!$kost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        $reviews = Review::getByKostId($kostId);

        return response()->json([
            'status' => 'success',
            'data'   => $reviews
        ], 200);
    }

    // POST /api/kost/{id}/reviews
    public function store(Request $request, $kostId)
    {
        $kost = Kost::findById($kostId);

        if (!$kost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['kost_id'] = $kostId;

        Review::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Review berhasil ditambahkan'
        ], 201);
    }

    // PUT /api/reviews/{id}
    public function update(Request $request, $id)
    {
        $review = Review::findById($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        Review::update($id, $request->all());

        return response()->json([
            'status'  => 'success',
            'message' => 'Review berhasil diperbarui'
        ], 200);
    }

    // DELETE /api/reviews/{id}
    public function destroy($id)
    {
        $review = Review::findById($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review tidak ditemukan'
            ], 404);
        }

        Review::delete($id);

        return response()->json([
            'status'  => 'success',
            'message' => 'Review berhasil dihapus'
        ], 200);
    }
}