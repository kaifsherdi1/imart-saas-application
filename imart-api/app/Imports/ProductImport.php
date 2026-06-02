<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Str;

/**
 * ProductImport — handles bulk product upload from Excel.
 *
 * WithChunkReading: Processes the file 100 rows at a time.
 * Without chunking, a 1,000-row file would exhaust PHP memory.
 * Each chunk is processed, saved, and cleared from memory before
 * the next chunk loads — keeping memory usage flat regardless of file size.
 *
 * ShouldQueue: The entire import is dispatched as a background job.
 * The HTTP request returns 202 Accepted immediately; the worker handles the rest.
 */
class ProductImport implements ToModel, WithHeadingRow, WithChunkReading, WithValidation, ShouldQueue
{
    public int $imported           = 0;
    public int $skipped_duplicates = 0;
    public int $failed_validation  = 0;

    public function __construct(private readonly string $storeId) {}

    public function chunkSize(): int
    {
        return 100;
    }

    /**
     * Maps each Excel row to a Product model.
     * Uses firstOrCreate scoped to store_id to prevent duplicates.
     */
    public function model(array $row): ?Product
    {
        // firstOrCreate: if a product with the same name exists in this store, skip it.
        [$product, $created] = [
            Product::firstOrCreate(
                ['store_id' => $this->storeId, 'name' => $row['name']],
                [
                    'id'          => Str::uuid(),
                    'description' => $row['description'] ?? '',
                    'price'       => $row['price'],
                    'stock'       => $row['stock'],
                    'category'    => $row['category'],
                    'slug'        => Str::slug($row['name']) . '-' . Str::random(6),
                ]
            ),
            false,
        ];

        // Check if it was newly created or already existed
        if ($product->wasRecentlyCreated) {
            $this->imported++;
        } else {
            $this->skipped_duplicates++;
        }

        return null; // Return null because firstOrCreate already handles persistence
    }

    /** Validation rules applied to every row before model() is called. */
    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric|min:0.01',
            'stock'    => 'required|integer|min:0',
            'category' => 'required|string|in:electronics,fashion,home,food,sports,other',
        ];
    }
}
