/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  KoperasiInfo,
  Anggota,
  JenisSimpanan,
  JenisPinjaman,
  Barang,
  Supplier,
  KategoriBarang,
  FeatureToggles,
  UserSession,
  Pengurus,
  Karyawan,
  AsetBarang,
  SumberBayar,
  JournalEntry,
  Pinjaman,
  Angsuran,
  SimpananTransaksi,
  Pengumuman,
  TiketBantuan,
  BuktiTransfer
} from './types';

export const defaultKoperasiInfo: KoperasiInfo = {
  nama: 'Koperasi Simpan Pinjam MetroKSP',
  alamat: 'Jl. Pemuda No. 45, Kebayoran Baru',
  kota: 'Jakarta Selatan',
  provinsi: 'DKI Jakarta',
  telp: '(021) 789-0123',
  email: 'info@metroksp.co.id',
  noBadanHukum: 'AHU-0012345.AH.01.26.TAHUN-2024',
  noIzinUsaha: 'SITU-503/450/KPPT/2024',
  npwp: '01.234.567.8-012.000'
};

export const defaultUsers: UserSession[] = [
  { id: '1', username: 'admin', namaLengkap: 'Ahmad Syarif', role: 'admin', isActive: true, password: 'admin123' },
  { id: '2', username: 'operator', namaLengkap: 'Budi Raharjo', role: 'operator', isActive: true, password: 'admin123' },
  { id: '3', username: '1234567890', namaLengkap: 'Marmad Tuaian', role: 'anggota', nik: '1234567890', memberId: 'm1', isActive: true, password: '123456' }
];

export const initialMembers: Anggota[] = [
  {
    id: 'm1',
    nik: '1234567890',
    nama: 'Marmad Tuaian',
    noKtp: '3174011204850001',
    noHp: '081234567890',
    email: 'marmad@gmail.com',
    alamat: 'Jl. Merdeka No. 12, RT 01/RW 03, Pancoran, Jakarta Selatan',
    pekerjaan: 'Karyawan Swasta',
    penghasilan: 8500000,
    statusKeanggotaan: 'aktif',
    tanggalDaftar: '2023-01-15',
    saldoSimpananPokok: 1000000,
    saldoSimpananWajib: 1200000,
    saldoSimpananSukarela: 3500000
  },
  {
    id: 'm2',
    nik: '1234567891',
    nama: 'Ahmad Kanh',
    noKtp: '3174011508880002',
    noHp: '081398765432',
    email: 'ahmadkanh@gmail.com',
    alamat: 'Gg. Musholla No. 4, Kebayoran Lama, Jakarta Selatan',
    pekerjaan: 'Staf IT',
    penghasilan: 9000000,
    statusKeanggotaan: 'aktif',
    tanggalDaftar: '2023-03-10',
    saldoSimpananPokok: 1000000,
    saldoSimpananWajib: 1000000,
    saldoSimpananSukarela: 1500000
  },
  {
    id: 'm3',
    nik: '1234567892',
    nama: 'Siti Rahmawati',
    noKtp: '3174024509920003',
    noHp: '085712345678',
    email: 'siti.rahma@yahoo.com',
    alamat: 'Komp. DDN No. B12, Pondok Labu, Cilandak, Jakarta Selatan',
    pekerjaan: 'Staf Administrasi',
    penghasilan: 6500000,
    statusKeanggotaan: 'aktif',
    tanggalDaftar: '2023-05-20',
    saldoSimpananPokok: 1000000,
    saldoSimpananWajib: 800000,
    saldoSimpananSukarela: 850000
  },
  {
    id: 'm4',
    nik: '1234567893',
    nama: 'Hendra Wijaya',
    noKtp: '3174032105800004',
    noHp: '081122334455',
    email: 'hendra.wijaya@outlook.com',
    alamat: 'Jl. Tebet Barat Dalam Raya No. 44, Tebet, Jakarta Selatan',
    pekerjaan: 'Manajer HRD',
    penghasilan: 15000000,
    statusKeanggotaan: 'aktif',
    tanggalDaftar: '2023-06-01',
    saldoSimpananPokok: 1000000,
    saldoSimpananWajib: 700000,
    saldoSimpananSukarela: 12500000
  },
  {
    id: 'm5',
    nik: '1234567894',
    nama: 'Dewi Lestari',
    noKtp: '3174045511950005',
    noHp: '087844556677',
    email: 'dewi.lestari@gmail.com',
    alamat: 'Jl. Kalibata Timur No. 3A, Pancoran, Jakarta Selatan',
    pekerjaan: 'Staf Keuangan',
    penghasilan: 7000000,
    statusKeanggotaan: 'aktif',
    tanggalDaftar: '2023-08-15',
    saldoSimpananPokok: 1000000,
    saldoSimpananWajib: 600000,
    saldoSimpananSukarela: 2000000
  }
];

export const initialJenisSimpanan: JenisSimpanan[] = [
  { id: 'js1', nama: 'Simpanan Pokok', tipe: 'pokok', minimalSetoran: 1000000, bungaPersen: 0 },
  { id: 'js2', nama: 'Simpanan Wajib Bulanan', tipe: 'wajib', minimalSetoran: 100000, bungaPersen: 0 },
  { id: 'js3', nama: 'Simpanan Sukarela Harian', tipe: 'sukarela', minimalSetoran: 10000, bungaPersen: 2 },
  { id: 'js4', nama: 'Deposito Berjangka MetroSafe', tipe: 'deposito', minimalSetoran: 5000000, bungaPersen: 5 }
];

export const initialJenisPinjaman: JenisPinjaman[] = [
  { id: 'jp1', nama: 'Pinjaman Umum Multiguna (Flat)', bungaPersen: 1.0, metodeBunga: 'flat', maksTenor: 24, maksPlafon: 50000000, biayaAdmin: 50000 },
  { id: 'jp2', nama: 'Pinjaman Renovasi Rumah (Efektif)', bungaPersen: 1.2, metodeBunga: 'efektif', maksTenor: 36, maksPlafon: 100000000, biayaAdmin: 100000 },
  { id: 'jp3', nama: 'Pinjaman Pendidikan Anak (Flat)', bungaPersen: 0.8, metodeBunga: 'flat', maksTenor: 12, maksPlafon: 15000000, biayaAdmin: 25000 },
  { id: 'jp4', nama: 'Pinjaman Darurat Mikro (Flat)', bungaPersen: 1.5, metodeBunga: 'flat', maksTenor: 6, maksPlafon: 5000000, biayaAdmin: 10000 }
];

export const initialKategoriBarang: KategoriBarang[] = [
  { id: 'cat1', nama: 'Sembako & Kebutuhan Pokok' },
  { id: 'cat2', nama: 'Alat Tulis Kantor (ATK)' },
  { id: 'cat3', nama: 'Makanan & Minuman Ringan' },
  { id: 'cat4', nama: 'Elektronik & Gadget' },
  { id: 'cat5', nama: 'Perlengkapan Rumah Tangga' }
];

export const initialSupplier: Supplier[] = [
  { id: 'sup1', nama: 'PT Indofood Makmur Mandiri', kontak: 'Hendra Saputra', noHp: '081255551111', alamat: 'Kawasan Industri Pulogadung, Jakarta Timur' },
  { id: 'sup2', nama: 'CV Atk Jaya Bersama', kontak: 'Susi Susanti', noHp: '085644442222', alamat: 'Mangga Dua Square Blok C No. 45, Jakarta Pusat' },
  { id: 'sup3', nama: 'PT Unilever Indonesia Tbk', kontak: 'Manajer Penjualan', noHp: '081199993333', alamat: 'BSD City Kavling 3, Tangerang' }
];

export const initialBarang: Barang[] = [
  { id: 'b1', kode: 'BRG001', nama: 'Beras Pandan Wangi Premium 5kg', kategoriId: 'cat1', supplierId: 'sup1', hargaBeli: 65000, hargaJual: 78000, stok: 45, stokMinimum: 10, satuan: 'Pcs' },
  { id: 'b2', kode: 'BRG002', nama: 'Minyak Goreng Sania 2L', kategoriId: 'cat1', supplierId: 'sup3', hargaBeli: 28000, hargaJual: 34500, stok: 60, stokMinimum: 15, satuan: 'Pcs' },
  { id: 'b3', kode: 'BRG003', nama: 'Gula Pasir Gulaku 1kg', kategoriId: 'cat1', supplierId: 'sup1', hargaBeli: 12500, hargaJual: 16000, stok: 5, stokMinimum: 10, satuan: 'Pcs' }, // Low stock!
  { id: 'b4', kode: 'BRG004', nama: 'Kertas HVS Sinar Dunia A4 80gr', kategoriId: 'cat2', supplierId: 'sup2', hargaBeli: 42000, hargaJual: 51000, stok: 30, stokMinimum: 5, satuan: 'Ream' },
  { id: 'b5', kode: 'BRG005', nama: 'Pulpen Gel Pilot G2 Black', kategoriId: 'cat2', supplierId: 'sup2', hargaBeli: 12000, hargaJual: 15500, stok: 120, stokMinimum: 20, satuan: 'Pcs' },
  { id: 'b6', kode: 'BRG006', nama: 'Indomie Goreng Spesial (Kardus)', kategoriId: 'cat3', supplierId: 'sup1', hargaBeli: 98000, hargaJual: 112000, stok: 15, stokMinimum: 5, satuan: 'Box' },
  { id: 'b7', kode: 'BRG007', nama: 'Powerbank Anker PowerCore 10000mAh', kategoriId: 'cat4', supplierId: 'sup2', hargaBeli: 250000, hargaJual: 320000, stok: 8, stokMinimum: 3, satuan: 'Pcs' },
  { id: 'b8', kode: 'BRG008', nama: 'Senter LED Rechargeable Philips', kategoriId: 'cat5', supplierId: 'sup3', hargaBeli: 85000, hargaJual: 110000, stok: 2, stokMinimum: 5, satuan: 'Pcs' } // Low stock!
];

export const initialPengurus: Pengurus[] = [
  { id: 'p1', nik: '3174011212750001', nama: 'Ir. H. Supriyanto, M.M.', jabatan: 'Ketua Pengurus', periodeMulai: '2024-01-01', periodeSelesai: '2027-12-31', noSk: 'SK-001/M-COOP/I/2024', noHp: '081299008822', status: 'aktif' },
  { id: 'p2', nik: '3174011405800002', nama: 'Riana Safitri, S.E.', jabatan: 'Bendahara Koperasi', periodeMulai: '2024-01-01', periodeSelesai: '2027-12-31', noSk: 'SK-002/M-COOP/I/2024', noHp: '081377443311', status: 'aktif' }
];

export const initialKaryawan: Karyawan[] = [
  { id: 'k1', nik: '3174021203900001', nama: 'Yulianto Saputro', jabatan: 'Kasir Utama & POS', departemen: 'Unit Toko Perdagangan', noHp: '085699001122', gajiPokok: 4800000, status: 'tetap', statusAktif: true },
  { id: 'k2', nik: '3174022511920002', nama: 'Siska Amelia', jabatan: 'Staf Administrasi Pinjaman', departemen: 'Keuangan & Pembiayaan', noHp: '081266554433', gajiPokok: 4500000, status: 'tetap', statusAktif: true }
];

export const initialAsetBarang: AsetBarang[] = [
  { id: 'as1', kode: 'AST-001', nama: 'Gedung Kantor Ruko Kebayoran', kategori: 'Bangunan', hargaPerolehan: 850000000, nilaiResidu: 100000000, masaManfaat: 20, kondisi: 'Baik', lokasi: 'Ruko Kebayoran Square Blok A-2' },
  { id: 'as2', kode: 'AST-002', nama: 'Komputer Server ASUS TS100', kategori: 'Elektronik', hargaPerolehan: 18500000, nilaiResidu: 1500000, masaManfaat: 5, kondisi: 'Baik', lokasi: 'Ruang Server Kantor Utama' },
  { id: 'as3', kode: 'AST-003', nama: 'Motor Honda Vario 160 Operasional', kategori: 'Kendaraan', hargaPerolehan: 26500000, nilaiResidu: 5000000, masaManfaat: 8, kondisi: 'Baik', lokasi: 'Parkir Kantor Utama' }
];

export const initialSumberBayar: SumberBayar[] = [
  { id: 'sb1', nama: 'Kas Kecil Tunai', tipe: 'Tunai', akunCoa: '1101' },
  { id: 'sb2', nama: 'Bank Mandiri Kantor Cabang', tipe: 'Transfer Bank', noRekening: '123-00-0987654-3', akunCoa: '1102' },
  { id: 'sb3', nama: 'E-Wallet DANA Merchant', tipe: 'E-Wallet', noRekening: '081234567890', akunCoa: '1104' },
  { id: 'sb4', nama: 'QRIS Bank Indonesia', tipe: 'QRIS', noRekening: '90823402804', akunCoa: '1105' }
];

export const initialFeatureToggles: FeatureToggles = {
  anggota: true,
  simpanan: true,
  pinjaman: true,
  dataMaster: true,
  laporan: true,
  portalAnggota: true,
  toko: true,
  sewa: true,
  ppob: true,
  digitalPayment: true,
  pembiayaan: true,
  pengumuman: true,
  ventura: true
};

export const initialVentureInvestments = [
  {
    id: 'vi1',
    namaPerusahaan: 'PT Hijau Agri Tech',
    sektorIndustri: 'Pertanian & IoT (Agrotech)',
    namaFounder: 'Dr. Fahmi Idris',
    nominalInvestasi: 150000000,
    persentaseSaham: 15,
    estimasiDividen: 30,
    tanggalInvestasi: '2025-05-12',
    tenorTahun: 3,
    status: 'dicairkan',
    deskripsiBisnis: 'Sistem otomasi pertanian hidroponik hemat air terintegrasi sensor kelembaban tanah untuk suplai sayur organik swalayan.',
    kontakFounder: '0812-9900-1122',
    prospektusUrl: 'prospektus_agritech.pdf',
    dividendHistory: [
      { id: 'bh1_1', tanggal: '2025-12-15', nominalDividen: 12500000, keterangan: 'Dividen Siklus Panen Raya 1' },
      { id: 'bh1_2', tanggal: '2026-06-20', nominalDividen: 14200000, keterangan: 'Dividen Siklus Panen Raya 2' }
    ]
  },
  {
    id: 'vi2',
    namaPerusahaan: 'PT Kuliner Nusantara Berkah',
    sektorIndustri: 'Makanan & Minuman (F&B)',
    namaFounder: 'Chef Amri Wijaya',
    nominalInvestasi: 80000000,
    persentaseSaham: 20,
    estimasiDividen: 25,
    tanggalInvestasi: '2026-01-20',
    tenorTahun: 2,
    status: 'dicairkan',
    deskripsiBisnis: 'Waralaba kedai soto kelapa tradisional madura dengan sistem rantai pasok bumbu terpusat untuk menjaga rasa tetap otentik.',
    kontakFounder: '0821-4455-8899',
    prospektusUrl: 'prospektus_kuliner.pdf',
    dividendHistory: [
      { id: 'bh2_1', tanggal: '2026-04-30', nominalDividen: 6800000, keterangan: 'Dividen Triwulan I 2026' }
    ]
  },
  {
    id: 'vi3',
    namaPerusahaan: 'PT Solusi Edu Kreatif',
    sektorIndustri: 'Pendidikan Digital (EdTech)',
    namaFounder: 'Hanan Fitrah, M.A.',
    nominalInvestasi: 200000000,
    persentaseSaham: 10,
    estimasiDividen: 15,
    tanggalInvestasi: '2026-07-02',
    tenorTahun: 5,
    status: 'pengajuan',
    deskripsiBisnis: 'Aplikasi pembelajaran tajwid & bahasa interaktif bertenaga kecerdasan buatan (AI) pengenal ketepatan lafal.',
    kontakFounder: '0855-8899-0011',
    prospektusUrl: 'prospektus_edutech.pdf',
    dividendHistory: []
  },
  {
    id: 'vi4',
    namaPerusahaan: 'PT Bambang Baru Bara',
    sektorIndustri: 'Energi & Pertambangan (Eco-Coal Logistics)',
    namaFounder: 'Bambang Batubara',
    nominalInvestasi: 500000000,
    persentaseSaham: 8,
    estimasiDividen: 35,
    tanggalInvestasi: '2026-03-10',
    tenorTahun: 5,
    status: 'dicairkan',
    deskripsiBisnis: 'Penyediaan armada tongkang ramah lingkungan dan sistem logistik batubara rendah emisi untuk menyuplai komoditas energi dengan standar kepatuhan lingkungan tinggi.',
    kontakFounder: '0811-7788-9900',
    prospektusUrl: 'prospektus_bambang_baru_bara.pdf',
    dividendHistory: [
      { id: 'bh4_1', tanggal: '2026-05-15', nominalDividen: 45000000, keterangan: 'Dividen Ekspor Batubara Siklus I' },
      { id: 'bh4_2', tanggal: '2026-06-30', nominalDividen: 52000000, keterangan: 'Dividen Kontrak PLN Triwulan II' }
    ]
  }
];

// Initial Savings Transactions
export const initialSimpananTransaksi: SimpananTransaksi[] = [
  { id: 'st1', anggotaId: 'm1', anggotaNama: 'Marmad Tuaian', jenisSimpananId: 'js1', jenisNama: 'Simpanan Pokok', tanggal: '2023-01-15', tipe: 'setor', jumlah: 1000000, keterangan: 'Setoran Pokok Awal Keanggotaan' },
  { id: 'st2', anggotaId: 'm1', anggotaNama: 'Marmad Tuaian', jenisSimpananId: 'js2', jenisNama: 'Simpanan Wajib Bulanan', tanggal: '2023-02-15', tipe: 'setor', jumlah: 100000, keterangan: 'Setoran Wajib Bulan Februari 2023' },
  { id: 'st3', anggotaId: 'm1', anggotaNama: 'Marmad Tuaian', jenisSimpananId: 'js2', jenisNama: 'Simpanan Wajib Bulanan', tanggal: '2023-03-15', tipe: 'setor', jumlah: 100000, keterangan: 'Setoran Wajib Bulan Maret 2023' },
  { id: 'st4', anggotaId: 'm1', anggotaNama: 'Marmad Tuaian', jenisSimpananId: 'js3', jenisNama: 'Simpanan Sukarela Harian', tanggal: '2023-04-10', tipe: 'setor', jumlah: 2000000, keterangan: 'Setor Tabungan Sukarela Tunai' },
  { id: 'st5', anggotaId: 'm1', anggotaNama: 'Marmad Tuaian', jenisSimpananId: 'js3', jenisNama: 'Simpanan Sukarela Harian', tanggal: '2023-05-15', tipe: 'tarik', jumlah: 500000, keterangan: 'Penarikan Sukarela keperluan Darurat' },
  { id: 'st6', anggotaId: 'm2', anggotaNama: 'Ahmad Kanh', jenisSimpananId: 'js1', jenisNama: 'Simpanan Pokok', tanggal: '2023-03-10', tipe: 'setor', jumlah: 1000000, keterangan: 'Setoran Pokok Awal Ahmad' }
];

// Initial Loans
export const initialPinjaman: Pinjaman[] = [
  {
    id: 'p_1',
    anggotaId: 'm1',
    anggotaNama: 'Marmad Tuaian',
    jenisPinjamanId: 'jp1',
    jenisNama: 'Pinjaman Umum Multiguna (Flat)',
    noPinjaman: 'LOAN-2023-001',
    pokok: 12000000,
    tenorMonths: 12,
    bungaPersen: 1.0,
    metodeBunga: 'flat',
    angsuranPerBulan: 1120000, // 1000000 pokok + 120000 bunga
    biayaAdmin: 50000,
    sisaPokok: 4000000,
    status: 'dicairkan',
    tanggalPengajuan: '2023-05-01',
    tanggalCair: '2023-05-03'
  },
  {
    id: 'p_2',
    anggotaId: 'm2',
    anggotaNama: 'Ahmad Kanh',
    jenisPinjamanId: 'jp3',
    jenisNama: 'Pinjaman Pendidikan Anak',
    noPinjaman: 'LOAN-2023-002',
    pokok: 8000000,
    tenorMonths: 8,
    bungaPersen: 0.8,
    metodeBunga: 'flat',
    angsuranPerBulan: 1064000, // 1000000 + 64000
    biayaAdmin: 25000,
    sisaPokok: 0,
    status: 'lunas',
    tanggalPengajuan: '2023-04-10',
    tanggalCair: '2023-04-12'
  },
  {
    id: 'p_3',
    anggotaId: 'm3',
    anggotaNama: 'Siti Rahmawati',
    jenisPinjamanId: 'jp4',
    jenisNama: 'Pinjaman Darurat Mikro',
    noPinjaman: 'LOAN-2024-001',
    pokok: 3000000,
    tenorMonths: 6,
    bungaPersen: 1.5,
    metodeBunga: 'flat',
    angsuranPerBulan: 545000, // 500000 + 45000
    biayaAdmin: 10000,
    sisaPokok: 3000000,
    status: 'pengajuan',
    tanggalPengajuan: '2026-07-01'
  }
];

// Initial Angsuran Schedule for Marmad's Active Loan
export const initialAngsuran: Angsuran[] = [
  { id: 'a1', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 1, tanggalJatuhTempo: '2023-06-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-06-02' },
  { id: 'a2', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 2, tanggalJatuhTempo: '2023-07-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-07-01' },
  { id: 'a3', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 3, tanggalJatuhTempo: '2023-08-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-08-03' },
  { id: 'a4', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 4, tanggalJatuhTempo: '2023-09-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-09-02' },
  { id: 'a5', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 5, tanggalJatuhTempo: '2023-10-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-10-03' },
  { id: 'a6', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 6, tanggalJatuhTempo: '2023-11-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-11-01' },
  { id: 'a7', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 7, tanggalJatuhTempo: '2023-12-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2023-12-02' },
  { id: 'a8', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 8, tanggalJatuhTempo: '2024-01-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'lunas', tanggalBayar: '2024-01-02' },
  { id: 'a9', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 9, tanggalJatuhTempo: '2024-02-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'belum_bayar' },
  { id: 'a10', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 10, tanggalJatuhTempo: '2024-03-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'belum_bayar' },
  { id: 'a11', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 11, tanggalJatuhTempo: '2024-04-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'belum_bayar' },
  { id: 'a12', pinjamanId: 'p_1', anggotaNama: 'Marmad Tuaian', angsuranKe: 12, tanggalJatuhTempo: '2024-05-03', pokokBayar: 1000000, bungaBayar: 120000, totalBayar: 1120000, status: 'belum_bayar' }
];

export const initialJournals: JournalEntry[] = [
  {
    id: 'j1',
    noJurnal: 'JRN-20260704-001',
  status: 'disetujui',
    tanggal: '2026-07-04',
    keterangan: 'Pencatatan Simpanan Pokok Anggota Marmad Tuaian',
    sumber: 'Simpanan',
    debit: 1000000,
    kredit: 1000000,
    details: [
      { coa: '1102', namaAkun: 'Bank Mandiri Kantor Cabang', debit: 1000000, kredit: 0 },
      { coa: '3101', namaAkun: 'Simpanan Pokok Anggota', debit: 0, kredit: 1000000 }
    ]
  },
  {
    id: 'j2',
    noJurnal: 'JRN-20260704-002',
  status: 'disetujui',
    tanggal: '2026-07-04',
    keterangan: 'Setoran Wajib Bulanan Tunai - Ahmad Kanh',
    sumber: 'Simpanan',
    debit: 100000,
    kredit: 100000,
    details: [
      { coa: '1101', namaAkun: 'Kas Kecil Tunai', debit: 100000, kredit: 0 },
      { coa: '3102', namaAkun: 'Simpanan Wajib Anggota', debit: 0, kredit: 100000 }
    ]
  },
  {
    id: 'j3',
    noJurnal: 'JRN-20260704-003',
  status: 'disetujui',
    tanggal: '2026-07-04',
    keterangan: 'POS Penjualan Toko - Faktur FK-20260704-005',
    sumber: 'Toko',
    debit: 250000,
    kredit: 250000,
    details: [
      { coa: '1101', namaAkun: 'Kas Kecil Tunai', debit: 250000, kredit: 0 },
      { coa: '4101', namaAkun: 'Pendapatan Penjualan Toko', debit: 0, kredit: 250000 }
    ]
  }
];

export const initialPengumuman: Pengumuman[] = [
  {
    id: 'an1',
    judul: 'Rapat Anggota Tahunan (RAT) Tahun Buku 2025',
    konten: 'Diberitahukan kepada seluruh anggota Koperasi MetroCOOP bahwa Rapat Anggota Tahunan akan diselenggarakan pada tanggal 25 Juli 2026 bertempat di Gedung Serbaguna Pancoran. Partisipasi Anda sangat kami harapkan. Tersedia souvenir menarik dan doorprize saldo simpanan!',
    tipe: 'pengumuman',
    target: 'semua',
    tanggalMulai: '2026-07-01',
    tanggalSelesai: '2026-07-24',
    status: 'aktif'
  },
  {
    id: 'an2',
    judul: 'Promo Belanja Akhir Tahun di Toko Koperasi',
    konten: 'Dapatkan diskon belanja hingga 15% untuk pembelian sembako kumulatif di atas Rp 150.000 selama periode promo. Belanja mudah, keuntungan berlimpah bersama unit Toko MetroCOOP!',
    tipe: 'promo',
    target: 'anggota',
    tanggalMulai: '2026-06-10',
    tanggalSelesai: '2026-07-15',
    status: 'aktif'
  }
];

export const initialTiketBantuan: TiketBantuan[] = [
  {
    id: 't1',
    anggotaId: 'm1',
    anggotaNama: 'Marmad Tuaian',
    subjek: 'Pertanyaan mengenai Bunga Deposito Berjangka',
    pesan: 'Halo Admin, saya baru saja mendaftar Deposito Berjangka MetroSafe Rp 10.000.000 pada awal bulan ini. Bagaimana cara memantau bunga bulanan dan kapan bunga ditransfer ke rekening tabungan sukarela saya?',
    kategori: 'Simpanan',
    prioritas: 'Sedang',
    tanggal: '2026-07-02',
    status: 'Terbuka'
  },
  {
    id: 't2',
    anggotaId: 'm2',
    anggotaNama: 'Ahmad Kanh',
    subjek: 'Gagal upload bukti transfer simpanan wajib',
    pesan: 'Saya mencoba upload bukti transfer simpanan wajib bulan Juni kemarin dari menu kirim bukti, namun selalu muncul error format file tidak didukung walaupun filenya JPG. Mohon solusinya.',
    kategori: 'Aplikasi',
    prioritas: 'Tinggi',
    tanggal: '2026-06-28',
    status: 'Diproses',
    balasanAdmin: 'Halo Ahmad, mohon pastikan ukuran file tidak melebihi 2MB dan coba kembali. Tim IT kami sedang meninjau keluhan Anda.'
  }
];

export const initialBuktiTransfer: BuktiTransfer[] = [
  {
    id: 'bt1',
    anggotaId: 'm1',
    anggotaNama: 'Marmad Tuaian',
    jenisSimpananId: 'js2',
    jenisNama: 'Simpanan Wajib Bulanan',
    tanggal: '2026-07-03',
    jumlah: 100000,
    keterangan: 'Setoran Wajib Juni 2026',
    bankPengirim: 'Bank Mandiri (ATM)',
    noRef: 'TRF88902804',
    status: 'pending'
  }
];

// Prepopulated stats for other mock modules (Sewa/Rental, PPOB, Digital Payment, Pembiayaan)
export const initialSewaAssets = [
  { id: 'sw1', nama: 'Laptop Lenovo ThinkPad L14', kategori: 'Elektronik', biayaSewaPerHari: 120000, status: 'Tersedia' },
  { id: 'sw2', nama: 'Proyektor Epson EB-X400 3600 Lumens', kategori: 'Elektronik', biayaSewaPerHari: 150000, status: 'Disewa' },
  { id: 'sw3', nama: 'Kursi Lipat Futura (Set isi 50)', kategori: 'Peralatan', biayaSewaPerHari: 200000, status: 'Tersedia' }
];

export const initialSewaTransactions = [
  { id: 'swt1', asetNama: 'Proyektor Epson EB-X400', penyewaNama: 'Budi Raharjo (Operator)', tglMulai: '2026-07-03', tglSelesai: '2026-07-06', totalBiaya: 450000, status: 'Aktif' }
];

export const initialPpobLayanan = [
  { id: 'pp1', nama: 'Pulsa Seluler (All Operator)', tipe: 'Voucher', nominalMin: 5000, nominalMax: 100000, status: 'Aktif' },
  { id: 'pp2', nama: 'Token Listrik PLN Prabayar', tipe: 'Listrik', nominalMin: 20000, nominalMax: 1000000, status: 'Aktif' },
  { id: 'pp3', nama: 'Pembayaran Tagihan PDAM', tipe: 'Tagihan', nominalMin: 0, nominalMax: 0, status: 'Aktif' },
  { id: 'pp4', nama: 'Iuran BPJS Kesehatan', tipe: 'Tagihan', nominalMin: 0, nominalMax: 0, status: 'Aktif' }
];
