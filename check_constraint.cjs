const { Pool } = require('pg');
const p = new Pool({
  user: 'postgres.brrjbrrgmjgbcylpccdz',
  password: 'yd4h@h73CHERIO',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  family: 4
});
(async () => {
  try {
    const r = await p.query(
      "SELECT c.conname, pg_get_constraintdef(c.oid) AS def FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid WHERE t.relname='jenis_pinjaman'"
    );
    console.log(JSON.stringify(r.rows, null, 2));
  } catch (e) {
    console.log('ERR', e.message);
  } finally {
    await p.end();
  }
})();
