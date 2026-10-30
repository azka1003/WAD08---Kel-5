<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Bawaan Laravel untuk manipulasi tanggal

class BookingController extends Controller
{
    // 1. Tampilkan riwayat pemesanan khusus milik user yang sedang login
    public function index(Request $request)
    {
        // Ambil user_id dengan aman dari Token JWT
        $userId = $request->auth->sub;

        // Gunakan JOIN untuk mengambil sekalian nama kost-nya
        $bookings = DB::select('
            SELECT b.*, k.name as kost_name, k.price as kost_price 
            FROM bookings b 
            JOIN kosts k ON b.kost_id = k.id 
            WHERE b.user_id = ? 
            ORDER BY b.created_at DESC
        ', [$userId]);

        return response()->json(['data' => $bookings], 200);
    }

    // 2. Buat Pemesanan Baru
    public function store(Request $request)
    {
        // Validasi Manual
        if (!$request->has(['kost_id', 'check_in_date', 'duration'])) {
            return response()->json(['message' => 'kost_id, check_in_date, dan duration (bulan) wajib diisi'], 400);
        }

        $kostId = $request->input('kost_id');
        $checkInDate = $request->input('check_in_date');
        $duration = (int) $request->input('duration');

        // Cek ketersediaan kost dan ambil harga dasarnya
        $kost = DB::select('SELECT id, price FROM kosts WHERE id = ?', [$kostId]);
        if (empty($kost)) {
            return response()->json(['message' => 'Kost tidak ditemukan'], 404);
        }

        $kostPrice = $kost[0]->price;

        // KALKULASI OTOMATIS: Hitung total harga dan tanggal selesai
        $totalPrice = $kostPrice * $duration;
        try {
            $checkOutDate = Carbon::parse($checkInDate)->addMonths($duration)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Format check_in_date salah (Gunakan format YYYY-MM-DD)'], 400);
        }

        // Ambil user_id dari token JWT
        $userId = $request->auth->sub;

        // Generate ID Booking Berurutan (Contoh: BKG-001)
        $lastBooking = DB::select("SELECT id FROM bookings ORDER BY id DESC LIMIT 1");
        if (empty($lastBooking)) {
            $id = 'BKG-001';
        } else {
            $lastId = $lastBooking[0]->id;
            preg_match('/(\d+)$/', $lastId, $matches);
            if (isset($matches[1])) {
                $lastNumber = (int) $matches[1];
                $id = 'BKG-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $id = 'BKG-001';
            }
        }

        $now = now();

        try {
            // Simpan ke Database
            DB::insert('INSERT INTO bookings (id, user_id, kost_id, check_in_date, check_out_date, duration, total_price, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                $id,
                $userId,
                $kostId,
                $checkInDate,
                $checkOutDate,
                $duration,
                $totalPrice,
                'pending', // Status awal pasti pending menunggu pembayaran
                $now,
                $now
            ]);

            return response()->json([
                'message' => 'Pemesanan berhasil dibuat',
                'booking_id' => $id,
                'total_price' => $totalPrice
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membuat pemesanan', 'error' => $e->getMessage()], 500);
        }
    }

    // 3. Lihat detail satu booking
    public function show(Request $request, $id)
    {
        $booking = DB::select('
            SELECT b.*, k.name as kost_name, k.address as kost_address 
            FROM bookings b 
            JOIN kosts k ON b.kost_id = k.id 
            WHERE b.id = ?
        ', [$id]);

        if (empty($booking)) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        $bookingData = $booking[0];

        // KEAMANAN: Hanya pemilik asli booking ATAU Admin yang boleh melihat detail ini
        if ($bookingData->user_id !== $request->auth->sub && $request->auth->is_admin !== true) {
            return response()->json(['message' => 'Akses ditolak. Ini bukan data pemesanan Anda.'], 403);
        }

        return response()->json(['data' => $bookingData], 200);
    }

    public function getTransactions(Request $request)
    {
        // Mengambil semua transaksi beserta data kost dan usernya
        $transactions = DB::select("
            SELECT 
                p.id as payment_id, p.amount, p.status as payment_status, p.proof,
                b.id as booking_id, b.check_in_date, b.duration,
                k.name as kost_name, 
                u.name as user_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN kosts k ON b.kost_id = k.id
            JOIN users u ON b.user_id = u.id
            ORDER BY p.created_at DESC
        ");

        return response()->json([
            'status' => true,
            'data' => $transactions
        ], 200);
    }
}