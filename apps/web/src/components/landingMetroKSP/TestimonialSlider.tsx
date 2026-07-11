import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialSliderProps { testimonials: any[]; }

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  if (!testimonials?.length) return null;
  return (
    <section className="py-20" style={{ background: 'var(--mk-paper)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Testimoni</span>
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Apa Kata <span style={{ color: 'var(--mk-primary)' }}>Anggota</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-all" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
              <div className="flex mb-4" style={{ color: 'var(--mk-primary)' }}>
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--mk-muted)' }}>"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--mk-secondary)' }}>{t.name?.charAt(0) || '?'}</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--mk-ink)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--mk-muted)' }}>{t.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
