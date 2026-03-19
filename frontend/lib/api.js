const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Public fetch — no auth needed.
 * Used by portfolio pages (SSR / ISR).
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/**
 * Authenticated fetch — attaches Firebase ID token.
 * Used by admin dashboard components.
 */
export async function apiAuth(path, token, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
