<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Pastikan $request->auth (dari JwtMiddleware) ada, dan is_admin bernilai true
        if (!isset($request->auth) || $request->auth->is_admin !== true) {
            return response()->json(['message' => 'Akses ditolak. Endpoint ini khusus Admin/Pengelola.'], 403);
        }

        return $next($request);
    }
}