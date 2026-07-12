const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    // Get all FK constraints on both tables
    const res1 = await pool.query("SELECT conname FROM pg_constraint WHERE conrelid = 'pengajuan_pembiayaan'::regclass AND contype = 'f';");
    console.log('FK on pengajuan_pembiayah:', res1.rows.map(r => r.conname).join(', '));
    
    const res2 = await pool.query("SELECT conname FROM pg_constraint WHERE conrelid = 'perusahaan'::regclass AND contype = 'f';");
    console.log('FK on perusahaan:', res2.rows.map(r => r.conname).join(', '));
    
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();