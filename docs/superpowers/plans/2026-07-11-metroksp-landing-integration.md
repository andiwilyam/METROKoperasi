# Integrasi Landing Page MetroKSP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan landing page publik MetroKSP (Koperasi Simpan Pinjam) ke aplikasi web `MetroCoop` di rute `/metroksp`, terisolasi sepenuhnya agar tidak memengaruhi landing MetroMitra yang ada maupun aplikasi utama.

**Architecture:** Landing MetroKSP dibangun sebagai pohon komponen baru di `apps/web/src/components/landingMetroKSP/*` + halaman `apps/web/src/pages/MetroKspLandingPage.tsx`, dengan data statis lokal (`defaultData.ts` bertipe `LandingPageData`). Semua visual dibungkus dalam container `.metroksp` yang mendefinisikan token warna/font lokal (emas/hijau + Fraunces/Jakarta Sans) sehingga tidak bocor ke app lain. Routing ditambahkan secara *additive* di `App.tsx`.

**Tech Stack:** React 19 + Vite 6 + TypeScript + Tailwind CSS v4 + lucide-react (sudah ada di deps). Tanpa backend/CMS.

**Catatan verifikasi:** Aplikasi ini belum punya test harness (Jest/Vitest) yang terkonfigurasi, maka gerbang verifikasi tiap kelompok adalah `npx tsc --noEmit` (type-check seluruh project) + dev server + screenshot, bukan unit test. Perintah & ekspektasi ditulis eksplisit di tiap task.

---

## File Structure (semua BARU, terisolasi)

```
apps/web/src/
├─ pages/MetroKspLandingPage.tsx            # Create: komposisi section MetroKSP
└─ components/landingMetroKSP/
   ├─ metroksp.css                          # Create: token + scoping (.metroksp *)
   ├─ defaultData.ts                        # Create: data MetroKSP (typed LandingPageData)
   ├─ Navbar.tsx                            # Create
   ├─ HeroSection.tsx                       # Create
   ├─ FeaturesGrid.tsx                      # Create
   ├─ TeamGrid.tsx                          # Create
   ├─ TestimonialSlider.tsx                 # Create
   ├─ PricingTable.tsx                      # Create (kartu ringkasan produk & bunga)
   └─ ContactFooter.tsx                     # Create
apps/web/index.html                         # Modify: +2 font <link>
apps/web/src/App.tsx                        # Modify: +import + 1 blok if rute /metroksp
```

TIDAK diubah: `components/landing/*`, `pages/LandingPage.tsx`, `data.ts`, `packages/shared/*`, `metadata.json`, server, mobile, `index.css` global.

---

### Task 1: Buat token & scoping CSS (`metroksp.css`)

**Files:** Create `apps/web/src/components/landingMetroKSP/metroksp.css`

- [ ] **Step 1: Tulis file CSS**

```css
/* MetroKSP landing — semua token & style ter-scoped di dalam .metroksp
   agar tidak memengaruhi aplikasi utama (MetroMitra/dashboard/login). */
.metroksp {
  --mk-primary: #d4a017;          /* emas */
  --mk-primary-soft: rgba(212, 160, 23, 0.12);
  --mk-secondary: #15604a;        /* hijau pinus */
  --mk-secondary-soft: rgba(21, 96, 74, 0.10);
  --mk-ink: #0c2b20;
  --mk-cream: #f4ede0;
  --mk-paper: #fbf8f1;
  --mk-muted: #5d6f64;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: var(--mk-ink);
  -webkit-font-smoothing: antialiased;
}
.metroksp h1,
.metroksp h2,
.metroksp h3,
.metroksp h4,
.metroksp .mk-display {
  font-family: 'Fraunces', Georgia, serif;
  letter-spacing: -0.01em;
}
.metroksp a { color: inherit; }
.metroksp .mk-hero-bg {
  background: linear-gradient(160deg, #0e3d30 0%, #0c2b20 60%, #081d16 100%);
}
.metroksp .mk-cta-bg { background: var(--mk-secondary); }
```

- [ ] **Step 2: Import CSS di `MetroKspLandingPage.tsx` (lakukan di Task 10)** — pastikan `import './components/landingMetroKSP/metroksp.css';` ada.
- [ ] **Step 3: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/metroksp.css && git commit -m "feat(metroksp): token & scoping CSS terisolasi"
```

---

### Task 2: Buat data default MetroKSP (`defaultData.ts`)

**Files:** Create `apps/web/src/components/landingMetroKSP/defaultData.ts`

- [ ] **Step 1: Tulis data (typed `LandingPageData`)**

```ts
import type { LandingPageData } from '@metrocoop/shared/types';

// Data statis lokal MetroKSP. Admin CMS tetap mengelola landing MetroMitra.
// Semua nilai legal/kontak bertanda "[ … ]" = placeholder untuk diisi pemilik.
export const metroKspData: LandingPageData = {
  settings: {
    id: 'metroksp-settings',
    koperasiName: 'MetroKSP',
    koperasiTagline: 'Koperasi Simpan Pinjam',
    primaryColor: '#d4a017',
    secondaryColor: '#15604a',
    logoUrl: '',
    faviconUrl: '',
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  hero: {
    id: 'metroksp-hero',
    badgeText: 'Koperasi Simpan Pinjam',
    headline: 'Simpan dengan tenang. Pinjam dengan mudah.',
    subheadline:
      'MetroKSP membantu warga dan UMKM tumbuh lewat simpanan aman, pinjaman terukur, dan pelayanan yang manusiawi.',
    ctaPrimaryText: 'Daftar Anggota',
    ctaPrimaryLink: '#kontak',
    ctaSecondaryText: 'Lihat Produk',
    ctaSecondaryLink: '#produk',
    backgroundType: 'gradient',
    bgImageUrl: '',
    isActive: true,
  },
  features: [
    {
      id: 'feat-simpanan',
      iconName: 'PiggyBank',
      title: 'Simpanan',
      description:
        'Tabungan harian, simpanan pokok & wajib, dengan bagi hasil yang jelas setiap periode.',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'feat-pinjaman',
      iconName: 'HandCoins',
      title: 'Pinjaman',
      description:
        'Kredit usaha dan konsumtif dengan bunga rendah, proses cepat, tanpa biaya tersembunyi.',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'feat-deposito',
      iconName: 'Landmark',
      title: 'Deposito',
      description:
        'Simpanan berjangka dengan imbal hasil stabil untuk mewujudkan cita-cita jangka panjang Anda.',
      sortOrder: 3,
      isActive: true,
    },
  ],
  team: [
    { id: 'team-1', name: '[ Nama Ketua ]', position: 'Ketua', photoUrl: '', sortOrder: 1 },
    { id: 'team-2', name: '[ Nama Direktur ]', position: 'Direktur', photoUrl: '', sortOrder: 2 },
    { id: 'team-3', name: '[ Nama Bendahara ]', position: 'Bendahara', photoUrl: '', sortOrder: 3 },
  ],
  testimonials: [
    {
      id: 'testi-1',
      name: '[ Ibu Siti ]',
      position: 'Pedagang Warung, Bekasi',
      content:
        'Sejak gabung MetroKSP, modal warung saya naik. Pinjamannya cepat cair dan bunganya masuk akal.',
      avatarUrl: '',
      rating: 5,
      sortOrder: 1,
    },
    {
      id: 'testi-2',
      name: '[ Bapak Budi ]',
      position: 'Guru, Yogyakarta',
      content:
        'Anak saya bisa kuliah karena tabungan deposito di sini. Pelayannya ramah, tidak berbelit.',
      avatarUrl: '',
      rating: 5,
      sortOrder: 2,
    },
    {
      id: 'testi-3',
      name: '[ Ibu Rina ]',
      position: 'UMKM, Jakarta',
      content:
        'Pinjaman usaha cair tepat waktu. Cicilannya ringan dan jelas sejak awal.',
      avatarUrl: '',
      rating: 5,
      sortOrder: 3,
    },
  ],
  pricing: [
    {
      id: 'price-simpanan',
      planName: 'Simpanan',
      priceLabel: 'Bagi hasil',
      priceAmount: '[ X % / thn ]',
      description: 'Simpanan sukarela & berjangka',
      isPopular: false,
      features: ['Bagi hasil bulanan', 'Cair kapan saja', 'Tanpa biaya admin'],
      ctaText: 'Pelajari',
      ctaLink: '#kontak',
      sortOrder: 1,
    },
    {
      id: 'price-pinjaman',
      planName: 'Pinjaman',
      priceLabel: 'Bunga mulai',
      priceAmount: '[ Y % flat ]',
      description: 'Kredit usaha & konsumtif',
      isPopular: true,
      features: ['Proses cepat', 'Tenor fleksibel', 'Tanpa biaya tersembunyi'],
      ctaText: 'Ajukan',
      ctaLink: '#kontak',
      sortOrder: 2,
    },
    {
      id: 'price-deposito',
      planName: 'Deposito',
      priceLabel: 'Imbal hasil',
      priceAmount: '[ W % / thn ]',
      description: 'Simpanan berjangka 3–12 bulan',
      isPopular: false,
      features: ['Tenor 3/6/12 bulan', 'Imbal hasil stabil', 'Aman & terawasi'],
      ctaText: 'Pelajari',
      ctaLink: '#kontak',
      sortOrder: 3,
    },
  ],
  contact: {
    id: 'metroksp-contact',
    email: 'halo@metroksp.id',
    phone: '[ +62 21 0000 0000 ]',
    whatsapp: '',
    address: '[ Jl. … ]',
    officeHours: 'Senin–Jumat 08.00–16.00 WIB',
    mapEmbedUrl: '',
    footerDescription:
      'Terdaftar & diawasi OJK. [ No. SK OJK ], [ No. Badan Hukum ].',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    socialYoutube: '',
  },
};
```

- [ ] **Step 2: Type-check cepat (pastikan tipe sesuai `LandingPageData`)**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | head -20`
Expected: tidak ada error yang menyebut `landingMetroKSP/defaultData.ts`. (Error dari file lain yang sudah ada tidak apa-apa; tugas ini hanya memastikan file ini lolos tipe.)

- [ ] **Step 3: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/defaultData.ts && git commit -m "feat(metroksp): data default MetroKSP (typed LandingPageData)"
```

---

### Task 3: Navbar MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/Navbar.tsx`

- [ ] **Step 1: Tulis komponen**

```tsx
import React from 'react';

interface NavbarProps { settings: any; }

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const name = settings?.koperasiName || 'MetroKSP';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/metroksp" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white" style={{ background: 'var(--mk-secondary)' }}>
              {name.charAt(0) || 'M'}
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight" style={{ color: scrolled ? 'var(--mk-ink)' : '#fff' }}>{name}</span>
              <p className="text-[10px] -mt-1" style={{ color: scrolled ? 'var(--mk-muted)' : 'rgba(255,255,255,0.6)' }}>{settings?.koperasiTagline || 'Koperasi Simpan Pinjam'}</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a href="#produk" className={`hidden md:inline text-sm font-semibold px-4 py-2 rounded-lg transition ${scrolled ? 'text-slate-600 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}>Produk</a>
            <a href="#tentang" className={`hidden md:inline text-sm font-semibold px-4 py-2 rounded-lg transition ${scrolled ? 'text-slate-600 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}>Tentang</a>
            <a href="#kontak" className={`hidden md:inline text-sm font-semibold px-4 py-2 rounded-lg transition ${scrolled ? 'text-slate-600 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}>Kontak</a>
            <a href="#kontak" className="text-sm font-bold px-5 py-2.5 rounded-lg text-white shadow-md transition-all hover:-translate-y-0.5" style={{ background: 'var(--mk-primary)' }}>
              Ajukan Pinjaman
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/Navbar.tsx && git commit -m "feat(metroksp): navbar terisolasi"
```

---

### Task 4: HeroSection MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/HeroSection.tsx`

- [ ] **Step 1: Tulis komponen** (gradient hijau, badge, headline, 2 CTA, kartu keunggulan di kanan)

```tsx
import React from 'react';
import { PiggyBank, HandCoins, ShieldCheck } from 'lucide-react';

interface HeroSectionProps { hero: any; }
const points = [
  { icon: PiggyBank, t: 'Bagi hasil transparan' },
  { icon: HandCoins, t: 'Pinjaman bunga rendah' },
  { icon: ShieldCheck, t: 'Diawasi OJK' },
];

export default function HeroSection({ hero }: HeroSectionProps) {
  if (!hero?.headline) return null;
  return (
    <section className="metroksp mk-hero-bg relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {hero.badgeText && (
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium" style={{ color: 'var(--mk-primary)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--mk-primary)' }}></span>
                {hero.badgeText}
              </span>
            )}
            <h1 className="mk-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">{hero.headline}</h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">{hero.subheadline}</p>
            <div className="flex flex-wrap gap-4">
              {hero.ctaPrimaryText && (
                <a href={hero.ctaPrimaryLink || '#kontak'} className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl text-base font-bold shadow-lg transition-all hover:-translate-y-0.5" style={{ background: 'var(--mk-primary)' }}>
                  {hero.ctaPrimaryText}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
              {hero.ctaSecondaryText && (
                <a href={hero.ctaSecondaryLink || '#produk'} className="inline-flex items-center gap-2 border border-white/30 hover:border-white/50 text-white px-7 py-3.5 rounded-xl text-base font-semibold transition-all">{hero.ctaSecondaryText}</a>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
              <p className="text-sm font-semibold text-white">Mengapa MetroKSP</p>
              {points.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--mk-primary)' }}><Icon className="w-5 h-5" /></div>
                    <span className="text-white text-sm font-medium">{p.t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/HeroSection.tsx && git commit -m "feat(metroksp): hero section"
```

---

### Task 5: FeaturesGrid MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/FeaturesGrid.tsx`

- [ ] **Step 1: Tulis komponen** (peta `iconName` → lucide; fallback ShieldCheck)

```tsx
import React from 'react';
import { PiggyBank, HandCoins, Landmark, ShieldCheck, type LucideIcon } from 'lucide-react';

interface FeaturesGridProps { features: any[]; }

const iconMap: Record<string, LucideIcon> = {
  PiggyBank, HandCoins, Landmark, ShieldCheck,
};

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  if (!features?.length) return null;
  return (
    <section id="produk" className="py-24" style={{ background: 'var(--mk-paper)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Produk</span>
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Untuk setiap langkah keuangan Anda</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f: any) => {
            const Icon = iconMap[f.iconName] || ShieldCheck;
            return (
              <div key={f.id} className="bg-white border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--mk-primary-soft)' }}>
                  <Icon className="w-7 h-7" style={{ color: 'var(--mk-secondary)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--mk-ink)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mk-muted)' }}>{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/FeaturesGrid.tsx && git commit -m "feat(metroksp): features grid"
```

---

### Task 6: TeamGrid MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/TeamGrid.tsx`

- [ ] **Step 1: Tulis komponen**

```tsx
import React from 'react';

interface TeamGridProps { team: any[]; }

export default function TeamGrid({ team }: TeamGridProps) {
  if (!team?.length) return null;
  return (
    <section id="tentang" className="py-20" style={{ background: 'var(--mk-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Pengurus</span>
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Struktur <span style={{ color: 'var(--mk-primary)' }}>Pengurus</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl overflow-hidden border text-center hover:shadow-md transition-all" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
              <div className="h-40 flex items-center justify-center text-sm font-semibold" style={{ background: 'var(--mk-secondary)', color: 'rgba(255,255,255,0.85)' }}>
                {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <span>{t.name?.charAt(0) || '?'}</span>}
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold" style={{ color: 'var(--mk-ink)' }}>{t.name}</h4>
                <p className="text-xs font-medium" style={{ color: 'var(--mk-primary)' }}>{t.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/TeamGrid.tsx && git commit -m "feat(metroksp): team grid"
```

---

### Task 7: TestimonialSlider MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/TestimonialSlider.tsx`

- [ ] **Step 1: Tulis komponen** (grid statis 3 kolom; bintang dari lucide `Star`)

```tsx
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialSliderProps { testimonials: any[]; }

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  if (!testimonials?.length) return null;
  return (
    <section className="py-20" style={{ background: 'var(--mk-paper)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Testimoni</span>
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Apa Kata <span style={{ color: 'var(--mk-primary)' }}>Anggota</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-all" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
              <div className="flex mb-4" style={{ color: 'var(--mk-primary)' }}>
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--mk-muted)' }}>"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--mk-secondary)' }}>{t.name?.charAt(0) || '?'}</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--mk-ink)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--mk-muted)' }}>{t.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/TestimonialSlider.tsx && git commit -m "feat(metroksp): testimonial slider"
```

---

### Task 8: PricingTable MetroKSP (ringkasan produk & bunga)

**Files:** Create `apps/web/src/components/landingMetroKSP/PricingTable.tsx`

- [ ] **Step 1: Tulis komponen** (judul "Produk & Bunga"; kartu = Simpanan/Pinjaman/Deposito; `priceAmount` = estimasi bunga)

```tsx
import React from 'react';

interface PricingTableProps { pricing: any[]; }

export default function PricingTable({ pricing }: PricingTableProps) {
  if (!pricing?.length) return null;
  return (
    <section className="py-24" style={{ background: 'var(--mk-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Produk & Bunga</span>
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Ringkasan <span style={{ color: 'var(--mk-primary)' }}>Produk</span></h2>
          <p className="text-base mt-2" style={{ color: 'var(--mk-muted)' }}>Estimasi sesuai batas OJK; angka final disampaikan sebelum kontrak.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((p: any) => (
            <div key={p.id} className={`rounded-2xl p-8 flex flex-col ${p.isPopular ? 'scale-105 shadow-xl border-2' : 'border shadow-sm hover:shadow-md'}`}
              style={p.isPopular ? { borderColor: 'var(--mk-primary)', background: 'var(--mk-paper)' } : { borderColor: 'rgba(12,43,32,0.08)', background: '#fff' }}>
              {p.isPopular && (
                <span className="self-center -mt-12 mb-4 text-white text-xs font-bold px-4 py-1 rounded-full" style={{ background: 'var(--mk-primary)' }}>Paling Diminati</span>
              )}
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--mk-ink)' }}>{p.planName}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--mk-muted)' }}>{p.description}</p>
              <div className="mb-6">
                {p.priceLabel && <span className="text-sm" style={{ color: 'var(--mk-muted)' }}>{p.priceLabel} </span>}
                <span className="text-3xl font-bold" style={{ color: p.isPopular ? 'var(--mk-primary)' : 'var(--mk-ink)' }}>{p.priceAmount}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm" style={{ color: 'var(--mk-muted)' }}>
                {(p.features || []).map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--mk-primary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={p.ctaLink || '#kontak'} className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${p.isPopular ? 'text-white shadow-md hover:-translate-y-0.5' : 'border hover:border-opacity-70'}`}
                style={p.isPopular ? { background: 'var(--mk-primary)' } : { borderColor: 'rgba(12,43,32,0.2)', color: 'var(--mk-ink)' }}>
                {p.ctaText || 'Pelajari'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/PricingTable.tsx && git commit -m "feat(metroksp): pricing/ringkasan produk"
```

---

### Task 9: ContactFooter MetroKSP

**Files:** Create `apps/web/src/components/landingMetroKSP/ContactFooter.tsx`

- [ ] **Step 1: Tulis komponen** (section kontak + CTA banner hijau + footer dgn 1 baris legalitas)

```tsx
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactFooterProps { contact: any; settings: any; }

export default function ContactFooter({ contact, settings }: ContactFooterProps) {
  const c = contact || {};
  return (
    <>
      <section id="kontak" className="py-20" style={{ background: 'var(--mk-paper)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Kontak</span>
            <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Hubungi <span style={{ color: 'var(--mk-primary)' }}>Kami</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Mail, label: 'Email', value: c.email || 'halo@metroksp.id' },
              { icon: Phone, label: 'Telepon', value: c.phone || '[ +62 21 0000 0000 ]' },
              { icon: MapPin, label: 'Kantor', value: c.address || '[ Alamat ]' },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <div key={i} className="text-center p-6 bg-white rounded-2xl border" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--mk-primary-soft)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--mk-secondary)' }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--mk-ink)' }}>{it.label}</h3>
                  <p className="text-sm" style={{ color: 'var(--mk-muted)' }}>{it.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 text-white mk-cta-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mb-4">Siap menjadikan keuangan lebih tenang?</h2>
          <p className="text-lg opacity-90 mb-8">Daftar anggota atau ajukan pinjaman hari ini. Tim MetroKSP siap membantu.</p>
          <a href="#kontak" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5" style={{ color: 'var(--mk-secondary)' }}>
            Daftar Anggota
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>

      <footer className="text-white py-12" style={{ background: 'var(--mk-ink)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: 'var(--mk-primary)' }}>M</div>
                <span className="text-base font-bold text-white">{settings?.koperasiName || 'MetroKSP'}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.footerDescription || 'Koperasi Simpan Pinjam.'}</p>
            </div>
            <div className="md:text-right">
              <h4 className="text-sm font-bold text-white mb-3">Jam Layanan</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.officeHours || 'Senin–Jumat 08.00–16.00 WIB'}</p>
            </div>
          </div>
          <div className="border-t pt-6 text-xs text-center" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
            &copy; {new Date().getFullYear()} {settings?.koperasiName || 'MetroKSP'}. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/components/landingMetroKSP/ContactFooter.tsx && git commit -m "feat(metroksp): contact + footer legalitas"
```

---

### Task 10: Halaman komposisi MetroKspLandingPage

**Files:** Create `apps/web/src/pages/MetroKspLandingPage.tsx`

- [ ] **Step 1: Tulis halaman** (import CSS, data, semua section dalam `.metroksp`)

```tsx
import React from 'react';
import '../components/landingMetroKSP/metroksp.css';
import { metroKspData } from '../components/landingMetroKSP/defaultData';
import Navbar from '../components/landingMetroKSP/Navbar';
import HeroSection from '../components/landingMetroKSP/HeroSection';
import FeaturesGrid from '../components/landingMetroKSP/FeaturesGrid';
import TeamGrid from '../components/landingMetroKSP/TeamGrid';
import TestimonialSlider from '../components/landingMetroKSP/TestimonialSlider';
import PricingTable from '../components/landingMetroKSP/PricingTable';
import ContactFooter from '../components/landingMetroKSP/ContactFooter';

export default function MetroKspLandingPage() {
  const d = metroKspData;
  return (
    <div className="metroksp">
      <Navbar settings={d.settings} />
      <HeroSection hero={d.hero} />
      <FeaturesGrid features={d.features} />
      <TeamGrid team={d.team} />
      <TestimonialSlider testimonials={d.testimonials} />
      <PricingTable pricing={d.pricing} />
      <ContactFooter contact={d.contact} settings={d.settings} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add src/pages/MetroKspLandingPage.tsx && git commit -m "feat(metroksp): halaman komposisi /metroksp"
```

---

### Task 11: Daftarkan rute `/metroksp` di App.tsx (additive)

**Files:** Modify `apps/web/src/App.tsx` (tambah 1 import + 1 blok `if` SEBELUM pengecekan `/`)

- [ ] **Step 1: Tambah import** di bawah `import LandingPage from './pages/LandingPage';` (baris 7)

```tsx
import MetroKspLandingPage from './pages/MetroKspLandingPage';
```

- [ ] **Step 2: Tambah blok rute** di dalam `AppContent`, SEBELUM `if (location.pathname === '/')` (yaitu sebelum baris 21)

```tsx
  // Landing publik MetroKSP (terisolasi, tidak memengaruhi aplikasi utama)
  if (location.pathname === '/metroksp') {
    return <MetroKspLandingPage />;
  }
```

- [ ] **Step 3: Verifikasi App.tsx** — pastikan blok di atas muncul sebelum `if (location.pathname === '/')` dan `import` ada di atas. Tidak ada baris lain yang diubah.
- [ ] **Step 4: Commit**

```bash
cd apps/web && git add src/App.tsx && git commit -m "feat(metroksp): daftarkan rute /metroksp (additive)"
```

---

### Task 12: Tambahkan font Fraunces + Plus Jakarta Sans di index.html

**Files:** Modify `apps/web/index.html` (tambah 3 baris `<link>` di `<head>`, setelah `<meta name="viewport">`)

- [ ] **Step 1: Tambah sebelum `</head>`**

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Commit**

```bash
cd apps/web && git add index.html && git commit -m "feat(metroksp): muat font Fraunces + Plus Jakarta Sans"
```

---

### Task 13: Type-check seluruh project

- [ ] **Step 1: Jalankan tsc**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | head -30`
Expected: tidak ada error yang menyebut `landingMetroKSP`. Jika ada error pada file lain yang sudah ada sebelum task ini, itu di luar cakupan (tidak diubah). Error spesifik `landingMetroKSP/*` harus 0.

- [ ] **Step 2: Fix jika ada** — perbaiki hanya file `landingMetroKSP/*` / `MetroKspLandingPage.tsx` / `App.tsx` yang Anda ubah, lalu commit perbaikan.

```bash
cd apps/web && git add -A && git commit -m "fix(metroksp): perbaikan type-check"
```

---

### Task 14: Jalankan dev server & verifikasi visual (regresi nol)

- [ ] **Step 1: Install deps & jalankan dev (jika belum)**

Run: `cd apps/web && npm install` (jika node_modules belum ada)
Run (background): `cd apps/web && npm run dev`

- [ ] **Step 2: Verifikasi `/metroksp`** — buka `http://localhost:5173/metroksp`:
  - Brand "MetroKSP" tampil; palet emas/hijau; font Fraunces (heading) + Jakarta Sans (body).
  - Section: hero, Produk (Simpanan/Pinjaman/Deposito), Pengurus, Testimoni, Produk & Bunga, Kontak + footer legalitas OJK.
  - Tanpa error di console browser.
  - Screenshot desktop (1280px) + mobile (390px).

- [ ] **Step 3: Verifikasi regresi `/`** — buka `http://localhost:5173/`:
  - Landing MetroMitra **tetap sama** (biru/amber, font asli). Bukti tidak ada regresi.
  - Screenshot untuk bandingkan.

- [ ] **Step 4: Commit akhir (jika ada penyesuaian kecil)**

```bash
cd apps/web && git add -A && git commit -m "chore(metroksp): verifikasi visual & regresi"
```

---

## Self-Review (dicek saat penulisan plan)

1. **Spec coverage:** Brand MetroKSP ✓ (Task 2/3/10), rute baru terisolasi ✓ (Task 11), token ter-scoped `.metroksp` ✓ (Task 1/10), font Fraunces/Jakarta Sans ✓ (Task 1/12), section CMS saja (hero/features/team/testimonials/pricing/contact) ✓ (Task 4–9), tanpa ubah app utama ✓ (Task 11 hanya add, Task 1/12 additive). Di luar scope (FAQ/legalitas penuh/cara kerja, ubah backend) sesuai spec §9.
2. **Placeholder scan:** Tidak ada "TBD"/"implement later". Semua step berisi kode lengkap. Placeholder konten (nama/alamat/SK OJK) memang disengaja & ditandai `[ … ]` sesuai spec §6.
3. **Type consistency:** `metroKspData` bertipe `LandingPageData` (Task 2); props tiap komponen (`settings`, `hero`, `features`, `team`, `testimonials`, `pricing`, `contact`) konsisten dengan pemanggilan di `MetroKspLandingPage` (Task 10). Nama ikon (`PiggyBank`, `HandCoins`, `Landmark`, `ShieldCheck`, `Star`, `Mail`, `Phone`, `MapPin`) adalah ekspor valid `lucide-react`.

## Execution Handoff

Plan complete dan tersimpan di `docs/superpowers/plans/2026-07-11-metroksp-landing-integration.md`. Dua opsi eksekusi:

**1. Subagent-Driven (recommended)** — saya dispatch subagent segar per task, review di antara task, iterasi cepat.
**2. Inline Execution** — eksekusi task di sesi ini dengan checkpoint peninjauan.

Mana yang dipilih?
