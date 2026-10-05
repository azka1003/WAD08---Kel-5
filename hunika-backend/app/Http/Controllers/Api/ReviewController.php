<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kost;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Mengambil semua ulasan untuk 1 kost
    public function index($kostId)
    {
        $kost = Kost::getById($kostId);

        if (!$kost) {
            return response()->json([
                'status'  => false,
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        $reviews = Review::getByKostId($kostId);

        return response()->json([
            'status'  => true,
            'message' => 'Berhasil mengambil ulasan kost',
            'data'    => $reviews
        ], 200);
    }

    // Menambah ulasan baru
    public function store(Request $request, $kostId)
    {
        $kost = Kost::getById($kostId);

        if (!$kost) {
            return response()->json([
                'status'  => false,
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $validated['kost_id'] = $kostId;

        $review = Review::create($validated);

        // Update rating rata-rata & total review di tabel kosts
        Kost::recalculateRating($kostId);

        return response()->json([
            'status'  => true,
            'message' => 'Ulasan berhasil ditambahkan',
            'data'    => $review
        ], 201);
    }

    // Menghapus ulasan
    public function destroy($id)
    {
        $review = Review::getById($id);

        if (!$review) {
            return response()->json([
                'status'  => false,
                'message' => 'Ulasan tidak ditemukan'
            ], 404);
        }

        Review::delete($id);

        // Update ulang rating rata-rata & total review di tabel kosts
        Kost::recalculateRating($review->kost_id);

        return response()->json([
            'status'  => true,
            'message' => 'Ulasan berhasil dihapus'
        ], 200);
    }
}