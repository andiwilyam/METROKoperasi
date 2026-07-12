const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

// Fix the constraint first
const fixConstraint = `
ALTER TABLE pengajuan_pembiayaan 
DROP CONSTRAINT IF EXISTS pengajuan_pembiayaan_jenis_pembiayaan_check;

ALTER TABLE pengajuan_pembiayaan 
ADD CONSTRAINT pengajuan_pembiayaan_jenis_pembiayaan_check 
CHECK (jenis_pembiayaan IN ('modal_kerja','investasi','ventura','konsumtif','multiguna','modal_ventura'));
`;

const seedData = `
-- Koperasi Info
INSERT INTO koperasi_info (id, nama, alamat, kota, provinsi, telp, email, no_badan_hukum, no_izin_usaha, npwp)
VALUES (1, 'Koperasi Simpan Pinjam MetroMitra', 'Jl. Pemuda No. 45, Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', '(021) 789-0123', 'info@metromitra.co.id', 'AHU-0012345.AH.01.26.TAHUN-2024', 'SITU-503/450/KPPT/2024', '01.234.567.8-012.000')
ON CONFLICT DO NOTHING;

-- Users
INSERT INTO users (id, username, nama_lengkap, role, nik, member_id, is_active, password_hash)
VALUES
  ('1', 'admin', 'Ahmad Syarif', 'admin', NULL, NULL, true, '\$2b\$10\$iauabWmMn9cwQxCGe/XQIOWK95TudKLuPh4/1SC.7vZizfa1Elyyi'),
  ('2', 'operator', 'Budi Raharjo', 'operator', NULL, NULL, true, '\$2b\$10\$iauabWmMn9cwQxCGe/XQIOWK95TudKLuPh4/1SC.7vZizfa1Elyyi'),
  ('3', '1234567890', 'Marmad Tuaian', 'anggota', '1234567890', 'm1', true, '\$2b\$10\$rIuxPVpU83O1TAOJbkTnfub/losSUnek6ZZpJUcPFWTAvH1GP/B8y'),
  ('4', 'hijau_agri', 'PT Hijau Agri Tech', 'anggota_perusahaan', 'hijau_agri', 'ma1', true, '\$2b\$10\$zliQ6FrCcMW60pAD2Xqk9eDuGCj7atU5cTGbJXZ3ZfrMVvO925AVa')
ON CONFLICT (id) DO NOTHING;

-- Anggota perusahaan
INSERT INTO anggota (id, nik, nama, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela, tipe_anggota)
VALUES ('ma1', 'hijau_agri', 'PT Hijau Agri Tech', '0812-9900-1122', 'info@hijauagritech.co.id', 'Jl. Industri Hijau No. 88, Bandung', 'Perusahaan Ventura', 0, 'aktif', '2024-01-01', 0, 0, 0, 'perusahaan')
ON CONFLICT (id) DO NOTHING;

-- Perusahaan
INSERT INTO perusahaan (id, kode_perusahaan, nama, alamat, kota, provinsi, sektor_industri, tahun_berdiri, no_akte_pendirian, npwp, no_izin_usaha, nama_direktur, kontak_direktur, email_perusahaan, telepon, deskripsi, status)
VALUES ('p1', 'P-001', 'PT Hijau Agri Tech', 'Jl. Industri Hijau No. 88', 'Bandung', 'Jawa Barat', 'Pertanian & IoT (Agrotech)', 2019, 'AHU-0098765.AH.01.01.TAHUN-2019', '12.345.678.9-012.000', '503/450/KPPT/2019', 'Dr. Fahmi Idris', '0812-9900-1122', 'info@hijauagritech.co.id', '(022) 543-2109', 'Perusahaan rintisan yang mengembangkan solusi otomatisasi pertanian hidroponik berbasis IoT untuk efisiensi penggunaan air dan pupuk hingga 60%.', 'aktif')
ON CONFLICT (id) DO NOTHING;

-- Pengajuan pembiayaan (must match constraint)
INSERT INTO pengajuan_pembiayaan (id, perusahaan_id, anggota_id, no_pengajuan, jenis_pembiayaan, pokok_pengajuan, tenor_bulan, tujuan_pembiayaan, bunga_diharapkan, status_pengajuan, created_by)
VALUES ('pp_seed_hijau', 'p1', 'ma1', 'PP-SEED-001', 'modal_ventura', 750000000, 36, 'Ekspansi otomatisasi hidroponik IoT', 12, 'disetujui', '4')
ON CONFLICT (id) DO NOTHING;

-- Anggota
INSERT INTO anggota (id, nik, nama, no_ktp, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela)
VALUES
  ('m1', '1234567890', 'Marmad Tuaian', '3174011204850001', '081234567890', 'marmad@gmail.com', 'Jl. Merdeka No. 12, RT 01/RW 03, Pancoran, Jakarta Selatan', 'Karyawan Swasta', 8500000, 'aktif', '2023-01-15', 1000000, 1200000, 3500000),
  ('m2', '1234567891', 'Ahmad Kanh', '3174011508880002', '081398765432', 'ahmadkanh@gmail.com', 'Gg. Musholla No. 4, Kebayoran Lama, Jakarta Selatan', 'Staf IT', 9000000, 'aktif', '2023-03-10', 1000000, 1000000, 1500000),
  ('m3', '1234567892', 'Siti Rahmawati', '3174024509920003', '085712345678', 'siti.rahma@yahoo.com', 'Komp. DDN No. B12, Pondok Labu, Cilandak, Jakarta Selatan', 'Staf Administrasi', 6500000, 'aktif', '2023-05-20', 1000000, 800000, 850000),
  ('m4', '1234567893', 'Hendra Wijaya', '3174032105800004', '081122334455', 'hendra.wijaya@outlook.com', 'Jl. Tebet Barat Dalam Raya No. 44, Tebet, Jakarta Selatan', 'Manajer HRD', 15000000, 'aktif', '2023-06-01', 1000000, 700000, 12500000),
  ('m5', '1234567894', 'Dewi Lestari', '3174045511950005', '087844556677', 'dewi.lestari@gmail.com', 'Jl. Kalibata Timur No. 3A, Pancoran, Jakarta Selatan', 'Staf Keuangan', 7000000, 'aktif', '2023-08-15', 1000000, 600000, 2000000)
ON CONFLICT (id) DO NOTHING;
`;

(async () => {
  try {
    await pool.query(fixConstraint);
    console.log('✅ Constraint fixed');
    
    await pool.query(seedData);
    console.log('✅ Seed data applied');
    
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();