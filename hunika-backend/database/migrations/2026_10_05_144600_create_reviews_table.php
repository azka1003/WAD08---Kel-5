<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel kosts (jika kost dihapus, review otomatis terhapus)
            $table->foreignId('kost_id')->constrained('kosts')->onDelete('cascade');
            
            // Relasi ke tabel users (jika user dihapus, review otomatis terhapus)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->integer('rating'); // Nilai rating (misal 1 - 5)
            $table->text('comment')->nullable(); // Komentar ulasan (boleh kosong)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};