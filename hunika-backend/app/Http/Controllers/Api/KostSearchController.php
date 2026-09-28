<?php

namespace App\Http\Controllers;

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

    //  GET /api/kost?area={area}
    // Mengambil kost berdasarkan area/lokasi spesifik
    public function indexArea(Request $request)
    {
        $area = $request->input('area');

        // Jika ada parameter area, jalankan filter area
        if ($area) {
            $query = "SELECT * FROM kosts WHERE area = ?";
            $kosts = DB::select($query, [$area]);

            return response()->json([
                'status' => 'success',
                'data' => $kosts
            ]);
        }

        // Jika tidak ada parameter area (sebagai fallback untuk mengambil semua data kost di Fitur A)
        $query = "SELECT * FROM kosts";
        $kosts = DB::select($query);

        return response()->json([
            'status' => 'success',
            'data' => $kosts
        ]);
    }
}