-- MetroMitra Seed Data

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

-- Anggota perusahaan (untuk portal perusahaan / ventura)
INSERT INTO anggota (id, nik, nama, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela, tipe_anggota)
VALUES ('ma1', 'hijau_agri', 'PT Hijau Agri Tech', '0812-9900-1122', 'info@hijauagritech.co.id', 'Jl. Industri Hijau No. 88, Bandung', 'Perusahaan Ventura', 0, 'aktif', '2024-01-01', 0, 0, 0, 'perusahaan')
ON CONFLICT (id) DO NOTHING;

-- Contoh pengajuan pembiayaan ventura milik perusahaan (agar portal perusahaan punya data)
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
  ('jp2', 'Pinjaman Renovasi Rumah (Efektif)', 1.2, 'efektif', 36, 100000000, 100000),
  ('jp3', 'Pinjaman Pendidikan Anak (Flat)', 0.8, 'flat', 12, 15000000, 25000),
  ('jp4', 'Pinjaman Darurat Mikro (Flat)', 1.5, 'flat', 6, 5000000, 10000)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  bunga_persen = EXCLUDED.bunga_persen,
  metode_bunga = EXCLUDED.metode_bunga,
  maks_tenor = EXCLUDED.maks_tenor,
  maks_plafon = EXCLUDED.maks_plafon,
  biaya_admin = EXCLUDED.biaya_admin;

-- Kategori Barang
INSERT INTO kategori_barang (id, nama)
VALUES
  ('cat1', 'Sembako & Kebutuhan Pokok'),
  ('cat2', 'Alat Tulis Kantor (ATK)'),
  ('cat3', 'Makanan & Minuman Ringan'),
  ('cat4', 'Elektronik & Gadget'),
  ('cat5', 'Perlengkapan Rumah Tangga')
ON CONFLICT (id) DO NOTHING;

-- Supplier
INSERT INTO supplier (id, nama, kontak, no_hp, alamat)
VALUES
  ('sup1', 'PT Indofood Makmur Mandiri', 'Hendra Saputra', '081255551111', 'Kawasan Industri Pulogadung, Jakarta Timur'),
  ('sup2', 'CV Atk Jaya Bersama', 'Susi Susanti', '085644442222', 'Mangga Dua Square Blok C No. 45, Jakarta Pusat'),
  ('sup3', 'PT Unilever Indonesia Tbk', 'Manajer Penjualan', '081199993333', 'BSD City Kavling 3, Tangerang')
ON CONFLICT (id) DO NOTHING;

-- Barang
INSERT INTO barang (id, kode, nama, kategori_id, supplier_id, harga_beli, harga_jual, stok, stok_minimum, satuan)
VALUES
  ('b1', 'BRG001', 'Beras Pandan Wangi Premium 5kg', 'cat1', 'sup1', 65000, 78000, 45, 10, 'Pcs'),
  ('b2', 'BRG002', 'Minyak Goreng Sania 2L', 'cat1', 'sup3', 28000, 34500, 60, 15, 'Pcs'),
  ('b3', 'BRG003', 'Gula Pasir Gulaku 1kg', 'cat1', 'sup1', 12500, 16000, 5, 10, 'Pcs'),
  ('b4', 'BRG004', 'Kertas HVS Sinar Dunia A4 80gr', 'cat2', 'sup2', 42000, 51000, 30, 5, 'Ream'),
  ('b5', 'BRG005', 'Pulpen Gel Pilot G2 Black', 'cat2', 'sup2', 12000, 15500, 120, 20, 'Pcs'),
  ('b6', 'BRG006', 'Indomie Goreng Spesial (Kardus)', 'cat1', 'sup1', 98000, 112000, 15, 5, 'Box'),
  ('b7', 'BRG007', 'Powerbank Anker PowerCore 10000mAh', 'cat4', 'sup2', 250000, 320000, 8, 3, 'Pcs'),
  ('b8', 'BRG008', 'Senter LED Rechargeable Philips', 'cat5', 'sup3', 85000, 110000, 2, 5, 'Pcs')
ON CONFLICT (id) DO NOTHING;

-- Venture Investments
INSERT INTO venture_investments (id, nama_perusahaan, sektor_industri, nama_founder, nominal_investasi, persentase_saham, estimasi_dividen, tanggal_investasi, tenor_tahun, status, deskripsi_bisnis, kontak_founder, prospektus_url)
VALUES
  ('vi1', 'PT Hijau Agri Tech', 'Pertanian & IoT (Agrotech)', 'Dr. Fahmi Idris', 150000000, 15, 30, '2025-05-12', 3, 'dicairkan', 'Sistem otomasi pertanian hidroponik hemat air terintegrasi sensor kelembaban tanah', '0812-9900-1122', 'prospektus_agritech.pdf'),
  ('vi2', 'PT Kuliner Nusantara Berkah', 'Makanan & Minuman (F&B)', 'Chef Amri Wijaya', 80000000, 20, 25, '2026-01-20', 2, 'dicairkan', 'Waralaba kedai soto kelapa tradisional madura', '0821-4455-8899', 'prospektus_kuliner.pdf'),
  ('vi3', 'PT Solusi Edu Kreatif', 'Pendidikan Digital (EdTech)', 'Hanan Fitrah, M.A.', 200000000, 10, 15, '2026-07-02', 5, 'pengajuan', 'Aplikasi pembelajaran tajwid & bahasa interaktif bertenaga AI', '0855-8899-0011', 'prospektus_edutech.pdf'),
  ('vi4', 'PT Bambang Baru Bara', 'Energi & Pertambangan', 'Bambang Batubara', 500000000, 8, 35, '2026-03-10', 5, 'dicairkan', 'Penyediaan armada tongkang ramah lingkungan', '0811-7788-9900', 'prospektus_bambang_baru_bara.pdf')
ON CONFLICT (id) DO NOTHING;

-- Venture Dividends
INSERT INTO venture_dividends (id, investment_id, tanggal, nominal_dividen, keterangan)
VALUES
  ('bh1_1', 'vi1', '2025-12-15', 12500000, 'Dividen Siklus Panen Raya 1'),
  ('bh1_2', 'vi1', '2026-06-20', 14200000, 'Dividen Siklus Panen Raya 2'),
  ('bh2_1', 'vi2', '2026-04-30', 6800000, 'Dividen Triwulan I 2026'),
  ('bh4_1', 'vi4', '2026-05-15', 45000000, 'Dividen Ekspor Batubara Siklus I'),
  ('bh4_2', 'vi4', '2026-06-30', 52000000, 'Dividen Kontrak PLN Triwulan II')
ON CONFLICT (id) DO NOTHING;

-- Pengumuman
INSERT INTO pengumuman (id, judul, konten, tipe, target, tanggal_mulai, tanggal_selesai, status)
VALUES
  ('an1', 'Rapat Anggota Tahunan (RAT) Tahun Buku 2025', 'Diberitahukan kepada seluruh anggota Koperasi MetroCOOP bahwa Rapat Anggota Tahunan akan diselenggarakan pada tanggal 25 Juli 2026.', 'pengumuman', 'semua', '2026-07-01', '2026-07-24', 'aktif'),
  ('an2', 'Promo Belanja Akhir Tahun di Toko Koperasi', 'Dapatkan diskon belanja hingga 15% untuk pembelian sembako kumulatif di atas Rp 150.000.', 'promo', 'anggota', '2026-06-10', '2026-07-15', 'aktif')
ON CONFLICT (id) DO NOTHING;

-- Feature Toggles
INSERT INTO feature_toggles (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- Sewa Assets
INSERT INTO sewa_assets (id, nama, kategori, biaya_sewa_per_hari, status, deskripsi)
VALUES
  ('sw1', 'Laptop Lenovo ThinkPad L14', 'Elektronik', 120000, 'Tersedia', 'Core i5, RAM 16GB, cocok untuk laporan keuangan'),
  ('sw2', 'Proyektor Epson EB-X400 3600 Lumens', 'Elektronik', 150000, 'Disewa', 'Resolusi XGA, sangat terang untuk ruang rapat'),
  ('sw3', 'Kursi Lipat Futura (Set isi 50)', 'Peralatan', 200000, 'Tersedia', 'Kursi besi krom kuat lengkap dengan busa tebal'),
  ('sw4', 'Mobil Avanza Operasional Koperasi', 'Kendaraan', 350000, 'Tersedia', 'Transmisi manual, kondisi prima siap luar kota'),
  ('sw5', 'Gedung Serbaguna Graha Koperasi', 'Ruangan', 1200000, 'Tersedia', 'Kapasitas 300 pax, full AC, sound system standard')
ON CONFLICT (id) DO NOTHING;

-- Pinjaman (Loans)
INSERT INTO pinjaman (id, anggota_id, anggota_nama, jenis_pinjaman_id, jenis_nama, no_pinjaman, pokok, tenor_months, bunga_persen, metode_bunga, angsuran_per_bulan, biaya_admin, sisa_pokok, status, tanggal_pengajuan, tanggal_cair)
VALUES
  ('p_1', 'm1', 'Marmad Tuaian', 'jp1', 'Pinjaman Umum Multiguna (Flat)', 'LOAN-2023-001', 12000000, 12, 1.0, 'flat', 1120000, 50000, 4000000, 'dicairkan', '2023-05-01', '2023-05-03'),
  ('p_2', 'm2', 'Ahmad Kanh', 'jp3', 'Pinjaman Pendidikan Anak', 'LOAN-2023-002', 8000000, 8, 0.8, 'flat', 1064000, 25000, 0, 'lunas', '2023-04-10', '2023-04-12'),
  ('p_3', 'm3', 'Siti Rahmawati', 'jp4', 'Pinjaman Darurat Mikro', '', 3000000, 6, 1.5, 'flat', 545000, 10000, 3000000, 'pengajuan', '2026-07-01', NULL)
ON CONFLICT (id) DO NOTHING;

-- Angsuran (Installments for Marmads loan)
INSERT INTO angsuran (id, pinjaman_id, anggota_nama, angsuran_ke, tanggal_jatuh_tempo, pokok_bayar, bunga_bayar, total_bayar, status, tanggal_bayar)
VALUES
  ('a1', 'p_1', 'Marmad Tuaian', 1, '2023-06-03', 1000000, 120000, 1120000, 'lunas', '2023-06-02'),
  ('a2', 'p_1', 'Marmad Tuaian', 2, '2023-07-03', 1000000, 120000, 1120000, 'lunas', '2023-07-01'),
  ('a3', 'p_1', 'Marmad Tuaian', 3, '2023-08-03', 1000000, 120000, 1120000, 'lunas', '2023-08-03'),
  ('a4', 'p_1', 'Marmad Tuaian', 4, '2023-09-03', 1000000, 120000, 1120000, 'lunas', '2023-09-02'),
  ('a5', 'p_1', 'Marmad Tuaian', 5, '2023-10-03', 1000000, 120000, 1120000, 'lunas', '2023-10-03'),
  ('a6', 'p_1', 'Marmad Tuaian', 6, '2023-11-03', 1000000, 120000, 1120000, 'lunas', '2023-11-01'),
  ('a7', 'p_1', 'Marmad Tuaian', 7, '2023-12-03', 1000000, 120000, 1120000, 'lunas', '2023-12-02'),
  ('a8', 'p_1', 'Marmad Tuaian', 8, '2024-01-03', 1000000, 120000, 1120000, 'lunas', '2024-01-02'),
  ('a9', 'p_1', 'Marmad Tuaian', 9, '2024-02-03', 1000000, 120000, 1120000, 'belum_bayar', NULL),
  ('a10', 'p_1', 'Marmad Tuaian', 10, '2024-03-03', 1000000, 120000, 1120000, 'belum_bayar', NULL),
  ('a11', 'p_1', 'Marmad Tuaian', 11, '2024-04-03', 1000000, 120000, 1120000, 'belum_bayar', NULL),
  ('a12', 'p_1', 'Marmad Tuaian', 12, '2024-05-03', 1000000, 120000, 1120000, 'belum_bayar', NULL)
ON CONFLICT (id) DO NOTHING;

-- Simpanan Transaksi
INSERT INTO simpanan_transaksi (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, tanggal, tipe, jumlah, keterangan)
VALUES
  ('st1', 'm1', 'Marmad Tuaian', 'js1', 'Simpanan Pokok', '2023-01-15', 'setor', 1000000, 'Setoran Pokok Awal Keanggotaan'),
  ('st2', 'm1', 'Marmad Tuaian', 'js2', 'Simpanan Wajib Bulanan', '2023-02-15', 'setor', 100000, 'Setoran Wajib Februari 2023'),
  ('st3', 'm1', 'Marmad Tuaian', 'js2', 'Simpanan Wajib Bulanan', '2023-03-15', 'setor', 100000, 'Setoran Wajib Maret 2023'),
  ('st4', 'm1', 'Marmad Tuaian', 'js3', 'Simpanan Sukarela Harian', '2023-04-10', 'setor', 2000000, 'Setor Tabungan Sukarela Tunai'),
  ('st5', 'm1', 'Marmad Tuaian', 'js3', 'Simpanan Sukarela Harian', '2023-05-15', 'tarik', 500000, 'Penarikan Sukarela keperluan Darurat'),
  ('st6', 'm2', 'Ahmad Kanh', 'js1', 'Simpanan Pokok', '2023-03-10', 'setor', 1000000, 'Setoran Pokok Awal Ahmad')
ON CONFLICT (id) DO NOTHING;

-- ============ CHART OF ACCOUNTS (COA) ============
-- Level 1: Kategori Utama
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, is_header) VALUES
('coa1', '1', 'ASET', 'ASET', 'Aktiva', 'debit', 1, true),
('coa2', '2', 'KEWAJIBAN', 'KEWAJIBAN', 'Pasiva', 'kredit', 1, true),
('coa3', '3', 'EKUITAS', 'EKUITAS', 'Pasiva', 'kredit', 1, true),
('coa4', '4', 'PENDAPATAN', 'PENDAPATAN', 'Laba/Rugi', 'kredit', 1, true),
('coa5', '5', 'BEBAN', 'BEBAN', 'Laba/Rugi', 'debit', 1, true),
('coa6', '6', 'SHU', 'SHU', 'Laba/Rugi', 'debit', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Sub Kategori ASET
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header) VALUES
('coa11', '1.1', 'ASET LANCAR', 'ASET', 'Aset Lancar', 'debit', 2, 'coa1', true),
('coa12', '1.2', 'ASET TETAP', 'ASET', 'Aset Tetap', 'debit', 2, 'coa1', true),
('coa13', '1.3', 'ASET LAIN-LAIN', 'ASET', 'Aset Lain', 'debit', 2, 'coa1', true)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Sub Kategori KEWAJIBAN
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header) VALUES
('coa21', '2.1', 'KEWAJIBAN LANCAR', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 2, 'coa2', true),
('coa22', '2.2', 'KEWAJIBAN JANGKA PANJANG', 'KEWAJIBAN', 'Kewajiban Jk. Panjang', 'kredit', 2, 'coa2', true)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Sub Kategori EKUITAS
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header) VALUES
('coa31', '3.1', 'EKUITAS ANGGOTA', 'EKUITAS', 'Modal Anggota', 'kredit', 2, 'coa3', true),
('coa32', '3.2', 'SISA HASIL USAHA', 'EKUITAS', 'SHU', 'kredit', 2, 'coa3', true)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Sub Kategori PENDAPATAN
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header) VALUES
('coa41', '4.1', 'PENDAPATAN OPERASIONAL', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 2, 'coa4', true),
('coa42', '4.2', 'PENDAPATAN NON-OPERASIONAL', 'PENDAPATAN', 'Pend. Non-Operasional', 'kredit', 2, 'coa4', true)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Sub Kategori BEBAN
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header) VALUES
('coa51', '5.1', 'BEBAN OPERASIONAL', 'BEBAN', 'Beban Operasional', 'debit', 2, 'coa5', true),
('coa52', '5.2', 'BEBAN NON-OPERASIONAL', 'BEBAN', 'Beban Non-Operasional', 'debit', 2, 'coa5', true)
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail ASET LANCAR
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1101', '1.1.01', 'Kas Kecil', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1102', '1.1.02', 'Kas Besar', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1103', '1.1.03', 'Bank Mandiri', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1104', '1.1.04', 'Bank BRI', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1105', '1.1.05', 'Bank BNI', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1106', '1.1.06', 'Bank Lainnya', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1107', '1.1.07', 'E-Wallet & QRIS', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11')
ON CONFLICT (id) DO NOTHING;

-- Piutang
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1201', '1.2.01', 'Piutang Pinjaman Anggota - Lancar', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1202', '1.2.02', 'Piutang Pinjaman Anggota - Kurang Lancar', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1203', '1.2.03', 'Piutang Pinjaman Anggota - Diragukan', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1204', '1.2.04', 'Piutang Pinjaman Anggota - Macet', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1205', '1.2.05', 'Piutang Kredit Barang', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1206', '1.2.06', 'Piutang Lain-lain', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11')
ON CONFLICT (id) DO NOTHING;

-- Penyisihan Piutang
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1301', '1.3.01', 'Penyisihan Piutang Lancar', 'ASET', 'Aset Lancar', 'kredit', 3, 'coa11'),
('coa1302', '1.3.02', 'Penyisihan Piutang Kurang Lancar', 'ASET', 'Aset Lancar', 'kredit', 3, 'coa11'),
('coa1303', '1.3.03', 'Penyisihan Piutang Diragukan', 'ASET', 'Aset Lancar', 'kredit', 3, 'coa11'),
('coa1304', '1.3.04', 'Penyisihan Piutang Macet', 'ASET', 'Aset Lancar', 'kredit', 3, 'coa11')
ON CONFLICT (id) DO NOTHING;

-- Persediaan & Biaya Dibayar Dimuka
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1401', '1.4.01', 'Persediaan Barang Dagangan', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1402', '1.4.02', 'Biaya Dibayar Dimuka', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11'),
('coa1403', '1.4.03', 'Pendapatan Yang Akan Diterima', 'ASET', 'Aset Lancar', 'debit', 3, 'coa11')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail ASET TETAP
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1501', '1.5.01', 'Tanah', 'ASET', 'Aset Tetap', 'debit', 3, 'coa12'),
('coa1502', '1.5.02', 'Gedung / Bangunan', 'ASET', 'Aset Tetap', 'debit', 3, 'coa12'),
('coa1503', '1.5.03', 'Kendaraan', 'ASET', 'Aset Tetap', 'debit', 3, 'coa12'),
('coa1504', '1.5.04', 'Peralatan Kantor', 'ASET', 'Aset Tetap', 'debit', 3, 'coa12'),
('coa1505', '1.5.05', 'Inventaris Kantor', 'ASET', 'Aset Tetap', 'debit', 3, 'coa12'),
('coa1506', '1.5.06', 'Akumulasi Penyusutan Gedung', 'ASET', 'Aset Tetap', 'kredit', 3, 'coa12'),
('coa1507', '1.5.07', 'Akumulasi Penyusutan Kendaraan', 'ASET', 'Aset Tetap', 'kredit', 3, 'coa12'),
('coa1508', '1.5.08', 'Akumulasi Penyusutan Peralatan', 'ASET', 'Aset Tetap', 'kredit', 3, 'coa12'),
('coa1509', '1.5.09', 'Akumulasi Penyusutan Inventaris', 'ASET', 'Aset Tetap', 'kredit', 3, 'coa12')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail ASET LAIN
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa1601', '1.6.01', 'Aset Tak Berwujud', 'ASET', 'Aset Lain', 'debit', 3, 'coa13'),
('coa1602', '1.6.02', 'Beban Ditangguhkan', 'ASET', 'Aset Lain', 'debit', 3, 'coa13'),
('coa1603', '1.6.03', 'Investasi Jangka Panjang', 'ASET', 'Aset Lain', 'debit', 3, 'coa13'),
('coa1604', '1.6.04', 'Penyertaan Modal Ventura', 'ASET', 'Aset Lain', 'debit', 3, 'coa13')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail KEWAJIBAN LANCAR
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa2101', '2.1.01', 'Simpanan Pokok Anggota', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2102', '2.1.02', 'Simpanan Wajib Anggota', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2103', '2.1.03', 'Simpanan Sukarela Anggota', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2104', '2.1.04', 'Simpanan Berjangka', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2105', '2.1.05', 'Hutang pada Bank', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2106', '2.1.06', 'Hutang pada Pihak Lain', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2107', '2.1.07', 'Biaya Yang Masih Harus Dibayar', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2108', '2.1.08', 'Hutang Pajak', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21'),
('coa2109', '2.1.09', 'Pendapatan Diterima Dimuka', 'KEWAJIBAN', 'Kewajiban Lancar', 'kredit', 3, 'coa21')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail KEWAJIBAN JANGKA PANJANG
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa2201', '2.2.01', 'Hutang Bank Jangka Panjang', 'KEWAJIBAN', 'Kewajiban Jk. Panjang', 'kredit', 3, 'coa22'),
('coa2202', '2.2.02', 'Kewajiban Imbalan Kerja', 'KEWAJIBAN', 'Kewajiban Jk. Panjang', 'kredit', 3, 'coa22')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail EKUITAS ANGGOTA
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa3101', '3.1.01', 'Modal Dasar Koperasi', 'EKUITAS', 'Modal Anggota', 'kredit', 3, 'coa31'),
('coa3102', '3.1.02', 'Cadangan Koperasi', 'EKUITAS', 'Modal Anggota', 'kredit', 3, 'coa31'),
('coa3103', '3.1.03', 'Donasi / Hibah', 'EKUITAS', 'Modal Anggota', 'kredit', 3, 'coa31'),
('coa3104', '3.1.04', 'Modal Penyertaan', 'EKUITAS', 'Modal Anggota', 'kredit', 3, 'coa31')
ON CONFLICT (id) DO NOTHING;

-- SHU
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa3201', '3.2.01', 'SHU Tahun Berjalan', 'EKUITAS', 'SHU', 'kredit', 3, 'coa32'),
('coa3202', '3.2.02', 'SHU Tahun Lalu (Ditahan)', 'EKUITAS', 'SHU', 'kredit', 3, 'coa32'),
('coa3203', '3.2.03', 'SHU Belum Dibagi', 'EKUITAS', 'SHU', 'kredit', 3, 'coa32')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail PENDAPATAN OPERASIONAL
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa4101', '4.1.01', 'Pendapatan Bunga Pinjaman', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4102', '4.1.02', 'Pendapatan Administrasi Pinjaman', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4103', '4.1.03', 'Pendapatan Jasa Lainnya', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4104', '4.1.04', 'Pendapatan Penjualan Toko', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4105', '4.1.05', 'Pendapatan Unit Sewa', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4106', '4.1.06', 'Pendapatan PPOB / Digital', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4107', '4.1.07', 'Pendapatan Dividen Investasi', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41'),
('coa4108', '4.1.08', 'Pendapatan Jasa Cicilan Barang', 'PENDAPATAN', 'Pend. Operasional', 'kredit', 3, 'coa41')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail PENDAPATAN NON-OPERASIONAL
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa4201', '4.2.01', 'Pendapatan Bunga Bank', 'PENDAPATAN', 'Pend. Non-Operasional', 'kredit', 3, 'coa42'),
('coa4202', '4.2.02', 'Pendapatan Denda', 'PENDAPATAN', 'Pend. Non-Operasional', 'kredit', 3, 'coa42'),
('coa4203', '4.2.03', 'Pendapatan Lain-lain', 'PENDAPATAN', 'Pend. Non-Operasional', 'kredit', 3, 'coa42')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail BEBAN OPERASIONAL
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa5101', '5.1.01', 'Beban Bunga Simpanan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5102', '5.1.02', 'Beban Gaji & Tunjangan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5103', '5.1.03', 'Beban THR & Bonus', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5104', '5.1.04', 'Beban BPJS', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5105', '5.1.05', 'Beban ATK & Perlengkapan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5106', '5.1.06', 'Beban Listrik, Air, Telepon', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5107', '5.1.07', 'Beban Sewa', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5108', '5.1.08', 'Beban Pemeliharaan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5109', '5.1.09', 'Beban Transportasi', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5110', '5.1.10', 'Beban Pemasaran & Promosi', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5111', '5.1.11', 'Beban Pendidikan & Pelatihan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5112', '5.1.12', 'Beban Penyusutan', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5113', '5.1.13', 'Beban Penyisihan Piutang', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5114', '5.1.14', 'Harga Pokok Penjualan (HPP)', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51'),
('coa5115', '5.1.15', 'Beban Operasional Lainnya', 'BEBAN', 'Beban Operasional', 'debit', 3, 'coa51')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail BEBAN NON-OPERASIONAL
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa5201', '5.2.01', 'Beban Pajak', 'BEBAN', 'Beban Non-Operasional', 'debit', 3, 'coa52'),
('coa5202', '5.2.02', 'Beban Bunga Pinjaman Bank', 'BEBAN', 'Beban Non-Operasional', 'debit', 3, 'coa52'),
('coa5203', '5.2.03', 'Beban Non-Operasional Lainnya', 'BEBAN', 'Beban Non-Operasional', 'debit', 3, 'coa52')
ON CONFLICT (id) DO NOTHING;

-- Level 3: Detail SHU
INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id) VALUES
('coa6101', '6.1.01', 'SHU untuk Cadangan', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6102', '6.1.02', 'SHU untuk Anggota', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6103', '6.1.03', 'SHU untuk Pengurus', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6104', '6.1.04', 'SHU untuk Pengawas', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6105', '6.1.05', 'SHU untuk Dana Pendidikan', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6106', '6.1.06', 'SHU untuk Dana Sosial', 'SHU', 'Distribusi SHU', 'debit', 3, NULL),
('coa6107', '6.1.07', 'SHU untuk Pembangunan Daerah', 'SHU', 'Distribusi SHU', 'debit', 3, NULL)
ON CONFLICT (id) DO NOTHING;

-- Accounting Periods (2026)
INSERT INTO accounting_periods (id, tahun, bulan, nama_periode, tanggal_mulai, tanggal_selesai, is_open)
SELECT 'per-' || y::text || '-' || LPAD(m::text, 2, '0'),
       y, m,
       CASE m
         WHEN 1 THEN 'Januari' WHEN 2 THEN 'Februari' WHEN 3 THEN 'Maret'
         WHEN 4 THEN 'April' WHEN 5 THEN 'Mei' WHEN 6 THEN 'Juni'
         WHEN 7 THEN 'Juli' WHEN 8 THEN 'Agustus' WHEN 9 THEN 'September'
         WHEN 10 THEN 'Oktober' WHEN 11 THEN 'November' WHEN 12 THEN 'Desember'
       END || ' ' || y::text,
       make_date(y, m, 1),
       (make_date(y, m, 1) + interval '1 month - 1 day')::date,
       true
FROM generate_series(2026, 2026) y, generate_series(1, 12) m
WHERE NOT EXISTS (SELECT 1 FROM accounting_periods WHERE tahun = y AND bulan = m);

-- ============ PERUSAHAAN (Companies) ============
INSERT INTO perusahaan (id, kode_perusahaan, nama, alamat, kota, provinsi, sektor_industri, tahun_berdiri, no_akte_pendirian, npwp, no_izin_usaha, nama_direktur, kontak_direktur, email_perusahaan, telepon, deskripsi, status)
VALUES
  ('p1', 'P-001', 'PT Hijau Agri Tech', 'Jl. Industri Hijau No. 88', 'Bandung', 'Jawa Barat', 'Pertanian & IoT (Agrotech)', 2019, 'AHU-0098765.AH.01.01.TAHUN-2019', '12.345.678.9-012.000', '503/450/KPPT/2019', 'Dr. Fahmi Idris', '0812-9900-1122', 'info@hijauagritech.co.id', '(022) 543-2109', 'Perusahaan rintisan yang mengembangkan solusi otomatisasi pertanian hidroponik berbasis IoT untuk efisiensi penggunaan air dan pupuk hingga 60%.', 'aktif'),
  ('p2', 'P-002', 'PT Kuliner Nusantara Berkah', 'Jl. Merdeka No. 45', 'Surabaya', 'Jawa Timur', 'Makanan & Minuman (F&B)', 2020, 'AHU-0034567.AH.01.01.TAHUN-2020', '98.765.432.1-012.000', '503/450/KPPT/2020', 'Chef Amri Wijaya', '0821-4455-8899', 'info@kulinerberkah.co.id', '(031) 678-9012', 'Waralaba kedai soto kelapa tradisional Madura dengan sistem rantai pasok bumbu terpusat yang menjaga rasa tetap autentik di 25 cabang.', 'aktif'),
  ('p3', 'P-003', 'PT Solusi Edu Kreatif', 'Jl. Pendidikan No. 12', 'Yogyakarta', 'DI Yogyakarta', 'Pendidikan Digital (EdTech)', 2021, 'AHU-0078901.AH.01.01.TAHUN-2021', '56.789.012.3-456.000', '503/450/KPPT/2021', 'Hanan Fitrah, M.A.', '0855-8899-0011', 'hello@edukreatif.id', '(0274) 234-5678', 'Pengembang aplikasi pembelajaran tajwid dan bahasa Arab interaktif bertenaga AI dengan teknologi pengenal lafal otomatis.', 'aktif'),
  ('p4', 'P-004', 'PT Bambang Baru Bara', 'Jl. Tambang Raya No. 7', 'Samarinda', 'Kalimantan Timur', 'Energi & Pertambangan', 2015, 'AHU-0012345.AH.01.01.TAHUN-2015', '01.234.567.8-012.000', '503/450/KPPT/2015', 'Bambang Batubara', '0811-7788-9900', 'corp@bambangbarubara.co.id', '(0541) 890-1234', 'Penyedia jasa logistik batubara dengan armada tongkang ramah lingkungan dan sistem pengelolaan limbah terintegrasi.', 'aktif'),
  ('p5', 'P-005', 'PT Retail Digital Nusantara', 'Jl. Sudirman Kav. 52', 'Jakarta Pusat', 'DKI Jakarta', 'Teknologi & Retail', 2022, 'AHU-0056789.AH.01.01.TAHUN-2022', '34.567.890.1-234.000', '503/450/KPPT/2022', 'Andi Wirawan', '0813-4455-6677', 'contact@rdigital.id', '(021) 345-6789', 'Platform marketplace B2B untuk produk UMKM nusantara dengan fitur integrasi pembayaran digital dan logistik terpadu.', 'aktif')
ON CONFLICT (id) DO NOTHING;

-- Link venture investments to companies
UPDATE venture_investments SET perusahaan_id = 'p1' WHERE nama_perusahaan = 'PT Hijau Agri Tech' AND perusahaan_id IS NULL;
UPDATE venture_investments SET perusahaan_id = 'p2' WHERE nama_perusahaan = 'PT Kuliner Nusantara Berkah' AND perusahaan_id IS NULL;
UPDATE venture_investments SET perusahaan_id = 'p3' WHERE nama_perusahaan = 'PT Solusi Edu Kreatif' AND perusahaan_id IS NULL;
UPDATE venture_investments SET perusahaan_id = 'p4' WHERE nama_perusahaan = 'PT Bambang Baru Bara' AND perusahaan_id IS NULL;

-- ============ DOKUMEN WAJIB PENGAJUAN ============
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_l1', '', 'LEGALITAS', 'LEG-01', 'Akta Pendirian Perusahaan & Perubahan', 'Akta Notaris termasuk perubahan terakhir, telah disahkan Kemenkumham', 'UU 40/2007 ttg PT, UU 25/1992 ttg Koperasi', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'LEG-01');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_l2', '', 'LEGALITAS', 'LEG-02', 'NIB (Nomor Induk Berusaha)', 'Terbitan OSS-RBA, mencantumkan KBLI sesuai usaha', 'PP 5/2021, Permenkop 11/2018', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'LEG-02');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_l3', '', 'LEGALITAS', 'LEG-03', 'NPWP Badan & Direktur', 'NPWP Perusahaan dan NPWP Penanggung Jawab/Direktur', 'UU PPh 36/2008', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'LEG-03');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_l4', '', 'LEGALITAS', 'LEG-04', 'Izin Usaha / NIB KBLI', 'Izin Usaha sesuai Klasifikasi Baku Lapangan Usaha Indonesia', 'PP 5/2021, Permendag 36/2023', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'LEG-04');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_l5', '', 'LEGALITAS', 'LEG-05', 'SK Domisili Perusahaan', 'Surat Keterangan Domisili dari Kelurahan/Kecamatan setempat', 'Permendagri 4/2010', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'LEG-05');

-- KEUANGAN
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k1', '', 'KEUANGAN', 'KEU-01', 'Laporan Keuangan Audited 2 Tahun', 'Laporan Keuangan yang telah diaudit akuntan publik 2 tahun terakhir', 'Permenkop 15/2015, SAK ETAP', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-01');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k2', '', 'KEUANGAN', 'KEU-02', 'Neraca & Laba Rugi Terbaru', 'Laporan keuangan interim (3 bulan terakhir / triwulan)', 'PSAK/SAK ETAP', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-02');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k3', '', 'KEUANGAN', 'KEU-03', 'Laporan Arus Kas', 'Laporan arus kas 2 tahun terakhir', 'PSAK 2 (2015)', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-03');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k4', '', 'KEUANGAN', 'KEU-04', 'SPT Tahunan PPh Badan (1771)', 'SPT Tahunan 2 tahun pajak terakhir lengkap dengan bukti setor', 'UU PPh 36/2008', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-04');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k5', '', 'KEUANGAN', 'KEU-05', 'Rekening Koran Bank 6 Bulan', 'Mutasi rekening seluruh bank 6-12 bulan terakhir', 'POJK 42/2017', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-05');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k6', '', 'KEUANGAN', 'KEU-06', 'Proyeksi Keuangan 3 Tahun', 'Proyeksi laba rugi, neraca, arus kas 3 tahun ke depan', 'SEOJK 10/2014', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-06');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_k7', '', 'KEUANGAN', 'KEU-07', 'Rencana Penggunaan Dana', 'Rincian alokasi pinjaman untuk CAPEX dan/atau OPEX', 'SEOJK 20/2014', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'KEU-07');

-- AGUNAN
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_a1', '', 'AGUNAN', 'AGU-01', 'Sertifikat Tanah/Bangunan (SHM/SHGB)', 'Sertifikat Hak Milik/Hak Guna Bangunan atas nama pemohon', 'UUHT 4/1996, POJK 40/2019', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'AGU-01');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_a2', '', 'AGUNAN', 'AGU-02', 'BPKB Kendaraan', 'BPKB kendaraan bermotor atas nama pemohon', 'UU Fidusia 42/1999', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'AGU-02');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_a3', '', 'AGUNAN', 'AGU-03', 'Laporan Appraisal Aset', 'Laporan penilai publik untuk aset bernilai > Rp 500 juta', 'POJK 34/2018', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'AGU-03');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_a4', '', 'AGUNAN', 'AGU-04', 'Asuransi Agunan', 'Bukti pertanggungan asuransi atas aset yang diagunkan', 'POJK 74/2016', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'AGU-04');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_a5', '', 'AGUNAN', 'AGU-05', 'Dokumen Pendukung Agunan Lainnya', 'Faktur pembelian, foto aset, bukti kepemilikan tambahan', 'POJK 40/2019', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'AGU-05');

-- TATA KELOLA
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_g1', '', 'TATA_KELOLA', 'GCG-01', 'Susunan Direksi & Komisaris', 'Daftar nama, KTP, NPWP, riwayat hidup Direksi dan Komisaris', 'UU 40/2007', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'GCG-01');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_g2', '', 'TATA_KELOLA', 'GCG-02', 'Daftar Pemegang Saham', 'Komposisi kepemilikan saham, KTP/NPWP masing-masing pemegang saham', 'UU 40/2007', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'GCG-02');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_g3', '', 'TATA_KELOLA', 'GCG-03', 'RUPS / RAT Terakhir', 'Risalah RUPS bagi PT atau RAT bagi Koperasi, termasuk daftar hadir', 'UU 40/2007, UU 25/1992', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'GCG-03');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_g4', '', 'TATA_KELOLA', 'GCG-04', 'Surat Kuasa Khusus', 'Surat kuasa jika pengajuan dilakukan oleh kuasa (bermaterai)', 'KUHPerdata', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'GCG-04');
INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
SELECT 'doc_g5', '', 'TATA_KELOLA', 'GCG-05', 'SK Pengurus KSP', 'Surat Keputusan Pengurus tentang penetapan pengelola KSP', 'Permenkop 11/2018', 'belum'
WHERE NOT EXISTS (SELECT 1 FROM dokumen_pengajuan WHERE kode_dokumen = 'GCG-05');

-- PPOB Layanan
INSERT INTO ppob_layanan (id, nama, tipe, nominal_min, nominal_max, status)
VALUES
  ('pp1', 'Pulsa Seluler (All Operator)', 'Voucher', 5000, 100000, 'Aktif'),
  ('pp2', 'Token Listrik PLN Prabayar', 'Listrik', 20000, 1000000, 'Aktif'),
  ('pp3', 'Pembayaran Tagihan PDAM', 'Tagihan', 30000, 500000, 'Aktif'),
  ('pp4', 'Iuran BPJS Kesehatan', 'Tagihan', 35000, 300000, 'Aktif')
ON CONFLICT (id) DO NOTHING;
