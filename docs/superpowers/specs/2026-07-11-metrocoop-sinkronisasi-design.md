# Desain Sinkronisasi & Perapian Menyeluruh Aplikasi MetroCoop

**Tanggal:** 2026-07-11
**Penulis:** Trae Design (brainstorming)
**Status:** Draft untuk review pengguna
**Cakupan:** 5 poin permintaan pengguna — analisa mendalam, rapikan, lengkapi, perbaiki error, sinkronkan, hapus, lalu QC.

---

## 1. Ringkasan Eksekutif

Pengguna punya beberapa proyek terpisah untuk brand yang sama (MetroCoop / MetroKSP) di folder `Project Aplikasi/`. Tujuannya: jadikan aplikasi utama `MetroCoop/` sebagai **satu sumber kebenaran** yang rapi, stabil, dan konsisten, lalu sinkronkan landing page dan mobile app ke sana. Proyek sampingan yang tidak terpakai dihapus.

**Hasil akhir yang diharapkan:**
- `MetroCoop/` = repo tunggal (sudah di GitHub `andiwilyam/METROKoperasi`), full-stack rapi & stabil.
- Landing page HTML (`Landing Page Aplikasi MetroCoop/`) = brand MetroKSP asli, terhubung ke aplikasi utama.
- `PROJECT METRO KSP/` (Laravel) & `MetroCoop From Google AI Studio/` = **dihapus** (backup dulu).
- QC lulus: typecheck, unit test, browser test semua role.

---

## 2. Konteks & Inventaris Proyek

| # | Path | Teknologi | Peran | Tindakan |
|---|------|-----------|-------|----------|
| 1 | `MetroCoop/` | Monorepo: Express + React web + React Native (Expo) + Postgres | **Aplikasi utama (sumber kebenaran)** | Analisa, rapikan, lengkapi, sinkron |
| 2 | `Landing Page Aplikasi MetroCoop/` | HTML/CSS/JS (template VaultEdge) | Landing page MetroKSP | Perbaiki brand + hubungkan ke #1 |
| 3 | `apps/mobile/` (dalam #1) | React Native + Expo | Mobile app | Pastikan API base → server #1 |
| 4 | `PROJECT METRO KSP/` | Laravel/Filament (PHP) | Sistem KSP terpisah | **HAPUS** (backup dulu) |
| 5 | `MetroCoop From Google AI Studio/` | Ekspor AI Studio lama | Duplikat usang | **HAPUS** (backup dulu) |
| — | `metrocoop (2).zip`, `MetroCoop-BACKUP-*.zip` | Arsip | Backup lama | Biarkan/tidak disentuh |

**Temuan kritis dari bedah:**
- README `MetroCoop/` masih template Google AI Studio (belum diedit).
- `MetroCoop/` **sudah punya landing page internal** (`pages/MetroKspLandingPage.tsx` + folder `landingMetroKSP/`) — sehingga ada 2 landing page (internal React + eksternal HTML) dengan brand berbeda.
- Landing page HTML masih 100% brand VaultEdge (AS), sudah ada evaluasi desain 24 temuan (`docs/superpowers/specs/2026-07-11-metroksp-evaluasi-design.md`).
- Mobile app navigasi siap, butuh `EXPO_PUBLIC_API_BASE` untuk arahkan ke server.

---

## 3. Prinsip & Batasan (YAGNI)

- **TIDAK ada fitur baru** di luar yang sudah ada. Hanya: stabilkan, lengkapi stub, samakan brand, rapikan struktur, hapus sampingan.
- **TIDAK mengubah skema database** secara breaking (migrasi tetap idempoten).
- **TIDAK commit file `.env` / rahasia** (sudah di-.gitignore).
- Penamaan brand: **MetroCoop** = nama sistem/perangkat lunak; **MetroKSP** = brand Koperasi Simpan Pinjam (sesuai landing page). Konsistensi: sistem pakai "MetroCoop", publikasi/landing pakai "MetroKSP".

---

## 4. Desain per Bagian

### 4.1 Backend (`MetroCoop/server/`, `packages/shared/`)

**Tujuan:** stabil, validasi ketat, data scoping benar, laporan riil.

- **Error & validasi:** pastikan semua route `data.ts`/`auth.ts` pakai Zod (sudah sebagian). Cek error 500 pada endpoint yang belum terjamin (pengajuan pembiayaan, ventura, perusahaan).
- **Data scoping:** pastikan role `anggota`, `anggota_perusahaan`, `admin`, `operator` membatasi data sesuai `member_id`/`created_by` (sudah diperbaiki sebelumnya — verifikasi ulang).
- **Laporan keuangan:** endpoint `/laporan/rasio`, neraca, laba-rugi mengembalikan kalkulasi riil dari jurnal + pinjaman (sudah sebagian — verifikasi & lengkapi yang kurang).
- **API client (`packages/shared/src/api/client.ts`):** default same-origin relatif (sudah diperbaiki dari hardcode IP — pertahankan).
- **README `MetroCoop/README.md`:** ganti dari template AI Studio menjadi dokumentasi nyata (cara jalan, struktur monorepo, env vars).

**Success criteria:** `npm run typecheck` lulus; semua endpoint inti merespons 200 dengan data riil; role salah ditolak 403.

### 4.2 Frontend Web (`MetroCoop/apps/web/src/`)

**Tujuan:** semua menu di sidebar punya halaman; modul stub dilengkapi; brand konsisten.

- **Sidebar & routing:** cek tiap item menu (`DashboardApp.tsx`, `Sidebar.tsx`) → pastikan semua punya komponen tujuan, tidak ada yang mengarah ke halaman kosong.
- **Modul stub:** identifikasi & lengkapi halaman yang masih placeholder (mis. sebagian di `AdminPortal.tsx`, portal perusahaan, unit tambahan).
- **Brand:** samakan "MetroCoop" vs "MetroKSP" antar komponen; logo/heading konsisten.
- **Landing page internal:** `MetroKspLandingPage.tsx` dipertahankan sebagai landing dalam-aplikasi; pastikan路由 ke login benar.
- **Login & portal:** verifikasi tab Admin/Anggota/Perusahaan (`LoginScreen.tsx`) — akun: admin, operator, anggota, perusahaan (sudah dibuat).

**Success criteria:** tiap menu sidebar terbuka tanpa error; tidak ada halaman kosong; brand seragam.

### 4.3 Mobile App (`MetroCoop/apps/mobile/`)

**Tujuan:** sinkron ke server utama.

- Pastikan `EXPO_PUBLIC_API_BASE` (atau `getApiBase()` di `App.tsx`) menunjuk ke `http://localhost:3000` saat dev, atau diisi URL deploy nanti.
- Tes login mobile → server utama → data scoping jalan.
- (Tanpa perubahan besar; hanya pastikan koneksi & login.)

### 4.4 Landing Page HTML (`Landing Page Aplikasi MetroCoop/`)

**Tujuan:** jadi brand MetroKSP asli, terhubung ke aplikasi utama (tetap repo/folder terpisah — pilihan pengguna opsi B).

- **Brand & visual:** ganti identitas VaultEdge → MetroKSP (nama, logo SVG koin, warna `#0e3d30`/emas, copywriting Bahasa Indonesia, kontak & alamat Indonesia, klaim OJK).
- **Konten:** sesuaikan metrik, testimoni, layanan KSP (simpanan, pinjaman, ventura) — pakai evaluasi desain 24 temuan sebagai panduan.
- **Integrasi:** tambah CTA "Masuk Aplikasi" / "Login Back Office" → `http://localhost:3000` (atau domain nanti). Tombol harus terlihat jelas.
- **README:** ganti dari template VaultEdge → dokumentasi MetroKSP.

**Success criteria:** tidak ada sisa merek VaultEdge; CTA mengarah ke aplikasi utama; responsif & aksesibel.

### 4.5 Penghapusan Sampingan (Poin 4 & 5)

- **Backup dulu:** zip `PROJECT METRO KSP/` → `PROJECT-METRO-KSP-BACKUP-2026-07-11.zip`; zip `MetroCoop From Google AI Studio/` → `MetroCoop-AIStudio-BACKUP-2026-07-11.zip` (di luar folder yang dihapus, mis. di `Project Aplikasi/`).
- **Hapus:** kedua folder asli dari disk.
- **TIDAK** menghapus `MetroCoop/`, `Landing Page Aplikasi MetroCoop/`, atau file `.zip` backup lama.

---

## 5. Urutan Eksekusi (fase)

1. **Fase 0 — Backup:** zip 2 proyek sampingan (sebelum sentuh apa pun).
2. **Fase 1 — Backend:** perbaiki error/validasi, verifikasi scoping & laporan riil, perbaiki README.
3. **Fase 2 — Frontend web:** lengkapi modul stub, rapikan sidebar/routing, samakan brand.
4. **Fase 3 — Mobile:** pastikan API base & tes login.
5. **Fase 4 — Landing page HTML:** ganti brand MetroKSP, tambah CTA ke aplikasi utama, perbaiki README.
6. **Fase 5 — Hapus sampingan:** hapus 2 folder (sudah dibackup).
7. **Fase 6 — Sinkron GitHub:** `git sync` perubahan `MetroCoop/`; landing page push ke repo/branch masing-masing.
8. **Fase 7 — QC:** lihat di bawah.

---

## 6. Quality Check (QC) — Poin 6

Setelah semua perubahan:

- **Static:** `npm run typecheck` (MetroCoop) lulus tanpa error.
- **Unit:** `npm run test` (vitest) lulus.
- **Server:** `npm run dev` jalan; login ke-4 role sukses (admin/operator/anggota/perusahaan).
- **Modul:** tiap menu sidebar dibuka → tidak error, tidak kosong.
- **Data scoping:** anggota hanya lihat data sendiri; role salah → 403.
- **Landing:** brand MetroKSP benar; CTA → aplikasi utama.
- **Integrasi:** mobile login → server utama sukses.
- **Repo:** `git status` bersih di kedua proyek; tidak ada `.env` ter-commit.

---

## 7. Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Hapus folder salah | Backup `.zip` dulu; hanya hapus 2 folder yang disepakati (C) |
| Breaking change DB | Migrasi idempoten; tidak ubah skema breaking |
| Duplikasi landing page (internal vs HTML) | Internal dipertahankan sbg dalam-app; HTML sbg publikasi eksternal — keduanya brand MetroKSP |
| Konflik push (2 mesin) | Automation auto-push hanya di mesin ini; metrokompedia manual pull |

---

## 8. Di Luar Cakupan (Explicitly Excluded)

- Fitur baru (PPOB, AI audit lanjutan, dsb) — hanya yang sudah ada.
- Deploy ke production / domain nyata (hanya siapkan CTA localhost).
- Perubahan besar pada logika bisnis akuntansi (hanya verifikasi & lengkapi yang ada).
- Penggabungan landing page HTML ke dalam repo utama (pengguna pilih opsi B = terpisah).
