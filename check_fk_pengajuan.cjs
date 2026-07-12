const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    const res = await pool.query("SELECT a.attname as column_name, c.confrelid::regclass as ref_table, af.attname as ref_column FROM pg_constraint c JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid WHERE c.conrelid = 'pengajuan_pembiayah'::regclass AND c.contype = 'f'");
    console.log('FK on pengajuan_pembiayah:', res.rows);
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();