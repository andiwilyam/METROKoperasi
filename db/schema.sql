-- MetroMitra Database Schema
-- PostgreSQL 16

CREATE TABLE IF NOT EXISTS koperasi_info (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL DEFAULT 'Koperasi Simpan Pinjam MetroMitra',
  alamat TEXT DEFAULT '',
  kota VARCHAR(100) DEFAULT '',
  provinsi VARCHAR(100) DEFAULT '',
  telp VARCHAR(50) DEFAULT '',
  email VARCHAR(100) DEFAULT '',
  no_badan_hukum VARCHAR(100) DEFAULT '',
  no_izin_usaha VARCHAR(100) DEFAULT '',
  npwp VARCHAR(50) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(200) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'anggota' CHECK (role IN ('superadmin','admin','operator','anggota','anggota_perusahaan')),
  nik VARCHAR(50) DEFAULT NULL,
  member_id VARCHAR(50) DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anggota (
  id VARCHAR(50) PRIMARY KEY,
  nik VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(200) NOT NULL,
  no_ktp VARCHAR(50) DEFAULT '',
  no_hp VARCHAR(50) DEFAULT '',
  email VARCHAR(100) DEFAULT '',
  alamat TEXT DEFAULT '',
  pekerjaan VARCHAR(100) DEFAULT '',
  penghasilan NUMERIC(15,0) DEFAULT 0,
  status_keanggotaan VARCHAR(20) DEFAULT 'aktif' CHECK (status_keanggotaan IN ('aktif','nonaktif','keluar')),
  tanggal_daftar DATE DEFAULT CURRENT_DATE,
  saldo_simpanan_pokok NUMERIC(15,0) DEFAULT 0,
  saldo_simpanan_wajib NUMERIC(15,0) DEFAULT 0,
  saldo_simpanan_sukarela NUMERIC(15,0) DEFAULT 0,
  tipe_anggota VARCHAR(20) DEFAULT 'konvensional' CHECK (tipe_anggota IN ('konvensional','perusahaan'))
);

CREATE TABLE IF NOT EXISTS pengurus (
  id VARCHAR(50) PRIMARY KEY,
  nik VARCHAR(50) DEFAULT '',
  nama VARCHAR(200) NOT NULL,
  jabatan VARCHAR(100) DEFAULT '',
  periode_mulai DATE DEFAULT NULL,
  periode_selesai DATE DEFAULT NULL,
  no_sk VARCHAR(100) DEFAULT '',
  no_hp VARCHAR(50) DEFAULT '',
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif','nonaktif'))
);

CREATE TABLE IF NOT EXISTS karyawan (
  id VARCHAR(50) PRIMARY KEY,
  nik VARCHAR(50) DEFAULT '',
  nama VARCHAR(200) NOT NULL,
  jabatan VARCHAR(100) DEFAULT '',
  departemen VARCHAR(100) DEFAULT '',
  no_hp VARCHAR(50) DEFAULT '',
  gaji_pokok NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'tetap' CHECK (status IN ('tetap','kontrak','magang')),
  status_aktif BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS aset_barang (
  id VARCHAR(50) PRIMARY KEY,
  kode VARCHAR(50) DEFAULT '',
  nama VARCHAR(200) NOT NULL,
  kategori VARCHAR(50) DEFAULT 'Inventaris' CHECK (kategori IN ('Tanah','Bangunan','Kendaraan','Elektronik','Perabotan','Inventaris')),
  harga_perolehan NUMERIC(15,0) DEFAULT 0,
  nilai_residu NUMERIC(15,0) DEFAULT 0,
  masa_manfaat INTEGER DEFAULT 0,
  kondisi VARCHAR(50) DEFAULT 'Baik' CHECK (kondisi IN ('Baik','Rusak Ringan','Rusak Berat')),
  lokasi TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sumber_bayar (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  tipe VARCHAR(50) DEFAULT 'Tunai' CHECK (tipe IN ('Tunai','Transfer Bank','E-Wallet','QRIS')),
  no_rekening VARCHAR(100) DEFAULT '',
  akun_coa VARCHAR(20) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS jenis_simpanan (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('pokok','wajib','sukarela','deposito')),
  minimal_setoran NUMERIC(15,0) DEFAULT 0,
  bunga_persen NUMERIC(5,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS simpanan_transaksi (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  jenis_simpanan_id VARCHAR(50) NOT NULL REFERENCES jenis_simpanan(id),
  jenis_nama VARCHAR(200) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  tipe VARCHAR(10) NOT NULL CHECK (tipe IN ('setor','tarik')),
  jumlah NUMERIC(15,0) NOT NULL,
  keterangan TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS permohonan_tarik (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  jenis_simpanan_id VARCHAR(50) NOT NULL REFERENCES jenis_simpanan(id),
  jenis_nama VARCHAR(200) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  jumlah NUMERIC(15,0) NOT NULL,
  status VARCHAR(20) DEFAULT 'pengajuan' CHECK (status IN ('pengajuan','disetujui','ditolak'))
);

CREATE TABLE IF NOT EXISTS jenis_pinjaman (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  bunga_persen NUMERIC(5,2) DEFAULT 0,
  metode_bunga VARCHAR(20) DEFAULT 'flat' CHECK (metode_bunga IN ('flat','efektif','anuitas')),
  maks_tenor INTEGER DEFAULT 12,
  maks_plafon NUMERIC(15,0) DEFAULT 0,
  biaya_admin NUMERIC(15,0) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pinjaman (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  jenis_pinjaman_id VARCHAR(50) NOT NULL REFERENCES jenis_pinjaman(id),
  jenis_nama VARCHAR(200) NOT NULL,
  no_pinjaman VARCHAR(100) DEFAULT '',
  pokok NUMERIC(15,0) NOT NULL,
  tenor_months INTEGER NOT NULL,
  bunga_persen NUMERIC(5,2) DEFAULT 0,
  metode_bunga VARCHAR(20) DEFAULT 'flat',
  angsuran_per_bulan NUMERIC(15,0) DEFAULT 0,
  biaya_admin NUMERIC(15,0) DEFAULT 0,
  sisa_pokok NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pengajuan' CHECK (status IN ('pengajuan','disetujui','dicairkan','lunas','ditolak')),
  tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
  tanggal_cair DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS angsuran (
  id VARCHAR(50) PRIMARY KEY,
  pinjaman_id VARCHAR(50) NOT NULL REFERENCES pinjaman(id),
  anggota_nama VARCHAR(200) NOT NULL,
  angsuran_ke INTEGER NOT NULL,
  tanggal_jatuh_tempo DATE NOT NULL,
  pokok_bayar NUMERIC(15,0) DEFAULT 0,
  bunga_bayar NUMERIC(15,0) DEFAULT 0,
  total_bayar NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'belum_bayar' CHECK (status IN ('belum_bayar','lunas','terlambat')),
  tanggal_bayar DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id VARCHAR(50) PRIMARY KEY,
  no_jurnal VARCHAR(100) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  keterangan TEXT DEFAULT '',
  sumber VARCHAR(100) DEFAULT '',
  debit NUMERIC(15,0) DEFAULT 0,
  kredit NUMERIC(15,0) DEFAULT 0,
  details JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS kategori_barang (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  kontak VARCHAR(200) DEFAULT '',
  no_hp VARCHAR(50) DEFAULT '',
  alamat TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS barang (
  id VARCHAR(50) PRIMARY KEY,
  kode VARCHAR(50) DEFAULT '',
  nama VARCHAR(200) NOT NULL,
  kategori_id VARCHAR(50) REFERENCES kategori_barang(id),
  supplier_id VARCHAR(50) REFERENCES supplier(id),
  harga_beli NUMERIC(15,0) DEFAULT 0,
  harga_jual NUMERIC(15,0) DEFAULT 0,
  stok INTEGER DEFAULT 0,
  stok_minimum INTEGER DEFAULT 0,
  satuan VARCHAR(50) DEFAULT 'Pcs'
);

CREATE TABLE IF NOT EXISTS penjualan (
  id VARCHAR(50) PRIMARY KEY,
  no_faktur VARCHAR(100) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  items JSONB DEFAULT '[]'::jsonb,
  total NUMERIC(15,0) DEFAULT 0,
  metode_bayar VARCHAR(50) DEFAULT '',
  diskon NUMERIC(15,0) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pembelian (
  id VARCHAR(50) PRIMARY KEY,
  no_invoice VARCHAR(100) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id VARCHAR(50) REFERENCES supplier(id),
  supplier_nama VARCHAR(200) DEFAULT '',
  items JSONB DEFAULT '[]'::jsonb,
  total NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pesan' CHECK (status IN ('pesan','diterima','batal'))
);

CREATE TABLE IF NOT EXISTS venture_investments (
  id VARCHAR(50) PRIMARY KEY,
  nama_perusahaan VARCHAR(200) NOT NULL,
  sektor_industri VARCHAR(200) DEFAULT '',
  nama_founder VARCHAR(200) DEFAULT '',
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
  pengajuan_id VARCHAR(50) DEFAULT NULL REFERENCES pengajuan_pembiayaan(id),
  perusahaan_id_fk VARCHAR(50) DEFAULT NULL REFERENCES perusahaan(id)
);

CREATE TABLE IF NOT EXISTS venture_dividends (
  id VARCHAR(50) PRIMARY KEY,
  investment_id VARCHAR(50) NOT NULL REFERENCES venture_investments(id),
  tanggal DATE NOT NULL,
  nominal_dividen NUMERIC(15,0) DEFAULT 0,
  keterangan TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS pengumuman (
  id VARCHAR(50) PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  konten TEXT DEFAULT '',
  tipe VARCHAR(20) DEFAULT 'pengumuman' CHECK (tipe IN ('pengumuman','promo')),
  target VARCHAR(20) DEFAULT 'semua' CHECK (target IN ('semua','anggota')),
  tanggal_mulai DATE DEFAULT NULL,
  tanggal_selesai DATE DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif','nonaktif'))
);

CREATE TABLE IF NOT EXISTS tiket_bantuan (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) REFERENCES anggota(id),
  anggota_nama VARCHAR(200) DEFAULT '',
  subjek VARCHAR(255) NOT NULL,
  pesan TEXT DEFAULT '',
  kategori VARCHAR(50) DEFAULT 'Lainnya' CHECK (kategori IN ('Simpanan','Pinjaman','Toko','Aplikasi','Lainnya')),
  prioritas VARCHAR(20) DEFAULT 'Sedang' CHECK (prioritas IN ('Rendah','Sedang','Tinggi')),
  tanggal DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'Terbuka' CHECK (status IN ('Terbuka','Diproses','Selesai')),
  balasan_admin TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS bukti_transfer (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  jenis_simpanan_id VARCHAR(50) REFERENCES jenis_simpanan(id),
  jenis_nama VARCHAR(200) DEFAULT '',
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  jumlah NUMERIC(15,0) NOT NULL,
  keterangan TEXT DEFAULT '',
  bank_pengirim VARCHAR(100) DEFAULT '',
  no_ref VARCHAR(100) DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','disetujui','ditolak'))
);

CREATE TABLE IF NOT EXISTS sewa_assets (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  kategori VARCHAR(100) DEFAULT '',
  biaya_sewa_per_hari NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Tersedia' CHECK (status IN ('Tersedia','Disewa','Perawatan')),
  deskripsi TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sewa_transactions (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) REFERENCES anggota(id),
  anggota_nama VARCHAR(200) DEFAULT '',
  aset_id VARCHAR(50) REFERENCES sewa_assets(id),
  aset_nama VARCHAR(200) DEFAULT '',
  tanggal_mulai DATE DEFAULT NULL,
  tanggal_selesai DATE DEFAULT NULL,
  jumlah_hari INTEGER DEFAULT 0,
  total_biaya NUMERIC(15,0) DEFAULT 0,
  denda NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pengajuan' CHECK (status IN ('pengajuan','disetujui','berjalan','selesai','ditolak')),
  bukti_bayar_url VARCHAR(500) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS ppob_layanan (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  tipe VARCHAR(50) DEFAULT 'Voucher' CHECK (tipe IN ('Voucher','Listrik','Tagihan')),
  nominal_min NUMERIC(15,0) DEFAULT 0,
  nominal_max NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif','Nonaktif'))
);

CREATE TABLE IF NOT EXISTS ppob_transactions (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) REFERENCES anggota(id),
  anggota_nama VARCHAR(200) DEFAULT '',
  layanan_id VARCHAR(50) REFERENCES ppob_layanan(id),
  layanan_nama VARCHAR(200) DEFAULT '',
  target_number VARCHAR(100) DEFAULT '',
  nominal NUMERIC(15,0) DEFAULT 0,
  harga_koperasi NUMERIC(15,0) DEFAULT 0,
  harga_jual NUMERIC(15,0) DEFAULT 0,
  tanggal DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'sukses' CHECK (status IN ('sukses','proses','gagal')),
  sn VARCHAR(100) DEFAULT '',
  no_referensi VARCHAR(100) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS virtual_accounts (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  bank VARCHAR(50) DEFAULT 'Mandiri' CHECK (bank IN ('Mandiri','BNI','BRI','BCA','Permata')),
  nomor_va VARCHAR(100) NOT NULL,
  label VARCHAR(200) DEFAULT '',
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif','nonaktif'))
);

CREATE TABLE IF NOT EXISTS va_transactions (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) REFERENCES anggota(id),
  anggota_nama VARCHAR(200) DEFAULT '',
  nomor_va VARCHAR(100) DEFAULT '',
  bank VARCHAR(50) DEFAULT '',
  nominal NUMERIC(15,0) DEFAULT 0,
  jenis_trx VARCHAR(50) DEFAULT 'topup_sukarela' CHECK (jenis_trx IN ('topup_sukarela','bayar_angsuran','bayar_cicilan_barang')),
  tanggal DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'sukses' CHECK (status IN ('sukses','pending','expired'))
);

CREATE TABLE IF NOT EXISTS cicilan_barang (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  anggota_nama VARCHAR(200) NOT NULL,
  barang_nama VARCHAR(200) DEFAULT '',
  total_harga NUMERIC(15,0) DEFAULT 0,
  dp NUMERIC(15,0) DEFAULT 0,
  pokok_pembiayaan NUMERIC(15,0) DEFAULT 0,
  tenor_months INTEGER DEFAULT 0,
  bunga_persen NUMERIC(5,2) DEFAULT 0,
  angsuran_per_bulan NUMERIC(15,0) DEFAULT 0,
  sisa_pokok NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pengajuan' CHECK (status IN ('pengajuan','disetujui','aktif','lunas','ditolak')),
  tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
  tanggal_mulai DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS cicilan_angsuran (
  id VARCHAR(50) PRIMARY KEY,
  cicilan_barang_id VARCHAR(50) NOT NULL REFERENCES cicilan_barang(id),
  anggota_nama VARCHAR(200) DEFAULT '',
  angsuran_ke INTEGER NOT NULL,
  tanggal_jatuh_tempo DATE NOT NULL,
  pokok_bayar NUMERIC(15,0) DEFAULT 0,
  bunga_bayar NUMERIC(15,0) DEFAULT 0,
  total_bayar NUMERIC(15,0) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'belum_bayar' CHECK (status IN ('belum_bayar','lunas','terlambat')),
  tanggal_bayar DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS feature_toggles (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  anggota BOOLEAN DEFAULT true,
  simpanan BOOLEAN DEFAULT true,
  pinjaman BOOLEAN DEFAULT true,
  data_master BOOLEAN DEFAULT true,
  laporan BOOLEAN DEFAULT true,
  portal_anggota BOOLEAN DEFAULT true,
  toko BOOLEAN DEFAULT true,
  sewa BOOLEAN DEFAULT true,
  ppob BOOLEAN DEFAULT true,
  digital_payment BOOLEAN DEFAULT true,
  pembiayaan BOOLEAN DEFAULT true,
  pengumuman BOOLEAN DEFAULT true,
  ventura BOOLEAN DEFAULT true
);

-- =============================================
-- PERUSAHAAN (Company) MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS perusahaan (
  id VARCHAR(50) PRIMARY KEY,
  kode_perusahaan VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(250) NOT NULL,
  alamat TEXT DEFAULT '',
  kota VARCHAR(100) DEFAULT '',
  provinsi VARCHAR(100) DEFAULT '',
  sektor_industri VARCHAR(200) DEFAULT '',
  tahun_berdiri INTEGER DEFAULT NULL,
  no_akte_pendirian VARCHAR(100) DEFAULT '',
  npwp VARCHAR(50) DEFAULT '',
  no_izin_usaha VARCHAR(100) DEFAULT '',
  nama_direktur VARCHAR(200) DEFAULT '',
  kontak_direktur VARCHAR(100) DEFAULT '',
  email_perusahaan VARCHAR(200) DEFAULT '',
  telepon VARCHAR(50) DEFAULT '',
  website VARCHAR(200) DEFAULT '',
  deskripsi TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif','nonaktif')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add perusahaan_id to venture_investments
ALTER TABLE venture_investments ADD COLUMN IF NOT EXISTS perusahaan_id VARCHAR(50) DEFAULT NULL REFERENCES perusahaan(id);

-- =============================================
-- GENERAL LEDGER MODULE (Chart of Accounts)
-- =============================================

CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id VARCHAR(50) PRIMARY KEY,
  kode_akun VARCHAR(20) NOT NULL UNIQUE,
  nama_akun VARCHAR(200) NOT NULL,
  kategori VARCHAR(30) NOT NULL CHECK (kategori IN ('ASET','KEWAJIBAN','EKUITAS','PENDAPATAN','BEBAN','SHU')),
  sub_kategori VARCHAR(100) DEFAULT '',
  saldo_normal VARCHAR(6) NOT NULL CHECK (saldo_normal IN ('debit','kredit')),
  level INTEGER DEFAULT 1,
  parent_id VARCHAR(50) DEFAULT NULL REFERENCES chart_of_accounts(id),
  is_active BOOLEAN DEFAULT true,
  is_header BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounting_periods (
  id VARCHAR(50) PRIMARY KEY,
  tahun INTEGER NOT NULL,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  nama_periode VARCHAR(100) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  is_open BOOLEAN DEFAULT true,
  is_closed BOOLEAN DEFAULT false,
  closed_at TIMESTAMP DEFAULT NULL,
  closed_by VARCHAR(50) DEFAULT NULL REFERENCES users(id),
  UNIQUE(tahun, bulan)
);

CREATE TABLE IF NOT EXISTS journal_approvals (
  id VARCHAR(50) PRIMARY KEY,
  jurnal_id VARCHAR(50) NOT NULL REFERENCES journal_entries(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','posted','approved','reversed')),
  created_by VARCHAR(50) DEFAULT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by VARCHAR(50) DEFAULT NULL REFERENCES users(id),
  approved_at TIMESTAMP DEFAULT NULL,
  reversed_by VARCHAR(50) DEFAULT NULL REFERENCES users(id),
  reversed_at TIMESTAMP DEFAULT NULL,
  notes TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS subledger_piutang (
  id VARCHAR(50) PRIMARY KEY,
  anggota_id VARCHAR(50) NOT NULL REFERENCES anggota(id),
  no_pinjaman VARCHAR(100) DEFAULT '',
  pokok_piutang NUMERIC(15,0) DEFAULT 0,
  tunggakan_pokok NUMERIC(15,0) DEFAULT 0,
  tunggakan_bunga NUMERIC(15,0) DEFAULT 0,
  hari_tunggakan INTEGER DEFAULT 0,
  kolektibilitas VARCHAR(20) DEFAULT 'Lancar' CHECK (kolektibilitas IN ('Lancar','Kurang Lancar','Diragukan','Macet')),
  tanggal_update DATE DEFAULT CURRENT_DATE
);

-- =============================================
-- AI CREDIT SCORING MODULE (Pengajuan & Skoring)
-- =============================================

CREATE TABLE IF NOT EXISTS pengajuan_pembiayaan (
  id VARCHAR(50) PRIMARY KEY,
  perusahaan_id VARCHAR(50) DEFAULT NULL REFERENCES perusahaan(id),
  venture_id VARCHAR(50) DEFAULT NULL REFERENCES venture_investments(id),
  anggota_id VARCHAR(50) DEFAULT NULL REFERENCES anggota(id),
  no_pengajuan VARCHAR(50) UNIQUE NOT NULL,
  tanggal_pengajuan DATE NOT NULL DEFAULT CURRENT_DATE,
  jenis_pembiayaan VARCHAR(50) DEFAULT 'modal_ventura',
  pokok_pengajuan NUMERIC(15,0) NOT NULL,
  tenor_bulan INTEGER NOT NULL,
  tujuan_pembiayaan TEXT DEFAULT '',
  bunga_diharapkan NUMERIC(5,2) DEFAULT 0,
  status_pengajuan VARCHAR(30) DEFAULT 'draft',
  skor_akhir NUMERIC(5,2) DEFAULT NULL,
  status_kelayakan VARCHAR(30) DEFAULT NULL,
  rekomendasi TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) DEFAULT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS dokumen_pengajuan (
  id VARCHAR(50) PRIMARY KEY,
  pengajuan_id VARCHAR(50) DEFAULT NULL REFERENCES pengajuan_pembiayaan(id),
  kelompok VARCHAR(30) NOT NULL CHECK (kelompok IN ('LEGALITAS','KEUANGAN','AGUNAN','TATA_KELOLA')),
  kode_dokumen VARCHAR(50) NOT NULL,
  nama_dokumen VARCHAR(200) NOT NULL,
  deskripsi TEXT DEFAULT '',
  dasar_hukum VARCHAR(200) DEFAULT '',
  status_upload VARCHAR(20) DEFAULT 'belum' CHECK (status_upload IN ('belum','terupload','valid','invalid','kedaluwarsa')),
  file_path VARCHAR(500) DEFAULT '',
  file_type VARCHAR(50) DEFAULT '',
  tanggal_upload TIMESTAMP DEFAULT NULL,
  tanggal_kedaluwarsa DATE DEFAULT NULL,
  ai_validasi TEXT DEFAULT '',
  ai_confidence NUMERIC(5,2) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS hasil_skoring (
  id VARCHAR(50) PRIMARY KEY,
  pengajuan_id VARCHAR(50) NOT NULL UNIQUE REFERENCES pengajuan_pembiayaan(id),
  skor_keseluruhan NUMERIC(5,2) NOT NULL,
  status_kelayakan VARCHAR(30) NOT NULL,
  skor_character NUMERIC(5,2) DEFAULT 0,
  skor_capacity NUMERIC(5,2) DEFAULT 0,
  skor_capital NUMERIC(5,2) DEFAULT 0,
  skor_collateral NUMERIC(5,2) DEFAULT 0,
  skor_condition NUMERIC(5,2) DEFAULT 0,
  rasio_likuiditas NUMERIC(10,2) DEFAULT NULL,
  rasio_solvabilitas NUMERIC(10,2) DEFAULT NULL,
  rasio_profitabilitas NUMERIC(10,2) DEFAULT NULL,
  rasio_bopo NUMERIC(10,2) DEFAULT NULL,
  bmpk_persen NUMERIC(5,2) DEFAULT NULL,
  bmpk_status VARCHAR(20) DEFAULT NULL,
  collateral_coverage NUMERIC(5,2) DEFAULT NULL,
  rekomendasi_plafon NUMERIC(15,0) DEFAULT NULL,
  rekomendasi_tenor INTEGER DEFAULT NULL,
  rekomendasi_bunga NUMERIC(5,2) DEFAULT NULL,
  syarat_khusus TEXT DEFAULT '',
  ai_analisis_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration tracking table
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== LANDING PAGE CMS ====================

CREATE TABLE IF NOT EXISTS landing_settings (
  id VARCHAR(50) PRIMARY KEY,
  koperasi_name VARCHAR(200) DEFAULT 'KSP MetroMitra',
  koperasi_tagline VARCHAR(300) DEFAULT 'Sistem Informasi Koperasi Terintegrasi',
  primary_color VARCHAR(20) DEFAULT '#2563eb',
  secondary_color VARCHAR(20) DEFAULT '#d97706',
  logo_url VARCHAR(500) DEFAULT '',
  favicon_url VARCHAR(500) DEFAULT '',
  is_published BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO landing_settings (id, koperasi_name, koperasi_tagline, is_published)
VALUES ('landing_main', 'KSP MetroMitra', 'Sistem Informasi Koperasi Terintegrasi', false)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS landing_hero (
  id VARCHAR(50) PRIMARY KEY,
  badge_text VARCHAR(200) DEFAULT 'Platform Koperasi Digital Terpercaya',
  headline VARCHAR(500) DEFAULT 'Kelola Koperasi Simpan Pinjam Dengan Mudah & Profesional',
  subheadline TEXT DEFAULT 'Satu platform terintegrasi untuk mengelola keanggotaan, simpanan, pinjaman, akuntansi, dan unit usaha dalam satu ekosistem cloud yang aman dan mudah digunakan.',
  cta_primary_text VARCHAR(100) DEFAULT 'Coba Demo Gratis',
  cta_primary_link VARCHAR(200) DEFAULT '/login',
  cta_secondary_text VARCHAR(100) DEFAULT 'Lihat Fitur',
  cta_secondary_link VARCHAR(200) DEFAULT '#fitur',
  background_type VARCHAR(20) DEFAULT 'gradient' CHECK (background_type IN ('gradient','image','solid')),
  bg_image_url VARCHAR(500) DEFAULT '',
  is_active BOOLEAN DEFAULT true
);

INSERT INTO landing_hero (id) VALUES ('hero_main') ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS landing_features (
  id VARCHAR(50) PRIMARY KEY,
  icon_name VARCHAR(100) DEFAULT 'Star',
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS landing_team (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(200) DEFAULT '',
  photo_url VARCHAR(500) DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS landing_testimonials (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(200) DEFAULT '',
  content TEXT DEFAULT '',
  avatar_url VARCHAR(500) DEFAULT '',
  rating INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS landing_pricing (
  id VARCHAR(50) PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  price_label VARCHAR(100) DEFAULT '',
  price_amount VARCHAR(100) DEFAULT '0',
  description VARCHAR(300) DEFAULT '',
  is_popular BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  cta_text VARCHAR(100) DEFAULT 'Pilih',
  cta_link VARCHAR(200) DEFAULT '#',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS landing_contact (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(200) DEFAULT '',
  phone VARCHAR(200) DEFAULT '',
  whatsapp VARCHAR(200) DEFAULT '',
  address VARCHAR(500) DEFAULT '',
  office_hours VARCHAR(500) DEFAULT '',
  map_embed_url VARCHAR(500) DEFAULT '',
  footer_description TEXT DEFAULT '',
  social_facebook VARCHAR(200) DEFAULT '',
  social_twitter VARCHAR(200) DEFAULT '',
  social_instagram VARCHAR(200) DEFAULT '',
  social_youtube VARCHAR(200) DEFAULT ''
);

INSERT INTO landing_contact (id) VALUES ('contact_main') ON CONFLICT (id) DO NOTHING;

-- Seed landing features
INSERT INTO landing_features (id, icon_name, title, description, sort_order) VALUES
('lf1', 'Users', 'Manajemen Anggota', 'Kelola data anggota, 4 jenis simpanan, setoran tarik tunai, dan mutasi rekening secara real-time.', 1),
('lf2', 'DollarSign', 'Pinjaman 3 Metode Bunga', 'Proses pengajuan, persetujuan, pencairan, dan angsuran dengan metode Flat, Efektif, dan Anuitas.', 2),
('lf3', 'BookOpen', 'Akuntansi SAK ETAP', 'Jurnal otomatis dari setiap transaksi, COA, Buku Besar, Neraca Saldo, dan laporan keuangan.', 3),
('lf4', 'ShoppingCart', 'POS Retail & Toko', 'Kelola stok barang, kategori, supplier, kasir penjualan, dan laporan laba-rugi real-time.', 4),
('lf5', 'Smartphone', 'PPOB & Digital Payment', 'Layanan pembayaran pulsa, listrik, PDAM, BPJS, Virtual Account, dan top-up digital.', 5),
('lf6', 'TrendingUp', 'Ventura & AI Audit', 'Kelola investasi ventura, dividen perusahaan, dan audit risiko berbasis AI Google Gemini.', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Migration: align existing Railway DB columns to current schema
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='nama_perusahaan') THEN
    ALTER TABLE perusahaan RENAME COLUMN nama_perusahaan TO nama;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pengajuan_pembiayaan' AND column_name='skor_akhir') THEN
    ALTER TABLE pengajuan_pembiayaan ADD COLUMN skor_akhir NUMERIC(5,2) DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pengajuan_pembiayaan' AND column_name='status_kelayakan') THEN
    ALTER TABLE pengajuan_pembiayaan ADD COLUMN status_kelayakan VARCHAR(30) DEFAULT NULL;
  END IF;

  -- Add generic company columns missing from Railway DB (it had venture columns)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='kode_perusahaan') THEN
    ALTER TABLE perusahaan ADD COLUMN kode_perusahaan VARCHAR(20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='alamat') THEN
    ALTER TABLE perusahaan ADD COLUMN alamat TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='kota') THEN
    ALTER TABLE perusahaan ADD COLUMN kota VARCHAR(100) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='provinsi') THEN
    ALTER TABLE perusahaan ADD COLUMN provinsi VARCHAR(100) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='tahun_berdiri') THEN
    ALTER TABLE perusahaan ADD COLUMN tahun_berdiri INTEGER DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='no_akte_pendirian') THEN
    ALTER TABLE perusahaan ADD COLUMN no_akte_pendirian VARCHAR(100) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='npwp') THEN
    ALTER TABLE perusahaan ADD COLUMN npwp VARCHAR(50) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='no_izin_usaha') THEN
    ALTER TABLE perusahaan ADD COLUMN no_izin_usaha VARCHAR(100) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='nama_direktur') THEN
    ALTER TABLE perusahaan ADD COLUMN nama_direktur VARCHAR(200) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='kontak_direktur') THEN
    ALTER TABLE perusahaan ADD COLUMN kontak_direktur VARCHAR(100) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='email_perusahaan') THEN
    ALTER TABLE perusahaan ADD COLUMN email_perusahaan VARCHAR(200) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='telepon') THEN
    ALTER TABLE perusahaan ADD COLUMN telepon VARCHAR(50) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='website') THEN
    ALTER TABLE perusahaan ADD COLUMN website VARCHAR(200) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perusahaan' AND column_name='deskripsi') THEN
    ALTER TABLE perusahaan ADD COLUMN deskripsi TEXT DEFAULT '';
  END IF;
END $$;

-- Populate existing perusahaan rows with proper company registry data
UPDATE perusahaan SET
  kode_perusahaan = 'P-001', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Industri Hijau No. 88', kota = 'Bandung', provinsi = 'Jawa Barat', tahun_berdiri = 2019,
  npwp = '12.345.678.9-012.000', no_izin_usaha = '503/450/KPPT/2019', no_akte_pendirian = 'AHU-0098765.AH.01.01.TAHUN-2019',
  email_perusahaan = 'info@hijauagritech.co.id', website = 'https://hijauagritech.co.id',
  deskripsi = 'Perusahaan rintisan pengembang solusi otomatisasi pertanian hidroponik berbasis IoT untuk efisiensi air dan pupuk.'
  WHERE id = 'pr1';
UPDATE perusahaan SET
  kode_perusahaan = 'P-002', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Energi Surya No. 12', kota = 'Surabaya', provinsi = 'Jawa Timur', tahun_berdiri = 2018,
  npwp = '98.765.432.1-012.000', no_izin_usaha = '503/450/KPPT/2018', no_akte_pendirian = 'AHU-0034567.AH.01.01.TAHUN-2018',
  email_perusahaan = 'info@cahayaenergi.co.id', website = 'https://cahayaenergi.co.id',
  deskripsi = 'Pengembang dan operator pembangkit listrik tenaga surya rooftop untuk industri dan komersial.'
  WHERE id = 'pr2';
UPDATE perusahaan SET
  kode_perusahaan = 'P-003', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Fintech Tower Lt. 15', kota = 'Jakarta Selatan', provinsi = 'DKI Jakarta', tahun_berdiri = 2020,
  npwp = '56.789.012.3-456.000', no_izin_usaha = '503/450/KPPT/2020', no_akte_pendirian = 'AHU-0078901.AH.01.01.TAHUN-2020',
  email_perusahaan = 'hello@nusantarafintech.id', website = 'https://nusantarafintech.id',
  deskripsi = 'Platform teknologi finansial untuk UMKM dengan layanan pembayaran dan pendanaan rantai pasok.'
  WHERE id = 'pr3';
UPDATE perusahaan SET
  kode_perusahaan = 'P-004', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Kuliner Raya No. 45', kota = 'Yogyakarta', provinsi = 'DI Yogyakarta', tahun_berdiri = 2021,
  npwp = '34.567.890.1-234.000', no_izin_usaha = '503/450/KPPT/2021', no_akte_pendirian = 'AHU-0056789.AH.01.01.TAHUN-2021',
  email_perusahaan = 'info@bogarasa.co.id', website = 'https://bogarasa.co.id',
  deskripsi = 'Waralaba kedai soto kelapa tradisional dengan sistem rantai pasok bumbu terpusat.'
  WHERE id = 'pr4';
UPDATE perusahaan SET
  kode_perusahaan = 'P-005', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Medika Digital No. 7', kota = 'Semarang', provinsi = 'Jawa Tengah', tahun_berdiri = 2019,
  npwp = '01.234.567.8-012.000', no_izin_usaha = '503/450/KPPT/2019', no_akte_pendirian = 'AHU-0012345.AH.01.01.TAHUN-2019',
  email_perusahaan = 'care@sehatmedika.id', website = 'https://sehatmedika.id',
  deskripsi = 'Klinik digital dan telemedicine dengan platform konsultasi kesehatan berbasis AI.'
  WHERE id = 'pr5';
UPDATE perusahaan SET
  kode_perusahaan = 'P-006', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Logistik Industri Kav. 9', kota = 'Bekasi', provinsi = 'Jawa Barat', tahun_berdiri = 2017,
  npwp = '11.222.333.4-012.000', no_izin_usaha = '503/450/KPPT/2017', no_akte_pendirian = 'AHU-0099887.AH.01.01.TAHUN-2017',
  email_perusahaan = 'corp@logistikcepat.id', website = 'https://logistikcepat.id',
  deskripsi = 'Penyedia jasa logistik dan kurir cepat untuk e-commerce dengan armada terintegrasi.'
  WHERE id = 'pr6';
UPDATE perusahaan SET
  kode_perusahaan = 'P-007', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Pendidikan No. 12', kota = 'Malang', provinsi = 'Jawa Timur', tahun_berdiri = 2021,
  npwp = '45.678.901.2-345.000', no_izin_usaha = '503/450/KPPT/2021', no_akte_pendirian = 'AHU-0056781.AH.01.01.TAHUN-2021',
  email_perusahaan = 'hello@edukasicerdas.id', website = 'https://edukasicerdas.id',
  deskripsi = 'Pengembang aplikasi pembelajaran interaktif bertenaga AI untuk jenjang pendidikan dasar.'
  WHERE id = 'pr7';
UPDATE perusahaan SET
  kode_perusahaan = 'P-008', nama_direktur = nama_founder, kontak_direktur = kontak_founder, telepon = kontak_founder,
  alamat = 'Jl. Fashion Eco No. 21', kota = 'Denpasar', provinsi = 'Bali', tahun_berdiri = 2020,
  npwp = '67.890.123.4-567.000', no_izin_usaha = '503/450/KPPT/2020', no_akte_pendirian = 'AHU-0078123.AH.01.01.TAHUN-2020',
  email_perusahaan = 'hi@ecofashion.id', website = 'https://ecofashion.id',
  deskripsi = 'Brand fashion berkelanjutan dengan material daur ulang dan rantai pasok ramah lingkungan.'
  WHERE id = 'pr8';
