<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // 1. Buat Tagihan Pembayaran (Untuk User Pemesan)
    public function store(Request $request)
    {
        if (!$request->has(['booking_id', 'method'])) {
            return response()->json(['message' => 'booking_id dan method wajib diisi'], 400);
        }

        $bookingId = $request->input('booking_id');
        
        // Cek booking & pastikan booking tersebut benar-benar milik user yang sedang login!
        $booking = DB::select('SELECT id, user_id, total_price FROM bookings WHERE id = ?', [$bookingId]);
        if (empty($booking)) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        // KEAMANAN JWT: Mencegah user membayar booking milik orang lain
        if ($booking[0]->user_id !== $request->auth->sub) {
            return response()->json(['message' => 'Akses ditolak. Ini bukan data pemesanan Anda.'], 403);
        }

        // Cek apakah tagihan untuk booking ini sudah pernah dibuat agar tidak duplikat
        $cekPayment = DB::select('SELECT id FROM payments WHERE booking_id = ?', [$bookingId]);
        if (!empty($cekPayment)) {
            return response()->json(['message' => 'Tagihan pembayaran untuk booking ini sudah ada'], 409);
        }

        // Generate ID Payment Berurutan (Contoh: PAY-001)
        $lastPayment = DB::select("SELECT id FROM payments ORDER BY id DESC LIMIT 1");
        if (empty($lastPayment)) {
            $id = 'PAY-001';
        } else {
            $lastId = $lastPayment[0]->id;
            preg_match('/(\d+)$/', $lastId, $matches);
            if (isset($matches[1])) {
                $lastNumber = (int) $matches[1];
                $id = 'PAY-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $id = 'PAY-001';
            }
        }

        $now = now();

        try {
            DB::insert('INSERT INTO payments (id, booking_id, method, amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                $id,
                $bookingId,
                $request->input('method'),
                $booking[0]->total_price, // Ambil jumlah tagihan otomatis dari tabel bookings
                'pending',
                $now,
                $now
            ]);

            return response()->json([
                'message' => 'Tagihan pembayaran berhasil dibuat',
                'payment_id' => $id,
                'amount' => $booking[0]->total_price
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membuat tagihan', 'error' => $e->getMessage()], 500);
        }
    }

    // 2. Upload Bukti Pembayaran (Untuk User Pemesan)
    public function uploadProof(Request $request, $id)
    {
        // Ambil data payment sekaligus mengecek siapa pemilik booking-nya
        $payment = DB::select('SELECT p.id, b.user_id FROM payments p JOIN bookings b ON p.booking_id = b.id WHERE p.id = ?', [$id]);
        
        if (empty($payment)) {
            return response()->json(['message' => 'Data tagihan tidak ditemukan'], 404);
        }

        // KEAMANAN JWT: Hanya yang punya booking yang bisa upload bukti
        if ($payment[0]->user_id !== $request->auth->sub) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $proof = $request->input('proof');
        if (!$proof) {
            return response()->json(['message' => 'URL/Teks Bukti pembayaran wajib diisi'], 400);
        }

        $now = now();
        
        try {
            DB::update('UPDATE payments SET proof = ?, payment_date = ?, updated_at = ? WHERE id = ?', [
                $proof, $now, $now, $id
            ]);

            return response()->json(['message' => 'Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengirim bukti', 'error' => $e->getMessage()], 500);
        }
    }

    // 3. Verifikasi Status Pembayaran (KHUSUS ADMIN)
    public function updateStatus(Request $request, $id)
    {
        // Fungsi ini otomatis aman karena di api.php sudah kita bungkus dengan middleware 'admin'
        
        $status = $request->input('status'); // Harus bernilai 'success' atau 'failed'
        if (!in_array($status, ['success', 'failed', 'pending'])) {
            return response()->json(['message' => 'Status tidak valid. Gunakan: success, failed, atau pending'], 400);
        }

        $now = now();

        try {
        // 1. BEGIN: Memulai mode transaksi SQL
        DB::beginTransaction();

        // 2. Kueri Pertama: Ubah status di tabel payments
        DB::update('UPDATE payments SET status = ?, updated_at = ? WHERE id = ?', [$status, $now, $id]);
        
        // 3. Kueri Kedua: Jika status success, ubah juga status di tabel bookings
        if ($status === 'success') {
            $payment = DB::select('SELECT booking_id FROM payments WHERE id = ?', [$id]);
            if (!empty($payment)) {
                DB::update('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?', ['success', $now, $payment[0]->booking_id]);
            }
        }

        // 4. COMMIT: Jika semua kueri di atas berjalan lancar, simpan permanen ke Supabase
        DB::commit();

        return response()->json(['message' => 'Status pembayaran berhasil diverifikasi menjadi ' . $status], 200);

    } catch (\Exception $e) {
        // 5. ROLLBACK (END): Jika ada SATU saja kueri yang gagal, batalkan SEMUA perubahan sebelumnya!
        DB::rollBack();

        return response()->json(['message' => 'Gagal memverifikasi, transaksi dibatalkan', 'error' => $e->getMessage()], 500);
    }
    }
}