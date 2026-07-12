const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

(async () => {
  try {
    // Create all missing tables from schema
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
      
      CREATE TABLE IF NOT EXISTS perusahaan (
        id VARCHAR(50) PRIMARY KEY,
        nama_perusahaan VARCHAR(200) NOT NULL,
        nama_founder VARCHAR(200) DEFAULT '',
        sektor_industri VARCHAR(200) DEFAULT '',
        nominal_investasi NUMERIC(15,0) DEFAULT 0,
        persentase_saham NUMERIC(5,2) DEFAULT 0,
        estimasi_dividen NUMERIC(5,2) DEFAULT 0,
        tanggal_investasi DATE DEFAULT NULL,
        tenor_tahun INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pengajuan' CHECK (status IN ('pengajuan','disetujui','dicairkan','selesai','ditolak')),
        deskripsi_bisnis TEXT DEFAULT '',
        kontak_founder VARCHAR(100) DEFAULT '',
        prospektus_url VARCHAR(500) DEFAULT '',
        pengaju_anggota_id VARCHAR(50) DEFAULT NULL,
        pengaju_anggota_nama VARCHAR(200) DEFAULT '',
        pengajuan_id VARCHAR(50) DEFAULT NULL REFERENCES pengajuan_pembiayaan(id)
      );
      
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Missing tables created');
    await pool.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();