const { Pool } = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const pool = new Pool({ connectionString: conn, family: 4, max: 3, connectionTimeoutMillis: 30000 });

// Seed data matching actual schema
const seedData = `
-- Koperasi Info
INSERT INTO koperasi_info (id, nama, alamat, kota, provinsi, telp, email, no_badan_hukum, no_izin_usaha, npwp)
VALUES (1, 'Koperasi Simpan Pinjam MetroMitra', 'Jl. Pemuda No. 45, Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', '(021) 789-0123', 'info@metromitra.co.id', 'AHU-0012345.AH.01.26.TAHUN-2024', 'SITU-503/450/KPPT/2024', '01.234.567.8-012.000')
ON CONFLICT DO NOTHING;

-- Users (password: admin123 for admin/operator, 123456 for member)
INSERT INTO users (id, username, nama_lengkap, role, nik, member_id, is_active, password_hash)
VALUES
  ('1', 'admin', 'Ahmad Syarif', 'admin', NULL, NULL, true, '$2b$10$iauabWmMn9cwQxCGe/XQIOWK95TudKLuPh4/1SC.7vZizfa1Elyyi'),
  ('2', 'operator', 'Budi Raharjo', 'operator', NULL, NULL, true, '$2b$10$iauabWmMn9cwQxCGe/XQIOWK95TudKLuPh4/1SC.7vZizfa1Elyyi'),
  ('3', '1234567890', 'Marmad Tuaian', 'anggota', '1234567890', 'm1', true, '$2b$10$rIuxPVpU83O1TAOJbkTnfub/losSUnek6ZZpJUcPFWTAvH1GP/B8y'),
  ('4', 'hijau_agri', 'PT Hijau Agri Tech', 'anggota_perusahaan', 'hijau_agri', 'ma1', true, '$2b$10$zliQ6FrCcMW60pAD2Xqk9eDuGCj7atU5cTGbJXZ3ZfrMVvO925AVa')
ON CONFLICT (id) DO NOTHING;

-- Anggota perusahaan
INSERT INTO anggota (id, nik, nama, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela, tipe_anggota)
VALUES ('ma1', 'hijau_agri', 'PT Hijau Agri Tech', '0812-9900-1122', 'info@hijauagritech.co.id', 'Jl. Industri Hijau No. 88, Bandung', 'Perusahaan Ventura', 0, 'aktif', '2024-01-01', 0, 0, 0, 'perusahaan')
ON CONFLICT (id) DO NOTHING;

-- Perusahaan (insert first for FK)
INSERT INTO perusahaan (id, nama_perusahaan, nama_founder, sektor_industri, nominal_investasi, persentase_saham, estimasi_dividen, tanggal_investasi, tenor_tahun, status, deskripsi_bisnis, kontak_founder, prospektus_url, pengaju_anggota_id, pengaju_anggota_nama, pengajuan_id)
VALUES ('p1', 'PT Hijau Agri Tech', 'Dr. Fahmi Idris', 'Pertanian & IoT (Agrotech)', 750000000, 15.0, 12.0, '2024-01-15', 3, 'disetujui', 'Perusahaan rintisan yang mengembangkan solusi otomatisasi pertanian hidroponik berbasis IoT untuk efisiensi penggunaan air dan pupuk hingga 60%.', '0812-9900-1122', '', 'ma1', 'PT Hijau Agri Tech', 'pp_seed_hijau')
ON CONFLICT (id) DO NOTHING;

-- Pengajuan pembiayaan
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

-- Pengurus
INSERT INTO pengurus (id, nik, nama, jabatan, periode_mulai, periode_selesai, no_sk, no_hp, status)
VALUES
  ('p1', '3174011212750001', 'Ir. H. Supriyanto, M.M.', 'Ketua Pengurus', '2024-01-01', '2027-12-31', 'SK-001/M-COOP/I/2024', '081299008822', 'aktif'),
  ('p2', '3174011405800002', 'Riana Safitri, S.E.', 'Bendahara Koperasi', '2024-01-01', '2027-12-31', 'SK-002/M-COOP/I/2024', '081377443311', 'aktif')
ON CONFLICT (id) DO NOTHING;

-- Karyawan
INSERT INTO karyawan (id, nik, nama, jabatan, departemen, no_hp, gaji_pokok, status, status_aktif)
VALUES
  ('k1', '3174021203900001', 'Yulianto Saputro', 'Kasir Utama & POS', 'Unit Toko Perdagangan', '085699001122', 4800000, 'tetap', true),
  ('k2', '3174022511920002', 'Siska Amelia', 'Staf Administrasi Pinjaman', 'Keuangan & Pembiayaan', '081266554433', 4500000, 'tetap', true)
ON CONFLICT (id) DO NOTHING;

-- Aset Barang
INSERT INTO aset_barang (id, kode, nama, kategori, harga_perolehan, nilai_residu, masa_manfaat, kondisi, lokasi)
VALUES
  ('as1', 'AST-001', 'Gedung Kantor Ruko Kebayoran', 'Bangunan', 850000000, 100000000, 20, 'Baik', 'Ruko Kebayoran Square Blok A-2'),
  ('as2', 'AST-002', 'Komputer Server ASUS TS100', 'Elektronik', 18500000, 1500000, 5, 'Baik', 'Ruang Server Kantor Utama'),
  ('as3', 'AST-003', 'Motor Honda Vario 160 Operasional', 'Kendaraan', 26500000, 5000000, 8, 'Baik', 'Parkir Kantor Utama')
ON CONFLICT (id) DO NOTHING;

-- Sumber Bayar
INSERT INTO sumber_bayar (id, nama, tipe, no_rekening, akun_coa)
VALUES
  ('sb1', 'Kas Kecil Tunai', 'Tunai', '', '1101'),
  ('sb2', 'Bank Mandiri Kantor Cabang', 'Transfer Bank', '123-00-0987654-3', '1102'),
  ('sb3', 'E-Wallet DANA Merchant', 'E-Wallet', '081234567890', '1104'),
  ('sb4', 'QRIS Bank Indonesia', 'QRIS', '90823402804', '1105')
ON CONFLICT (id) DO NOTHING;

-- Jenis Simpanan
INSERT INTO jenis_simpanan (id, nama, tipe, minimal_setoran, bunga_persen)
VALUES
  ('js1', 'Simpanan Pokok', 'pokok', 1000000, 0),
  ('js2', 'Simpanan Wajib Bulanan', 'wajib', 100000, 0),
  ('js3', 'Simpanan Sukarela Harian', 'sukarela', 10000, 2),
  ('js4', 'Deposito Berjangka MetroSafe', 'deposito', 5000000, 5)
ON CONFLICT (id) DO NOTHING;

-- Jenis Pinjaman
INSERT INTO jenis_pinjaman (id, nama, bunga_persen, metode_bunga, maks_tenor, maks_plafon, biaya_admin)
VALUES
  ('jp1', 'Pinjaman Umum Multiguna (Flat)', 1.0, 'flat', 24, 50000000, 50000),
  ('jp2', 'Pinjaman KPR Syariah (Effective)', 0.75, 'effective', 120, 500000000, 100000),
  ('jp3', 'Pinjaman Ventura/UMKM', 1.2, 'flat', 36, 200000000, 75000)
ON CONFLICT (id) DO NOTHING;
`;

(async () => {
  try {
    await pool.query(seedData);
    console.log('✅ Seed data applied');
    await pool.end();
  } catch (e) { console.error('❌', e.message); process.exit(1); }
})();