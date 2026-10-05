<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kosts', function (Blueprint $table) {
            // Kolom ID diatur sebagai string tanpa auto-increment
            $table->string('id')->primary(); 
            
            // Kolom owner_id dibuat biasa tanpa Foreign Key constraint 
            // untuk mencegah error karena tabel 'owners' belum kita buat
            $table->string('owner_id'); 
            
            // Kolom-kolom lainnya berdasarkan ERD
            $table->string('name');
            $table->text('address');
            $table->string('area');
            $table->string('type'); // Contoh: 'Putra', 'Putri', 'Campur'
            $table->float('rating')->default(0);
            $table->integer('reviews')->default(0);
            $table->integer('price');
            $table->string('years')->nullable();
            $table->text('description')->nullable();
            $table->string('img')->nullable();
            
            // Otomatis membuat kolom created_at dan updated_at
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kosts');
    }
};