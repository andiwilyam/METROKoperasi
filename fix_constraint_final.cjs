const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

(async () => {
  try {
    await pool.query("ALTER TABLE pengajuan_pembiayaan DROP CONSTRAINT IF EXISTS pengajuan_pembiayaan_jenis_pembiayaan_check;");
    await pool.query("ALTER TABLE pengajuan_pembiayah ADD CONSTRAINT pengajuan_pembiayah_jenis_pembiayaan_check CHECK (jenis_pembiayaan IN ('modal_kerja','investasi','ventura','konsumtif','multiguna','modal_ventura'));");
    console.log('✅ Fixed check constraint');
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();