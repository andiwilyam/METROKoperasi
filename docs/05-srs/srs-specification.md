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
| ORM / Query | pg (node-postgres) | 8.22.x |
| Autentikasi | JWT (jsonwebtoken) | 9.x |
| Hashing Password | bcryptjs | 3.x |
| Validasi Input | Zod | 4.x |
| Security Headers | Helmet | 8.x |
| CORS | cors | 2.8.x |
| Rate Limiting | express-rate-limit | 8.x |
| AI Integration | @google/genai (Gemini) | 2.4.x |
| Bundler | esbuild | 0.25.x |
| Dev Runner | tsx | 4.21.x |

#### Database

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Relational DB | PostgreSQL | 16 |
| Hosting | Railway (PostgreSQL Plugin) | — |
| Data Type Khusus | JSONB | Untuk details jurnal, items penjualan |

#### AI Engine

| Komponen | Spesifikasi |
|----------|-------------|
| Model | Google Gemini 2.0 Flash |
| Endpoint | `generativelanguage.googleapis.com` |
| Autentikasi | API Key (via environment variable) |
| Output Format | JSON (structured output via responseSchema) |
| Penggunaan | Credit scoring 5C, audit risiko investasi |

#### CI/CD & Deployment

| Komponen | Teknologi |
|----------|-----------|
| Version Control | GitHub |
| CI Pipeline | GitHub Actions (`.github/workflows/ci.yml`) |
| CD Target | Railway (Production) |
| Preview Deploy | Railway Preview (per-PR via `deploy-preview.yml`) |
| Containerization | Dockerfile (multi-stage build) |

### 2.3 Struktur Monorepo

```
MetroCoop/
├── apps/
│   ├── web/                    # Frontend React SPA
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── admin/      # 30+ komponen admin
│   │   │   │   ├── member/     # 20+ komponen portal anggota
│   │   │   │   ├── landingMetroKSP/  # Landing page components
│   │   │   │   ├── AdminPortal.tsx
│   │   │   │   ├── MemberPortal.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── LoginScreen.tsx
│   │   │   ├── lib/api.ts
│   │   │   ├── stores/         # authStore, dataStore
│   │   │   ├── styles/tokens.css
│   │   │   ├── theme/
│   │   │   ├── pages/
│   │   │   ├── App.tsx
│   │   │   ├── AppContent.tsx
│   │   │   └── main.tsx
│   │   ├── tests/e2e/          # Playwright specs
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── mobile/                 # React Native (Expo) — fase lanjutan
│       └── src/
├── packages/
│   └── shared/                 # Shared library (types, validation, API client)
│       └── src/
│           ├── api/client.ts
│           ├── stores/
│           ├── types/index.ts
│           └── validation/index.ts
├── server/                     # Backend Express
│   ├── routes/auth.ts
│   ├── routes/data.ts
│   ├── lib/finance.ts          # Kalkulasi angsuran, HPP
│   ├── middleware.ts            # JWT auth, RBAC
│   ├── db.ts                   # PostgreSQL connection pool
│   └── migrate.ts              # Auto-migration runner
├── db/
│   ├── schema.sql              # DDL lengkap
│   └── seed.sql                # Data awal
├── scripts/                    # Utility scripts
├── server.ts                   # Entry point server
├── package.json                # Root workspace config
├── Dockerfile
├── railway.toml
└── .github/workflows/
    ├── ci.yml                  # CI: typecheck + build + E2E + deploy
    └── deploy-preview.yml      # Preview deploy per PR
```

### 2.4 Lingkungan Deployment

| Lingkungan | Trigger | URL | Keterangan |
|------------|---------|-----|------------|
| **Development** | `npm run dev` | `http://localhost:3000` | Vite dev server + Express, hot reload |
| **Preview (PR)** | Push ke branch PR | `https://metrocoop-pr-<N>.up.railway.app` | Auto-deploy via GitHub Actions |
| **Production** | Merge ke `main` | `https://metrocoop-app-production.up.railway.app` | Full build, health check verified |

---

## 3. Arsitektur & Stack Teknis

### 3.1 Arsitektur Aplikasi

Sistem menggunakan arsitektur **monolithic SPA + REST API** dalam satu proses Node.js, dengan pemisahan logis antara frontend (React SPA) dan backend (Express REST API) yang di-serve dari satu server.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ React SPA   │  │ Landing Page │  │ Mobile (Expo) │  │
│  │ (Vite build)│  │ (Static HTML)│  │ (fase lanjutan)│  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
└─────────┼────────────────┼───────────────────┼──────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER (Node.js)               │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│  │ Helmet  │→ │  CORS   │→ │ RateLimit│→ │   JWT   │  │
│  │ Headers │  │ Origin  │  │ Global   │  │   Auth  │  │
│  └─────────┘  └─────────┘  └──────────┘  └─────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Role Check   │→ │ Zod Validate │→ │ Route Handler│  │
│  │ (RBAC)       │  │ (Input)      │  │ (Business)   │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
│                                              │          │
│  ┌───────────────────────────────────────────▼───────┐  │
│  │              SERVICE LAYER                        │  │
│  │  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │  │
│  │  │ DB Query │  │ Auto-     │  │ Audit Trail   │  │  │
│  │  │ (pg pool)│  │ Journal   │  │ Log           │  │  │
│  │  └────┬─────┘  └───────────┘  └───────────────┘  │  │
│  └───────┼───────────────────────────────────────────┘  │
└──────────┼──────────────────────────────────────────────┘
           │
           ▼
┌──────────────────┐     ┌──────────────────────────────┐
│  PostgreSQL 16   │     │     External Services        │
│  (Railway DB)    │     │  ┌────────┐  ┌────────────┐  │
│  ┌────────────┐  │     │  │ Gemini │  │ Midtrans/  │  │
│  │ 40+ Tables │  │     │  │ AI API │  │ Xendit/    │  │
│  │ JSONB      │  │     │  └────────┘  │ Digiflazz  │  │
│  │ FK + Check │  │     │  ┌────────┐  └────────────┘  │
│  └────────────┘  │     │  │ WA API │  ┌────────────┐  │
│                  │     │  └────────┘  │ SMTP Email  │  │
└──────────────────┘     │              └────────────┘  │
                         └──────────────────────────────┘
```

### 3.2 Request Lifecycle

Setiap permintaan HTTP ke API melewati pipeline berikut secara berurutan:

```
HTTP Request
    │
    ▼
[1] Helmet — Set security headers (CSP, X-Frame-Options, HSTS, dll.)
    │
    ▼
[2] CORS — Validate origin, set Access-Control-Allow-Credentials
    │
    ▼
[3] Rate Limiter — 100 req/15 min (global), 10 req/15 min (login), 5 req/jam (register)
    │
    ▼
[4] JWT Authentication — Verify Bearer token, decode payload → req.user
    │
    ▼
[5] RBAC Role Check — adminOnly() / requireStaff() / scopeMemberId()
    │
    ▼
[6] Zod Validation — Validate request body/query/params against schema
    │
    ▼
[7] Route Handler — Execute business logic
    │
    ▼
[8] DB Transaction — BEGIN → INSERT/UPDATE → COMMIT (atau ROLLBACK on error)
    │
    ▼
[9] Auto-Journal — Generate journal_entries + details JSONB (Debit = Kredit)
    │
    ▼
[10] Audit Log — Record action: user, timestamp, before/after values
    │
    ▼
HTTP Response (JSON)
```

---

## 4. Spesifikasi Data Model

### 4.1 Tabel Utama — Definisi DDL

#### 4.1.1 `users` — Tabel Pengguna Sistem

```sql
CREATE TABLE users (
  id            VARCHAR(50)  PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  nama_lengkap  VARCHAR(200) NOT NULL,
  role          VARCHAR(30)  NOT NULL DEFAULT 'anggota'
                CHECK (role IN ('superadmin','admin','operator','anggota','anggota_perusahaan')),
  nik           VARCHAR(50)  DEFAULT NULL,
  member_id     VARCHAR(50)  DEFAULT NULL,
  is_active     BOOLEAN      DEFAULT true,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

**Keterangan:**
- `role` — Lima level otorisasi: `superadmin` (penuh), `admin` (operasional), `operator` (transaksi), `anggota` (portal diri sendiri), `anggota_perusahaan` (portal perusahaan)
- `member_id` — Referensi ke tabel `anggota.id`, menghubungkan akun pengguna dengan data keanggotaan
- `password_hash` — bcrypt hash dengan cost factor 10

#### 4.1.2 `anggota` — Tabel Data Anggota

```sql
CREATE TABLE anggota (
  id                       VARCHAR(50)  PRIMARY KEY,
  nik                      VARCHAR(50)  UNIQUE NOT NULL,
  nama                     VARCHAR(200) NOT NULL,
  no_ktp                   VARCHAR(50)  DEFAULT '',
  no_hp                    VARCHAR(50)  DEFAULT '',
  email                    VARCHAR(100) DEFAULT '',
  alamat                   TEXT         DEFAULT '',
  pekerjaan                VARCHAR(100) DEFAULT '',
  penghasilan              NUMERIC(15,0) DEFAULT 0,
  status_keanggotaan       VARCHAR(20)  DEFAULT 'aktif'
                           CHECK (status_keanggotaan IN ('aktif','nonaktif','keluar')),
  tanggal_daftar           DATE         DEFAULT CURRENT_DATE,
  saldo_simpanan_pokok     NUMERIC(15,0) DEFAULT 0,
  saldo_simpanan_wajib     NUMERIC(15,0) DEFAULT 0,
  saldo_simpanan_sukarela  NUMERIC(15,0) DEFAULT 0,
  tipe_anggota             VARCHAR(20)  DEFAULT 'konvensional'
                           CHECK (tipe_anggota IN ('konvensional','perusahaan'))
);
```

**Keterangan:**
- `nik` — Nomor Induk Kependudukan 16 digit, unik sebagai identitas utama anggota
- `tipe_anggota` — `konvensional` (individu) atau `perusahaan` (badan usaha)
- `saldo_simpanan_*` — Saldo aktual setiap jenis simpanan (diperbarui real-time pada setiap transaksi)

#### 4.1.3 `pinjaman` — Tabel Pinjaman

```sql
CREATE TABLE pinjaman (
  id                   VARCHAR(50)  PRIMARY KEY,
  anggota_id           VARCHAR(50)  NOT NULL REFERENCES anggota(id),
  anggota_nama         VARCHAR(200) NOT NULL,
  jenis_pinjaman_id    VARCHAR(50)  NOT NULL REFERENCES jenis_pinjaman(id),
  jenis_nama           VARCHAR(200) NOT NULL,
  no_pinjaman          VARCHAR(100) DEFAULT '',
  pokok                NUMERIC(15,0) NOT NULL,
  tenor_months         INTEGER      NOT NULL,
  bunga_persen         NUMERIC(5,2) DEFAULT 0,
  metode_bunga         VARCHAR(20)  DEFAULT 'flat',
  angsuran_per_bulan   NUMERIC(15,0) DEFAULT 0,
  biaya_admin          NUMERIC(15,0) DEFAULT 0,
  sisa_pokok           NUMERIC(15,0) DEFAULT 0,
  status               VARCHAR(20)  DEFAULT 'pengajuan'
                       CHECK (status IN ('pengajuan','disetujui','dicairkan','lunas','ditolak')),
  tanggal_pengajuan    DATE         DEFAULT CURRENT_DATE,
  tanggal_cair         DATE         DEFAULT NULL
);
```

**Keterangan:**
- `metode_bunga` — Tiga opsi perhitungan: `flat`, `efektif`, `anuitas`
- `sisa_pokok` — Saldo pokok yang belum dilunasi, diperbarui setiap pembayaran angsuran
- `status` — Alur: `pengajuan` → `disetujui` → `dicairkan` → `lunas` (atau `ditolak`)

#### 4.1.4 `angsuran` — Tabel Jadwal Angsuran

```sql
CREATE TABLE angsuran (
  id                    VARCHAR(50) PRIMARY KEY,
  pinjaman_id           VARCHAR(50) NOT NULL REFERENCES pinjaman(id),
  anggota_nama          VARCHAR(200) NOT NULL,
  angsuran_ke           INTEGER     NOT NULL,
  tanggal_jatuh_tempo   DATE        NOT NULL,
  pokok_bayar           NUMERIC(15,0) DEFAULT 0,
  bunga_bayar           NUMERIC(15,0) DEFAULT 0,
  total_bayar           NUMERIC(15,0) DEFAULT 0,
  status                VARCHAR(20)  DEFAULT 'belum_bayar'
                        CHECK (status IN ('belum_bayar','lunas','terlambat')),
  tanggal_bayar         DATE        DEFAULT NULL
);
```

**Keterangan:**
- `anggsuran_ke` — Urutan angsuran (1, 2, 3, ... tenor_months)
- `status` — Diperbarui otomatis oleh scheduler harian berdasarkan tanggal jatuh tempo vs tanggal bayar

#### 4.1.5 `journal_entries` — Tabel Jurnal Akuntansi

```sql
CREATE TABLE journal_entries (
  id          VARCHAR(50) PRIMARY KEY,
  no_jurnal   VARCHAR(100) NOT NULL,
  tanggal     DATE        NOT NULL DEFAULT CURRENT_DATE,
  keterangan  TEXT        DEFAULT '',
  sumber      VARCHAR(100) DEFAULT '',
  debit       NUMERIC(15,0) DEFAULT 0,
  kredit      NUMERIC(15,0) DEFAULT 0,
  details     JSONB       DEFAULT '[]'::jsonb
);
```

**Keterangan:**
- `details` — JSONB berisi array objek `{coa, namaAkun, debit, kredit}` yang merepresentasikan jurnal detail (double entry)
- `sumber` — Asal transaksi: `simpanan_setor`, `pinjaman_cair`, `pos_penjualan`, `angsuran_bayar`, dll.
- `no_jurnal` — Nomor urut jurnal unik (format: `JRN-YYYYMM-XXXX`)

#### 4.1.6 `chart_of_accounts` — Tabel Daftar Akun (COA)

```sql
CREATE TABLE chart_of_accounts (
  id            VARCHAR(50)  PRIMARY KEY,
  kode_akun     VARCHAR(20)  NOT NULL UNIQUE,
  nama_akun     VARCHAR(200) NOT NULL,
  kategori      VARCHAR(30)  NOT NULL
                CHECK (kategori IN ('ASET','KEWAJIBAN','EKUITAS','PENDAPATAN','BEBAN','SHU')),
  sub_kategori  VARCHAR(100) DEFAULT '',
  saldo_normal  VARCHAR(6)   NOT NULL CHECK (saldo_normal IN ('debit','kredit')),
  level         INTEGER      DEFAULT 1,
  parent_id     VARCHAR(50)  DEFAULT NULL REFERENCES chart_of_accounts(id),
  is_active     BOOLEAN      DEFAULT true,
  is_header     BOOLEAN      DEFAULT false,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

**Keterangan:**
- Struktur hierarkis 6 level sesuai SAK ETAP: Kelompok → Jenis → Kategori → Sub → Detail → Sub-detail
- `is_header` — true untuk akun kelompok (tidak bisa transaksi langsung)

#### 4.1.7 `jenis_pinjaman` — Tabel Produk Pinjaman

```sql
CREATE TABLE jenis_pinjaman (
  id              VARCHAR(50)  PRIMARY KEY,
  nama            VARCHAR(200) NOT NULL,
  bunga_persen    NUMERIC(5,2) DEFAULT 0,
  metode_bunga    VARCHAR(20)  DEFAULT 'flat'
                  CHECK (metode_bunga IN ('flat','efektif','anuitas')),
  maks_tenor      INTEGER      DEFAULT 12,
  maks_plafon     NUMERIC(15,0) DEFAULT 0,
  biaya_admin     NUMERIC(15,0) DEFAULT 0
);
```

### 4.2 Ringkasan Seluruh Tabel

Berikut adalah daftar lengkap 45+ tabel dalam sistem MetroCoop, dikelompokkan berdasarkan modul:

#### Modul Keanggotaan & Pengurus

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 1 | `users` | Akun pengguna sistem (login, role, password) |
| 2 | `anggota` | Data lengkap anggota koperasi |
| 3 | `pengurus` | Data pengurus (ketua, bendahara, sekretaris) |
| 4 | `karyawan` | Data karyawan koperasi |
| 5 | `perusahaan` | Data perusahaan anggota korporasi |

#### Modul Simpanan

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 6 | `jenis_simpanan` | Master jenis simpanan (pokok, wajib, sukarela, deposito) |
| 7 | `simpanan_transaksi` | Transaksi setor/tarik simpanan |
| 8 | `permohonan_tarik` | Pengajuan penarikan simpanan |
| 9 | `bukti_transfer` | Bukti transfer masuk dari anggota |

#### Modul Pinjaman & Angsuran

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 10 | `jenis_pinjaman` | Produk pinjaman (KUR, Mikro, Konsumtif, dll.) |
| 11 | `pinjaman` | Data pinjaman aktif |
| 12 | `angsuran` | Jadwal dan status pembayaran angsuran |

#### Modul Akuntansi & Pelaporan

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 13 | `chart_of_accounts` | Daftar akun (COA) hierarkis |
| 14 | `journal_entries` | Jurnal transaksi umum |
| 15 | `journal_approvals` | Approval dan status jurnal |
| 16 | `accounting_periods` | Periode akuntansi (bulan/tahun) |
| 17 | `subledger_piutang` | Subledger piutang pinjaman per anggota |

#### Modul Unit Usaha — Retail/Toko

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 18 | `kategori_barang` | Kategori produk |
| 19 | `supplier` | Data pemasok |
| 20 | `barang` | Master barang dagang |
| 21 | `penjualan` | Transaksi penjualan (POS) |
| 22 | `pembelian` | Transaksi pembelian dari supplier |

#### Modul Unit Usaha — Sewa Aset

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 23 | `aset_barang` | Master aset koperasi |
| 24 | `sewa_assets` | Aset yang tersedia untuk disewa |
| 25 | `sewa_transactions` | Transaksi penyewaan |

#### Modul Unit Usaha — PPOB & Digital Payment

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 26 | `ppob_layanan` | Layanan PPOB (pulsa, listrik, tagihan) |
| 27 | `ppob_transactions` | Transaksi PPOB |
| 28 | `sumber_bayar` | Sumber metode pembayaran |
| 29 | `virtual_accounts` | Virtual account anggota |
| 30 | `va_transactions` | Transaksi via VA |

#### Modul Unit Usaha — Cicilan Barang

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 31 | `cicilan_barang` | Pengajuan cicilan barang |
| 32 | `cicilan_angsuran` | Jadwal angsuran cicilan barang |

#### Modul Ventura & Investasi

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 33 | `venture_investments` | Investasi ventura/penyertaan modal |
| 34 | `venture_dividends` | History dividen dari investasi |

#### Modul AI Credit Scoring & Pengajuan

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 35 | `pengajuan_pembiayaan` | Pengajuan pembiayaan ventura |
| 36 | `dokumen_pengajuan` | Dokumen pendukung pengajuan |
| 37 | `hasil_skoring` | Hasil analisis 5C oleh AI |

#### Modul Administrasi & Komunikasi

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 38 | `pengumuman` | Pengumuman dan promo |
| 39 | `tiket_bantuan` | Layanan helpdesk anggota |
| 40 | `feature_toggles` | Fitur toggle (enable/disable modul) |
| 41 | `koperasi_info` | Informasi profil koperasi |

#### Modul Landing Page CMS

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 42 | `landing_settings` | Pengaturan umum landing page |
| 43 | `landing_hero` | Konten hero section |
| 44 | `landing_features` | Daftar fitur unggulan |
| 45 | `landing_team` | Data tim |
| 46 | `landing_testimonials` | Testimoni |
| 47 | `landing_pricing` | Paket harga |
| 48 | `landing_contact` | Informasi kontak |

#### Tabel Sistem

| No | Nama Tabel | Fungsi |
|----|-----------|--------|
| 49 | `migrations` | Tracking versi database migration |

---

## 5. Use Case Sistem

### UC-01: Registrasi Anggota Baru

| Field | Detail |
|-------|--------|
| **ID** | UC-01 |
| **Nama** | Registrasi Anggota Baru |
| **Actor** | Admin, Operator |
| **Precondition** | Pengguna terautentikasi dengan role admin atau operator |
| **Postcondition** | Akun pengguna baru dan data anggota berhasil dibuat dalam database |
| **Trigger** | Admin/Operator mengklik tombol "Tambah Anggota" dan mengisi formulir |

**Alur Utama:**
1. Admin/Operator membuka halaman Manajemen Anggota
2. Sistem menampilkan daftar anggota beserta tombol "Tambah Anggota"
3. Admin/Operator mengklik "Tambah Anggota"
4. Sistem menampilkan formulir registrasi dengan field: NIK, Nama Lengkap, No KTP, No HP, Email, Alamat, Pekerjaan, Penghasilan
5. Admin/Operator mengisi seluruh field wajib (NIK, Nama)
6. Sistem memvalidasi format NIK (16 digit angka) menggunakan Zod schema
7. Sistem mengecek duplikasi NIK di database (`SELECT id FROM anggota WHERE nik = $1`)
8. Jika NIK sudah ada, sistem menampilkan error "NIK sudah terdaftar" → kembali ke langkah 5
9. Sistem membuat record di tabel `anggota` dengan saldo simpanan awal = 0
10. Sistem membuat record di tabel `users` dengan role `anggota`, password hash (bcrypt cost 10), dan `member_id` yang merujuk ke `anggota.id`
11. Sistem mengembalikan respons sukses dengan data anggota yang baru dibuat

**Alur Alternatif:**
- **5a.** Admin/Operator mengisi NIK dengan format salah → Sistem menampilkan pesan validasi "NIK harus 16 digit angka"
- **7a.** Database error → Sistem mengembalikan HTTP 500 dengan pesan error

**Aturan Bisnis:**
- NIK harus unik di seluruh tabel `anggota`
- `status_keanggotaan` default `'aktif'`
- `tipe_anggota` default `'konvensional'`
- Password harus minimal 6 karakter
- `is_active` pada `users` default `true`
- Semua perubahan data tercatat dalam audit trail

---

### UC-02: Setor Simpanan

| Field | Detail |
|-------|--------|
| **ID** | UC-02 |
| **Nama** | Setor Simpanan |
| **Actor** | Operator, Admin |
| **Precondition** | Anggota terdaftar dengan status aktif; operator terautentikasi |
| **Postcondition** | Saldo simpanan anggota bertambah; jurnal akuntansi otomatis tercatat |
| **Trigger** | Operator menerima setoran tunai/transfer dari anggota |

**Alur Utama:**
1. Operator membuka halaman Simpanan → Transaksi
2. Sistem menampilkan formulir transaksi simpanan
3. Operator memilih anggota dari dropdown (search by nama/NIK)
4. Sistem menampilkan data anggota dan saldo terkini per jenis simpanan
5. Operator memilih jenis simpanan (Pokok / Wajib / Sukarela / Deposito)
6. Operator memilih tipe transaksi: **Setor**
7. Operator memasukkan jumlah setoran (harus > 0 dan ≥ minimal setoran jenis simpanan)
8. Operator mengisi keterangan (opsional)
9. Operator mengklik "Proses Transaksi"
10. Sistem memvalidasi input menggunakan `SimpananTransaksiSchema` (Zod)
11. Sistem melakukan DB transaction: UPDATE saldo anggota + INSERT transaksi + INSERT jurnal
12. Sistem membuat jurnal otomatis: Debit `Kas/Bank`, Kredit `Simpanan [jenis]`
13. Sistem mengembalikan respons sukses dengan data transaksi dan saldo terbaru

**Alur Alternatif:**
- **7a.** Jumlah < minimal setoran → Sistem menolak dengan pesan "Minimal setoran Rp X"
- **11a.** Anggota nonaktif → Sistem menolak dengan "Anggota tidak aktif"

**Aturan Bisnis:**
- Simpanan Pokok hanya bisa disetor saat pendaftaran (satu kali)
- Simpanan Wajib disetor berkala (minimal per bulan)
- Simpanan Sukarela bisa di kapan saja, tanpa batas minimal
- Setiap transaksi menghasilkan jurnal double entry (Debit = Kredit)
- Saldo pada tabel `anggota` di-update langsung (real-time)

---

### UC-03: Tarik Simpanan

| Field | Detail |
|-------|--------|
| **ID** | UC-03 |
| **Nama** | Tarik Simpanan |
| **Actor** | Anggota (via portal), Operator (via teller) |
| **Precondition** | Anggota memiliki saldo yang cukup pada jenis simpanan yang dipilih |
| **Postcondition** | Saldo simpanan berkurang; jurnal akuntansi tercatat |
| **Trigger** | Anggota mengajukan penarikan atau operator memproses penarikan tunai |

**Alur Utama:**
1. Anggota/Operator membuka halaman Penarikan Simpanan
2. Sistem menampilkan formulir penarikan
3. Pengguna memilih jenis simpanan dan memasukkan jumlah penarikan
4. Sistem memvalidasi: jumlah ≤ saldo tersedia
5. Untuk Simpanan Pokok: sistem **menolak** penarikan jika anggota masih aktif
6. Untuk Deposito: sistem memeriksa apakah sudah jatuh tempo (jika belum, dikenakan penalti)
7. Sistem membuat permohonan di `permohonan_tarik` dengan status `pengajuan`
8. Operator/Admin meng approve permohonan
9. Sistem memproses: UPDATE saldo, INSERT transaksi, INSERT jurnal
10. Jurnal: Debit `Simpanan [jenis]`, Kredit `Kas/Bank`

**Alur Alternatif:**
- **5a.** Penarikan Simpanan Pokok → **Ditolak otomatis**: "Simpanan Pokok tidak dapat ditarik selama keanggotaan aktif"
- **6a.** Deposito sebelum jatuh tempo → Dikenakan penalti sesuai konfigurasi
- **4a.** Saldo tidak cukup → Sistem menolak

**Aturan Bisnis:**
- Simpanan Pokok **tidak bisa ditarik** selama status anggota `aktif` (sesuai Pasal 40 UU 17/2012)
- Simpanan Wajib bisa ditarik dengan approval operator
- Simpanan Sukarela bisa ditarik kapan saja
- Deposito: penalti dikenakan jika tarik sebelum jatuh tempo
- Saldo akhir tidak boleh negatif

---

### UC-04: Pengajuan & Pencairan Pinjaman

| Field | Detail |
|-------|--------|
| **ID** | UC-04 |
| **Nama** | Pengajuan dan Pencairan Pinjaman |
| **Actor** | Anggota (pengajuan), Admin (verifikasi & approval), Operator (pencairan) |
| **Precondition** | Anggota aktif, memiliki simpanan wajib minimal 3 bulan terakhir |
| **Postcondition** | Pinjaman cair, jadwal angsuran tergenerate, jurnal tercatat |
| **Trigger** | Anggota mengajukan pinjaman atau admin menyetujui pengajuan |

**Alur Utama:**
1. Anggota/Operator mengajukan pinjaman dengan data: jenis pinjaman, pokok, tenor, tujuan
2. Sistem memvalidasi input menggunakan `PinjamanSchema` (Zod)
3. Sistem mengecek syarat: simpanan wajib ≥ 3 bulan, BMPK ≤ 20% Modal Sendiri
4. Jika lolos, sistem menyimpan dengan status `pengajuan`
5. Admin melakukan verifikasi 5C (Character, Capacity, Capital, Collateral, Condition)
6. Opsional: Admin menjalankan **AI Credit Scoring** (Gemini) untuk rekomendasi
7. Admin menyetujui/menolak pengajuan
8. Jika disetujui: status → `disetujui`, operator memproses pencairan
9. Pencairan: status → `dicairkan`, `tanggal_cair` diisi, `sisa_pokok` = `pokok`
10. Sistem generate jadwal angsuran berdasarkan metode bunga (flat/efektif/anuitas)
11. Jurnal otomatis: Debit `Piutang Pinjaman`, Kredit `Kas/Bank`

**Alur Alternatif:**
- **3a.** BMPK melebihi 20% → Sistem menolak: "Plafon melebihi batas BMPK"
- **5a.** Verifikasi 5C gagal → Admin menolak, status → `ditolak`
- **6a.** AI Score < 40 → Rekomendasi "Tolak"

**Aturan Bisnis:**
- BMPK per debitur ≤ 20% Modal Sendiri (bisa 25% dengan persetujuan RAT)
- Angsuran per bulan dihitung otomatis berdasarkan metode bunga
- Biaya admin dipotong dari dana cair
- Jurnal seimbang pada setiap tahap transaksi

---

### UC-05: Pembayaran Angsuran

| Field | Detail |
|-------|--------|
| **ID** | UC-05 |
| **Nama** | Pembayaran Angsuran Pinjaman |
| **Actor** | Anggota (portal/VA), Operator (teller) |
| **Precondition** | Pinjaman berstatus `dicairkan` dengan angsuran `belum_bayar` |
| **Postcondition** | Status angsuran → `lunas`, sisa pokok berkurang, jurnal tercatat |
| **Trigger** | Anggota membayar angsuran via VA/teller/portal |

**Alur Utama:**
1. Anggota/Operator memilih angsuran yang akan dibayar
2. Sistem menampilkan detail: angsuran ke, pokok bayar, bunga bayar, total bayar, denda (jika ada)
3. Pengguna mengkonfirmasi pembayaran
4. Sistem memproses dalam DB transaction:
   a. UPDATE `angsuran` → status `lunas`, `tanggal_bayar` = hari ini
   b. UPDATE `pinjaman` → `sisa_pokok` dikurangi `pokok_bayar`
   c. INSERT jurnal: Debit `Kas/Bank`, Kredit `Piutang Pokok` + Kredit `Pendapatan Bunga`
5. Jika `sisa_pokok` = 0 → UPDATE `pinjaman` → status `lunas`
6. Sistem mengembalikan respons sukses

**Alur Alternatif:**
- **2a.** Pembayaran parsial → Sistem mencatat proporsional
- **5a.** Masih ada sisa → Status pinjaman tetap `dicairkan`

**Aturan Bisnis:**
- Denda: Pokok tunggakan × Rate × Hari (cap 2%, flat, grace period 5 hari)
- Pembayaran melewati jatuh tempo → status angsuran → `terlambat` (update otomatis scheduler)
- Setiap pembayaran menghasilkan jurnal balanced

---

### UC-06: Transaksi POS/Retail

| Field | Detail |
|-------|--------|
| **ID** | UC-06 |
| **Nama** | Transaksi Penjualan POS (Point of Sale) |
| **Actor** | Operator (kasir) |
| **Precondition** | Operator terautentikasi; stok barang tersedia |
| **Postcondition** | Stok berkurang, transaksi tercatat, jurnal otomatis |
| **Trigger** | Kasir memproses penjualan barang |

**Alur Utama:**
1. Operator membuka modul POS/Toko
2. Operator memindai/memilih barang (by kode atau nama)
3. Sistem menampilkan harga jual dan stok tersedia
4. Operator memasukkan jumlah (qty), menambahkan ke keranjang
5. Ulangi langkah 2-4 untuk setiap barang
6. Operator memilih metode bayar (Tunai / Transfer / E-Wallet / QRIS)
7. Operator mengklik "Proses Penjualan"
8. Sistem memvalidasi input menggunakan `PenjualanSchema` (Zod)
9. Sistem memproses:
   a. INSERT `penjualan` (no_faktur auto, items JSONB, total, metode_bayar)
   b. UPDATE `barang` → stok dikurangi per item
   c. Hitung HPP (Harga Pokok Penjualan) dari harga beli
   d. INSERT jurnal: Debit `Kas`, Kredit `Pendapatan Penjualan`; Debit `HPP`, Kredit `Persediaan`
10. Sistem mencetak struk/faktur (opsional)

**Alur Alternatif:**
- **3a.** Stok tidak cukup → Sistem menolak item
- **9a.** Harga khusus anggota → sistem menggunakan harga diskon

**Aturan Bisnis:**
- HPP dihitung menggunakan metode FIFO
- Multi-metode bayar dalam satu transaksi
- Diskon per-transaksi (persentase atau nominal)
- Stok tidak boleh negatif

---

### UC-07: Jurnal Akuntansi Otomatis

| Field | Detail |
|-------|--------|
| **ID** | UC-07 |
| **Nama** | Jurnal Akuntansi Otomatis dari Transaksi |
| **Actor** | Sistem (otomatis) |
| **Precondition** | Transaksi bisnis berhasil diproses |
| **Postcondition** | Entri jurnal tercatat dengan detail JSONB, Debit = Kredit |
| **Trigger** | Setiap transaksi keuangan (simpanan, pinjaman, POS, PPOB, sewa, angsuran) |

**Mapping Jurnal Otomatis:**

| Sumber Transaksi | Debit | Kredit |
|------------------|-------|--------|
| Setor Simpanan Pokok | 1101 Kas / 1102 Bank | 2101 Simpanan Pokok |
| Setor Simpanan Wajib | 1101 Kas / 1102 Bank | 2102 Simpanan Wajib |
| Setor Simpanan Sukarela | 1101 Kas / 1102 Bank | 2103 Simpanan Sukarela |
| Setor Deposito | 1101 Kas / 1102 Bank | 2104 Deposito |
| Tarik Simpanan | 2103 Simpanan Sukarela | 1101 Kas / 1102 Bank |
| Pencairan Pinjaman | 1111 Piutang Pokok Pinjaman | 1101 Kas / 1102 Bank |
| Bayar Angsuran (Pokok) | 1101 Kas / 1102 Bank | 1111 Piutang Pokok Pinjaman |
| Bayar Angsuran (Bunga) | 1101 Kas / 1102 Bank | 4101 Pendapatan Bunga |
| Denda Tunggakan | 1101 Kas / 1102 Bank | 4102 Pendapatan Denda |
| Penjualan POS (Tunai) | 1101 Kas | 4201 Pendapatan Penjualan |
| Penjualan POS (HPP) | 5101 HPP | 1201 Persediaan Barang |
| Pembelian Barang | 1201 Persediaan Barang | 2201 Hutang Dagang |
| Pembayaran Hutang Dagang | 2201 Hutang Dagang | 1101 Kas / 1102 Bank |
| Pendapatan Sewa | 1101 Kas / 1102 Bank | 4301 Pendapatan Sewa |
| Biaya Admin Pinjaman | 1101 Kas / 1102 Bank | 4401 Pendapatan Biaya Admin |
| Beban Gaji Karyawan | 5201 Beban Gaji | 1101 Kas / 1102 Bank |
| Beban Penyusutan | 5301 Beban Penyusutan | 1301 Akumulasi Penyusutan |
| CKPN (Cadangan) | 5401 Beban CKPN | 1401 CKPN |
| Pendapatan Bunga Deposito | 2104 Deposito | 1101 Kas / 1102 Bank |
| Penutup Pendapatan | 4xxx Pendapatan | 6101 Ikhtisar Laba Rugi |
| Penutup Beban | 6201 Ikhtisar Laba Rugi | 5xxx Beban |
| Penutup SHU | 6101 Ikhtisar Laba Rugi | 3101 SHU Belum Dibagi |

**Alur Utama:**
1. Transaksi bisnis berhasil diproses
2. Sistem memanggil fungsi auto-journal
3. Sistem menentukan kode COA debit dan kredit berdasarkan tipe transaksi
4. Sistem menghitung nominal debit dan kredit
5. Sistem melakukan DB transaction: INSERT `journal_entries` dengan `details` JSONB berisi array COA
6. Sistem memverifikasi: total debit = total kredit
7. Jika tidak seimbang → ROLLBACK, log error

**Aturan Bisnis:**
- Setiap jurnal harus seimbang (Debit = Kredit) — dijamin oleh DB transaction
- `details` JSONB memuat baris jurnal detail untuk setiap akun yang terpengaruh
- `no_jurnal` di-generate otomatis format `JRN-YYYYMM-XXXX`
- Semua jurnal harus traceable ke transaksi sumber

---

### UC-08: Tutup Buku Periode Akuntansi

| Field | Detail |
|-------|--------|
| **ID** | UC-08 |
| **Nama** | Tutup Buku Periode Akuntansi |
| **Actor** | Admin (Bendahara/Ketua) |
| **Precondition** | Seluruh transaksi periode telah dijurnal; tidak ada jurnal draft |
| **Postcondition** | Periode ditutup, SHU dihitung, jurnal penutup tercatat |
| **Trigger** | Admin mengklik "Tutup Buku" untuk periode tertentu |

**Alur Utama:**
1. Admin membuka modul Tutup Buku
2. Sistem menampilkan daftar periode akuntansi beserta status (open/closed)
3. Admin memilih periode yang akan ditutup
4. Sistem melakukan pre-check:
   a. Semua jurnal periode berstatus `posted` (tidak ada draft)
   b. Neraca Saldo seimbang (total debit = total kredit)
   c. Tidak ada transaksi yang tertunda
5. Sistem menjalankan closing process:
   a. Hitung total pendapatan dari seluruh akun pendapatan
   b. Hitung total beban dari seluruh akun beban
   c. Hitung SHU = Total Pendapatan - Total Beban
   d. Hitung alokasi SHU: Cadangan (min 10%), Dana Pendidikan (max 5%), Jasa Modal, Jasa Usaha
   e. Generate jurnal penutup: tutup akun pendapatan dan beban ke Ikhtisar Laba Rugi
   f. Generate jurnal alokasi SHU
6. Sistem UPDATE `accounting_periods` → `is_closed = true`, `closed_at`, `closed_by`
7. Sistem mengembalikan ringkasan SHU

**Alur Alternatif:**
- **4a.** Masih ada jurnal draft → Sistem menolak: "Masih ada X jurnal yang belum diposting"
- **4b.** Neraca tidak seimbang → Sistem menolak dan menampilkan selisih

**Aturan Bisnis:**
- Periode hanya bisa ditutup secara kronologis (bulan berikutnya)
- Periode yang sudah ditutup tidak bisa dibuka kembali
- Proses tutup buku harus dilakukan paling lambat 6 bulan setelah akhir tahun buku (UU 17/2012)
- Hasil tutup buku menjadi dasar perhitungan dan pembagian SHU pada RAT

---

### UC-09: AI Credit Scoring (Google Gemini)

| Field | Detail |
|-------|--------|
| **ID** | UC-09 |
| **Nama** | Analisis Kredit Berbasis AI (Credit Scoring 5C) |
| **Actor** | Admin (saat proses verifikasi pengajuan pinjaman) |
| **Precondition** | Pengajuan pinjaman dengan status `pengajuan`; data anggota lengkap |
| **Postcondition** | Hasil skoring tersimpan; rekomendasi approve/review/reject dihasilkan |
| **Trigger** | Admin mengklik "Jalankan AI Credit Scoring" pada halaman pengajuan |

**Input JSON (request ke Gemini):**

```json
{
  "pengajuan_id": "PJN-202607-0012",
  "anggota": {
    "nama": "Budi Santoso",
    "nik": "3201234567890123",
    "pekerjaan": "Wiraswasta",
    "penghasilan_bulanan": 15000000,
    "status_keanggotaan": "aktif",
    "lama_keanggotaan_bulan": 24,
    "saldo_simpanan_wajib": 600000,
    "riwayat_pinjaman": {
      "total_pinjaman": 2,
      "total_lunas": 1,
      "total_tunggakan_hari": 0
    }
  },
  "pengajuan": {
    "jenis_pinjaman": "Mikro Produktif",
    "pokok": 50000000,
    "tenor_bulan": 12,
    "bunga_persen": 1.5,
    "metode_bunga": "flat",
    "tujuan": "Modal usaha tambak udang"
  },
  "rasio_keuangan": {
    "modal_sendiri": 500000000,
    "total_aset": 2000000000,
    "total_kewajiban": 800000000,
    "total_piutang": 400000000,
    "piutang_macet": 20000000,
    "total_pendapatan_bunga": 120000000,
    "total_beban_operasional": 80000000,
    "kas_dan_bank": 300000000
  }
}
```

**Output JSON (response dari Gemini):**

```json
{
  "skor_keseluruhan": 78.5,
  "status_kelayakan": "LAYAK",
  "analisis_5c": {
    "character": {
      "skor": 85,
      "keterangan": "Riwayat pinjaman bersih, tidak ada tunggakan, anggota aktif 24 bulan"
    },
    "capacity": {
      "skor": 75,
      "keterangan": "Penghasilan Rp 15 juta/bulan, rasio angsuran/penghasilan 12% (aman)"
    },
    "capital": {
      "skor": 70,
      "keterangan": "Modal sendiri cukup, BMPK per debitur masih dalam batas aman"
    },
    "collateral": {
      "skor": 80,
      "keterangan": "Simpanan wajib Rp 600.000 sebagai jaminan tambahan"
    },
    "condition": {
      "skor": 82,
      "keterangan": "Usaha tambak udang prospek baik, sektor perikanan stabil"
    }
  },
  "rasio_analisis": {
    "likuiditas": 1.25,
    "solvabilitas": 0.40,
    "profitabilitas": 6.0,
    "bopo": 40.0,
    "bmpk_persen": 2.5,
    "bmpk_status": "Aman (≤20%)"
  },
  "rekomendasi": {
    "keputusan": "SETUJUI",
    "plafon_rekomendasi": 50000000,
    "tenor_rekomendasi": 12,
    "bunga_rekomendasi": 1.5,
    "syarat_khusus": [
      "Lampirkan surat keterangan usaha dari kelurahan",
      "Agunan BPKB kendaraan bermotor"
    ]
  }
}
```

**Threshold Keputusan:**

| Skor | Status | Keputusan | Keterangan |
|------|--------|-----------|------------|
| ≥ 60 | **LAYAK** | Setujui | Memenuhi kriteria kelayakan kredit |
| 40 – 59 | **REVIEW** | Perlu Tinjauan Ulang | Perlu verifikasi manual oleh pengawas |
| < 40 | **TIDAK LAYAK** | Tolak | Tidak memenuhi prinsip kehati-hatian |

**Alur Utama:**
1. Admin mengklik "Jalankan AI Credit Scoring"
2. Sistem mengumpulkan data anggota, pengajuan, dan rasio keuangan
3. Sistem membuat request ke Gemini API dengan structured output schema
4. Gemini menganalisis berdasarkan prompt system (auditor koperasi senior)
5. Sistem menerima response JSON
6. Sistem menyimpan hasil di `hasil_skoring` dan memperbarui `pengajuan_pembiayaan`
7. Sistem menampilkan hasil analisis ke admin

**Alur Alternatif:**
- **3a.** Gemini API timeout (>30 detik) → Sistem mengembalikan error "AI tidak tersedia, gunakan verifikasi manual"
- **3b.** Gemini API quota habis → Sistem fallback ke skoring manual berbasis aturan

**Aturan Bisnis:**
- AI scoring bersifat **rekomendasi** — keputusan akhir tetap pada admin/pengawas
- Semua hasil skoring tersimpan permanen untuk audit trail
- Skor AI tidak menggantikan verifikasi dokumen fisik

---

### UC-10: Laporan OJK

| Field | Detail |
|-------|--------|
| **ID** | UC-10 |
| **Nama** | Pelaporan Regulasi ke OJK |
| **Actor** | Admin (Ketua/Bendahara) |
| **Precondition** | Data transaksi dan akuntansi lengkap untuk periode pelaporan |
| **Postcondition** | Laporan tergenerate dalam format OJK (XML/JSON) dan tersedia untuk ekspor |
| **Trigger** | Jadwal pelaporan bulanan OJK atau permintaan manual |

**Jenis Laporan:**

| Laporan | Standar | Isi | Frekuensi |
|---------|---------|-----|-----------|
| **LKP** (Laporan Keuangan Periodik) | SEOJK 14 | Neraca, Laba Rugi, Perubahan Ekuitas, Arus Kas | Bulanan |
| **BMPK** | SEOJK 14 | Daftar pemberian kredit per debitur, persentase terhadap modal | Bulanan |
| **Kolektibilitas** | SEOJK 14 | Status kolektibilitas per pinjaman (Lancar s.d. Macet), CKPN | Bulanan |
| **KPMM** | POJK 12/2018 | Modal sendiri, CKPM, rasio KPMM | Bulanan |
| **SHU** | UU 17/2012 | Penggunaan SHU: Cadangan, Pendidikan, Jasa Modal, Jasa Usaha | Tahunan |

**Alur Utama:**
1. Admin membuka modul Laporan → OJK
2. Sistem menampilkan daftar laporan yang tersedia dan status periode
3. Admin memilih jenis laporan dan periode
4. Sistem mengumpulkan data dari tabel-tabel terkait:
   - **LKP**: Query COA hierarchical → Neraca, Laba Rugi, Arus Kas
   - **BMPK**: Query `pinjaman` → total pemberian per anggota vs Modal Sendiri
   - **Kolektibilitas**: Query `subledger_piutang` → status kolektibilitas + CKPN
   - **KPMM**: Hitung Modal Sendiri, CKPM, rasio KPMM
5. Sistem memformat output sesuai skema OJK
6. Admin mengunduh laporan dalam format XML/JSON/Excel
7. Admin mengirim laporan ke OJK via SFTP/API (manual atau terintegrasi)

**Alur Alternatif:**
- **4a.** Data tidak lengkap → Sistem menampilkan daftar data yang masih kurang
- **6a.** Validasi skema gagal → Sistem menampilkan error spesifik

**Aturan Bisnis:**
- LKP harus disampaikan paling lambat tanggal 20 bulan berikutnya
- BMPK harus menunjukkan tidak ada debitur yang melebihi 20% Modal Sendiri
- Kolektibilitas harus dihitung berdasarkan hari tunggakan aktual
- Seluruh laporan harus tersimpan sebagai arsip digital

---

## 6. Aturan Bisnis Detail

### 6.1 Metode Perhitungan Bunga Pinjaman

#### 6.1.1 Metode Flat

Bunga dihitung dari pokok awal dan tetap (flat) setiap periode.

```
Bunga per Bulan = (Pokok Pinjaman × Suku Bunga per Tahun × 12) / Tenor (bulan)
Angsuran per Bulan = (Pokok Pinjaman / Tenor) + Bunga per Bulan
```

**Contoh:**
- Pokok: Rp 50.000.000
- Suku Bunga: 12% per tahun (1% per bulan)
- Tenor: 12 bulan

```
Bunga per Bulan = (50.000.000 × 0.12 × 12) / 12 = Rp 500.000
Pokok per Bulan = 50.000.000 / 12 = Rp 4.166.667
Angsuran per Bulan = 4.166.667 + 500.000 = Rp 4.666.667
Total Pembayaran = 4.666.667 × 12 = Rp 56.000.000
```

#### 6.1.2 Metode Efektif (Sliding Balance)

Bunga dihitung dari sisa pokok yang masih berjalan (menurun).

```
Bunga Bulan ke-n = Sisa Pokok × Suku Bunga per Bulan
Pokok Bulan ke-n = Angsuran Tetap - Bunga Bulan ke-n
Sisa Pokok (baru) = Sisa Pokok (lama) - Pokok Bulan ke-n
```

**Implementasi (dari [finance.ts](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/server/lib/finance.ts#L19-L52)):**

```typescript
// Metode flat: pokok konstan, bunga dari pokok awal
if (isFlat) {
  bungaBayar = Math.round(pokok * i);
  pokokBayar = Math.round(pokok / tenorMonths);
}
// Metode efektif/anuitas: bunga dari sisa saldo
else {
  bungaBayar = Math.round(sisa * i);
  pokokBayar = Math.round(angsuran - bungaBayar);
}
```

#### 6.1.3 Metode Anuitas

Angsuran total tetap setiap periode.

```
Angsuran Tetap = Pokok × [r × (1 + r)^n] / [(1 + r)^n - 1]

Keterangan:
  r = suku bunga per bulan (desimal)
  n = tenor dalam bulan
```

**Contoh:**
- Pokok: Rp 50.000.000, Bunga: 1% per bulan, Tenor: 12 bulan

```
r = 0.01, n = 12
(1.01)^12 = 1.126825
Angsuran = 50.000.000 × [0.01 × 1.126825] / [1.126825 - 1]
         = 50.000.000 × 0.011268 / 0.126825
         = Rp 4.434.972 per bulan
```

### 6.2 Bunga Simpanan

| Jenis Simpanan | Suku Bunga | Metode Hitung | Keterangan |
|----------------|-----------|---------------|------------|
| **Simpanan Pokok** | 0% | Tidak ada bunga | Modal keanggotaan, tidak dikenakan bunga |
| **Simpanan Wajib** | 2% per tahun | Bulanan | Dihitung dari saldo rata-rata bulanan, dibagikan per bulan |
| **Simpanan Sukarela** | 4% per tahun | Daily Balance | Dihitung dari saldo harian (daily balance), akumulasi bulanan |
| **Deposito** | 6% per tahun | Fixed Rate | Bunga tetap sesuai tenor, dibayarkan saat jatuh tempo atau per bulan |

**Rumus Daily Balance (Simpanan Sukarela):**

```
Bunga Bulanan = Σ (Saldo Harian × Rate per Hari × 1 Hari) / 1
             = Rate per Hari × Σ Saldo Harian

Keterangan:
  Rate per Hari = 4% / 365 = 0.010959% per hari
  Σ Saldo Harian = total saldo semua hari dalam bulan tersebut
```

### 6.3 Denda Tunggakan Angsuran

| Parameter | Nilai | Keterangan |
|-----------|-------|------------|
| **Basis Perhitungan** | Pokok tunggakan (bukan total tagihan) | Sesuai SEOJK |
| **Rumus** | Pokok Tunggakan × Rate per Hari × Jumlah Hari Terlambat | Flat (tidak compound) |
| **Cap Maksimum** | 2% dari pokok tunggakan | Maksimum berdasarkan SEOJK |
| **Grace Period** | 5 hari setelah jatuh tempo | Tidak dikenakan denda |
| **Metode** | Flat (bukan compound) | Bunga denda tidak menumpuk |

```
Denda = Pokok Tunggakan × (Rate per Tahun / 365) × Hari Terlambat
Denda = MIN(Denda, Pokok Tunggakan × 2%)

Keterangan:
  Hari Terlambat = MAX(0, Tanggal Bayar - Tanggal Jatuh Tempo - Grace Period)
  Grace Period = 5 hari
```

**Contoh:**
- Pokok Tunggakan: Rp 5.000.000
- Rate: 18% per tahun (0.0493% per hari)
- Hari Terlambat: 15 hari (dikurangi grace period 5 hari = 10 hari efektif)

```
Denda = 5.000.000 × 0.000493 × 10 = Rp 246.500
Cap Denda = 5.000.000 × 2% = Rp 100.000
Denda Dikenakan = Rp 100.000 (dikarenakan cap)
```

### 6.4 Kolektibilitas Pinjaman

| Klasifikasi | Hari Tunggakan | Persentase CKPN | Keterangan |
|-------------|---------------|-----------------|------------|
| **Lancar** | 0 – 30 hari | 0.4% | Pembayaran lancar atau terlambat ≤ 30 hari |
| **DPK (Diragukan Perlu Klaim)** | 31 – 90 hari | 10% | Terlambat 31-90 hari |
| **Kurang Lancar** | 91 – 120 hari | 50% | Terlambat 91-120 hari |
| **Diragukan** | 121 – 180 hari | 80% | Terlambat 121-180 hari |
| **Macet** | > 180 hari | 100% | Terlambat lebih dari 180 hari |

**Update Otomatis:**
- Scheduler berjalan setiap pukul 00:05 WIB
- Menghitung hari tunggakan dari `angsuran.tanggal_jatuh_tempo` vs tanggal hari ini
- Memperbarui `subledger_piutang.kolektibilitas` dan `hari_tunggakan`
- Menghitung CKPN otomatis: `CKPN = Pokok Piutang × Persentase CKPN`

### 6.5 Batas Maksimum Pemberian Kredit (BMPK)

```
BMPK per Debitur ≤ 20% × Modal Sendiri Koperasi
BMPK per Debitur ≤ 25% × Modal Sendiri (dengan persetujuan RAT)
```

**Keterangan:**
- **Modal Sendiri** = Modal Pokok + Dana Cadangan + SHU Belum Dibagi
- Perhitungan dilakukan secara real-time setiap pengajuan pinjaman
- Hard-stop di API: sistem menolak otomatis jika melebihi batas
- Pengecekan melibatkan seluruh pinjaman aktif (outstanding) per anggota

### 6.6 Sisa Hasil Usaha (SHU)

**Urutan Penggunaan SHU (sesuai Pasal 56 UU 17/2012):**

| No | Alokasi | Minimum | Maksimum | Keterangan |
|----|---------|---------|----------|------------|
| 1 | **Dana Cadangan** | 10% dari SHU | — | Wajib, tidak bisa dibagikan |
| 2 | **Dana Pendidikan** | — | 5% dari SHU | Untuk pendidikan anggota dan masyarakat |
| 3 | **Jasa Modal** | — | — | Dibagikan berdasarkan simpanan (modal anggota) |
| 4 | **Jasa Usaha** | — | — | Dibagikan berdasarkan volume transaksi anggota |
| 5 | **SHU Anggota** | Sisa | — | Dibagikan merata atau berdasarkan kebijakan RAT |

**Rumus Perhitungan:**

```
SHU Bersih = Total Pendapatan - Total Beban - Pajak
Dana Cadangan = SHU Bersih × 10%
Dana Pendidikan = SHU Bersih × 5% (maksimal)
Sisa untuk Jasa Modal + Jasa Usaha + SHU Anggota = SHU Bersih - Cadangan - Pendidikan
```

---

## 7. Spesifikasi API

### 7.1 Informasi Umum

| Parameter | Nilai |
|-----------|-------|
| **Base URL** | `https://metrocoop-app-production.up.railway.app/api` |
| **Development URL** | `http://localhost:3000/api` |
| **Content-Type** | `application/json` |
| **Autentikasi** | JWT Bearer Token (header: `Authorization: Bearer <token>`) |
| **Rate Limit (Global)** | 100 request per 15 menit per IP |
| **Rate Limit (Login)** | 10 request per 15 menit per IP |
| **Rate Limit (Register)** | 5 request per jam per IP |

### 7.2 Format Request & Response

**Request Format:**

```
POST /api/data/anggota
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "nik": "3201234567890123",
  "nama": "Budi Santoso",
  "noHp": "081234567890"
}
```

**Response Format — Sukses:**

```json
{
  "id": "m8xk2nf5a",
  "nik": "3201234567890123",
  "nama": "Budi Santoso",
  "statusKeanggotaan": "aktif",
  "saldoSimpananPokok": 0,
  "saldoSimpananWajib": 0,
  "saldoSimpananSukarela": 0
}
```

**Response Format — Error:**

```json
{
  "error": "NIK sudah terdaftar"
}
```

### 7.3 Daftar Endpoint

#### Autentikasi (Public)

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `POST` | `/api/auth/login` | ❌ | Public | Login pengguna, mengembalikan JWT token |
| `POST` | `/api/auth/register-perusahaan` | ❌ | Public | Registrasi anggota perusahaan baru |
| `POST` | `/api/auth/hash-password` | ❌ | Public | Generate hash password (utility) |

#### Data — Keanggotaan

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/anggota` | ✅ | All | Ambil daftar anggota (scoped by role) |
| `POST` | `/api/data/anggota` | ✅ | Admin/Operator | Tambah anggota baru |
| `GET` | `/api/data/pengurus` | ✅ | All | Daftar pengurus |
| `POST` | `/api/data/pengurus` | ✅ | Admin | Tambah pengurus |
| `GET` | `/api/data/karyawan` | ✅ | Staff | Daftar karyawan |
| `GET` | `/api/data/perusahaan` | ✅ | All | Daftar perusahaan |

#### Data — Simpanan

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/jenis-simpanan` | ✅ | All | Daftar jenis simpanan |
| `POST` | `/api/data/simpanan-transaksi` | ✅ | Admin/Operator | Proses setor/tarik simpanan |
| `GET` | `/api/data/permohonan-tarik` | ✅ | Staff | Daftar permohonan penarikan |
| `POST` | `/api/data/bukti-transfer` | ✅ | Admin | Upload bukti transfer |

#### Data — Pinjaman

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/jenis-pinjaman` | ✅ | All | Daftar produk pinjaman |
| `POST` | `/api/data/pinjaman` | ✅ | Admin/Operator | Ajukan pinjaman baru |
| `GET` | `/api/data/angsuran` | ✅ | All | Daftar jadwal angsuran |
| `POST` | `/api/data/angsuran/bayar` | ✅ | Admin/Operator | Proses pembayaran angsuran |

#### Data — POS / Toko

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/barang` | ✅ | Staff | Daftar barang |
| `POST` | `/api/data/penjualan` | ✅ | Operator | Proses penjualan POS |
| `POST` | `/api/data/pembelian` | ✅ | Admin | Proses pembelian dari supplier |

#### Data — Akuntansi

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/jurnal` | ✅ | Staff | Daftar jurnal akuntansi |
| `POST` | `/api/data/jurnal` | ✅ | Admin | Buat jurnal manual |
| `GET` | `/api/data/coa` | ✅ | Staff | Daftar Chart of Accounts |
| `GET` | `/api/data/neraca-saldo` | ✅ | Staff | Neraca saldo per periode |
| `GET` | `/api/data/buku-besar` | ✅ | Staff | Buku besar per akun |

#### Data — Unit Usaha Lainnya

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `GET` | `/api/data/ppob-layanan` | ✅ | All | Daftar layanan PPOB |
| `POST` | `/api/data/ppob-transaksi` | ✅ | Operator | Proses transaksi PPOB |
| `GET` | `/api/data/sewa-assets` | ✅ | All | Daftar aset sewa |
| `POST` | `/api/data/sewa-transaksi` | ✅ | Admin | Proses transaksi sewa |
| `GET` | `/api/data/venture-investments` | ✅ | Staff | Daftar investasi ventura |

#### AI & Public

| Method | Path | Auth | Role | Deskripsi |
|--------|------|------|------|-----------|
| `POST` | `/api/gemini/audit` | ✅ | Admin | Audit risiko investasi via Gemini AI |
| `GET` | `/api/public/landing` | ❌ | Public | Data landing page (CMS) |
| `GET` | `/api/health` | ❌ | Public | Health check (Railway) |

### 7.4 Contoh Request/Response Lengkap

**Login:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_admin01",
    "username": "admin",
    "namaLengkap": "Administrator Utama",
    "role": "admin",
    "nik": "admin",
    "memberId": null,
    "isActive": true
  }
}
```

**Proses Setor Simpanan:**

```http
POST /api/data/simpanan-transaksi
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "anggotaId": "m8xk2nf5a",
  "jenisSimpananId": "js_wajib",
  "tipe": "setor",
  "jumlah": 100000,
  "keterangan": "Setoran bulanan Juli 2026"
}
```

```json
{
  "id": "st_abc123",
  "anggotaId": "m8xk2nf5a",
  "anggotaNama": "Budi Santoso",
  "jenisNama": "Simpanan Wajib",
  "tipe": "setor",
  "jumlah": 100000,
  "keterangan": "Setoran bulanan Juli 2026"
}
```

---

## 8. Integrasi Eksternal

### 8.1 Google Gemini AI

| Parameter | Spesifikasi |
|-----------|-------------|
| **Model** | `gemini-2.0-flash` |
| **Endpoint** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |
| **Autentikasi** | API Key (via `GEMINI_API_KEY` environment variable) |
| **Rate Limit** | 15 RPM (Requests Per Minute) per API key |
| **Timeout** | 30 detik per request |
| **Output Format** | JSON (structured output via `responseSchema`) |
| **Fallback** | Jika timeout/错误 → error message, admin menggunakan verifikasi manual |

**Penggunaan:**
1. **AI Credit Scoring** — Analisis 5C untuk pengajuan pinjaman (UC-09)
2. **AI Audit Investasi** — Audit risiko investasi ventura

**Contoh Integrasi (dari [server.ts](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/server.ts#L108-L175)):**

```typescript
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: prompt,
  config: {
    systemInstruction: "Anda adalah auditor koperasi senior...",
    responseMimeType: "application/json",
    responseSchema: { /* structured schema */ }
  }
});
```

### 8.2 Payment Gateway

| Provider | Fungsi | Endpoint | Status |
|----------|--------|----------|--------|
| **Midtrans** | Virtual Account, QRIS, E-Wallet | `https://api.midtrans.com/v2/charge` | Direncanakan |
| **Xendit** | VA, Invoice, E-Wallet | `https://api.xendit.co/v2/invoices` | Direncanakan |
| **Digiflazz** | PPOB (pulsa, listrik, PDAM) | `https://api.digiflazz.com/v1/transaction` | Direncanakan |

**Alur Integrasi Payment Gateway:**

```
Anggota/Operator → Sistem MetroCoop → Payment Gateway API → Bank/E-Wallet
                                                    ↓
Sistem MetroCoop ← Webhook/Callback ← Payment Gateway
                                                    ↓
                         Update Status Transaksi + Jurnal Otomatis
```

### 8.3 WhatsApp Business API

| Parameter | Spesifikasi |
|-----------|-------------|
| **Provider** | Meta Cloud API / BSSP (Business Solution Service Provider) |
| **Endpoint** | `https://graph.facebook.com/v18.0/<PHONE_ID>/messages` |
| **Autentikasi** | Bearer Token (via environment variable) |
| **Template Messages** | Notifikasi angsuran, pengumuman, promo |

**Template Notifikasi:**

| Template | Kegunaan | Isi |
|----------|----------|-----|
| `angsuran_reminder` | Pengingat jatuh tempo | "Yth. {nama}, angsuran ke-{ke} sebesar Rp {total} jatuh tempo pada {tanggal}. Mohon lakukan pembayaran." |
| `setoran_berhasil` | Konfirmasi setoran | "Setoran Rp {jumlah} ke {jenis} berhasil. Saldo terkini: Rp {saldo}." |
| `pinjaman_disetujui` | Notifikasi pencairan | "Pinjaman Anda sebesar Rp {pokok} telah disetujui dan dicairkan." |
| `pengumuman_umum` | Broadcast pengumuman | "{judul}: {isi_pesan}" |

### 8.4 Email SMTP

| Parameter | Spesifikasi |
|-----------|-------------|
| **Protocol** | SMTP (TLS) |
| **Provider** | Resend / SendGrid / Mailgun (konfigurable) |
| **Port** | 587 (STARTTLS) atau 465 (TLS) |
| **From** | `noreply@metrocoop.id` |
| **Kegunaan** | Laporan bulanan, bukti transaksi, reset password |

---

## 9. Keamanan Sistem

### 9.1 Autentikasi

| Parameter | Spesifikasi |
|-----------|-------------|
| **Metode** | JWT (JSON Web Token) |
| **Algoritma** | HS256 |
| **Masa Berlaku Token** | 24 jam |
| **Password Hashing** | bcrypt, cost factor 10 |
| **Password Minimum** | 6 karakter |

**Alur Autentikasi:**

```
1. User mengirim username + password → POST /api/auth/login
2. Sistem mengecek ke tabel users
3. Sistem memverifikasi password dengan bcrypt.compare()
4. Jika valid → generate JWT dengan payload {id, username, role, memberId}
5. JWT dikembalikan ke client
6. Client menyimpan JWT dan mengirimkan di setiap request via Authorization header
7. Middleware memverifikasi JWT → decode payload → set req.user
```

### 9.2 Role-Based Access Control (RBAC)

| Resource | superadmin | admin | operator | anggota | anggota_perusahaan |
|----------|:----------:|:-----:|:--------:|:-------:|:------------------:|
| **Dashboard Admin** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Kelola Anggota** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Simpanan (CRUD)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Pinjaman (CRUD)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Angsuran (Bayar)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **POS / Toko** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Jurnal Akuntansi** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **COA Management** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Laporan Keuangan** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Laporan OJK** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Pengaturan Sistem** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Feature Toggle** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Portal Anggota** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Lihat Data Sendiri** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Lihat Semua Data** | ✅ | ✅ | ✅ | ❌ | ❌ |

**Implementasi (dari [middleware.ts](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/server/middleware.ts#L39-L43) dan [data.ts](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/server/routes/data.ts#L22-L41)):**

```typescript
// Data scoping: staff lihat semua, anggota hanya lihat data sendiri
const STAFF_ROLES = ['admin', 'superadmin', 'operator'];

function scopeMemberId(req: AuthRequest): string | null {
  if (isStaff(req)) return null; // lihat semua
  return req.user?.memberId ?? req.user?.id;
}
```

### 9.3 Security Headers (Helmet)

| Header | Nilai | Fungsi |
|--------|-------|--------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'` | Mencegah XSS |
| `X-Frame-Options` | `DENY` | Mencegah Clickjacking |
| `X-Content-Type-Options` | `nosniff` | Mencegah MIME sniffing |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Paksa HTTPS (HSTS) |
| `X-XSS-Protection` | `1; mode=block` | Filter XSS (legacy browser) |
| `Referrer-Policy` | `no-referrer` | Kontrol informasi referrer |
| `Permissions-Policies` | `camera=(), microphone=()` | Disable fitur browser sensitif |

### 9.4 Perlindungan Data

| Aspek | Implementasi | Standar |
|-------|-------------|---------|
| **Data at Rest** | AES-256 encryption pada PostgreSQL (pgcrypto) | ISO 27001 |
| **Data in Transit** | TLS 1.3 (enforced oleh Railway) | UU PDP Ps.14 |
| **Password** | bcrypt hash, cost factor 10, tidak reversible | OWASP |
| **JWT Secret** | Min. 32 bytes random, disimpan di environment variable | — |
| **Audit Trail** | Semua transaksi keuangan & perubahan master data tercatat | SAK ETAP, UU PDP Ps.15 |
| **Data Masking** | NIK, No HP, No Rekening ditampilkan parsial di UI | UU PDP |
| **Input Validation** | Zod schema validation di setiap endpoint | OWASP |

### 9.5 Rate Limiting

| Endpoint | Batas | Window | Pesan Error |
|----------|-------|--------|-------------|
| Global (semua API) | 100 request | 15 menit | "Terlalu banyak request. Silakan coba lagi." |
| `POST /api/auth/login` | 10 request | 15 menit | "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit." |
| `POST /api/auth/register-perusahaan` | 5 request | 1 jam | "Terlalu banyak percobaan registrasi. Silakan coba lagi dalam 1 jam." |

---

## 10. Performa & Skalabilitas

### 10.1 Target Performa

| Metrik | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (p95)** | < 500 ms | Percentile ke-95 dari semua API response |
| **First Contentful Paint (FCP)** | < 1.5 detik | Lighthouse / Core Web Vitals |
| **Largest Contentful Paint (LCP)** | < 2.5 detik | Lighthouse / Core Web Vitals |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse / Core Web Vitals |
| **Interaction to Next Paint (INP)** | < 200 ms | Lighthouse / Core Web Vitals |
| **Uptime** | > 99.9% | Monthly SLA monitoring |
| **Concurrent Users** | 500+ | Tanpa degradasi performa signifikan |
| **Database Query** | < 100 ms (p95) | Rata-rata waktu eksekusi query |

### 10.2 Teknik Optimasi

#### Frontend

| Teknik | Implementasi | Dampak |
|--------|-------------|--------|
| **Code Splitting** | React lazy + Suspense per route | Mengurangi initial bundle size |
| **Asset Optimization** | Vite build dengan tree-shaking, minification | Mengurangi ukuran JS/CSS |
| **Image Optimization** | Lazy loading, WebP format | Mengurangi bandwidth |
| **Caching** | Service Worker (PWA), HTTP cache headers | Mengurangi request berulang |
| **Bundle Analysis** | `rollup-plugin-visualalyzer` | Identifikasi dependency besar |

#### Backend

| Teknik | Implementasi | Dampak |
|--------|-------------|--------|
| **Connection Pooling** | `pg.Pool` dengan max connections | Mengurangi overhead koneksi DB |
| **Database Indexing** | Index pada kolom yang sering di-query | Mempercepat query SELECT |
| **Pagination** | Limit + Offset pada setiap list endpoint | Mengurangi payload data |
| **Materialized Views** | Neraca Saldo, Buku Besar, Laporan bulanan | Query laporan lebih cepat |
| **JSONB** | Jurnal details, items penjualan | Query fleksibel tanpa JOIN |
| **Keep-Alive** | HTTP keep-alive pada connection pool | Mengurangi latency |

### 10.3 Database Index Kritis

```sql
-- Keanggotaan
CREATE INDEX idx_anggota_nik ON anggota(nik);
CREATE INDEX idx_anggota_status ON anggota(status_keanggotaan);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_member_id ON users(member_id);
CREATE INDEX idx_users_role ON users(role);

-- Simpanan
CREATE INDEX idx_simpanan_transaksi_anggota ON simpanan_transaksi(anggota_id);
CREATE INDEX idx_simpanan_transaksi_tanggal ON simpanan_transaksi(tanggal);
CREATE INDEX idx_simpanan_transaksi_jenis ON simpanan_transaksi(jenis_simpanan_id);

-- Pinjaman & Angsuran
CREATE INDEX idx_pinjaman_anggota ON pinjaman(anggota_id);
CREATE INDEX idx_pinjaman_status ON pinjaman(status);
CREATE INDEX idx_angsuran_pinjaman ON angsuran(pinjaman_id);
CREATE INDEX idx_angsuran_status ON angsuran(status);
CREATE INDEX idx_angsuran_jatuh_tempo ON angsuran(tanggal_jatuh_tempo);

-- Jurnal Akuntansi
CREATE INDEX idx_journal_entries_tanggal ON journal_entries(tanggal);
CREATE INDEX idx_journal_entries_sumber ON journal_entries(sumber);
CREATE INDEX idx_journal_entries_no_jurnal ON journal_entries(no_jurnal);
CREATE INDEX idx_journal_entries_details_gin ON journal_entries USING GIN (details);

-- COA
CREATE INDEX idx_coa_kode ON chart_of_accounts(kode_akun);
CREATE INDEX idx_coa_kategori ON chart_of_accounts(kategori);
CREATE INDEX idx_coa_parent ON chart_of_accounts(parent_id);

-- POS / Toko
CREATE INDEX idx_barang_kategori ON barang(kategori_id);
CREATE INDEX idx_barang_supplier ON barang(supplier_id);
CREATE INDEX idx_penjualan_tanggal ON penjualan(tanggal);

-- Subledger Piutang
CREATE INDEX idx_subledger_piutang_anggota ON subledger_piutang(anggota_id);
CREATE INDEX idx_subledger_piutang_kolektibilitas ON subledger_piutang(kolektibilitas);

-- Periode Akuntansi
CREATE INDEX idx_accounting_periods_tahun_bulan ON accounting_periods(tahun, bulan);
```

---

## 11. Kriteria Penerimaan

### 11.1 Kriteria Penerimaan Fungsional

| ID | Kriteria | Verifikasi |
|----|----------|-----------|
| **FA-01** | Registrasi anggota baru berhasil dengan validasi NIK unik 16 digit | UAT: Daftar 5 anggota dengan NIK berbeda |
| **FA-02** | Transaksi simpanan (setor & tarik) menghasilkan jurnal balanced | UAT: Setor Rp 100.000, cek jurnal Debit = Kredit |
| **FA-03** | Pinjaman dengan 3 metode bunga (flat, efektif, anuitas) menghitung angsuran dengan benar | UAT: Input Rp 50 juta, 12 bulan, 12%/tahun, verifikasi jadwal |
| **FA-04** | Pembayaran angsuran mengurangi sisa pokok dan menghasilkan jurnal otomatis | UAT: Bayar angsuran ke-1, cek sisa pokok & jurnal |
| **FA-05** | Transaksi POS mengurangi stok dan menghitung HPP | UAT: Jual 3 barang, cek stok berkurang & jurnal HPP |
| **FA-06** | Jurnal akuntansi otomatis dari setiap modul transaksi seimbang | UAT: Eksekusi 10 transaksi berbeda, validasi neraca saldo = 0 |
| **FA-07** | Tutup buku periode menghasilkan SHU yang benar sesuai formula | UAT: Tutup buku bulan, verifikasi alokasi SHU |
| **FA-08** | AI Credit Scoring menghasilkan skor 0-100 dengan rekomendasi | UAT: Jalankan scoring pada 10 sample pengajuan |
| **FA-09** | Laporan OJK (LKP, BMPK, Kolektibilitas) bisa diekspor dalam format yang valid | UAT: Generate laporan, validasi format |
| **FA-10** | Portal anggota hanya menampilkan data milik anggota yang bersangkutan | UAT: Login 2 anggota berbeda, cek data isolation |

### 11.2 Kriteria Penerimaan Non-Fungsional

| ID | Kriteria | Target | Verifikasi |
|----|----------|--------|-----------|
| **NFA-01** | API response time p95 < 500 ms | < 500 ms | Load test dengan k6 / Artillery (500 concurrent) |
| **NFA-02** | Lighthouse Performance Score ≥ 90 | ≥ 90 | Lighthouse audit di Chrome DevTools |
| **NFA-03** | Uptime 99.9% selama 30 hari pasca go-live | 99.9% | Railway monitoring dashboard |
| **NFA-04** | Zero Critical/High vulnerability dari penetration test | 0 | Penetration test oleh pihak ketiga |
| **NFA-05** | Backup dan restore berhasil dalam RTO < 4 jam | < 4 jam | Disaster recovery test quarterly |

### 11.3 Kriteria Penerimaan Kepatuhan

| ID | Kriteria | Referensi | Verifikasi |
|----|----------|-----------|-----------|
| **CA-01** | Jurnal double entry seimbang untuk 100% transaksi | SAK ETAP | Audit neraca saldo selalu = 0 |
| **CA-02** | BMPK per debitur tidak melebihi 20% Modal Sendiri | POJK 12/2018 Ps.14 | Hard-stop di API, test dengan data |
| **CA-03** | Kolektibilitas dihitung otomatis sesuai ketentuan SEOJK | SEOJK 14 | Verifikasi scheduler update harian |
| **CA-04** | Audit trail lengkap untuk 100% transaksi keuangan | UU PDP Ps.15 | Query log untuk setiap transaksi |

---

## 12. Lampiran

### 12.1 Environment Variables

| Variable | Required | Default | Deskripsi |
|----------|----------|---------|-----------|
| `PORT` | ✅ | `3000` | Port server Express |
| `NODE_ENV` | ✅ | `development` | Mode: `development` / `production` |
| `JWT_SECRET` | ✅ | — | Secret key untuk signing JWT (min 32 bytes) |
| `DB_HOST` | ✅ | `localhost` | Host PostgreSQL |
| `DB_PORT` | ✅ | `5432` | Port PostgreSQL |
| `DB_NAME` | ✅ | `metromitra` | Nama database |
| `DB_USER` | ✅ | `postgres` | Username database |
| `DB_PASS` | ✅ | `postgres` | Password database |
| `DATABASE_URL` | ❌ | — | Connection string alternatif (overrides DB_*) |
| `GEMINI_API_KEY` | ❌ | `""` | API Key Google Gemini untuk AI features |
| `CORS_ORIGIN` | ❌ | `""` | Domain yang diizinkan CORS (comma-separated) |
| `APP_URL` | ❌ | `http://localhost:3000` | Base URL aplikasi |
| `E2E_LOGIN_UNLIMITED` | ❌ | — | Set `1` untuk bypass rate limit di CI/E2E |

### 12.2 COA Standar KSP

| Kode Akun | Nama Akun | Kategori | Saldo Normal | Sub Kategori |
|-----------|-----------|----------|-------------|-------------|
| **1101** | Kas | ASET | Debit | Kas dan Bank |
| **1102** | Bank | ASET | Debit | Kas dan Bank |
| **1111** | Piutang Pokok Pinjaman | ASET | Debit | Piutang |
| **1201** | Persediaan Barang | ASET | Debit | Persediaan |
| **1301** | Akumulasi Penyusutan | ASET | Kredit | Tetap |
| **1401** | Cadangan Kerugian Penurunan Nilai (CKPN) | ASET | Kredit | Penurunan Nilai |
| **2101** | Simpanan Pokok | KEWAJIBAN | Kredit | Simpanan Anggota |
| **2102** | Simpanan Wajib | KEWAJIBAN | Kredit | Simpanan Anggota |
| **2103** | Simpanan Sukarela | KEWAJIBAN | Kredit | Simpanan Anggota |
| **2104** | Deposito | KEWAJIBAN | Kredit | Simpanan Anggota |
| **2201** | Hutang Dagang | KEWAJIBAN | Kredit | Hutang |
| **3101** | Modal Pokok | EKUITAS | Kredit | Modal |
| **3102** | Dana Cadangan | EKUITAS | Kredit | Cadangan |
| **3103** | SHU Belum Dibagi | EKUITAS | Kredit | SHU |
| **4101** | Pendapatan Bunga Pinjaman | PENDAPATAN | Kredit | Pendapatan Usaha |
| **4201** | Pendapatan Penjualan | PENDAPATAN | Kredit | Pendapatan Unit Usaha |
| **4301** | Pendapatan Sewa | PENDAPATAN | Kredit | Pendapatan Unit Usaha |
| **4401** | Pendapatan Biaya Admin | PENDAPATAN | Kredit | Pendapatan Usaha |
| **5101** | Harga Pokok Penjualan | BEBAN | Debit | Beban Usaha |
| **5201** | Beban Gaji | BEBAN | Debit | Beban Operasional |
| **5301** | Beban Penyusutan | BEBAN | Debit | Beban Operasional |
| **5401** | Beban CKPN | BEBAN | Debit | Beban Kerugian |
| **6101** | Ikhtisar Laba Rugi (Pendapatan) | SHU | Kredit | Penutup |
| **6201** | Ikhtisar Laba Rugi (Beban) | SHU | Debit | Penutup |

---

## 13. Persetujuan Dokumen

Dokumen ini telah ditinjau dan disetujui oleh seluruh stakeholder proyek MetroCoop.

| Peran | Nama | Tanda Tangan | Tanggal |
|-------|------|:------------:|:-------:|
| **Project Manager** | | | |
| **Tech Lead** | | | |
| **Business Analyst** | | | |
| **QA Lead** | | | |
| **Client Representative** | | | |

---

| Versi | Tanggal | Perubahan | Oleh |
|-------|---------|-----------|------|
| 1.0.0 | 16 Juli 2026 | Rilis awal | Tim Pengembangan MetroCoop |

---

*Dokumen ini bersifat rahasia dan hanya boleh didistribusikan kepada pihak yang berkepentingan. Setiap perubahan harus melalui proses Change Request formal.*
