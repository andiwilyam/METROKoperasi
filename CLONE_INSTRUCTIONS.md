# Panduan Clone & Setup (Akun Trae / Mesin Kedua)

Repo ini bisa diedit dari banyak Trae/mesin sekaligus karena Git dirancang untuk kolaborasi.
Ikuti panduan ini supaya tidak bentrok dengan automation di mesin utama.

## 1. Prasyarat
- Git (https://git-scm.com)
- GitHub CLI `gh` (opsional, untuk clone mudah): `winget install --id GitHub.cli`
- Node.js 24+

## 2. Clone repo
```bash
gh repo clone andiwilyam/METROKoperasi
# atau
git clone https://github.com/andiwilyam/METROKoperasi.git
cd METROKoperasi
```

## 3. Install dependensi
```bash
npm install
```

## 4. Setup file .env (PENTING)
File `.env` **tidak di-upload ke GitHub** (rahasia DB & API key). Minta nilainya ke pemilik repo (`andiwilyam`), lalu buat sendiri:
```bash
cp .env.example .env   # kalau ada template
# edit .env dan isi DB_HOST, DB_PASS, GEMINI_API_KEY, dll
```

## 5. Jalankan aplikasi
```bash
npm run dev
# buka http://localhost:3000
```

## 6. Ambil perubahan terbaru (dari mesin utama)
```bash
git pull
```

## 7. Kirim perubahan Anda ke GitHub
Gunakan salah satu:
```bash
# Cara A: manual
git add -A
git commit -m "pesan perubahan"
git push

# Cara B: alias git sync (kalau sudah diset di mesin ini)
git sync "pesan perubahan"
```

## ⚠️ ATURAN PENTING — Hindari Bentrok Automation
- **JANGAN** pasang automation auto-push di mesin ini. Automation auto-sync tiap 30 menit
  HANYA ada di mesin utama (`andiwilyam`). Kalau dua mesin auto-push ke `main` bersamaan,
  push akan sering ditolak (rejected) dan riwayat jadi berantakan.
- Sebelum `push`, selalu `git pull` dulu agar tidak konflik.
- Jika ada konflik saat pull: resolve manual, jangan pakai `git push --force`.
- JANGAN pernah commit file `.env` / `.env.local` (sudah di-abaikan .gitignore).

## Alur Kolaborasi yang Aman
```
Mesin Utama (andiwilyam)          Mesin Kedua (Anda)
  edit → auto-push 30 mnt    →→→  GitHub
  edit                          ←←←  git pull (ambil perubahan)
  git pull (ambil perubahan)  ←←←  edit → git push (manual)
```
