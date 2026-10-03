<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'user_id', 'name', 'slug', 'status', 'category', 'trial_ends_at',
        'avg_rating', 'total_earnings',
        'address', 'city', 'state', 'pincode', 'latitude', 'longitude',
        'business_type', 'license_type', 'business_proof_url',
        'shop_front_photo_url', 'shop_interior_photo_url', 'owner_id_proof_url',
    ];

    /**
     * KYC documents are stored on the private disk and must never be exposed
     * through public endpoints. Admin endpoints opt in with makeVisible().
     */
    protected $hidden = [
        'business_proof_url', 'owner_id_proof_url',
    ];

    protected $casts = [
        'avg_rating'      => 'float',
        'total_earnings'  => 'float',
        'trial_ends_at'   => 'datetime',
    ];

    /** The user (owner) who owns this store. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** All products listed in this store. */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** All customer orders placed at this store. */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** Active subscription for this store. */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    /** All subscriptions ever (for history). */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /** All payments made for this store's subscriptions. */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Polymorphic reviews for this store.
     * Uses the reviewable_id / reviewable_type columns on the reviews table.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
