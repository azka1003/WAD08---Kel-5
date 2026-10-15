<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;

class AuthController extends Controller
{
    // Fungsi Register (Untuk User Biasa / Pencari Kost)
    public function register(Request $request)
    {
        // 1. Validasi Input Manual (karena kita tidak pakai FormRequest)
        if (!$request->has(['name', 'email', 'password'])) {
            return response()->json(['message' => 'Nama, Email, dan Password wajib diisi'], 400);
        }

        $email = $request->input('email');

        // 2. Cek apakah email sudah terdaftar
        $cekEmail = DB::select('SELECT id FROM users WHERE email = ?', [$email]);
        if (!empty($cekEmail)) {
            return response()->json(['message' => 'Email sudah digunakan'], 409);
        }

        // 3. Generate ID Manual Berurutan (Contoh: USR-001)
        $lastUser = DB::select("SELECT id FROM users ORDER BY id DESC LIMIT 1");
        
        if (empty($lastUser)) {
            $id = 'USR-001';
        } else {
            // Ambil ID terakhir, misal "USR-005" atau "ADM-001"
            $lastId = $lastUser[0]->id;
            
            // Ambil hanya karakter angka di ujungnya menggunakan ekspresi reguler
            // Ini untuk mencegah error jika format huruf depannya beda (misal ada akun 'ADM-001')
            preg_match('/(\d+)$/', $lastId, $matches);
            
            if (isset($matches[1])) {
                $lastNumber = (int) $matches[1];
                $id = 'USR-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                // Fallback jika format ID terakhir tidak dikenali
                $id = 'USR-001';
            }
        }

        $hashedPassword = Hash::make($request->input('password'));
        $now = now();

        try {
            // 4. Simpan ke database (is_admin otomatis false dari bawaan migrasi)
            DB::insert('INSERT INTO users (id, name, email, password, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                $id,
                $request->input('name'),
                $email,
                $hashedPassword,
                $request->input('phone', null), // Opsional
                $now,
                $now
            ]);

            return response()->json([
                'message' => 'Registrasi berhasil',
                'user' => [
                    'id' => $id,
                    'name' => $request->input('name'),
                    'email' => $email
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Registrasi gagal', 'error' => $e->getMessage()], 500);
        }
    }

    // Fungsi Login (Menerbitkan JWT)
    public function login(Request $request)
    {
        if (!$request->has(['email', 'password'])) {
            return response()->json(['message' => 'Email dan Password wajib diisi'], 400);
        }

        $email = $request->input('email');
        $password = $request->input('password');

        // 1. Cari user di database berdasarkan email
        $users = DB::select('SELECT * FROM users WHERE email = ? LIMIT 1', [$email]);
        
        if (empty($users)) {
            return response()->json(['message' => 'Email atau Password salah'], 401);
        }

        $user = $users[0];

        // 2. Verifikasi Password yang dikirim dengan Hash di database
        if (!Hash::check($password, $user->password)) {
            return response()->json(['message' => 'Email atau Password salah'], 401);
        }

        // 3. Buat Payload untuk Token JWT
        $payload = [
            'iss' => "hunika-backend", // Issuer (Penerbit)
            'sub' => $user->id,        // Subject (ID User)
            'is_admin' => (bool) $user->is_admin, // Sisipkan status admin di token
            'iat' => time(),           // Waktu token diterbitkan (sekarang)
            'exp' => time() + (60 * 60 * 24) // Token kadaluarsa dalam 24 Jam
        ];

        // 4. Sign/Tandatangani Token
        $key = env('JWT_SECRET', 'fallback_secret_key');
        $jwt = JWT::encode($payload, $key, 'HS256');

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $jwt, // Ini yang akan disalin ke Postman oleh frontend
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'is_admin' => (bool) $user->is_admin
            ]
        ], 200);
    }

    // Fungsi Hapus User
    public function destroy($id)
    {
        // Cek apakah user ada
        $user = DB::select('SELECT id FROM users WHERE id = ?', [$id]);

        if (empty($user)) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        try {
            DB::delete('DELETE FROM users WHERE id = ?', [$id]);
            return response()->json(['message' => 'Akun user berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus user', 'error' => $e->getMessage()], 500);
        }
    }
}
