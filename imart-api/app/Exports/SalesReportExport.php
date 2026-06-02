<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Database\Eloquent\Builder;

/**
 * SalesReportExport — generates a professional .xlsx sales report.
 *
 * FromQuery: Streams from DB directly instead of loading all orders into memory.
 * WithStyles: Applies bold headers, blue background, ₹ currency, alternating rows.
 */
class SalesReportExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithTitle, WithColumnWidths
{
    public function __construct(
        private readonly string  $storeId,
        private readonly ?string $startDate = null,
        private readonly ?string $endDate   = null,
    ) {}

    public function query(): Builder
    {
        return Order::with(['items.product', 'user'])
            ->where('store_id', $this->storeId)
            ->when($this->startDate, fn($q) => $q->whereDate('created_at', '>=', $this->startDate))
            ->when($this->endDate,   fn($q) => $q->whereDate('created_at', '<=', $this->endDate));
    }

    public function headings(): array
    {
        return [
            'Order ID', 'Customer Name', 'Product Name',
            'Quantity', 'Price at Purchase (₹)', 'Total (₹)', 'Status', 'Order Date',
        ];
    }

    /** Maps each Order model row to columns. */
    public function map($order): array
    {
        $rows = [];
        foreach ($order->items as $item) {
            $rows[] = [
                $order->id,
                $order->user->name,
                $item->product->name,
                $item->quantity,
                number_format($item->price_at_purchase, 2),
                number_format($item->price_at_purchase * $item->quantity, 2),
                ucfirst($order->status),
                $order->created_at->format('d M Y'),
            ];
        }
        return $rows;
    }

    public function title(): string
    {
        return 'iMart Sales Report';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 40, 'B' => 25, 'C' => 30,
            'D' => 12, 'E' => 22, 'F' => 18,
            'G' => 15, 'H' => 18,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        // Bold header row with blue background
        return [
            1 => [
                'font'    => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill'    => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF1D4ED8']],
            ],
        ];
    }
}
