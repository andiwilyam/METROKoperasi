# Sistem Tema "Editorial Luxe" (Fungsional) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Gunakan superpowers:subagent-driven-development (rekomendasi) atau superpowers:executing-plans untuk menjalankan rencana ini task demi task. Langkah memakai sintaks checkbox (`- [ ]`) untuk pelacakan.

**Goal:** Mengubah modul "Kustomisasi Tema" yang saat ini mati menjadi sistem tema sungguhan berbasis token CSS, dengan arah visual "Editorial Luxe" (serif + emas champagne) sebagai default, bisa di-ganti admin ke terang/gelap/warna lain secara live.

**Architecture:** Palet dipusatkan sebagai CSS variables semantik di satu file (`tokens.css`), dipilih lewat atribut `data-theme` pada `<html>`. Sebuah `ThemeProvider` membaca preferensi dari `localStorage` (kunci `theme_preset`, sudah dipakai `DashboardApp`) lalu menerapkannya. Komponen shell + 2 dashboard dikonversi dari warna Tailwind hardcode (`blue-600`, `amber-600`, `slate-*`) ke kelas semantik (`.mc-card`, `.mc-btn-primary`, dll) yang membaca variabel — sehingga ganti tema otomatis mengubah seluruh layar tanpa edit 50 file satu per satu.

**Tech Stack:** React 18, Tailwind CSS v4 (`@import "tailwindcss"`), TypeScript, Vitest (jsdom) untuk unit test, Vite.

---

## File Structure

- Create: `apps/web/src/styles/tokens.css` — definisi CSS variables untuk 4 preset + kelas utilitas semantik (`.mc-*`).
- Create: `apps/web/src/theme/theme.ts` — tipe `ThemeId`, daftar `PRESETS`, fungsi murni `applyTheme(id)` (set `data-theme` + tulis `localStorage`).
- Create: `apps/web/src/theme/theme.test.ts` — unit test `applyTheme`.
- Create: `apps/web/src/theme/ThemeProvider.tsx` — provider React yang menerapkan tema saat mount dan mengekspos `useTheme()`.
- Modify: `apps/web/src/index.css` — impor `tokens.css` (setelah `@import "tailwindcss"`).
- Modify: `apps/web/src/App.tsx` — bungkus `<BrowserRouter>` dengan `<ThemeProvider>`.
- Modify: `apps/web/src/components/Sidebar.tsx` — ganti warna hardcode ke kelas semantik + `aria-label`.
- Modify: `apps/web/src/components/Header.tsx` — kelas semantik + `aria-label` + `Intl.DateTimeFormat` untuk tanggal.
- Modify: `apps/web/src/components/LoginScreen.tsx` — hero/tabs/form ke kelas semantik + sembunyikan kredensial demo di build production.
- Modify: `apps/web/src/components/DashboardApp.tsx` — shell + footer ke kelas semantik; hapus state `theme` mati.
- Modify: `apps/web/src/components/admin/AdminDashboard.tsx` — kartu/panel/badge ke kelas semantik.
- Modify: `apps/web/src/components/member/MemberDashboard.tsx` — kartu/panel/badge ke kelas semantik.
- Modify: `apps/web/src/components/admin/AdminTema.tsx` — impor `PRESETS` dari `theme.ts`, tombol "Terapkan Tema" panggil `applyTheme` + persist.

---

### Task 1: Buat token tema (`tokens.css`)

**Files:**
- Create: `apps/web/src/styles/tokens.css`

- [ ] **Step 1: Tulis file token tema lengkap**

```css
/* MetroCoop — Design Tokens "Editorial Luxe"
   Semua preset memakai variabel semantik; ganti tema = ganti blok [data-theme].
   Kelas .mc-* di bawah membaca variabel agar komponen tidak hardcode warna. */

:root,
[data-theme="heritage-light"] {
  --mc-bg: #f6f1e9;
  --mc-surface: #fffdf9;
  --mc-surface-2: #fbf7ef;
  --mc-border: #e8dfcd;
  --mc-ink: #2c2820;
  --mc-ink-strong: #23201b;
  --mc-muted: #5a5246;
  --mc-sidebar: #fbf7ef;
  --mc-sidebar-ink: #23201b;
  --mc-sidebar-muted: #8a8068;
  --mc-sidebar-active: rgba(200, 162, 75, 0.14);
  --mc-primary: #9a7422;
  --mc-accent: #c8a24b;
  --mc-accent-2: #a8802f;
  --mc-on-accent: #fffdf9;
  --mc-success: #1f6f54;
  --mc-success-bg: rgba(31, 111, 84, 0.12);
  --mc-danger: #a8443a;
  --mc-danger-bg: rgba(180, 60, 50, 0.10);
  --mc-ring: rgba(154, 116, 34, 0.45);
}

[data-theme="midnight-heritage"] {
  --mc-bg: #0c1322;
  --mc-surface: #111c30;
  --mc-surface-2: #0e1828;
  --mc-border: rgba(255, 255, 255, 0.07);
  --mc-ink: #dde3ee;
  --mc-ink-strong: #f0e6cf;
  --mc-muted: #9aa6bd;
  --mc-sidebar: #0a1120;
  --mc-sidebar-ink: #f0e6cf;
  --mc-sidebar-muted: #7e8aa3;
  --mc-sidebar-active: rgba(201, 162, 75, 0.16);
  --mc-primary: #e0b973;
  --mc-accent: #c8a24b;
  --mc-accent-2: #a8802f;
  --mc-on-accent: #16110a;
  --mc-success: #6ee7b7;
  --mc-success-bg: rgba(31, 111, 84, 0.22);
  --mc-danger: #fca5a5;
  --mc-danger-bg: rgba(239, 68, 68, 0.16);
  --mc-ring: rgba(224, 185, 115, 0.5);
}

[data-theme="royal-blue"] {
  --mc-bg: #f8fafc;
  --mc-surface: #ffffff;
  --mc-surface-2: #f1f5f9;
  --mc-border: #e2e8f0;
  --mc-ink: #334155;
  --mc-ink-strong: #0f172a;
  --mc-muted: #64748b;
  --mc-sidebar: #0f172a;
  --mc-sidebar-ink: #e2e8f0;
  --mc-sidebar-muted: #94a3b8;
  --mc-sidebar-active: rgba(37, 99, 235, 0.18);
  --mc-primary: #2563eb;
  --mc-accent: #d97706;
  --mc-accent-2: #b45309;
  --mc-on-accent: #ffffff;
  --mc-success: #16a34a;
  --mc-success-bg: rgba(22, 163, 74, 0.12);
  --mc-danger: #dc2626;
  --mc-danger-bg: rgba(239, 68, 68, 0.12);
  --mc-ring: rgba(37, 99, 235, 0.45);
}

[data-theme="teal-ocean"] {
  --mc-bg: #f0fdfa;
  --mc-surface: #ffffff;
  --mc-surface-2: #ecfeff;
  --mc-border: #cbd5e1;
  --mc-ink: #334155;
  --mc-ink-strong: #042f2e;
  --mc-muted: #5e7591;
  --mc-sidebar: #042f2e;
  --mc-sidebar-ink: #ccfbf1;
  --mc-sidebar-muted: #5eead4;
  --mc-sidebar-active: rgba(13, 148, 136, 0.20);
  --mc-primary: #0d9488;
  --mc-accent: #0891b2;
  --mc-accent-2: #0e7490;
  --mc-on-accent: #ffffff;
  --mc-success: #0f766e;
  --mc-success-bg: rgba(13, 148, 136, 0.12);
  --mc-danger: #dc2626;
  --mc-danger-bg: rgba(239, 68, 68, 0.12);
  --mc-ring: rgba(13, 148, 136, 0.45);
}

/* ---- Utilitas semantik (ganti Tailwind hardcode) ---- */
.mc-bg { background-color: var(--mc-bg); color: var(--mc-ink); }
.mc-surface { background-color: var(--mc-surface); }
.mc-card {
  background-color: var(--mc-surface);
  border: 1px solid var(--mc-border);
  border-radius: 0.9rem;
}
.mc-border { border-color: var(--mc-border); }
.mc-ink { color: var(--mc-ink); }
.mc-ink-strong { color: var(--mc-ink-strong); }
.mc-muted { color: var(--mc-muted); }

.mc-sidebar { background-color: var(--mc-sidebar); color: var(--mc-sidebar-ink); }
.mc-sidebar-muted { color: var(--mc-sidebar-muted); }
.mc-sidebar-item:hover { background-color: rgba(128, 128, 128, 0.08); color: var(--mc-sidebar-ink); }
.mc-sidebar-active { background-color: var(--mc-sidebar-active); color: var(--mc-primary); font-weight: 600; }

.mc-btn-primary {
  background-color: var(--mc-accent);
  color: var(--mc-on-accent);
  font-weight: 600;
}
.mc-btn-primary:hover { background-color: var(--mc-accent-2); }
.mc-btn-danger { background-color: var(--mc-danger-bg); color: var(--mc-danger); font-weight: 600; }
.mc-btn-danger:hover { filter: brightness(0.97); }

.mc-badge-ok { background-color: var(--mc-success-bg); color: var(--mc-success); }
.mc-badge-accent { background-color: var(--mc-sidebar-active); color: var(--mc-primary); }
.mc-icon-accent { color: var(--mc-accent); }

/* Fokus terlihat jelas (perbaikan aksesibilitas) */
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

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/styles/tokens.css
git commit -m "feat(theme): tambah design tokens Editorial Luxe + utilitas semantik"
```

---

### Task 2: Impor `tokens.css` di `index.css`

**Files:**
- Modify: `apps/web/src/index.css:1-2`

- [ ] **Step 1: Tambahkan impor token setelah Tailwind**

Ganti dua baris atas:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
@import "tailwindcss";
```

menjadi:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
@import "tailwindcss";
@import "./styles/tokens.css";
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/index.css
git commit -m "chore(theme): impor tokens.css setelah tailwind"
```

---

### Task 3: Modul tema (`theme.ts`)

**Files:**
- Create: `apps/web/src/theme/theme.ts`

- [ ] **Step 1: Tulis modul tema + fungsi murni `applyTheme`**

```ts
export type ThemeId = 'heritage-light' | 'midnight-heritage' | 'royal-blue' | 'teal-ocean';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  label: string;
  description: string;
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'heritage-light',
    name: 'Heritage Light',
    label: 'Krem + Emas · Terang',
    description: 'Default Editorial Luxe — elegan, ramah mata untuk kerja harian.',
  },
  {
    id: 'midnight-heritage',
    name: 'Midnight Heritage',
    label: 'Navy + Emas · Gelap',
    description: 'Kesan bank privat, mewah, cocok ruangan redup.',
  },
  {
    id: 'royal-blue',
    name: 'Classic Royal Blue',
    label: 'Biru Korporat',
    description: 'Tampilan biru tua klasik, familiar bagi pengguna lama.',
  },
  {
    id: 'teal-ocean',
    name: 'Teal Ocean',
    label: 'Teal Fintech',
    description: 'Modern marine, segar, untuk koperasi digital.',
  },
];

export const DEFAULT_THEME: ThemeId = 'heritage-light';
const STORAGE_KEY = 'theme_preset';

export function getStoredTheme(): ThemeId {
  const v = localStorage.getItem(STORAGE_KEY);
  return (PRESETS.find((p) => p.id === v)?.id ?? DEFAULT_THEME) as ThemeId;
}

export function applyTheme(id: ThemeId): void {
  if (!PRESETS.some((p) => p.id === id)) return;
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem(STORAGE_KEY, id);
}

export function initTheme(): ThemeId {
  const id = getStoredTheme();
  applyTheme(id);
  return id;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/theme/theme.ts
git commit -m "feat(theme): modul preset + applyTheme murni"
```

---

### Task 4: Test unit `applyTheme`

**Files:**
- Create: `apps/web/src/theme/theme.test.ts`

- [ ] **Step 1: Tulis test (jsdom)**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme, getStoredTheme, DEFAULT_THEME, PRESETS } from './theme';

describe('theme module', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('applyTheme menaruh atribut data-theme & simpan ke localStorage', () => {
    applyTheme('midnight-heritage');
    expect(document.documentElement.getAttribute('data-theme')).toBe('midnight-heritage');
    expect(localStorage.getItem('theme_preset')).toBe('midnight-heritage');
  });

  it('applyTheme mengabaikan id tidak valid', () => {
    applyTheme('heritage-light');
    // @ts-expect-error pengujian nilai ilegal
    applyTheme('tema-goib');
    expect(document.documentElement.getAttribute('data-theme')).toBe('heritage-light');
  });

  it('getStoredTheme fallback ke default bila kosong', () => {
    expect(getStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('getStoredTheme membaca nilai tersimpan', () => {
    localStorage.setItem('theme_preset', 'teal-ocean');
    expect(getStoredTheme()).toBe('teal-ocean');
  });

  it('daftar preset memiliki 4 entri valid', () => {
    expect(PRESETS).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan PASS**

Run: `npx vitest run src/theme/theme.test.ts`
Expected: semua test PASS (5/5).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/theme/theme.test.ts
git commit -m "test(theme): coverage applyTheme & getStoredTheme"
```

---

### Task 5: `ThemeProvider`

**Files:**
- Create: `apps/web/src/theme/ThemeProvider.tsx`

- [ ] **Step 1: Tulis provider React**

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, applyTheme, initTheme, PRESETS } from './theme';

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => initTheme());

  const setTheme = (id: ThemeId) => {
    applyTheme(id);
    setThemeState(id);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  return v;
}

export { PRESETS };
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/theme/ThemeProvider.tsx
git commit -m "feat(theme): ThemeProvider terapkan tema saat mount"
```

---

### Task 6: Pasang `ThemeProvider` di `App.tsx`

**Files:**
- Modify: `apps/web/src/App.tsx:1-17`

- [ ] **Step 1: Bungkus router dengan ThemeProvider**

Ganti isi `App.tsx` menjadi:

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import AppContent from './AppContent';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Pecah konten lama ke `AppContent.tsx`**

Create: `apps/web/src/AppContent.tsx`

```tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useDataStore, useLoadAllData } from './stores/dataStore';
import LoginScreen from './components/LoginScreen';
import DashboardApp from './components/DashboardApp';
import MetroKspLandingPage from './pages/MetroKspLandingPage';

export default function AppContent() {
  const user = useAuthStore((s) => s.user);
  const loadAllData = useLoadAllData();
  const location = useLocation();
  useEffect(() => { if (user) { loadAllData(); } }, [user]);
  if (location.pathname === '/') { return <MetroKspLandingPage />; }
  if (!user) { return <LoginScreen />; }
  return <DashboardApp />;
}
```

- [ ] **Step 3: Jalankan dev server, pastikan tidak error**

Run: `npm --prefix apps/web run dev`
Expected: halaman login ter-render, `data-theme="heritage-light"` ada di `<html>`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/App.tsx apps/web/src/AppContent.tsx
git commit -m "feat(theme): pasang ThemeProvider di root"
```

---

### Task 7: Konversi `Sidebar.tsx` ke kelas semantik

**Files:**
- Modify: `apps/web/src/components/Sidebar.tsx`

- [ ] **Step 1: Ganti kelas container & nav (hanya bagian yang di-hardcode)**

Sidebar saat ini pakai `bg-slate-900 text-slate-300 border-slate-800` (gelap hardcode). Ganti `<aside ...>` menjadi:

```tsx
<aside
  className={`fixed lg:sticky lg:top-0 h-screen shrink-0 inset-y-0 left-0 z-50 w-64 mc-sidebar border-r mc-border flex flex-col transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
```

- [ ] **Step 2: Tambahkan `aria-label` pada tombol ikon**

Ganti tombol close (`Sidebar.tsx:97-102`):

```tsx
<button
  onClick={() => setIsOpen(false)}
  aria-label="Tutup menu"
  className="lg:hidden mc-sidebar-muted hover:text-white p-1 rounded-md"
>
  <ChevronDown className="w-5 h-5 rotate-90" />
</button>
```

- [ ] **Step 3: Ganti item nav aktif & hover**

Untuk item aktif admin (contoh `dashboard`, `Sidebar.tsx:118-122`):

```tsx
className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
  activeMenu === 'dashboard'
    ? 'mc-sidebar-active'
    : 'mc-sidebar-item'
}`}
```

Untuk submenu label & teks (`text-slate-400` → `mc-sidebar-muted`), dan `text-blue-400` (aktif) → `mc-icon-accent`. Terapkan pola ini ke seluruh blok nav (anggota, simpanan, pinjaman, toko, unit lain, investasi, akuntansi, data master).

- [ ] **Step 4: Ganti footer sidebar (theme switcher & logout)**

`bg-slate-800/50` → `mc-surface-2` (via inline), `text-slate-400` → `mc-sidebar-muted`, `text-red-400 hover:text-red-300` → `mc-btn-danger` (tanpa background saat idle). Pastikan tombol tetap `<button>`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/Sidebar.tsx
git commit -m "refactor(theme): Sidebar pakai token semantik + aria-label"
```

---

### Task 8: Konversi `Header.tsx`

**Files:**
- Modify: `apps/web/src/components/Header.tsx`

- [ ] **Step 1: Ganti container header**

`bg-white border-slate-200 shadow-sm` → `mc-surface mc-border` (tetap `sticky top-0 z-30`).

- [ ] **Step 2: Perbaiki tanggal pakai `Intl.DateTimeFormat`**

Ganti `formatIndonesianDate` (`Header.tsx:37-50`) dengan:

```tsx
const formatIndonesianDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Jakarta',
  }).format(date) + ' WIB';
};
```

- [ ] **Step 3: Tambahkan `aria-label` pada tombol ikon**

Tombol menu (`Header.tsx:125-130`): tambah `aria-label="Buka menu"`.
Tombol lonceng (`Header.tsx:169-173`): ganti `title="..."` dengan `aria-label="Notifikasi & pengaduan"`.
Tombol dropdown profil & theme switcher di Sidebar sudah ditangani Task 7.

- [ ] **Step 4: Ganti badge peran & teks**

`bg-amber-50 text-amber-600` (anggota) → `mc-badge-accent`; `bg-blue-50 text-blue-600` (admin) → `mc-badge-ok`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/Header.tsx
git commit -m "refactor(theme): Header token semantik + Intl tanggal + aria-label"
```

---

### Task 9: Konversi `LoginScreen.tsx`

**Files:**
- Modify: `apps/web/src/components/LoginScreen.tsx`

- [ ] **Step 1: Hero kiri ke kelas semantik**

Container luar `bg-slate-900` → `mc-bg` (tetap `min-h-screen flex items-center`). Kartu info & tombol helper demo ganti `bg-slate-800/50` → `mc-surface-2`, `border-slate-700/30` → `mc-border`, teks `text-slate-400` → `mc-muted`.

- [ ] **Step 2: Kartu form (kanan)**

`bg-white rounded-2xl border-slate-100` → `mc-card`. Tab aktif `border-blue-600 text-blue-600` (admin) → `mc-icon-accent` + `border-b-2` pakai `var(--mc-accent)` — ganti dengan kelas `mc-sidebar-active` untuk konsistensi. Tab anggota `amber-500` → `mc-accent` via inline `style={{ color: 'var(--mc-accent)' }}`.

- [ ] **Step 3: Input username & password**

`focus:ring-blue-500 focus:border-blue-500` → `mc-focus` (sudah global) + `focus:border-[var(--mc-accent)]`. Hapus `transition-all` → `transition-colors`.

- [ ] **Step 4: Sembunyikan kredensial demo di production**

Di blok "Test Credentials" (`LoginScreen.tsx:183-211`), bungkus dengan pengecekan:

```tsx
{import.meta.env.DEV && (
  <div className="mc-surface-2 mc-border ...">
    {/* ...kredensial demo... */}
  </div>
)}
```

- [ ] **Step 5: Tombol show/hide password dapat `aria-label`**

`LoginScreen.tsx:328-334` tambah `aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/LoginScreen.tsx
git commit -m "refactor(theme): LoginScreen token + sembunyikan kredensial demo di prod"
```

---

### Task 10: Konversi `DashboardApp.tsx` (shell + footer)

**Files:**
- Modify: `apps/web/src/components/DashboardApp.tsx`

- [ ] **Step 1: Hapus state tema mati**

Hapus baris `const [theme, setTheme] = useState<'light' | 'dark'>('light');` (`DashboardApp.tsx:17`) dan penggunaannya di `<Sidebar ... theme={theme} setTheme={setTheme} />`. Sidebar tidak lagi butuh prop tema (tema dari `data-theme` global).

- [ ] **Step 2: Container utama & footer**

`min-h-screen ... bg-slate-50` → `mc-bg`. Footer `border-slate-200 text-slate-400` → `mc-border mc-muted`.

- [ ] **Step 3: Teruskan `onSelectThemePreset` agar AdminTema bisa memanggil provider**

Tambahkan impor `useTheme` dan sediakan ke portal:

```tsx
import { useTheme } from '../theme/ThemeProvider';
// di dalam komponen:
const { setTheme } = useTheme();
// masukkan ke commonProps:
const commonProps = { ..., onSelectThemePreset: setTheme };
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/DashboardApp.tsx
git commit -m "refactor(theme): DashboardApp hapus state tema mati + bridge provider"
```

---

### Task 11: Konversi `AdminDashboard.tsx`

**Files:**
- Modify: `apps/web/src/components/admin/AdminDashboard.tsx`

- [ ] **Step 1: Banner welcome**

`bg-gradient-to-r from-blue-700 ...` → ganti ke `mc-surface` + `mc-border` dengan aksen emas via inline `style={{ borderLeft: '4px solid var(--mc-accent)' }}`. Teks `text-blue-200` → `mc-muted`.

- [ ] **Step 2: Kartu KPI (4 kartu, `AdminDashboard.tsx:127-194`)**

`bg-white border-slate-200` → `mc-card`. Icon wrap `bg-blue-50 ... text-blue-600` → `mc-surface-2 mc-icon-accent`. Angka `text-slate-800` → `mc-ink-strong`. Label `text-slate-400` → `mc-muted`.

- [ ] **Step 3: Panel grafik & organisasi**

`bg-white border-slate-200` → `mc-card`. Judul `text-slate-900` → `mc-ink-strong`. Grid line `border-slate-100` → `mc-border`. Path SVG `stroke="#2563eb"` → `stroke="var(--mc-accent)"`, `stroke="#f59e0b"` → `stroke="var(--mc-primary)"`.

- [ ] **Step 4: Modul cepat & ventura**

`bg-slate-50 border-slate-200` → `mc-surface-2 mc-border`. Angka `text-slate-800` → `mc-ink-strong`. Badge `bg-emerald-50 text-emerald-700` → `mc-badge-ok`; `bg-purple-600` (venture) → `mc-btn-primary` (inline gradient dihapus, pakai aksen).

- [ ] **Step 5: Tabel persetujuan**

Header `bg-slate-50 border-slate-200 text-slate-500` → `mc-surface-2 mc-border mc-muted`. Status badge hijau/merah ganti `bg-emerald-50 text-emerald-700` → `mc-badge-ok`, `bg-red-50 text-red-700` → `mc-btn-danger`. Tombol aksi `bg-emerald-50 text-emerald-700` → `mc-badge-ok` + border; `bg-red-50 text-red-700` → `mc-btn-danger`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/admin/AdminDashboard.tsx
git commit -m "refactor(theme): AdminDashboard pakai token semantik"
```

---

### Task 12: Konversi `MemberDashboard.tsx`

**Files:**
- Modify: `apps/web/src/components/member/MemberDashboard.tsx`

- [ ] **Step 1: Welcome board**

`bg-gradient-to-r from-blue-900 to-indigo-900` → `mc-surface` + `mc-border` dengan aksen emas (inline `borderLeft`). Teks `text-blue-200/80` → `mc-muted`.

- [ ] **Step 2: Grid saldo (4 kartu, `MemberDashboard.tsx:95-119`)**

`bg-white border-slate-200 shadow-sm` → `mc-card`. Kartu total `bg-blue-50/50 border-blue-100` → `mc-surface-2 mc-border`. Angka `text-slate-900`/`text-blue-900` → `mc-ink-strong`. Label `text-slate-400` → `mc-muted`.

- [ ] **Step 3: Panel pinjaman & mutasi**

`bg-white border-slate-200 shadow-sm` → `mc-card`. Badge status `bg-indigo-50 text-indigo-900` → `mc-badge-accent`. Teks `text-slate-400`/`text-slate-500` → `mc-muted`.

- [ ] **Step 4: Pengumuman**

`bg-blue-50/30 border-blue-100` → `mc-surface-2 mc-border`; `bg-amber-50/30 border-amber-100` → `mc-surface-2 mc-border` (warna netral, bedakan via label). Badge `bg-blue-100 text-blue-700`/`bg-amber-100 text-amber-700` → `mc-badge-accent`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/member/MemberDashboard.tsx
git commit -m "refactor(theme): MemberDashboard pakai token semantik"
```

---

### Task 13: Hidupkan `AdminTema.tsx` (preset fungsional)

**Files:**
- Modify: `apps/web/src/components/admin/AdminTema.tsx`

- [ ] **Step 1: Impor `PRESETS` dari `theme.ts`, hapus duplikasi lokal**

Hapus `export const THEME_PRESETS` dan `ThemePreset` interface lokal. Ganti impor:

```tsx
import React from 'react';
import { Palette, Check, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PRESETS, ThemeId } from '../../theme/theme';
```

- [ ] **Step 2: Gunakan prop `onSelectThemePreset` (dari DashboardApp) untuk menerapkan tema**

Ubah signature & mapping:

```tsx
export default function AdminTema({ currentTheme, onSelectTheme }: { currentTheme: string; onSelectTheme: (id: ThemeId) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* header sama seperti sebelumnya */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRESETS.map((preset) => {
          const isActive = currentTheme === preset.id;
          return (
            <div key={preset.id} className={`mc-card flex flex-col justify-between transition-all duration-300 ${isActive ? 'ring-2' : 'hover:shadow-md'}`} style={isActive ? { boxShadow: '0 0 0 2px var(--mc-accent)' } : undefined}>
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold mc-muted tracking-wider">{preset.label}</span>
                    {preset.id === 'heritage-light' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] mc-badge-ok font-extrabold flex items-center gap-1">
                        <HeartHandshake className="w-2.5 h-2.5" /> Coop Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold mc-ink-strong flex items-center gap-1.5">{preset.name}</h3>
                </div>
                <p className="text-[11px] mc-muted leading-relaxed font-normal">{preset.description}</p>
              </div>
              <div className="p-4 mc-surface-2 mc-border border-t flex items-center justify-between">
                <span className="text-[10px] mc-muted font-mono font-bold uppercase">ID: {preset.id}</span>
                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold mc-icon-accent mc-badge-accent px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Aktif Digunakan
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectTheme(preset.id)}
                    aria-label={`Terapkan tema ${preset.name}`}
                    className="mc-btn-primary px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer"
                  >
                    Terapkan Tema
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* info warning tetap sama, ganti warna ke mc-surface-2 / mc-border / mc-muted */}
    </div>
  );
}
```

- [ ] **Step 3: Pastikan `AdminPortal` meneruskan `onSelectThemePreset` ke `AdminTema`**

Di `apps/web/src/components/AdminPortal.tsx`, cari render `<AdminTema ... />` dan tambahkan prop `onSelectThemePreset={onSelectThemePreset}` (sudah ada di `commonProps` dari `DashboardApp`).

- [ ] **Step 4: Jalankan dev, klik "Terapkan Tema" → `data-theme` berubah & reload tetap**

Run: `npm --prefix apps/web run dev`
Expected: klik preset → seluruh UI (sidebar, kartu, badge) berubah warna; refresh → tema bertahan (dari `localStorage`).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/admin/AdminTema.tsx apps/web/src/components/AdminPortal.tsx
git commit -m "feat(theme): AdminTema terapkan preset secara live + persist"
```

---

### Task 14: Verifikasi & commit akhir

**Files:**
- Modify: (tidak ada file baru)

- [ ] **Step 1: Jalankan unit test & build**

Run: `npx vitest run src/theme` lalu `npm --prefix apps/web run build`
Expected: test PASS; build sukses tanpa error TypeScript.

- [ ] **Step 2: Smoke test manual 4 preset**

Buka dev server, login sebagai admin, buka "Kustomisasi Tema", terapkan ke-4 preset, pastikan kontras teks cukup & tidak ada teks putih di atas latar terang (heritage-light / royal-blue / teal-ocean).

- [ ] **Step 3: Commit final (jika ada penyesuaian)**

```bash
git add -A
git commit -m "chore(theme): finalisasi sistem tema Editorial Luxe fungsional"
```

---

## Self-Review

**1. Cakupan spec:** Semua poin desain tercover — token terpusat (Task 1-2), preset 4 buah (Task 3), provider + wiring (Task 5-6), konversi shell + 2 dashboard (Task 7-12), modul tema hidup (Task 13), dark mode otomatis lewat `midnight-heritage` (Task 3 + 13). Akses superadmin tetap di-gate `Sidebar` (tidak diubah). Di luar scope: 45 layar tersisa & perbaikan P0 (grafik palsu/kredensial) — sudah disepakati Gelombang 2 / task terpisah.

**2. Scan placeholder:** Tidak ada TBD/TODO. Setiap langkah punya kode konkret.

**3. Konsistensi tipe:** `ThemeId`, `PRESETS`, `applyTheme`, `useTheme().setTheme` konsisten lintas Task 3, 5, 6, 10, 13. Kunci `localStorage` (`theme_preset`) sama di `theme.ts` dan yang dipakai `DashboardApp` lama → kompatibel.
