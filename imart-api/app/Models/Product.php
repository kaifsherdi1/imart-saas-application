<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'store_id', 'name', 'slug', 'description',
        'price', 'stock', 'category', 'image_url',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    /** The store this product belongs to. */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /** All order line items for this product. */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Polymorphic reviews for this product.
     * A single reviews table handles both store & product reviews.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
