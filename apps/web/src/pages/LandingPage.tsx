import React from 'react';
import ThemeProvider from '../components/landing/ThemeProvider';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import TeamGrid from '../components/landing/TeamGrid';
import TestimonialSlider from '../components/landing/TestimonialSlider';
import PricingTable from '../components/landing/PricingTable';
import ContactFooter from '../components/landing/ContactFooter';

const DEFAULT_DATA = {
  settings: {
    koperasiName: 'MetroMitra',
    koperasiTagline: 'Sistem Informasi Koperasi Terintegrasi',
    primaryColor: '#2563eb',
    secondaryColor: '#d97706',
    isPublished: true,
  },
  hero: {
    badgeText: 'Platform Koperasi Digital Terpercaya',
    headline: 'Kelola Koperasi Simpan Pinjam dengan Mudah & Profesional',
    subheadline: 'Satu platform terintegrasi untuk mengelola keanggotaan, simpanan, pinjaman, akuntansi SAK ETAP, dan unit usaha dalam satu ekosistem cloud yang aman.',
    ctaPrimaryText: 'Coba Demo Gratis',
    ctaPrimaryLink: '/login',
    ctaSecondaryText: 'Lihat Fitur',
    ctaSecondaryLink: '#fitur',
    backgroundType: 'gradient',
  },
  features: [
    { id: 'd1', iconName: 'Users', title: 'Manajemen Anggota', description: 'Kelola data anggota, 4 jenis simpanan, setoran tarik tunai, dan mutasi rekening secara real-time.' },
    { id: 'd2', iconName: 'DollarSign', title: 'Pinjaman 3 Metode Bunga', description: 'Proses pengajuan, persetujuan, pencairan, dan angsuran dengan metode Flat, Efektif, dan Anuitas.' },
    { id: 'd3', iconName: 'BookOpen', title: 'Akuntansi SAK ETAP', description: 'Jurnal otomatis dari setiap transaksi, COA, Buku Besar, Neraca Saldo, dan laporan keuangan.' },
    { id: 'd4', iconName: 'ShoppingCart', title: 'POS Retail & Toko', description: 'Kelola stok barang, kategori, supplier, kasir penjualan, dan laporan laba-rugi real-time.' },
    { id: 'd5', iconName: 'Smartphone', title: 'PPOB & Digital Payment', description: 'Layanan pembayaran pulsa, listrik, PDAM, BPJS, Virtual Account, dan top-up digital.' },
    { id: 'd6', iconName: 'TrendingUp', title: 'Ventura & AI Audit', description: 'Kelola investasi ventura, dividen perusahaan, dan audit risiko berbasis AI Google Gemini.' },
  ],
  team: [],
  testimonials: [
    { id: 'dt1', name: 'Sari Purnama', position: 'Ketua Koperasi Maju Bersama', content: 'Sejak menggunakan MetroMitra, laporan keuangan koperasi kami jadi lebih rapi dan cepat. Auto jurnalnya sangat membantu tim akuntansi.', rating: 5 },
    { id: 'dt2', name: 'Agus Kurniawan', position: 'Manager Koperasi Sejahtera', content: 'Anggota kami senang bisa cek saldo dan ajukan pinjaman secara mandiri lewat portal anggota. Sangat memudahkan operasional!', rating: 5 },
    { id: 'dt3', name: 'Dewi Wulandari', position: 'Bendahara Koperasi Berkah', content: 'Fitur POS toko dan PPOB sangat membantu diversifikasi usaha koperasi kami. Semua terintegrasi dalam satu sistem.', rating: 5 },
  ],
  pricing: [
    { id: 'dp1', planName: 'Basic', priceAmount: 'Gratis', description: 'Trial 30 hari', features: ['Manajemen Anggota', 'Simpanan & Pinjaman'], ctaText: 'Mulai Coba', sortOrder: 1 },
    { id: 'dp2', planName: 'Pro', priceAmount: 'Rp 499K', description: 'Koperasi berkembang', isPopular: true, features: ['Semua fitur Basic', 'Akuntansi SAK ETAP', 'POS Toko & Stok', 'Multi Cabang'], ctaText: 'Hubungi Sekarang', sortOrder: 2 },
    { id: 'dp3', planName: 'Enterprise', priceAmount: 'Custom', description: 'Koperasi besar & grup', features: ['Semua fitur Pro', 'Ventura & AI Audit', 'API Integration', 'Support 24/7'], ctaText: 'Hubungi Kami', sortOrder: 3 },
  ],
  contact: {
    email: 'info@metromitra.id',
    phone: '(021) 1234-5678',
    address: 'Jakarta, Indonesia',
    officeHours: 'Senin-Jumat: 08:00-17:00',
    footerDescription: 'Platform digitalisasi koperasi simpan pinjam terintegrasi — by PT Metro Komunika Asia. Design by Andi Wilyam.',
  },
};

// Convert snake_case API response to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
    return result;
  }
  return obj;
}

export default function LandingPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Deep merge API data with defaults — API data takes precedence
  function mergeWithDefaults(api: any): any {
    const merged = JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (!api) return merged;
    if (api.settings) Object.assign(merged.settings, api.settings);
    if (api.hero) Object.assign(merged.hero, api.hero);
    if (api.features?.length) merged.features = api.features;
    if (api.team?.length) merged.team = api.team;
    if (api.testimonials?.length) merged.testimonials = api.testimonials;
    if (api.pricing?.length) merged.pricing = api.pricing;
    if (api.contact) Object.assign(merged.contact, api.contact);
    // Honor publish state from DB
    if (api.settings?.isPublished !== undefined) merged.settings.isPublished = api.settings.isPublished;
    return merged;
  }

  React.useEffect(() => {
    fetch('/api/public/landing')
      .then(r => r.json())
      .then(d => {
        const camel = toCamelCase(d);
        setData(mergeWithDefaults(camel));
        setLoading(false);
      })
      .catch(() => { setData(DEFAULT_DATA); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider settings={data.settings}>
      <Navbar settings={data.settings} />
      <HeroSection hero={data.hero} featuresCount={data.features?.length || 0} />
      <FeaturesGrid features={data.features || []} />
      <TeamGrid team={data.team || []} />
      <TestimonialSlider testimonials={data.testimonials || []} />
      <PricingTable pricing={data.pricing || []} />
      <ContactFooter contact={data.contact} settings={data.settings} />
    </ThemeProvider>
  );
}
