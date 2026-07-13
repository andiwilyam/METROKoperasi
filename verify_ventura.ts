import 'dotenv/config';
import { generateToken } from './server/middleware.js';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  const token = generateToken({ id: 'verify', memberId: 'verify', role: 'admin', nama: 'Verifier' });
  const headers = { Authorization: `Bearer ${token}` };

  const endpoints = [
    '/api/data/perusahaan',
    '/api/data/pengajuan',
    '/api/data/venture',
    '/api/data/venture/pipeline',
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(BASE + ep, { headers });
      const ct = res.headers.get('content-type') || '';
      let body: any;
      if (ct.includes('application/json')) body = await res.json();
      else body = await res.text();
      const count = Array.isArray(body) ? body.length : (body && body.data ? body.data.length : 'n/a');
      const sample = Array.isArray(body) && body[0] ? JSON.stringify(body[0]).slice(0, 300) : '';
      console.log(`\n[${res.status}] ${ep} -> count=${count}`);
      if (sample) console.log('  sample:', sample);
      if (!res.ok) console.log('  error:', typeof body === 'string' ? body : JSON.stringify(body).slice(0, 200));
    } catch (e: any) {
      console.log(`\n[ERR] ${ep} -> ${e.message}`);
    }
  }
}

main();
