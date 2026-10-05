<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

class Review
{
    // Ambil ulasan berdasarkan ID Kost (termasuk nama user)
    public static function getByKostId($kostId)
    {
        return DB::table('reviews')
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->where('reviews.kost_id', $kostId)
            ->select(
                'reviews.id',
                'reviews.kost_id',
                'reviews.user_id',
                'users.name as user_name',
                'reviews.rating',
                'reviews.comment',
                'reviews.created_at'
            )
            ->orderBy('reviews.created_at', 'desc')
            ->get();
    }

    // Ambil 1 ulasan berdasarkan ID
    public static function getById($id)
    {
        return DB::table('reviews')->where('id', $id)->first();
    }

    // Tambah Ulasan Baru
    public static function create(array $data)
    {
        $id = DB::table('reviews')->insertGetId([
            'kost_id'    => $data['kost_id'],
            'user_id'    => $data['user_id'],
            'rating'     => $data['rating'],
            'comment'    => $data['comment'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return static::getById($id);
    }

    // Hapus Ulasan
    public static function delete($id)
    {
        return DB::table('reviews')->where('id', $id)->delete();
    }
}