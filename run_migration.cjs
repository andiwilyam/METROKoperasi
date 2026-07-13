const { Pool } = require('pg');
const pool = new Pool({ host:'aws-0-ap-southeast-1.pooler.supabase.com', port:5432, database:'postgres', user:'postgres.brrjbrrgmjgbcylpccdz', password:'yd4h@h73CHERIO', ssl:{rejectUnauthorized:false} });
async function main() {
  const r = await pool.query(`SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid='perusahaan'::regclass AND contype='c'`);
  r.rows.forEach(row => console.log(row.conname, '::', row.def));
}
main().catch(e=>console.error(e.message)).finally(()=>pool.end());
