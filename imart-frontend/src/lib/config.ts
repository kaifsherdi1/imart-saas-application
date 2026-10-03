/**
 * Base URL of the Laravel API (including the /api/v1 prefix).
 * Set NEXT_PUBLIC_API_URL in the deployment environment (e.g. Vercel).
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');
