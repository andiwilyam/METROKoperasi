const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });
(async () => {
  try {
    // Fix check constraint on jenis_pinjaman
    await pool.query("ALTER TABLE jenis_pinjaman DROP CONSTRAINT IF EXISTS jenis_pinjaman_metode_bunga_check;");
    await pool.query("ALTER TABLE jenis_pinjaman ADD CONSTRAINT jenis_pinjaman_metode_bunga_check CHECK (metode_bunga IN ('flat','effective','annuitet','syariah'));");
    console.log('✅ Fixed jenis_pinjaman check constraint');
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();