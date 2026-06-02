<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\ProductStoreRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of products.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = $this->productService->getProducts($request->all());
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProductStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['store_id'] = $request->user()->store->id;

        $product = $this->productService->createProduct($data);

        return response()->json([
            'status' => 'success',
            'code' => 201,
            'message' => 'Product created successfully',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * Display the specified product.
     */
    public function show(string $id): JsonResponse
    {
        $product = $this->productService->getProductById($id);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Product retrieved successfully',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(ProductUpdateRequest $request, string $id): JsonResponse
    {
        $product = $this->productService->updateProduct($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->productService->deleteProduct($id);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Restore the specified product.
     */
    public function restore(string $id): JsonResponse
    {
        $this->productService->restoreProduct($id);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Product restored successfully',
        ]);
    }

    /**
     * Bulk remove products.
     */
    public function bulkDestroy(Request $request): JsonResponse
    {
        $request->validate(['ids' => 'required|array']);
        $count = $this->productService->bulkDeleteProducts($request->ids);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => "$count products deleted successfully",
        ]);
    }

    /**
     * Bulk restore products.
     */
    public function bulkRestore(Request $request): JsonResponse
    {
        $request->validate(['ids' => 'required|array']);
        $count = $this->productService->bulkRestoreProducts($request->ids);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => "$count products restored successfully",
        ]);
    }
}
