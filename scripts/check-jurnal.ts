import pool from '../server/db.js';
async function main() {
  const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name ILIKE '%jurnal%'");
  console.log(r.rows);
  await pool.end();
}
main();