<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    // 1. Mengambil semua ulasan untuk 1 kost
    public function index($kostId)
    {
        $kost = DB::select('SELECT id FROM kosts WHERE id = ?', [$kostId]);

        if (empty($kost)) {
            return response()->json([
                'status'  => false,
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        // Ambil review beserta nama user yang mereview
        $reviews = DB::select('
            SELECT r.*, u.name as reviewer_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.kost_id = ? 
            ORDER BY r.created_at DESC
        ', [$kostId]);

        return response()->json([
            'status'  => true,
            'message' => 'Berhasil mengambil ulasan kost',
            'data'    => $reviews
        ], 200);
    }

    // 2. Menambah ulasan baru
    public function store(Request $request, $kostId)
    {
        $kost = DB::select('SELECT id FROM kosts WHERE id = ?', [$kostId]);

        if (empty($kost)) {
            return response()->json([
                'status'  => false,
                'message' => 'Kost tidak ditemukan'
            ], 404);
        }

        // Validasi Manual
        $rating = $request->input('rating');
        if (!$rating || $rating < 1 || $rating > 5) {
            return response()->json([
                'status'  => false,
                'message' => 'Rating wajib diisi angka antara 1 sampai 5'
            ], 400);
        }

        // Ambil user_id dengan aman dari Token JWT, BUKAN dari inputan Postman
        $userId = $request->auth->sub; 
        
        // Generate ID Review Manual berurutan (REV-001, dst)
        $lastReview = DB::select("SELECT id FROM reviews ORDER BY id DESC LIMIT 1");
        if (empty($lastReview)) {
            $id = 'REV-001';
        } else {
            $lastId = $lastReview[0]->id;
            $lastNumber = (int) substr($lastId, 4);
            $id = 'REV-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        }

        $now = now();
        $comment = $request->input('comment', '');

        try {
            // Insert Review
            DB::insert('INSERT INTO reviews (id, kost_id, user_id, rating, comment, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                $id, $kostId, $userId, $rating, $comment, $now, $now
            ]);

            // Update rating rata-rata & total review di tabel kosts
            // COALESCE digunakan agar jika tidak ada review, rating kembali ke 0 (bukan null)
            DB::update('UPDATE kosts SET 
                reviews = (SELECT COUNT(*) FROM reviews WHERE kost_id = ?),
                rating = (SELECT COALESCE(ROUND(AVG(rating), 1), 0) FROM reviews WHERE kost_id = ?)
                WHERE id = ?', [$kostId, $kostId, $kostId]);

            // Ambil data yang baru saja diinsert untuk dikembalikan ke respons
            $newReview = DB::select('SELECT * FROM reviews WHERE id = ?', [$id])[0];

            return response()->json([
                'status'  => true,
                'message' => 'Ulasan berhasil ditambahkan',
                'data'    => $newReview
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menambah ulasan',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // 3. Menghapus ulasan
    public function destroy(Request $request, $id)
    {
        $review = DB::select('SELECT * FROM reviews WHERE id = ?', [$id]);

        if (empty($review)) {
            return response()->json([
                'status'  => false,
                'message' => 'Ulasan tidak ditemukan'
            ], 404);
        }

        $reviewData = $review[0];

        // KEAMANAN TAMBAHAN: Cek apakah user yang mau menghapus adalah pemilik ulasan ATAU Admin
        if ($reviewData->user_id !== $request->auth->sub && $request->auth->is_admin !== true) {
            return response()->json([
                'status'  => false,
                'message' => 'Akses ditolak. Anda hanya bisa menghapus ulasan milik Anda sendiri.'
            ], 403);
        }

        try {
            // Hapus Ulasan
            DB::delete('DELETE FROM reviews WHERE id = ?', [$id]);

            // Update ulang rating rata-rata & total review di tabel kosts
            DB::update('UPDATE kosts SET 
                reviews = (SELECT COUNT(*) FROM reviews WHERE kost_id = ?),
                rating = (SELECT COALESCE(ROUND(AVG(rating), 1), 0) FROM reviews WHERE kost_id = ?)
                WHERE id = ?', [$reviewData->kost_id, $reviewData->kost_id, $reviewData->kost_id]);

            return response()->json([
                'status'  => true,
                'message' => 'Ulasan berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menghapus ulasan',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}