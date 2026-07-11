# 📢 Catatan Kolaborasi — MetroCoop (untuk akun metrokompedia)

Halo! Repo **`andiwilyam/METROKoperasi`** sudah saya buka untuk kolaborasi.
Berikut ringkasan perubahan & aturan main supaya kita tidak bentrok.

## ✅ Yang Sudah Dilakukan
1. **Anda ditambahkan sebagai Collaborator** (akses `write`) — silakan accept undangan di:
   https://github.com/andiwilyam/METROKoperasi/invitations
2. **Panduan clone & setup** sudah ada di file `CLONE_INSTRUCTIONS.md` (di repo, ikut ter-clone).
3. **Perbaikan aplikasi terbaru** (sudah di-repo):
   - API sekarang pakai **same-origin** (relatif `/api`) → fix error "Failed to fetch" saat login.
   - Tambah **akun Perusahaan**: `hijau_agri` / `perusahaan123` (portal ventura perusahaan).
   - Seed data & akun test (admin/operator/anggota) lengkap di `db/seed.sql`.

## 🔑 Akun Login (untuk testing)
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Operator | `operator` | `admin123` |
| Anggota | `1234567890` | `123456` |
| Perusahaan | `hijau_agri` | `perusahaan123` |

## ⚠️ Aturan Penting (HARAP DIPATUHI)
- **JANGAN pasang automation auto-push di mesin Anda.** Auto-sync tiap 30 menit
  HANYA ada di mesin `andiwilyam`. Dua mesin auto-push ke `main` akan bentrok (rejected).
- Sebelum `push`, selalu `git pull` dulu.
- **JANGAN** commit file `.env` / `.env.local` (berisi secret DB & API key, sudah di-gitignore).
- Jangan pakai `git push --force` atau `git reset --hard`.

## 🚀 Cara Mulai di Mesin Anda
```bash
gh repo clone andiwilyam/METROKoperasi
cd METROKoperasi
npm install
# buat file .env (minta nilai ke andiwilyam: DB_HOST/DB_PASS/GEMINI_API_KEY)
npm run dev          # buka http://localhost:3000
```

## 🔄 Alur Kolaborasi
```
andiwilyam : edit → auto-push 30 mnt → GitHub
metrokompedia: clone → edit → git pull dulu → git push (manual)
```

## 💡 Saran
Kalau mau eksperimen besar, pakai branch sendiri (`git checkout -b fitur-x`)
lalu buat Pull Request, biar `main` tetap stabil. Tanya andiwilyam kalau ragu.
