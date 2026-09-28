<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

class Review
{
    public static function getByKostId($kostId)
    {
        return DB::select("
            SELECT r.*, u.name as user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.kost_id = ?
            ORDER BY r.created_at DESC
        ", [$kostId]);
    }

    public static function findById($id)
    {
        $result = DB::select("SELECT * FROM reviews WHERE id = ?", [$id]);
        return $result ? $result[0] : null;
    }

    public static function create(array $data)
    {
        $now = now();
        
        $inserted = DB::insert("
            INSERT INTO reviews (user_id, kost_id, rating, comment, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ", [
            $data['user_id'],
            $data['kost_id'],
            $data['rating'],
            $data['comment'] ?? null,
            $now,
            $now
        ]);

        if ($inserted) {
            self::updateKostRatingStats($data['kost_id']);
        }

        return $inserted;
    }

    public static function update($id, array $data)
    {
        $now = now();
        $review = self::findById($id);

        $updated = DB::update("
            UPDATE reviews 
            SET rating = ?, comment = ?, updated_at = ?
            WHERE id = ?
        ", [
            $data['rating'],
            $data['comment'] ?? null,
            $now,
            $id
        ]);

        if ($updated && $review) {
            self::updateKostRatingStats($review->kost_id);
        }

        return $updated;
    }

    public static function delete($id)
    {
        $review = self::findById($id);
        $deleted = DB::delete("DELETE FROM reviews WHERE id = ?", [$id]);

        if ($deleted && $review) {
            self::updateKostRatingStats($review->kost_id);
        }

        return $deleted;
    }

    private static function updateKostRatingStats($kostId)
    {
        DB::statement("
            UPDATE kosts 
            SET rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE kost_id = ?), 0),
                reviews = (SELECT COUNT(*) FROM reviews WHERE kost_id = ?)
            WHERE id = ?
        ", [$kostId, $kostId, $kostId]);
    }
}