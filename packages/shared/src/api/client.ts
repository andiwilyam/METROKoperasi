import { StorageAdapter } from './storage.js';

let authToken: string | null = null;
let storage: StorageAdapter | null = null;
let apiBase: string = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE) || 'http://192.168.137.1:3000';

export function initApiClient(adapter: StorageAdapter, base?: string) {
  storage = adapter;
  authToken = adapter.getItem('token');
  apiBase = base || (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE) || (adapter as any).__API_BASE__ || apiBase;
}

export function setToken(token: string | null) {
  authToken = token;
  if (token && storage) storage.setItem('token', token);
  else if (storage) storage.removeItem('token');
}

export function getToken() {
  return authToken;
}

const STRING_FIELDS = new Set([
  'id', 'username', 'nik', 'noKtp', 'noHp', 'nomorVa', 'noRef', 'noReferensi',
  'noRekening', 'telp', 'npwp', 'kodeAkun', 'targetNumber', 'sn', 'password',
  'passwordHash', 'memberId', 'anggotaId', 'parentId', 'noJurnal', 'noPinjaman',
  'noFaktur', 'noInvoice', 'noSk', 'kode', 'kontakFounder', 'kontak',
  'bankPengirim', 'jurnalId', 'coa', 'anggotaNama', 'nama', 'namaLengkap',
  'namaAkun', 'createdBy', 'approvedBy', 'reversedBy', 'closedBy'
]);

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      let val = obj[key];
      if (
        typeof val === 'string' &&
        !STRING_FIELDS.has(camelKey) &&
        /^-?\d+(\.\d+)?$/.test(val) &&
        val.length <= 12
      ) {
        val = val.includes('.') ? parseFloat(val) : parseInt(val, 10);
      }
      result[camelKey] = toCamelCase(val);
    }
    return result;
  }
  return obj;
}

async function request<T>(method: string, path: string, body?: any, skipTransform = false): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${apiBase}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err: any = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const json: any = await res.json();
  return skipTransform ? json : toCamelCase(json);
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T>(path: string, body?: any) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export async function login(username: string, password: string) {
  const res = await api.post<{ token: string; user: any }>('/auth/login', { username, password });
  setToken(res.token);
  return res.user;
}
