<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KostController extends Controller
{
  public function index(Request $request)
    {
        $perPage = 12;
        $page = max(1, intval($request->input('page', 1)));
        $offset = ($page - 1) * $perPage;

        // Pastikan menghitung total data secara presisi
        $totalResult = DB::select("SELECT COUNT(*) as total FROM kosts");
        $total = isset($totalResult[0]) ? (int)$totalResult[0]->total : 0;

        // Ambil data sesuai halaman
        $kosts = DB::select("SELECT * FROM kosts ORDER BY created_at DESC LIMIT ? OFFSET ?", [$perPage, $offset]);

        // Hitung total halaman secara akurat
        $lastPage = $total > 0 ? ceil($total / $perPage) : 1;

        return response()->json([
            'status' => 'success',
            'data' => $kosts,
            'current_page' => $page,
            'last_page' => (int)$lastPage,
            'total' => $total
        ], 200);
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
    // public function store(Request $request)
    // {
    //     // 1. Cari ID kost terakhir di database
    //     $lastKost = \Illuminate\Support\Facades\DB::select("SELECT id FROM kosts ORDER BY id DESC LIMIT 1");

    //     if (empty($lastKost)) {
    //     // Jika belum ada data sama sekali di database
    //     $id = 'KST-001';
    //     } else {
    //     // 2. Ambil ID terakhir, misalnya "KST-005"
    //     $lastId = $lastKost[0]->id;
    
    //     // 3. Potong 4 karakter pertama ("KST-") lalu jadikan tipe data integer (hasilnya angka 5)
    //     $lastNumber = (int) substr($lastId, 4); 
    
    //     // 4. Tambah 1, lalu format ulang agar selalu punya angka 0 di depan jika kurang dari 3 digit
    //     $newNumber = $lastNumber + 1;
    //     $id = 'KST-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    //     }

    //     $now = now();

    //     // Antisipasi jika frontend mengirim fasilitas dalam bentuk Array (contoh: ["AC", "WiFi"])
    //     // Kita ubah menjadi JSON string agar bisa disimpan di kolom text database
    //     $facilities = $request->input('facilities');
    //     if (is_array($facilities)) {
    //         $facilities = json_encode($facilities);
    //     }

    //     try {
    //         // Perhatikan: owner_id SUDAH DIHAPUS dari query ini
    //         DB::insert('INSERT INTO kosts (id, name, address, area, rating, reviews, price, rooms, years, description, img, facilities, created_at, updated_at) 
    //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    //             $id,
    //             $request->input('name'),
    //             $request->input('address'),
    //             $request->input('area'),
    //             0, // rating awal
    //             0, // jumlah review awal
    //             $request->input('price'),
    //             $request->input('rooms'),
    //             $request->input('years'),
    //             $request->input('description'),
    //             $request->input('img'),
    //             $facilities, // <--- Data fasilitas ditambahkan
    //             $now,
    //             $now
    //         ]);

    //         return response()->json([
    //             'message' => 'Data kost berhasil ditambahkan', 
    //             'id' => $id
    //         ], 201);

    //     } catch (\Exception $e) {
    //         return response()->json(['message' => 'Gagal menambah data', 'error' => $e->getMessage()], 500);
    //     }
    // }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'area' => 'required|string',
            'price' => 'required|numeric',
            'facilities' => 'required|string',
            'description' => 'required|string',
            'img' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi file gambar
        ]);

        // Generate ID otomatis KST-001, KST-002, dst.
        $lastKost = DB::select("SELECT id FROM kosts ORDER BY id DESC LIMIT 1");
        if (empty($lastKost)) {
            $id = 'KST-001';
        } else {
            $lastId = $lastKost[0]->id;
            preg_match("/(\d+)\$/", $lastId, $matches);
            $nextNumber = isset($matches[1]) ? ((int)$matches[1] + 1) : 1;
            $id = 'KST-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }

        // Handle Upload Gambar
        $imgPath = 'images-hunika/1.jpg'; // Default jika tidak ada gambar
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Simpan ke folder public/images-hunika di Laravel
            $file->move(public_path('images-hunika'), $filename);
            $imgPath = 'images-hunika/' . $filename;
        }

        $now = now();

        DB::insert('INSERT INTO kosts (id, name, address, area, rating, reviews, facilities, price, rooms, years, description, img, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            $id,
            $request->input('name'),
            $request->input('address'),
            $request->input('area'),
            5.0, // Default rating
            0,   // Default reviews
            $request->input('facilities'),
            $request->input('price'),
            2,   // Default rooms
            2024,// Default years
            $request->input('description'),
            $imgPath,
            $now,
            $now
        ]);

        return response()->json(['message' => 'Kost berhasil ditambahkan!', 'id' => $id], 201);
    }

    // 4. Ubah Data Kost
   public function update(Request $request, $id)
{
    // Validasi input edit
    $request->validate([
        'name' => 'required|string|max:255',
        'address' => 'required|string',
        'area' => 'required|string',
        'price' => 'required|numeric',
        'rooms' => 'required|integer',
        'years' => 'required|integer',
        'facilities' => 'required|string',
        'description' => 'required|string',
    ]);

    // Cek apakah data kos ada
    $kost = DB::select("SELECT id FROM kosts WHERE id = ?", [$id]);
    if (empty($kost)) {
        return response()->json(['message' => 'Data kost tidak ditemukan'], 404);
    }

    $now = now();

    // Jalankan query update ke database
    DB::update("UPDATE kosts SET name = ?, address = ?, area = ?, price = ?, rooms = ?, years = ?, facilities = ?, description = ?, updated_at = ? WHERE id = ?", [
        $request->input('name'),
        $request->input('address'),
        $request->input('area'),
        $request->input('price'),
        $request->input('rooms'),
        $request->input('years'),
        $request->input('facilities'),
        $request->input('description'),
        $now,
        $id
    ]);

    return response()->json(['message' => 'Data kost berhasil diperbarui!'], 200);
}
    // 5. Hapus Kost
    // public function destroy($id)
    // {
    //     $deleted = DB::delete('DELETE FROM kosts WHERE id = ?', [$id]);
        
    //     if ($deleted === 0) {
    //         return response()->json(['message' => 'Kost tidak ditemukan'], 404);
    //     }

    //     return response()->json(['message' => 'Data kost berhasil dihapus'], 200);
    // }

    public function destroy($id)
    {
        $kost = DB::select("SELECT id FROM kosts WHERE id = ?", [$id]);
        if (empty($kost)) {
            return response()->json(['message' => 'Data kost tidak ditemukan'], 404);
        }

        DB::delete("DELETE FROM kosts WHERE id = ?", [$id]);
        return response()->json(['message' => 'Kost berhasil dihapus'], 200);
    }
}