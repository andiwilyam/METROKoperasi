# Spesifikasi Desain UI/UX — MetroCoop

**Versi Dokumen:** 2.0  
**Tanggal:** 16 Juli 2026  
**Status:** Final  
**Proyek:** MetroCoop — Sistem Informasi Koperasi Simpan Pinjam Terintegrasi  
**Arsitektur:** Monorepo (React 19 + Tailwind CSS v4 + Zustand)  
**Library Ikon:** Lucide React  
**Animasi:** Motion (Framer Motion successor)

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Design System](#2-design-system)
3. [Arsitektur Layout](#3-arsitektur-layout)
4. [Spesifikasi Wireframe](#4-spesifikasi-wireframe)
5. [Struktur Navigasi](#5-struktur-navigasi)
6. [Spesifikasi Formulir](#6-spesifikasi-formulir)
7. [Desain Responsif](#7-desain-responsif)
8. [Dark/Light Mode](#8-darklight-mode)
9. [Aksesibilitas](#9-aksesibilitas)
10. [Lampiran](#10-lampiran)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini mendeskripsikan seluruh aspek desain UI/UX untuk aplikasi **MetroCoop**, sebuah platform digitalisasi koperasi simpan pinjam (KSP) yang terintegrasi. Dokumen ini menjadi acuan utama bagi tim pengembang, desainer UI, dan stakeholder proyek dalam membangun, memelihara, dan mengevaluasi antarmuka pengguna aplikasi.

### 1.2 Ruang Lingkup

Spesifikasi mencakup seluruh layar (*screen*) yang ada dalam aplikasi, meliputi:

- **Portal Publik:** Landing page (CMS-editable), layar autentikasi
- **Portal Admin/Operator:** Dashboard utama, manajemen keanggotaan, simpanan, pinjaman, unit usaha (toko/POS, PPOB, sewa, pembiayaan, ventura), akuntansi (COA, jurnal, buku besar, neraca saldo, laporan keuangan), pengaturan sistem
- **Portal Anggota:** Dashboard mandiri, informasi simpanan/pinjaman, pengajuan, tiket bantuan, profil
- **Portal Perusahaan:** Pengajuan pembiayaan ventura, registrasi mitra bisnis

### 1.3 Prinsip Desain

| No | Prinsip | Deskripsi |
|----|---------|-----------|
| 1 | **WCAG 2.1 AA** | Semua elemen memenuhi kontras minimum 4.5:1, navigasi keyboard, label aksesibilitas |
| 2 | **Mobile-Responsive** | Mendukung tiga breakpoint: mobile (<768px), tablet (768–1023px), desktop (≥1024px) |
| 3 | **Dark/Light Mode** | Empat tema preset yang dapat ditukar secara real-time tanpa reload |
| 4 | **Konsistensi Visual** | Seluruh komponen menggunakan design token terpusat (`--mc-*` CSS variables) |
| 5 | **Feedback Instan** | Setiap aksi pengguna mendapat respons visual (loading, sukses, error, animasi) |
| 6 | **Hierarki Informasi** | Tampilan data mengikuti pola: KPI ringkas → grafik → tabel detail |

### 1.4 Target Pengguna

| Peran | Akses | Deskripsi |
|-------|-------|-----------|
| Superadmin | Penuh | Akses seluruh modul + pengaturan sistem |
| Admin | Penuh | Akses seluruh modul operasional |
| Operator | Terbatas | Akses operasional harian tanpa pengaturan sensitif |
| Anggota | Mandiri | Portal self-service untuk data pribadi |
| Perusahaan | Terbatas | Portal untuk pengajuan pembiayaan ventura |

---

## 2. Design System

### 2.1 Tema Warna (Theme Presets)

Aplikasi mendukung **4 tema preset** yang diatur melalui atribut `data-theme` pada `<html>` dan disimpan di `localStorage` dengan kunci `theme_preset`.

#### 2.1.1 Heritage Light (Default)

Tema utama dengan nuansa krem dan emas, terinspirasi estetika *editorial luxe*.

| Token CSS | Nilai | Kegunaan |
|-----------|-------|----------|
| `--mc-bg` | `#f6f1e9` | Latar belakang halaman |
| `--mc-surface` | `#fffdf9` | Latar kartu/formulir |
| `--mc-surface-2` | `#fbf7ef` | Latar elemen sekunder |
| `--mc-border` | `#e8dfcd` | Garis batas elemen |
| `--mc-ink` | `#2c2820` | Teks utama |
| `--mc-ink-strong` | `#23201b` | Teks judul/bold |
| `--mc-muted` | `#5a5246` | Teks sekunder/hint |
| `--mc-sidebar` | `#fbf7ef` | Latar sidebar |
| `--mc-sidebar-ink` | `#23201b` | Teks sidebar |
| `--mc-sidebar-muted` | `#8a8068` | Teks sidebar sekunder |
| `--mc-sidebar-active` | `rgba(200, 162, 75, 0.14)` | Latar item sidebar aktif |
| `--mc-primary` | `#9a7422` | Warna primer (emas) |
| `--mc-accent` | `#c8a24b` | Warna aksen utama (tombol, badge) |
| `--mc-accent-2` | `#a8802f` | Aksen hover |
| `--mc-on-accent` | `#fffdf9` | Teks di atas elemen aksen |
| `--mc-success` | `#1f6f54` | Warna sukses |
| `--mc-success-bg` | `rgba(31, 111, 84, 0.12)` | Latar badge sukses |
| `--mc-danger` | `#a8443a` | Warna bahaya/error |
| `--mc-danger-bg` | `rgba(180, 60, 50, 0.10)` | Latar badge bahaya |
| `--mc-ring` | `rgba(154, 116, 34, 0.45)` | Warna outline fokus |

#### 2.1.2 Midnight Heritage

Tema gelap dengan nuansa *navy + emas*, kesan bank privat.

| Token CSS | Nilai |
|-----------|-------|
| `--mc-bg` | `#0c1322` |
| `--mc-surface` | `#111c30` |
| `--mc-surface-2` | `#0e1828` |
| `--mc-border` | `rgba(255, 255, 255, 0.07)` |
| `--mc-ink` | `#dde3ee` |
| `--mc-ink-strong` | `#f0e6cf` |
| `--mc-muted` | `#9aa6bd` |
| `--mc-sidebar` | `#0a1120` |
| `--mc-sidebar-ink` | `#f0e6cf` |
| `--mc-primary` | `#e0b973` |
| `--mc-accent` | `#c8a24b` |
| `--mc-success` | `#6ee7b7` |
| `--mc-danger` | `#fca5a5` |
| `--mc-ring` | `rgba(224, 185, 115, 0.5)` |

#### 2.1.3 Classic Royal Blue

Tema biru korporat klasik, familiar bagi pengguna sistem perbankan.

| Token CSS | Nilai |
|-----------|-------|
| `--mc-bg` | `#f8fafc` |
| `--mc-surface` | `#ffffff` |
| `--mc-surface-2` | `#f1f5f9` |
| `--mc-border` | `#e2e8f0` |
| `--mc-ink` | `#334155` |
| `--mc-ink-strong` | `#0f172a` |
| `--mc-muted` | `#64748b` |
| `--mc-sidebar` | `#0f172a` |
| `--mc-sidebar-ink` | `#e2e8f0` |
| `--mc-primary` | `#2563eb` |
| `--mc-accent` | `#d97706` |
| `--mc-success` | `#16a34a` |
| `--mc-danger` | `#dc2626` |
| `--mc-ring` | `rgba(37, 99, 235, 0.45)` |

#### 2.1.4 Teal Ocean

Tema *marine modern* untuk koperasi digital.

| Token CSS | Nilai |
|-----------|-------|
| `--mc-bg` | `#f0fdfa` |
| `--mc-surface` | `#ffffff` |
| `--mc-surface-2` | `#ecfeff` |
| `--mc-border` | `#cbd5e1` |
| `--mc-ink` | `#334155` |
| `--mc-ink-strong` | `#042f2e` |
| `--mc-muted` | `#5e7591` |
| `--mc-sidebar` | `#042f2e` |
| `--mc-sidebar-ink` | `#ccfbf1` |
| `--mc-primary` | `#0d9488` |
| `--mc-accent` | `#0891b2` |
| `--mc-success` | `#0f766e` |
| `--mc-danger` | `#dc2626` |
| `--mc-ring` | `rgba(13, 148, 136, 0.45)` |

### 2.2 Tipografi

| Font | Family CSS | Kegunaan |
|------|-----------|----------|
| **Inter** | `"Inter", ui-sans-serif, system-ui, sans-serif` | Teks body, label, tombol, tabel |
| **JetBrains Mono** | `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace` | Angka, kode akun, nomor transaksi, kode |
| **Fraunces** | `"Fraunces", serif` | Display headings (landing page) |

**Skala Ukuran Teks:**

| Kelas Tailwind | Ukuran | Kegunaan |
|---------------|--------|----------|
| `text-[9px]` | 9px | Label sidebar "Koperasi Simpan Pinjam" |
| `text-[10px]` | 10px | Badge, status label, info mikro, navigasi section header |
| `text-[11px]` | 11px | Breadcrumb, sub-menu sidebar, deskripsi singkat |
| `text-xs` | 12px | Body text utama, label form, tombol kecil |
| `text-sm` | 14px | Heading kartu, judul tabel |
| `text-base` | 16px | Paragraf landing page |
| `text-lg` | 18px | Heading form login |
| `text-xl` | 20px | Heading halaman |
| `text-2xl` | 24px | KPI angka besar, judul dashboard |
| `text-3xl` | 30px | Headline landing hero |

**Bobot Font:**

| Bobot | Tailwind | Kegunaan |
|-------|----------|----------|
| Regular (400) | `font-normal` | Teks body |
| Medium (500) | `font-medium` | Label, breadcrumb |
| Semibold (600) | `font-semibold` | Tombol, sub-heading |
| Bold (700) | `font-bold` | Judul halaman, nama anggota |
| Extrabold (800) | `font-extrabold` | KPI angka, headline |

### 2.3 Spacing Scale

Menggunakan skala spacing bawaan Tailwind CSS v4:

| Token | Nilai | Kegunaan Umum |
|-------|-------|---------------|
| `p-1` / `m-1` | 4px | Padding mikro (ikon tombol) |
| `p-1.5` / `m-1.5` | 6px | Padding item sidebar |
| `p-2` / `m-2` | 8px | Padding kartu kecil, tombol inline |
| `p-3` / `m-3` | 12px | Padding tabel sel, badge |
| `p-4` / `m-4` | 16px | Padding kartu, margin section |
| `p-5` / `m-5` | 20px | Padding kartu utama |
| `p-6` / `m-6` | 24px | Padding header banner, margin antar section |
| `p-8` / `m-8` | 32px | Padding form login, spacing hero |

### 2.4 Border Radius

| Kelas | Nilai | Kegunaan |
|-------|-------|----------|
| `rounded-md` | 6px | Tombol kecil, badge inline |
| `rounded-lg` | 8px | Input form, tombol utama, tabel header |
| `rounded-xl` | 12px | Kartu ringkas (KPI cards) |
| `rounded-2xl` | 16px | Kartu utama, form login |
| `rounded-3xl` | 24px | Kartu hero, elemen dekoratif |
| `rounded-full` | 9999px | Avatar, badge status, scrollbar thumb |

### 2.5 Shadows

| Level | Tailwind | Kegunaan |
|-------|----------|----------|
| Shadow-sm | `shadow-sm` | Header sticky, kartu default |
| Shadow-md | `shadow-md` | Kartu interaktif, tombol utama |
| Shadow-lg | `shadow-lg` | Dropdown menu |
| Shadow-xl | `shadow-xl` | Modal, dialog overlay |
| Shadow-2xl | `shadow-2xl` | Login form box |
| Box-shadow custom | Token-based | `shadow-[var(--mc-accent)]/30` untuk brand accent |

### 2.6 Utility Classes Kustom (mc-*)

| Class | Fungsi |
|-------|--------|
| `.mc-bg` | Background + warna teks halaman |
| `.mc-surface` | Background kartu/formulir |
| `.mc-surface-2` | Background elemen sekunder |
| `.mc-card` | Surface + border + rounded-xl |
| `.mc-ink` | Warna teks utama |
| `.mc-ink-strong` | Warna teks judul |
| `.mc-muted` | Warna teks sekunder |
| `.mc-border` | Warna border |
| `.mc-sidebar` | Background sidebar |
| `.mc-sidebar-ink` | Teks sidebar |
| `.mc-sidebar-muted` | Teks sidebar sekunder |
| `.mc-sidebar-item:hover` | Hover state item sidebar |
| `.mc-sidebar-active` | State aktif item sidebar |
| `.mc-btn-primary` | Tombol primer (bg aksen, teks kontras) |
| `.mc-btn-danger` | Tombol bahaya (bg danger, teks danger) |
| `.mc-badge-ok` | Badge sukses (bg success, teks success) |
| `.mc-badge-accent` | Badge aksen (bg sidebar-active, teks primary) |
| `.mc-icon-accent` | Warna ikon aksen |
| `.mc-focus:focus-visible` | Outline fokus untuk aksesibilitas |

### 2.7 Animasi

| Nama | CSS | Kegunaan |
|------|-----|----------|
| `transition-all-custom` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Transisi kartu |
| `animate-soft-pulse` | `scale(1→1.05), opacity(0.5→1)` | Ikon badge aktif |
| `typing-caret` | `border-right blink 0.75s` | Efek mengetik subtitle login |
| `glass-card` | `rgba(255,255,255,0.85) + blur(12px)` | Efek glassmorphism ringan |
| `dark-glass-card` | `rgba(15,23,42,0.95) + blur(12px)` | Glassmorphism tema gelap |
| `animate-shake` | `translateX(-5px↔5px) 0.5s` | Error validasi form |
| `animate-dropdownFade` | Fade-in dropdown | Menu dropdown header |
| `animate-fadeIn` | Fade-in halaman | Load halaman baru |

### 2.8 Library & Dependencies

| Package | Versi | Kegunaan |
|---------|-------|----------|
| `react` | ^19.0.1 | Framework UI |
| `react-dom` | ^19.0.1 | Renderer DOM |
| `tailwindcss` | ^4.1.14 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.1.14 | Integrasi Tailwind + Vite |
| `lucide-react` | ^0.546.0 | Library ikon |
| `motion` | ^12.23.24 | Animasi (successor Framer Motion) |
| `zustand` | ^5.0.14 | State management |
| `react-router-dom` | ^7.18.1 | Routing |
| `vite` | ^6.2.3 | Build tool |
| `playwright` | ^1.61.1 | E2E testing |

---

## 3. Arsitektur Layout

### 3.1 Struktur Layout Utama

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (h-16, sticky top-0, z-30)                     │
│  ┌──────┬───────────────────────┬────────────────────┐  │
│  │ Menu │ Breadcrumb + Judul    │ Jam │ Badge │ User │  │
│  └──────┴───────────────────────┴────────────────────┘  │
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT AREA                           │
│ (w-64)   │  (flex-1, overflow-y-auto, p-6)             │
│          │                                              │
│ Brand    │  ┌──────────────────────────────────────┐   │
│ ─────    │  │  Konten halaman aktif                │   │
│ Menu     │  │  (AdminDashboard / AdminAnggota /     │   │
│ items    │  │   MemberPortal / dll.)                │   │
│          │  └──────────────────────────────────────┘   │
│          │                                              │
│          │                                              │
│ ─────    │                                              │
│ Theme    │                                              │
│ Switch   │                                              │
│ Logout   │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 3.2 Sidebar

**Komponen:** [Sidebar.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/Sidebar.tsx)

| Properti | Nilai |
|----------|-------|
| Lebar | `w-64` (256px) |
| Tinggi | `h-screen` (100vh) |
| Posisi | `fixed` (mobile) / `sticky top-0` (desktop) |
| Z-index | `z-50` |
| Background | `var(--mc-sidebar)` |
| Border | Right border `var(--mc-border)` |
| Transisi | `transform 300ms ease-in-out` |

**Area Sidebar:**

1. **Brand Header** (h-16): Logo ikon + nama "MetroCoop" + sublabel "Koperasi Simpan Pinjam"
2. **Navigasi Menu** (flex-1, overflow-y-auto, px-4, py-6, space-y-7):
   - Section header berlabel uppercase: "MANAJEMEN UTAMA", "Unit Usaha (Business)", "Manajemen Investasi & Penyertaan Modal", "Akuntansi & Laporan"
   - Item menu: Ikon Lucide (w-4 h-4) + label (text-xs font-medium)
   - Sub-menu: indent `pl-7`, font lebih kecil (text-[11px])
   - Item aktif: `.mc-sidebar-active` (bg accent transparan, teks primary, font-semibold)
   - Hover: `rgba(128,128,128,0.08)`
3. **Footer** (p-4, border-top):
   - Theme switcher: toggle Moon/Sun icon
   - Tombol "Keluar Aplikasi" (mc-btn-danger)

**Responsif:**
- Desktop (≥1024px): Sidebar selalu terlihat (translate-x-0)
- Mobile/Tablet (<1024px): Sidebar tersembunyi (-translate-x-full), muncul dengan overlay `bg-black/50 backdrop-blur-sm` saat tombol hamburger diklik

### 3.3 Header

**Komponen:** [Header.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/Header.tsx)

| Properti | Nilai |
|----------|-------|
| Tinggi | `h-16` (64px) |
| Posisi | `sticky top-0 z-30` |
| Background | `var(--mc-surface)` |
| Border | Bottom border `var(--mc-border)` |
| Shadow | `shadow-sm` |

**Area Header:**

1. **Kiri:**
   - Tombol hamburger (☰): `lg:hidden`, hanya tampil di mobile
   - Breadcrumb: Teks `[11px] font-medium mc-muted` — format: `Aplikasi / MetroCoop`
   - Judul halaman: `text-sm font-bold mc-ink-strong` — judul dinamis dari `formatTitle(activeMenu)`
2. **Kanan:**
   - Jam real-time: `font-mono animate-fadeIn`, format Indonesia `16 Juli 2026, 14:30:00 WIB`, `hidden md:flex`
   - Badge role: `text-[10px] font-bold rounded-full`, warna berbeda per role (Admin = mc-badge-ok, Anggota = mc-badge-accent)
   - Notifikasi bell: ikon `Bell` dengan counter badge merah (text-[8px])
   - Profil user: Avatar inisial (w-8 h-8 rounded-full) + nama + role, dropdown menu

**Dropdown Profil:**
- Lebar: `w-56`
- Isi: nama lengkap, username, status sesi, tombol "Keluar Sesi"
- Backdrop: overlay `fixed inset-0 z-30` untuk menutup

### 3.4 Main Content Area

| Properti | Nilai |
|----------|-------|
| Lebar | `flex-1` (sisa dari sidebar) |
| Padding | `p-6` |
| Overflow | `overflow-y-auto` |
| Min-height | Mengisi sisa viewport |

### 3.5 Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Lebar | Perilaku |
|-----------|----------------|-------|----------|
| Mobile | Default / `sm` | <640px | Sidebar overlay, 1 kolom, header compact |
| Tablet | `md` / `lg` | 640–1023px | Sidebar overlay, 2 kolom grid, header jam tampil |
| Desktop | `lg` / `xl` | ≥1024px | Sidebar sticky, grid 4 kolom, full layout |

---

## 4. Spesifikasi Wireframe

### 4.1 MetroKspLandingPage

**Komponen:** [MetroKspLandingPage.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/pages/MetroKspLandingPage.tsx)  
**Sub-komponen:** Navbar, HeroSection, FeaturesGrid, TeamGrid, TestimonialSlider, PricingTable, ContactFooter  
**Kelas CSS:** `.metroksp` (namespace) + `.mk-*` tokens

**Layout & Elemen:**

| Section | Komponen | Deskripsi |
|---------|----------|-----------|
| **Navbar** | `Navbar` | Logo + nama koperasi, navigasi anchor (#fitur, #produk, #kontak), tombol "Masuk" → login |
| **Hero** | `HeroSection` | Full-screen, background gradient/gambar, headline besar (text-4xl to 6xl), subheadline, 2 CTA tombol (primer + outline), badge status "Diawasi OJK" |
| **Fitur** | `FeaturesGrid` | Grid 3–4 kolom kartu fitur, ikon + judul + deskripsi |
| **Tim** | `TeamGrid` | Grid kartu anggota pengurus (foto + nama + jabatan) |
| **Testimoni** | `TestimonialSlider` | Carousel testimonial anggota (nama + foto + kutipan) |
| **Harga** | `PricingTable` | Tabel paket/produk simpanan dengan harga |
| **Kontak** | `ContactFooter` | Form kontak + alamat + copyright + social media |

**Karakteristik Khusus:**
- Seluruh konten bersifat **CMS-editable** — data diambil dari `metroKspData` object
- Background hero menggunakan CSS gradient atau gambar
- Efek glassmorphism pada kartu: `bg-white/10 backdrop-blur border border-white/20 rounded-2xl`
- Font display: Fraunces untuk headline
- Variabel CSS khusus landing: `--mk-primary` (berbeda dari `--mc-*`)

**Wireframe ASCII — Landing Page:**

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  Fitur  Produk  Tim  Testimoni  [Masuk]           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [Badge: Diawasi OJK]                                     │
│                                                            │
│  ════════════════════════════                              │
│  Headline Besar                      ┌──────────────┐      │
│  Subheadline deskripsi               │ Kartu:       │      │
│                                       │ Mengapa      │      │
│  [CTA Primer ──→] [CTA Sekunder]     │ MetroKSP     │      │
│                                       │ • Bagi hasil │      │
│                                       │ • Bunga rendah│     │
│                                       │ • Diawasi OJK│      │
│                                       └──────────────┘      │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  # Fitur (FeaturesGrid)                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ [Ikon]  │ │ [Ikon]  │ │ [Ikon]  │ │ [Ikon]  │         │
│  │ Judul 1 │ │ Judul 2 │ │ Judul 3 │ │ Judul 4 │         │
│  │ Deskrip.│ │ Deskrip.│ │ Deskrip.│ │ Deskrip.│         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
├────────────────────────────────────────────────────────────┤
│  # Tim (TeamGrid)                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ Foto │ │ Foto │ │ Foto │ │ Foto │                      │
│  │ Nama │ │ Nama │ │ Nama │ │ Nama │                      │
│  │ Jabat.│ │ Jabat.│ │ Jabat.│ │ Jabat.│                    │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
├────────────────────────────────────────────────────────────┤
│  # Testimoni (TestimonialSlider)                            │
│  "Kutipan testimonial anggota..." — Nama Anggota           │
│  ○ ○ ● ○  (dots navigasi)                                  │
├────────────────────────────────────────────────────────────┤
│  # Pricing (PricingTable)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Simpanan │ │ Simpanan │ │ Simpanan │                   │
│  │ Pokok    │ │ Wajib    │ │ Sukarela │                   │
│  │ Rp XXX   │ │ Rp XXX   │ │ Rp XXX   │                   │
│  │ [Daftar] │ │ [Daftar] │ │ [Daftar] │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
├────────────────────────────────────────────────────────────┤
│  # Kontak (ContactFooter)                                   │
│  ┌────────────────────┐ ┌────────────────────┐             │
│  │ Form:              │ │ Alamat:            │             │
│  │ [Nama]             │ │ Jl. ...            │             │
│  │ [Email]            │ │ Telp: ...          │             │
│  │ [Pesan]            │ │ © 2026 MetroCoop   │             │
│  │ [Kirim]            │ │                    │             │
│  └────────────────────┘ └────────────────────┘             │
└────────────────────────────────────────────────────────────┘
```

**Responsif Landing:**
- Mobile: Hero 1 kolom, fitur 1 kolom, navbar hamburger menu
- Tablet: Hero 2 kolom, fitur 2 kolom
- Desktop: Hero 2 kolom (konten + kartu), fitur 3–4 kolom

---

### 4.2 LoginScreen

**Komponen:** [LoginScreen.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/LoginScreen.tsx)

**Layout & Elemen:**

| Area | Posisi | Elemen |
|------|--------|--------|
| Background | Full-screen | Canvas animasi partikel + 2 blur sphere dekoratif |
| Branding | Kiri (md:col-span-5) | Logo, judul "MetroCoop v2.0", subjudul, statistik singkat (100% Auto Journaling, Multi Portal), test credentials |
| Form Login | Kanan (md:col-span-7) | Tab selector (Admin & Operator / Portal Anggota / Perusahaan), form fields, tombol submit |

**Tab Portal:**
- Tab 1: "Admin & Operator" — ikon Shield, warna emas (mc-accent)
- Tab 2: "Portal Anggota" — ikon User, warna emas (mc-accent)
- Tab 3: "Perusahaan" — ikon Building2, warna ungu (#a855f7)

**Form Fields:**
- Username/NIK: Input text, label dinamis per tab (Username Admin / NIK Anggota / Username Perusahaan)
- Password: Input password dengan toggle show/hide (Eye/EyeOff icon)
- Error state: Alert merah dengan animasi `animate-shake`
- Processing state: Spinner + teks "Memvalidasi..."

**Quick Login Buttons:**
- 3 tombol test credentials (Admin, Operator, Anggota) — klik auto-fill
- Perusahaan tab: form registrasi inline (toggle show/hide)

**Wireframe ASCII — Login:**

```
┌──────────────────────────────────────────────────────────────┐
│ (Canvas Partikel Background + Blur Spheres)                   │
│                                                               │
│  ┌──────────────────────┬─────────────────────────────┐      │
│  │                      │                             │      │
│  │ [Logo] MetroCoop     │ ┌─────┬──────────┬────────┐ │      │
│  │   v2.0              │ │Admin│ Anggota  │Perusaha.│ │      │
│  │                      │ └─────┴──────────┴────────┘ │      │
│  │ Platform Digitalisasi│                             │      │
│  │ Koperasi Masa Kini   │  Masuk Back Office          │      │
│  │                      │  Portal _____________        │      │
│  │ Kelola data, transaksi│                            │      │
│  │ simpanan, pinjaman...│  ┌──────────────────────┐  │      │
│  │                      │  │ Username Admin       │  │      │
│  │ ┌────────┐ ┌───────┐│  │ [________________]   │  │      │
│  │ │ 100%   │ │ Multi ││  ├──────────────────────┤  │      │
│  │ │ Auto   │ │Portal ││  │ Kata Sandi           │  │      │
│  │ │Journal.│ │       ││  │ [______________] [👁] │  │      │
│  │ └────────┘ └───────┘│  ├──────────────────────┤  │      │
│  │                      │  │                      │  │      │
│  │ 🔑 Test Credentials: │  │ [Masuk Sistem ✨]    │  │      │
│  │ ┌──────┐ ┌────────┐ │  │                      │  │      │
│  │ │Admin │ │Operat. │ │  └──────────────────────┘  │      │
│  │ └──────┘ └────────┘ │                             │      │
│  │ ┌──────────────────┐│  SSL Terenkripsi            │      │
│  │ │ Anggota           ││  © 2026 MetroCoop v2.0     │      │
│  │ └──────────────────┘│                             │      │
│  └──────────────────────┴─────────────────────────────┘      │
│                                                               │
│  METRO KOMUNIKA ASIA @2026 • Design By Andi Wilyam          │
└──────────────────────────────────────────────────────────────┘
```

**Responsif Login:**
- Mobile: Layout 1 kolom (branding di atas, form di bawah), padding px-4
- Tablet: Layout 2 kolom (branding kiri, form kanan)
- Desktop: Layout 2 kolom, max-w-5xl, center

---

### 4.3 AdminDashboard

**Komponen:** [AdminDashboard.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminDashboard.tsx)

**Layout & Elemen:**

| Section | Grid | Elemen |
|---------|------|--------|
| Welcome Banner | Full-width | Card dengan border-left accent, judul, badge tahun buku, tombol pengaturan |
| KPI Cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | 4 kartu: Anggota Aktif, Total Simpanan, Pinjaman Beredar, SHU Terkumpul |
| Chart + Org | `grid-cols-1 lg:grid-cols-12` | 8 kolom chart SVG, 4 kolom struktur pengurus |
| Unit Usaha Quick Access | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | 4 kartu: Toko POS, Sewa Alat, PPOB, Digital Payment |
| Venture Row | `grid-cols-1 md:grid-cols-3` | 3 kartu: Total Investasi (gradient), Dividen, Pengajuan Baru |
| Pinjaman Table | Full-width | Tabel permohonan pinjaman terbaru dengan aksi Setujui/Tolak |

**Data yang Ditampilkan:**
- KPI: jumlah anggota aktif, total simpanan (format IDR), pinjaman beredar, SHU terkumpul
- Chart SVG: Perkembangan transaksi 6 bulan terakhir (Simpanan vs Pinjaman)
- Struktur pengurus: Ketua, Bendahara, anggota lain
- Unit usaha: Total revenue per unit (Toko, Sewa, PPOB, VA)
- Venture: Total investasi aktif, dividen terkumpul, pengajuan pending

**Interaksi:**
- Klik kartu KPI → navigasi ke modul terkait
- Tombol "Lihat Semua" → navigasi ke daftar lengkap
- Tombol "Setujui & Cairkan" / "Tolak" pada tabel pinjaman

**Wireframe ASCII — Dashboard:**

```
┌──────────────────────────────────────────────────────────────┐
│  Kesehatan Koperasi Global — MetroKSP        [Pengaturan]    │
│  Tahun Buku 2026 ✨  Sistem informasi keuangan koperasi...   │
├──────────┬──────────────┬───────────────┬───────────────────┤
│ Anggota  │ Total        │ Pinjaman      │ SHU               │
│ Aktif    │ Simpanan     │ Beredar       │ Terkumpul         │
│          │              │               │                   │
│ 150      │ Rp 500.000.000│ Rp 200.000.000│ Rp 25.000.000   │
│ +5 bln   │ Setoran aman │ Risiko Kendal. │ + Positif (Laba) │
└──────────┴──────────────┴───────────────┴───────────────────┘
┌──────────────────────────────────────┬──────────────────────┐
│  Perkembangan Transaksi Global       │ Organisasi Koperasi  │
│  Simpanan ●────── ●                  │                      │
│  Pinjaman ○────── ○                  │ [A] Ketua Koperasi   │
│                                      │ [B] Bendahara        │
│  Simpanan vs Pinjaman 6 bln terakhir │ [C] Sekretaris       │
│                                      │                      │
│  Jan Feb Mar Apr Mei Jun             │ [Sertifikasi Standar │
│                                      │  Mutu Koperasi]      │
├──────────┬──────────────┬────────────┬┼─────────────────────┤
│ Unit     │ Sewa Alat    │ PPOB       ││ Digital Payment (VA)│
│ Toko POS │              │ Pulsa/Listrik│                     │
│          │              │            ││                     │
│ Rp XXX   │ Rp XXX       │ Rp XXX     ││ Rp XXX              │
│ [Masuk →]│ [Urus →]     │ [Transaksi→]│ [Layanan VA →]     │
└──────────┴──────────────┴────────────┴┴─────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  Permohonan Pinjaman Terbaru               [Lihat Semua →]   │
│  ┌──────────┬──────────┬──────────┬────────┬────────┬──────┐│
│  │ Nama     │ Produk   │ Pokok    │ Tenor  │ Angs.  │ Aksi ││
│  ├──────────┼──────────┼──────────┼────────┼────────┼──────┤│
│  │ Anggota  │ Reguler  │ Rp 10Jt  │ 12 bln │ Rp 900K│[✓][✗]││
│  └──────────┴──────────┴──────────┴────────┴────────┴──────┘│
└──────────────────────────────────────────────────────────────┘
```

**Responsif Dashboard:**
- Mobile: KPI cards 1 kolom, chart & org stacking, unit usaha 1 kolom
- Tablet: KPI 2 kolom, chart penuh, unit usaha 2 kolom
- Desktop: KPI 4 kolom, chart 8 kolom + org 4 kolom, unit usaha 4 kolom

---

### 4.4 AdminAnggota (Manajemen Anggota)

**Komponen:** [AdminAnggota.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminAnggota.tsx)

**Layout & Elemen:**

| Section | Elemen |
|---------|--------|
| Header | Judul "Manajemen Data Anggota" + tombol "Tambah Anggota Baru" |
| Search Bar | Input search (Search icon) + filter |
| Tabel Anggota | Kolom: No, NIK, Nama, Alamat, No. HP, Saldo Simpanan, Status, Aksi |
| Detail View | Klik baris → detail lengkap anggota |
| Form Tambah/Edit | Dialog/slide-out form input data anggota |
| Tab Pengurus | Sub-view untuk manajemen struktur pengurus |

**Kolom Tabel:**

| No | Kolom | Tipe | Lebar |
|----|-------|------|-------|
| 1 | No | Auto-number | 40px |
| 2 | NIK | Mono font | 120px |
| 3 | Nama Lengkap | Bold text | Auto |
| 4 | Alamat | Muted text | Auto |
| 5 | No. HP | Mono font | 100px |
| 6 | Saldo Simpanan | IDR format | 120px |
| 7 | Status | Badge (Aktif/Meninggal/Diaktifkan) | 80px |
| 8 | Aksi | Tombol Edit/Detail/Hapus | 120px |

**Interaksi:**
- Search: filter real-time berdasarkan nama, NIK, no HP
- Tombol "Tambah Anggota Baru" → buka form
- Tombol Edit (ikon Edit) → buka form edit dengan data terisi
- Tombol Detail → tampilkan detail view
- Tombol Aktifkan/Nonaktifkan → toggle status keanggotaan

**Wireframe ASCII — AdminAnggota:**

```
┌──────────────────────────────────────────────────────────────┐
│  Manajemen Data Anggota                    [+ Tambah Baru]   │
│  Kelola data nasabah, status keanggotaan...                  │
├──────────────────────────────────────────────────────────────┤
│  🔍 [Search berdasarkan nama, NIK, HP...]                    │
├──────────────────────────────────────────────────────────────┤
│  ┌──┬──────────┬────────────┬──────────┬──────┬─────────┬──┐│
│  │# │ NIK      │ Nama       │ Alamat   │ HP   │ Saldo   │AK││
│  ├──┼──────────┼────────────┼──────────┼──────┼─────────┼──┤│
│  │1 │12345678..│ Marmad Tua │ Jl. Mer..│081..│Rp 5.000K│✏ ││
│  │2 │09876543..│ Siti Amin  │ Jl. Sud..│082..│Rp 3.200K│✏ ││
│  │3 │11223344..│ Budi Sant. │ Jl. Gat. │083..│Rp 1.800K│✏ ││
│  └──┴──────────┴────────────┴──────────┴──────┴─────────┴──┘│
│                                                    [1/5]  >  │
└──────────────────────────────────────────────────────────────┘
```

**Responsif AdminAnggota:**
- Mobile: Header stacking, search full-width, tabel horizontal scroll
- Tablet: Search + button inline, tabel penuh
- Desktop: Tabel penuh dengan semua kolom terlihat

---

### 4.5 AdminSimpanan (Simpanan)

**Komponen:** [AdminSimpanan.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminSimpanan.tsx)

**Sub-views (tabs):**
1. `transaksi` — Setor & Tarik Simpanan
2. `permohonan` — Permohonan Penarikan
3. `jenis` — Konfigurasi Jenis Simpanan

**Jenis Simpanan:** Pokok, Wajib, Sukarela, Deposito

**Layout — Sub-view Transaksi:**
- Header: judul + tombol "Setor" / "Tarik"
- Search bar
- Tabel transaksi: No, Tanggal, Anggota, Jenis, Tipe (Setor/Tarik), Jumlah (IDR), Keterangan

**Layout — Sub-view Jenis Simpanan:**
- Grid kartu jenis simpanan (4 kartu)
- Setiap kartu: nama jenis, minimal setoran, bunga %, tombol Edit
- Tombol "Tambah Jenis" → form inline

**Form Input Transaksi Simpanan:**
- Dropdown anggota (searchable)
- Dropdown jenis simpanan (pokok/wajib/sukarela/deposito)
- Input jumlah (numeric, format IDR)
- Input keterangan (text)
- Tombol "Simpan" / "Batal"

---

### 4.6 AdminPinjaman (Pinjaman)

**Komponen:** [AdminPinjaman.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminPinjaman.tsx)

**Sub-views (tabs):**
1. `pengajuan` — Daftar Pengajuan Pinjaman
2. `angsuran` — Pembayaran Angsuran
3. `tagihan` — Tagihan & Jatuh Tempo
4. `jenis` — Konfigurasi Jenis Pinjaman

**Layout — Sub-view Pengajuan:**
- Header + search
- Tabel: No Pinjaman, Anggota, Produk, Pokok (IDR), Tenor, Bunga, Angsuran/Bln, Status, Aksi
- Tombol aksi: Setujui & Cairkan (mc-badge-ok), Tolak (mc-btn-danger)

**Layout — Sub-view Angsuran:**
- Tabel angsuran: No Angsuran, Pinjaman No, Anggota, Pokok, Bunga, Total, Jatuh Tempo, Status, Aksi (Bayar)
- Tombol "Bayar" → form pencatatan pembayaran angsuran

**Layout — Sub-view Jenis Pinjaman:**
- Grid/daftar jenis pinjaman
- Setiap item: nama, bunga %, maks plafon, maks tenor, metode bunga (flat/efektif/anuitas), biaya admin
- Form tambah/edit inline

**Wireframe ASCII — AdminPinjaman:**

```
┌──────────────────────────────────────────────────────────────┐
│  [Pengajuan] [Angsuran] [Tagihan] [Konfigurasi]              │
├──────────────────────────────────────────────────────────────┤
│  Daftar Pengajuan Pinjaman                                   │
│  🔍 [Search...]                                              │
├──────────────────────────────────────────────────────────────┤
│  ┌────────┬──────────┬────────┬───────┬──────┬────────┬────┐│
│  │No.Pinj │ Anggota  │Produk  │Pokok  │Tenor │Angs/bln│Aksi││
│  ├────────┼──────────┼────────┼───────┼──────┼────────┼────┤│
│  │P-0001  │Marmad    │Reguler │Rp 10Jt│12 bln│Rp 900K │[✓] ││
│  │P-0002  │Siti      │Darurat │Rp 5 Jt│ 6 bln│Rp 850K │[✗] ││
│  └────────┴──────────┴────────┴───────┴──────┴────────┴────┘│
│                                                    [1/3]  >  │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.7 AdminCOA (Chart of Accounts / Bagan Akun)

**Komponen:** [AdminCOA.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminCOA.tsx)

**Fitur Utama:**
- Tree view hierarkis hingga **6 level**
- Expandable/collapsible per node
- 6 kategori: ASET, KEWAJIBAN, EKUITAS, PENDAPATAN, BEBAN, SHU

**Layout:**
- Header: judul + tombol "Tambah Akun Baru"
- Search bar + filter kategori (dropdown)
- Tree view: indentasi per level (marginLeft: depth × 20px)
- Setiap node: ikon (FolderOpen untuk header, FileText untuk akun), kode akun (mono font), nama akun, badge saldo normal (D/K), badge kategori, tombol Edit/Nonaktifkan

**Kolom Tree:**

| Elemen | Lebar | Keterangan |
|--------|-------|------------|
| Expand/Collapse | w-4 | ChevronDown / ChevronRight |
| Ikon tipe | w-3.5 | FolderOpen (header) / FileText (akun) |
| Kode Akun | w-20 | Mono font, contoh: 1.1.01.01 |
| Nama Akun | flex-1 | Font medium-bold |
| Saldo Normal | Badge | D (debit) / K (kredit) |
| Kategori | w-16 | Teks kecil |

**Form Tambah/Edit Akun:**
- Kode Akun (text, mono)
- Nama Akun (text)
- Kategori (select: ASET/KEWAJIBAN/EKUITAS/PENDAPATAN/BEBAN/SHU)
- Sub Kategori (text)
- Saldo Normal (select: debit/kredit)
- Level (number: 1–6)
- Parent Akun (select, opsional)
- Header Account (checkbox: isHeader)

**Wireframe ASCII — AdminCOA:**

```
┌──────────────────────────────────────────────────────────────┐
│  Bagan Akun (Chart of Accounts)          [+ Tambah Akun Baru]│
│  Struktur hierarkis akun keuangan koperasi (6 level)         │
├──────────────────────────────────────────────────────────────┤
│  🔍 [Search akun...]  Kategori: [Semua ▾]                   │
├──────────────────────────────────────────────────────────────┤
│  ▼ 📁 1.1.01    Kas              [D] ASET                   │
│    ▼ 📁 1.1.01.01  Kas Besar     [D] ASET                   │
│      ▶ 📄 1.1.01.01.01  Kas Tunai  [D] ASET         [✏][👁]│
│      ▶ 📄 1.1.01.01.02  Kas Bank   [D] ASET         [✏][👁]│
│    ▶ 📁 1.1.01.02  Kas Kecil     [D] ASET                   │
│  ▶ 📁 1.1.02    Bank             [D] ASET                   │
│  ▶ 📁 1.1.03    Piutang          [D] ASET                   │
├──────────────────────────────────────────────────────────────┤
│  Kode Akun: [________]  Nama: [____________________]         │
│  Kategori: [ASET ▾]  Saldo: [Debit ▾]  Level: [3]          │
│  Parent: [1.1.01 ▾]  [✓ Header Account]                     │
│                                   [Simpan]  [Batal]          │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.8 AdminJurnal (Jurnal Umum)

**Komponen:** [AdminJurnal.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminJurnal.tsx)

**Fitur Utama:**
- Tabel daftar jurnal (auto + manual)
- Form input jurnal manual dengan dynamic rows
- Validasi debit = kredit
- Approval workflow: Draft → Posted → Approved / Reversed
- Reversal jurnal

**Layout — Daftar Jurnal:**
- Header + tombol "+ Buat Jurnal Manual"
- Tabel: No, Tanggal, Keterangan, Total Debit, Total Kredit, Status, Aksi
- Status badge: Draft (mc-badge-accent), Posted (mc-badge-accent), Approved (mc-badge-ok), Reversed (mc-btn-danger)

**Layout — Form Jurnal Manual:**
- Input tanggal (date picker)
- Input keterangan (text)
- Dynamic rows tabel: COA (select), Debit (IDR), Kredit (IDR)
- Tombol "+ Tambah Baris" / "Hapus Baris"
- Ringkasan: Total Debit, Total Kredit, Selisih
- Indikator keseimbangan: hijau jika seimbang, merah jika tidak
- Tombol "Simpan Jurnal" (disabled jika tidak seimbang)

**Wireframe ASCII — AdminJurnal:**

```
┌──────────────────────────────────────────────────────────────┐
│  Jurnal Umum & Entri Manual               [+ Buat Manual]    │
├──────────────────────────────────────────────────────────────┤
│  ┌─────┬──────────┬────────────┬──────────┬────────┬───────┐│
│  │ No  │ Tanggal  │ Keterangan │ Debit    │ Kredit │Status ││
│  ├─────┼──────────┼────────────┼──────────┼────────┼───────┤│
│  │ J-1 │ 16/07/26 │ Setoran    │Rp 10.000K│        │Approved│
│  │ J-2 │ 16/07/26 │ Belanja    │Rp  5.000K│Rp 5.000│Posted │
│  └─────┴──────────┴────────────┴──────────┴────────┴───────┘│
├──────────────────────────────────────────────────────────────┤
│  Form Jurnal Manual:                                         │
│  Tanggal: [16/07/2026]   Keterangan: [___________________]  │
│  ┌──────────────┬──────────┬──────────┬───┐                  │
│  │ COA          │ Debit    │ Kredit   │ ✕ │                  │
│  ├──────────────┼──────────┼──────────┼───┤                  │
│  │ 1.1.01.01    │Rp 10.000K│          │ [✕]│                 │
│  │ 4.1.01       │          │Rp 10.000K│ [✕]│                 │
│  └──────────────┴──────────┴──────────┴───┘                  │
│  [+ Tambah Baris]                                            │
│  ─────────────────────────────────────────────                │
│  Total Debit: Rp 10.000K  │  Total Kredit: Rp 10.000K       │
│  Selisih: Rp 0 ✅ Seimbang                                   │
│                                   [Simpan Jurnal]            │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.9 AdminToko (POS / Retail)

**Komponen:** [AdminToko.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminToko.tsx)

**Sub-views (tabs):**
1. `kasir` — Kasir POS Utama
2. `barang` — Katalog & Stok Barang
3. `supplier` — Supplier & Pembelian
4. `laporan` — Laporan Toko

**Layout — Kasir POS:**
- 2 kolom: Kiri (input barang + keranjang), Kanan (ringkasan pembayaran)
- Input: dropdown barang + qty + tombol "Tambah ke Keranjang"
- Keranjang: tabel item (Nama, Qty, Harga, Subtotal, Hapus)
- Ringkasan: Total Belanja, Diskon, Total Bayar, Bayar Tunai, Kembalian
- Tombol "Proses Pembayaran" → cetak faktur

**Layout — Katalog Barang:**
- Header + tombol "+ Tambah Barang"
- Search + filter kategori
- Tabel: Kode, Nama Barang, Kategori, Stok, Satuan, Harga Beli, Harga Jual, Aksi

**Form Input Barang:**
- Kode Barang (text)
- Nama Barang (text)
- Kategori (select dari KategoriBarang)
- Stok (number)
- Satuan (text: pcs, kg, liter, dll.)
- Harga Beli (IDR)
- Harga Jual (IDR)
- Supplier (select)

**Wireframe ASCII — AdminToko Kasir:**

```
┌──────────────────────────────────────────────────────────────┐
│  Kasir POS (Point of Sale)                                   │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┬────────────────────────┐│
│  │ Tambah Barang:                  │ Keranjang Belanja      ││
│  │ Barang: [Pilih Barang ▾]        │ ┌──────┬────┬─────┬──┐ ││
│  │ Qty: [1]  [Tambah ke Keranjang] │ │Nama  │Qty │Hrg  │X │ ││
│  │                                 │ ├──────┼────┼─────┼──┤ ││
│  │ Barang populer:                 │ │Sabun │ 2  │15K  │✕ │ ││
│  │ [Sabun Rp 15K] [Sampo Rp 25K]  │ │Sampo │ 1  │25K  │✕ │ ││
│  │ [Minyak Rp 28K]                 │ └──────┴────┴─────┴──┘ ││
│  │                                 │                        ││
│  │                                 │ Total:    Rp 55.000    ││
│  │                                 │ Diskon: - Rp  5.000    ││
│  │                                 │ Bayar:    Rp 50.000    ││
│  │                                 │ Tunai:    [__________] ││
│  │                                 │ Kembalian:Rp  0        ││
│  │                                 │ [Proses Pembayaran 💰]  ││
│  └─────────────────────────────────┴────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

### 4.10 AdminLaporan (Laporan Keuangan)

**Komponen:** [AdminLaporan.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminLaporan.tsx)

**Sub-views:**
1. `labarugi` — Laporan Laba/Rugi
2. `neraca` — Laporan Neraca
3. `shu` — Laba Bersih & SHU
4. `jurnal` — Ringkasan Jurnal

**Layout — Laporan Laba/Rugi:**
- Header: judul + periode
- Struktur tabel laporan keuangan standar:
  - **Pendapatan:** Bunga Pinjaman, Pendapatan Toko, Pendapatan Lain
  - **Beban:** HPP Toko, Beban Gaji, Beban Operasional
  - **Laba Bersih** = Total Pendapatan - Total Beban

**Layout — Laporan Neraca:**
- 2 kolom:
  - Kiri: **Aset** (Lancar + Tetap)
  - Kanan: **Kewajiban + Ekuitas**

**Layout — SHU:**
- Total laba bersih
- Slider/input distribusi: Jasa Modal %, Jasa Usaha %
- Hasil perhitungan per komponen SHU
- Tombol "Proses SHU"

**Wireframe ASCII — AdminLaporan:**

```
┌──────────────────────────────────────────────────────────────┐
│  [Laba/Rugi] [Neraca] [SHU] [Arus Kas] [Rasio] [PDE]       │
├──────────────────────────────────────────────────────────────┤
│  LAPORAN LABA RUGI KOPERASI — Periode: 2026                 │
├──────────────────────────────────────────────────────────────┤
│  PENDAPATAN                                                  │
│    Pendapatan Bunga Pinjaman       Rp  50.000.000            │
│    Pendapatan Toko                 Rp  20.000.000            │
│    Pendapatan Lain-lain            Rp   5.000.000            │
│                                      ─────────────           │
│    Total Pendapatan                Rp  75.000.000            │
│                                                              │
│  BEBAN                                                       │
│    HPP Toko                        Rp  12.000.000            │
│    Beban Gaji                      Rp  15.000.000            │
│    Beban Operasional               Rp   8.000.000            │
│                                      ─────────────           │
│    Total Beban                     Rp  35.000.000            │
│                                                              │
│  ════════════════════════════════════════                    │
│  LABA BERSIH (SHU)               Rp  40.000.000             │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.11 Layar Akuntansi Lainnya

#### AdminBukuBesar (General Ledger)

**Komponen:** `AdminBukuBesar.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Filter | Dropdown akun COA, periode (bulan/tahun) |
| Tabel | Tanggal, No Jurnal, Keterangan, Debit, Kredit, Saldo |
| Saldo | Running balance per transaksi |
| Ringkasan | Total Debit, Total Kredit, Saldo Akhir |

#### AdminNeracaSaldo (Trial Balance)

| Elemen | Deskripsi |
|--------|-----------|
| Tabel | Kode Akun, Nama Akun, Debit, Kredit |
| Footer | Total Debit = Total Kredit (validasi) |
| Export | Tombol cetak/ekspor PDF |

#### AdminArusKas (Cash Flow Statement)

| Elemen | Deskripsi |
|--------|-----------|
| Sections | Aktivitas Operasi, Investasi, Pendanaan |
| Tabel | Keterangan, Tahun Berjalan, Tahun Lalu |
| Indikator | Arus kas bersih positif/negatif |

#### AdminRasio (Financial Ratios)

| Elemen | Deskripsi |
|--------|-----------|
| KPI Cards | Rasio Likuiditas, Profitabilitas, Solvabilitas |
| Detail | Perhitungan per rasio, benchmark standar industri |

#### AdminSubLedger (Sub Ledger)

| Elemen | Deskripsi |
|--------|-----------|
| Filter | Pilih anggota, periode |
| Tabel | Detail transaksi pinjaman per anggota |

#### AdminTutupBuku (Period Close Wizard)

| Elemen | Deskripsi |
|--------|-----------|
| Wizard steps | 1. Validasi data → 2. Hitung SHU → 3. Posting jurnal tutup → 4. Tutup periode |
| Progress bar | Indikator langkah aktif |
| Checklist | Validasi sebelum tutup buku |

---

### 4.12 Layar Unit Usaha Lainnya

#### AdminPpob / AdminPPOBDashboard

**Komponen:** `AdminPpob.tsx`, `AdminPPOBDashboard.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Dashboard | KPI: total transaksi PPOB, pendapatan, transaksi hari ini |
| Layanan | Daftar produk: Pulsa, Listrik, BPJS, PDAM, Internet |
| Form Transaksi | Pilih layanan, input no tujuan, nominal, proses |
| Riwayat | Tabel transaksi PPOB dengan status |

#### AdminDigipay

**Komponen:** `AdminDigipay.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Virtual Account | Daftar nomor VA, status aktif/nonaktif |
| Transaksi VA | Tabel transaksi masuk, status sukses/gagal |
| Top Up | Form top up virtual account |

#### AdminSewa (Sewa Aset)

**Komponen:** `AdminSewa.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Daftar Aset | Nama aset, kondisi, tarif sewa, status |
| Transaksi Sewa | Pilih aset, durasi, hitung biaya, catat transaksi |
| Pengembalian | Form pengembalian aset + denda |

#### AdminPembiayaan

**Komponen:** `AdminPembiayaan.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Dashboard | Kredit berjalan, angsuran terkumpul |
| Produk Cicilan | Daftar barang cicilan, DP, tenor, angsuran |
| Angsuran | Pembayaran angsuran cicilan pengadaan |

#### AdminVentura / AdminVenturaDashboard / AdminPipelineVentura / AdminPengajuanVentura

| Komponen | Deskripsi |
|----------|-----------|
| Dashboard | KPI investasi aktif, total portofolio, dividen |
| Perusahaan | Daftar perusahaan mitra, profil, kontak |
| Pipeline | Visual pipeline: Prospect → Due Diligence → Approved → Disbursement |
| Pengajuan | Form pengajuan pembiayaan + upload dokumen + AI scoring |

---

### 4.13 Layar Admin & Pengaturan Lainnya

#### AdminPerusahaan

**Komponen:** `AdminPerusahaan.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Daftar Perusahaan | Nama, username, sektor industri, kontak, status |
| Form Registrasi | Nama perusahaan, username, password, email, telepon, sektor |
| Detail Profil | Profil lengkap perusahaan mitra |

#### AdminPengumuman

**Komponen:** `AdminPengumuman.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Daftar Pengumuman | Judul, tanggal publish, status (draft/published), aksi |
| Form Pengumuman | Judul, konten (rich text), target audiens, jadwal publish |
| Broadcast | Tombol "Kirim ke Semua Anggota" / target spesifik |

#### AdminTiket

**Komponen:** Referensi dari sidebar menu `tiket_admin`

| Elemen | Deskripsi |
|--------|-----------|
| Daftar Tiket | No tiket, subjek, anggota pengirim, status (open/in-progress/resolved), prioritas |
| Detail Tiket | Riwayat percakapan, form balasan |
| Aksi | Assign, ubah status, prioritas |

#### AdminAuditTrail

**Komponen:** `AdminAuditTrail.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Filter | Periode, user, jenis transaksi |
| Tabel | Timestamp, user, aksi, entitas, detail, IP address |
| Export | Tombol ekspor log audit |

#### AdminPDE (Kualitas Aktiva Produktif)

**Komponen:** `AdminPDE.tsx`

| Elemen | Deskripsi |
|--------|-----------|
| Ringkasan | Kategori aktiva: Lancar, Kurang Lancar, Diragukan, Macet |
| Tabel Detail | Daftar pinjaman per kategori kualitas |
| KPI | Persentase kolektibilitas, total aktiva produktif |

#### AdminDataMaster

**Komponen:** [AdminDataMaster.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminDataMaster.tsx)

| Sub-tab | Elemen |
|---------|--------|
| Pengurus | Nama, jabatan, periode, status. Form tambah/edit/delete |
| Karyawan | Nama, posisi, gaji, kontak. CRUD operations |
| Aset Barang | Nama aset, kategori, kondisi, nilai. CRUD operations |
| Sumber Bayar | Nama sumber, tipe, rekening. CRUD operations |
| User Management | Username, role, status akun. CRUD + assign role |

**Layout:** Tab horizontal di bagian atas, konten tab di bawah. Setiap tab memiliki tabel daftar + form inline untuk tambah/edit.

#### AdminTema

**Komponen:** [AdminTema.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/admin/AdminTema.tsx)

| Elemen | Deskripsi |
|--------|-----------|
| Header Banner | Judul "Kustomisasi Tema & Identitas Visual Koperasi" |
| Grid Tema | 2–3 kolom kartu tema preset |
| Setiap Kartu | Label, nama tema, deskripsi, preview warna, status (aktif/recommended) |
| Aksi | Klik kartu → terapkan tema secara real-time |

---

### 4.14 Portal Anggota

**Komponen:** [MemberPortal.tsx](file:///c:/Users/ASUS%20NUC/Desktop/Project%20Aplikasi/MetroCoop/apps/web/src/components/MemberPortal.tsx)

Portal anggota menggunakan layout yang sama (sidebar + header) dengan menu yang berbeda.

| Menu ID | Komponen | Deskripsi |
|---------|----------|-----------|
| `member_dashboard` | MemberDashboard | Ringkasan: total simpanan, pinjaman aktif, grafik saldo |
| `member_simpanan` | MemberSimpanan | Detail simpanan per jenis, mutasi terakhir |
| `member_pinjaman` | MemberPinjaman | Status pinjaman, jadwal angsuran, sisa pokok |
| `member_mutasi` | MemberLaporan | Daftar mutasi transaksi (setor/tarik/bayar) |
| `member_pengajuan` | MemberPengajuan | Form pengajuan pinjaman / penarikan baru |
| `member_tiket` | MemberTiket | Buat tiket bantuan, lihat riwayat |
| `member_bukti` | MemberUploadDokumen | Upload bukti transfer pembayaran |
| `member_profil` | MemberProfil | Ubah data profil: nama, alamat, foto |
| `member_ventura` | MemberVentura | Info investasi ventura aktif |
| `member_ventura_dokumen` | MemberUploadDokumen | Upload dokumen persyaratan ventura |
| `member_sewa` | MemberSewa | Sewa aset koperasi |
| `member_ppob` | MemberPpob | Loket PPOB & Pulsa |
| `member_digipay` | MemberDigipay | Virtual Account Deposit |
| `member_cicilan` | MemberCicilan | Kredit cicilan pengadaan |

---

## 5. Struktur Navigasi

### 5.1 Pohon Sidebar Admin/Operator

```
MetroCoop
├── [Brand Header: Logo + Nama + Sublabel]
│
├── MANAJEMEN UTAMA
│   ├── 📊 Dashboard Utama                    → dashboard
│   ├── 👥 Manajemen Anggota                  → anggota
│   ├── 🐷 Simpanan (Savings) [▼]
│   │   ├── • Setor & Tarik                   → simpanan_transaksi
│   │   ├── • Permohonan Tarik                → simpanan_permohonan
│   │   └── • Konfigurasi Simpanan            → simpanan_jenis
│   └── 🤝 Pinjaman (Loans) [▼]
│       ├── • Daftar Pengajuan                → pinjaman_pengajuan
│       ├── • Bayar Angsuran                  → pinjaman_angsuran
│       ├── • Tagihan & Jatuh Tempo           → pinjaman_tagihan
│       └── • Konfigurasi Pinjaman            → pinjaman_konfigurasi
│
├── UNIT USAHA (Business)
│   ├── 🏪 Unit Toko (POS) [▼]
│   │   ├── 🛒 Kasir POS Utama               → toko_kasir
│   │   ├── • Katalog Barang                  → toko_barang
│   │   ├── • Supplier & Pembelian            → toko_supplier
│   │   └── • Laporan Toko                   → toko_laporan
│   └── 🔑 Unit Tambahan [▼]
│       ├── 📺 Sewa Aset & Rental            → sewa_dashboard
│       ├── 📱 PPOB & Pulsa                  → ppob_dashboard
│       ├── 💳 Digital Payment               → digipay_dashboard
│       └── 🏆 Kredit & Pembiayaan           → pembiayaan_dashboard
│
├── INVESTASI & PENYERTAAN MODAL
│   ├── 📈 Modul Dashboard                   → ventura_analytics
│   ├── 🏢 Data Perusahaan                   → ventura_perusahaan
│   └── 🔀 Pipeline Investasi                → ventura_pipeline
│
├── AKUNTANSI & LAPORAN
│   ├── 📄 Pembukuan & Keuangan [▼]
│   │   ├── • Bagan Akun (COA)              → akuntansi_coa
│   │   ├── • Jurnal Umum                    → akuntansi_jurnal
│   │   ├── • Buku Besar                     → akuntansi_bukubesar
│   │   ├── • Neraca Saldo                   → akuntansi_neracasaldo
│   │   ├── • Sub Ledger Piutang             → subledger_piutang
│   │   ├── • Laporan Laba / Rugi            → laporan_labarugi
│   │   ├── • Laporan Neraca                 → laporan_neraca
│   │   ├── • Laba Bersih & SHU              → laporan_shu
│   │   ├── • Laporan Arus Kas               → laporan_aruskas
│   │   ├── • Kualitas Aktiva (PDE)          → laporan_pde
│   │   ├── • Rasio Keuangan                 → laporan_rasio
│   │   ├── • Periode & Tutup Buku           → akuntansi_periode
│   │   └── • Audit Trail Jurnal             → akuntansi_audit
│   ├── ⚙️ Kelola Pengumuman                 → pengumuman_admin
│   └── 🆘 Tiket & Pengaduan                 → tiket_admin
│
├── ───────────────────────── (separator)
│
├── 🏛️ Data Master Organisasi                → data_master
├── ⚙️ Pengaturan Koperasi [Admin only]      → pengaturan
├── 🎨 Kustomisasi Tema [Admin only]         → tema_tampilan
└── 🌐 Landing Page Editor [Admin only]      → landing_cms
```

### 5.2 Pohon Sidebar Anggota

```
Member Portal
├── 📊 Ringkasan Dashboard                   → member_dashboard
├── 🐷 Simpanan Saya                         → member_simpanan
├── 🤝 Pinjaman Saya                         → member_pinjaman
├── 📄 Mutasi Rekening                       → member_mutasi
├── 📝 Pengajuan Pinjam / Tarik              → member_pengajuan
├── 🆘 Tiket Bantuan (Helpdesk)              → member_tiket
├── 📎 Kirim Bukti Transfer                  → member_bukti
├── 🏆 Investasi Ventura Saya                → member_ventura
├── 📎 Upload Dokumen Ventura                → member_ventura_dokumen
├── 📺 Sewa Aset Koperasi                    → member_sewa
├── 📱 Loket PPOB & Pulsa                    → member_ppob
├── 💳 Virtual Account Deposit                → member_digipay
├── 🛒 Kredit Cicilan Pengadaan              → member_cicilan
└── 👤 Ubah Profil Saya                      → member_profil
```

### 5.3 Feature Toggle Matrix

| Modul | Admin | Operator | Anggota | Perusahaan |
|-------|:-----:|:--------:|:-------:|:----------:|
| Dashboard | ✓ | ✓ | ✓ | — |
| Manajemen Anggota | ✓ | ✓ | — | — |
| Simpanan | ✓ | ✓ | ✓ (pribadi) | — |
| Pinjaman | ✓ | ✓ | ✓ (pribadi) | — |
| Toko/POS | ✓ | ✓ | ✓ (pembeli) | — |
| Sewa Aset | ✓ | ✓ | ✓ | — |
| PPOB | ✓ | ✓ | ✓ | — |
| Digital Payment | ✓ | ✓ | ✓ | — |
| Pembiayaan | ✓ | ✓ | ✓ | — |
| Ventura/Investasi | ✓ | ✓ | ✓ | ✓ |
| Akuntansi/Laporan | ✓ | ✓ | — | — |
| Data Master | ✓ | ✓ | — | — |
| Pengaturan Sistem | ✓ | — | — | — |
| Kustomisasi Tema | ✓ | — | — | — |
| Landing Page Editor | ✓ | — | — | — |
| Tiket/Pengaduan | ✓ | ✓ | ✓ | ✓ |

---

## 6. Spesifikasi Formulir

### 6.1 Formulir Registrasi Anggota Baru

**Lokasi:** AdminAnggota → "Tambah Anggota Baru"

| Field | Tipe | Validasi | Required |
|-------|------|----------|:--------:|
| Nama Lengkap | text | Min 3 karakter | ✓ |
| NIK | text (mono) | 10 digit, unik | ✓ |
| No. HP | text | Format Indonesia (08xx) | ✓ |
| Alamat | textarea | Min 10 karakter | ✓ |
| Penghasilan | number (IDR) | Min Rp 0 | ✓ |
| Tanggal Lahir | date | Tidak boleh masa depan | — |
| Jenis Kelamin | select | Laki-laki / Perempuan | ✓ |
| Golongan Darah | select | A/B/AB/O | — |
| Pekerjaan | text | — | — |
| Status Kawin | select | Belum/Kawin/Cerai | — |
| Email | email | Format email valid | — |

### 6.2 Formulir Input Transaksi Simpanan

**Lokasi:** AdminSimpanan → "Setor" / "Tarik"

| Field | Tipe | Validasi | Required |
|-------|------|----------|:--------:|
| Anggota | searchable select | Harus ada di database | ✓ |
| Jenis Simpanan | select | Pokok/Wajib/Sukarela/Deposito | ✓ |
| Jumlah | number (IDR) | ≥ minimal setoran jenis | ✓ |
| Keterangan | text | — | — |
| Metode Bayar | select | Tunai/Transfer | ✓ |
| Bukti Bayar | file upload | JPG/PNG/PDF, max 2MB | — |

### 6.3 Formulir Pengajuan Pinjaman

**Lokasi:** AdminPinjaman → "Ajukan Pinjaman" / MemberPengajuan

| Field | Tipe | Validasi | Required |
|-------|------|----------|:--------:|
| Anggota | select (admin) / auto (member) | — | ✓ |
| Jenis Pinjaman | select | Dari daftar produk aktif | ✓ |
| Pokok Pinjaman | number (IDR) | ≤ maks plafon jenis | ✓ |
| Tenor | number (bulan) | ≤ maks tenor jenis | ✓ |
| Tujuan Pinjaman | textarea | — | ✓ |
| Agunan | textarea | Deskripsi agunan | — |
| Estimasi Angsuran | read-only | Auto-hitung | — |

### 6.4 Formulir Input Jurnal Manual

**Lokasi:** AdminJurnal → "Buat Jurnal Manual"

| Field | Tipe | Validasi | Required |
|-------|------|----------|:--------:|
| Tanggal | date | Tidak boleh > hari ini | ✓ |
| Keterangan | text | Min 5 karakter | ✓ |
| Baris Jurnal (N) | — | Minimal 2 baris | ✓ |
| → COA | searchable select | Dari Chart of Accounts | ✓ |
| → Debit | number (IDR) | ≥ 0 | — |
| → Kredit | number (IDR) | ≥ 0 | — |

**Validasi Khusus:**
- Total Debit harus sama dengan Total Kredit (selisih < Rp 0,01)
- Tombol "Simpan Jurnal" disabled jika tidak seimbang
- Indikator visual: hijau (seimbang) / merah (tidak seimbang)

### 6.5 Formulir Input Barang (POS)

**Lokasi:** AdminToko → "Katalog Barang" → "Tambah Barang"

| Field | Tipe | Validasi | Required |
|-------|------|----------|:--------:|
| Kode Barang | text (mono) | Unik, format koperasi | ✓ |
| Nama Barang | text | Min 2 karakter | ✓ |
| Kategori | select | Dari KategoriBarang | ✓ |
| Stok | number | Min 0 | ✓ |
| Satuan | text | pcs/kg/liter/box/pack | ✓ |
| Harga Beli | number (IDR) | > 0 | ✓ |
| Harga Jual | number (IDR) | ≥ Harga Beli | ✓ |
| Minimal Stok | number | Untuk alert stok rendah | — |
| Supplier | select | Dari daftar supplier | — |
| Barcode | text | Unik | — |
| Foto Produk | file upload | JPG/PNG, max 1MB | — |

---

## 7. Desain Responsif

### 7.1 Strategi Responsif

MetroCoop menggunakan pendekatan **mobile-first** dengan Tailwind CSS responsive prefixes. Semua komponen dirancang untuk tampil optimal di tiga tier:

| Tier | Width | Tailwind Prefix | Strategi Layout |
|------|-------|----------------|-----------------|
| **Mobile** | < 640px | Default | 1 kolom, sidebar overlay, tabel horizontal scroll, kartu stacking |
| **Tablet** | 640–1023px | `sm:` / `md:` | 2 kolom grid, sidebar overlay, tabel bisa penuh |
| **Desktop** | ≥ 1024px | `lg:` / `xl:` | 4 kolom grid, sidebar sticky, tabel penuh |

### 7.2 Perilaku Responsive per Kategori Layar

#### Landing Page

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Navbar | Hamburger menu | Hamburger + CTA | Full nav |
| Hero | 1 kolom, teks center | 2 kolom | 2 kolom (konten + kartu) |
| Features | 1 kolom | 2 kolom | 3–4 kolom |
| Team | 1 kolom | 2 kolom | 3–4 kolom |
| Pricing | 1 kolom | 2 kolom | 3 kolom |
| Contact | 1 kolom | 2 kolom | 2 kolom |

#### Login Screen

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | 1 kolom (branding atas, form bawah) | 2 kolom | 2 kolom max-w-5xl center |
| Branding | Tersembunyi di mobile ringkas | Tampil penuh | Tampil penuh |
| Form | Full-width px-4 | max-w-md | max-w-md |

#### Dashboard Admin

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| KPI Cards | 1 kolom | 2 kolom | 4 kolom |
| Chart + Org | 1 kolom stacking | 1 kolom | 8:4 kolom |
| Unit Usaha | 1 kolom | 2 kolom | 4 kolom |
| Tabel Pinjaman | Horizontal scroll | Full width | Full width |

#### AdminAnggota / Tabel CRUD

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Header | Stacking (judul + tombol) | Inline | Inline |
| Search | Full-width | Inline dengan tombol | Inline |
| Tabel | Horizontal scroll | Full width | Full width |
| Form Modal | Full-screen overlay | Centered modal | Centered modal |

#### AdminCOA (Tree View)

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Tree indent | 12px per level | 16px per level | 20px per level |
| Kolom | Kode + Nama saja | + Badge D/K | + Kategori + Aksi |
| Form Edit | Full-width di bawah | Side panel | Inline di bawah tree |

#### AdminToko (POS)

| Elemen | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | 1 kolom (keranjang atas, input bawah) | 2 kolom | 2 kolom |
| Keranjang | Full-width | 50% | 50% |
| Input Barang | Full-width | 50% | 50% |

---

## 8. Dark/Light Mode

### 8.1 Mekanisme Theme Switching

MetroCoop mendukung **4 tema preset** yang dapat ditukar tanpa reload:

1. **Penyimpanan:** Tema disimpan di `localStorage` dengan kunci `theme_preset`
2. **Penerapan:** Melalui atribut `data-theme` pada elemen `<html>`
3. **Trigger:** Toggle tombol Moon/Sun di footer sidebar atau halaman AdminTema

### 8.2 CSS Variable System

Setiap tema mendefinisikan variabel CSS yang sama dengan nilai berbeda:

```css
:root, [data-theme="heritage-light"] {
  --mc-bg: #f6f1e9;
  --mc-surface: #fffdf9;
  /* ... tokens lainnya ... */
}

[data-theme="midnight-heritage"] {
  --mc-bg: #0c1322;
  --mc-surface: #111c30;
  /* ... tokens lainnya ... */
}
```

### 8.3 Mapping Tema → Mode Terang/Gelap

| Tema | Mode | Karakteristik |
|------|------|---------------|
| Heritage Light | Terang | Krem + emas, background terang |
| Midnight Heritage | Gelap | Navy + emas, background gelap |
| Classic Royal Blue | Terang | Biru korporat, background putih |
| Teal Ocean | Terang | Teal marine, background hijau muda |

### 8.4 Komponen yang Terpengaruh

| Komponen | Token yang Digunakan |
|----------|---------------------|
| Sidebar | `--mc-sidebar`, `--mc-sidebar-ink`, `--mc-sidebar-active` |
| Header | `--mc-surface`, `--mc-border`, `--mc-ink-strong` |
| Kartu | `--mc-surface`, `--mc-border`, `--mc-ink` |
| Tabel | `--mc-surface-2`, `--mc-border`, `--mc-ink` |
| Tombol | `--mc-accent`, `--mc-on-accent`, `--mc-danger` |
| Badge | `--mc-success`, `--mc-success-bg`, `--mc-danger-bg` |
| Input | `--mc-surface`, `--mc-border`, `--mc-ink`, `--mc-ring` |
| Glassmorphism | `glass-card` (terang) / `dark-glass-card` (gelap) |

### 8.5 Dark Mode Toggle (Sidebar)

```tsx
// Di footer sidebar:
<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  {theme === 'light' ? <Moon /> : <Sun />}
</button>
```

**Catatan:** Toggle di sidebar hanya mengganti antara `light` ↔ `dark` (2 mode). Untuk memilih salah satu dari 4 preset tema, gunakan halaman AdminTema (Kustomisasi Tema).

---

## 9. Aksesibilitas

### 9.1 Standar yang Diterapkan

MetroCoop mematuhi **WCAG 2.1 Level AA** dengan ketentuan:

### 9.2 Checklist Kepatuhan WCAG 2.1 AA

| No | Kriteria WCAG | Status | Implementasi |
|----|---------------|:------:|-------------|
| 1 | **1.1.1 Non-text Content** | ✓ | Semua ikon memiliki atribut `aria-label` atau teks alternatif |
| 2 | **1.3.1 Info and Relationships** | ✓ | Menggunakan heading hierarchy (h1→h2→h3), tabel dengan `<th>` |
| 3 | **1.4.1 Use of Color** | ✓ | Status ditampilkan dengan teks + ikon, bukan hanya warna |
| 4 | **1.4.3 Contrast Minimum** | ✓ | Kontras teks ≥ 4.5:1 untuk teks normal, ≥ 3:1 untuk teks besar |
| 5 | **1.4.4 Resize Text** | ✓ | Teks dapat di-scale hingga 200% tanpa kehilangan fungsi |
| 6 | **1.4.10 Reflow** | ✓ | Konten reflow pada 320px tanpa horizontal scroll (kecuali tabel data) |
| 7 | **2.1.1 Keyboard** | ✓ | Seluruh navigasi dan interaksi dapat dilakukan dengan keyboard |
| 8 | **2.1.2 No Keyboard Trap** | ✓ | Tidak ada elemen yang menjebak fokus keyboard |
| 9 | **2.4.1 Bypass Blocks** | ✓ | Skip navigation via sidebar langsung ke konten |
| 10 | **2.4.3 Focus Order** | ✓ | Urutan fokus mengikuti urutan visual (tabindex natural) |
| 11 | **2.4.7 Focus Visible** | ✓ | Outline fokus menggunakan `.mc-focus:focus-visible` dengan `outline: 2px solid var(--mc-ring)` |
| 12 | **3.3.1 Error Identification** | ✓ | Error validasi ditampilkan dengan teks + warna + ikon |
| 13 | **3.3.2 Labels or Instructions** | ✓ | Setiap input memiliki `<label>` yang terkait |
| 14 | **4.1.2 Name, Role, Value** | ✓ | Komponen interaktif menggunakan elemen HTML semantic |

### 9.3 Focus Management

```css
/* Dari tokens.css */
.mc-focus:focus-visible,
.mc-btn-primary:focus-visible,
.mc-btn-danger:focus-visible,
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid var(--mc-ring);
  outline-offset: 2px;
}
```

### 9.4 ARIA Labels pada Komponen Kunci

| Komponen | Atribut ARIA |
|----------|-------------|
| Tombol hamburger sidebar | `aria-label="Buka menu"` |
| Tombol tutup sidebar | `aria-label="Tutup menu"` |
| Toggle show/hide password | `aria-label="Sembunyikan/Tampilkan kata sandi"` |
| Tombol notifikasi | `aria-label="Notifikasi & pengaduan"` |
| Tombol ganti tema | `aria-label="Ganti Tema"` |

### 9.5 Kontras Warna per Tema

| Tema | Teks di Atas Background | Rasio Kontras |
|------|------------------------|---------------|
| Heritage Light | `#2c2820` di atas `#fffdf9` | ~13.5:1 ✓ |
| Midnight Heritage | `#dde3ee` di atas `#111c30` | ~10.2:1 ✓ |
| Royal Blue | `#334155` di atas `#ffffff` | ~7.8:1 ✓ |
| Teal Ocean | `#334155` di atas `#ffffff` | ~7.8:1 ✓ |

### 9.6 Responsive Accessibility

- **Touch targets:** Minimum 44×44px untuk semua tombol interaktif di mobile
- **Scroll behavior:** Tabel data panjang menggunakan horizontal scroll dengan indikator visual
- **Content reflow:** Pada viewport 320px, konten tetap terbaca tanpa zoom
- **Motion:** Animasi dapat dikurangi via `prefers-reduced-motion` media query

---

## 10. Lampiran

### 10.1 Daftar Komponen UI

| No | Komponen | File | Deskripsi |
|----|----------|------|-----------|
| 1 | MetroKspLandingPage | `pages/MetroKspLandingPage.tsx` | Landing page publik (CMS-editable) |
| 2 | LoginScreen | `components/LoginScreen.tsx` | Layar autentikasi multi-portal |
| 3 | Sidebar | `components/Sidebar.tsx` | Navigasi samping collapsible |
| 4 | Header | `components/Header.tsx` | Header atas sticky dengan informasi konteks |
| 5 | AdminDashboard | `components/admin/AdminDashboard.tsx` | Dashboard utama admin |
| 6 | AdminAnggota | `components/admin/AdminAnggota.tsx` | Manajemen data anggota |
| 7 | AdminPerusahaan | `components/admin/AdminPerusahaan.tsx` | Manajemen perusahaan mitra |
| 8 | AdminSimpanan | `components/admin/AdminSimpanan.tsx` | Transaksi & konfigurasi simpanan |
| 9 | AdminPinjaman | `components/admin/AdminPinjaman.tsx` | Pengajuan, angsuran, konfigurasi pinjaman |
| 10 | AdminPembiayaan | `components/admin/AdminPembiayaan.tsx` | Sistem kredit & pembiayaan |
| 11 | AdminCOA | `components/admin/AdminCOA.tsx` | Bagan akun hierarkis 6 level |
| 12 | AdminJurnal | `components/admin/AdminJurnal.tsx` | Jurnal umum + entri manual |
| 13 | AdminBukuBesar | `components/admin/AdminBukuBesar.tsx` | Buku besar (general ledger) |
| 14 | AdminNeracaSaldo | `components/admin/AdminNeracaSaldo.tsx` | Neraca saldo (trial balance) |
| 15 | AdminArusKas | `components/admin/AdminArusKas.tsx` | Laporan arus kas |
| 16 | AdminRasio | `components/admin/AdminRasio.tsx` | Rasio keuangan koperasi |
| 17 | AdminTutupBuku | `components/admin/AdminTutupBuku.tsx` | Wizard tutup buku periode |
| 18 | AdminLaporan | `components/admin/AdminLaporan.tsx` | Laporan laba/rugi, neraca, SHU |
| 19 | AdminSubLedger | `components/admin/AdminSubLedger.tsx` | Sub ledger piutang anggota |
| 20 | AdminToko | `components/admin/AdminToko.tsx` | POS/Retail — kasir, barang, supplier |
| 21 | AdminPpob | `components/admin/AdminPpob.tsx` | Transaksi PPOB |
| 22 | AdminPPOBDashboard | `components/admin/AdminPPOBDashboard.tsx` | Dashboard PPOB |
| 23 | AdminDigipay | `components/admin/AdminDigipay.tsx` | Digital Payment & Virtual Account |
| 24 | AdminSewa | `components/admin/AdminSewa.tsx` | Sewa aset & rental |
| 25 | AdminCicilanDashboard | `components/admin/AdminCicilanDashboard.tsx` | Dashboard cicilan pengadaan |
| 26 | AdminVentura | `components/admin/AdminVentura.tsx` | Modul pembiayaan venture |
| 27 | AdminVentureDashboard | `components/admin/AdminVentureDashboard.tsx` | Dashboard investasi |
| 28 | AdminPipelineVentura | `components/admin/AdminPipelineVentura.tsx` | Pipeline investasi terpadu |
| 29 | AdminPengajuanVentura | `components/admin/AdminPengajuanVentura.tsx` | Pengajuan pembiayaan + AI scoring |
| 30 | AdminDataMaster | `components/admin/AdminDataMaster.tsx` | Data master: pengurus, karyawan, aset, sumber bayar |
| 31 | AdminPengumuman | `components/admin/AdminPengumuman.tsx` | Manajemen pengumuman & broadcast |
| 32 | AdminAuditTrail | `components/admin/AdminAuditTrail.tsx` | Audit log viewer |
| 33 | AdminPDE | `components/admin/AdminPDE.tsx` | Kualitas aktiva produktif |
| 34 | AdminTema | `components/admin/AdminTema.tsx` | Kustomisasi tema visual |
| 35 | MemberPortal | `components/MemberPortal.tsx` | Portal mandiri anggota |
| 36 | MemberPerusahaanPortal | `components/MemberPerusahaanPortal.tsx` | Portal perusahaan mitra |

### 10.2 Daftar Sub-komponen Landing Page

| No | Komponen | File |
|----|----------|------|
| 1 | Navbar | `components/landingMetroKSP/Navbar.tsx` |
| 2 | HeroSection | `components/landingMetroKSP/HeroSection.tsx` |
| 3 | FeaturesGrid | `components/landingMetroKSP/FeaturesGrid.tsx` |
| 4 | TeamGrid | `components/landingMetroKSP/TeamGrid.tsx` |
| 5 | TestimonialSlider | `components/landingMetroKSP/TestimonialSlider.tsx` |
| 6 | PricingTable | `components/landingMetroKSP/PricingTable.tsx` |
| 7 | ContactFooter | `components/landingMetroKSP/ContactFooter.tsx` |
| 8 | defaultData | `components/landingMetroKSP/defaultData.ts` |
| 9 | metroksp.css | `components/landingMetroKSP/metroksp.css` |

### 10.3 Daftar Komponen Portal Anggota

| No | Komponen | File |
|----|----------|------|
| 1 | MemberDashboard | `components/member/MemberDashboard.tsx` |
| 2 | MemberSimpanan | `components/member/MemberSimpanan.tsx` |
| 3 | MemberPinjaman | `components/member/MemberPinjaman.tsx` |
| 4 | MemberLaporan | `components/member/MemberLaporan.tsx` |
| 5 | MemberPengajuan | `components/member/MemberPengajuan.tsx` |
| 6 | MemberTiket | `components/member/MemberTiket.tsx` |
| 7 | MemberProfil | `components/member/MemberProfil.tsx` |
| 8 | MemberVentura | `components/member/MemberVentura.tsx` |
| 9 | MemberSewa | `components/member/MemberSewa.tsx` |
| 10 | MemberPpob | `components/member/MemberPpob.tsx` |
| 11 | MemberDigipay | `components/member/MemberDigipay.tsx` |
| 12 | MemberCicilan | `components/member/MemberCicilan.tsx` |
| 13 | MemberUploadDokumen | `components/member/MemberUploadDokumen.tsx` |
| 14 | MemberPengumuman | `components/member/MemberPengumuman.tsx` |
| 15 | MemberDividen | `components/member/MemberDividen.tsx` |
| 16 | MemberToko | `components/member/MemberToko.tsx` |
| 17 | MemberPipelineInvestasi | `components/member/MemberPipelineInvestasi.tsx` |
| 18 | MemberPerusahaanDashboard | `components/member/MemberPerusahaanDashboard.tsx` |
| 19 | MemberPerusahaanProfil | `components/member/MemberPerusahaanProfil.tsx` |
| 20 | MemberPerusahaanTiket | `components/member/MemberPerusahaanTiket.tsx` |

### 10.4 Infrastruktur Pendukung

| File | Deskripsi |
|------|-----------|
| `styles/tokens.css` | Design tokens CSS (variabel warna, utility classes mc-*) |
| `theme/theme.ts` | Definisi 4 tema preset + fungsi apply/get/init |
| `theme/ThemeProvider.tsx` | React context provider untuk tema |
| `index.css` | Import Google Fonts + Tailwind + animasi kustom |
| `stores/authStore.ts` | Zustand store untuk autentikasi |
| `stores/dataStore.ts` | Zustand store untuk data aplikasi |
| `lib/api.ts` | API client untuk komunikasi backend |
| `types.ts` | Re-export tipe data dari shared package |

---

### 10.5 Tabel Persetujuan (Sign-off)

| No | Role | Nama | Tanggal | Tanda Tangan | Status |
|----|------|------|---------|:------------:|:------:|
| 1 | Product Owner | _________________ | __ / __ / 2026 | _____________ | ☐ Disetujui |
| 2 | UI/UX Designer | _________________ | __ / __ / 2026 | _____________ | ☐ Disetujui |
| 3 | Lead Developer | _________________ | __ / __ / 2026 | _____________ | ☐ Disetujui |
| 4 | QA Lead | _________________ | __ / __ / 2026 | _____________ | ☐ Disetujui |
| 5 | Project Manager | _________________ | __ / __ / 2026 | _____________ | ☐ Disetujui |

---

**Catatan Akhir:**

Dokumen ini bersifat *living document* dan akan diperbarui seiring perkembangan aplikasi. Setiap perubahan signifikan pada UI/UX harus didokumentasikan di sini dan mendapat persetujuan dari Product Owner dan UI/UX Designer.

**Riwayat Perubahan:**

| Versi | Tanggal | Perubahan | Oleh |
|-------|---------|-----------|------|
| 1.0 | 11 Juli 2026 | Dokumen awal | Tim MetroCoop |
| 2.0 | 16 Juli 2026 | Pembaruan komprehensif: 4 tema, seluruh layar, wireframe ASCII, checklist aksesibilitas | Tim MetroCoop |

---

*Dokumen ini merupakan bagian dari dokumentasi teknis MetroCoop — Sistem Informasi Koperasi Simpan Pinjam Terintegrasi.*