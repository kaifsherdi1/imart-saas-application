<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function getPaginatedProducts(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = Product::query()->with(['store']); // Eager loading to prevent N+1

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'ilike', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'ilike', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (isset($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['sort'])) {
            switch ($filters['sort']) {
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
            }
        }

        return $query->paginate($perPage);
    }

    public function findById(string $id): Product
    {
        return Product::findOrFail($id);
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

    public function restore(string $id): bool
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        return $product->restore();
    }

    public function bulkSoftDelete(array $ids): int
    {
        return Product::whereIn('id', $ids)->delete();
    }

    public function bulkRestore(array $ids): int
    {
        return Product::onlyTrashed()->whereIn('id', $ids)->restore();
    }
}
