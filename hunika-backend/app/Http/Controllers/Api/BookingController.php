<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller as BaseController;
use App\Models\Booking;
use App\Models\Kost;
use Illuminate\Http\Request;

class BookingController extends BaseController
{
    // 1. POST /api/bookings (Membuat booking baru)
    public function store(Request $request)
    {
        $request->validate([
            'kost_id'       => 'required|integer',
            'check_in_date' => 'required|date',
            'check_out_date'=> 'required|date|after:check_in_date',
            'duration'      => 'required|integer|min:1',
        ]);

       $price = 1000000; 
        $totalPrice = $price * $request->duration;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'kost_id'       => $request->kost_id,
            'check_in_date' => $request->check_in_date,
            'check_out_date'=> $request->check_out_date,
            'duration'      => $request->duration,
            'total_price'   => $totalPrice,
            'status'        => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibuat',
            'data'    => $booking
        ], 201);
    }

    // 2. GET /api/bookings (Mengambil daftar booking pengguna yang login)
    public function index(Request $request)
    {
        $bookings = Booking::with('kost')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil daftar booking',
            'data'    => $bookings
        ], 200);
    }

    // 3. GET /api/bookings/{id} (Melihat detail booking berdasarkan ID)
    public function show(Request $request, $id)
    {
        $booking = Booking::with('kost')->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail booking ditemukan',
            'data'    => $booking
        ], 200);
    }

    // 4. PUT /api/bookings/{id} (Mengubah data booking)
    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Booking tidak dapat diubah karena status bukan pending'], 400);
        }

        $request->validate([
            'check_in_date' => 'sometimes|date',
            'check_out_date'=> 'sometimes|date|after:check_in_date',
            'duration'      => 'sometimes|integer|min:1',
        ]);

        if ($request->has('check_in_date')) $booking->check_in_date = $request->check_in_date;
        if ($request->has('check_out_date')) $booking->check_out_date = $request->check_out_date;
        
        if ($request->has('duration')) {
            $booking->duration = $request->duration;
            $kost = Kost::find($booking->kost_id);
            if ($kost) {
                $booking->total_price = $kost->price * $request->duration;
            }
        }

        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Data booking berhasil diperbarui',
            'data'    => $booking
        ], 200);
    }

    // 5. DELETE /api/bookings/{id} (Membatalkan booking)
    public function destroy(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Mengubah status menjadi cancelled
        $booking->status = 'cancelled';
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan'
        ], 200);
    }
}