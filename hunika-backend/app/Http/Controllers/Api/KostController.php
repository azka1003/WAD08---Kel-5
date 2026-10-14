<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KostController extends Controller
{
    // 1. Tampilkan semua Kost
    public function index()
    {
        // SELECT * otomatis akan mengambil kolom facilities juga
        $kosts = DB::select('SELECT * FROM kosts ORDER BY id ASC');
        return response()->json(['data' => $kosts], 200);
    }

    // 2. Tampilkan detail satu Kost
    public function show($id)
    {
        $kost = DB::select('SELECT * FROM kosts WHERE id = ?', [$id]);
        
        if (empty($kost)) {
            return response()->json(['message' => 'Kost tidak ditemukan'], 404);
        }

        return response()->json(['data' => $kost[0]], 200);
    }

    // 3. Tambah Kost Baru (Hanya untuk Admin/Pengelola nantinya)
    public function store(Request $request)
    {
        // 1. Cari ID kost terakhir di database
        $lastKost = \Illuminate\Support\Facades\DB::select("SELECT id FROM kosts ORDER BY id DESC LIMIT 1");

        if (empty($lastKost)) {
        // Jika belum ada data sama sekali di database
        $id = 'KST-001';
        } else {
        // 2. Ambil ID terakhir, misalnya "KST-005"
        $lastId = $lastKost[0]->id;
    
        // 3. Potong 4 karakter pertama ("KST-") lalu jadikan tipe data integer (hasilnya angka 5)
        $lastNumber = (int) substr($lastId, 4); 
    
        // 4. Tambah 1, lalu format ulang agar selalu punya angka 0 di depan jika kurang dari 3 digit
        $newNumber = $lastNumber + 1;
        $id = 'KST-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
        }

        $now = now();

        // Antisipasi jika frontend mengirim fasilitas dalam bentuk Array (contoh: ["AC", "WiFi"])
        // Kita ubah menjadi JSON string agar bisa disimpan di kolom text database
        $facilities = $request->input('facilities');
        if (is_array($facilities)) {
            $facilities = json_encode($facilities);
        }

        try {
            // Perhatikan: owner_id SUDAH DIHAPUS dari query ini
            DB::insert('INSERT INTO kosts (id, name, address, area, rating, reviews, price, rooms, years, description, img, facilities, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                $id,
                $request->input('name'),
                $request->input('address'),
                $request->input('area'),
                0, // rating awal
                0, // jumlah review awal
                $request->input('price'),
                $request->input('rooms'),
                $request->input('years'),
                $request->input('description'),
                $request->input('img'),
                $facilities, // <--- Data fasilitas ditambahkan
                $now,
                $now
            ]);

            return response()->json([
                'message' => 'Data kost berhasil ditambahkan', 
                'id' => $id
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menambah data', 'error' => $e->getMessage()], 500);
        }
    }

    // 4. Ubah Data Kost
    public function update(Request $request, $id)
    {
        // Cek apakah kost ada
        $cekKost = DB::select('SELECT id FROM kosts WHERE id = ?', [$id]);
        if (empty($cekKost)) {
            return response()->json(['message' => 'Kost tidak ditemukan'], 404);
        }

        $facilities = $request->input('facilities');
        if (is_array($facilities)) {
            $facilities = json_encode($facilities);
        }

        $now = now();

        try {
            DB::update('UPDATE kosts SET name = ?, address = ?, area = ?, rating = ?, reviews = ?, price = ?, years = ?, description = ?, img = ?, facilities = ?, updated_at = ? WHERE id = ?', [
                $request->input('name'),
                $request->input('address'),
                $request->input('area'),
                $request->input('price'),
                $request->input('years'),
                $request->input('description'),
                $request->input('img'),
                $facilities, // <--- Data fasilitas diupdate
                $now,
                $id // Parameter WHERE id = ?
            ]);

            return response()->json(['message' => 'Data kost berhasil diubah'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengubah data', 'error' => $e->getMessage()], 500);
        }
    }

    // 5. Hapus Kost
    public function destroy($id)
    {
        $deleted = DB::delete('DELETE FROM kosts WHERE id = ?', [$id]);
        
        if ($deleted === 0) {
            return response()->json(['message' => 'Kost tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Data kost berhasil dihapus'], 200);
    }
}