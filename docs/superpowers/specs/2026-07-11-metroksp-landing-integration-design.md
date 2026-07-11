# Integrasi Landing Page MetroKSP ke Aplikasi MetroCoop

**Tanggal:** 2026-07-11
**Penulis:** Trae Design
**Status:** Desain (menunggu persetujuan spec sebelum implementasi)
**Prinsip inti:** Bangun landing MetroKSP **tanpa mempengaruhi aplikasi utama** — integrasi bersifat *additive* (penambahan murni), tidak mengubah komponen/shared CMS, rute, atau konfigurasi yang sudah dipakai aplikasi.

---

## 1. Ringkasan & Tujuan

Folder `MetroCoop` adalah monorepo: `apps/mobile` (Expo/RN), `apps/web` (React 19 + Vite 6 + Tailwind v4 + React Router 7 + Zustand + lucide-react + motion), `server`, `packages/shared`. Aplikasi web sudah punya landing page CMS-driven (`pages/LandingPage.tsx` + `components/landing/*`) yang saat ini berbrand **MetroMitra** (platform SaaS koperasi).

Tujuan: menghadirkan landing publik **MetroKSP** (Koperasi Simpan Pinjam) di dalam aplikasi web yang sama, dengan identitas visual hijau pinus + emas, font Fraunces + Plus Jakarta Sans, dan konten simpan/pinjam/deposito — **tanpa** mengubah landing MetroMitra yang ada atau bagian lain aplikasi.

Keputusan yang sudah disepakati:
- Brand publik = **MetroKSP** (metadata `MetroMitra` tetap sebagai nama internal platform).
- Integrasi = **landing terisolasi di rute baru**, bukan restyle komponen CMS yang ada.
- Cakupan = **section CMS saja** (hero, features, team, testimonials, pricing, contact). Tanpa section FAQ / Legalitas penuh / Cara Kerja baru.

---

## 2. Prinsip "Tanpa Mempengaruhi Aplikasi Utama"

### File/Fitur yang DIUTUHKAN (baru, terisolasi)
- Folder baru `apps/web/src/components/landingMetroKSP/*` — salinan adaptif komponen landing khusus MetroKSP.
- Halaman baru `apps/web/src/pages/MetroKspLandingPage.tsx`.
- File data default MetroKSP lokal `apps/web/src/components/landingMetroKSP/defaultData.ts` (bertipe `LandingPageData` dari `@metrocoop/shared/types` — hanya *import tipe*, tidak mengubah `shared/types`).
- File CSS ter-scoped `apps/web/src/components/landingMetroKSP/metroksp.css`.
- Penambahan rute `/metroksp` di `App.tsx` (satu `import` + satu blok `if`).
- Penambahan 2 font `<link>` di `apps/web/index.html` (additive; hanya dipakai oleh landing MetroKSP via class ter-scoped).

### File/Fitur yang DIAMANKAN (TIDAK diubah)
- `apps/web/src/components/landing/*` (landing CMS MetroMitra asli).
- `apps/web/src/pages/LandingPage.tsx` (tetap dilayani di `/`).
- `apps/web/src/data.ts` (`DEFAULT_LANDING_DATA` tetap MetroMitra).
- `packages/shared/src/types/index.ts` (hanya diimpor).
- `metadata.json`, `server/*`, `apps/mobile/*`, `index.css` global, `ThemeProvider` global.

**Garansi isolasi:** landing MetroKSP membungkus seluruh tampilannya dalam container `.metroksp` dan mendefinisikan token warna/font di dalam scope tersebut (CSS var lokal + class font). Tidak ada perubahan `tailwind.config` atau CSS global, sehingga visual MetroKSP tidak bocor ke dashboard/login/app lain.

---

## 3. Arsitektur & Struktur File Baru

```
apps/web/src/
├─ pages/MetroKspLandingPage.tsx          # komposisi section MetroKSP
└─ components/landingMetroKSP/
   ├─ metroksp.css                         # token + class ter-scoped (.metroksp *)
   ├─ defaultData.ts                       # LandingPageData MetroKSP (lokal)
   ├─ Navbar.tsx
   ├─ HeroSection.tsx
   ├─ FeaturesGrid.tsx
   ├─ TeamGrid.tsx
   ├─ TestimonialSlider.tsx
   ├─ PricingTable.tsx                     # kartu ringkasan produk & bunga
   └─ ContactFooter.tsx
```

`MetroKspLandingPage.tsx` mengimpor `defaultData.ts` (typed `LandingPageData`), lalu memetakan ke komponen di atas. Data default lokal artinya admin CMS tetap mengelola landing MetroMitra; landing MetroKSP mandiri (tidak butuh backend).

---

## 4. Sistem Visual (ter-scoped)

Container root: `<div className="metroksp">…</div>`. Di `metroksp.css`:

```css
.metroksp{
  --mk-primary:#d4a017;   /* emas */
  --mk-secondary:#15604a; /* hijau pinus */
  --mk-ink:#0c2b20;
  --mk-cream:#f4ede0;
  --mk-paper:#fbf8f1;
  --mk-muted:#5d6f64;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
  color:var(--mk-ink);
}
.metroksp h1,.metroksp h2,.metroksp h3,.metroksp .display{
  font-family:'Fraunces',Georgia,serif;
}
```

Komponen menggunakan utility Tailwind untuk layout, tapi warna mereferensi token lokal (`text-[var(--mk-primary)]`, `bg-[var(--mk-secondary)]`, atau inline `style`). Hero memakai gradient hijau→emas (`linear-gradient(160deg,#0e3d30,#0c2b20)` + aksen emas), tanpa pola berat.

Font: tambah di `apps/web/index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 5. Per-Komponen (MetroKSP)

- **Navbar**: logo + teks "MetroKSP"; tautan Produk/Tentang/Kontak mengarah ke anchor `#produk`/`#tentang`/`#kontak` di halaman yang sama; CTA "Ajukan Pinjaman". Warna tema lokal.
- **HeroSection**: gradient hijau→emas; badge "Koperasi Simpan Pinjam"; headline "Simpan dengan tenang. Pinjam dengan mudah."; sub + 2 CTA dari `defaultData.hero` (`ctaPrimaryLink`→`#kontak`, `ctaSecondaryLink`→`#produk`).
- **FeaturesGrid**: 3 kartu dari `defaultData.features` → Simpanan (`PiggyBank`), Pinjaman (`HandCoins`), Deposito (`Landmark`). Ikon dari `lucide-react` (sudah tersedia di app).
- **TeamGrid**: `defaultData.team` sebagai "Pengurus" (placeholder, 3 orang).
- **TestimonialSlider**: `defaultData.testimonials` (anggota, placeholder 3).
- **PricingTable**: dipetakan jadi **kartu ringkasan produk & bunga** — `priceAmount` = estimasi bunga (mis. "[ X % / thn ]"), `features` = syarat (tenor, agunan). Bukan harga paket SaaS.
- **ContactFooter**: `defaultData.contact` (email/phone/whatsapp/address/officeHours); `footerDescription` memuat satu baris legalitas (SK OJK & badan hukum placeholder).

---

## 6. Isi Konten Default (MetroKSP) — `defaultData.ts`

`settings`: `koperasiName:'MetroKSP'`, `koperasiTagline:'Koperasi Simpan Pinjam'`, `primaryColor:'#d4a017'`, `secondaryColor:'#15604a'`, `logoUrl:''`, `faviconUrl:''`.

Semua entitas (`hero`, tiap item `features`/`team`/`testimonials`/`pricing`) wajib menyertakan `id` string (sesuai `LandingPageData`), mis. `id:'metroksp-default'`, `id:'feat-simpanan'`. Gunakan konstanta statis karena data lokal.

`hero`: badge "Koperasi Simpan Pinjam"; headline "Simpan dengan tenang. Pinjam dengan mudah."; sub "MetroKSP membantu warga dan UMKM tumbuh lewat simpanan aman, pinjaman terukur, dan pelayanan manusiawi."; ctaPrimary "Daftar Anggota" (`#kontak`); ctaSecondary "Lihat Produk" (`#produk`); `backgroundType:'gradient'`.
`features` (3): Simpanan / Pinjaman / Deposito dengan deskripsi singkat.
`team` (3 placeholder pengurus): Nama + Jabatan (Ketua/Direktur/Bendahara) — placeholder.
`testimonials` (3 placeholder anggota): nama, posisi, isi, rating.
`pricing` (3): Simpanan / Pinjaman / Deposito sebagai ringkasan bunga & syarat.
`contact`: `email:'halo@metroksp.id'`, `phone:'[ +62 21 0000 0000 ]'`, `whatsapp:''`, `address:'[ Jl. … ]'`, `officeHours:'Senin–Jumat 08.00–16.00 WIB'`, `footerDescription:'Terdaftar & diawasi OJK. [ No. SK OJK ], [ No. Badan Hukum ].'`.

Catatan: semua nilai legal/kontak bertanda `[ … ]` = placeholder untuk diisi pemilik.

---

## 7. Routing (additive)

Di `apps/web/src/App.tsx`, tambahkan (SEBELUM pengecekan `/`):

```tsx
import MetroKspLandingPage from './pages/MetroKspLandingPage';
...
  if (location.pathname === '/metroksp') {
    return <MetroKspLandingPage />;
  }
```

Rute `/` (MetroMitra) dan seluruh rute app lainnya **tidak diubah**.

---

## 8. Verifikasi

1. `cd apps/web && npm install && npm run dev`.
2. Buka `http://localhost:5173/metroksp` — cek: brand MetroKSP, palet emas/hijau, font Fraunces/Jakarta Sans, section CMS tampil, tanpa error console.
3. Buka `http://localhost:5173/` — konfirmasi landing MetroMitra **tetap sama** (bukti tidak ada regresi).
4. `npx tsc --noEmit` di `apps/web` lolos (tipe `LandingPageData` sesuai).
5. Screenshot desktop (1280px) + mobile (390px) untuk `/metroksp`.

---

## 9. Di Luar Cakupan (Out of Scope)

- Section FAQ, Legalitas OJK penuh, Cara Kerja sebagai section baru.
- Perubahan backend / skema CMS (`shared/types`, server, `data.ts`).
- Merge folder `metroksp/` HTML statis ke aplikasi.
- Perubahan `metadata.json`, aplikasi mobile, dashboard/login.
- Pengisian nilai legal/kontak asli (tetap placeholder).

## 10. Risiko & Rollback

Karena seluruhnya *additive*: rollback cukup hapus folder `components/landingMetroKSP/`, hapus `pages/MetroKspLandingPage.tsx`, revert 1 import + 1 blok `if` di `App.tsx`, dan 2 baris `<link>` font di `index.html`. Efek ke aplikasi yang berjalan = nol.
