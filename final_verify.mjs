const BASE = 'https://metrocoop-app-production.up.railway.app';
let token = '', passed = 0, failed = 0;

async function test(label, url, opts = {}) {
  try {
    const r = await fetch(url, { headers: { ...(token ? {Authorization:`Bearer ${token}`} : {}), ...opts.headers }, ...opts });
    const text = await r.text();
    let j; try { j = JSON.parse(text); } catch { j = null; }
    if (r.ok && j !== null) {
      const count = Array.isArray(j) ? j.length : (j?.pengajuan ? `${j.pengajuan.length}+${j.venture.length}` : 'ok');
      console.log(`✅ ${label.padEnd(45)} ${String(count).padStart(8)} rows`);
      passed++; return j;
    }
    console.log(`❌ ${label} (${r.status}): ${text.slice(0,100)}`);
    failed++; return null;
  } catch(e) { console.log(`❌ ${label}: ${e.message}`); failed++; return null; }
}

(async () => {
  console.log('=== FINAL PRODUCTION VERIFICATION ===\n');
  await test('GET /api/health', `${BASE}/api/health`);
  const l = await test('POST /api/auth/login', `${BASE}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'admin',password:'admin123'}) });
  if (!l?.token) { console.log('\n❌ LOGIN FAILED'); process.exit(1); }
  token = l.token;

  const eps = [
    ['GET /data/anggota', '/api/data/anggota'],
    ['GET /data/perusahaan', '/api/data/perusahaan'],
    ['GET /data/pengajuan', '/api/data/pengajuan'],
    ['GET /data/venture', '/api/data/venture'],
    ['GET /data/venture/pipeline', '/api/data/venture/pipeline'],
    ['GET /data/jurnal', '/api/data/jurnal'],
    ['GET /data/jenis-simpanan', '/api/data/jenis-simpanan'],
    ['GET /data/simpanan-transaksi', '/api/data/simpanan-transaksi'],
    ['GET /data/jenis-pinjaman', '/api/data/jenis-pinjaman'],
    ['GET /data/pinjaman', '/api/data/pinjaman'],
    ['GET /data/angsuran', '/api/data/angsuran'],
    ['GET /data/barang', '/api/data/barang'],
    ['GET /data/kategori-barang', '/api/data/kategori-barang'],
    ['GET /data/supplier', '/api/data/supplier'],
    ['GET /data/penjualan', '/api/data/penjualan'],
    ['GET /data/pembelian', '/api/data/pembelian'],
    ['GET /data/coa', '/api/data/coa'],
    ['GET /data/tiket', '/api/data/tiket'],
    ['GET /data/rekening-transfer', '/api/data/rekening-transfer'],
    ['GET /data/sewa-asset', '/api/data/sewa-asset'],
    ['GET /data/sewa-transaksi', '/api/data/sewa-transaksi'],
    ['GET /data/ppob-layanan', '/api/data/ppob-layanan'],
    ['GET /data/ppob-transaksi', '/api/data/ppob-transaksi'],
    ['GET /data/va', '/api/data/va'],
    ['GET /data/va-transaksi', '/api/data/va-transaksi'],
    ['GET /data/cicilan-barang', '/api/data/cicilan-barang'],
    ['GET /data/cicilan-angsuran', '/api/data/cicilan-angsuran'],
    ['GET /api/pengumuman', '/api/pengumuman'],
  ];

  for (const [label, ep] of eps) await test(label, `${BASE}${ep}`);

  // CamelCase verification
  console.log('\n=== CAMELCASE VERIFICATION ===');
  const anggota = await test('Anggota fields', `${BASE}/api/data/anggota`);
  if (anggota?.[0]) {
    const a = anggota[0];
    ['statusKeanggotaan','noHp','noKtp','tanggalDaftar','saldoSimpananPokok'].forEach(f => console.log(`  ${a[f]!==undefined?'✅':'❌'} anggota.${f}`));
  }

  const venture = await test('Venture fields', `${BASE}/api/data/venture`);
  if (venture?.[0]) {
    const v = venture[0];
    ['namaPerusahaan','sektorIndustri','namaFounder','nominalInvestasi','persentaseSaham','estimasiDividen','tanggalInvestasi','tenorTahun'].forEach(f => console.log(`  ${v[f]!==undefined?'✅':'❌'} venture.${f}`));
  }

  const perusahaan = await test('Perusahaan fields', `${BASE}/api/data/perusahaan`);
  if (perusahaan?.[0]) {
    const p = perusahaan[0];
    ['namaFounder','sektorIndustri','nominalInvestasi','persentaseSaham','estimasiDividen','tanggalInvestasi','tenorTahun'].forEach(f => console.log(`  ${p[f]!==undefined?'✅':'❌'} perusahaan.${f}`));
  }

  const pipeline = await test('Pipeline fields', `${BASE}/api/data/venture/pipeline`);
  if (pipeline?.venture?.[0]) {
    const v = pipeline.venture[0];
    ['namaPerusahaan','sektorIndustri','nominalInvestasi','pokokPengajuan'].forEach(f => console.log(`  ${v[f]!==undefined?'✅':'❌'} pipeline.venture.${f}`));
  }

  console.log(`\n✅ PASS: ${passed} | ❌ FAIL: ${failed}`);
  if (failed > 0) process.exit(1);
})();