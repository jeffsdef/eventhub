function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  const isBrowserLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  if (configured && (!isLocalhostUrl(configured) || isBrowserLocalhost)) {
    return configured;
  }

  if (typeof window !== 'undefined') {
    if (isBrowserLocalhost) {
      return 'http://localhost:3001';
    }
    return '/api';
  }

  if (configured) {
    return configured;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();
