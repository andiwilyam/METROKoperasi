import React from 'react';

interface TestimonialSliderProps {
  testimonials: any[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  if (!testimonials?.length) return null;
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm border border-slate-200 mb-4" style={{ color: 'var(--ve-primary)' }}>Testimoni</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Apa Kata <span style={{ color: 'var(--ve-primary)' }}>Pengguna</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex mb-4" style={{ color: 'var(--ve-secondary)' }}>
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--ve-primary)' }}>
                  {t.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
