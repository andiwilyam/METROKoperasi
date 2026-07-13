import 'dotenv/config';
import fetch from 'node-fetch';

async function main() {
  const base = 'http://localhost:3000';
  // 1. REAL LOGIN exactly like the browser
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const loginJson: any = await loginRes.json();
  console.log('LOGIN status:', loginRes.status);
  if (!loginRes.ok) { console.log('LOGIN error:', loginJson); return; }
  const token = loginJson.token;
  const role = loginJson.user?.role;
  console.log('LOGIN role:', role, '| user:', loginJson.user?.namaLengkap);

  // 2. Hit the venture endpoints with the REAL token (browser uses api client with this token)
  const endpoints = ['/api/data/perusahaan', '/api/data/pengajuan', '/api/data/venture', '/api/data/venture/pipeline'];
  for (const ep of endpoints) {
    const r = await fetch(`${base}${ep}`, { headers: { Authorization: `Bearer ${token}` } });
    const j: any = await r.json();
    const count = Array.isArray(j) ? j.length : (j && Array.isArray(j.data) ? j.data.length : 'n/a(obj)');
    const keys = j && !Array.isArray(j) ? Object.keys(j).join(',') : '';
    console.log(`\n${ep} -> status ${r.status} | count ${count} | ${keys ? 'keys: ' + keys : ''}`);
    if (Array.isArray(j) && j.length > 0) console.log('  sample:', JSON.stringify(j[0]).slice(0, 300));
    if (!r.ok) console.log('  err:', JSON.stringify(j).slice(0, 300));
  }
}
main().catch(e => { console.error(e); process.exit(1); });
