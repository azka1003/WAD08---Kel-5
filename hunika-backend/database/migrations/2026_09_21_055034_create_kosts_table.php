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
            $table->string('type');
            $table->string('tier');
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews')->default(0);
            $table->unsignedInteger('price');
            $table->unsignedInteger('rooms')->default(0);
            $table->unsignedInteger('years')->default(0);
            $table->text('desc1')->nullable();
            $table->text('desc2')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kosts');
    }
};