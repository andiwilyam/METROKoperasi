const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    const res = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'pengajuan_pembiayaan'");
    console.log('Columns:', res.rows.map(r => r.column_name + ':' + r.data_type + ':' + r.is_nullable).join(', '));
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();