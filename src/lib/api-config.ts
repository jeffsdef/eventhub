export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') {
    // Em desenvolvimento local, prioriza a API NestJS na porta 3001
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    return '/api';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
}

/** @deprecated Use getApiBaseUrl() — mantido por compatibilidade. */
export const API_BASE_URL = getApiBaseUrl();
