<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EmiApplication extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id', 'requested_amount', 'applicant_aadhaar_url', 
        'family_aadhaar_url', 'applicant_bank_details', 
        'family_bank_details', 'accepted_legal_terms', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
