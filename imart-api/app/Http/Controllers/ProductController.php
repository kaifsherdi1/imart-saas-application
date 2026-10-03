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
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $products = $this->productService->getProducts(
            $request->only(['search', 'price_min', 'price_max', 'category', 'store_id', 'sort']),
            (int) $request->input('per_page', 15)
        );
        return ProductResource::collection($products);
    }

    /**
     * List the authenticated owner's own products.
     */
    public function mine(Request $request): AnonymousResourceCollection
    {
        $products = $this->productService->getStoreProducts($request->user()->store->id);
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
        $product = $this->productService->updateProduct($request->user()->store->id, $id, $request->validated());

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
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->productService->deleteProduct($request->user()->store->id, $id);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Restore the specified product.
     */
    public function restore(Request $request, string $id): JsonResponse
    {
        $this->productService->restoreProduct($request->user()->store->id, $id);

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
        $request->validate(['ids' => 'required|array|max:500', 'ids.*' => 'uuid']);
        $count = $this->productService->bulkDeleteProducts($request->user()->store->id, $request->ids);

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
        $request->validate(['ids' => 'required|array|max:500', 'ids.*' => 'uuid']);
        $count = $this->productService->bulkRestoreProducts($request->user()->store->id, $request->ids);

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => "$count products restored successfully",
        ]);
    }
}
