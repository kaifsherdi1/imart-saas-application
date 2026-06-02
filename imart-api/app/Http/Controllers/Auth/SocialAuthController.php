<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle Google callback.
     */
    public function handleGoogleCallback(): JsonResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::updateOrCreate([
                'email' => $googleUser->email,
            ], [
                'name' => $googleUser->name,
                'password' => Hash::make(Str::random(24)),
                'role' => UserRole::CUSTOMER, // Only for customers as per requirement
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Social login failed',
            ], 422);
        }
    }
}
