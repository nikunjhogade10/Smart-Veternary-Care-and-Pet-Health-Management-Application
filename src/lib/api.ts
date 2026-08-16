import { API_BASE, API_PREFIX } from './config';
import { clearSession, getStoredToken } from './session';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  const body = init.body;
  if (body != null && typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const url = `${API_BASE}${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401 && token) {
    clearSession();
  }
  return res;
}
