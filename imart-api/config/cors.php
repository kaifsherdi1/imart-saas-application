<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Only the frontend origin(s) may call the API from a browser. Set
    | FRONTEND_URL in the environment; CORS_ALLOWED_ORIGINS (comma-separated)
    | adds further origins, e.g. a custom domain alongside the Vercel URL.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        fn ($origin) => rtrim(trim($origin), '/'),
        array_merge(
            [env('FRONTEND_URL', 'http://localhost:3000')],
            explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
        )
    ))),

    'allowed_origins_patterns' => array_values(array_filter(
        explode(',', (string) env('CORS_ALLOWED_ORIGIN_PATTERNS', ''))
    )),

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Disposition'],

    'max_age' => 3600,

    // Auth uses Bearer tokens, not cookies.
    'supports_credentials' => false,

];
