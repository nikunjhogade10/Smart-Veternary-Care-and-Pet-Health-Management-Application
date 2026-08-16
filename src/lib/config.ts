export const API_BASE = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';
export const API_PREFIX = '/api/v1';
