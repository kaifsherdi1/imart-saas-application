<?php

namespace App\Exceptions;

use Exception;

/** Thrown when a user tries to submit a second review for the same entity. */
class AlreadyReviewedException extends Exception
{
    public function __construct()
    {
        parent::__construct('You have already reviewed this.', 409);
    }
}
