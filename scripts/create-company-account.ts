import pool from '../server/db.js';

async function main() {
  const userId = '4';
  const memberId = 'ma1';

  // Contoh pengajuan pembiayaan ventura terhubung ke perusahaan p1 agar portal perusahaan punya data
  await pool.query(
    `INSERT INTO pengajuan_pembiayaan (id, perusahaan_id, anggota_id, no_pengajuan, jenis_pembiayaan, pokok_pengajuan, tenor_bulan, tujuan_pembiayaan, bunga_diharapkan, status_pengajuan, created_by)
     VALUES ($1,'p1',$2,'PP-SEED-001','modal_ventura',750000000,36,'Ekspansi otomatisasi hidroponik IoT',12,'disetujui',$3)
     ON CONFLICT (id) DO NOTHING`,
    ['pp_seed_hijau', memberId, userId]
  );

  // Bersihkan anggota yatim (mp1) yang tidak dirujuk user manapun
  const ref = await pool.query("SELECT 1 FROM users WHERE member_id='mp1'");
  if (ref.rows.length === 0) {
    await pool.query("DELETE FROM anggota WHERE id='mp1'");
    console.log('Orphan anggota mp1 dihapus.');
  }

  console.log('Selesai: akun perusahaan siap (hijau_agri / perusahaan123).');
  await pool.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
