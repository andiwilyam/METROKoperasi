/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, PiggyBank, HandCoins, Landmark, ChevronRight, TrendingUp, Sparkles, Building, Calendar, ShoppingCart, Tv, PhoneCall, Wallet, Award } from 'lucide-react';
import { Anggota, SimpananTransaksi, Pinjaman, UserSession, KoperasiInfo, JournalEntry, Pengurus } from '../../types';

interface AdminDashboardProps {
  members: Anggota[];
  loans: Pinjaman[];
  savingsTrans: SimpananTransaksi[];
  onNavigate: (menu: string) => void;
  onApproveLoan: (id: string) => void;
  onRejectLoan: (id: string) => void;
  role?: string;
  kopInfo?: KoperasiInfo;
  journals?: JournalEntry[];
  pengurus?: Pengurus[];
  penjualanList?: any[];
  sewaTransactions?: any[];
  ppobTransactions?: any[];
  vaTransactions?: any[];
  investments?: any[];
}

export default function AdminDashboard({
  members,
  loans,
  savingsTrans,
  onNavigate,
  onApproveLoan,
  onRejectLoan,
  role,
  kopInfo,
  journals = [],
  pengurus = [],
  penjualanList = [],
  sewaTransactions = [],
  ppobTransactions = [],
  vaTransactions = [],
  investments = []
}: AdminDashboardProps) {
  // Compute dashboard metrics
  const totalAnggota = members.filter((m) => m.statusKeanggotaan === 'aktif').length;
  
  const totalSimpanan = members.reduce(
    (sum, m) => sum + m.saldoSimpananPokok + m.saldoSimpananWajib + m.saldoSimpananSukarela,
    0
  );

  const totalPinjamanBeredar = loans
    .filter((l) => l.status === 'dicairkan')
    .reduce((sum, l) => sum + l.sisaPokok, 0);

  const pendingLoans = loans.filter((l) => l.status === 'pengajuan');

  // SHU (Laba Bersih) from journals: pendapatan (4x) - beban (5x)
  const sumByPrefix = (prefix: string, mode: 'kd' | 'dk') => {
    let total = 0;
    journals.forEach((j: any) => (j.details || []).forEach((d: any) => {
      if (d.coa && d.coa.startsWith(prefix)) total += mode === 'kd' ? (d.kredit - d.debit) : (d.debit - d.kredit);
    }));
    return total;
  };
  const shuTerkumpul = sumByPrefix('4', 'kd') - sumByPrefix('5', 'dk');

  // Unit usaha revenue totals (real)
  const totalToko = penjualanList.reduce((s: number, p: any) => s + (p.total || 0), 0);
  const totalSewa = sewaTransactions.filter((t: any) => t.status === 'selesai').reduce((s: number, t: any) => s + (t.totalBiaya || 0) + (t.denda || 0), 0);
  const totalPpob = ppobTransactions.reduce((s: number, t: any) => s + (t.hargaJual || 0), 0);
  const totalVA = vaTransactions.filter((t: any) => t.status === 'sukses').reduce((s: number, t: any) => s + (t.nominal || 0), 0);

  // Venture metrics
  const activeInvestments = investments.filter((i: any) => i.status === 'dicairkan');
  const totalVentureInvested = activeInvestments.reduce((s: number, i: any) => s + (i.nominalInvestasi || 0), 0);
  const totalDividends = investments.reduce((s: number, i: any) => {
    return s + ((i.dividendHistory || []).reduce((d: number, di: any) => d + (di.nominalDividen || 0), 0));
  }, 0);
  const pendingVentures = investments.filter((i: any) => i.status === 'pengajuan').length;

  const ketua = pengurus.find((p) => p.jabatan?.toLowerCase().includes('ketua'));
  const bendahara = pengurus.find((p) => p.jabatan?.toLowerCase().includes('bendahara'));
  const otherPengurus = pengurus.filter((p) => p !== ketua && p !== bendahara);

  // Format currency helpers
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Info Row */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 border border-white/10">
                Tahun Buku 2026
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-soft-pulse" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Kesehatan Koperasi Global — {kopInfo?.nama || 'MetroMitra'}</h1>
            <p className="text-xs text-blue-200 mt-1">Sistem informasi keuangan koperasi &amp; pencatatan transaksi terintegrasi secara profesional.</p>
          </div>
          {role !== 'operator' && (
            <button
              onClick={() => onNavigate('pengaturan')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Pengaturan Koperasi
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Anggota Aktif */}
        <div 
          onClick={() => onNavigate('anggota')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Anggota Aktif</span>
            <div className="text-2xl font-extrabold text-slate-800">{totalAnggota}</div>
            <span className="text-[10px] text-slate-500 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
              +5 bulan ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center transition">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Simpanan */}
        <div 
          onClick={() => onNavigate('simpanan_transaksi')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Simpanan</span>
            <div className="text-2xl font-extrabold text-slate-800">{formatIDR(totalSimpanan)}</div>
            <span className="text-[10px] text-slate-500 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
              Setoran aman &amp; transparan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        {/* Total Pinjaman */}
        <div 
          onClick={() => onNavigate('pinjaman_pengajuan')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Pinjaman Beredar</span>
            <div className="text-2xl font-extrabold text-slate-800">{formatIDR(totalPinjamanBeredar)}</div>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center bg-amber-50 px-1.5 py-0.5 rounded">
              Risiko Terkendali
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center transition">
            <HandCoins className="w-6 h-6" />
          </div>
        </div>

        {/* SHU Terkumpul */}
        <div 
          onClick={() => onNavigate('laporan_shu')}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">SHU Terkumpul</span>
            <div className="text-2xl font-extrabold text-slate-800">{formatIDR(shuTerkumpul)}</div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${shuTerkumpul >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
              {shuTerkumpul >= 0 ? '+ Positif (Laba)' : '- Negatif (Rugi)'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition">
            <Landmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart Column */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Perkembangan Transaksi Global</h3>
              <p className="text-[11px] text-slate-400">Perbandingan volume Simpanan vs Pinjaman dalam 6 bulan terakhir</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-slate-600">Simpanan</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-slate-600">Pinjaman</span>
              </div>
            </div>
          </div>

          {/* Premium Animated SVG Chart */}
          <div className="h-64 flex items-end relative pt-6">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 bottom-0 top-6 border-b border-slate-100 flex flex-col justify-between">
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
            </div>

            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 600 240">
              {/* Blue Line for Simpanan */}
              <path 
                d="M 50,180 L 150,150 L 250,130 L 350,90 L 450,70 L 550,40" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <circle cx="50" cy="180" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="150" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="250" cy="130" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="350" cy="90" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="70" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="550" cy="40" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />

              {/* Amber Line for Pinjaman */}
              <path 
                d="M 50,200 L 150,180 L 250,140 L 350,150 L 450,120 L 550,100" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <circle cx="50" cy="200" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="180" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="250" cy="140" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="350" cy="150" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="120" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="550" cy="100" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="absolute inset-x-0 -bottom-5 flex justify-between px-6 text-[10px] font-mono text-slate-400 font-semibold">
              <span>Februari</span>
              <span>Maret</span>
              <span>April</span>
              <span>Mei</span>
              <span>Juni</span>
              <span>Juli</span>
            </div>
          </div>
        </div>

        {/* Member list / Certification Column */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Organisasi Koperasi</h3>
            <p className="text-[11px] text-slate-400">Informasi ringkas struktur pengurus berwenang</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            {pengurus.length === 0 && (
              <div className="text-[10px] text-slate-400 italic text-center py-2">Belum ada data pengurus terdaftar.</div>
            )}
            {[ketua, bendahara, ...otherPengurus].filter(Boolean).slice(0, 4).map((p: any, idx) => (
              <div key={p.id || idx} className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-emerald-600' : 'bg-slate-500'}`}>
                  {(p.nama || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{p.nama}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{p.jabatan}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 space-y-2">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Sertifikasi Standar Mutu Koperasi
            </div>
            <p className="text-[10px] text-blue-700 leading-relaxed">
              Koperasi {kopInfo?.nama || 'MetroMitra'} telah diaudit dan dinyatakan memenuhi regulasi dan standar mutu dari Dinas Koperasi dan Kementerian Koperasi secara nasional.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Modules Quick Access performance dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* Toko */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Unit Toko POS</div>
            <div className="text-sm font-extrabold text-slate-800">{formatIDR(totalToko)}</div>
            <button onClick={() => onNavigate('toko_kasir')} className="text-[10px] font-semibold text-blue-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Masuk Kasir <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sewa */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Unit Sewa Alat</div>
            <div className="text-sm font-extrabold text-slate-800">{formatIDR(totalSewa)}</div>
            <button onClick={() => onNavigate('sewa_dashboard')} className="text-[10px] font-semibold text-indigo-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Urus Sewa <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* PPOB */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">PPOB Pulsa/Listrik</div>
            <div className="text-sm font-extrabold text-slate-800">{formatIDR(totalPpob)}</div>
            <button onClick={() => onNavigate('ppob_dashboard')} className="text-[10px] font-semibold text-amber-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Transaksi PPOB <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Digital Payment */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Digital Payment (VA)</div>
            <div className="text-sm font-extrabold text-slate-800">{formatIDR(totalVA)}</div>
            <button onClick={() => onNavigate('digipay_dashboard')} className="text-[10px] font-semibold text-emerald-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Layanan VA <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Venture Investment Row */}
      {(totalVentureInvested > 0 || pendingVentures > 0 || totalDividends > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-purple-200 uppercase tracking-wider">Total Investasi Ventura</span>
              <TrendingUp className="w-4 h-4 text-purple-200" />
            </div>
            <div className="text-xl font-extrabold">{formatIDR(totalVentureInvested)}</div>
            <div className="text-[10px] text-purple-200 mt-1">{activeInvestments.length} Investasi Aktif</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dividen Terkumpul</div>
            <div className="text-lg font-extrabold text-slate-800">{formatIDR(totalDividends)}</div>
            <button onClick={() => onNavigate('ventura_dashboard')} className="text-[10px] font-semibold text-blue-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Manajemen Investasi <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pengajuan Baru</div>
            <div className="text-lg font-extrabold text-slate-800">{pendingVentures}</div>
            <button onClick={() => onNavigate('ventura_dashboard')} className="text-[10px] font-semibold text-purple-600 hover:underline mt-0.5 flex items-center gap-0.5">
              Tinjau Pengajuan <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* New Loan Requests Pending Approval */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Permohonan Pinjaman Terbaru</h3>
            <p className="text-[11px] text-slate-400">Pengajuan pinjaman dari anggota yang membutuhkan verifikasi admin</p>
          </div>
          <button 
            onClick={() => onNavigate('pinjaman_pengajuan')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingLoans.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
            ✅ Tidak ada permohonan pinjaman baru yang tertunda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3">Nama Anggota</th>
                  <th className="p-3">Kategori Produk</th>
                  <th className="p-3">Jumlah Pokok</th>
                  <th className="p-3">Tenor (Bulan)</th>
                  <th className="p-3">Bunga / Margin</th>
                  <th className="p-3">Angsuran / Bln</th>
                  <th className="p-3 text-right">Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingLoans.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{l.anggotaNama}</td>
                    <td className="p-3 text-slate-600">{l.jenisNama}</td>
                    <td className="p-3 font-semibold text-slate-900 font-mono">{formatIDR(l.pokok)}</td>
                    <td className="p-3 font-mono">{l.tenorMonths} bulan</td>
                    <td className="p-3 font-mono">{l.bungaPersen}% / bln ({l.metodeBunga})</td>
                    <td className="p-3 font-semibold font-mono text-slate-900">{formatIDR(l.angsuranPerBulan)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onApproveLoan(l.id)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                      >
                        Setujui &amp; Cairkan
                      </button>
                      <button
                        onClick={() => onRejectLoan(l.id)}
                        className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                      >
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
