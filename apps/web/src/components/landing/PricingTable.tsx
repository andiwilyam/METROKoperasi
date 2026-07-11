import React from 'react';

interface PricingTableProps {
  pricing: any[];
}

export default function PricingTable({ pricing }: PricingTableProps) {
  if (!pricing?.length) return null;
  return (
    <section id="harga" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-slate-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4" style={{ color: 'var(--ve-primary)' }}>Harga</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Pilih Paket yang <span style={{ color: 'var(--ve-primary)' }}>Tepat</span></h2>
          <p className="text-lg text-slate-500">Mulai dari skala kecil hingga koperasi besar — kami punya solusinya.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((p: any) => (
            <div key={p.id} className={`rounded-2xl p-8 flex flex-col ${p.isPopular ? 'scale-105 shadow-xl border-2' : 'border border-slate-200 shadow-sm hover:shadow-md'}`}
              style={p.isPopular ? { borderColor: 'var(--ve-primary)' } : {}}
            >
              {p.isPopular && (
                <span className="self-center -mt-12 mb-4 text-white text-xs font-bold px-4 py-1 rounded-full" style={{ background: 'var(--ve-primary)' }}>Paling Populer</span>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1">{p.planName}</h3>
              <p className="text-sm text-slate-500 mb-4">{p.description}</p>
              <div className="mb-6">
                {p.priceLabel && <span className="text-sm text-slate-400">{p.priceLabel} </span>}
                <span className="text-4xl font-black" style={{ color: p.isPopular ? 'var(--ve-primary)' : '#1e293b' }}>{p.priceAmount}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                {(p.features || []).map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--ve-primary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.ctaLink || '#'}
                className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${p.isPopular ? 'text-white shadow-md hover:-translate-y-0.5' : 'border border-slate-200 text-slate-700 hover:border-slate-300'}`}
                style={p.isPopular ? { background: 'var(--ve-primary)' } : {}}
              >
                {p.ctaText || 'Pilih'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
