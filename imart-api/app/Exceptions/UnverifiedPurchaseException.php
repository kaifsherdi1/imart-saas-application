<?php

namespace App\Exceptions;

use Exception;

/** Thrown when a user tries to review a product they haven't purchased. */
class UnverifiedPurchaseException extends Exception
{
    public function __construct()
    {
        parent::__construct('You can only review products from a delivered order.', 403);
    }
}
