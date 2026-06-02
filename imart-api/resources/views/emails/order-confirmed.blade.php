@extends('emails.layout')

@section('content')
    <h2>Thank you for your purchase!</h2>
    <p>Hi {{ $user->name }}, we've received your order and the store owner is now processing it.</p>
    
    <div style="margin: 30px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
        <p style="margin: 0; color: #64748b; font-size: 14px;">Order Total</p>
        <p class="price">₹{{ number_numeric($total) }}</p>
    </div>

    <p>You can track your order status in your account dashboard.</p>
    
    <a href="{{ config('app.frontend_url') }}/account" class="button">View Order History</a>
@endsection
