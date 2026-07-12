const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    const res = await pool.query("SELECT conname, confrelid::regclass, conrelid::regclass FROM pg_constraint WHERE conrelid = 'perusahaan'::regclass AND contype = 'f'");
    console.log('FK on perusahaan:', res.rows);
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();