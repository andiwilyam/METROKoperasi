# MetroCoop — Production Readiness Checklist & Staging Deployment

## 1. Latar Belakang

Aplikasi MetroCoop (f.k.a. MetroMitra) adalah sistem informasi koperasi berbasis web + mobile dengan 4 role: admin, operator, anggota, perusahaan. Saat ini aplikasi sudah 100% fungsional (46 modul, 4 role login, E2E test pass) dan berjalan di environment development (`npm run dev`).

Tujuan: membawa aplikasi dari **development** ke **staging yang bisa diakses publik** untuk keperluan pilot ke 1-2 koperasi.

## 2. Assessment Infrastructure

### Kondisi Saat Ini
- **Server:** Express + SQLite, jalan via `tsx server.ts`
- **Frontend:** React + Vite, proxy `/api` ke `localhost:3000`
- **Database:** SQLite (file-based)
- **Docker:** Belum ada
- **Nginx:** Belum ada
- **SSL:** Belum ada
- **VPS:** Tidak ada

### Spesifikasi PC (Intel NUC)
- CPU: Intel Core i3-1115G4 (2C/4T) ✅
- RAM: 8 GB (hanya ~2 GB free) ⚠️
- Storage: 120 GB (hanya ~6.6 GB free) ⚠️
- Kesimpulan: Tidak cukup untuk Docker Desktop + WSL2 + PostgreSQL

### 5 Item Prioritas
1. **Deploy Staging** — Bisa dikerjakan sekarang (Lokal Lite)
2. **Security Audit** — Bisa dikerjakan setelah staging running
3. **Pilot 2 Koperasi** — Butuh #1 selesai
4. **Finalize Legal & Pricing** — Draft bisa sekarang, final butuh notaris
5. **Launch Paid** — Butuh #1-#4 selesai

## 3. Arsitektur Staging (Lokal Lite)

```
Pilot/Client ──HTTPS──→ ngrok Tunnel ──HTTP──→ localhost:3000
                                                    │
                                           ┌────────┴────────┐
                                           │  Express Server  │
                                           │  - Static (Vite) │
                                           │  - API (/api/*)  │
                                           │  - SQLite DB     │
                                           └─────────────────┘
```

### Komponen
| Komponen | Teknologi | Port |
|----------|-----------|------|
| Web App | React + Vite (build static) | 3000 (via express) |
| API Server | Express.js | 3000 |
| Database | SQLite (file) | - |
| Reverse Proxy | Express static middleware | - |
| SSL/TLS | ngrok (built-in) | - |
| Tunnel | ngrok (free tier) | - |

### Alur Deployment
1. `npm run build:all` → build web app (`apps/web/dist`) + server (`dist/server.cjs`)
2. `node dist/server.cjs` → express serve static files + API
3. `ngrok http 3000` → tunnel ke URL publik `https://xxxx.ngrok-free.app`
4. Akses `/` → landing page MetroKSP
5. Akses `/login` → dashboard app

## 4. Batasan ngrok Free Tier
- 40 requests/minute
- 8,000 connections/month
- URL berubah tiap restart (kecuali upgrade paid)
- Cocok untuk: demo, pilot 1-2 koperasi kecil, testing

## 5. Security (Minimal untuk Staging)
- [ ] JWT secret diganti dari default
- [ ] Helmet middleware aktif
- [ ] Rate limiting login
- [ ] SQLite file permission
- [ ] Environment variables via `.env`

## 6. Roadmap (Post-Staging)

Setelah staging running:

### Phase 2: Security Hardening (1 minggu)
- OWASP ZAP scan
- Fix critical/high findings
- CORS hardening
- Input validation review

### Phase 3: Pilot (3 bulan gratis)
- 1-2 koperasi pilot
- Ambil feedback & testimoni
- Iterasi fitur

### Phase 4: Upgrade Infrastructure
- Upgrade RAM PC (16GB) atau VPS $6-12/bln
- Migrasi SQLite → PostgreSQL
- Docker + Nginx + Let's Encrypt SSL
- Domain production

### Phase 5: Launch
- Legal entity & pricing final
- Terms of Service & Privacy Policy
- Case study dari pilot
- Marketing materials
