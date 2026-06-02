<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getPaginatedProducts(array $filters, int $perPage): LengthAwarePaginator;
    public function findById(string $id): Product;
    public function create(array $data): Product;
    public function update(Product $product, array $data): Product;
    public function softDelete(Product $product): bool;
    public function restore(string $id): bool;
    public function bulkSoftDelete(array $ids): int;
    public function bulkRestore(array $ids): int;
}
