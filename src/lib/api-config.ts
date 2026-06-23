export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') {
    return '/api';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return 'http://localhost:3000/api';
}

/** @deprecated Use getApiBaseUrl() — mantido por compatibilidade. */
export const API_BASE_URL = getApiBaseUrl();
