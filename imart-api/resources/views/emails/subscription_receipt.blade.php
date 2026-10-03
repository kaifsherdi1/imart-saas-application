@extends('emails.layout')

@section('content')
    <h2>Your subscription is active</h2>
    <p>Hi {{ $owner_name }}, thank you for subscribing. <strong>{{ $store_name }}</strong> is now on the {{ $plan_name }} plan.</p>

    <div style="margin: 30px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
        <p style="margin: 0; color: #64748b; font-size: 14px;">Amount paid</p>
        <p class="price">{{ $amount_paid }}</p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">Valid until: {{ $next_billing }}</p>
    </div>

    <a href="{{ config('app.frontend_url') }}/dashboard/billing" class="button">View Billing</a>
@endsection
