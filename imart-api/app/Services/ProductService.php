<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepositoryInterface;
use App\Exceptions\DuplicateProductException;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {}

    public function getProducts(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->productRepository->getPaginatedProducts($filters, $perPage);
    }

    public function getProductById(string $id): Product
    {
        return $this->productRepository->findById($id);
    }

    public function createProduct(array $data): Product
    {
        $this->checkDuplicate($data['name'], $data['store_id']);

        if (isset($data['image'])) {
            $data['image_url'] = Cloudinary::upload($data['image']->getRealPath())->getSecurePath();
        }

        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);

        return $this->productRepository->create($data);
    }

    public function updateProduct(string $id, array $data): Product
    {
        $product = $this->productRepository->findById($id);

        if (isset($data['name']) && $data['name'] !== $product->name) {
            $this->checkDuplicate($data['name'], $product->store_id);
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);
        }

        if (isset($data['image'])) {
            $data['image_url'] = Cloudinary::upload($data['image']->getRealPath())->getSecurePath();
        }

        return $this->productRepository->update($product, $data);
    }

    public function deleteProduct(string $id): bool
    {
        $product = $this->productRepository->findById($id);
        return $this->productRepository->softDelete($product);
    }

    public function restoreProduct(string $id): bool
    {
        return $this->productRepository->restore($id);
    }

    public function bulkDeleteProducts(array $ids): int
    {
        return $this->productRepository->bulkSoftDelete($ids);
    }

    public function bulkRestoreProducts(array $ids): int
    {
        return $this->productRepository->bulkRestore($ids);
    }

    protected function checkDuplicate(string $name, string $storeId): void
    {
        $exists = Product::where('name', $name)
            ->where('store_id', $storeId)
            ->exists();

        if ($exists) {
            throw new DuplicateProductException("A product with this name already exists in your store.");
        }
    }
}
