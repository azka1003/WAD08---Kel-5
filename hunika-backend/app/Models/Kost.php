<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

class Kost
{
    public static function getAll()
    {
        return DB::select("SELECT * FROM kosts ORDER BY created_at DESC");
    }

    public static function findById($id)
    {
        $result = DB::select("SELECT * FROM kosts WHERE id = ?", [$id]);
        return $result ? $result[0] : null;
    }

    public static function searchAndFilter($keyword = null, $area = null, $type = null, $tier = null)
    {
        $query = "SELECT * FROM kosts WHERE 1=1";
        $params = [];

        if (!empty($keyword)) {
            $query .= " AND (name ILIKE ? OR address ILIKE ?)";
            $params[] = "%{$keyword}%";
            $params[] = "%{$keyword}%";
        }

        if (!empty($area)) {
            $query .= " AND area ILIKE ?";
            $params[] = "%{$area}%";
        }

        if (!empty($type)) {
            $query .= " AND type = ?";
            $params[] = $type;
        }

        if (!empty($tier)) {
            $query .= " AND tier = ?";
            $params[] = $tier;
        }

        $query .= " ORDER BY created_at DESC";

        return DB::select($query, $params);
    }

    public static function create(array $data)
    {
        $now = now();
        return DB::insert("
            INSERT INTO kosts (name, address, area, type, tier, price, rooms, years, description, img, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ", [
            $data['name'],
            $data['address'],
            $data['area'],
            $data['type'],
            $data['tier'],
            $data['price'],
            $data['rooms'],
            $data['years'] ?? 0,
            $data['description'] ?? null,
            $data['img'] ?? null,
            $now,
            $now
        ]);
    }

    public static function update($id, array $data)
    {
        $now = now();
        return DB::update("
            UPDATE kosts 
            SET name = ?, address = ?, area = ?, type = ?, tier = ?, price = ?, rooms = ?, years = ?, description = ?, img = ?, updated_at = ?
            WHERE id = ?
        ", [
            $data['name'],
            $data['address'],
            $data['area'],
            $data['type'],
            $data['tier'],
            $data['price'],
            $data['rooms'],
            $data['years'] ?? 0,
            $data['description'] ?? null,
            $data['img'] ?? null,
            $now,
            $id
        ]);
    }

    public static function delete($id)
    {
        return DB::delete("DELETE FROM kosts WHERE id = ?", [$id]);
    }

    public static function getFacilities($kostId)
    {
        return DB::select("
            SELECT f.id, f.name 
            FROM facilities f
            JOIN kost_facilities kf ON f.id = kf.facility_id
            WHERE kf.kost_id = ?
        ", [$kostId]);
    }
}