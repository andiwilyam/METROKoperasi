# Rencana Proyek (Project Plan)
## Implementasi Sistem Informasi Koperasi Simpan Pinjam MetroCoop

---

| Field | Nilai |
|-------|-------|
| **Proyek** | MetroCoop — Sistem Informasi Koperasi Simpan Pinjam Terintegrasi |
| **Versi Dokumen** | 1.0.0 |
| **Tanggal** | 16 Juli 2026 |
| **Status** | Final |
| **Klasifikasi** | Konfidensial / Internal |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Tim Proyek](#2-tim-proyek)
3. [Timeline Detail](#3-timeline-detail)
4. [Gantt Chart](#4-gantt-chart)
5. [Milestone & Jadwal Pembayaran](#5-milestone--jadwal-pembayaran)
6. [Deliverables per Fase](#6-deliverables-per-fase)
7. [Manajemen Risiko](#7-manajemen-risiko)
8. [Rencana Komunikasi](#8-rencana-komunikasi)
9. [Manajemen Perubahan](#9-manajemen-perubahan)
10. [Jaminan Kualitas](#10-jaminan-kualitas)
11. [Rencana Migrasi Data](#11-rencana-migrasi-data)
12. [Rencana Pelatihan](#12-rencana-pelatihan)
13. [Checklist Go-Live](#13-checklist-go-live)
14. [Dukungan Pasca Go-Live](#14-dukan-pasca-go-live)
15. [Lampiran](#15-lampiran)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen Rencana Proyek ini menguraikan rencana pelaksanaan implementasi penuh sistem **MetroCoop** untuk koperasi klien. Dokumen ini menjadi panduan operasional seluruh tim proyek mulai dari fase Discovery hingga berakhirnya masa Warranty Support.

### 1.2 Ruang Lingkup

Ruang lingkup implementasi mencakup seluruh modul fungsional sistem MetroCoop:

| No | Modul | Deskripsi |
|----|-------|-----------|
| 1 | Autentikasi & Otorisasi | JWT-based auth, RBAC 5 peran, session management, rate limiting |
| 2 | Manajemen Keanggotaan | Pendaftaran, validasi, status, dokumen, buku anggota digital |
| 3 | Simpanan | Pokok, wajib, sukarela, deposito dengan bunga otomatis |
| 4 | Pinjaman & Angsuran | Pengajuan, pencairan, 3 metode bunga, angsuran, denda, kolektibilitas |
| 5 | Akuntansi SAK ETAP | COA hierarkis, jurnal otomatis, buku besar, neraca saldo, laporan keuangan |
| 6 | Periode & Tutup Buku | 12 periode/tahun, open/close period, tutup buku tahunan |
| 7 | Unit Usaha — POS/Toko | Kategori, supplier, stok, penjualan multi-item, HPP, laba rugi |
| 8 | Unit Usaha — PPOB | Pulsa, listrik, PDAM, BPJS, VA bank, QRIS, e-Wallet |
| 9 | Unit Usaha — Sewa Aset | Manajemen aset, jadwal sewa, denda keterlambatan |
| 10 | Unit Usaha — Cicilan Barang | DP, tenor, bunga, angsuran bulanan |
| 11 | Unit Usaha — Ventura | Portfolio investasi, dividen, pengajuan pembiayaan |
| 12 | AI Credit Scoring | Analisis 5C berbasis Google Gemini, rekomendasi plafon |
| 13 | Landing Page CMS | Hero, fitur, tim, testimoni, pricing, kontak |
| 14 | Pengumuman & Tiket | Broadcast ke anggota, sistem tiket bantuan dengan SLA |
| 15 | Laporan & Dashboard | Dashboard per role, 20+ laporan standar, export PDF/Excel |
| 16 | Migrasi Data | ETL dari sistem legacy klien ke MetroCoop |
| 17 | Pelatihan | 5 sesi pelatihan untuk berbagai peran pengguna |
| 18 | Dukungan Pasca Go-Live | Warranty 12 minggu, bug fix, minor enhancement |

### 1.3 Asumsi

1. Klien menyediakan akses penuh ke data legacy untuk keperluan migrasi (jika ada)
2. Klien menunjuk seorang Project Sponsor yang berwenang menyetujui deliverable dan change request
3. Tim klien tersedia untuk sesi workshop, review, dan UAT sesuai jadwal yang disepakati
4. Infrastruktur cloud (Railway + PostgreSQL) disediakan dan dibayar oleh pengembang selama warranty
5. Konektivitas internet stabil tersedia di lokasi klien untuk pelatihan remote
6. Regulasi dan kebijakan internal koperasi tidak berubah selama masa implementasi
7. Data migrasi kurang dari 50.000 record (anggota + transaksi historis)
8. Customisasi UI/UX terbatas pada penyesuaian brand (logo, warna, nama koperasi)
9. Integrasi eksternal (API bank, payment gateway) menggunakan koneksi yang sudah tersedia
10. Durasi hari kerja: Senin–Jumat, 09:00–17:00 WIB

### 1.4 Dependensi

| No | Dependensi | Pihak | Dampak jika Tidak Tersedia |
|----|-----------|-------|---------------------------|
| 1 | NDA ditandatangani | Klien | Tidak bisa memulai Discovery |
| 2 | Akses data legacy untuk migrasi | Klien | Migrasi data tertunda |
| 3 | Akun Google Gemini API key | Pengembang | AI Credit Scoring tidak berfungsi |
| 4 | Akun Railway / PostgreSQL production | Pengembang | Tidak bisa deploy ke production |
| 5 | Domain name koperasi | Klien | Production URL tidak bisa dikonfigurasi |
| 6 | Approval BRD & SRS | Klien | Development tidak bisa dimulai |
| 7 | Tim klien tersedia untuk UAT | Klien | Go-live tertunda |
| 8 | Desain brand (logo, palet warna) | Klien / UI-UX | Landing page & dashboard tidak bisa final |

### 1.5 Risiko Utama

Risiko detail dibahas di [Bagian 7: Manajemen Risiko](#7-manajemen-risiko). Ringkasan risiko tinggi:

1. Keterlambatan persetujuan BRD/SRS menggeser seluruh timeline
2. Perubahan scope selama development menambah durasi dan biaya
3. Kualitas data legacy rendah, mempersulit migrasi
4. Keterbatasan pengetahuan teknis tim klien terhadap sistem baru
5. Gangguan infrastruktur cloud selama fase kritis

---

## 2. Tim Proyek

### 2.1 Struktur Tim

| No | Peran | Nama | Alokasi | Tanggung Jawab Utama |
|----|-------|------|---------|---------------------|
| 1 | **Project Manager** | [NAMA] | 50% | Perencanaan proyek, komunikasi stakeholder, manajemen risiko, budget, timeline, pelaporan ke steering committee |
| 2 | **Tech Lead** | [NAMA] | 100% | Arsitektur sistem, code review, desain database, desain API, integrasi AI, quality gate |
| 3 | **Frontend Lead** | [NAMA] | 100% | Implementasi UI/UX, design system, state management, PWA optimization, code review frontend |
| 4 | **Backend Engineer 1** | [NAMA] | 100% | Pengembangan modul: autentikasi, keanggotaan, simpanan, pinjaman, jurnal otomatis |
| 5 | **Backend Engineer 2** | [NAMA] | 100% | Pengembangan modul: akuntansi, unit usaha (POS, PPOB, sewa, cicilan, ventura), laporan |
| 6 | **Frontend Engineer 1** | [NAMA] | 100% | Komponen UI, halaman admin, dashboard, form transaksi, tabel data |
| 7 | **Frontend Engineer 2** | [NAMA] | 100% | Portal anggota, landing page CMS, notifikasi, PWA components |
| 8 | **QA Engineer** | [NAMA] | 75% | Rencana pengujian, otomasi Playwright, koordinasi UAT, bug tracking |
| 9 | **DevOps Engineer** | [NAMA] | 50% | CI/CD pipeline, deployment Railway, PostgreSQL, monitoring, backup, keamanan infra |
| 10 | **Business Analyst** | [NAMA] | 75% | Elicitation kebutuhan, BRD/SRS, user story, UAT support, dokumentasi proses bisnis |
| 11 | **UI/UX Designer** | [NAMA] | 50% | Wireframe, mockup, design system, prototipe interaktif, usability testing |

**Total Tim Inti:** 11 orang

### 2.2 Peran Pendukung (On-Call)

| No | Peran | Keterlibatan | Tanggung Jawab |
|----|-------|-------------|----------------|
| 1 | Database Administrator | Saat migrasi & tuning | Optimasi query, index strategy, backup verification |
| 2 | Security Analyst | Fase awal & akhir | Security review, penetration testing, compliance audit |
| 3 | Technical Writer | Sebelum go-live | Dokumentasi user guide, API docs, runbook operasional |

### 2.3 RACI Matrix

| Aktivitas | PM | TL | FL | BE | FE | QA | DevOps | BA | Designer |
|-----------|----|----|----|----|----|----|--------|----|----|
| Requirement Gathering | A | C | C | I | I | C | I | R | C |
| Architecture Design | A | R | C | C | I | I | C | C | I |
| UI/UX Design | A | C | C | I | I | I | I | C | R |
| Backend Development | A | A | I | R | I | C | C | I | I |
| Frontend Development | A | C | R | I | R | C | I | I | C |
| Testing | A | C | I | C | C | R | I | C | I |
| Deployment | A | A | I | I | I | C | R | I | I |
| UAT Coordination | A | C | C | C | C | R | I | R | I |
| Training | A | C | C | C | C | I | I | R | C |
| Post Go-Live Support | A | R | C | C | C | R | R | I | I |

> **Keterangan:** R = Responsible (pelaksana), A = Accountable (penanggung jawab), C = Consulted (konsultan), I = Informed (diinformasikan)

---

## 3. Timeline Detail

### 3.1 Ringkasan Fase

| Fase | Nama | Durasi | Minggu |
|------|------|--------|--------|
| Phase 0 | Discovery & Planning | 2 minggu | Week 1–2 |
| Phase 1 | Design & Architecture | 2 minggu | Week 3–4 |
| Phase 2 | Core Development Sprint 1 | 4 minggu | Week 5–8 |
| Phase 3 | Core Development Sprint 2 | 4 minggu | Week 9–12 |
| Phase 4 | Unit Usaha Sprint | 4 minggu | Week 13–16 |
| Phase 5 | AI & Polish | 2 minggu | Week 17–18 |
| Phase 6 | UAT & Go-Live | 2 minggu | Week 19–20 |
| Phase 7 | Warranty Support | 12 minggu | Week 21–32 |
| **Total** | | **32 minggu** | |

### 3.2 Phase 0: Discovery & Planning (Week 1–2)

**Tujuan:** Memastikan seluruh stakeholder memiliki pemahaman yang sama mengenai kebutuhan, ruang lingkup, dan ekspektasi proyek.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 1 | Project Kickoff Meeting — perkenalan tim, presentasi roadmap, penjelasan metodologi | PM, TL, BA, Klien | Notulensi kickoff, daftar kontak |
| Week 1 | Penandatanganan NDA (Non-Disclosure Agreement) | PM, Klien | NDA bermeterai |
| Week 1 | Requirement Workshop Hari 1 — pemetaan proses bisnis, pain points, gap analysis | BA, TL, PM, Klien | Hasil workshop, process map |
| Week 2 | Requirement Workshop Hari 2 — detail modul, aturan bisnis, edge cases | BA, TL, PM, Klien | Daftar kebutuhan terperinci |
| Week 2 | Finalisasi BRD (Business Requirements Document) | BA, PM | BRD v1.0 Final |
| Week 2 | Penandatanganan BRD oleh Project Sponsor klien | PM, Klien | BRD signed-off |
| Week 2 | Setup project management tools (Jira/Linear, Slack/Teams channel) | PM, DevOps | Workspace aktif |

### 3.3 Phase 1: Design & Architecture (Week 3–4)

**Tujuan:** Menghasilkan spesifikasi teknis lengkap yang menjadi acuan seluruh tim development.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 3 | Penyusunan SRS (Software Requirements Specification) | BA, TL | SRS v1.0 |
| Week 3 | Desain UI/UX wireframe untuk seluruh halaman utama | Designer, FL | Wireframe (Figma) |
| Week 3 | Desain design system — warna, tipografi, komponen, spacing | Designer, FL | Design system guide |
| Week 3 | Desain database schema — ERD, data dictionary, index strategy | TL, BE1, BE2 | Database design document |
| Week 4 | Desain arsitektur sistem — API contract, middleware, error handling | TL | API design document |
| Week 4 | Setup CI/CD pipeline — GitHub Actions, Railway, database staging | DevOps | Pipeline aktif, staging env |
| Week 4 | Setup development environment — monorepo, branch strategy, linting rules | TL, DevOps | Developer handbook |
| Week 4 | Desain UI/UX mockup high-fidelity untuk halaman kritis | Designer, FL | Mockup final (Figma) |
| Week 4 | Approval SRS & UI/UX mockup oleh klien | PM, Klien | SRS & mockup signed-off |

### 3.4 Phase 2: Core Development Sprint 1 (Week 5–8)

**Tujuan:** Mengembangkan modul inti — autentikasi, keanggotaan, simpanan, pinjaman — termasuk jurnal otomatis.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 5 | Modul Autentikasi & Otorisasi — JWT auth, RBAC 5 peran, middleware | BE1, FE1 | Auth module selesai |
| Week 5 | Komponen design system — button, input, table, modal, sidebar, header | FL, FE1, FE2 | Component library |
| Week 6 | Modul Keanggotaan — CRUD anggota, 4 tipe simpanan, status, dokumen | BE1, FE1 | Anggota module selesai |
| Week 6 | Dashboard Admin — KPI cards, charts, recent activity | FE1, FE2 | Admin dashboard |
| Week 7 | Modul Simpanan — setor/tarik 4 jenis, bunga otomatis, mutasi rekening | BE1, FE1 | Simpanan module selesai |
| Week 7 | Modul Pinjaman — pengajuan, pencairan, 3 metode bunga, scheduler angsuran | BE2, FE2 | Pinjaman module selesai |
| Week 8 | Integrasi jurnal otomatis dari transaksi simpanan & pinjaman | BE1, BE2 | Jurnal otomatis end-to-end |
| Week 8 | Sprint Review & Demo ke klien | Tim Proyek | Demo modul inti, feedback |

### 3.5 Phase 3: Core Development Sprint 2 (Week 9–12)

**Tujuan:** Mengembangkan modul akuntansi lengkap sesuai SAK ETAP — COA, jurnal, periode, laporan keuangan, dan tutup buku.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 9 | Modul COA (Chart of Accounts) — 6 level hierarkis, CRUD, import | BE2, FE1 | COA module selesai |
| Week 9 | Modul Jurnal — manual entry, approval workflow, posting | BE2, FE2 | Jurnal module selesai |
| Week 10 | Modul Periode Akuntansi — 12 periode, open/close period | BE2, FE1 | Periode module selesai |
| Week 10 | Buku Besar & Neraca Saldo — auto-posting, drill-down | BE2, FE2 | Buku besar & neraca saldo |
| Week 11 | Laporan Keuangan — Neraca, Laba Rugi, Arus Kas, Catatan atas LK | BE2, FE1 | Financial reports |
| Week 11 | Modul Tutup Buku — tutup bulanan, tutup tahunan, reverse jurnal | BE2, FE2 | Tutup buku module |
| Week 12 | Laporan OJK — LKP, BMPK, Kolektibilitas, KPMM | BE2, BA | OJK reporting module |
| Week 12 | Sprint Review & Demo ke klien — termasuk laporan keuangan | Tim Proyek | Demo akuntansi, feedback |

### 3.6 Phase 4: Unit Usaha Sprint (Week 13–16)

**Tujuan:** Mengembangkan seluruh modul unit usaha — POS/Toko, PPOB, Sewa Aset, Cicilan Barang, Ventura.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 13 | Modul POS/Toko — kategori, supplier, stok, penjualan multi-item, HPP FIFO | BE2, FE1 | POS module selesai |
| Week 13 | Modul PPOB — pulsa, listrik, PDAM, BPJS, integrasi API agregator | BE1, FE2 | PPOB module selesai |
| Week 14 | Modul Sewa Aset — manajemen aset, jadwal sewa, denda, pembayaran parsial | BE2, FE1 | Sewa module selesai |
| Week 14 | Modul Cicilan Barang — DP, tenor, bunga, angsuran, status lunas | BE1, FE2 | Cicilan module selesai |
| Week 15 | Modul Ventura — portfolio investasi, dividen, pipeline pembiayaan | BE2, FE1 | Ventura module selesai |
| Week 15 | Dashboard Unit Usaha — agregasi laba rugi per unit, KPI | FE1, FE2 | Unit usaha dashboard |
| Week 16 | Integrasi jurnal otomatis dari semua unit usaha | BE1, BE2 | End-to-end jurnal integration |
| Week 16 | Sprint Review & Demo ke klien — seluruh modul | Tim Proyek | Demo lengkap, feedback |

### 3.7 Phase 5: AI & Polish (Week 17–18)

**Tujuan:** Mengimplementasikan fitur AI, landing page CMS, audit trail, dan optimasi performa.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 17 | AI Credit Scoring — integrasi Gemini, analisis 5C, rekomendasi plafon | TL, BE1 | AI scoring selesai |
| Week 17 | Landing Page CMS — hero, fitur, tim, testimoni, pricing, kontak | FE2, Designer | Landing CMS selesai |
| Week 17 | Modul Pengumuman & Tiket — broadcast, tiket bantuan dengan SLA | BE1, FE1 | Pengumuman & tiket |
| Week 18 | Audit Trail — log lengkap create/update/delete dengan before/after | BE2 | Audit trail selesai |
| Week 18 | Optimasi performa — lazy loading, code splitting, query optimization | TL, FE1, FE2 | Performance baseline |
| Week 18 | Security hardening — penetration testing, dependency audit, CSP review | DevOps, TL | Security report |
| Week 18 | Final integration testing — semua modul terhubung | QA, Tim | Integration test report |

### 3.8 Phase 6: UAT & Go-Live (Week 19–20)

**Tujuan:** Pengujian penerimaan oleh pengguna, migrasi data, pelatihan, dan deployment ke production.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 19 | User Acceptance Testing (UAT) — skenario uji oleh tim klien | QA, BA, Klien | UAT sign-off |
| Week 19 | Data Migration — assessment, mapping, ETL, validasi | TL, BE1, DevOps | Data migrated & verified |
| Week 19 | Pelatihan Batch 1 — Admin (2 hari), Operator (2 hari) | BA, TL | Training completion record |
| Week 20 | Pelatihan Batch 2 — Anggota (1 hari), IT Admin (1 hari), Pengawas (1 hari) | BA, TL | Training completion record |
| Week 20 | Production Deployment — DNS, SSL, database, health check | DevOps, TL | Production live |
| Week 20 | Post Go-Live Monitoring — error tracking, performance, user feedback | Tim Proyek | Monitoring dashboard active |
| Week 20 | Go-Live Ceremony — serah terima sistem, penandatanganan BAPO | PM, Klien | BAPO signed |

### 3.9 Phase 7: Warranty Support (Week 21–32)

**Tujuan:** Dukungan teknis pasca go-live selama 12 minggu — bug fix, minor enhancement, knowledge transfer.

| Minggu | Aktivitas | Tim | Deliverable |
|--------|-----------|-----|-------------|
| Week 21–24 | Bug fix prioritas tinggi (P1 & P2), stabilisasi sistem | BE1, BE2, FE1 | Bug fix log |
| Week 21–24 | Monitoring performa, query tuning, error analysis | TL, DevOps | Performance report |
| Week 25–28 | Minor enhancement dari feedback pengguna | FE1, FE2, BE2 | Enhancement log |
| Week 25–28 | Knowledge transfer ke IT admin klien — dokumentasi operasional | TL, BA | Knowledge transfer docs |
| Week 29–32 | Penyelesaian residual bugs, final enhancement | Tim Proyek | Final bug report |
| Week 29–32 | Penyerahan seluruh dokumentasi & source code | PM, TL | Documentation package |
| Week 32 | Penutupan proyek — retrospective, penandatanganan berita serah terima | PM, Klien | Project closure report |

---

## 4. Gantt Chart

```
Minggu  : 1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32
        ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤

P0 Disc. ████ ████ ◆M1
P1 Des.       ░░░░ ████ ████ ◆
P2 Core1                 ████ ████ ████ ████ ◆M2
P3 Core2                                  ████ ████ ████ ████ ◆
P4 UnitUsaha                                               ████ ████ ████ ████ ◆M3
P5 AI/Polish                                                              ████ ████
P6 UAT/GL                                                                          ████ ████ ◆M4 ◆M5
P7 Warranty                                                                              ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ◆

Legenda:
  ████  = Fase aktif (development/delivery)
  ░░░░  = Support / warranty period
  ◆     = Milestone / deliverable sign-off
```

**Gantt Chart Detail (dengan sub-aktivitas):**

```
Minggu           : 1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32
                   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Project Kickoff    ████
NDA Signing        ████
Req. Workshop      ████ ████
BRD Sign-off            ████ ◆
SRS Development         ████ ████
UI/UX Wireframe         ████ ████
Design System           ████ ████
DB Schema Design        ████ ████
CI/CD Setup                  ████
SRS Approval                 ████ ◆
Auth Module                       ████
Component Library                 ████ ████
Anggota Module                        ████
Admin Dashboard                       ████
Simpanan Module                           ████
Pinjaman Module                           ████
Jurnal Integration                              ████
Core Demo ◆M2                                        ████
COA Module                                                ████
Jurnal Module                                             ████
Periode Module                                                  ████
Buku Besar / Neraca                                              ████
Laporan Keuangan                                                       ████
Tutup Buku                                                            ████
OJK Reporting                                                              ████
Accounting Demo ◆M3                                                            ████
POS/Toko Module                                                                     ████
PPOB Module                                                                          ████
Sewa Aset Module                                                                          ████
Cicilan Module                                                                             ████
Ventura Module                                                                                  ████
Unit Usaha Dashboard                                                                           ████
Unit Usaha Integration                                                                                ████
Unit Usaha Demo ◆M3                                                                                        ████
AI Credit Scoring                                                                                                  ████
Landing Page CMS                                                                                                   ████
Pengumuman & Tiket                                                                                                  ████
Audit Trail                                                                                                              ████
Performance Optimization                                                                                                ████
Security Hardening                                                                                                       ████
UAT                                                                                                                              ████
Data Migration                                                                                                                   ████
Training Admin                                                                                                                   ████
Training Operator                                                                                                                ████
Training Anggota/IT/Pengawas                                                                                                          ████
Production Deploy                                                                                                                        ████
UAT Sign-off ◆M4                                                                                                                        ████
Go-Live ◆M5                                                                                                                             ████
Warranty Support (Bug Fix)                                                                                                                       ░░░░ ░░░░ ░░░░ ░░░░
Warranty Support (Enhancement)                                                                                                                            ░░░░ ░░░░ ░░░░ ░░░░
Knowledge Transfer                                                                                                                                                ░░░░ ░░░░
Final Documentation                                                                                                                                                     ░░░░
Project Closure ◆                                                                                                                                                    ░░░░ ◆
```

---

## 5. Milestone & Jadwal Pembayaran

### 5.1 Milestone

| Milestone | Nama | Trigger | Persentase | Nilai Ilustratif | Target Pencapaian |
|-----------|------|---------|------------|------------------|--------------------|
| **M1** | Kontrak & Discovery | NDA + BRD ditandatangani | 20% | Rp 150.000.000 | Week 2 |
| **M2** | Core Modules Ready | Modul Auth, Anggota, Simpanan, Pinjaman berfungsi & demo | 25% | Rp 187.500.000 | Week 8 |
| **M3** | Akuntansi & Unit Usaha | Modul akuntansi SAK ETAP + seluruh unit usaha berfungsi | 25% | Rp 187.500.000 | Week 16 |
| **M4** | UAT Sign-off | User acceptance test lulus, staging disetujui klien | 20% | Rp 150.000.000 | Week 19 |
| **M5** | Production Go-Live | Sistem production live, health check green, pelatihan selesai | 10% | Rp 75.000.000 | Week 20 |
| | **Total** | | **100%** | **Rp 750.000.000** | |

> **Catatan:** Nilai di atas bersifat ilustratif. Harga final disesuaikan dengan ruang lingkup, tingkat customisasi, dan SLA dukungan yang disepakati dalam kontrak.

### 5.2 Jadwal Pembayaran

| Milestone | Syarat Pembayaran | Tempo Pembayaran |
|-----------|-------------------|------------------|
| M1 | Invoice + NDA & BRD signed | 7 hari kalender sejak invoice |
| M2 | Invoice + demo report + client approval | 14 hari kalender sejak invoice |
| M3 | Invoice + demo report + client approval | 14 hari kalender sejak invoice |
| M4 | Invoice + UAT sign-off document | 14 hari kalender sejak invoice |
| M5 | Invoice + BAPO signed + production URL live | 7 hari kalender sejak invoice |

### 5.3 Ketentuan Pembayaran Tambahan

- **Change Request (CR):** Pembayaran terpisah setelah CR disetujui, dibayarkan 50% saat approval, 50% saat delivery
- **Extend Warranty:** Dibayarkan di muka per bulan setelah 12 minggu warranty standar berakhir
- **On-site Training:** Biaya travel & akomodasi ditanggung klien, diinvois dengan bukti

---

## 6. Deliverables per Fase

| Fase | Deliverables | Format | Penerima |
|------|-------------|--------|----------|
| **Phase 0** | NDA bermeterai | Dokumen hukum | PM, Klien |
| | Notulensi kickoff meeting | Dokumen + rekaman | Seluruh tim |
| | BRD (Business Requirements Document) v1.0 | Markdown / PDF | PM, Klien |
| **Phase 1** | SRS (Software Requirements Specification) v1.0 | Markdown / PDF | Tim dev, Klien |
| | Wireframe seluruh halaman (Figma) | Figma link | Tim dev, Designer |
| | Mockup high-fidelity (Figma) | Figma link | Tim dev, Klien |
| | Design system guide | Markdown / Figma | Tim frontend |
| | Database schema (ERD + data dictionary) | Diagram + Dokumen | Tim backend |
| | CI/CD pipeline aktif di staging | Working environment | Tim dev |
| **Phase 2** | Modul Autentikasi & Otorisasi | Deployed (staging) | Klien (demo) |
| | Modul Keanggotaan | Deployed (staging) | Klien (demo) |
| | Modul Simpanan | Deployed (staging) | Klien (demo) |
| | Modul Pinjaman & Angsuran | Deployed (staging) | Klien (demo) |
| | Jurnal otomatis end-to-end | Deployed (staging) | Klien (demo) |
| | Admin Dashboard | Deployed (staging) | Klien (demo) |
| | Component Library | Source code | Tim frontend |
| **Phase 3** | Modul COA | Deployed (staging) | Klien (demo) |
| | Modul Jurnal & Approval | Deployed (staging) | Klien (demo) |
| | Modul Periode Akuntansi | Deployed (staging) | Klien (demo) |
| | Buku Besar & Neraca Saldo | Deployed (staging) | Klien (demo) |
| | Laporan Keuangan (Neraca, Laba Rugi, Arus Kas) | Deployed (staging) | Klien (demo) |
| | Modul Tutup Buku | Deployed (staging) | Klien (demo) |
| | Laporan OJK (LKP, BMPK, Kolektibilitas) | Deployed (staging) | Klien (demo) |
| **Phase 4** | Modul POS/Toko | Deployed (staging) | Klien (demo) |
| | Modul PPOB | Deployed (staging) | Klien (demo) |
| | Modul Sewa Aset | Deployed (staging) | Klien (demo) |
| | Modul Cicilan Barang | Deployed (staging) | Klien (demo) |
| | Modul Ventura & Investasi | Deployed (staging) | Klien (demo) |
| | Dashboard Unit Usaha | Deployed (staging) | Klien (demo) |
| **Phase 5** | AI Credit Scoring (Gemini) | Deployed (staging) | Klien (demo) |
| | Landing Page CMS | Deployed (staging) | Klien (demo) |
| | Modul Pengumuman & Tiket | Deployed (staging) | Klien (demo) |
| | Audit Trail module | Deployed (staging) | Klien (demo) |
| | Performance benchmark report | Dokumen | Tim dev, Klien |
| | Security audit report | Dokumen | Tim dev, Klien |
| **Phase 6** | UAT sign-off document | Dokumen (signed) | PM, Klien |
| | Data migration report | Dokumen + log | PM, Klien |
| | Training completion records | Dokumen (signed) | PM, Klien |
| | Production deployment — live & verified | Working environment | Klien |
| | BAPO (Berita Acara Penerimaan Operasional) | Dokumen (signed) | PM, Klien |
| | User guide (admin, operator, anggota) | PDF / Wiki | Klien |
| **Phase 7** | Bug fix log & resolution report | Dokumen | PM, Klien |
| | Enhancement log | Dokumen | PM, Klien |
| | Knowledge transfer documentation | Dokumen + video | Klien |
| | Source code (lisensi perpetual) | Git repository | Klien |
| | API documentation | Markdown / Swagger | Klien |
| | Runbook operasional | PDF / Wiki | Klien |
| | Project closure report | Dokumen (signed) | PM, Klien |

---

## 7. Manajemen Risiko

### 7.1 Risk Register

| No | Risiko | Probabilitas | Dampak | Skor | Mitigation | Owner |
|----|--------|-------------|--------|------|------------|-------|
| R1 | Keterlambatan persetujuan BRD/SRS oleh klien | Tinggi | Tinggi | 🔴 9 | Tetapkan SLA persetujuan dalam kontrak (3 hari kerja). Siapkan draft alternatif untuk percepat review. PM follow-up harian. | PM |
| R2 | Perubahan scope (change request) berlebihan selama development | Sedang | Tinggi | 🟠 8 | Proses CR ketat: impact assessment 3 hari, approval dari PM + Sponsor. Buffer timeline 10% untuk CR. Batasi CR fase berjalan ke fase berikutnya. | PM, BA |
| R3 | Kualitas data legacy dari koperasi rendah (duplikasi, field kosong, format tidak konsisten) | Sedang | Tinggi | 🟠 8 | Mulai assessment data di Phase 0. Buat script validasi & cleansing. Sediakan buffer 1 minggu untuk data cleaning. Libatkan admin koperasi dalam verifikasi. | TL, BA |
| R4 | Turnover atau ketersediaan tim klien untuk UAT dan pelatihan | Rendah | Tinggi | 🟡 6 | Jadwalkan UAT & training jauh hari (minimal 2 minggu sebelumnya). Siapkan backup user untuk UAT. Rekam sesi pelatihan untuk referensi. | PM |
| R5 | Gangguan infrastruktur cloud (Railway downtime, database corruption) | Rendah | Tinggi | 🟡 6 | Setup automated backup harian + point-in-time recovery. Monitoring 24/7 via UptimeRobot. Health check endpoint aktif. Siapkan failover plan. | DevOps |
| R6 | Bug kritis ditemukan saat UAT yang mengubah timeline | Sedang | Sedang | 🟠 6 | Jalankan integration testing sebelum UAT. Defect triage harian selama UAT. Buffer 3 hari untuk critical bug fix. Prioritaskan P1/P2 segera, P3/P4 ke warranty. | QA, TL |
| R7 | Resistensi pengguna terhadap perubahan dari sistem manual ke sistem digital | Sedang | Sedang | 🟠 6 | Libatkan pengguna sejak Phase 0 (workshop). Tunjukkan quick win & manfaat langsung. Sediakan cheat sheet & video tutorial. Champion user di koperasi sebagai ambassador. | BA, PM |

### 7.2 Risk Response Strategy

| Strategi | Penerapan |
|----------|-----------|
| **Avoid** | Hindari risiko dengan menghilangkan penyebab — misalnya freeze scope setelah SRS approval |
| **Mitigate** | Kurangi probabilitas atau dampak — misalnya backup data berulang kali selama migrasi |
| **Transfer** | Pindahkan risiko ke pihak lain — misalnya asuransi infrastruktur cloud, SLA dari provider |
| **Accept** | Terima risiko dengan contingency plan — misalnya buffer timeline untuk minor delays |

### 7.3 Monitoring Risiko

- Review risiko dilakukan setiap **Weekly Status Call**
- Risk register diperbarui setiap **2 minggu** atau saat ada perubahan signifikan
- Setiap risiko dengan skor ≥ 8 (merah) dilaporkan ke **Steering Committee** bulanan

---

## 8. Rencana Komunikasi

### 8.1 Jadwal Komunikasi Rutin

| No | Aktivitas | Frekuensi | Peserta | Durasi | Format |
|----|-----------|-----------|---------|--------|--------|
| 1 | Daily Standup (selama sprint) | Harian (Senin–Jumat) | Tim dev (TL, FL, BE, FE, QA) | 15 menit | Slack/Teams huddle |
| 2 | Weekly Status Call | Mingguan (Senin) | PM, TL, BA, PM Klien | 30 menit | Zoom/Meet |
| 3 | Sprint Review & Demo | Akhir sprint (2 mingguan) | Seluruh tim + klien | 60 menit | Zoom/Meet + presentasi |
| 4 | Sprint Retrospective | Akhir sprint (2 mingguan) | Tim internal | 45 menit | Zoom/Meet |
| 5 | Steering Committee | Bulanan | PM, TL, Klien Sponsor, Direksi klien | 60 menit | Presentasi formal |
| 6 | Bug Triage | Harian (selama UAT) | QA, TL, BE, FE | 15 menit | Slack thread |
| 7 | Architecture Review | 2 mingguan | TL, DevOps, BE | 60 menit | Zoom/Meet |

### 8.2 Channel Komunikasi

| Channel | Platform | Tujuan |
|---------|----------|--------|
| **#general** | Slack / Microsoft Teams | Pengumuman umum, informasi proyek |
| **#dev-backend** | Slack / Microsoft Teams | Diskusi teknis backend, code review, PR |
| **#dev-frontend** | Slack / Microsoft Teams | Diskusi teknis frontend, component review |
| **#design** | Slack / Microsoft Teams | Review desain, feedback UI/UX |
| **#qa-testing** | Slack / Microsoft Teams | Bug reports, test results, UAT coordination |
| **#devops-infra** | Slack / Microsoft Teams | Deployment, monitoring, infra issues |
| **#client-communication** | Slack / Microsoft Teams (shared) | Komunikasi formal dengan klien |
| **Email** | Gmail / Outlook | Dokumen formal, kontrak, invoice |
| **Project Board** | Jira / Linear | Task management, sprint tracking |

### 8.3 Escalation Path

| Level | Situasi | Escalated To | Response Time |
|-------|---------|-------------|---------------|
| **Level 1** | Bug P3/P4, pertanyaan teknis minor | Tim dev (via Slack) | < 4 jam kerja |
| **Level 2** | Bug P1/P2, blocker development | Tech Lead + PM | < 2 jam kerja |
| **Level 3** | Perubahan scope, risiko proyek, keterlambatan > 3 hari | PM + Project Sponsor (klien) | < 1 hari kerja |
| **Level 4** | Krisis (security breach, data loss, sistem down) | PM + TL + DevOps + Sponsor | < 30 menit |

### 8.4 Template Laporan

**Weekly Status Report (contoh struktur):**

```
1. Ringkasan Minggu Ini
   - Yang diselesaikan: [daftar]
   - Yang sedang dikerjakan: [daftar]
   - Yang terhambat: [daftar + alasan]

2. Progress vs Rencana
   - Schedule variance: [hari]
   - Scope status: [on track / at risk]

3. Risiko & Isu Terkini
   - [risiko/isu + dampak + mitigasi]

4. Rencana Minggu Depan
   - [daftar deliverable]

5. Butuh Keputusan
   - [jika ada]
```

---

## 9. Manajemen Perubahan

### 9.1 Definisi Change Request (CR)

Change Request adalah setiap perubahan pada ruang lingkup, fitur, jadwal, atau anggaran yang telah disepakati dalam BRD/SRS. CR bisa berasal dari kedua belah pihak (pengembang maupun klien).

### 9.2 Jenis Perubahan

| Kategori | Contoh | Proses |
|----------|--------|--------|
| **Minor** | Ubah label tombol, tambah kolom di tabel, warna different | Catatan di Slack, approval verbal dari TL |
| **Moderate** | Tambah sub-modul, ubah workflow approval, tambah filter laporan | CR form tertulis, impact assessment, approval PM |
| **Major** | Tambah modul baru, integrasi bank baru, perubahan arsitektur | CR form + RFC, approval Steering Committee |

### 9.3 Proses Change Request

```
┌──────────────────────────────────────────────────────────────────┐
│                    PROSES CHANGE REQUEST                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Submit CR                                                     │
│     └─ Isi CR Form: deskripsi, alasan, prioritas                  │
│                                                                   │
│  2. Log & Triage                                                  │
│     └─ PM log ke CR Register, kategorikan (minor/moderate/major)  │
│                                                                   │
│  3. Impact Assessment (3 hari kerja untuk moderate/major)         │
│     ├─ Estimasi effort (hari developer)                           │
│     ├─ Dampak ke timeline (schedule impact)                       │
│     ├─ Dampak ke biaya (cost impact)                              │
│     └─ Risiko teknis                                              │
│                                                                   │
│  4. Review & Approval                                             │
│     ├─ Minor: TL approval                                         │
│     ├─ Moderate: PM + Sponsor approval                            │
│     └─ Major: Steering Committee approval                         │
│                                                                   │
│  5. Implementasi                                                  │
│     └─ CR dimasukkan ke sprint berikutnya atau fase terpisah      │
│                                                                   │
│  6. Verifikasi                                                    │
│     └─ QA test, PM review, klien accept                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 9.4 CR Form Template

| Field | Isian |
|-------|-------|
| CR Number | CR-YYYY-NNN |
| Date Submitted | |
| Submitted By | |
| Category | Minor / Moderate / Major |
| Description | |
| Business Justification | |
| Impact — Effort | [x] hari developer |
| Impact — Timeline | [x] hari tambahan |
| Impact — Cost | Rp [x] (jika berlaku) |
| Impact — Risk | |
| Approved By | |
| Approval Date | |
| Status | Submitted / In Assessment / Approved / Rejected / Implemented / Verified |

### 9.5 Batasan Perubahan

- **Freeze Scope:** Setelah SRS approval (akhir Phase 1), perubahan major tidak diterima kecuali melalui Steering Committee
- **Freeze Code:** 5 hari sebelum UAT dimulai, code freeze diterapkan — hanya bug fix yang diperbolehkan
- **CR Backlog:** CR yang ditolak dicatat dan bisa dipertimbangkan untuk fase enhancement pasca-warranty

---

## 10. Jaminan Kualitas

### 10.1 Strategi Pengujian

| Jenis Pengujian | Tools | Dilakukan Oleh | Frekuensi | Cakupan |
|----------------|-------|---------------|-----------|---------|
| **Unit Testing** | Vitest | Backend & Frontend Engineers | Setiap commit (CI) | Fungsi individual, validasi, kalkulasi bisnis |
| **Integration Testing** | Vitest + supertest | Backend Engineers | Setiap PR | API endpoint, integrasi modul, jurnal otomatis |
| **End-to-End Testing** | Playwright | QA Engineer | Setiap PR ke main | Alur transaksi lengkap (simpanan → jurnal → laporan) |
| **Manual Exploratory Testing** | Browser | QA Engineer | Setiap sprint review | UI/UX, edge cases, usability |
| **User Acceptance Testing (UAT)** | Manual + skenario | Tim klien + BA | Week 19 | Seluruh alur bisnis koperasi |
| **Performance Testing** | k6 / Lighthouse | DevOps + TL | Week 18 | Response time, concurrent users, database query |
| **Security Testing** | OWASP ZAP, npm audit | DevOps + Security Analyst | Week 18 + sebelum go-live | OWASP Top 10, dependency vulnerabilities, auth bypass |

### 10.2 Quality Gates per Fase

| Fase | Quality Gate | Kriteria Kelulusan |
|------|-------------|-------------------|
| **Phase 0** | BRD Approval | BRD ditandatangani oleh Sponsor klien |
| **Phase 1** | SRS & Design Approval | SRS & mockup ditandatangani oleh klien; ERD review oleh TL |
| **Phase 2** | Core Module Demo | Semua modul inti berfungsi; unit test > 80%; E2E test pass untuk critical path |
| **Phase 3** | Accounting Demo | COA, jurnal, laporan keuangan akurat; tutup buku berfungsi; match dengan data test |
| **Phase 4** | Unit Usaha Demo | Semua unit usaha berfungsi; jurnal integrasi ke COA; laporan laba rugi per unit |
| **Phase 5** | AI & Polish Ready | AI scoring berfungsi; landing CMS live; performance baseline tercapai; security pass |
| **Phase 6** | UAT Sign-off | 0 critical/high bug terbuka; UAT scenarios > 95% pass; klien approve staging |

### 10.3 Definition of Done (DoD)

Sebuah user story dianggap **done** ketika:

1. ✅ Code ditulis dan berfungsi sesuai spesifikasi
2. ✅ TypeScript compilation tanpa error (`tsc --noEmit` pass)
3. ✅ Build production sukses (`vite build` + `esbuild` pass)
4. ✅ Unit test ditulis dan pass (coverage > 80% untuk modul baru)
5. ✅ Integration test pass untuk API endpoints terkait
6. ✅ E2E test pass untuk user flow utama (jika applicable)
7. ✅ Code review disetujui minimal 1 reviewer
8. ✅ Tidak ada security vulnerability baru (npm audit clean)
9. ✅ Responsive di desktop (1280px+) dan mobile (375px+)
10. ✅ Accessibility: keyboard navigable, aria labels untuk interactive elements
11. ✅ Error handling untuk semua edge cases
12. ✅ Audit trail tercatat untuk setiap operasi create/update/delete

### 10.4 Bug Severity Definition

| Severity | Definisi | Contoh | SLA Fix |
|----------|---------|--------|---------|
| **Critical (P1)** | Sistem crash, data loss, security breach, semua pengguna terdampak | Login gagal total, transaksi kehilangan data | < 4 jam |
| **High (P2)** | Fitur utama error, blokir operasional harian, workaround tidak ada | Pembayaran simpanan gagal, jurnal tidak ter-generate | < 1 hari kerja |
| **Medium (P3)** | Fitur error tapi ada workaround, UI glitch, laporan salah perhitungan | Export PDF format aneh, tooltip salah teks | < 3 hari kerja |
| **Low (P4)** | Enhancement, kosmetik, dokumentasi, tidak mempengaruhi fungsionalitas | Warna tombol salah, spasi di footer | Next sprint / warranty |

### 10.5 Code Quality Standards

- **TypeScript Strict Mode:** Seluruh codebase menggunakan `strict: true`
- **Linting:** ESLint dengan konfigurasi proyek, zero warning di production build
- **Formatting:** Prettier dengan config `.prettierrc`
- **Commit Convention:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **Branch Strategy:** Trunk-based development dengan feature branches singkat (< 3 hari)
- **Review Requirement:** Minimal 1 approval sebelum merge ke `main`

---

## 11. Rencana Migrasi Data

### 11.1 Langkah Migrasi

| No | Langkah | Durasi | Aktivitas | Tim |
|----|---------|--------|-----------|-----|
| 1 | **Assessment** | 2 hari | Identifikasi sumber data, format, volume, kualitas, potensi masalah | TL, BA, BE1 |
| 2 | **Mapping** | 3 hari | Buat mapping dari kolom sumber ke tabel/field MetroCoop; identifikasi transformasi | TL, BA, BE1 |
| 3 | **Development ETL** | 5 hari | Buat script migrasi (Node.js/Python), transformasi data, validasi bisnis rules | BE1, BE2 |
| 4 | **Test Migration** | 2 hari | Jalankan ETL ke database staging, validasi hasil, hitung reconciliation | BE1, QA |
| 5 | **Validation** | 2 hari | Verifikasi oleh admin koperasi: jumlah anggota, saldo, transaksi, laporan | BA, Klien |
| 6 | **UAT Migration** | 2 hari | User test dengan data migrated, pastikan semua fitur berfungsi dengan data nyata | QA, Klien |
| 7 | **Cutover** | 1 hari | Migration final ke production, freeze sistem lama, switch DNS | TL, DevOps |

**Total estimasi:** 17 hari kerja (dimulai Week 18, selesai sebelum UAT Week 19)

### 11.2 Data yang Dimigrasikan

| No | Data | Sumber | Target MetroCoop | Catatan |
|----|------|--------|------------------|---------|
| 1 | Data anggota | Excel / DB lama | Tabel `anggota` | Validasi NIK unique |
| 2 | Saldo simpanan | Excel / DB lama | Tabel `simpanan_saldo` | Reconcile dengan laporan |
| 3 | Data pinjaman aktif | Excel / DB lama | Tabel `pinjaman` | Hanya pinjaman belum lunas |
| 4 | Riwayat angsuran | Excel / DB lama | Tabel `angsuran` | 2 tahun terakhir |
| 5 | COA & saldo awal | Laporan keuangan | Tabel `coa` + `jurnal_entries` | Periode awal implementasi |
| 6 | Data produk unit usaha | Excel | Tabel terkait POS, sewa, dll | Jika applicable |
| 7 | Pengumuman historis | Manual entry | Tabel `pengumuman` | Opsional |

### 11.3 Validasi Migrasi

| Metode | Kriteria |
|--------|----------|
| **Count Reconciliation** | Jumlah record sumber = jumlah record target (±0) |
| **Sum Reconciliation** | Total saldo simpanan sumber = total saldo target (±Rp 1) |
| **Spot Check** | 10% anggota random dicek manual datanya |
| **Cross-Module Check** | Saldo simpanan anggota di portal anggota cocok dengan admin |
| **Report Comparison** | Laporan keuangan dari sistem lama vs sistem baru match |
| **User Verification** | Admin koperasi verifikasi data 5 anggota sample secara menyeluruh |

### 11.4 Rollback Plan

Jika migrasi gagal atau data tidak valid:
1. Sistem production menggunakan **data snapshot** sebelum migrasi
2. Sistem lama tetap aktif sebagai fallback selama 7 hari pasca cutover
3. Rollback script tersedia untuk menghapus data migrated dan mengembalikan state
4. Decision to rollback harus diambil dalam **4 jam** pasca cutover

---

## 12. Rencana Pelatihan

### 12.1 Jadwal Pelatihan

| No | Kelas Pelatihan | Durasi | Peserta | Jadwal | Metode |
|----|----------------|--------|---------|--------|--------|
| 1 | **Pelatihan Admin Koperasi** | 2 hari (16 jam) | Admin utama, sekretaris, bendahara | Week 19 (Hari 1–2) | Remote (Zoom/Meet) + recording |
| 2 | **Pelatihan Operator/CS** | 2 hari (16 jam) | Operator teller, customer service | Week 19 (Hari 3–4) | Remote (Zoom/Meet) + recording |
| 3 | **Pelatihan Anggota/Pengurus** | 1 hari (8 jam) | Pengurus koperasi, anggota perwakilan | Week 20 (Hari 1) | Remote (Zoom/Meet) + recording |
| 4 | **Pelatihan IT Admin** | 1 hari (8 jam) | Staf IT koperasi | Week 20 (Hari 2) | Remote (Zoom/Meet) + hands-on |
| 5 | **Pelatihan Pengawas** | 1 hari (8 jam) | Pengawas koperasi | Week 20 (Hari 3) | Remote (Zoom/Meet) + hands-on |

### 12.2 Materi Pelatihan

#### Kelas 1: Admin Koperasi (2 Hari)

| Sesi | Topik | Durasi | Format |
|------|-------|--------|--------|
| Day 1 — Sesi 1 | Login, dashboard, navigasi sistem | 2 jam | Demo + hands-on |
| Day 1 — Sesi 2 | Manajemen keanggotaan: daftar, edit, status, dokumen | 2 jam | Hands-on |
| Day 1 — Sesi 3 | Konfigurasi sistem: COA, parameter bunga, rate denda | 2 jam | Hands-on |
| Day 1 — Sesi 4 | Q&A dan praktik mandiri | 2 jam | Self-practice |
| Day 2 — Sesi 1 | Transaksi simpanan & pinjaman (as operator) | 2 jam | Hands-on |
| Day 2 — Sesi 2 | Laporan keuangan: generate, export, interpreting | 2 jam | Demo + hands-on |
| Day 2 — Sesi 3 | Tutup buku, periode akuntansi, jurnal manual | 2 jam | Hands-on |
| Day 2 — Sesi 4 | User management, backup, troubleshooting dasar | 2 jam | Demo + hands-on |

#### Kelas 2: Operator/Customer Service (2 Hari)

| Sesi | Topik | Durasi | Format |
|------|-------|--------|--------|
| Day 1 — Sesi 1 | Login, dashboard, navigasi | 2 jam | Demo + hands-on |
| Day 1 — Sesi 2 | Layanan simpanan: setor, tarik, cek saldo, mutasi | 2 jam | Hands-on |
| Day 1 — Sesi 3 | Layanan pinjaman: pengajuan, pencairan, cek angsuran | 2 jam | Hands-on |
| Day 1 — Sesi 4 | Q&A dan praktik transaksi | 2 jam | Self-practice |
| Day 2 — Sesi 1 | Unit usaha: POS (kasir), PPOB, sewa | 2 jam | Hands-on |
| Day 2 — Sesi 2 | Tiket bantuan & pengumuman | 1 jam | Hands-on |
| Day 2 — Sesi 3 | Cetak bukti transaksi, export, pencarian data | 1 jam | Hands-on |
| Day 2 — Sesi 4 | Simulasi transaksi harian (end-to-end) | 2 jam | Simulasi |

#### Kelas 3: Pengurus & Anggota (1 Hari)

| Sesi | Topik | Durasi | Format |
|------|-------|--------|--------|
| Sesi 1 | Portal anggota: login, dashboard, profil | 2 jam | Demo + hands-on |
| Sesi 2 | Cek simpanan, pinjaman, pengumuman | 2 jam | Hands-on |
| Sesi 3 | Pengajuan pinjaman online, tiket bantuan | 2 jam | Hands-on |
| Sesi 4 | Q&A dan praktik mandiri | 2 jam | Self-practice |

#### Kelas 4: IT Admin (1 Hari)

| Sesi | Topik | Durasi | Format |
|------|-------|--------|--------|
| Sesi 1 | Arsitektur sistem, akses server, environment variables | 2 jam | Presentasi + hands-on |
| Sesi 2 | Database management: backup, restore, monitoring | 2 jam | Hands-on |
| Sesi 3 | Deployment pipeline, update, rollback procedure | 2 jam | Hands-on |
| Sesi 4 | Troubleshooting, log analysis, escalation procedure | 2 jam | Presentasi + simulasi |

#### Kelas 5: Pengawas (1 Hari)

| Sesi | Topik | Durasi | Format |
|------|-------|--------|--------|
| Sesi 1 | Login & akses pengawas (read-only), dashboard | 2 jam | Demo + hands-on |
| Sesi 2 | Audit trail: melihat log transaksi, perubahan data | 2 jam | Hands-on |
| Sesi 3 | Laporan untuk pengawas: rekap, analitik, export | 2 jam | Hands-on |
| Sesi 4 | Q&A, simulasi audit | 2 jam | Simulasi |

### 12.3 Materi Pendukung

| Materi | Format | Penerima |
|--------|--------|----------|
| User Guide — Admin | PDF (50+ halaman) | Admin koperasi |
| User Guide — Operator | PDF (40+ halaman) | Operator/CS |
| User Guide — Anggota | PDF (20+ halaman) | Anggota koperasi |
| Quick Reference Card | 1-halaman laminasi | Seluruh pengguna |
| Video Tutorial (10 menit per topik) | MP4 / YouTube unlisted | Seluruh pengguna |
| FAQ Document | PDF / Wiki | Seluruh pengguna |
| Cheat Sheet — Keyboard Shortcuts | PDF 1-halaman | Operator, Admin |

### 12.4 Evaluasi Pelatihan

- **Post-training quiz** (10 soal pilihan ganda) untuk setiap kelas
- **Practical exam**: setiap peserta harus berhasil menyelesaikan 3 transaksi end-to-end
- **Training completion certificate** ditandatangani oleh PM dan klien
- **Feedback form** dikumpulkan untuk evaluasi & perbaikan materi

---

## 13. Checklist Go-Live

### 13.1 Checklist Persiapan Production Deployment

| No | Item | Status | Diverifikasi Oleh | Catatan |
|----|------|--------|-------------------|---------|
| 1 | Seluruh modul fungsional telah lulus UAT | ☐ | QA, Klien | UAT sign-off document |
| 2 | 0 bug Critical (P1) dan High (P2) terbuka | ☐ | QA | Bug tracker verified |
| 3 | Database production siap (PostgreSQL, schema migrated) | ☐ | DevOps, TL | Schema v-final applied |
| 4 | Environment variables production dikonfigurasi | ☐ | DevOps | Secrets di Railway verified |
| 5 | SSL certificate aktif untuk domain produksi | ☐ | DevOps | HTTPS valid, no mixed content |
| 6 | DNS record dikonfigurasi ke production | ☐ | DevOps | nslookup / dig verified |
| 7 | Backup automated & tested (point-in-time recovery) | ☐ | DevOps | Restore test successful |
| 8 | Monitoring & alerting aktif (UptimeRobot / Railway metrics) | ☐ | DevOps | Alert ke Slack/email tested |
| 9 | Rate limiting & security headers aktif | ☐ | TL, DevOps | Helmet config verified |
| 10 | CORS policy production dikonfigurasi | ☐ | TL | Hanya domain klien yang diizinkan |
| 11 | Data migration selesai & validated | ☐ | TL, Klien | Migration report signed |
| 12 | Seed data production (COA standar, parameter default) | ☐ | BA, TL | Referenced in BRD |
| 13 | Feature flags dikonfigurasi sesuai kebutuhan klien | ☐ | BA, TL | Match with agreed scope |
| 14 | User accounts admin & operator dibuat | ☐ | TL | Akun test & production |
| 15 | Pelatihan seluruh pengguna selesai | ☐ | BA, PM | Training completion records |
| 16 | User guide & documentation tersedia | ☐ | BA | PDF / Wiki accessible |
| 17 | Rollback plan tersedia & teruji | ☐ | DevOps, TL | Rollback procedure documented |
| 18 | Health check endpoint berfungsi | ☐ | DevOps | /api/health returns 200 |
| 19 | Error tracking aktif (Sentry / console logging) | ☐ | DevOps, TL | Error notification tested |
| 20 | BAPO (Berita Acara Penerimaan Operasional) siap ditandatangani | ☐ | PM, Klien | Document prepared |

### 13.2 Go-Live Sequence

```
┌─ H-3 hari: Code freeze, final smoke test
│
├─ H-2 hari: Database migration dry run di production (with backup)
│
├─ H-1 hari: Pre-deployment checklist review, stakeholder sign-off
│
├─ H-0 (Go-Live Day):
│   ├─ 06:00 — Final backup production database
│   ├─ 07:00 — Deploy ke production (zero-downtime)
│   ├─ 07:30 — Smoke test: login, transaksi simulasi, health check
│   ├─ 08:00 — Switch DNS ke production (if applicable)
│   ├─ 08:30 — Monitor error logs & performance (1 jam pertama kritis)
│   ├─ 09:00 — Informasikan klien: sistem live & ready
│   ├─ 12:00 — Midday health check
│   └─ 17:00 — End of day status: green/yellow/red
│
├─ H+1 hari: Morning health check, review user feedback
│
├─ H+3 hari: First week status report
│
└─ H+7 hari: Week 1 retrospective, adjust monitoring thresholds
```

### 13.3 Post Go-Live Monitoring (7 Hari Pertama)

| Metrik | Target | Monitoring |
|--------|--------|-----------|
| Uptime | ≥ 99.5% | UptimeRobot, Railway dashboard |
| Response time (API) | < 500ms (p95) | Railway metrics |
| Error rate | < 1% | Error logging |
| Database connections | < 80% pool | PostgreSQL monitoring |
| User activity | Tracking adoption | Application logs |
| Bug reports | Categorize & triage | Slack #qa-testing |

---

## 14. Dukungan Pasca Go-Live

### 14.1 Masa Warranty

| Parameter | Nilai |
|-----------|-------|
| Durasi | 12 minggu (Week 21–32) |
| Jam Kerja | Senin–Jumat, 09:00–17:00 WIB |
| Tim Dukungan | Tech Lead, Backend Engineers (2), Frontend Engineers (2), QA, DevOps |

### 14.2 SLA Dukungan (Tiers)

| Severity | Definisi | Response Time | Resolution Target | Contoh |
|----------|---------|---------------|-------------------|--------|
| **Critical (P1)** | Sistem down, data loss, security breach | < 1 jam | < 4 jam | Database error, login crash, data leak |
| **High (P2)** | Fitur utama error, blokir operasional | < 4 jam | < 1 hari kerja | Transaksi gagal, laporan salah, jurnal missing |
| **Medium (P3)** | Bug non-kritis, ada workaround | < 1 hari kerja | < 3 hari kerja | UI glitch, export format salah, tooltip salah |
| **Low (P4)** | Enhancement, kosmetik | < 3 hari kerja | Next sprint | Warna tombol salah, spasi di footer |

### 14.3 Escalation Path (Pasca Go-Live)

```
Level 1: Tim Dukungan Internal
├─ Tim dev menerima laporan via Slack #support-production
├─ Triage & kategorikan severity dalam < 30 menit
└─ Mulai investigasi & fix

Level 2: Tech Lead Intervention
├─ Dipicu jika: P1 tidak ter-resolve dalam 2 jam, P2 tidak ter-resolve dalam 8 jam
├─ TL turun tangan langsung, assign resource tambahan
└─ PM diinformasikan

Level 3: Management Escalation
├─ Dipicu jika: P1 tidak ter-resolve dalam 4 jam, pola bug berulang
├─ PM + Sponsor klien diinformasikan
└─ Rapat darurat dalam 1 jam

Level 4: Crisis Management
├─ Dipicu jika: security breach, data loss, sistem down > 8 jam
├─ Seluruh tim crisis di-activate
└─ Komunikasi formal ke seluruh stakeholder
```

### 14.4 Aktivitas Selama Masa Warranty

| Minggu | Fokus Aktivitas | Tim |
|--------|----------------|-----|
| Week 21–22 | Bug fix P1 & P2 dari laporan pengguna; stabilisasi error rate < 0.5% | BE1, BE2, QA |
| Week 23–24 | Performance tuning — query optimization, cache strategy, lazy loading | TL, DevOps |
| Week 25–26 | Minor enhancement dari feedback pengguna (disetujui PM) | FE1, FE2, BE2 |
| Week 27–28 | Knowledge transfer intensif — dokumentasi operasional, runbook | TL, BA |
| Week 29–30 | Penyelesaian residual bugs, enhancement minor terakhir | Tim Proyek |
| Week 31 | Penyerahan seluruh dokumentasi & source code | PM, TL |
| Week 32 | Project closure — retrospective, penandatanganan berita serah terima | PM, Klien |

### 14.5 Aktivitas Pasca Warranty (Opsional)

| Layanan | Deskripsi | Biaya |
|---------|-----------|-------|
| **Extended Warranty** | Lanjutan dukungan bug fix & minor enhancement | Rp 10.000.000/bulan |
| **Major Enhancement** | Penambahan fitur baru, integrasi bank baru, modul tambahan | Per CR, estimasi terpisah |
| **Infrastructure Management** | Kelola hosting, monitoring, backup, update | Rp 5.000.000/bulan |
| **On-call Support** | Dukungan 24/7 untuk P1 (di luar jam kerja) | Rp 15.000.000/bulan |
| **Training Refresher** | Pelatihan ulang untuk staf baru | Rp 5.000.000/sesi |

---

## 15. Lampiran

### 15.1 Glossary

| Istilah | Definisi |
|---------|----------|
| **MetroCoop** | Nama produk — platform manajemen Koperasi Simpan Pinjam terintegrasi |
| **KSP** | Koperasi Simpan Pinjam — badan hukum yang menjalankan usaha simpan pinjam |
| **COA** | Chart of Accounts / Daftar Akun — struktur hierarkis akun akuntansi |
| **SAK ETAP** | Standar Akuntansi Keuangan untuk Entitas Tanpa Akuntabilitas Publik |
| **OJK** | Otoritas Jasa Keuangan — lembaga pengawas sektor jasa keuangan |
| **CKPN** | Cadangan Kerugian Penurunan Nilai — cadangan wajib untuk piutang bermasalah |
| **KPMM** | Kewajiban Penyediaan Modal Minimum — minimum modal koperasi (8% dari CKPM) |
| **BMPK** | Batas Maksimum Pemberian Kredit — maksimum pemberian kredit per debitur |
| **SHU** | Sisa Hasil Usaha — laba bersih koperasi setelah dikurangi biaya dan cadangan |
| **RAT** | Rapat Anggota Tahunan — forum tertinggi pengambilan keputusan koperasi |
| **POS** | Point of Sale — sistem kasir penjualan retail/toko |
| **PPOB** | Payment Point Online Bank — layanan pembayaran digital |
| **RBAC** | Role-Based Access Control — mekanisme otorisasi berdasarkan peran |
| **JWT** | JSON Web Token — standar token autentikasi stateless |
| **CI/CD** | Continuous Integration / Continuous Deployment — pipeline otomasi |
| **UAT** | User Acceptance Testing — pengujian penerimaan oleh pengguna akhir |
| **BRD** | Business Requirements Document — dokumen kebutuhan bisnis |
| **SRS** | Software Requirements Specification — spesifikasi kebutuhan perangkat lunak |
| **BAPO** | Berita Acara Penerimaan Operasional — dokumen serah terima sistem |
| **CR** | Change Request — permintaan perubahan scope/fitur |
| **ETL** | Extract, Transform, Load — proses migrasi data |
| **SLA** | Service Level Agreement — perjanjian tingkat layanan |
| **PWA** | Progressive Web App — aplikasi web yang bisa diinstal di perangkat |
| **API** | Application Programming Interface — antarmuka pemrograman aplikasi |

### 15.2 Singkatan & Akronim

| Singkatan | Kepanjangan |
|-----------|------------|
| PM | Project Manager |
| TL | Tech Lead |
| FL | Frontend Lead |
| BE | Backend Engineer |
| FE | Frontend Engineer |
| QA | Quality Assurance |
| BA | Business Analyst |
| DoD | Definition of Done |
| E2E | End-to-End |
| p95 | Percentile ke-95 (metrik performa) |

### 15.3 Referensi Dokumen Terkait

| No | Dokumen | Lokasi | Versi |
|----|---------|--------|-------|
| 1 | Proposal Teknis & Komersial | `docs/01-proposal/proposal-teknis-komersial.md` | 1.0 |
| 2 | Company Profile | `docs/02-company-profile/company-profile-portofolio.md` | 1.0 |
| 3 | NDA Draft | `docs/03-nda/nda-draft.md` | 1.0 |
| 4 | BRD / URS | `docs/04-brd/brd-urs.md` | 1.0 |
| 5 | SRS Specification | `docs/05-srs/srs-specification.md` | 1.0 |
| 6 | UI/UX Design Specification | `docs/06-ui-ux/ui-ux-design-spec.md` | 1.0 |
| 7 | Project Plan | `docs/07-project-plan/project-plan.md` | 1.0 |

### 15.4 Riwayat Dokumen

| Versi | Tanggal | Perubahan | Oleh |
|-------|---------|-----------|------|
| 1.0.0 | 16 Juli 2026 | Dokumen pertama — rencana implementasi lengkap 32 minggu | Tim MetroCoop |

### 15.5 Tabel Persetujuan (Sign-Off)

| No | Peran | Nama | Tanda Tangan | Tanggal |
|----|-------|------|-------------|---------|
| 1 | Project Manager (Pengembang) | [NAMA] | ________________ | ____/____/______ |
| 2 | Tech Lead (Pengembang) | [NAMA] | ________________ | ____/____/______ |
| 3 | Project Sponsor (Klien) | [NAMA] | ________________ | ____/____/______ |
| 4 | Ketua Pengurus Koperasi | [NAMA] | ________________ | ____/____/______ |
| 5 | Pengawas Koperasi | [NAMA] | ________________ | ____/____/______ |

---

*— Akhir Dokumen Rencana Proyek MetroCoop —*