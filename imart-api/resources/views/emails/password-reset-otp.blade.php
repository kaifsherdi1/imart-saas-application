@extends('emails.layout')

@section('content')
    <h2>Password reset code</h2>
    <p>Hi {{ $user->name }}, use the code below to reset your iMart password. It expires in 10 minutes.</p>

    <div style="margin: 30px 0; padding: 20px; background: #f1f5f9; border-radius: 12px; text-align: center;">
        <p class="price" style="letter-spacing: 8px; margin: 0;">{{ $otp }}</p>
    </div>

    <p>If you didn't request this, you can safely ignore this email.</p>
@endsection
