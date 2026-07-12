const { Pool } = require('pg');
const fs = require('fs');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

const seed = fs.readFileSync('db/seed.sql', 'utf8');

(async () => {
  try {
    await pool.query(seed);
    console.log('✅ Seed applied');
    await pool.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();