import React from 'react';

interface NavbarProps {
  settings: any;
}

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.koperasiName || 'Logo'} className="h-9" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white" style={{ background: 'var(--ve-primary)' }}>
                {settings?.koperasiName?.charAt(0) || 'K'}
              </div>
            )}
            <div>
              <span className="text-xl font-bold tracking-tight" style={{ color: scrolled ? '#1e293b' : '#fff' }}>
                {settings?.koperasiName || 'KSP'}
              </span>
              <p className="text-[10px] -mt-1" style={{ color: scrolled ? '#94a3b8' : 'rgba(255,255,255,0.6)' }}>
                {settings?.koperasiTagline || 'Koperasi Simpan Pinjam'}
              </p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${scrolled ? 'text-slate-600 hover:text-slate-800' : 'text-white/80 hover:text-white'}`}
            >
              Masuk
            </a>
            <a
              href="/login"
              className="text-sm font-bold px-5 py-2.5 rounded-lg text-white shadow-md transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--ve-primary)' }}
            >
              Portal Anggota
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
