<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getPaginatedProducts(array $filters, int $perPage): LengthAwarePaginator;
    public function getStoreProducts(string $storeId, int $perPage): LengthAwarePaginator;
    public function findById(string $id): Product;
    public function findForStore(string $id, string $storeId): Product;
    public function create(array $data): Product;
    public function update(Product $product, array $data): Product;
    public function softDelete(Product $product): bool;
    public function restore(string $id, string $storeId): bool;
    public function bulkSoftDelete(array $ids, string $storeId): int;
    public function bulkRestore(array $ids, string $storeId): int;
}
