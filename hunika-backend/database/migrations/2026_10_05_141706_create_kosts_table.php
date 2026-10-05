<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kosts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->string('area');
            $table->float('rating')->default(0);
            $table->integer('reviews')->default(0);
            $table->decimal('price', 12, 2);
            $table->integer('rooms')->default(1);
            $table->integer('years')->nullable();
            $table->text('description')->nullable();
            $table->string('img')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kosts');
    }
};