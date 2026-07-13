/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles, BookOpen, Clock, Calendar, Megaphone, Tag, TrendingUp } from 'lucide-react';
import { Anggota, Pinjaman, SimpananTransaksi, UserSession, Pengumuman } from '../../types';

interface MemberDashboardProps {
  session: UserSession;
  members: Anggota[];
  loans: Pinjaman[];
  savingsTrans: SimpananTransaksi[];
  onNavigate: (menu: string) => void;
  announcements: Pengumuman[];
  investments?: any[];
}

export default function MemberDashboard({
  session,
  members,
  loans,
  savingsTrans,
  onNavigate,
  announcements,
  investments = []
}: MemberDashboardProps) {
  // Find current member profile
  const member = members.find((m) => m.id === session.memberId);

  // Fallbacks
  const name = member?.nama || session.username;
  const noAnggota = session.nik || member?.nik || '-';
  
  const saldoPokok = member?.saldoSimpananPokok || 0;
  const saldoWajib = member?.saldoSimpananWajib || 0;
  const saldoSukarela = member?.saldoSimpananSukarela || 0;
  const totalTabungan = saldoPokok + saldoWajib + saldoSukarela;

  const activeLoan = loans.find((l) => l.anggotaId === session.memberId && l.status === 'dicairkan');
  const personalTrans = savingsTrans.filter((t) => t.anggotaId === session.memberId).slice(0, 5);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Board — token semantik */}
      <div className="mc-surface mc-border rounded-2xl p-6 shadow-md relative overflow-hidden" style={{ borderLeft: '4px solid var(--mc-accent)' }}>
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[var(--mc-accent)]/5 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-44 h-44 bg-[var(--mc-primary)]/5 rounded-full blur-xl" />
        
        <div className="relative z-10 space-y-2">
          <span className="mc-badge-accent text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Portal Anggota Koperasi Simpan Pinjam
          </span>
          <h2 className="text-xl font-black tracking-tight mc-ink-strong">Selamat Datang Kembali, {name}!</h2>
          <p className="text-[11px] mc-muted max-w-lg leading-relaxed">
            MetroCOOP berkomitmen memberikan suku bunga simpanan yang bersaing, aman, dan transparan untuk kesejahteraan finansial bersama.
          </p>
          <div className="pt-3 flex gap-4 text-xs font-mono">
            <div>
              <span className="mc-muted block text-[9px] uppercase font-bold">NIK Anggota</span>
              <span className="font-bold mc-ink-strong text-sm">{noAnggota}</span>
            </div>
            <div className="border-l mc-border pl-4">
              <span className="mc-muted block text-[9px] uppercase font-bold">Status Keanggotaan</span>
              <span className="font-bold text-[var(--mc-success)] text-sm">✓ Aktif Bersertifikat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conventional Quote Box */}
      <div className="mc-card p-4 flex items-start gap-3">
        <BookOpen className="w-5 h-5 mc-icon-accent flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mc-ink-strong text-xs">Prinsip Keuangan Hari Ini</h4>
          <p className="text-[11px] mc-muted italic leading-relaxed mt-0.5">
            Mengedepankan efisiensi biaya, pengelolaan modal yang optimal, serta transparansi bunga pinjaman dan dividen demi mempercepat pertumbuhan kesejahteraan seluruh anggota KSP MetroCOOP.
          </p>
        </div>
      </div>

      {/* Grid of Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="mc-card p-5 space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold mc-muted tracking-wider">Simpanan Pokok</div>
          <div className="text-lg font-black mc-ink-strong font-mono">{formatIDR(saldoPokok)}</div>
          <div className="text-[9px] font-semibold mc-muted">Dibayarkan 1x di awal</div>
        </div>

        <div className="mc-card p-5 space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold mc-muted tracking-wider">Simpanan Wajib</div>
          <div className="text-lg font-black mc-ink-strong font-mono">{formatIDR(saldoWajib)}</div>
          <div className="text-[9px] font-semibold mc-muted">Iuran bulanan wajib</div>
        </div>

        <div className="mc-card p-5 space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold mc-muted tracking-wider">Simpanan Sukarela</div>
          <div className="text-lg font-black mc-ink-strong font-mono">{formatIDR(saldoSukarela)}</div>
          <div className="text-[9px] font-semibold text-[var(--mc-success)] flex items-center gap-1 font-mono">
            <span>Bisa ditarik kapan saja</span>
          </div>
        </div>

        <div className="mc-card p-5 space-y-1 relative" style={{ borderLeft: '4px solid var(--mc-accent)' }}>
          <div className="text-[10px] uppercase font-extrabold text-[var(--mc-primary)] tracking-wider">Total Dana Tabungan</div>
          <div className="text-xl font-black text-[var(--mc-primary)] font-mono">{formatIDR(totalTabungan)}</div>
          <div className="text-[9px] font-bold text-[var(--mc-primary)]">Total Akumulasi Buku Tabungan</div>
        </div>

      </div>

      {/* Mid row: Loans Status & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Loan receivables info */}
        <div className="lg:col-span-5 mc-card p-5 space-y-4">
          <h3 className="font-extrabold mc-ink-strong text-xs">Plafon Pinjaman Aktif Anda</h3>
          
          {activeLoan ? (
            <div className="space-y-4">
              <div className="mc-surface-2 mc-border p-4 rounded-xl space-y-3" style={{ borderLeft: '4px solid var(--mc-primary)' }}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[var(--mc-primary)]">{activeLoan.jenisNama}</span>
                  <span className="font-mono text-[10px] text-[var(--mc-primary)] font-bold">{activeLoan.noPinjaman}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-[var(--mc-primary)] uppercase font-bold block">Sisa Hutang Pokok</span>
                    <span className="font-mono font-black text-[var(--mc-primary)] text-sm">{formatIDR(activeLoan.sisaPokok)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--mc-primary)] uppercase font-bold block">Angsuran Bulanan</span>
                    <span className="font-mono font-black text-[var(--mc-primary)] text-sm">{formatIDR(activeLoan.angsuranPerBulan)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between text-[10px] text-[var(--mc-primary)] font-semibold border-t mc-border">
                  <span>Tenor Total: {activeLoan.tenorMonths} Bulan</span>
                  <span>Suku Bunga: {activeLoan.bungaPersen}% / bln</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('member_pinjaman')}
                className="w-full text-center py-2 mc-btn-primary text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Bayar Angsuran / Lihat Tagihan
              </button>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed mc-border rounded-xl mc-muted text-xs flex flex-col items-center justify-center space-y-2">
              <ShieldCheck className="w-8 h-8 mc-muted" />
              <span>Anda tidak memiliki pinjaman aktif saat ini.</span>
              <button
                onClick={() => onNavigate('member_pinjaman')}
                className="mt-2 text-[10px] mc-badge-accent font-bold px-3 py-1 rounded-full cursor-pointer"
              >
                Ajukan Pinjaman Baru
              </button>
            </div>
          )}
        </div>

        {/* Recent Personal Transactions */}
        <div className="lg:col-span-7 mc-card p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold mc-ink-strong text-xs">Riwayat Mutasi Tabungan Terakhir</h3>
            <button 
              onClick={() => onNavigate('member_laporan')}
              className="text-[10px] font-bold mc-icon-accent hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {personalTrans.length === 0 ? (
            <div className="text-center py-10 mc-muted text-xs">Belum ada riwayat setoran/penarikan terdaftar.</div>
          ) : (
            <div className="divide-y mc-border text-xs">
              {personalTrans.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2.5">
                  <div>
                    <div className="font-bold mc-ink-strong">{t.jenisNama}</div>
                    <div className="text-[10px] mc-muted font-mono mt-0.5">{t.tanggal} | {t.keterangan}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-extrabold ${t.tipe === 'setor' ? 'text-[var(--mc-success)]' : 'text-[var(--mc-danger)]'}`}>
                      {t.tipe === 'setor' ? '+' : '-'} {formatIDR(t.jumlah)}
                    </span>
                    <div className="text-[8px] font-bold mc-muted tracking-wider uppercase mt-0.5">
                      {t.tipe === 'setor' ? '📥 SETORAN' : '📤 PENARIKAN'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Venture Proposal Status (if any) */}
      {(() => {
        const myVentures = investments.filter((i: any) => i.pengajuAnggotaId === session.memberId);
        if (myVentures.length === 0) return null;
        return (
          <div className="mc-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold mc-ink-strong text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[var(--mc-primary)]" />
                Pengajuan Investasi Saya
              </h3>
              <button onClick={() => onNavigate('member_ventura')} className="text-[10px] font-bold text-[var(--mc-primary)] hover:underline">Kelola</button>
            </div>
            <div className="space-y-2 text-xs">
              {myVentures.map((v: any) => (
                <div key={v.id} className="flex justify-between items-center py-2 border-b mc-border last:border-0">
                  <div>
                    <div className="font-bold mc-ink-strong">{v.namaPerusahaan}</div>
                    <div className="text-[10px] mc-muted">{v.sektorIndustri} | Rp {v.nominalInvestasi?.toLocaleString('id-ID')}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    v.status === 'dicairkan' ? 'mc-badge-ok' :
                    v.status === 'pengajuan' ? 'mc-badge-accent' :
                    v.status === 'selesai' ? 'mc-badge-accent' :
                    'mc-btn-danger'
                  }`}>{v.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Announcements & Promos Board */}
      <div className="mc-card p-5 space-y-4">
        <h3 className="font-extrabold mc-ink-strong text-sm flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 mc-icon-accent" />
          Papan Informasi & Promo Komersial Koperasi
        </h3>
        
        {(!announcements || announcements.filter(a => a.status === 'aktif').length === 0) ? (
          <div className="text-center py-6 mc-muted text-xs italic">
            Belum ada informasi pengumuman baru yang aktif saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements
              .filter((a) => a.status === 'aktif' && (a.target === 'semua' || a.target === 'anggota'))
              .map((a) => (
                <div 
                  key={a.id} 
                  className={`p-4 rounded-xl mc-border transition-shadow hover:shadow-md flex flex-col justify-between space-y-3 ${
                    a.tipe === 'pengumuman' 
                      ? 'mc-surface-2' 
                      : 'mc-surface-2'
                  }`}
                  style={{ borderLeft: `4px solid ${a.tipe === 'pengumuman' ? 'var(--mc-primary)' : 'var(--mc-accent)'}` }}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${
                        a.tipe === 'pengumuman' 
                          ? 'mc-badge-accent' 
                          : 'mc-badge-ok'
                      }`}>
                        {a.tipe === 'pengumuman' ? <Megaphone className="w-2.5 h-2.5" /> : <Tag className="w-2.5 h-2.5" />}
                        {a.tipe}
                      </span>
                      <span className="text-[9px] mc-muted font-mono flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        s/d {a.tanggalSelesai}
                      </span>
                    </div>
                    
                    <h4 className="font-extrabold mc-ink-strong text-xs leading-snug">{a.judul}</h4>
                    <p className="text-[11px] mc-muted leading-relaxed font-normal">{a.konten}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}