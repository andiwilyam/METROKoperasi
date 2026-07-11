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
