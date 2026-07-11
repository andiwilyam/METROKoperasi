import React from 'react';

interface TeamGridProps {
  team: any[];
}

export default function TeamGrid({ team }: TeamGridProps) {
  if (!team?.length) return null;
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-slate-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4" style={{ color: 'var(--ve-primary)' }}>Tim Kami</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Struktur <span style={{ color: 'var(--ve-primary)' }}>Pengurus</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t: any) => (
            <div key={t.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 text-center hover:shadow-md transition-all">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-semibold">
                {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <span>{t.name?.charAt(0) || '?'}</span>}
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                <p className="text-xs font-medium" style={{ color: 'var(--ve-primary)' }}>{t.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
