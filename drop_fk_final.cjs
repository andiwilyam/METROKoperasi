const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    // Drop the FK constraints that cause circular dependency
    await pool.query("ALTER TABLE pengajuan_pembiayaan DROP CONSTRAINT IF EXISTS pengajuan_pembiayaan_perusahaan_id_fkey;");
    await pool.query("ALTER TABLE perusahaan DROP CONSTRAINT IF EXISTS perusahaan_pengajuan_id_fkey;");
    console.log('✅ Dropped circular FK constraints');
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();