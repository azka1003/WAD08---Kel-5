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
       // 1. Validasi Input Manual
        if (!$request->has(['name', 'email', 'password', 'role'])) {
            return response()->json(['message' => 'Nama, Email, Password, dan Role wajib diisi'], 400);
        }

        $email = $request->input('email');

        // 2. Cek apakah email sudah terdaftar
        $cekEmail = DB::select('SELECT id FROM users WHERE email = ?', [$email]);
        if (!empty($cekEmail)) {
            return response()->json(['message' => 'Email sudah digunakan'], 409);
        }

        // 3. Cek Role & Generate ID Berdasarkan Role
        $isAdmin = $request->input('role') === 'admin';
        $prefix = $isAdmin ? 'ADM' : 'USR';

        $lastUser = DB::select("SELECT id FROM users WHERE id LIKE ? ORDER BY id DESC LIMIT 1", ["{$prefix}%"]);

        if (empty($lastUser)) {
            $id = "{$prefix}-001";
        } else {
            $lastId = $lastUser[0]->id;
            preg_match("/(\d+)\$/", $lastId, $matches);

            if (isset($matches[1])) {
                $lastNumber = (int) $matches[1];
                $id = "{$prefix}-" . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $id = "{$prefix}-001";
            }
        }

        $hashedPassword = Hash::make($request->input('password'));
        $now = now();

        try {
            // 4. Simpan ke database
            DB::insert('INSERT INTO users (id, name, email, password, phone, is_admin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                $id,
                $request->input('name'),
                $email,
                $hashedPassword,
                $request->input('phone', null), 
                $isAdmin ? 1 : 0, 
                $now,
                $now
            ]);

            return response()->json([
                'message' => 'Registrasi berhasil!',
                'user' => [
                    'id' => $id,
                    'name' => $request->input('name'),
                    'email' => $email,
                    'is_admin' => $isAdmin
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
