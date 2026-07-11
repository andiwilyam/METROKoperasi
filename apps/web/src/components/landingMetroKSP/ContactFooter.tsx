import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactFooterProps { contact: any; settings: any; }

export default function ContactFooter({ contact, settings }: ContactFooterProps) {
  const c = contact || {};
  return (
    <>
      <section id="kontak" className="py-20" style={{ background: 'var(--mk-paper)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full" style={{ background: 'var(--mk-primary-soft)', color: 'var(--mk-secondary)' }}>Kontak</span>
            <h2 className="mk-display text-3xl sm:text-4xl font-bold mt-4" style={{ color: 'var(--mk-ink)' }}>Hubungi <span style={{ color: 'var(--mk-primary)' }}>Kami</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Mail, label: 'Email', value: c.email || 'halo@metroksp.id' },
              { icon: Phone, label: 'Telepon', value: c.phone || '[ +62 21 0000 0000 ]' },
              { icon: MapPin, label: 'Kantor', value: c.address || '[ Alamat ]' },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <div key={i} className="text-center p-6 bg-white rounded-2xl border" style={{ borderColor: 'rgba(12,43,32,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--mk-primary-soft)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--mk-secondary)' }} />
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--mk-ink)' }}>{it.label}</h3>
                  <p className="text-sm" style={{ color: 'var(--mk-muted)' }}>{it.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 text-white mk-cta-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mk-display text-3xl sm:text-4xl font-bold mb-4">Siap menjadikan keuangan lebih tenang?</h2>
          <p className="text-lg opacity-90 mb-8">Daftar anggota atau ajukan pinjaman hari ini. Tim MetroKSP siap membantu.</p>
          <a href="#kontak" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5" style={{ color: 'var(--mk-secondary)' }}>
            Daftar Anggota
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>

      <footer className="text-white py-12" style={{ background: 'var(--mk-ink)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: 'var(--mk-primary)' }}>M</div>
                <span className="text-base font-bold text-white">{settings?.koperasiName || 'MetroKSP'}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.footerDescription || 'Koperasi Simpan Pinjam.'}</p>
            </div>
            <div className="md:text-right">
              <h4 className="text-sm font-bold text-white mb-3">Jam Layanan</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.officeHours || 'Senin–Jumat 08.00–16.00 WIB'}</p>
            </div>
          </div>
          <div className="border-t pt-6 text-xs text-center" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
            &copy; {new Date().getFullYear()} {settings?.koperasiName || 'MetroKSP'}. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </>
  );
}
