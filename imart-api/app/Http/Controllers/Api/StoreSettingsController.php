<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreSettingsController extends Controller
{
    /**
     * PATCH /api/v1/store/settings
     * Update the authenticated owner's public store profile.
     */
    public function update(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'slug'     => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('stores', 'slug')->ignore($store->id)],
            'address'  => 'nullable|string|max:500',
            'category' => 'nullable|string|max:255',
        ]);

        $store->update([
            'name'     => $validated['name'],
            'slug'     => Str::slug($validated['slug'] ?? '') ?: $store->slug,
            'address'  => $validated['address'] ?? $store->address,
            'category' => $validated['category'] ?? $store->category,
        ]);

        return response()->json([
            'status'  => 'success',
            'code'    => 200,
            'message' => 'Store settings updated successfully.',
            'data'    => $store,
        ]);
    }
}
