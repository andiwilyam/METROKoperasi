# Proposal Teknis & Komersial
## Pengembangan Sistem Informasi Koperasi Simpan Pinjam Terintegrasi (MetroCoop)

---

**Versi:** 1.0  
**Tanggal:** Juli 2026  
**Klasifikasi:** Konfidensial  
**Disusun oleh:** Tim Pengembang MetroCoop

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Pemahaman Kebutuhan Koperasi](#2-pemahaman-kebutuhan-koperasi)
3. [Solusi yang Ditawarkan](#3-solusi-yang-ditaawarkan)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Metodologi Pengembangan](#5-metodologi-pengembangan)
6. [Timeline & Milestone](#6-timeline--milestone)
7. [Tim Proyek](#7-tim-proyek)
8. [Investasi & Harga Penawaran](#8-investasi--harga-penawaran)
9. [Syarat & Ketentuan](#9-syarat--ketentuan)
10. [Penutup](#10-penutup)

---

## 1. Pendahuluan

### 1.1 Latar Belakang

Koperasi Simpan Pinjam (KSP) di Indonesia menghadapi tantangan transformasi digital yang semakin mendesak. Banyak koperasi masih mengelola operasional secara manual atau menggunakan sistem terpisah (silo) untuk keanggotaan, simpanan, pinjaman, akuntansi, dan unit usaha. Hal ini menimbulkan inefisiensi, kesalahan data, kesulitan pelaporan, dan risiko kepatuhan regulasi (OJK, UU Koperasi).

### 1.2 Tujuan Proposal

Dokumen ini mengajukan solusi **MetroCoop** — platform Sistem Informasi Koperasi Terintegrasi berbasis cloud yang dirancang khusus untuk kebutuhan KSP Indonesia. Proposal ini mencakup pemahaman kebutuhan, ruang lingkup solusi, arsitektur teknis, metodologi, timeline, komposisi tim, dan penawaran komersial.

### 1.3 Ruang Lingkup

- Pengembangan & deployment sistem MetroCoop (versi production-ready)
- Migrasi data legacy (jika ada)
- Pelatihan administrator & pengguna kunci
- Dukungan pasca-go-live (warranty period 3 bulan)
- Opsional: Modul kustomisasi lanjutan & integrasi eksternal

---

## 2. Pemahaman Kebutuhan Koperasi

### 2.1 Tantangan Umum KSP Indonesia

| Area | Tantangan Saat Ini | Dampak |
|------|-------------------|--------|
| **Keanggotaan** | Data manual (Excel/kartu), duplikasi NIK, tidak terintegrasi dengan simpanan/pinjaman | Kesalahan saldo, sulit audit, member experience buruk |
| **Simpanan** | 4 jenis simpanan (pokok, wajib, sukarela, deposito) dengan perhitungan bunga manual | Error bunga, pelaporan lambat, ketidakpuasan anggota |
| **Pinjaman** | 3 metode bunga (flat, efektif, anuitas), tenor fleksibel, angsuran manual | Perhitungan salah, tunggakan tidak terlacak, kolektibilitas rendah |
| **Akuntansi** | Jurnal manual, COA tidak standar SAK ETAP, neraca saldo manual | Tidak compliant, audit mahal, pengambilan keputusan lambat |
| **Unit Usaha** | Toko, Sewa, PPOB, Cicilan Barang, Ventura terpisah | Data terfragmentasi, laporan konsolidasi mustahil |
| **Pelaporan** | Manual ke OJK/regulator, tidak real-time | Denda, reputasi buruk, risiko hukum |
| **Keamanan** | Tanpa role-based access, audit trail minim | Risiko kecurangan, kebocoran data anggota |

### 2.2 Kebutuhan Spesifik yang Teridentifikasi

1. **Multi-role Access Control**: Superadmin, Admin, Operator, Anggota, Anggota Perusahaan
2. **4 Jenis Simpanan** dengan perhitungan bunga otomatis (harian/bulanan)
3. **3 Metode Bunga Pinjaman**: Flat, Efektif, Anuitas — dengan scheduler angsuran otomatis
4. **Akuntansi SAK ETAP**: COA hierarchical, jurnal otomatis dari transaksi operasional
5. **Unit Usaha Terintegrasi**: POS Retail, Sewa Aset, PPOB/Digital Payment, Cicilan Barang, Investasi Ventura
6. **AI Credit Scoring**: Analisis risiko berbasis 5C (Character, Capacity, Capital, Collateral, Condition) menggunakan Google Gemini
7. **Landing Page CMS**: Konten dinamis tanpa deploy ulang
8. **Audit Trail & Compliance**: Log lengkap untuk audit internal & eksternal
9. **Mobile-Responsive**: Akses anggota via smartphone (PWA-ready)

---

## 3. Solusi yang Ditawarkan

### 3.1 Fitur Utama (Core Modules)

| Modul | Deskripsi Singkat | Status |
|-------|-------------------|--------|
| **Autentikasi & Otorisasi** | JWT-based auth, RBAC 5 role, session management, rate limiting | ✅ Done |
| **Manajemen Keanggotaan** | CRUD anggota, 4 tipe simpanan saldo real-time, status keanggotaan, upload dokumen | ✅ Done |
| **Transaksi Simpanan** | Setor/tarik 4 jenis, validasi saldo, bunga otomatis, mutasi rekening, cetak bukti | ✅ Done |
| **Pinjaman & Angsuran** | 4 produk pinjaman, 3 metode bunga, workflow pengajuan→cair→angsuran, penalty otomatis | ✅ Done |
| **Akuntansi & Jurnal** | COA 6 level (SAK ETAP), jurnal otomatis dari modul lain, buku besar, neraca saldo, laporan keuangan | ✅ Done |
| **Periode Akuntansi** | 12 periode/tahun, open/close period, tutup buku, reverse jurnal | ✅ Done |
| **POS & Retail** | Kategori, supplier, stok real-time, penjualan multi-item, HPP, laporan laba rugi toko | ✅ Done |
| **Sewa Aset** | Manajemen aset, jadwal sewa, denda keterlambatan, pembayaran parsial | ✅ Done |
| **PPOB & Digital Payment** | Pulsa, listrik, PDAM, BPJS, VA Bank (Mandiri/BNI/BRI/BCA/Permata), QRIS, e-Wallet | ✅ Done |
| **Cicilan Barang** | Pembelian barang cicilan, DP, tenor, bunga, angsuran bulanan, status lunas | ✅ Done |
| **Ventura & Investasi** | Portfolio investasi, dividen, skoring AI, pengajuan pembiayaan perusahaan | ✅ Done |
| **Pengumuman & Tiket** | Broadcast ke anggota, sistem tiket bantuan dengan SLA | ✅ Done |
| **Laporan & Dashboard** | Dashboard per role, 20+ laporan standar, export PDF/Excel | ✅ Done |
| **Landing Page CMS** | Hero, fitur, tim, testimoni, pricing, kontak — editable via admin | ✅ Done |
| **Feature Toggle** | Enable/disable modul per kebutuhan koperasi | ✅ Done |

### 3.2 Fitur Unggulan (Differentiators)

| Fitur | Nilai Tambah |
|-------|-------------|
| **Jurnal Otomatis End-to-End** | Setiap transaksi (simpanan, pinjaman, toko, sewa, PPOB) langsung generate jurnal ke COA — zero manual entry |
| **AI Credit Scoring (Gemini)** | Analisis 5C + rasio keuangan (likuiditas, solvabilitas, profitabilitas, BOPO, BMPK) → rekomendasi plafon/tenor/bunga otomatis |
| **Multi-Tenant Ready** | Arsitektur mendukung multi-koperasi dalam satu deployment (saat ini single-tenant, ready untuk scale) |
| **Real-time Dashboard** | WebSocket-ready untuk update saldo/transaksi real-time tanpa refresh |
| **Audit Trail Lengkap** | Setiap create/update/delete tercatat: user, timestamp, before/after values |
| **PWA-Ready** | Installable di mobile, offline-first untuk transaksi kasir |
| **Deploy ke Railway/Cloud** | CI/CD GitHub Actions → Railway, preview deploy per PR, health check otomatis |

### 3.3 Stack Teknologi

| Layer | Teknologi | Alasan Pemilihan |
|-------|-----------|------------------|
| **Frontend** | React 18 + TypeScript + Vite | Modern, fast HMR, type-safe, ecosystem besar |
| **UI** | Tailwind CSS + shadcn/ui | Utility-first, accessible, customizable, no runtime overhead |
| **State** | Zustand (client) + React Query (server) | Simple, performant, cache management built-in |
| **Backend** | Node.js (ESM) + Express + TypeScript | Unified language, type-sharing via shared package |
| **Database** | PostgreSQL 16 | ACID, JSONB, mature, cloud-managed ready (Railway/Neon/Supabase) |
| **ORM** | Raw SQL (pg) + migration runner custom | Full control, performance, no abstraction leak |
| **Auth** | JWT (HS256) + bcryptjs | Stateless, scalable, industry standard |
| **AI** | Google Gemini 2.5 Flash | Credit scoring, document analysis, cost-effective |
| **Build** | esbuild (server) + Vite (client) | Sub-second builds, tree-shaking |
| **CI/CD** | GitHub Actions → Railway | Native integration, preview envs, secrets management |
| **Testing** | Vitest (unit) + Playwright (E2E) | Fast, modern, reliable |
| **Monitoring** | Railway metrics + custom /api/health | Built-in + application-level |

---

## 4. Arsitektur Sistem

### 4.1 Diagram Arsitektur High-Level

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            METROCOOP ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Browser    │    │   Mobile     │    │   Admin      │    │  3rd Party │  │
│  │   (React)    │    │   (PWA)      │    │   Portal     │    │  Services  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └─────┬──────┘  │
│         │                   │                   │                   │         │
│         └───────────────────┼───────────────────┼───────────────────┘         │
│                             ▼                   ▼                             │
│                    ┌─────────────────────────────────────────┐               │
│                    │           API Gateway (Express)          │               │
│                    │  ┌───────────────────────────────────┐  │               │
│                    │  │     Middleware Stack              │  │               │
│                    │  │  Helmet • CORS • RateLimit • JWT  │  │               │
│                    │  └───────────────────────────────────┘  │               │
│                    └──────────────────┬──────────────────────┘               │
│                                       │                                      │
│         ┌─────────────────────────────┼─────────────────────────────┐        │
│         ▼                             ▼                             ▼        │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐  │
│  │   Module    │              │   Module    │              │   Module    │  │
│  │  Routers    │              │  Routers    │              │  Routers    │  │
│  │ (auth,      │              │ (anggota,   │              │ (akuntansi, │  │
│  │  data,      │              │  simpanan,  │              │  laporan,   │  │
│  │  upload)    │              │  pinjaman)  │              │  unit usaha)│  │
│  └──────┬──────┘              └──────┬──────┘              └──────┬──────┘  │
│         │                            │                            │         │
│         └────────────────────────────┼────────────────────────────┘         │
│                                      ▼                                      │
│                         ┌─────────────────────┐                             │
│                         │  PostgreSQL 16      │                             │
│                         │  (Primary + Replica)│                             │
│                         │  • 70+ Tables       │                             │
│                         │  • JSONB for flex   │                             │
│                         │  • Row-level Security│                            │
│                         └─────────────────────┘                             │
│                                      │                                      │
│                    ┌─────────────────┼─────────────────┐                   │
│                    ▼                 ▼                 ▼                   │
│            ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│            │  Google     │    │  Railway    │    │  External   │           │
│            │  Gemini AI  │    │  (Hosting)  │    │  APIs       │           │
│            │  (Scoring)  │    │  + PostgreSQL│   │  (Midtrans, │           │
│            └─────────────┘    └─────────────┘    │   VA Banks) │           │
│                                                   └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Arsitektur Monorepo

```
metrocoop/
├── apps/
│   ├── web/                    # React Frontend (Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/     # UI Components (admin, member, landing)
│   │   │   ├── pages/          # Route-level pages
│   │   │   ├── stores/         # Zustand state
│   │   │   ├── lib/            # API client, utils
│   │   │   └── theme/          # Theme provider
│   │   └── tests/e2e/          # Playwright tests
│   └── mobile/                 # React Native (Expo) - future
├── packages/
│   └── shared/                 # Shared TypeScript types, validation, API client
│       ├── src/
│       │   ├── types/          # Domain types (Anggota, Pinjaman, Jurnal, etc.)
│       │   ├── api/            # Typed API client (fetch wrapper)
│       │   ├── validation/     # Zod schemas
│       │   └── stores/         # Shared Zustand stores
├── server/                     # Express Backend
│   ├── routes/                 # Module routers
│   ├── middleware/             # Auth, rate-limit, error handling
│   ├── lib/                    # Finance calculations, AI scoring
│   ├── db.ts                   # PostgreSQL pool + query helpers
│   ├── migrate.ts              # Migration runner
│   └── server.ts               # Entry point
├── db/
│   ├── schema.sql              # DDL (70+ tables)
│   └── seed.sql                # Reference data
├── landing/                    # Static landing page (CMS-driven)
├── .github/workflows/          # CI/CD pipelines
├── railway.toml                # Railway config
└── Dockerfile                  # Multi-stage build
```

### 4.3 Data Flow: Transaksi → Jurnal Otomatis

```
User Action (Setor Simpanan)
        │
        ▼
POST /api/simpanan/transaksi
        │
        ▼
Validate (Zod) → Check Saldo → Insert simpanan_transaksi
        │
        ▼
Auto-Generate Jurnal (Trigger di Service Layer)
        │
        ├─ Debit: Kas/Bank (1.1.01/1.1.03)      ← Sumber Bayar
        │
        └─ Kredit: Simpanan Pokok/Wajib/Sukarela (2.1.01/02/03)
        │
        ▼
Insert journal_entries + journal_approvals (status: posted)
        │
        ▼
Return Response { transaksi, jurnal }
```

### 4.4 Keamanan & Kepatuhan

| Aspek | Implementasi |
|-------|-------------|
| **Authentication** | JWT HS256, 24h expiry, refresh token rotation (planned) |
| **Authorization** | RBAC middleware per route + resource-level checks |
| **Rate Limiting** | 100 req/15min global, 10 login/15min per IP |
| **Headers** | Helmet (CSP, HSTS, X-Frame-Options, Referrer-Policy) |
| **CORS** | Whitelist origin production + preview |
| **Password** | bcryptjs cost factor 10 |
| **SQL Injection** | Parameterized queries (pg driver), no string concat |
| **Audit Log** | Setiap mutasi data mencatat: user_id, table, pk, before_json, after_json, timestamp |
| **Data Encryption** | TLS 1.3 in transit, pgcrypto for PII at rest (planned) |
| **Backup** | Railway automated daily PG dump + point-in-time recovery |
| **Compliance** | Siap audit OJK, UU No. 17/2012 (Koperasi), SAK ETAP |

---

## 5. Metodologi Pengembangan

### 5.1 Pendekatan: Agile Hybrid (Scrum + Kanban)

| Fase | Durasi | Aktivitas Utama | Deliverable |
|------|--------|-----------------|-------------|
| **Discovery** | 2 minggu | Workshop kebutuhan, analisis gap, finalisasi scope | BRD, SRS, Wireframe |
| **Sprint 0 (Setup)** | 1 minggu | Repo, CI/CD, DB staging, design system, auth skeleton | Running dev env |
| **Sprint 1-3 (Core)** | 6 minggu | Auth, Anggota, Simpanan, Pinjaman, Jurnal Otomatis | Core modules done |
| **Sprint 4-5 (Akuntansi)** | 4 minggu | COA, Periode, Buku Besar, Neraca, Laba Rugi, Tutup Buku | Accounting done |
| **Sprint 6-7 (Unit Usaha)** | 4 minggu | POS, Sewa, PPOB, Cicilan, Ventura | Business units done |
| **Sprint 8 (AI & Polish)** | 2 minggu | Credit Scoring, Landing CMS, Audit Trail, Performance | AI + UX done |
| **UAT & Go-Live** | 2 minggu | User acceptance test, data migration, training, production deploy | Production ready |
| **Warranty** | 12 minggu | Bug fix, minor enhancement, knowledge transfer | Stable ops |

### 5.2 Praktik Engineering

- **Trunk-based Development**: Main branch selalu deployable
- **Feature Flags**: Modul bisa dinonaktifkan tanpa deploy
- **Code Review**: Minimal 1 reviewer, checklist: types, tests, security, perf
- **Testing Pyramid**: Unit (Vitest) > Integration > E2E (Playwright)
- **Definition of Done**: Typecheck pass, build pass, unit test >80%, E2E pass, docs updated
- **Semantic Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

### 5.3 Quality Gates (CI Pipeline)

```yaml
Jobs:
  1. typecheck-build    # tsc --noEmit + vite build + esbuild server
  2. unit-test          # vitest run --coverage
  3. e2e-test           # playwright test (chromium, postgresql service)
  4. deploy-preview     # railway up --environment preview-pr-{num}
  5. deploy-production  # railway up --environment production (gate: main + CI pass)
```

---

## 6. Timeline & Milestone

### 6.1 Gantt Chart (High-Level)

```
Minggu:    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
           │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
Discovery  ████████
Sprint 0         ████
Sprint 1-3           ████████████████████
Sprint 4-5                     ████████████████
Sprint 6-7                                 ████████████████
Sprint 8                                           ████████
UAT & Go-Live                                               ████████
Warranty (support)                                             ████████████████████
```

### 6.2 Milestone Pembayaran (Payment Schedule)

| Milestone | Trigger | Persentase | Nilai (Contoh) |
|-----------|---------|------------|----------------|
| **M1: Kontrak & Discovery** | Tanda tangan kontrak + kickoff | 20% | Rp 150.000.000 |
| **M2: Core Modules Ready** | Sprint 3 done (Auth, Anggota, Simpanan, Pinjaman demo) | 25% | Rp 187.500.000 |
| **M3: Akuntansi & Unit Usaha** | Sprint 7 done (Accounting + POS + PPOB + Ventura) | 25% | Rp 187.500.000 |
| **M4: UAT Sign-off** | User acceptance test passed, staging approved | 20% | Rp 150.000.000 |
| **M5: Production Go-Live** | Deploy production, health check green, training done | 10% | Rp 75.000.000 |
| **Total** | | **100%** | **Rp 750.000.000** |

> **Catatan**: Nilai di atas ilustratif. Harga final disesuaikan scope, customisasi, dan SLA support.

---

## 7. Tim Proyek

| Peran | Nama | Tanggung Jawab Utama | Alokasi |
|-------|------|---------------------|---------|
| **Project Manager** | [Nama PM] | Planning, stakeholder comm, risk, budget, timeline | 50% |
| **Tech Lead / Backend Lead** | [Nama TL] | Arsitektur, code review, DB design, API design, AI integration | 100% |
| **Frontend Lead** | [Nama FL] | UI/UX implementation, design system, state mgmt, PWA | 100% |
| **Backend Engineer (2x)** | [Nama BE1, BE2] | Module development: auth, data, accounting, business units | 100% each |
| **Frontend Engineer (2x)** | [Nama FE1, FE2] | Component library, pages, dashboard, landing CMS | 100% each |
| **QA Engineer** | [Nama QA] | Test plan, automation (Playwright), UAT coordination | 75% |
| **DevOps / Cloud Engineer** | [Nama DevOps] | CI/CD, Railway, PostgreSQL, monitoring, backup, security | 50% |
| **Business Analyst** | [Nama BA] | Requirement elicitation, BRD/SRS, user story, UAT support | 75% |
| **UI/UX Designer** | [Nama Designer] | Wireframe, mockup, design system, usability testing | 50% |

**Total Headcount**: 11 orang (core team 9 + shared 2)

---

## 8. Investasi & Harga Penawaran

### 8.1 Paket Standar (Fixed Scope)

| Komponen | Deskripsi | Harga (IDR) |
|----------|-----------|-------------|
| **Lisensi Platform MetroCoop** | Perpetaun, source code access, unlimited users | 500.000.000 |
| **Implementasi & Customisasi** | Setup, konfigurasi, migrasi data, custom workflow | 150.000.000 |
| **Pelatihan & Knowledge Transfer** | 5 sesi: Admin, Operator, Anggota, Akuntansi, IT | 50.000.000 |
| **Warranty Support (3 bulan)** | Bug fix, minor enhancement, SLA 4 jam jam kerja | 50.000.000 |
| **Subtotal** | | **750.000.000** |

### 8.2 Paket Berlangganan (SaaS) — Alternatif

| Paket | Bulanan | Tahunan (10% off) | Termasuk |
|-------|---------|-------------------|----------|
| **Starter** | Rp 8.000.000 | Rp 86.400.000 | Core modules, 500 anggota, 1 GB storage |
| **Professional** | Rp 15.000.000 | Rp 162.000.000 | Semua modul, unlimited anggota, 10 GB, AI scoring |
| **Enterprise** | Rp 25.000.000 | Rp 270.000.000 | Professional + multi-cabang, dedicated support, SLA 99.9% |

### 8.3 Biaya Tambahan (Opsional)

| Item | Harga | Keterangan |
|------|-------|------------|
| Modul Kustom / Integrasi Bank Baru | Rp 50.000.000 / modul | VA bank lain, SMS gateway, BPJS, dll |
| Migrasi Data Legacy (kompleks) | Rp 30.000.000 | ETL dari sistem lama, validasi, UAT |
| Extend Warranty (per bulan) | Rp 10.000.000 | Setelah 3 bulan warranty standar |
| On-premise Deployment | Rp 100.000.000 | Install di server klien, air-gapped support |
| Penambahan User/Storage | Rp 5.000 / user/bulan | Di atas paket SaaS |

### 8.4 Asumsi Harga

1. Scope sesuai BRD/SRS yang disepakati (change request melalui CR form)
2. Data migrasi < 50.000 record (anggota + transaksi historis)
3. Infrastruktur cloud (Railway/PostgreSQL) dibayar terpisah oleh klien atau termasuk di SaaS
4. Pelatihan dilakukan remote (Zoom/Meet), on-site + biaya travel/akomodasi
5. Support warranty: jam kerja (Senin-Jumat, 09:00-17:00 WIB), response time < 4 jam

---

## 9. Syarat & Ketentuan

### 9.1 Ruang Lingkup & Change Request

- Setiap perubahan scope (tambah fitur, ubah flow, integrasi baru) memerlukan **Change Request (CR)** tertulis
- CR dievaluasi impact (effort, timeline, cost) dalam 3 hari kerja
- CR disetujui oleh Project Sponsor klien & PM MetroCoop

### 9.2 Hak Kekayaan Intelektual (IPR)

- **Kode sumber (source code)**: Hak cipta dimiliki MetroCoop. Klien mendapat **lisensi perpetual, non-eksklusif, royalty-free** untuk penggunaan internal
- **Data koperasi**: 100% milik klien. MetroCoop tidak berhak membagikan, menjual, atau menggunakan data untuk keperluan lain
- **Brand MetroCoop**: Tetap milik pengembang. Klien boleh white-label dengan perjanjian terpisah

### 9.3 SLA Support (Warranty Period)

| Severity | Deskripsi | Response Time | Resolution Target |
|----------|-----------|---------------|-------------------|
| **Critical (P1)** | Sistem down, data hilang, security breach | < 1 jam | < 4 jam |
| **High (P2)** | Fitur utama error, blokir operasional harian | < 4 jam | < 1 hari kerja |
| **Medium (P3)** | Bug non-kritis, UI glitch, laporan salah | < 1 hari kerja | < 3 hari kerja |
| **Low (P4)** | Enhancement, kosmetik, dokumentasi | < 3 hari kerja | Next sprint |

### 9.4 Konfidensialitas

- Kedua pihak menjaga kerahasiaan informasi bisnis, data anggota, kode sumber, dan dokumen proyek
- Berlaku selama kontrak + 3 tahun pasca berakhirnya kontrak
- Kecuali: informasi yang sudah publik, wajib dibuka per undang-undang, atau disetujui tertulis

### 9.5 Force Majeure

Tidak ada pihak yang bertanggung jawab atas kegagalan penugasan akibat kekuatan di luar kendali (bencana alam, perang, pandemi, regulasi pemerintah, gangguan internet backbone).

### 9.6 Penyelesaian Sengketa

1. Musyawarah mufakat (good faith) dalam 14 hari
2. Mediasi di BANI (Badan Arbitrase Nasional Indonesia)
3. Arbitrase di BANI dengan hukum Indonesia, bahasa Indonesia, tempat Jakarta

### 9.7 Masa Berlaku & Pembatalan

- Kontrak berlaku sejak tanda tangan sampai Go-Live + 3 bulan warranty
- Pembatalan: minimal 30 hari tertulis sebelumnya
- Jika dibatalkan klien sebelum M2: 50% nilai M1 + M2 dibayar
- Jika dibatalkan MetroCoop: refund 100% uang muka + kompensasi 10% total kontrak

---

## 10. Penutup

MetroCoop hadir sebagai solusi **end-to-end, modern, dan compliant** untuk transformasi digital Koperasi Simpan Pinjam Indonesia. Dengan arsitektur modular, jurnal otomatis, AI credit scoring, dan unit usaha terintegrasi, koperasi dapat:

- ✅ **Mengurangi operasional manual 80%+**
- ✅ **Mempercepat pelaporan ke OJK/anggota dari minggu jadi jam**
- ✅ **Meningkatkan akurasi data & kepercayaan anggota**
- ✅ **Membuka pendapatan baru** (PPOB, Ventura, Sewa, Toko)
- ✅ **Siap audit & regulasi** kapan saja

Kami siap menjadi **partner teknologi jangka panjang** — bukan sekadar vendor proyek. Tim kami berkomitmen pada kualitas kode, keamanan data, dan kesuksesan operasional koperasi Anda.

---

**Disiapkan oleh:**  
Tim MetroCoop  
📧 email@metromitra.co.id  
📞 +62 21 789-0123  
🌐 https://metrocoop-app-production.up.railway.app

---

*Proposal ini berlaku 30 hari sejak tanggal terbit. Semua harga dalam Rupiah Indonesia (IDR) dan belum termasuk PPN 11% (kecuali dinyatakan lain).*