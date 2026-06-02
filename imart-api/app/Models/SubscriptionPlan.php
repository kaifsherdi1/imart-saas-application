<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'price', 'duration_days', 'stripe_price_id'];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }
}
