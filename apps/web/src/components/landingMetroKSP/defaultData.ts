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
