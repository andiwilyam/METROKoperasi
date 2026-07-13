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
    const fk = await p.query(`
      SELECT tc.constraint_name, tc.table_name, kcu.column_name,
             ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public'
      ORDER BY tc.table_name, tc.constraint_name`);
    console.log('=== FOREIGN KEYS ===');
    for (const r of fk.rows) {
      console.log(`${r.table_name}.${r.column_name} -> ${r.foreign_table}.${r.foreign_column}`);
    }
    const ck = await p.query(`
      SELECT c.conname, t.relname AS tbl, pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
      WHERE c.contype='c' AND t.relnamespace='public'::regnamespace
      ORDER BY t.relname, c.conname`);
    console.log('\n=== CHECK CONSTRAINTS ===');
    for (const r of ck.rows) {
      console.log(`${r.tbl}.${r.conname}: ${r.def}`);
    }
  } catch (e) {
    console.log('ERR', e.message);
  } finally {
    await p.end();
  }
})();
