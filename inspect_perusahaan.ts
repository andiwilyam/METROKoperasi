import fetch from 'node-fetch';
const BASE = 'https://metrocoop-app-production.up.railway.app';
async function main() {
  const lr = await fetch(`${BASE}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:'admin',password:'admin123'}) });
  const lj:any = await lr.json(); const token = lj.token;
  const r = await fetch(`${BASE}/api/data/perusahaan`, { headers:{Authorization:`Bearer ${token}`} });
  const j:any = await r.json();
  const row = j[0];
  console.log('kode_perusahaan:', row.kode_perusahaan);
  console.log('nama_direktur:', row.nama_direktur);
  console.log('kota:', row.kota);
  console.log('provinsi:', row.provinsi);
  console.log('status:', row.status);
  console.log('telepon:', row.telepon);
  console.log('deskripsi:', (row.deskripsi||'').slice(0,50));
}
main().catch(e=>console.error(e));
