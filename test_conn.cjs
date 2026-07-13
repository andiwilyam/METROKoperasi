const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres.brrjbrrgmjgbcylpccdz',
  password: 'yd4h@h73CHERIO',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  family: 4,
  connectionTimeoutMillis: 20000
});
(async () => {
  try {
    const r = await pool.query('select count(*)::int as c from anggota');
    console.log('OK anggota count =', r.rows[0].c);
    await pool.end();
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
