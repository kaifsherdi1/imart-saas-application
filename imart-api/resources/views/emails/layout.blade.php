<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #2563eb; padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; }
        .content { padding: 40px; line-height: 1.6; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        .price { font-size: 24px; font-weight: bold; color: #0f172a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>iMart<span>.</span></h1>
        </div>
        <div class="content">
            @yield('content')
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} iMart SaaS Marketplace. All rights reserved.
        </div>
    </div>
</body>
</html>
