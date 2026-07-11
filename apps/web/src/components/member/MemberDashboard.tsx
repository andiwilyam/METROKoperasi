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
      
      {/* Welcome Board */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-44 h-44 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative z-10 space-y-2">
          <span className="bg-blue-800/80 border border-blue-700/60 text-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Portal Anggota Koperasi Simpan Pinjam
          </span>
          <h2 className="text-xl font-black tracking-tight">Selamat Datang Kembali, {name}!</h2>
          <p className="text-[11px] text-blue-200/80 max-w-lg leading-relaxed">
            MetroCOOP berkomitmen memberikan suku bunga simpanan yang bersaing, aman, dan transparan untuk kesejahteraan finansial bersama.
          </p>
          <div className="pt-3 flex gap-4 text-xs font-mono">
            <div>
              <span className="text-blue-300 block text-[9px] uppercase font-bold">NIK Anggota</span>
              <span className="font-bold text-white text-sm">{noAnggota}</span>
            </div>
            <div className="border-l border-white/20 pl-4">
              <span className="text-blue-300 block text-[9px] uppercase font-bold">Status Keanggotaan</span>
              <span className="font-bold text-emerald-400 text-sm">✓ Aktif Bersertifikat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conventional Quote Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-800 text-xs">Prinsip Keuangan Hari Ini</h4>
          <p className="text-[11px] text-slate-500 italic leading-relaxed mt-0.5">
            Mengedepankan efisiensi biaya, pengelolaan modal yang optimal, serta transparansi bunga pinjaman dan dividen demi mempercepat pertumbuhan kesejahteraan seluruh anggota KSP MetroCOOP.
          </p>
        </div>
      </div>

      {/* Grid of Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Simpanan Pokok</div>
          <div className="text-lg font-black text-slate-900 font-mono">{formatIDR(saldoPokok)}</div>
          <div className="text-[9px] font-semibold text-slate-400">Dibayarkan 1x di awal</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Simpanan Wajib</div>
          <div className="text-lg font-black text-slate-900 font-mono">{formatIDR(saldoWajib)}</div>
          <div className="text-[9px] font-semibold text-slate-400">Iuran bulanan wajib</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Simpanan Sukarela</div>
          <div className="text-lg font-black text-slate-900 font-mono">{formatIDR(saldoSukarela)}</div>
          <div className="text-[9px] font-semibold text-emerald-600 flex items-center gap-1 font-mono">
            <span>Bisa ditarik kapan saja</span>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm space-y-1 relative">
          <div className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider">Total Dana Tabungan</div>
          <div className="text-xl font-black text-blue-900 font-mono">{formatIDR(totalTabungan)}</div>
          <div className="text-[9px] font-bold text-blue-600">Total Akumulasi Buku Tabungan</div>
        </div>

      </div>

      {/* Mid row: Loans Status & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Loan receivables info */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-xs">Plafon Pinjaman Aktif Anda</h3>
          
          {activeLoan ? (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-900">{activeLoan.jenisNama}</span>
                  <span className="font-mono text-[10px] text-indigo-600 font-bold">{activeLoan.noPinjaman}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Sisa Hutang Pokok</span>
                    <span className="font-mono font-black text-indigo-900 text-sm">{formatIDR(activeLoan.sisaPokok)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Angsuran Bulanan</span>
                    <span className="font-mono font-black text-indigo-900 text-sm">{formatIDR(activeLoan.angsuranPerBulan)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between text-[10px] text-indigo-600 font-semibold border-t border-indigo-200/50">
                  <span>Tenor Total: {activeLoan.tenorMonths} Bulan</span>
                  <span>Suku Bunga: {activeLoan.bungaPersen}% / bln</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('member_pinjaman')}
                className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Bayar Angsuran / Lihat Tagihan
              </button>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-slate-300" />
              <span>Anda tidak memiliki pinjaman aktif saat ini.</span>
              <button
                onClick={() => onNavigate('member_pinjaman')}
                className="mt-2 text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 px-3 py-1 rounded-full cursor-pointer"
              >
                Ajukan Pinjaman Baru
              </button>
            </div>
          )}
        </div>

        {/* Recent Personal Transactions */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-xs">Riwayat Mutasi Tabungan Terakhir</h3>
            <button 
              onClick={() => onNavigate('member_laporan')}
              className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {personalTrans.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">Belum ada riwayat setoran/penarikan terdaftar.</div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {personalTrans.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2.5">
                  <div>
                    <div className="font-bold text-slate-800">{t.jenisNama}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.tanggal} | {t.keterangan}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-extrabold ${t.tipe === 'setor' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.tipe === 'setor' ? '+' : '-'} {formatIDR(t.jumlah)}
                    </span>
                    <div className="text-[8px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Pengajuan Investasi Saya
              </h3>
              <button onClick={() => onNavigate('member_ventura')} className="text-[10px] font-bold text-purple-600 hover:underline">Kelola</button>
            </div>
            <div className="space-y-2 text-xs">
              {myVentures.map((v: any) => (
                <div key={v.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="font-bold text-slate-800">{v.namaPerusahaan}</div>
                    <div className="text-[10px] text-slate-400">{v.sektorIndustri} | Rp {v.nominalInvestasi?.toLocaleString('id-ID')}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    v.status === 'dicairkan' ? 'bg-emerald-100 text-emerald-700' :
                    v.status === 'pengajuan' ? 'bg-amber-100 text-amber-700' :
                    v.status === 'selesai' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>{v.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Announcements & Promos Board */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-blue-600" />
          Papan Informasi &amp; Promo Komersial Koperasi
        </h3>
        
        {(!announcements || announcements.filter(a => a.status === 'aktif').length === 0) ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            Belum ada informasi pengumuman baru yang aktif saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements
              .filter((a) => a.status === 'aktif' && (a.target === 'semua' || a.target === 'anggota'))
              .map((a) => (
                <div 
                  key={a.id} 
                  className={`p-4 rounded-xl border transition-all hover:shadow-md flex flex-col justify-between space-y-3 ${
                    a.tipe === 'pengumuman' 
                      ? 'bg-blue-50/30 border-blue-100' 
                      : 'bg-amber-50/30 border-amber-100'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${
                        a.tipe === 'pengumuman' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {a.tipe === 'pengumuman' ? <Megaphone className="w-2.5 h-2.5" /> : <Tag className="w-2.5 h-2.5" />}
                        {a.tipe}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        s/d {a.tanggalSelesai}
                      </span>
                    </div>
                    
                    <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{a.judul}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{a.konten}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}
