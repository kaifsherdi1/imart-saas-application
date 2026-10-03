<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepositoryInterface;
use App\Exceptions\DuplicateProductException;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
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

    public function getStoreProducts(string $storeId, int $perPage = 50): LengthAwarePaginator
    {
        return $this->productRepository->getStoreProducts($storeId, $perPage);
    }

    public function getProductById(string $id): Product
    {
        return $this->productRepository->findById($id);
    }

    public function createProduct(array $data): Product
    {
        $this->checkDuplicate($data['name'], $data['store_id']);

        if (isset($data['image'])) {
            $data['image_url'] = $this->uploadImage($data['image']);
        }
        unset($data['image']);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(5));

        return $this->productRepository->create($data);
    }

    public function updateProduct(string $storeId, string $id, array $data): Product
    {
        $product = $this->productRepository->findForStore($id, $storeId);

        if (isset($data['name']) && $data['name'] !== $product->name) {
            $this->checkDuplicate($data['name'], $product->store_id);
            $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(5));
        }

        if (isset($data['image'])) {
            $data['image_url'] = $this->uploadImage($data['image']);
        }
        unset($data['image']);

        return $this->productRepository->update($product, $data);
    }

    public function deleteProduct(string $storeId, string $id): bool
    {
        $product = $this->productRepository->findForStore($id, $storeId);
        return $this->productRepository->softDelete($product);
    }

    public function restoreProduct(string $storeId, string $id): bool
    {
        return $this->productRepository->restore($id, $storeId);
    }

    public function bulkDeleteProducts(string $storeId, array $ids): int
    {
        return $this->productRepository->bulkSoftDelete($ids, $storeId);
    }

    public function bulkRestoreProducts(string $storeId, array $ids): int
    {
        return $this->productRepository->bulkRestore($ids, $storeId);
    }

    protected function uploadImage(UploadedFile $image): string
    {
        return Cloudinary::uploadApi()->upload($image->getRealPath(), [
            'folder' => 'imart/products',
        ])['secure_url'];
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
