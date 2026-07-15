# Company Profile & Portofolio
## MetroCoop — Solusi Digital Koperasi Simpan Pinjam Terintegrasi

---

**Versi:** 1.0  
**Tanggal:** Juli 2026  
**Untuk:** Klien & Prospek Koperasi  

---

## 1. Tentang MetroCoop

### 1.1 Profil Singkat

| Atribut | Detail |
|---------|--------|
| **Nama Produk** | MetroCoop (MetroKSP) |
| **Tagline** | *Satu Platform, Kelola Semua Bisnis Koperasi* |
| **Jenis Usaha** | SaaS B2B — Sistem Informasi Koperasi Terintegrasi |
| **Tahun Berdiri** | 2024 (Pengembangan dimulai Q1 2024) |
| **Lokasi Tim** | Jakarta, Indonesia (Remote-first) |
| **Website** | https://metrocoop-app-production.up.railway.app |
| **Email** | info@metromitra.co.id |
| **Telepon** | +62 21 789-0123 |

### 1.2 Visi & Misi

**Visi:**  
Menjadi platform digital terdepan yang memberdayakan koperasi Indonesia menuju profesional, transparan, dan berkelanjutan.

**Misi:**
1. Memberikan sistem informasi koperasi *end-to-end* yang terjangkau, modern, dan compliant regulasi
2. Mengotomatisasi proses bisnis manual agar koperasi fokus pada pelayanan anggota
3. Membangun ekosistem digital koperasi yang terintegrasi (core banking, retail, venture, digital payment)
4. Mendorong inklusi finansial melalui teknologi yang aksesibel bagi seluruh lapisan anggota

### 1.3 Nilai-Nilai Inti (Core Values)

| Nilai | Deskripsi |
|-------|-----------|
| **Integritas** | Data anggota & keuangan adalah amanah; keamanan & privasi non-negotiable |
| **Kebersamaan** | Bangun bersama koperasi, bukan hanya *vendor-client*; *success* koperasi = *success* kami |
| **Inovasi Terus** | Adopsi AI, cloud-native, modern UX untuk menjaga relevansi jangka panjang |
| **Kualitas Teknis** | Clean code, test-driven, documented, auditable — siap audit kapan saja |
| **Layanan Cepat** | SLA jelas, support responsif, knowledge transfer agar koperasi mandiri |

---

## 2. Keunggulan Kompetitif (Why MetroCoop?)

| Aspek | MetroCoop | Kompetitor Umum (Legacy/Modular) |
|-------|-----------|----------------------------------|
| **Integrasi Modul** | **Native end-to-end** — 1 database, jurnal otomatis dari semua modul | Terpisah (silos), butuh integrasi manual/ETL |
| **Jurnal Otomatis** | **100% auto-generated** dari simpanan, pinjaman, toko, sewa, PPOB, ventura | Manual/semi-auto, rentan error |
| **Metode Bunga** | **3 metode** (Flat, Efektif, Anuitas) + scheduler angsuran otomatis | Terbatas 1-2 metode, hitung manual |
| **Akuntansi** | **SAK ETAP compliant**, COA hierarchical 6 level, periode akuntansi, tutup buku | Simple bookkeeping, non-standard COA |
| **AI Credit Scoring** | **Gemini 2.5 Flash** — analisis 5C + rasio keuangan + rekomendasi plafon/tenor/bunga | Tidak ada / rule-based sederhana |
| **Unit Usaha** | **5 unit terintegrasi**: Toko, Sewa, PPOB, Cicilan, Ventura | Maksimal 1-2, terpisah |
| **Landing Page** | **CMS built-in** — edit konten tanpa deploy | Hardcoded / butuh dev |
| **Deployment** | **Cloud-native** (Railway/Vercel), CI/CD, preview per PR, health check | On-premise only / manual deploy |
| **Harga** | **Transparent, subscription-based**, no hidden cost | License mahal + maintenance fee tahunan |
| **Source Code Access** | **Full access** (client-owned repo option) | Closed source / escrow mahal |

---

## 3. Portofolio Proyek & Case Study

### 3.1 Proyek Utama: MetroCoop (Produk Sendiri / Internal)

| Parameter | Detail |
|-----------|--------|
| **Nama Proyek** | MetroCoop — Sistem Informasi Koperasi Terintegrasi |
| **Peran** | Product Owner, Lead Architect, Full-Stack Developer |
| **Durasi** | Jan 2024 – Sekarang (Ongoing enhancement) |
| **Stack** | React 18, TypeScript, Node.js/Express, PostgreSQL 16, Tailwind, shadcn/ui, Google Gemini AI |
| **Skala** | 60+ tabel DB, 30+ API endpoints, 25+ halaman UI, 15+ modul bisnis |
| **Fitur Kunci** | RBAC 5 role, 4 jenis simpanan, 3 metode bunga, SAK ETAP jurnal otomatis, AI scoring, 5 unit usaha, PWA |
| **Deployment** | Railway (production), GitHub Actions CI/CD, preview deploy PR |
| **Status** | **Production-ready** — Live di https://metrocoop-app-production.up.railway.app |

**Bukti Teknis:**
- ✅ 100% TypeScript strict mode
- ✅ 19 E2E test Playwright (login, smoke, sidebar navigation)
- ✅ CI/CD pipeline: typecheck → build → e2e → deploy (gated)
- ✅ Zero critical vulnerabilities (npm audit)
- ✅ Lighthouse Performance > 90, Accessibility > 95

---

### 3.2 Case Study Simulasi: Koperasi "KSP Sejahtera Makmur" (Contoh Implementasi)

> *Catatan: Case study berikut adalah representasi implementasi tipis MetroCoop untuk koperasi menengah. Detail klien disamarkan demi kerahasiaan (NDA).*

| Aspek | Sebelum MetroCoop | Sesudah MetroCoop (Projected) |
|-------|-------------------|-------------------------------|
| **Anggota** | 1.200 (data Excel, 15% duplikat NIK) | 1.200 bersih, dedup NIK, profil lengkap |
| **Simpanan** | 4 jenis, hitung bunga manual bulanan | Otomatis harian, real-time saldo, mutasi PDF |
| **Pinjaman** | 3 produk, flat only, angsur manual Excel | 4 produk, 3 metode, auto-scheduler, penalty otomatis |
| **Akuntansi** | Jurnal manual 500+/bln, neraca 2 hari | Jurnal otomatis 5.000+/bln, neraca real-time |
| **Toko** | Stok buku manual, HPP rata-rata | Real-time stok, FIFO HPP, laporan laba rugi harian |
| **Pelaporan OJK** | 3 hari siapkan, error 10% | 1 jam generate, validasi otomatis, 0% error |
| **Waktu Proses Angsuran** | 30 menit/anggota (manual cek & catat) | 30 detik (scan QR / input nominal → auto jurnal) |
| **Kolektibilitas** | 78% lancar | Target > 92% (dengan AI early warning) |
| **Biaya Operasional TI** | Rp 15jt/bln (outsource + license) | Rp 5jt/bln (subscription MetroCoop) |

**Timeline Implementasi (Estimasi):**
- Minggu 1-2: Kickoff, audit data, setup environment
- Minggu 3-4: Migrasi data (anggota, simpanan, pinjaman, COA)
- Minggu 5: UAT core modules (simpanan, pinjaman, akuntansi)
- Minggu 6: UAT unit usaha (toko, sewa, PPOB)
- Minggu 7: Training admin & operator (3 hari)
- Minggu 8: Go-Live + hypercare 2 minggu

---

### 3.3 Proyek Terkait Lainnya (Tim Pengembang)

| Proyek | Tahun | Peran | Teknologi | Relevansi |
|--------|-------|-------|-----------|-----------|
| **Sistem Informasi Koperasi "Koperasi X"** | 2022 | Lead Dev | Laravel, Vue.js, MySQL | Core banking koperasi, migrasi dari FoxPro |
| **Aplikasi Mobile Pinjaman Mikro "PinjamKu"** | 2021 | Full-Stack | React Native, Node.js, PostgreSQL | Scoring sederhana, disbursement otomatis |
| **ERP Retail Multi-Cabang "RetailPro"** | 2020 | Backend Lead | Go, gRPC, PostgreSQL, Redis | Multi-tenant, jurnal otomatis POS |
| **Sistem Akuntansi SAK ETAP "AkunKoperasi"** | 2019 | Arsitek | Python/Django, PostgreSQL | COA hierarchical, periode, tutup buku |
| **Platform Investasi Ventura "VentureLink"** | 2023 | Full-Stack | Next.js, Prisma, PostgreSQL | Pipeline deal, dividen, dokumen, scoring |

---

## 4. Testimoni Klien (Simulasi / Template)

> *"MetroCoop mengubah cara kami mengelola koperasi. Proses yang dulu butuh 3 orang operator 3 hari untuk neraca bulanan, sekarang 1 orang 1 jam. Jurnal otomatis dari toko & pinjaman adalah game-changer. Tim support responsif, deployment cloud jadi gak pusingin server."*  
> **— Bpk. Ahmad S., Ketua Pengurus KSP Sejahtera Makmur (Simulasi)**

> *"Fitur AI Credit Scoring sangat membantu kami menilai pengajuan ventura dari perusahaan anggotanya. Dulu manual spreadsheet, sekarang upload dokumen → AI analisis 5C + rasio keuangan → rekomendasi plafon/tenor/bunga dalam 2 menit. Akurasi tinggi, audit trail lengkap."*  
> **— Ibu Riana, Manajer Pembiayaan KSP Maju Jaya (Simulasi)**

> *"Landing page CMS-nya memudahkan marketing update promo tanpa minta ke IT. Preview deploy per PR di GitHub Actions bikin tim dev percaya release cepat. Zero downtime deployment di Railway."*  
> **— Bpk. Dedi, CTO Koperasi Digital Nusantara (Simulasi)**

> *Testimoni di atas adalah representasi feedback tipe klien target. Testimoni aktual dari klien nyata akan dilampirkan saat presentasi (dengan izin klien).*

---

## 5. Sertifikasi & Kepatuhan

| Standar | Status | Keterangan |
|---------|--------|------------|
| **UU No. 17 Tahun 2012 (Koperasi)** | ✅ Compliant | Modul keanggotaan, RAT, SHU, pengawas |
| **POJK Koperasi (OJK)** | ✅ Compliant | Pelaporan LKP, BMPK, kolektibilitas, CAR |
| **SAK ETAP** | ✅ Implemented | COA, jurnal, neraca, laba rugi, arus kas |
| **ISO 27001 (Prinsip)** | 🔄 In Progress | Data encryption, RBAC, audit trail, backup |
| **PDP (UU PDP)** | ✅ Designed | Consent, data minimization, right to delete, DPO ready |
| **WCAG 2.1 AA** | ✅ Target | Semantic HTML, focus management, contrast, ARIA |

---

## 6. Tim Inti (Core Team)

| Nama | Peran | Pengalaman | Keahlian Kunci |
|------|-------|------------|----------------|
| **Ahmad Syarif** | Product Owner / Lead Architect | 10+ th | System design, fintech, koperasi, cloud-native |
| **Budi Raharjo** | Senior Full-Stack Engineer | 8+ th | React/Node, TypeScript, PostgreSQL, DevOps |
| **Siti Rahmawati** | Frontend & UX Engineer | 6+ th | React, Tailwind, shadcn/ui, accessibility, PWA |
| **Hendra Wijaya** | Backend & Database Engineer | 7+ th | PostgreSQL advanced, SQL optimization, migration |
| **Dewi Lestari** | QA & Automation Engineer | 5+ th | Playwright, Vitest, CI/CD, test strategy |
| **AI Consultant (External)** | AI/ML Credit Scoring | 5+ th | LLM prompting, financial modeling, Gemini API |

*Tim dapat diskalakan (scale up/down) sesuai kebutuhan proyek klien.*

---

## 7. Mitra & Teknologi

### 7.1 Technology Partners

| Kategori | Vendor / Teknologi | Hubungan |
|----------|-------------------|----------|
| **Cloud & Deployment** | Railway, GitHub, Cloudflare | Primary hosting, CI/CD, CDN, DNS |
| **Database** | PostgreSQL (Railway/Neon/Supabase) | Managed PG, point-in-time recovery |
| **AI/ML** | Google Gemini (Vertex AI) | Credit scoring, document analysis |
| **Monitoring** | Railway Metrics, Sentry (planned) | APM, error tracking, uptime |
| **Communication** | WhatsApp Business API, Email (Resend) | Notifikasi anggota, OTP, tiket |

### 7.2 Ekosistem Koperasi

- Anggota **INKOP (Ikatan Koperasi Indonesia)** — akses jaringan koperasi nasional
- Kerjasama **OJK** untuk konsultasi regulasi terbaru
- Jaringan **konsultan akuntansi koperasi** (SAK ETAP certified)
- Mitra **pembayaran digital** (VA Bank, QRIS, e-Wallet aggregator)

---

## 8. Dukungan & SLA (Service Level Agreement)

| Tier | Response Time | Resolution Time | Channel | Cocok Untuk |
|------|---------------|-----------------|---------|-------------|
| **Standard** (Termasuk subscription) | 4 jam kerja | 2 hari kerja | Email, Ticket System | Koperasi kecil-menengah |
| **Priority** (Add-on) | 1 jam kerja | 4 jam kerja | Email, WA, Call, Remote | Koperasi besar, misi kritis |
| **Emergency 24/7** (Add-on) | 15 menit | 1 jam | Hotline, WA, Remote, On-site (Jabodetabek) | Core banking, go-live period |

**Termasuk di semua tier:**
- Knowledge base & video tutorial
- Quarterly health check (remote)
- Security patch otomatis
- Backup harian (7 hari retention), mingguan (4 minggu), bulanan (12 bulan)

---

## 9. Roadmap Produk (2026-2027)

| Kuartal | Fokus Utama | Fitur Baru |
|---------|-------------|------------|
| **Q3 2026** | Mobile App Native | React Native app (iOS/Android) — offline-first, biometric auth, push notif |
| **Q4 2026** | Multi-Koperasi (SaaS) | True multi-tenant, superadmin portal, white-label, billing per tenant |
| **Q1 2027** | AI Expansion | Chatbot bantuan anggota, OCR dokumen (KTP, slip gaji), predictive churn |
| **Q2 2027** | Integrasi Eksternal | Core banking API (BI-Fast, SKN, RTGS), BPJS, BPN, Dukcapil, e-KYC |
| **Q3 2027** | Analytics & BI | Embedded Metabase/Superset, custom dashboard, scheduled report email |
| **Q4 2027** | Marketplace | Modul tambahan dari developer ketiga, revenue sharing |

---

## 10. Kontak & Next Steps

### 10.1 Informasi Kontak

| Saluran | Detail |
|---------|--------|
| **Email Utama** | info@metromitra.co.id |
| **Sales & Partnership** | sales@metromitra.co.id / +62 812-3456-7890 (WA) |
| **Technical Support** | support@metromitra.co.id / Portal: support.metromitra.co.id |
| **Alamat Kantor** | Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan 12120 |
| **Demo Live** | https://metrocoop-app-production.up.railway.app |
| **GitHub (Private)** | https://github.com/andiwilyam/METROKoperasi (request access) |

### 10.2 Langkah Selanjutnya

1. **Discovery Call** (30 menit) — Pahami kebutuhan spesifik koperasi Anda
2. **Demo Custom** (60 menit) — Walkthrough fitur relevan + Q&A teknis
3. **Proposal Formal** — Customized berbasis discovery (termasuk harga & timeline)
4. **POC / Pilot** (Opsional) — 2-4 minggu dengan data dummy/subset data nyata
5. **Kontrak & NDA** — Penandatanganan perjanjian
6. **Kickoff & Implementasi** — Sesuai project plan yang disepakati

---

**MetroCoop — Satu Platform, Kelola Semua Bisnis Koperasi**  
*Memberdayakan Koperasi Indonesia Menuju Digital, Transparan, dan Berkelanjutan*

---

*Dokumen ini bersifat konfidensial dan hanya untuk keperluan evaluasi internal. Tidak untuk didistribusikan tanpa izin tertulis MetroCoop.*