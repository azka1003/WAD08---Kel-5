<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KostSearchController extends Controller
{
    //   GET /api/kost/search?keyword={keyword}
    // Mencari kost berdasarkan nama atau lokasi (area/address)
    
    public function search(Request $request)
    {
        $keyword = $request->input('keyword');

        if (!$keyword) {
            return response()->json(['message' => 'Parameter keyword diperlukan'], 400);
        }

        // Mencari di kolom name, area, dan address yang ada di tabel kosts
        $query = "SELECT * FROM kosts WHERE name LIKE ? OR area LIKE ? OR address LIKE ?";
        $bindings = ["%{$keyword}%", "%{$keyword}%", "%{$keyword}%"];

        $kosts = DB::select($query, $bindings);

        return response()->json([
            'status' => 'success',
            'data' => $kosts
        ]);
    }

     // GET /api/kost/filter
     // Memfilter kost berdasarkan harga, tipe, fasilitas, atau rating
    public function filter(Request $request)
    {
        // Membangun Raw SQL secara dinamis
        $sql = "SELECT DISTINCT k.* FROM kosts k ";
        $bindings = [];
        $whereClauses = [];

        // Filter berdasarkan Fasilitas (Membutuhkan JOIN ke tabel pivot)
        if ($request->has('fasilitas')) {
            $sql .= "JOIN kost_facilities kf ON k.id = kf.kost_id ";
            $sql .= "JOIN facilities f ON kf.facility_id = f.id ";
            $whereClauses[] = "f.name = ?";
            $bindings[] = $request->input('fasilitas');
        }

        // Filter Harga (Minimum dan Maksimum)
        if ($request->has('min_price')) {
            $whereClauses[] = "k.price >= ?";
            $bindings[] = $request->input('min_price');
        }
        if ($request->has('max_price')) {
            $whereClauses[] = "k.price <= ?";
            $bindings[] = $request->input('max_price');
        }

        // Filter Tipe Kost (contoh: Putra, Putri, Campur)
        if ($request->has('type')) {
            $whereClauses[] = "k.type = ?";
            $bindings[] = $request->input('type');
        }

        // Filter Rating Kost
        if ($request->has('rating')) {
            $whereClauses[] = "k.rating >= ?";
            $bindings[] = $request->input('rating');
        }

        // Menyisipkan statement WHERE jika ada filter yang digunakan
        if (count($whereClauses) > 0) {
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        $kosts = DB::select($sql, $bindings);

        return response()->json([
            'status' => 'success',
            'data' => $kosts
        ]);
    }

    // GET /api/kost?area={area}&page={page}&limit={limit}
    // Mengambil kost berdasarkan area spesifik sekaligus menerapkan paginasi
    public function indexArea(Request $request)
    {
        try {
            // 1. Tangkap semua parameter yang mungkin dikirim frontend
            $area = $request->input('area');
            $page = (int) $request->input('page', 1);
            $limit = (int) $request->input('limit', 12); // Default 12 jika tidak dikirim
            $offset = ($page - 1) * $limit;

            // 2. Siapkan variabel untuk menampung hasil
            $kosts = [];
            $totalData = 0;

            // 3. Logika: Apakah user memfilter area, atau ingin melihat semua data?
            if ($area) {
                // JIKA ADA FILTER AREA:
                // Hitung total data di area tersebut saja
                $totalQuery = DB::select("SELECT COUNT(*) as total FROM kosts WHERE area = ?", [$area]);
                $totalData = $totalQuery[0]->total;

                // Ambil datanya beserta LIMIT & OFFSET
                $kosts = DB::select("SELECT * FROM kosts WHERE area = ? ORDER BY id ASC LIMIT ? OFFSET ?", [$area, $limit, $offset]);
            } else {
                // JIKA TIDAK ADA FILTER AREA (Tampilkan Semua):
                // Hitung total seluruh data di database
                $totalQuery = DB::select("SELECT COUNT(*) as total FROM kosts");
                $totalData = $totalQuery[0]->total;

                // Ambil datanya beserta LIMIT & OFFSET
                $kosts = DB::select("SELECT * FROM kosts ORDER BY id ASC LIMIT ? OFFSET ?", [$limit, $offset]);
            }

            // 4. Hitung total halaman
            $totalPages = ceil($totalData / $limit);

            // 5. Kembalikan response lengkap dengan meta paginasinya
            return response()->json([
                'status' => 'success',
                'data' => $kosts,
                'meta' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total_pages' => $totalPages,
                    'total_data' => $totalData,
                    'filtered_by_area' => $area ?: 'all' // Tambahan info kecil agar frontend tahu status filter
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}