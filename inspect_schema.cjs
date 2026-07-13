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
      `SELECT table_name, column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_schema='public'
       ORDER BY table_name, ordinal_position`
    );
    const byTable = {};
    for (const row of r.rows) {
      (byTable[row.table_name] = byTable[row.table_name] || []).push(row.column_name + ':' + row.data_type);
    }
    for (const t of Object.keys(byTable).sort()) {
      console.log('\n### ' + t);
      console.log(byTable[t].join(' | '));
    }
  } catch (e) {
    console.log('ERR', e.message);
  } finally {
    await p.end();
  }
})();
