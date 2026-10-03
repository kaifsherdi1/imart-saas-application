<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterOwnerRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\PasswordResetOtp;
use App\Models\User;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /** Number of wrong OTP guesses allowed before the OTP is invalidated. */
    private const MAX_OTP_ATTEMPTS = 5;

    /**
     * Register a new customer.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);
        $user->role = UserRole::CUSTOMER;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    /**
     * Register a new store owner.
     */
    public function registerOwner(RegisterOwnerRequest $request): JsonResponse
    {
        // KYC documents go to the private disk; only admins can retrieve them.
        $documents = [];
        foreach ([
            'business_proof'      => ['business_proof_url', 'store_documents'],
            'shop_front_photo'    => ['shop_front_photo_url', 'store_photos'],
            'shop_interior_photo' => ['shop_interior_photo_url', 'store_photos'],
            'owner_id_proof'      => ['owner_id_proof_url', 'owner_documents'],
        ] as $field => [$column, $folder]) {
            if ($request->hasFile($field)) {
                $documents[$column] = $request->file($field)->store($folder, 'local');
            }
        }

        DB::transaction(function () use ($request, $documents) {
            $user = new User([
                'name' => $request->first_name . ' ' . $request->last_name,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'password' => $request->password,
            ]);
            $user->role = UserRole::OWNER;
            $user->save();

            Store::create(array_merge([
                'user_id' => $user->id,
                'name' => $request->shop_name,
                'slug' => Str::slug($request->shop_name) . '-' . Str::lower(Str::random(5)),
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'category' => $request->business_type,
                'business_type' => $request->business_type,
                'license_type' => $request->license_type,
                'status' => 'pending',
            ], $documents));
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Application submitted. Await admin approval.',
        ], 201);
    }

    /**
     * Login user and issue token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->findByIdentifier($request->identifier);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        if ($user->role === UserRole::OWNER) {
            $store = $user->store;
            if (!$store || $store->status === 'pending') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Your store application is still pending approval.',
                ], 403);
            }
            if ($store->status === 'rejected') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Your store application was rejected.',
                ], 403);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'user' => $user->load('store'),
                'token' => $token,
            ]
        ]);
    }

    /**
     * Return the authenticated user (with their store, if any).
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->load('store'),
        ]);
    }

    /**
     * Logout user and revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Request OTP for password reset.
     *
     * Always responds with the same message so the endpoint cannot be used to
     * discover which emails/mobiles are registered.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['identifier' => 'required|string|max:255']);
        $user = $this->findByIdentifier($request->identifier);

        if ($user) {
            $otp = (string) random_int(100000, 999999);
            $user->forceFill([
                'otp' => Hash::make($otp),
                'otp_expires_at' => now()->addMinutes(10),
                'otp_attempts' => 0,
            ])->save();

            try {
                Mail::to($user->email)->send(new PasswordResetOtp($user, $otp));
            } catch (\Throwable $e) {
                Log::error('Failed to send password reset OTP', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'If an account exists for these details, an OTP has been sent to the registered email.',
        ]);
    }

    /**
     * Verify OTP.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'identifier' => 'required|string|max:255',
            'otp' => 'required|string|size:6'
        ]);

        if (!$this->otpIsValid($request->identifier, $request->otp)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired OTP'], 400);
        }

        return response()->json(['status' => 'success', 'message' => 'OTP verified successfully']);
    }

    /**
     * Reset Password.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'identifier' => 'required|string|max:255',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = $this->otpIsValid($request->identifier, $request->otp);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired OTP'], 400);
        }

        $user->forceFill([
            'password' => $request->password,
            'otp' => null,
            'otp_expires_at' => null,
            'otp_attempts' => 0,
        ])->save();

        // Sign out every existing session after a password reset.
        $user->tokens()->delete();

        return response()->json(['status' => 'success', 'message' => 'Password reset successfully']);
    }

    private function findByIdentifier(string $identifier): ?User
    {
        return User::where('email', $identifier)
                    ->orWhere('mobile', $identifier)
                    ->first();
    }

    /**
     * Check an OTP, counting failed attempts. Returns the user when valid.
     */
    private function otpIsValid(string $identifier, string $otp): ?User
    {
        $user = $this->findByIdentifier($identifier);

        if (!$user || !$user->otp || !$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            return null;
        }

        if ($user->otp_attempts >= self::MAX_OTP_ATTEMPTS) {
            $user->forceFill(['otp' => null, 'otp_expires_at' => null])->save();
            return null;
        }

        if (!Hash::check($otp, $user->otp)) {
            $user->increment('otp_attempts');
            return null;
        }

        return $user;
    }
}
