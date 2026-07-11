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
