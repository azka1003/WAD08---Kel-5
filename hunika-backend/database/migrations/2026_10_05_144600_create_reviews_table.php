<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kost_id');
            $table->string('user_id');
            
            // Relasi ke tabel kosts (jika kost dihapus, review otomatis terhapus)
            $table->foreign('kost_id')->references('id')->on('kosts')->onDelete('cascade');
            
            // Relasi ke tabel users (jika user dihapus, review otomatis terhapus)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
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