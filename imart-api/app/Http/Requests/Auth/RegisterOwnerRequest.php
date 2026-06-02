<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterOwnerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'mobile' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            
            'shop_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'pincode' => ['required', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            
            'business_type' => ['required', 'string', 'max:255'],
            'license_type' => ['required', 'string', 'max:255'],
            
            'business_proof' => ['nullable', 'file', 'max:10240'],
            'shop_front_photo' => ['nullable', 'file', 'image', 'max:10240'],
            'shop_interior_photo' => ['nullable', 'file', 'image', 'max:10240'],
            'owner_id_proof' => ['nullable', 'file', 'max:10240'],
            
            'consent' => ['accepted']
        ];
    }
}
