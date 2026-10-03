<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
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
     * Handle Google callback, then send the browser back to the frontend,
     * which picks up the token via AuthRedirectHandler.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        $frontend = rtrim(config('app.frontend_url'), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();

            // Never touch the role or password of an existing account.
            if (!$user) {
                $user = new User([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Str::random(40),
                ]);
                $user->role = UserRole::CUSTOMER;
                $user->email_verified_at = now();
                $user->save();
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect()->away($frontend . '/login?token=' . urlencode($token));
        } catch (\Throwable $e) {
            Log::warning('Google login failed', ['error' => $e->getMessage()]);

            return redirect()->away($frontend . '/login?error=social_login_failed');
        }
    }
}
