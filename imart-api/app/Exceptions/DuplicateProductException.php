<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class DuplicateProductException extends Exception
{
    public function render($request): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'code' => 422,
            'message' => $this->getMessage(),
        ], 422);
    }
}
