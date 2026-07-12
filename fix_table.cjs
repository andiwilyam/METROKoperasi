const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pengajuan_pembiayaan (
        id VARCHAR(50) PRIMARY KEY,
        anggota_id VARCHAR(50) NOT NULL,
        anggota_nama VARCHAR(200) NOT NULL,
        no_pengajuan VARCHAR(100) UNIQUE NOT NULL,
        jenis_pembiayaan VARCHAR(50) DEFAULT 'modal_kerja' CHECK (jenis_pembiayaan IN ('modal_kerja','investasi','ventura','konsumtif','multiguna')),
        pokok_pengajuan NUMERIC(15,0) NOT NULL,
        tenor_bulan INTEGER NOT NULL,
        tujuan_pembiayaan TEXT DEFAULT '',
        bunga_diharapkan NUMERIC(5,2) DEFAULT 0,
        status_pengajuan VARCHAR(20) DEFAULT 'pengajuan' CHECK (status_pengajuan IN ('pengajuan','disetujui','ditolak','dicairkan','lunas')),
        created_by VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ pengajuan_pembiayaan created');
    await pool.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();