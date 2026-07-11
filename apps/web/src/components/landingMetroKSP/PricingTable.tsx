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
