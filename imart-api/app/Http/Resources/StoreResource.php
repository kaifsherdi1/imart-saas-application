<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'status' => $this->status,
            'avg_rating' => $this->avg_rating,
            'total_earnings' => $this->total_earnings,
        ];
    }
}
