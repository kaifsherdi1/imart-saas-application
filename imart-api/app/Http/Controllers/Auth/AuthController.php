<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterOwnerRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new customer.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::CUSTOMER,
        ]);

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
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'role' => UserRole::OWNER,
        ]);

        $storeData = [
            'user_id' => $user->id,
            'name' => $request->shop_name,
            'slug' => Str::slug($request->shop_name) . '-' . Str::random(5),
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'pincode' => $request->pincode,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'business_type' => $request->business_type,
            'license_type' => $request->license_type,
            'status' => 'pending',
        ];

        // Handle file uploads
        if ($request->hasFile('business_proof')) {
            $storeData['business_proof_url'] = $request->file('business_proof')->store('store_documents', 'public');
        }
        if ($request->hasFile('shop_front_photo')) {
            $storeData['shop_front_photo_url'] = $request->file('shop_front_photo')->store('store_photos', 'public');
        }
        if ($request->hasFile('shop_interior_photo')) {
            $storeData['shop_interior_photo_url'] = $request->file('shop_interior_photo')->store('store_photos', 'public');
        }
        if ($request->hasFile('owner_id_proof')) {
            $storeData['owner_id_proof_url'] = $request->file('owner_id_proof')->store('owner_documents', 'public');
        }

        Store::create($storeData);

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
        $user = User::where('email', $request->identifier)
                    ->orWhere('mobile', $request->identifier)
                    ->first();

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
                'user' => $user,
                'token' => $token,
            ]
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
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['identifier' => 'required|string']);
        $user = User::where('email', $request->identifier)
                    ->orWhere('mobile', $request->identifier)
                    ->first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $otp = (string) rand(1000, 9999);
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinute()
        ]);

        // In a real app, send SMS/Email here. We will just return it for testing.
        return response()->json([
            'status' => 'success',
            'message' => 'OTP sent successfully (Simulated)',
            'otp' => $otp // For testing purposes
        ]);
    }

    /**
     * Verify OTP.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'identifier' => 'required|string',
            'otp' => 'required|string|size:4'
        ]);

        $user = User::where('email', $request->identifier)
                    ->orWhere('mobile', $request->identifier)
                    ->first();

        if (!$user || $user->otp !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
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
            'identifier' => 'required|string',
            'otp' => 'required|string|size:4',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', $request->identifier)
                    ->orWhere('mobile', $request->identifier)
                    ->first();

        if (!$user || $user->otp !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired OTP'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'otp' => null,
            'otp_expires_at' => null
        ]);

        return response()->json(['status' => 'success', 'message' => 'Password reset successfully']);
    }
}
