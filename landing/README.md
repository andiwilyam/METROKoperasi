# MetroKSP Landing Page

Landing page statis untuk **MetroKSP** — Koperasi Simpan Pinjam modern.

## Deploy Cepat (IGA Pages / Vercel / Netlify / Cloudflare Pages)

```bash
# IGA Pages (disarankan)
npx iga-pages deploy landing --prod

# Vercel
npx vercel deploy landing --prod

# Netlify
npx netlify deploy --dir=landing --prod

# Cloudflare Pages (via wrangler)
npx wrangler pages deploy landing
```

## Struktur

```
landing/
├── index.html      # Halaman utama
├── style.css       # Semua style (self-contained, no build step)
├── js/main.js      # Interaksi ringan (mobile menu, scroll animations, counter)
├── img/            # Tempatkan gambar hero, testimoni, dll di sini
└── README.md
```

## Kustomisasi

1. **Brand & Warna** — edit CSS custom properties di `:root` (style.css baris 1-20):
   ```css
   --mk-primary: #15604a;    /* hijau pinus */
   --mk-gold: #d4a017;       /* emas */
   ```

2. **Kontak & Info Koperasi** — ganti teks di `index.html` bagian footer & newsletter.

3. **Gambar** — taruh file di `img/` lalu update `background-image:url('img/...')` di HTML.

4. **CTA Daftar** — ganti link `href="https://metrocoop.app/register"` ke URL pendaftaran nyata.

## Performa

- **Zero build step** — langsung buka `index.html` atau deploy folder `landing/`.
- **No external JS framework** — hanya vanilla JS ~3 KB gzip.
- **Font Awesome via CDN** — bisa diganti dengan subset lokal jika perlu offline-first.

## Lisensi

MIT — gunakan bebas untuk koperasi Anda.