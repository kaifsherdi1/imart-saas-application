<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\EmiController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicStoreController;
use App\Http\Controllers\Api\StoreSettingsController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Public Auth Routes ────────────────────────────────────────────────
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/register',       [AuthController::class, 'register']);
        Route::post('/register-owner', [AuthController::class, 'registerOwner']);
        Route::post('/login',          [AuthController::class, 'login']);
        Route::post('/forgot-password',[AuthController::class, 'forgotPassword']);
        Route::post('/verify-otp',     [AuthController::class, 'verifyOtp']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // Public Store Profiles & Products
    Route::get('/stores', [PublicStoreController::class, 'index']);
    Route::get('/public/stores/{slug}', [PublicStoreController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show'])->whereUuid('id');
    Route::post('/checkout/place-order', [CheckoutController::class, 'placeOrder'])->middleware('throttle:checkout');

    // Social Auth
    Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

    // ── Stripe Webhook (NO auth middleware — Stripe signs its own requests) ──
    Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle'])
        ->withoutMiddleware('throttle:api');

    // ── Protected Routes ──────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'me']);

        // Customer Routes
        Route::get('/wishlist',      [WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
        Route::get('/orders',        [OrderController::class, 'myOrders']);
        Route::post('/reviews',      [OrderController::class, 'storeReview']);
        Route::get('/profile',       [AuthController::class, 'me']);
        Route::patch('/profile',     [ProfileController::class, 'update']);
        Route::post('/emi/apply',    [EmiController::class, 'store']);
        Route::get('/wallet/balance',[EmiController::class, 'walletBalance']);

        // ── Store Owner Routes ─────────────────────────────────────────────
        Route::middleware('role.owner')->group(function () {

            // Billing stays reachable for suspended stores so they can reactivate.
            Route::get('/payments/plans',     [PaymentController::class, 'getPlans']);
            Route::post('/payments/checkout', [PaymentController::class, 'createCheckoutSession']);

            Route::middleware('store.approved')->group(function () {

                // Products (CRUD + bulk ops)
                Route::get('/store/products',          [ProductController::class, 'mine']);
                Route::post('/products/bulk-delete',   [ProductController::class, 'bulkDestroy']);
                Route::post('/products/bulk-restore',  [ProductController::class, 'bulkRestore']);
                Route::post('/products/{id}/restore',  [ProductController::class, 'restore']);
                Route::apiResource('products', ProductController::class)->except(['index', 'show']);

                // Store profile
                Route::patch('/store/settings', [StoreSettingsController::class, 'update']);

                // Order Management
                Route::get('/store/orders',              [OrderController::class, 'storeOrders']);
                Route::patch('/orders/{orderId}/status', [OrderController::class, 'updateStatus']);

                // Dashboard / Analytics
                Route::get('/dashboard/earnings', [OrderController::class, 'earnings']);

                // Excel Import & Export
                Route::get('/products/import/template', [ImportExportController::class, 'downloadTemplate']);
                Route::post('/products/import',          [ImportExportController::class, 'import']);
                Route::get('/reports/sales/export',      [ImportExportController::class, 'exportSalesReport']);
            });
        });

        // ── Admin Routes ───────────────────────────────────────────────────
        Route::middleware('role.admin')->prefix('admin')->group(function () {
            Route::get('/stats',                          [AdminController::class, 'platformStats']);
            Route::get('/stores',                         [AdminController::class, 'stores']);
            Route::get('/stores/pending',                 [AdminController::class, 'pendingStores']);
            Route::patch('/stores/{id}/approve',          [AdminController::class, 'approveStore']);
            Route::patch('/stores/{id}/reject',           [AdminController::class, 'rejectStore']);
            Route::get('/stores/{id}/documents/{document}', [AdminController::class, 'storeDocument']);
            Route::patch('/emi/{id}/approve',             [EmiController::class, 'approve']);
        });
    });
});
