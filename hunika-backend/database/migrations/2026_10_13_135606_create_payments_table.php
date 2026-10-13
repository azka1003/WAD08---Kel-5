<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->string('id')->primary();

            // 2. Foreign Key ke tabel bookings
            // Tipe data WAJIB sama dengan tipe data 'id' di tabel bookings (yaitu string)
            $table->string('booking_id');

            // 3. Kolom detail pembayaran
            // Menggunakan decimal untuk nominal uang (15 digit total, 2 angka di belakang koma)
            $table->string('method'); // Contoh: 'Transfer Bank', 'E-Wallet', 'Kartu Kredit'
            $table->decimal('amount', 15, 2); 
            $table->string('status')->default('pending'); // Contoh: 'pending', 'success', 'failed'
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            // 4. Definisikan Relasinya
            // Jika data booking dihapus, data pembayaran terkait juga akan terhapus otomatis (cascade)
            $table->foreign('booking_id')
                  ->references('id')
                  ->on('bookings')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
