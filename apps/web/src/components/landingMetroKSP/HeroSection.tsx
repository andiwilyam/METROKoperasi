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
