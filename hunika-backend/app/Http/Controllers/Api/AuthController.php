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

        // 3. Generate ID Manual dan Enkripsi Password
        $id = 'USR-' . strtoupper(Str::random(6)); // Contoh: USR-B7X9Q1
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
}
