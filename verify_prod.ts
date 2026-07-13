import fetch from 'node-fetch';

const BASE = 'https://metrocoop-app-production.up.railway.app';

async function main() {
  // Login
  const lr = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const lj: any = await lr.json();
  console.log('LOGIN:', lr.status, lj.message || 'OK');
  if (!lr.ok) { console.log(lj); return; }
  const token = lj.token;
  console.log('Token:', token?.slice(0, 40) + '...');

  // Test endpoints
  const eps = ['/api/data/perusahaan', '/api/data/pengajuan', '/api/data/venture', '/api/data/venture/pipeline'];
  for (const ep of eps) {
    const r = await fetch(`${BASE}${ep}`, { headers: { Authorization: `Bearer ${token}` } });
    const j: any = await r.json();
    const count = Array.isArray(j) ? j.length : 'n/a';
    console.log(`\n${ep} -> ${r.status} | count: ${count}`);
    if (!r.ok) console.log('  ERROR:', JSON.stringify(j).slice(0, 300));
    if (Array.isArray(j) && j.length > 0) console.log('  sample:', JSON.stringify(j[0]).slice(0, 250));
  }
}
main().catch(e => console.error(e));
