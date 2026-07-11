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
