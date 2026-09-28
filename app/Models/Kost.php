<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kost extends Model
{
    protected $fillable = [
        'name',
        'address',
        'area',
        'type',
        'tier',
        'rating',
        'reviews',
        'price',
        'rooms',
        'years',
        'desc1',
        'desc2',
    ];
}