import React from 'react';

interface HeroSectionProps {
  hero: any;
  featuresCount: number;
}

export default function HeroSection({ hero, featuresCount }: HeroSectionProps) {
  if (!hero?.headline) return null;
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)' }}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzBhMTAgMTAgMCAxMTAtMjAgMTAgMTAgMCAwMTAgMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNCIvPjwvc3ZnPg==')] opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {hero.badgeText && (
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium" style={{ color: 'var(--ve-secondary)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ve-secondary)' }}></span>
                {hero.badgeText}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              {hero.headline}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">{hero.subheadline}</p>
            <div className="flex flex-wrap gap-4">
              {hero.ctaPrimaryText && (
                <a
                  href={hero.ctaPrimaryLink || '/login'}
                  className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl text-base font-bold shadow-lg transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--ve-primary)' }}
                >
                  {hero.ctaPrimaryText}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
              )}
              {hero.ctaSecondaryText && (
                <a href={hero.ctaSecondaryLink || '#fitur'} className="inline-flex items-center gap-2 border border-white/30 hover:border-white/50 text-white px-7 py-3.5 rounded-xl text-base font-semibold transition-all">
                  {hero.ctaSecondaryText}
                </a>
              )}
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div><span className="text-3xl font-black" style={{ color: 'var(--ve-secondary)' }}>34+</span><p className="text-xs text-slate-400 mt-1">Modul Fitur</p></div>
              <div className="w-px h-10 bg-white/20"></div>
              <div><span className="text-3xl font-black" style={{ color: 'var(--ve-secondary)' }}>100%</span><p className="text-xs text-slate-400 mt-1">Auto Jurnal</p></div>
              <div className="w-px h-10 bg-white/20"></div>
              <div><span className="text-3xl font-black" style={{ color: 'var(--ve-secondary)' }}>Multi</span><p className="text-xs text-slate-400 mt-1">Portal Admin & Anggota</p></div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--ve-primary)' }}>A</div>
                <div><p className="text-sm font-semibold text-white">Dashboard Koperasi</p><p className="text-xs text-slate-300">Online — semua modul aktif</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4"><p className="text-lg font-black" style={{ color: 'var(--ve-secondary)' }}>156</p><p className="text-xs text-slate-300">Anggota</p></div>
                <div className="bg-white/5 rounded-xl p-4"><p className="text-lg font-black" style={{ color: 'var(--ve-secondary)' }}>Rp 2.4M</p><p className="text-xs text-slate-300">Simpanan</p></div>
                <div className="bg-white/5 rounded-xl p-4"><p className="text-lg font-black" style={{ color: 'var(--ve-secondary)' }}>43</p><p className="text-xs text-slate-300">Pinjaman</p></div>
                <div className="bg-white/5 rounded-xl p-4"><p className="text-lg font-black" style={{ color: 'var(--ve-secondary)' }}>Rp 890K</p><p className="text-xs text-slate-300">Angsuran</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
