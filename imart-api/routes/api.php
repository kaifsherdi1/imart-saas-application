<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Public Auth Routes ────────────────────────────────────────────────
    Route::post('/register',       [AuthController::class, 'register']);
    Route::post('/register-owner', [AuthController::class, 'registerOwner']);
    Route::post('/login',          [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password',[AuthController::class, 'forgotPassword']);
    Route::post('/verify-otp',     [AuthController::class, 'verifyOtp']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Public Store Profiles & Products
    Route::get('/stores', [\App\Http\Controllers\Api\PublicStoreController::class, 'index']);
    Route::get('/public/stores/{slug}', [\App\Http\Controllers\Api\PublicStoreController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/checkout/place-order', [\App\Http\Controllers\Api\CheckoutController::class, 'placeOrder']);

    // Social Auth
    Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

    // ── Stripe Webhook (NO auth / CSRF middleware — Stripe signs its own requests) ──
    Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle'])
        ->withoutMiddleware(['auth:sanctum', 'throttle']);

    // ── Protected Routes ──────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', fn(Request $request) => $request->user());

        // Customer Routes
        Route::get('/wishlist',      [\App\Http\Controllers\Api\WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [\App\Http\Controllers\Api\WishlistController::class, 'toggle']);
        Route::get('/orders',        [OrderController::class, 'myOrders']);
        Route::post('/reviews',      [OrderController::class, 'storeReview']);
        Route::patch('/profile',     [\App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::post('/emi/apply',    [\App\Http\Controllers\Api\EmiController::class, 'store']);
        Route::get('/wallet/balance',[\App\Http\Controllers\Api\EmiController::class, 'walletBalance']);

        // ── Store Owner Routes ─────────────────────────────────────────────
        Route::middleware(['role.owner', 'store.approved'])->group(function () {

            // Products (CRUD + bulk ops)
            Route::post('/products/bulk-delete',  [ProductController::class, 'bulkDestroy']);
            Route::post('/products/bulk-restore',  [ProductController::class, 'bulkRestore']);
            Route::post('/products/{id}/restore',  [ProductController::class, 'restore']);
            Route::apiResource('products', ProductController::class)->except(['index', 'show']);

            // Order Management
            Route::patch('/orders/{orderId}/status', [OrderController::class, 'updateStatus']);

            // Dashboard / Analytics
            Route::get('/dashboard/earnings', [OrderController::class, 'earnings']);

            // Excel Import & Export
            Route::get('/products/import/template', [ImportExportController::class, 'downloadTemplate']);
            Route::post('/products/import',          [ImportExportController::class, 'import']);
            Route::get('/reports/sales/export',      [ImportExportController::class, 'exportSalesReport']);

            // Payments
            Route::get('/payments/plans',            [\App\Http\Controllers\Api\PaymentController::class, 'getPlans']);
            Route::post('/payments/checkout',        [\App\Http\Controllers\Api\PaymentController::class, 'createCheckoutSession']);
        });

        // ── Admin Routes ───────────────────────────────────────────────────
        Route::middleware('role.admin')->group(function () {
            Route::get('/admin/stats', [\App\Http\Controllers\Api\AdminController::class, 'platformStats']);
            Route::get('/admin/stores/pending', [\App\Http\Controllers\Api\AdminController::class, 'pendingStores']);
            Route::patch('/admin/stores/{id}/approve', [\App\Http\Controllers\Api\AdminController::class, 'approveStore']);
            Route::patch('/admin/emi/{id}/approve', [\App\Http\Controllers\Api\EmiController::class, 'approve']);
        });
    });
});
