<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $fillable = [
        'title',
        'image',
        'description',
        'ingredients',
        'instructions',
        'user_id',
        'category_id',
        'price',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
