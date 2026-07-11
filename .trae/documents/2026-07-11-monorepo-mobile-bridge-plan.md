# Plan: Monorepo Restructure + Mobile App Foundation + TRAE Automation Bridge

## Summary

Restrukturisasi aplikasi web MetroMitra yang sudah ada menjadi monorepo (npm workspaces) dengan
struktur `apps/web + apps/mobile + packages/shared`, membuat project Expo untuk mobile,
dan menyiapkan automation TRAE yang menjaga konsistensi shared code.

---

## Current State Analysis

### Web App (existing)
- **Stack**: React 19 + TypeScript + Vite + Tailwind + Zustand + react-router-dom
- **Backend**: Express + PostgreSQL (REST API) — **tidak ikut direstruktur**, tetap di root
- **API client**: `src/lib/api.ts` — fetch-based, JWT via `localStorage`
- **Types**: `src/types.ts` — ~540 line dengan semua domain entities (Anggota, Pinjaman, Simpanan, COA, dll.)
- **Auth store**: `src/stores/authStore.ts` — Zustand + `localStorage`
- **Data store**: `src/stores/dataStore.ts` — ~912 line Zustand store, semua CRUD via API
- **Zod schemas**: Ada di `server/routes/auth.ts` (LoginSchema, RegisterSchema) dan `server/routes/data.ts` (SimpananTransaksiSchema, PinjamanSchema)
- **Server**: Express di root (`server.ts`, `server/`) — **dibiarkan di root**, tidak ikut monorepo

### Key observations
1. Semua types sudah pure TypeScript — bisa dipindahkan 1:1 ke shared
2. API client menggunakan `fetch` (bisa di RN) dan `localStorage` (perlu adapter)
3. Zustand stores menggunakan `localStorage` langsung — perlu platform adapter
4. Zod schemas ada di server — paling baik diekstrak agar bisa dipakai client & server
5. `package.json` scripts (`dev`, `build`, dll.) perlu diupdate untuk monorepo

---

## Proposed Changes

### Phase 1 — Setup Monorepo Structure

**Files to create/modify:**

| File | Action | Description |
|---|---|---|
| `package.json` (root) | **Modify** | Tambah `"workspaces": ["packages/*", "apps/*"]`, pindahkan scripts ke `apps/web` |
| `.gitignore` (root) | **Modify** | Tambah ignore untuk `node_modules` di workspaces |
| `tsconfig.json` (root) | **Modify** | Jadikan base config dengan `references` ke tiap workspace |
| `packages/shared/package.json` | **Create** | `name: "@metrocoop/shared"`, `type: "module"`, exports: types, api, stores, validation |
| `packages/shared/tsconfig.json` | **Create** | Extends root tsconfig |
| `packages/shared/src/index.ts` | **Create** | Barrel exports |
| `packages/shared/src/types/index.ts` | **Create** | Copy dari `src/types.ts` |
| `packages/shared/src/api/client.ts` | **Create** | API client dengan StorageAdapter interface |
| `packages/shared/src/api/storage.ts` | **Create** | `StorageAdapter` interface + `WebStorageAdapter` (localStorage) |
| `packages/shared/src/stores/authStore.ts` | **Create** | Zustand auth store, pakai StorageAdapter, tidak langsung localStorage |
| `packages/shared/src/stores/dataStore.ts` | **Create** | Zustand data store, sama persis logika dari web |
| `packages/shared/src/validation/index.ts` | **Create** | Zod schemas yang diekstrak dari server |
| `apps/web/package.json` | **Modify** | Tambah dependency `"@metrocoop/shared": "*"`, pindahkan scripts dari root |
| `apps/web/tsconfig.json` | **Modify** | Extends root tsconfig + references shared |
| `apps/web/vite.config.ts` | **Modify** | Update alias/resolve untuk `@metrocoop/shared` |
| `apps/web/src/lib/api.ts` | **Modify** | Ubah jadi re-export/wrapper dari shared API client dengan WebStorageAdapter |
| `apps/web/src/stores/authStore.ts` | **Modify** | Re-export dari shared store |
| `apps/web/src/stores/dataStore.ts` | **Modify** | Re-export dari shared store |
| `apps/web/src/types.ts` | **Modify** | Re-export dari shared types |
| `apps/web/index.html` | **Move** | Pindah ke `apps/web/index.html` |
| `apps/web/src/` | **Move** | Seluruh `src/` pindah ke `apps/web/src/` |
| `apps/web/public/` | **Move** | Seluruh `public/` pindah ke `apps/web/public/` |

**How:**
1. Root `package.json` — hapus `"scripts"` yang spesifik web, ganti dengan scripts monorepo (`dev`, `build`, `lint` via `npm run -w`). Tambah `"workspaces"`.
2. Buat struktur `packages/shared/` dengan package.json, tsconfig, dan source code.
3. Ekstrak `src/types.ts` ke `packages/shared/src/types/index.ts` — pure TypeScript, tanpa perubahan.
4. Buat `StorageAdapter` interface di shared → implementasi `WebStorageAdapter` untuk web, nanti `AsyncStorageAdapter` untuk mobile.
5. Ekstrak API client ke shared: pindahkan logika dari `src/lib/api.ts`, tapi gunakan `StorageAdapter` untuk token.
6. Ekstrak Zustand stores: `authStore.ts` dan `dataStore.ts` ke shared. Auth store pakai `StorageAdapter`. Data store pakai shared API client.
7. Ekstrak Zod schemas dari server ke shared untuk validasi client-side.
8. Pindahkan folder `src/`, `public/`, `index.html` ke `apps/web/`.
9. Update `apps/web/` untuk menggunakan shared package (`@metrocoop/shared`).
10. File-file asli di root (`server.ts`, `server/`, `db/`, dll.) **tetap di root** — server tidak ikut monorepo.

### Phase 2 — Setup Expo Mobile Project

**Files to create:**

| File | Description |
|---|---|
| `apps/mobile/package.json` | Expo project |
| `apps/mobile/tsconfig.json` | Extends root + path untuk `@metrocoop/shared` |
| `apps/mobile/app.json` | Expo config |
| `apps/mobile/App.tsx` | Entry point — import shared stores + api |
| `apps/mobile/src/navigation/` | React Navigation setup |
| `apps/mobile/src/screens/` | Screen templates |
| `apps/mobile/src/storageAdapter.ts` | `AsyncStorageAdapter` implementasi `StorageAdapter` |

**How:**
1. `npx create-expo-app apps/mobile --template blank-typescript` — inisialisasi Expo project.
2. Tambah dependency: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `zustand`, `expo-secure-store` (untuk token storage yang aman di mobile).
3. Tambah `"@metrocoop/shared": "*"` di `apps/mobile/package.json`.
4. Buat `apps/mobile/src/storageAdapter.ts`: implementasi `StorageAdapter` dari shared menggunakan `expo-secure-store`.
5. Buat `apps/mobile/App.tsx`: export default component yang initialize shared auth store dengan `AsyncStorageAdapter`.
6. Buat struktur navigasi dasar: Auth stack (login) → Main tabs (beranda, simpanan, pinjaman, profil).
7. Buat screen template: LoginScreen, HomeScreen, ProfileScreen.

### Phase 3 — TRAE Automation Bridge

**File to create:**

| File | Description |
|---|---|
| `.trae/automations/bridge-sync.mjs` | Script automation yang dijalankan TRAE |

**How:**
1. Buat script automation `.trae/automations/bridge-sync.mjs` yang melakukan:
   a. `npm install` di root untuk sync dependencies
   b. `npx tsc -b` — TypeScript compile semua workspace
   c. `npm run lint:shared` — lint khusus shared package
   d. Jika ada error, tulis ke file `.trae/automations/last-sync-report.md`
   e. Jika sukses, update timestamp file `.trae/automations/last-sync-ok.txt`
2. Buat TRAE Schedule dengan cron harian: dijadwalkan setiap hari pukul 06:00 WIB
3. Automation juga bisa di-trigger manual kapan saja via TRAE

### Phase 4 — Verifikasi & Testing

1. `npm install` di root → install semua workspace
2. `npx tsc -b` → semua workspace compile tanpa error
3. `npm run dev` (root) → web app jalan seperti biasa
4. `cd apps/mobile && npx expo start` → mobile app bisa running
5. Verifikasi bahwa merubah type di `packages/shared/src/types/` otomatis mempengaruhi type-checking web maupun mobile

---

## Assumptions & Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Server (`server.ts`, `server/`, `db/`) tetap di root | Tidak perlu masuk monorepo — mobile tetap pakai REST API yang sama via network |
| 2 | npm workspaces, bukan pnpm/turborepo | Minimal change, web sudah pake npm, tidak perlu setup tambahan |
| 3 | `expo-secure-store` untuk token di mobile | Lebih aman daripada AsyncStorage untuk JWT |
| 4 | Shared package sebagai "source of truth" types/api/stores | Perubahan di shared otomatis terdeteksi TypeScript di semua workspace |
| 5 | Automation hanya verifikasi + report, bukan edit otomatis | Menghindari perubahan kode yang tidak diinginkan |
| 6 | Zod schemas di-shared bukan cuma di server | Validasi client-side di mobile bisa langsung pakai schema yang sama |

---

## Dependencies

- Node.js 18+ (sama seperti sekarang)
- Expo CLI (`npx create-expo-app`)
- `expo-secure-store` untuk token storage di mobile
- `@react-navigation/*` untuk navigasi mobile

---

## Verification Steps

1. **Monorepo integrity**: `npm install` dari root sukses, semua workspace terdaftar di `node_modules`
2. **TypeScript**: `npx tsc -b` — zero error di semua workspace
3. **Web app**: `npm run dev` dari root → `http://localhost:3000` jalan seperti biasa
4. **Mobile app**: `cd apps/mobile && npx expo start` → Metro bundler jalan
5. **Shared type propagation**: Ubah tipe di `packages/shared/src/types/`, pastikan type error muncul di `apps/web/src/` dan `apps/mobile/src/` (tanpa restart)
6. **Automation**: Jalankan script automation → report file ter-generate
