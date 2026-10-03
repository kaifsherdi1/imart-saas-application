<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function getPaginatedProducts(array $filters, int $perPage): LengthAwarePaginator
    {
        // Only products from approved, active stores are publicly visible.
        $query = Product::query()
            ->with(['store']) // Eager loading to prevent N+1
            ->whereHas('store', fn($q) => $q->where('status', 'active'));

        if (!empty($filters['search'])) {
            $term = '%' . mb_strtolower($filters['search']) . '%';
            $query->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(name) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(description) LIKE ?', [$term]);
            });
        }

        if (isset($filters['price_min']) && is_numeric($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (isset($filters['price_max']) && is_numeric($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['store_id'])) {
            $query->where('store_id', $filters['store_id']);
        }

        switch ($filters['sort'] ?? null) {
            case 'az':
                $query->orderBy('name', 'asc');
                break;
            case 'za':
                $query->orderBy('name', 'desc');
                break;
            case 'low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'high_low':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->latest();
        }

        return $query->paginate($perPage);
    }

    public function getStoreProducts(string $storeId, int $perPage): LengthAwarePaginator
    {
        return Product::where('store_id', $storeId)->latest()->paginate($perPage);
    }

    public function findById(string $id): Product
    {
        return Product::with('store')
            ->whereHas('store', fn($q) => $q->where('status', 'active'))
            ->findOrFail($id);
    }

    public function findForStore(string $id, string $storeId): Product
    {
        return Product::where('store_id', $storeId)->findOrFail($id);
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }

    public function softDelete(Product $product): bool
    {
        return $product->delete();
    }

    public function restore(string $id, string $storeId): bool
    {
        $product = Product::onlyTrashed()->where('store_id', $storeId)->findOrFail($id);
        return $product->restore();
    }

    public function bulkSoftDelete(array $ids, string $storeId): int
    {
        return Product::where('store_id', $storeId)->whereIn('id', $ids)->delete();
    }

    public function bulkRestore(array $ids, string $storeId): int
    {
        return Product::onlyTrashed()->where('store_id', $storeId)->whereIn('id', $ids)->restore();
    }
}
