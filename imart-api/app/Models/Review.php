<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    use HasUuids;

    protected $fillable = ['user_id', 'reviewable_id', 'reviewable_type', 'rating', 'comment'];

    /**
     * Polymorphic relationship — can belong to Store OR Product.
     * Uses reviewable_id and reviewable_type columns.
     */
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
