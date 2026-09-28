<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';

    protected $fillable = [
        'user_id',
        'kost_id',
        'check_in_date',
        'check_out_date',
        'duration',
        'total_price',
        'status',
    ];

    // Relasi ke Model Kost
    public function kost()
    {
        return $this->belongsTo(Kost::class, 'kost_id');
    }

    // Relasi ke Model User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
