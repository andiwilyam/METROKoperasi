const BASE = 'https://metrocoop-app-production.up.railway.app';
let token = '', passed = 0, failed = 0;

async function test(label, url, opts = {}) {
  try {
    const r = await fetch(url, { headers: { ...(token ? {Authorization:`Bearer ${token}`} : {}), ...opts.headers }, ...opts });
    const text = await r.text();
    let j;
    try { j = JSON.parse(text); } catch { j = null; }
    if (r.ok && j !== null) {
      const count = Array.isArray(j) ? j.length : (j?.pengajuan ? `${j.pengajuan.length}+${j.venture.length}` : (j?.rows ? j.rows.length : (j?.status ? 'ok' : '?')));
      console.log(`✅ ${label.padEnd(45)} ${String(count).padStart(8)} rows`);
      passed++;
      return j;
    }
    console.log(`❌ ${label} (${r.status}): ${text.slice(0,100)}`);
    failed++;
    return null;
  } catch(e) { console.log(`❌ ${label}: ${e.message}`); failed++; return null; }
}

(async () => {
  console.log('=== COMPREHENSIVE API DATA CHECK (PRODUCTION) ===\n');
  
  // Health
  await test('GET /api/health', `${BASE}/api/health`);
  
  // Login
  const l = await test('POST /api/auth/login', `${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:'admin',password:'admin123'})
  });
  if (l?.token) token = l.token; else { console.log('\n❌ LOGIN FAILED — aborting'); process.exit(1); }

  // All DATA endpoints
  const eps = [
    ['GET /api/data/anggota', ''],             // 40 rows
    ['GET /api/data/perusahaan', ''],           // 8 rows
    ['GET /api/data/pengajuan', ''],            // 12 rows
    ['GET /api/data/venture', ''],              // 8 rows
    ['GET /api/data/venture/pipeline', ''],     // obj
    ['GET /api/data/jurnal', ''],               // 926 rows
    ['GET /api/data/jenis-simpanan', ''],
    ['GET /api/data/simpanan-transaksi', ''],
    ['GET /api/data/jenis-pinjaman', ''],
    ['GET /api/data/pinjaman', ''],
    ['GET /api/data/angsuran', ''],
    ['GET /api/data/barang', ''],
    ['GET /api/data/kategori-barang', ''],
    ['GET /api/data/supplier', ''],
    ['GET /api/data/penjualan', ''],
    ['GET /api/data/pembelian', ''],
    ['GET /api/data/coa', ''],
    ['GET /api/data/tiket', ''],
    ['GET /api/data/rekening-transfer', ''],
    ['GET /api/data/sewa-asset', ''],
    ['GET /api/data/sewa-transaksi', ''],
    ['GET /api/data/ppob-layanan', ''],
    ['GET /api/data/ppob-transaksi', ''],
    ['GET /api/data/va', ''],
    ['GET /api/data/va-transaksi', ''],
    ['GET /api/data/cicilan-barang', ''],
    ['GET /api/data/cicilan-angsuran', ''],
    ['GET /api/pengumuman', ''],
  ];
  
  for (const [label] of eps) {
    await test(label, `${BASE}${label}`);
  }

  // Verify anggota fields (camelCase check)
  const anggota = await test('ANGGOTA FIELD CHECK', `${BASE}/api/data/anggota`);
  if (anggota?.[0]) {
    const a = anggota[0];
    const fields = [
      ['statusKeanggotaan', a.statusKeanggotaan === 'aktif'],
      ['noHp', typeof a.noHp === 'string'],
      ['noKtp', typeof a.noKtp === 'string'],
      ['tanggalDaftar', typeof a.tanggalDaftar === 'string'],
      ['saldoSimpananPokok', typeof a.saldoSimpananPokok === 'number'],
    ];
    for (const [f, ok] of fields) console.log(`  ${ok?'✅':'❌'} anggota.${f}`);
  }

  // Verify venture data
  const venture = await test('VENTURE FIELD CHECK', `${BASE}/api/data/venture`);
  if (venture?.[0]) {
    console.log(`  Venture keys: ${Object.keys(venture[0]).slice(0,12).join(', ')}`);
  }

  // Verify perusahaan data
  const perusahaan = await test('PERUSAHAAN FIELD CHECK', `${BASE}/api/data/perusahaan`);
  if (perusahaan?.[0]) {
    console.log(`  Perusahaan keys: ${Object.keys(perusahaan[0]).slice(0,10).join(', ')}`);
  }

  // Login as other roles
  await test('Login operator', `${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:'operator',password:'admin123'})
  });
  await test('Login anggota (NIK)', `${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:'1234567890',password:'123456'})
  });

  console.log(`\n✅ PASS: ${passed} | ❌ FAIL: ${failed}`);
  if (failed > 0) process.exit(1);
})();
