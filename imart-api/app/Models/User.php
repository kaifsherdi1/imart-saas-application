<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    /**
     * Mass-assignable attributes. `role` and `wallet_balance` are deliberately
     * excluded so they can never be set from request input.
     */
    protected $fillable = [
        'name', 'first_name', 'last_name', 'email', 'mobile', 'password',
    ];

    /**
     * Attributes never serialised into API responses.
     */
    protected $hidden = [
        'password', 'remember_token', 'otp', 'otp_expires_at', 'otp_attempts',
    ];

    /**
     * Get the store associated with the user.
     */
    public function store(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Store::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'wallet_balance' => 'float',
            'role' => \App\Enums\UserRole::class,
        ];
    }
}
