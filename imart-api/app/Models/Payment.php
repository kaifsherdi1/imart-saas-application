<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasUuids;

    protected $fillable = [
        'store_id', 'subscription_id', 'stripe_payment_id',
        'amount', 'status', 'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
