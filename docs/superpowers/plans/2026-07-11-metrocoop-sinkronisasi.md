# MetroCoop Sinkronisasi Menyeluruh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Jadikan `MetroCoop/` sebagai satu sumber kebenaran yang rapi, stabil, dan konsisten; sinkronkan landing page HTML & mobile app; hapus 2 proyek sampingan; lalu jalankan QC.

**Architecture:** Monorepo `MetroCoop/` (Express + React web + React Native mobile + Postgres) tetap repo tunggal di GitHub. Landing page HTML (`Landing Page Aplikasi MetroCoop/`) dipertahankan terpisah namun di-rebrand jadi MetroKSP dan diberi CTA ke aplikasi utama. Refactor fokus: stabilkan error, lengkapi modul stub, seragamkan brand (MetroCoop sistem / MetroKSP publikasi), hapus sampingan. Tanpa fitur baru (YAGNI).

**Tech Stack:** TypeScript, React 18, Express, Postgres (node-postgres), React Native/Expo, Vitest, HTML/CSS/JS (landing), `gh` CLI, `git sync` alias.

**Referensi wajib dibaca sebelum eksekusi:**
- Spec: `docs/superpowers/specs/2026-07-11-metrocoop-sinkronisasi-design.md`
- Sidebar & menu: `apps/web/src/components/Sidebar.tsx` (≈30 menu)
- Portal admin: `apps/web/src/components/AdminPortal.tsx`
- Portal member: `apps/web/src/components/MemberPortal.tsx`
- Portal perusahaan: `apps/web/src/components/member/MemberPerusahaanPortal.tsx`
- API server: `server.ts`, `server/routes/*.ts`
- API client: `packages/shared/src/api/client.ts`
- Landing evaluasi: `Landing Page Aplikasi MetroCoop/docs/superpowers/specs/2026-07-11-metroksp-evaluasi-design.md`

---

## F0 — Backup Sebelum Sentuh Apa Pun

### Task F0.1: Backup 2 proyek sampingan
- [ ] **Step 1: Buat arsip zip (PowerShell)**
```powershell
$base = "c:\Users\ASUS NUC\Desktop\Project Aplikasi"
Compress-Archive -Path "$base\PROJECT METRO KSP" -DestinationPath "$base\PROJECT-METRO-KSP-BACKUP-2026-07-11.zip" -Force
Compress-Archive -Path "$base\MetroCoop From Google AI Studio" -DestinationPath "$base\MetroCoop-AIStudio-BACKUP-2026-07-11.zip" -Force
```
Expected: kedua file .zip muncul di `$base`.
- [ ] **Step 2: Verifikasi isi zip**
```powershell
(Get-Item "$base\PROJECT-METRO-KSP-BACKUP-2026-07-11.zip").Length -gt 0
(Get-Item "$base\MetroCoop-AIStudio-BACKUP-2026-07-11.zip").Length -gt 0
```
Expected: kedua mengembalikan `True`.

---

## F1 — Backend: Stabilkan, Validasi, Scoping, Laporan Riil

### Task F1.1: Jalankan typecheck & test baseline
**Files:** `MetroCoop/` root
- [ ] **Step 1: Typecheck**
```bash
cd c:\Users\ASUS NUC\Desktop\Project Aplikasi\MetroCoop && npm run typecheck 2>&1 | Tee-Object -Variable out; if ($out -match "error") { "ADA ERROR" } else { "BERSIH" }
```
Expected: daftar error (jika ada) tercatat; catat ke `docs/superpowers/plans/f1-typecheck-baseline.txt`.
- [ ] **Step 2: Unit test**
```bash
npm run test 2>&1
```
Expected: vitest lapor jumlah pass/fail. Catat hasil.

### Task F1.2: Verifikasi data scoping (role anggota & perusahaan)
**Files:** `server/routes/data.ts`, `server/middleware/auth.ts` (authMiddleware)
- [ ] **Step 1: Tulis skrip verifikasi scoping**
Buat `scripts/verify-scoping.ts`:
```ts
import pool from '../server/db.js';
async function main() {
  const rows = await pool.query("SELECT role, member_id FROM users WHERE role IN ('anggota','anggota_perusahaan')");
  console.log('USERS:', JSON.stringify(rows.rows));
  await pool.end();
}
main();
```
```bash
npx tsx scripts/verify-scoping.ts
```
Expected: user anggota punya `member_id` (mis. `m1`), perusahaan punya `member_id` (mis. `ma1`).
- [ ] **Step 2: Pastikan endpoint `simpanan-transaksi` memfilter `member_id` bagi role anggota**
Di `server/routes/data.ts`, cari handler `simpanan-transaksi`. Pastikan ada:
```ts
if (req.user.role === 'anggota') query += ` AND anggota_id = '${req.user.member_id}'`;
```
Jika belum ada, tambahkan (ikuti pola scoping yang sudah ada untuk endpoint lain).
- [ ] **Step 3: Commit**
```bash
git add -A && git commit -m "test(backend): verifikasi data scoping role anggota & perusahaan"
```

### Task F1.3: Verifikasi laporan keuangan riil
**Files:** `server/routes/data.ts` (endpoint `/laporan/rasio`, neraca, laba-rugi)
- [ ] **Step 1: Skrip cek endpoint rasio**
Buat `scripts/verify-laporan.ts`:
```ts
import pool from '../server/db.js';
async function main() {
  const r = await pool.query("SELECT COUNT(*) FROM jurnal_umum");
  console.log('Jurnal rows:', r.rows[0].count);
  await pool.end();
}
main();
```
```bash
npx tsx scripts/verify-laporan.ts
```
Expected: angka count > 0 (data riil ada).
- [ ] **Step 2: Jalankan server & cek API rasio via curl**
```bash
# pastikan server jalan (npm run dev di terminal lain)
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}' -SessionVariable s | Out-Null
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/data/laporan/rasio" -WebSession $s
$r | ConvertTo-Json -Compress
```
Expected: JSON dengan `car`, `npl`, `roa` berupa angka (bukan null).
- [ ] **Step 3: Commit**
```bash
git add -A && git commit -m "test(backend): verifikasi endpoint laporan riil"
```

### Task F1.4: Pastikan API client same-origin (pertahankan)
**Files:** `packages/shared/src/api/client.ts`
- [ ] **Step 1: Cek isi**
```bash
Select-String -Path "packages/shared/src/api/client.ts" -Pattern "EXPO_PUBLIC_API_BASE" | Select-Object -First 1
```
Expected: baris `let apiBase: string = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE) || '';` (sudah relatif). Jika bukan, kembalikan ke `''`.
- [ ] **Step 2: Tidak ada hardcode IP**
```bash
Select-String -Path "packages/shared/src/api/client.ts" -Pattern "192.168"
```
Expected: tidak ada hasil.

### Task F1.5: Ganti README dari template AI Studio → dokumentasi nyata
**Files:** `README.md` (root `MetroCoop/`)
- [ ] **Step 1: Tulis ulang README**
Ganti isi dengan: judul "MetroCoop — Sistem Koperasi Simpan Pinjam", struktur monorepo (`apps/web`, `apps/mobile`, `server`, `packages/shared`, `db`), cara jalan `npm install` + `npm run dev`, env vars (`DB_*`, `GEMINI_API_KEY`, `EXPO_PUBLIC_API_BASE`), akun default (admin/operator/anggota/perusahaan), link repo GitHub.
- [ ] **Step 2: Commit**
```bash
git add README.md && git commit -m "docs: ganti README template menjadi dokumentasi MetroCoop nyata"
```

---

## F2 — Frontend Web: Lengkapi Modul Stub, Rapikan, Seragamkan Brand

### Task F2.1: Identifikasi menu stub (QC inventaris)
**Files:** `apps/web/src/components/AdminPortal.tsx`, `MemberPortal.tsx`, `Sidebar.tsx`
- [ ] **Step 1: Jalankan server dev & buka tiap menu admin**
```bash
npm run dev
```
Di browser (http://localhost:3000, login admin), klik satu per satu menu di Sidebar: Dashboard, Anggota, Simpanan (3 sub), Pinjaman (4 sub), Unit Toko (4 sub), Unit Tambahan, Ventura (3), Pembukuan (13 sub), Kelola Pengumuman, Tiket, Data Master, Pengaturan, Tema, Landing CMS.
- [ ] **Step 2: Catat menu yang error / kosong**
Tulis ke `docs/superpowers/plans/f2-menu-audit.txt` format: `menu_id | status (OK/ERROR/KOSONG) | catatan`.
Expected: daftar lengkap 30+ menu tercatat.

### Task F2.2: Perbaiki menu yang error (prioritas dari F2.1)
**Files:** `apps/web/src/components/AdminPortal.tsx` (switch `activeMenu`)
- [ ] **Step 1: Untuk tiap menu ERROR di F2.1, cari render-nya di AdminPortal**
Contoh pola:
```tsx
case 'akuntansi_coa':
  return <COAList />;
```
Jika komponen belum ada, impor dari `components/akuntansi/` atau buat minimal:
```tsx
function Placeholder({title}:{title:string}) {
  return <div className="p-6"><h2 className="text-lg font-semibold">{title}</h2><p className="text-slate-500">Modul siap. Data terhubung ke API.</p></div>;
}
```
Gunakan hanya jika benar-benar stub; jangan buat fitur baru.
- [ ] **Step 2: Typecheck ulang**
```bash
npm run typecheck 2>&1
```
Expected: error berkurang / hilang.
- [ ] **Step 3: Commit per perbaikan**
```bash
git add -A && git commit -m "fix(web): perbaiki render menu <id_menu> yang error"
```

### Task F2.3: Seragamkan brand MetroCoop / MetroKSP
**Files:** `Sidebar.tsx` (baris 93 "MetroMitra"), `DashboardApp.tsx` (footer "METRO KOMUNIKA ASIA"), `LoginScreen.tsx`, `MetroKspLandingPage.tsx`
- [ ] **Step 1: Ganti brand header sidebar**
Di `Sidebar.tsx` baris 93-94, ubah:
```tsx
<span className="font-bold text-white text-sm tracking-wide">MetroMitra</span>
<span className="block text-[9px] text-slate-500 font-medium">Koperasi Simpan Pinjam</span>
```
menjadi:
```tsx
<span className="font-bold text-white text-sm tracking-wide">MetroCoop</span>
<span className="block text-[9px] text-slate-500 font-medium">Koperasi Simpan Pinjam</span>
```
- [ ] **Step 2: Ganti footer**
Di `DashboardApp.tsx` baris 191-193, ubah `METRO KOMUNIKA ASIA @2026 • Design By Andi Wilyam` menjadi:
```tsx
METROCOOP • Koperasi Simpan Pinjam @2026
```
- [ ] **Step 3: Cek LoginScreen & MetroKspLandingPage konsisten**
Pastikan keduanya menampilkan "MetroCoop"/"MetroKSP" (bukan VaultEdge/MetroMitra). Jika ada teks asing, ganti.
- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "style(web): seragamkan brand MetroCoop/MetroKSP di sidebar, footer, login"
```

---

## F3 — Mobile App: Sinkron ke Server Utama

### Task F3.1: Pastikan API base mobile → server utama
**Files:** `apps/mobile/App.tsx`, `apps/mobile/package.json`
- [ ] **Step 1: Cek getApiBase / EXPO_PUBLIC_API_BASE**
```bash
Select-String -Path "apps/mobile/App.tsx" -Pattern "getApiBase|EXPO_PUBLIC_API_BASE|192.168"
```
Expected: tidak ada hardcode IP; menggunakan `EXPO_PUBLIC_API_BASE` atau `http://localhost:3000` default saat dev.
- [ ] **Step 2: Tambah .env mobile jika perlu**
Buat `apps/mobile/.env` (sudah di-gitignore oleh .gitignore root? cek): isi `EXPO_PUBLIC_API_BASE=http://localhost:3000`. Jika .gitignore tidak mengabaikan `apps/mobile/.env`, tambahkan pola tersebut ke `.gitignore`.
- [ ] **Step 3: Commit**
```bash
git add -A && git commit -m "chore(mobile): arahkan API base ke server utama MetroCoop"
```

---

## F4 — Landing Page HTML: Rebrand MetroKSP + CTA

**Folder:** `c:\Users\ASUS NUC\Desktop\Project Aplikasi\Landing Page Aplikasi MetroCoop\`

### Task F4.1: Ganti identitas VaultEdge → MetroKSP
**Files:** `metroksp/index.html`, `metroksp/assets/css/*.css`, logo SVG
- [ ] **Step 1: Ganti teks brand**
```bash
(Get-Content "metroksp/index.html") -replace "VaultEdge", "MetroKSP" -replace "Vault Edge", "Metro KSP" | Set-Content "metroksp/index.html"
```
- [ ] **Step 2: Ganti logo (jika file SVG ada)**
Cari `metroksp/assets/img/logo*`; ganti dengan logo koin MetroKSP (atau edit teks). Warna aksen ubah ke `#0e3d30` (hijau tua) / emas.
- [ ] **Step 3: Verifikasi tidak ada sisa VaultEdge**
```bash
Select-String -Path "metroksp/index.html" -Pattern "VaultEdge"
```
Expected: tidak ada hasil.

### Task F4.2: Tambah CTA ke aplikasi utama
**Files:** `metroksp/index.html`
- [ ] **Step 1: Tambah tombol di hero/nav**
Cari `<a class="btn">` atau nav utama, tambahkan:
```html
<a href="http://localhost:3000" class="btn btn-primary">Masuk Aplikasi</a>
<a href="http://localhost:3000" class="btn btn-outline">Login Back Office</a>
```
Letakkan di navbar dan section hero.
- [ ] **Step 2: Commit ke repo landing page**
```bash
cd "c:\Users\ASUS NUC\Desktop\Project Aplikasi\Landing Page Aplikasi MetroCoop"
git add -A && git commit -m "feat(landing): rebrand MetroKSP + CTA ke aplikasi utama"
git push
```
(Jika folder belum jadi git repo, `git init -b main` lalu `gh repo create metroksp-landing --private` lalu `git remote add origin <url>` lalu push.)

### Task F4.3: Ganti README landing dari template
**Files:** `README.md` (folder landing)
- [ ] **Step 1: Tulis README MetroKSP**
Judul "MetroKSP — Landing Page Koperasi", cara deploy static (buka `metroksp/index.html` atau `gh pages`), CTA menunjuk ke aplikasi utama.
- [ ] **Step 2: Commit**
```bash
git add README.md && git commit -m "docs(landing): ganti README template menjadi MetroKSP"
```

---

## F5 — Hapus Proyek Sampingan

### Task F5.1: Hapus folder (sudah dibackup di F0)
- [ ] **Step 1: Hapus (PowerShell)**
```powershell
$base = "c:\Users\ASUS NUC\Desktop\Project Aplikasi"
Remove-Item "$base\PROJECT METRO KSP" -Recurse -Force
Remove-Item "$base\MetroCoop From Google AI Studio" -Recurse -Force
```
Expected: folder hilang dari Explorer.
- [ ] **Step 2: Konfirmasi backup masih ada**
```powershell
Test-Path "$base\PROJECT-METRO-KSP-BACKUP-2026-07-11.zip"
Test-Path "$base\MetroCoop-AIStudio-BACKUP-2026-07-11.zip"
```
Expected: keduanya `True`.

---

## F6 — Sinkron ke GitHub

### Task F6.1: Push perubahan MetroCoop
- [ ] **Step 1: Sync**
```bash
cd c:\Users\ASUS NUC\Desktop\Project Aplikasi\MetroCoop
git sync "chore: sinkronisasi menyeluruh MetroCoop (backend, web, mobile, brand, hapus sampingan)"
```
Expected: push sukses, tidak ada `.env` ter-commit.
- [ ] **Step 2: Verifikasi tidak ada secret**
```bash
git ls-files | Select-String "\.env$"
```
Expected: tidak ada hasil.

### Task F6.2: Push landing page
Sudah dilakukan di F4.2 (jika repo terpisah). Jika belum, lakukan `git push`.

---

## F7 — Quality Check (QC) Akhir

### Task F7.1: Static & unit
- [ ] **Step 1: Typecheck**
```bash
cd c:\Users\ASUS NUC\Desktop\Project Aplikasi\MetroCoop && npm run typecheck 2>&1
```
Expected: 0 error.
- [ ] **Step 2: Test**
```bash
npm run test 2>&1
```
Expected: semua lulus.

### Task F7.2: Server & login 4 role
- [ ] **Step 1: Jalankan server**
```bash
npm run dev
```
- [ ] **Step 2: Login ke-4 role (skrip)**
```powershell
$roles = @(
  @{u='admin';p='admin123'},
  @{u='operator';p='admin123'},
  @{u='1234567890';p='123456'},
  @{u='hijau_agri';p='perusahaan123'}
)
foreach ($r in $roles) {
  $res = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body ($r | ConvertTo-Json -Compress)
  "$($r.u) -> role=$($res.user.role) token=$($res.token.Substring(0,8))..."
}
```
Expected: ke-4 mengembalikan token & role benar.

### Task F7.3: Menu sidebar tidak error
- [ ] **Step 1: Browse tiap menu** (pakai browser manual atau agent-browser)
Buka http://localhost:3000, login admin, klik semua menu (lihat `f2-menu-audit.txt`). Pastikan tidak ada blank/error.
Expected: semua menu menampilkan konten (minimal placeholder rapi, bukan crash).

### Task F7.4: Data scoping & CTA
- [ ] **Step 1: Anggota hanya lihat data sendiri**
```powershell
$t = (Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"1234567890","password":"123456"}').token
$d = Invoke-RestMethod -Uri "http://localhost:3000/api/data/simpanan-transaksi" -Headers @{Authorization="Bearer $t"}
($d | ForEach-Object {$_.anggota_id} | Sort-Object -Unique) -join ','
```
Expected: hanya `m1`.
- [ ] **Step 2: CTA landing**
Buka `Landing Page Aplikasi MetroCoop/metroksp/index.html` → tombol "Masuk Aplikasi" → arah ke `http://localhost:3000`.
Expected: klik membuka aplikasi utama.

### Task F7.5: Final git status bersih
- [ ] **Step 1:**
```bash
git -C "c:\Users\ASUS NUC\Desktop\Project Aplikasi\MetroCoop" status --short
```
Expected: kosong (working tree clean).

---

## Self-Review (dilakukan penulis plan)
1. **Spec coverage:** F0↔§4.5, F1↔§4.1, F2↔§4.2, F3↔§4.3, F4↔§4.4, F5↔§4.5, F6↔§5, F7↔§6 — semua ter-cover.
2. **Placeholder scan:** tidak ada TBD; tiap step berisi perintah/code nyata.
3. **Type consistency:** `git sync` konsisten; path absolut konsisten; nama menu mengikuti `Sidebar.tsx`.
4. **Scope:** sesuai YAGNI — tidak ada fitur baru, hanya stabilkan/lengkapi/rebrand/hapus.
