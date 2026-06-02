@extends('emails.layout')

@section('content')
    <h2 style="color: #e11d48;">Your Trial is Expiring Soon!</h2>
    <p>Hi {{ $owner->name }}, your 30-day free trial for <strong>{{ $store->name }}</strong> will end in 3 days.</p>
    
    <p>To avoid any service interruption and keep your store visible to customers, please select a subscription plan today.</p>

    <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #2563eb; background: #eff6ff;">
        <p style="margin: 0; font-weight: bold;">Why upgrade?</p>
        <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
            <li>Unlimited Product Listings</li>
            <li>Professional Analytics Dashboard</li>
            <li>Advanced SEO Tools</li>
        </ul>
    </div>
    
    <a href="{{ config('app.frontend_url') }}/dashboard/billing" class="button">Choose a Plan</a>
@endsection
