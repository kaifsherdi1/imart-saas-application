<?php

namespace App\Services;

use App\Exceptions\AlreadyReviewedException;
use App\Exceptions\UnverifiedPurchaseException;
use App\Models\Order;
use App\Models\Review;
use App\Models\Store;

class ReviewService
{
    /**
     * Create a verified review for a Store or Product.
     *
     * @throws AlreadyReviewedException
     * @throws UnverifiedPurchaseException
     */
    public function store(
        string $userId,
        string $reviewableId,
        string $reviewableType,
        int    $rating,
        ?string $comment
    ): Review {
        // 1. Check if user has already reviewed this exact entity.
        $alreadyReviewed = Review::where('user_id', $userId)
            ->where('reviewable_id', $reviewableId)
            ->where('reviewable_type', $reviewableType)
            ->exists();

        if ($alreadyReviewed) {
            throw new AlreadyReviewedException();
        }

        // 2. Verified purchase check.
        if ($reviewableType === 'App\\Models\\Product') {
            // For PRODUCT reviews: must have a delivered order containing this product.
            $hasDeliveredOrder = Order::where('user_id', $userId)
                ->where('status', 'delivered')
                ->whereHas('items', fn($q) => $q->where('product_id', $reviewableId))
                ->exists();

            if (!$hasDeliveredOrder) {
                throw new UnverifiedPurchaseException();
            }
        } elseif ($reviewableType === 'App\\Models\\Store') {
            // For STORE reviews: must have at least one delivered order from this store.
            $hasDeliveredOrder = Order::where('user_id', $userId)
                ->where('store_id', $reviewableId)
                ->where('status', 'delivered')
                ->exists();

            if (!$hasDeliveredOrder) {
                throw new UnverifiedPurchaseException();
            }
        }

        // 3. Create the review using the polymorphic relationship.
        $review = Review::create([
            'user_id'         => $userId,
            'reviewable_id'   => $reviewableId,
            'reviewable_type' => $reviewableType,
            'rating'          => $rating,
            'comment'         => $comment,
        ]);

        // 4. Recalculate avg_rating on Store model dynamically.
        // If it's a store review, update that store's rating.
        // If it's a product review, update the product's store's rating.
        $this->recalculateStoreRating($reviewableType, $reviewableId);

        return $review;
    }

    private function recalculateStoreRating(string $type, string $id): void
    {
        if ($type === 'App\\Models\\Store') {
            $storeId = $id;
        } else {
            $storeId = \App\Models\Product::find($id)?->store_id;
        }

        if (!$storeId) {
            return;
        }

        $avgRating = Review::where('reviewable_id', $storeId)
            ->where('reviewable_type', 'App\\Models\\Store')
            ->avg('rating') ?? 0;

        Store::where('id', $storeId)->update(['avg_rating' => round($avgRating, 2)]);
    }
}
