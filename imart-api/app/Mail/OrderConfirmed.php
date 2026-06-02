<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public $user,
        public $total
    ) {}

    public function build()
    {
        return $this->subject('Order Confirmed - iMart')
                    ->view('emails.order-confirmed');
    }
}
