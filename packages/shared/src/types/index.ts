export interface KoperasiInfo {
  nama: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telp: string;
  email: string;
  noBadanHukum: string;
  noIzinUsaha: string;
  npwp: string;
}

export type UserRole = 'superadmin' | 'admin' | 'operator' | 'anggota' | 'anggota_perusahaan';
export type TipeAnggota = 'konvensional' | 'perusahaan';

export interface UserSession {
  id: string;
  username: string;
  namaLengkap: string;
  role: UserRole;
  nik?: string;
  memberId?: string;
  isActive: boolean;
  password?: string;
}

export interface Anggota {
  id: string;
  nik: string;
  nama: string;
  noKtp: string;
  noHp: string;
  email: string;
  alamat: string;
  pekerjaan: string;
  penghasilan: number;
  statusKeanggotaan: 'aktif' | 'nonaktif' | 'keluar';
  tanggalDaftar: string;
  saldoSimpananPokok: number;
  saldoSimpananWajib: number;
  saldoSimpananSukarela: number;
  tipeAnggota?: TipeAnggota;
}

export interface Pengurus {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  periodeMulai: string;
  periodeSelesai: string;
  noSk: string;
  noHp: string;
  status: 'aktif' | 'nonaktif';
}

export interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  departemen: string;
  noHp: string;
  gajiPokok: number;
  status: 'tetap' | 'kontrak' | 'magang';
  statusAktif: boolean;
}

export interface AsetBarang {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Tanah' | 'Bangunan' | 'Kendaraan' | 'Elektronik' | 'Perabotan' | 'Inventaris';
  hargaPerolehan: number;
  nilaiResidu: number;
  masaManfaat: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  lokasi: string;
}

export interface SumberBayar {
  id: string;
  nama: string;
  tipe: 'Tunai' | 'Transfer Bank' | 'E-Wallet' | 'QRIS';
  noRekening?: string;
  akunCoa: string;
}

export interface JenisSimpanan {
  id: string;
  nama: string;
  tipe: 'pokok' | 'wajib' | 'sukarela' | 'deposito';
  minimalSetoran: number;
  bungaPersen: number;
}

export interface SimpananTransaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenisSimpananId: string;
  jenisNama: string;
  tanggal: string;
  tipe: 'setor' | 'tarik';
  jumlah: number;
  keterangan: string;
}

export interface PermohonanTarik {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenisSimpananId: string;
  jenisNama: string;
  tanggal: string;
  jumlah: number;
  status: 'pengajuan' | 'disetujui' | 'ditolak';
}

export interface JenisPinjaman {
  id: string;
  nama: string;
  bungaPersen: number;
  metodeBunga: 'flat' | 'efektif' | 'anuitas';
  maksTenor: number;
  maksPlafon: number;
  biayaAdmin: number;
}

export interface Pinjaman {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenisPinjamanId: string;
  jenisNama: string;
  noPinjaman: string;
  pokok: number;
  tenorMonths: number;
  bungaPersen: number;
  metodeBunga: 'flat' | 'efektif' | 'anuitas';
  angsuranPerBulan: number;
  biayaAdmin: number;
  sisaPokok: number;
  status: 'pengajuan' | 'disetujui' | 'dicairkan' | 'lunas' | 'ditolak';
  tanggalPengajuan: string;
  tanggalCair?: string;
}

export interface Angsuran {
  id: string;
  pinjamanId: string;
  anggotaNama: string;
  angsuranKe: number;
  tanggalJatuhTempo: string;
  pokokBayar: number;
  bungaBayar: number;
  totalBayar: number;
  status: 'belum_bayar' | 'lunas' | 'terlambat';
  tanggalBayar?: string;
}

export interface JournalEntry {
  id: string;
  noJurnal: string;
  tanggal: string;
  keterangan: string;
  sumber: string;
  debit: number;
  kredit: number;
  status: string;
  details: {
    coa: string;
    namaAkun: string;
    debit: number;
    kredit: number;
  }[];
}

export interface KategoriBarang {
  id: string;
  nama: string;
}

export interface Supplier {
  id: string;
  nama: string;
  kontak: string;
  noHp: string;
  alamat: string;
}

export interface Barang {
  id: string;
  kode: string;
  nama: string;
  kategoriId: string;
  supplierId: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  stokMinimum: number;
  satuan: string;
}

export interface Penjualan {
  id: string;
  noFaktur: string;
  tanggal: string;
  items: {
    barangId: string;
    nama: string;
    qty: number;
    hargaJual: number;
    subtotal: number;
  }[];
  total: number;
  metodeBayar: string;
  diskon: number;
}

export interface Pembelian {
  id: string;
  noInvoice: string;
  tanggal: string;
  supplierId: string;
  supplierNama: string;
  items: {
    barangId: string;
    nama: string;
    qty: number;
    hargaBeli: number;
    subtotal: number;
  }[];
  total: number;
  status: 'pesan' | 'diterima' | 'batal';
}

export interface FeatureToggles {
  anggota: boolean;
  simpanan: boolean;
  pinjaman: boolean;
  dataMaster: boolean;
  laporan: boolean;
  portalAnggota: boolean;
  toko: boolean;
  sewa: boolean;
  ppob: boolean;
  digitalPayment: boolean;
  pembiayaan: boolean;
  pengumuman: boolean;
  ventura: boolean;
}

export interface VentureDividend {
  id: string;
  tanggal: string;
  nominalDividen: number;
  keterangan: string;
}

export interface VentureInvestment {
  id: string;
  namaPerusahaan: string;
  sektorIndustri: string;
  namaFounder: string;
  nominalInvestasi: number;
  persentaseSaham: number;
  estimasiDividen: number;
  tanggalInvestasi: string;
  tenorTahun: number;
  status: 'pengajuan' | 'disetujui' | 'dicairkan' | 'selesai' | 'ditolak';
  deskripsiBisnis: string;
  kontakFounder: string;
  prospektusUrl?: string;
  pengajuAnggotaId?: string;
  pengajuAnggotaNama?: string;
  dividendHistory: VentureDividend[];
}

export interface Pengumuman {
  id: string;
  judul: string;
  konten: string;
  tipe: 'pengumuman' | 'promo';
  target: 'semua' | 'anggota';
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'aktif' | 'nonaktif';
}

export interface TiketBantuan {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  subjek: string;
  pesan: string;
  kategori: 'Simpanan' | 'Pinjaman' | 'Toko' | 'Aplikasi' | 'Lainnya';
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi';
  tanggal: string;
  status: 'Terbuka' | 'Diproses' | 'Selesai';
  balasanAdmin?: string;
}

export interface BuktiTransfer {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenisSimpananId: string;
  jenisNama: string;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  bankPengirim: string;
  noRef: string;
  status: 'pending' | 'disetujui' | 'ditolak';
}

export interface SewaAsset {
  id: string;
  nama: string;
  kategori: string;
  biayaSewaPerHari: number;
  status: 'Tersedia' | 'Disewa' | 'Perawatan';
  deskripsi?: string;
}

export interface SewaTransaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  asetId: string;
  asetNama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  totalBiaya: number;
  denda?: number;
  status: 'pengajuan' | 'disetujui' | 'berjalan' | 'selesai' | 'ditolak';
  buktiBayarUrl?: string;
}

export interface PpobLayanan {
  id: string;
  nama: string;
  tipe: 'Voucher' | 'Listrik' | 'Tagihan';
  nominalMin: number;
  nominalMax: number;
  status: 'Aktif' | 'Nonaktif';
}

export interface PpobTransaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  layananId: string;
  layananNama: string;
  targetNumber: string;
  nominal: number;
  hargaKoperasi: number;
  hargaJual: number;
  tanggal: string;
  status: 'sukses' | 'proses' | 'gagal';
  sn?: string;
  noReferensi: string;
}

export interface VirtualAccount {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  bank: 'Mandiri' | 'BNI' | 'BRI' | 'BCA' | 'Permata';
  nomorVA: string;
  label: string;
  status: 'aktif' | 'nonaktif';
}

export interface VATransaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  nomorVA: string;
  bank: string;
  nominal: number;
  jenisTrx: 'topup_sukarela' | 'bayar_angsuran' | 'bayar_cicilan_barang';
  tanggal: string;
  status: 'sukses' | 'pending' | 'expired';
}

export interface CicilanBarang {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  barangNama: string;
  totalHarga: number;
  dp: number;
  pokokPembiayaan: number;
  tenorMonths: number;
  bungaPersen: number;
  angsuranPerBulan: number;
  sisaPokok: number;
  status: 'pengajuan' | 'disetujui' | 'aktif' | 'lunas' | 'ditolak';
  tanggalPengajuan: string;
  tanggalMulai?: string;
}

export interface ChartOfAccount {
  id: string;
  kodeAkun: string;
  namaAkun: string;
  kategori: 'ASET' | 'KEWAJIBAN' | 'EKUITAS' | 'PENDAPATAN' | 'BEBAN' | 'SHU';
  subKategori: string;
  saldoNormal: 'debit' | 'kredit';
  level: number;
  parentId?: string;
  isActive: boolean;
  isHeader: boolean;
  children?: ChartOfAccount[];
}

export interface AccountingPeriod {
  id: string;
  tahun: number;
  bulan: number;
  namaPeriode: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  isOpen: boolean;
  isClosed: boolean;
}

export interface CicilanAngsuran {
  id: string;
  cicilanBarangId: string;
  anggotaNama: string;
  angsuranKe: number;
  tanggalJatuhTempo: string;
  pokokBayar: number;
  bungaBayar: number;
  totalBayar: number;
  status: 'belum_bayar' | 'lunas' | 'terlambat';
  tanggalBayar?: string;
}

export interface LandingSettings {
  id: string;
  koperasiName: string;
  koperasiTagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface LandingHero {
  id: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  backgroundType: 'gradient' | 'image' | 'solid';
  bgImageUrl: string;
  isActive: boolean;
}

export interface LandingFeature {
  id: string;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LandingTeam {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  sortOrder: number;
}

export interface LandingTestimonial {
  id: string;
  name: string;
  position: string;
  content: string;
  avatarUrl: string;
  rating: number;
  sortOrder: number;
}

export interface LandingPricing {
  id: string;
  planName: string;
  priceLabel: string;
  priceAmount: string;
  description: string;
  isPopular: boolean;
  features: string[];
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
}

export interface LandingContact {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  officeHours: string;
  mapEmbedUrl: string;
  footerDescription: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYoutube: string;
}

export interface LandingPageData {
  settings: LandingSettings;
  hero: LandingHero;
  features: LandingFeature[];
  team: LandingTeam[];
  testimonials: LandingTestimonial[];
  pricing: LandingPricing[];
  contact: LandingContact;
}

export interface Perusahaan {
  id: string;
  kodePerusahaan: string;
  nama: string;
  sektorIndustri: string;
  namaDirektur: string;
  alamat: string;
  kota: string;
  provinsi: string;
  tahunBerdiri: string;
  noAktePendirian: string;
  npwp: string;
  plafonDisetujui?: number;
  outstanding?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VenturaPengajuan {
  id: string;
  perusahaanId: string;
  perusahaanNama: string;
  sektorIndustri: string;
  tahap: string;
  plafonDiajukan: number;
  plafonDisetujui?: number;
  tenorBulan: number;
  status: string;
  hasilSkoring?: any;
  dokumen?: { id: string; nama: string; status: string; url?: string }[];
  createdAt: string;
  updatedAt?: string;
}
