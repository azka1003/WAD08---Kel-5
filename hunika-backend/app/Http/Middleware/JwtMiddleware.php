<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Ambil token dari header "Authorization: Bearer <token>"
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token tidak ditemukan (Unauthorized)'], 401);
        }

        try {
            // 2. Dekode token menggunakan JWT_SECRET
            $key = env('JWT_SECRET', 'fallback_secret_key');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            // 3. Simpan data token (ID & status admin) ke dalam request agar bisa dibaca oleh Controller
            $request->auth = $decoded;

            // Lanjut ke proses berikutnya
            return $next($request);
            
        } catch (Exception $e) {
            return response()->json(['message' => 'Token tidak valid atau sudah kedaluwarsa'], 401);
        }
    }
}
