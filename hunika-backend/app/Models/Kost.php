<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

class Kost
{
    // Ambil semua data kost
    public static function getAll($search = null)
    {
        $query = DB::table('kosts');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('area', 'ILIKE', "%{$search}%")
                  ->orWhere('address', 'ILIKE', "%{$search}%");
            });
        }

        return $query->orderBy('id', 'desc')->get();
    }

    // Ambil detail 1 kost berdasarkan ID
    public static function getById($id)
    {
        return DB::table('kosts')->where('id', $id)->first();
    }

    // Tambah Kost Baru
    public static function create(array $data)
    {
        $id = DB::table('kosts')->insertGetId([
            'name'        => $data['name'],
            'address'     => $data['address'],
            'area'        => $data['area'],
            'rating'      => 0,
            'reviews'     => 0,
            'price'       => $data['price'],
            'rooms'       => $data['rooms'] ?? 1,
            'years'       => $data['years'] ?? null,
            'description' => $data['description'] ?? null,
            'img'         => $data['img'] ?? null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return static::getById($id);
    }

    // Update Data Kost
    public static function update($id, array $data)
    {
        $data['updated_at'] = now();
        DB::table('kosts')->where('id', $id)->update($data);

        return static::getById($id);
    }

    // Hapus Kost
    public static function delete($id)
    {
        return DB::table('kosts')->where('id', $id)->delete();
    }

    // Hitung Ulang Rating & Jumlah Review
    public static function recalculateRating($kostId)
    {
        $stats = DB::table('reviews')
            ->where('kost_id', $kostId)
            ->selectRaw('COALESCE(AVG(rating), 0) as avg_rating, COUNT(id) as total_reviews')
            ->first();

        DB::table('kosts')
            ->where('id', $kostId)
            ->update([
                'rating'     => round($stats->avg_rating, 1),
                'reviews'    => $stats->total_reviews,
                'updated_at' => now(),
            ]);
    }
}