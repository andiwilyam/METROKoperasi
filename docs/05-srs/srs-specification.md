# Spesifikasi Kebutuhan Perangkat Lunak (Software Requirements Specification — SRS)

## Sistem Informasi Koperasi Simpan Pinjam MetroCoop

| **Proyek** | MetroCoop — Koperasi Simpan Pinjam |
|---|---|
| **Versi Dokumen** | 1.0.0 |
| **Tanggal** | 16 Juli 2026 |
| **Status** | Final |
| **Klasifikasi** | Rahasia / Internal |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Ikhtisar Sistem](#2-ikhtisar-sistem)
3. [Arsitektur & Stack Teknis](#3-arsitektur--stack-teknis)
4. [Spesifikasi Data Model](#4-spesifikasi-data-model)
5. [Use Case Sistem](#5-use-case-sistem)
6. [Aturan Bisnis Detail](#6-aturan-bisnis-detail)
7. [Spesifikasi API](#7-spesifikasi-api)
8. [Integrasi Eksternal](#8-integrasi-eksternal)
9. [Keamanan Sistem](#9-keamanan-sistem)
10. [Performa & Skalabilitas](#10-performa--skalabilitas)
11. [Kriteria Penerimaan](#11-kriteria-penerimaan)
12. [Lampiran](#12-lampiran)
13. [Persetujuan Dokumen](#13-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SRS) ini mendeskripsikan seluruh kebutuhan fungsional, non-fungsional, dan teknis untuk sistem **MetroCoop** — platform manajemen Koperasi Simpan Pinjam (KSP) terintegrasi berbasis cloud. Dokumen ini menjadi acuan utama bagi seluruh stakeholder pengembangan: Product Manager, Tech Lead, Developer, QA, dan klien.

### 1.2 Ruang Lingkup

Sistem MetroCoop mencakup:

- **Manajemen Keanggotaan** — pendaftaran, validasi, status, dokumen anggota
- **Modul Simpanan** — pokok, wajib, sukarela, deposito dengan bunga otomatis
- **Modul Pinjaman** — pengajuan, pencairan, angsuran, denda, kolektibilitas
- **Akuntansi SAK ETAP** — COA, jurnal otomatis, buku besar, neraca saldo, laporan keuangan
- **Unit Usaha** — POS retail/toko, PPOB, sewa aset, cicilan barang, ventura/penyertaan modal
- **AI Credit Scoring** — analisis 5C berbasis Google Gemini
- **Landing Page CMS** — hero, fitur, tim, testimoni, pricing, kontak (dikelola admin)
- **Portal Anggota** — dashboard, simpanan, pinjaman, pengumuman, tiket bantuan
- **Pelaporan OJK** — LKP, BMPK, kolektibilitas, KPMM, SHU

### 1.3 Referensi Regulasi

| No | Regulasi | Judul | Relevansi |
|----|----------|-------|-----------|
| 1 | **UU No. 17 Tahun 2012** | Undang-Undang tentang Koperasi | Dasar utama keanggotaan, modal, pengurus, pengawas, RAT, SHU, sanksi |
| 2 | **POJK No. 12/POJK.03/2018** | Koperasi Simpan Pinjam | Prinsip kehati-hatian, KPMM, BMPK, Kolektibilitas, Pelaporan ke OJK |
| 3 | **POJK No. 70/POJK.03/2019** | Layanan Keuangan Digital (Laku Pandai) | Inklusi keuangan, layanan digital, e-KYC |
| 4 | **SEOJK No. 14/SEOJK.03/2019** | Standar Pelaporan KSP ke OJK | Format LKP, BMPK, Kolektibilitas, XBRL-ready |
| 5 | **SAK ETAP (PSAK 70)** | Standar Akuntansi Entitas Tanpa Akuntabilitas Publik | COA, Jurnal, Neraca, Laba Rugi, Arus Kas, Catatan atas LK |
| 6 | **PSAK 71 / IFRS 9** | Instrumen Keuangan — Pengukuran Nilai Wajar CKPN | Cadangan Kerugian Penurunan Nilai, kolektibilitas |
| 7 | **UU No. 27 Tahun 2022** | Perlindungan Data Pribadi (PDP) | Perlindungan data pribadi anggota, consent, DPO, breach notification |
| 8 | **UU No. 11 Tahun 2008 jo. UU No. 1 Tahun 2024** | Informasi dan Transaksi Elektronik (ITE) | Transaksi elektronik, tanda tangan digital, bukti elektronik |

### 1.4 Definisi, Singkatan, dan Akronim

| Istilah | Definisi |
|---------|----------|
| **KSP** | Koperasi Simpan Pinjam — badan hukum yang menjalankan usaha simpan pinjam berdasarkan prinsip koperasi |
| **COA** | Chart of Accounts / Daftar Akun — struktur hierarkis akun akuntansi sesuai SAK ETAP |
| **SAK ETAP** | Standar Akuntansi Keuangan untuk Entitas Tanpa Akuntabilitas Publik (berbasis PSAK 70) |
| **OJK** | Otoritas Jasa Keuangan — lembaga pengawas sektor jasa keuangan di Indonesia |
| **CKPN** | Cadangan Kerugian Penurunan Nilai — cadangan wajib untuk piutang bermasalah |
| **KPMM** | Kewajiban Penyediaan Modal Minimum — minimum modal yang harus dipenuhi KSP (8% dari CKPM) |
| **BMPK** | Batas Maksimum Pemberian Kredit — maksimum pemberian kredit per debitur (≤20% Modal Sendiri) |
| **SHU** | Sisa Hasil Usaha — laba bersih koperasi setelah dikurangi biaya dan cadangan |
| **RAT** | Rapat Anggota Tahunan — forum tertinggi pengambilan keputusan dalam koperasi |
| **POS** | Point of Sale — sistem kasir penjualan retail/toko |
| **PPOB** | Payment Point Online Bank — layanan pembayaran digital (pulsa, listrik, BPJS, dll.) |
| **RBAC** | Role-Based Access Control — mekanisme otorisasi berbasis peran pengguna |
| **JWT** | JSON Web Token — standar token autentikasi untuk komunikasi API |
| **PWA** | Progressive Web App — aplikasi web yang dapat diinstal dan berfungsi offline |
| **AI** | Artificial Intelligence — kecerdasan buatan, dalam konteks ini Google Gemini untuk credit scoring |
| **CKPM** | Coworking Kewajiban Penyediaan Modal — total aktiva tertimbang menurut risiko |
| **LKP** | Laporan Keuangan Periodik — laporan keuangan yang wajib dilaporkan ke OJK |

---

## 2. Ikhtisar Sistem

### 2.1 Gambaran Umum

MetroCoop adalah sistem informasi terintegrasi berbasis cloud yang dirancang khusus untuk mengelola operasional harian Koperasi Simpan Pinjam. Sistem ini mengotomasi siklus transaksi keuangan (simpanan, pinjaman, angsuran), pembukuan akuntansi, unit usaha, dan pelaporan regulasi sekaligus menyediakan portal digital bagi anggota.

### 2.2 Tech Stack

#### Frontend — `apps/web`

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| UI Library | React | 19.x |
| Bahasa | TypeScript | ~5.8 |
| Build Tool | Vite | 6.x |
| CSS Framework | Tailwind CSS | 4.x |
| Component Library | shadcn/ui | Latest (via Tailwind) |
| Routing | React Router DOM | 7.x |
| State Management | Zustand | 5.x |
| Animasi | Motion (Framer Motion) | 12.x |
| Ikon | Lucide React | 0.546 |
| Unit Test | Vitest + Testing Library | 4.x |
| E2E Test | Playwright | 1.61.x |

#### Backend — `server.ts` + `server/`

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | 20.x LTS |
| Framework | Express.js | 4.21.x |
| Bahasa | TypeScript | ~5.8 |
| ORM / Query