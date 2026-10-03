# Deploying iMart

iMart is two apps that are deployed separately:

| App | Folder | Host on | Example URL |
|---|---|---|---|
| API (Laravel 11, PHP 8.3/8.4) | `imart-api/` | Any PHP host: Laravel Cloud, Forge + VPS, Render, Railway | `https://api.your-domain.com` |
| Frontend (Next.js 16) | `imart-frontend/` | Vercel | `https://your-domain.com` |

Deploy the **API first**, because the frontend needs its URL at build time.

## 1. API (`imart-api`)

**Requirements:** PHP 8.3 or 8.4 (PhpSpreadsheet does not support 8.5 yet), PostgreSQL or MySQL, Composer.
Redis is recommended for the cache and queue.

**Environment** (see `imart-api/.env.example` for the full list):

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=            # php artisan key:generate --show
APP_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
DB_CONNECTION=pgsql
DB_URL=postgres://user:pass@host:5432/imart
QUEUE_CONNECTION=database   # or redis
CACHE_STORE=database        # or redis
LOG_CHANNEL=stderr
LOG_LEVEL=warning
MAIL_MAILER=smtp            # plus MAIL_HOST / MAIL_USERNAME / MAIL_PASSWORD / MAIL_FROM_ADDRESS
ADMIN_EMAIL=you@your-domain.com
ADMIN_PASSWORD=<strong password>
STRIPE_KEY=... STRIPE_SECRET=... STRIPE_WEBHOOK_SECRET=...
CLOUDINARY_URL=cloudinary://key:secret@cloud
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URL=https://api.your-domain.com/api/v1/auth/google/callback
```

**Build / release commands:**

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force          # first deploy only: subscription plans + admin user
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Processes to keep running:**

- Web: serve `public/` (nginx + php-fpm, or the platform default).
- Queue worker: `php artisan queue:work --tries=3`. Product imports and receipt emails depend on it.
- Scheduler: run `php artisan schedule:run` every minute (cron). It suspends stores whose trial has expired.

**Stripe:** add a webhook endpoint `https://api.your-domain.com/api/v1/webhooks/stripe` for the events
`checkout.session.completed` and `customer.subscription.deleted`, then copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

**File storage:** KYC and EMI documents are stored on the private `local` disk (`storage/app/private`).
On hosts with an ephemeral filesystem (Render, Railway, containers), attach a persistent volume at
`storage/`, or switch these uploads to an S3 disk.

## 2. Frontend (`imart-frontend`) on Vercel

1. Import the repo and set **Root Directory** to `imart-frontend` (framework preset: Next.js).
2. Under **Settings → Environment Variables**, add
   `NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1`.
3. Deploy. Changing the variable later requires a redeploy, because it is inlined at build time.

If the site will also be reached from another domain (for example a custom domain as well as the `*.vercel.app` URL),
add that origin to the API's `CORS_ALLOWED_ORIGINS` (comma-separated).

## 3. Smoke test after deploying

- `GET https://api.your-domain.com/up` returns 200.
- The home page lists products, and the browser console shows no CORS errors.
- Log in as the admin, then approve a store at `/admin/stores`.
- "Forgot password" sends an email (check the mail provider's logs).
