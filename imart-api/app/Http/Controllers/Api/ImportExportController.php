<?php

namespace App\Http\Controllers\Api;

use App\Exports\SalesReportExport;
use App\Http\Controllers\Controller;
use App\Imports\ProductImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ImportExportController extends Controller
{
    /**
     * GET /api/v1/products/import/template
     * Returns a blank .xlsx file with correct column headers.
     */
    public function downloadTemplate(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Stream a blank sheet with the expected headers straight to the client
        return Excel::download(
            new class implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
                public function array(): array { return []; }
                public function headings(): array { return ['name', 'price', 'stock', 'category', 'description']; }
            },
            'imart_product_template.xlsx'
        );
    }

    /**
     * POST /api/v1/products/import
     * Validates the uploaded file, then dispatches the import as a queued job.
     * Returns 202 Accepted immediately — the import runs in the background.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv|max:10240', // max 10 MB
        ]);

        $storeId = $request->user()->store->id;

        // Store the file on the private disk until the queued import processes it
        $path = $request->file('file')->store("imports/{$storeId}", 'local');

        // Queue the import job — owner gets email/notification when complete
        Excel::queueImport(new ProductImport($storeId), $path, 'local');

        return response()->json([
            'status'  => 'processing',
            'code'    => 202,
            'message' => 'Your products are being imported. You will be notified when complete.',
        ], 202);
    }

    /**
     * GET /api/v1/reports/sales/export
     * Streams a .xlsx sales report for the authenticated store owner.
     */
    public function exportSalesReport(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
        ]);

        $store    = $request->user()->store;
        $filename = "imart-sales-{$store->slug}-" . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(
            new SalesReportExport(
                storeId:   $store->id,
                startDate: $request->start_date,
                endDate:   $request->end_date,
            ),
            $filename
        );
    }
}
