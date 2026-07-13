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
      
      {/* Top Welcome / Info Row — token semantik */}
      <div className="mc-surface mc-border rounded-xl p-6 shadow-md relative overflow-hidden" style={{ borderLeft: '4px solid var(--mc-accent)' }}>
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full mc-badge-accent">
                Tahun Buku 2026
              </span>
              <Sparkles className="w-4 h-4 mc-icon-accent animate-soft-pulse" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mc-ink-strong">Kesehatan Koperasi Global — {kopInfo?.nama || 'MetroKSP'}</h1>
            <p className="text-xs mc-muted mt-1">Sistem informasi keuangan koperasi & pencatatan transaksi terintegrasi secara profesional.</p>
          </div>
          {role !== 'operator' && (
            <button
              onClick={() => onNavigate('pengaturan')}
              className="px-4 py-2 mc-surface-2 mc-border hover:mc-surface-2 hover:bg-[var(--mc-border)] rounded-lg text-xs font-semibold transition cursor-pointer"
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
          className="mc-card hover:border-[var(--mc-accent)] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold mc-muted">Anggota Aktif</span>
            <div className="text-2xl font-extrabold mc-ink-strong">{totalAnggota}</div>
            <span className="text-[10px] mc-muted font-medium flex items-center">
              <TrendingUp className="w-3 h-3 text-[var(--mc-success)] mr-1" />
              +5 bulan ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl mc-surface-2 mc-icon-accent group-hover:bg-[var(--mc-sidebar-active)] text-[var(--mc-accent)] flex items-center justify-center transition">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Simpanan */}
        <div 
          onClick={() => onNavigate('simpanan_transaksi')}
          className="mc-card hover:border-[var(--mc-success)] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold mc-muted">Total Simpanan</span>
            <div className="text-2xl font-extrabold mc-ink-strong">{formatIDR(totalSimpanan)}</div>
            <span className="text-[10px] mc-muted font-medium flex items-center">
              <TrendingUp className="w-3 h-3 text-[var(--mc-success)] mr-1" />
              Setoran aman & transparan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl mc-surface-2 text-[var(--mc-success)] group-hover:bg-[var(--mc-success-bg)] flex items-center justify-center transition">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        {/* Total Pinjaman */}
        <div 
          onClick={() => onNavigate('pinjaman_pengajuan')}
          className="mc-card hover:border-[var(--mc-primary)] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold mc-muted">Pinjaman Beredar</span>
            <div className="text-2xl font-extrabold mc-ink-strong">{formatIDR(totalPinjamanBeredar)}</div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded mc-badge-accent">
              Risiko Terkendali
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl mc-surface-2 text-[var(--mc-primary)] group-hover:bg-[var(--mc-sidebar-active)] flex items-center justify-center transition">
            <HandCoins className="w-6 h-6" />
          </div>
        </div>

        {/* SHU Terkumpul */}
        <div 
          onClick={() => onNavigate('laporan_shu')}
          className="mc-card hover:border-[var(--mc-accent)] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold mc-muted">SHU Terkumpul</span>
            <div className="text-2xl font-extrabold mc-ink-strong">{formatIDR(shuTerkumpul)}</div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${shuTerkumpul >= 0 ? 'mc-badge-ok' : 'mc-btn-danger'}`}>
              {shuTerkumpul >= 0 ? '+ Positif (Laba)' : '- Negatif (Rugi)'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl mc-surface-2 text-[var(--mc-accent)] group-hover:bg-[var(--mc-sidebar-active)] flex items-center justify-center transition">
            <Landmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart Column */}
        <div className="lg:col-span-8 mc-card p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold mc-ink-strong text-sm">Perkembangan Transaksi Global</h3>
              <p className="text-[11px] mc-muted">Perbandingan volume Simpanan vs Pinjaman dalam 6 bulan terakhir</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full mc-icon-accent" />
                <span className="mc-muted">Simpanan</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--mc-primary)' }} />
                <span className="mc-muted">Pinjaman</span>
              </div>
            </div>
          </div>

          {/* Premium Animated SVG Chart — stroke pakai variabel token */}
          <div className="h-64 flex items-end relative pt-6">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 bottom-0 top-6 border-b mc-border flex flex-col justify-between">
              <div className="w-full border-t mc-border" />
              <div className="w-full border-t mc-border" />
              <div className="w-full border-t mc-border" />
              <div className="w-full border-t mc-border" />
            </div>

            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 600 240">
              {/* Blue Line for Simpanan */}
              <path 
                d="M 50,180 L 150,150 L 250,130 L 350,90 L 450,70 L 550,40" 
                fill="none" 
                stroke="var(--mc-accent)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-transform duration-1000"
              />
              <circle cx="50" cy="180" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="150" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />
              <circle cx="250" cy="130" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />
              <circle cx="350" cy="90" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="70" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />
              <circle cx="550" cy="40" r="5" fill="var(--mc-accent)" stroke="#fff" strokeWidth="2" />

              {/* Amber Line for Pinjaman */}
              <path 
                d="M 50,200 L 150,180 L 250,140 L 350,150 L 450,120 L 550,100" 
                fill="none" 
                stroke="var(--mc-primary)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-transform duration-1000"
              />
              <circle cx="50" cy="200" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="180" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
              <circle cx="250" cy="140" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
              <circle cx="350" cy="150" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="120" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
              <circle cx="550" cy="100" r="5" fill="var(--mc-primary)" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="absolute inset-x-0 -bottom-5 flex justify-between px-6 text-[10px] font-mono mc-muted font-semibold">
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
        <div className="lg:col-span-4 mc-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold mc-ink-strong text-sm">Organisasi Koperasi</h3>
            <p className="text-[11px] mc-muted">Informasi ringkas struktur pengurus berwenang</p>
          </div>

          <div className="mc-surface-2 mc-border rounded-lg p-4 space-y-3">
            {pengurus.length === 0 && (
              <div className="text-[10px] mc-muted italic text-center py-2">Belum ada data pengurus terdaftar.</div>
            )}
            {[ketua, bendahara, ...otherPengurus].filter(Boolean).slice(0, 4).map((p: any, idx) => (
              <div key={p.id || idx} className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${idx === 0 ? 'mc-btn-primary' : idx === 1 ? 'bg-[var(--mc-success)]' : 'bg-[var(--mc-muted)]'}`}>
                  {(p.nama || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold mc-ink-strong">{p.nama}</div>
                  <div className="text-[10px] mc-muted font-medium">{p.jabatan}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mc-surface-2 mc-border rounded-lg p-3.5 space-y-2" style={{ borderLeft: '4px solid var(--mc-accent)' }}>
            <div className="text-xs font-bold mc-ink-strong flex items-center gap-1.5">
              <Award className="w-4 h-4 mc-icon-accent" />
              Sertifikasi Standar Mutu Koperasi
            </div>
            <p className="text-[10px] mc-muted leading-relaxed">
              Koperasi {kopInfo?.nama || 'MetroKSP'} telah diaudit dan dinyatakan memenuhi regulasi dan standar mutu dari Dinas Koperasi dan Kementerian Koperasi secara nasional.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Modules Quick Access performance dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* Toko */}
        <div className="mc-surface-2 mc-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg mc-btn-primary text-white flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">Unit Toko POS</div>
            <div className="text-sm font-extrabold mc-ink-strong">{formatIDR(totalToko)}</div>
            <button onClick={() => onNavigate('toko_kasir')} className="text-[10px] font-semibold mc-icon-accent hover:underline mt-0.5 flex items-center gap-0.5">
              Masuk Kasir <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sewa */}
        <div className="mc-surface-2 mc-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--mc-accent)]/20 text-[var(--mc-accent)] flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">Unit Sewa Alat</div>
            <div className="text-sm font-extrabold mc-ink-strong">{formatIDR(totalSewa)}</div>
            <button onClick={() => onNavigate('sewa_dashboard')} className="text-[10px] font-semibold mc-icon-accent hover:underline mt-0.5 flex items-center gap-0.5">
              Urus Sewa <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* PPOB */}
        <div className="mc-surface-2 mc-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--mc-primary)]/20 text-[var(--mc-primary)] flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">PPOB Pulsa/Listrik</div>
            <div className="text-sm font-extrabold mc-ink-strong">{formatIDR(totalPpob)}</div>
            <button onClick={() => onNavigate('ppob_dashboard')} className="text-[10px] font-semibold text-[var(--mc-primary)] hover:underline mt-0.5 flex items-center gap-0.5">
              Transaksi PPOB <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Digital Payment */}
        <div className="mc-surface-2 mc-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--mc-success)]/20 text-[var(--mc-success)] flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">Digital Payment (VA)</div>
            <div className="text-sm font-extrabold mc-ink-strong">{formatIDR(totalVA)}</div>
            <button onClick={() => onNavigate('digipay_dashboard')} className="text-[10px] font-semibold text-[var(--mc-success)] hover:underline mt-0.5 flex items-center gap-0.5">
              Layanan VA <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Venture Investment Row */}
      {(totalVentureInvested > 0 || pendingVentures > 0 || totalDividends > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="mc-card p-5 text-white shadow-md" style={{ background: 'linear-gradient(135deg, var(--mc-accent-2), var(--mc-accent))' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-[var(--mc-on-accent)]/80 uppercase tracking-wider">Total Investasi Ventura</span>
              <TrendingUp className="w-4 h-4 text-[var(--mc-on-accent)]/80" />
            </div>
            <div className="text-xl font-extrabold text-[var(--mc-on-accent)]">{formatIDR(totalVentureInvested)}</div>
            <div className="text-[10px] text-[var(--mc-on-accent)]/80 mt-1">{activeInvestments.length} Investasi Aktif</div>
          </div>
          <div className="mc-card p-4">
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">Dividen Terkumpul</div>
            <div className="text-lg font-extrabold mc-ink-strong">{formatIDR(totalDividends)}</div>
            <button onClick={() => onNavigate('ventura_dashboard')} className="text-[10px] font-semibold mc-icon-accent hover:underline mt-0.5 flex items-center gap-0.5">
              Manajemen Investasi <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mc-card p-4">
            <div className="text-[10px] font-semibold mc-muted uppercase tracking-wider">Pengajuan Baru</div>
            <div className="text-lg font-extrabold mc-ink-strong">{pendingVentures}</div>
            <button onClick={() => onNavigate('ventura_dashboard')} className="text-[10px] font-semibold text-[var(--mc-primary)] hover:underline mt-0.5 flex items-center gap-0.5">
              Tinjau Pengajuan <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* New Loan Requests Pending Approval */}
      <div className="mc-card p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold mc-ink-strong text-sm">Permohonan Pinjaman Terbaru</h3>
            <p className="text-[11px] mc-muted">Pengajuan pinjaman dari anggota yang membutuhkan verifikasi admin</p>
          </div>
          <button 
            onClick={() => onNavigate('pinjaman_pengajuan')}
            className="text-xs font-semibold mc-icon-accent hover:underline flex items-center"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingLoans.length === 0 ? (
          <div className="text-center py-6 border border-dashed mc-border rounded-lg text-xs mc-muted">
            ✅ Tidak ada permohonan pinjaman baru yang tertunda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                  <th className="p-3">Nama Anggota</th>
                  <th className="p-3">Kategori Produk</th>
                  <th className="p-3">Jumlah Pokok</th>
                  <th className="p-3">Tenor (Bulan)</th>
                  <th className="p-3">Bunga / Margin</th>
                  <th className="p-3">Angsuran / Bln</th>
                  <th className="p-3 text-right">Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y mc-border">
                {pendingLoans.map((l) => (
                  <tr key={l.id} className="hover:mc-surface-2/50">
                    <td className="p-3 font-semibold mc-ink-strong">{l.anggotaNama}</td>
                    <td className="p-3 mc-muted">{l.jenisNama}</td>
                    <td className="p-3 font-semibold mc-ink-strong font-mono">{formatIDR(l.pokok)}</td>
                    <td className="p-3 font-mono mc-muted">{l.tenorMonths} bulan</td>
                    <td className="p-3 font-mono mc-muted">{l.bungaPersen}% / bln ({l.metodeBunga})</td>
                    <td className="p-3 font-semibold font-mono mc-ink-strong">{formatIDR(l.angsuranPerBulan)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onApproveLoan(l.id)}
                        className="mc-badge-ok border px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                      >
                        Setujui & Cairkan
                      </button>
                      <button
                        onClick={() => onRejectLoan(l.id)}
                        className="mc-btn-danger border px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
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