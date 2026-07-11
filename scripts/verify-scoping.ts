import pool from '../server/db.js';

async function main() {
  const rows = await pool.query("SELECT role, member_id FROM users WHERE role IN ('anggota','anggota_perusahaan')");
  console.log('USERS:', JSON.stringify(rows.rows));
  await pool.end();
}

main();