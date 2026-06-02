<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasUuids;

    protected $fillable = [
        'store_id', 'plan_id', 'stripe_subscription_id',
        'stripe_customer_id', 'status', 'trial_ends_at', 'ends_at',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'ends_at'       => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
