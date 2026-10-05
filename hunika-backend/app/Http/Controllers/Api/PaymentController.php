<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PaymentController extends Controller
{
    //   POST /api/payments
    //   Membuat transaksi pembayaran
    public function store(Request $request)
    {
        // Menangkap data dari request. 
        // ID diisi secara manual melalui request untuk mengakomodasi skema tanpa auto-increment.
        $id = $request->input('id'); 
        $bookingId = $request->input('booking_id');
        $method = $request->input('method');
        $amount = $request->input('amount');
        $status = $request->input('status', 'pending'); // Default status adalah pending
        $now = Carbon::now();

        // Pengecekan input dasar
        if (!$id || !$bookingId || !$method || !$amount) {
            return response()->json(['message' => 'Data id, booking_id, method, dan amount wajib diisi'], 400);
        }

        $query = "INSERT INTO payments (id, booking_id, method, amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try {
            DB::insert($query, [$id, $bookingId, $method, $amount, $status, $now, $now]);
            
            return response()->json([
                'status' => 'success', 
                'message' => 'Transaksi pembayaran berhasil dibuat'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal membuat pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    //   GET /api/payments/{id}
    //   Melihat detail pembayaran

    public function show($id)
    {
        $query = "SELECT * FROM payments WHERE id = ?";
        // selectOne digunakan karena kita hanya mengambil spesifik 1 baris berdasarkan Primary Key
        $payment = DB::selectOne($query, [$id]); 

        if (!$payment) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $payment
        ]);
    }

    
    //  PUT /api/payments/{id}
    //  Memperbarui status pembayaran

    public function updateStatus(Request $request, $id)
    {
        $status = $request->input('status');
        $now = Carbon::now();

        if (!$status) {
            return response()->json(['message' => 'Parameter status diperlukan'], 400);
        }

        $query = "UPDATE payments SET status = ?, updated_at = ? WHERE id = ?";
        $updated = DB::update($query, [$status, $now, $id]);

        if ($updated === 0) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan atau status sudah sama'], 404);
        }

        return response()->json([
            'status' => 'success', 
            'message' => 'Status pembayaran berhasil diperbarui'
        ]);
    }

    //  POST /api/payments/{id}/proof
    //  Mengunggah bukti pembayaran
     
    public function uploadProof(Request $request, $id)
    {
        // Mengecek apakah ada file 'proof' yang dilampirkan
        if (!$request->hasFile('proof')) {
            return response()->json(['message' => 'File bukti pembayaran diperlukan'], 400);
        }

        $file = $request->file('proof');
        
        // Menyimpan file ke folder storage/app/public/proofs
        $path = $file->store('proofs', 'public'); 
        $now = Carbon::now();

        // Mengupdate kolom proof di database dengan path/lokasi file disimpan
        $query = "UPDATE payments SET proof = ?, updated_at = ? WHERE id = ?";
        $updated = DB::update($query, [$path, $now, $id]);

        if ($updated === 0) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success', 
            'message' => 'Bukti pembayaran berhasil diunggah',
            'path' => $path
        ]);
    }
}