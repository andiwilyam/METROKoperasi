/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-performance, modern SVG-based Venture Capital & Investment Dashboard.
 */

import React, { useState } from 'react';
import { 
  TrendingUp, Award, Coins, Percent, Briefcase, Calendar, 
  ArrowUpRight, Building2, ChevronRight, PieChart, ShieldAlert, 
  BarChart3, Activity, Download, ArrowRight, ArrowDownLeft
} from 'lucide-react';
import { VentureInvestment, VentureDividend } from '../../types';

interface AdminVentureDashboardProps {
  investments: VentureInvestment[];
  onNavigate: (menu: string) => void;
}

export default function AdminVentureDashboard({
  investments,
  onNavigate
}: AdminVentureDashboardProps) {
  const [selectedInvestee, setSelectedInvestee] = useState<VentureInvestment | null>(null);

  // Formatting helpers
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // 1. Calculations & Metrics
  const activeInvestments = investments.filter(inv => inv.status === 'dicairkan');
  const finishedInvestments = investments.filter(inv => inv.status === 'selesai');
  const pendingInvestments = investments.filter(inv => inv.status === 'pengajuan');
  
  const totalInvested = investments
    .filter(inv => inv.status === 'dicairkan' || inv.status === 'selesai')
    .reduce((sum, inv) => sum + inv.nominalInvestasi, 0);

  const totalDividends = investments.reduce((sum, inv) => {
    const divs = inv.dividendHistory?.reduce((dSum, d) => dSum + d.nominalDividen, 0) || 0;
    return sum + divs;
  }, 0);

  // Overall Yield
  const overallYield = totalInvested > 0 ? (totalDividends / totalInvested) * 100 : 0;

  // Sektor Industri Breakdown
  const sectorMap: { [key: string]: { invested: number; count: number; companyNames: string[] } } = {};
  investments.forEach(inv => {
    if (inv.status === 'dicairkan' || inv.status === 'selesai' || inv.status === 'pengajuan') {
      const sec = inv.sektorIndustri;
      if (!sectorMap[sec]) {
        sectorMap[sec] = { invested: 0, count: 0, companyNames: [] };
      }
      if (inv.status !== 'pengajuan') {
        sectorMap[sec].invested += inv.nominalInvestasi;
      }
      sectorMap[sec].count += 1;
      sectorMap[sec].companyNames.push(inv.namaPerusahaan);
    }
  });

  const sectors = Object.entries(sectorMap).map(([name, data]) => ({
    name,
    invested: data.invested,
    count: data.count,
    percentage: totalInvested > 0 ? (data.invested / totalInvested) * 100 : 0,
    companies: data.companyNames
  })).sort((a, b) => b.invested - a.invested);

  // 2. Timeline of Dividends (for custom SVG graph)
  // Collect all dividend records
  const allDividends: { date: string; amount: number; company: string; label: string }[] = [];
  investments.forEach(inv => {
    inv.dividendHistory?.forEach(div => {
      allDividends.push({
        date: div.tanggal,
        amount: div.nominalDividen,
        company: inv.namaPerusahaan,
        label: div.keterangan
      });
    });
  });

  // Quick stats (computed, not hardcoded)
  const topSector = sectors[0];
  const lastDividend = [...allDividends].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  // Highest total dividend company
  let topDividendCompany = { nama: '-', total: 0, yield: 0 };
  investments.forEach(inv => {
    const total = inv.dividendHistory?.reduce((s, d) => s + d.nominalDividen, 0) || 0;
    if (total > topDividendCompany.total) {
      topDividendCompany = { nama: inv.namaPerusahaan, total, yield: inv.nominalInvestasi > 0 ? (total / inv.nominalInvestasi) * 100 : 0 };
    }
  });
  const lastDisbursement = [...investments]
    .filter(i => i.tanggalInvestasi)
    .sort((a, b) => new Date(b.tanggalInvestasi).getTime() - new Date(a.tanggalInvestasi).getTime())[0];

  // Sort dividends by date
  allDividends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate dividends for graph points
  // We'll create a rolling cumulative sum of dividends over time to plot a beautiful growth area graph
  let cumulativeSum = 0;
  const graphPoints = allDividends.map((div, idx) => {
    cumulativeSum += div.amount;
    return {
      date: div.date,
      amount: div.amount,
      cumulative: cumulativeSum,
      company: div.company,
      label: div.label
    };
  });

  // Ensure we have at least some data points for SVG path drawing
  const displayPoints = graphPoints.length > 0 ? graphPoints : [
    { date: '2026-01-01', amount: 0, cumulative: 0, company: '', label: '' },
    { date: '2026-07-08', amount: 0, cumulative: 0, company: '', label: '' }
  ];

  // SVG dimensions & calculations for the area spline
  const svgWidth = 600;
  const svgHeight = 180;
  const maxCumulative = Math.max(...displayPoints.map(p => p.cumulative), 10000000);
  const paddingX = 40;
  const paddingY = 20;

  const pointsString = displayPoints.map((pt, idx) => {
    const x = paddingX + (idx / (displayPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (pt.cumulative / maxCumulative) * (svgHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaString = displayPoints.length > 0 
    ? `${paddingX},${svgHeight - paddingY} ` + pointsString + ` ${svgWidth - paddingX},${svgHeight - paddingY}`
    : '';

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Investment Core Analytics
            </span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Dashboard Investasi &amp; Penyertaan Modal
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Sistem pengawasan portofolio ventura, imbal hasil (dividend yield) real-time, dan pendanaan ekuitas kemitraan produktif.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => onNavigate('ventura_dashboard')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-indigo-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            Kelola Portofolio
          </button>
        </div>
      </div>

      {/* 4-GRID KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Capital Deployed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Capital Deployed (Penyertaan)</span>
              <div className="text-2xl font-black text-slate-900">{formatIDR(totalInvested)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-bold text-slate-700">{activeInvestments.length}</span> Perusahaan Aktif disalurkan modal
          </div>
        </div>

        {/* Realized Returns */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Realisasi Dividen / Bagi Hasil</span>
              <div className="text-2xl font-black text-slate-900">{formatIDR(totalDividends)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-lg font-semibold inline-flex items-center gap-1 w-max">
            <span>+{allDividends.length} kali distribusi keuntungan</span>
          </div>
        </div>

        {/* Portfolio Dividend Yield */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Rata-rata Yield Investasi</span>
              <div className="text-2xl font-black text-slate-900">{overallYield.toFixed(2)}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Yield keseluruhan dari modal awal yang ditempatkan
          </div>
        </div>

        {/* Pipelines pending */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Proposal Pipeline</span>
              <div className="text-2xl font-black text-slate-900">{pendingInvestments.length} Pengajuan</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-bold text-slate-700">{pendingInvestments.length}</span> dalam antrean review komite
          </div>
        </div>

      </div>

      {/* GRAPH & SECTOR SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH: REVENUE / DIVIDEND PROGRESS */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Tren Akumulasi Bagi Hasil &amp; Hasil Dividen
              </h3>
              <p className="text-[11px] text-slate-500">Menampilkan pertumbuhan pendapatan dividen berkala dari seluruh portofolio usaha.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">2025 - 2026</span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="relative w-full pt-2">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto max-h-[180px] overflow-visible"
            >
              {/* Horizontal Gridlines */}
              <line x1="30" y1="20" x2="570" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="60" x2="570" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="570" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="160" x2="570" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Shaded Area */}
              {areaString && (
                <polygon 
                  points={areaString} 
                  fill="url(#grad)" 
                  opacity="0.2"
                />
              )}

              {/* Actual Line */}
              {pointsString && (
                <polyline 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  points={pointsString}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Markers for data points */}
              {displayPoints.map((pt, idx) => {
                if (pt.cumulative === 0) return null;
                const x = paddingX + (idx / (displayPoints.length - 1)) * (svgWidth - paddingX * 2);
                const y = svgHeight - paddingY - (pt.cumulative / maxCumulative) * (svgHeight - paddingY * 2);
                return (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="5" 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                      className="transition group-hover:scale-150 duration-200" 
                    />
                    <title>{`${pt.company} - ${formatIDR(pt.amount)} (${pt.date})`}</title>
                  </g>
                );
              })}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Labels */}
              <text x="35" y="174" fill="#94a3b8" fontSize="9" fontWeight="bold">Mulai</text>
              <text x="540" y="174" fill="#94a3b8" fontSize="9" fontWeight="bold">Juli 2026</text>
            </svg>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] block uppercase tracking-wide">Panen Terakhir</span>
              <span className="font-bold text-slate-800">{lastDividend?.company || '-'}</span>
              <p className="text-[10px] text-emerald-600 font-medium">{lastDividend ? `${formatIDR(lastDividend.amount)} (${lastDividend.date})` : 'Belum ada dividen'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] block uppercase tracking-wide">Imbalan Tertinggi</span>
              <span className="font-bold text-slate-800">{topDividendCompany.nama}</span>
              <p className="text-[10px] text-slate-500">{topDividendCompany.total > 0 ? `Total ${formatIDR(topDividendCompany.total)} (Yield ${topDividendCompany.yield.toFixed(1)}%)` : 'Belum ada'}</p>
            </div>
            <div className="space-y-0.5 hidden md:block">
              <span className="text-slate-400 text-[10px] block uppercase tracking-wide">Penyaluran Terakhir</span>
              <span className="font-bold text-slate-800">{lastDisbursement?.namaPerusahaan || '-'}</span>
              <p className="text-[10px] text-amber-600 font-medium">{lastDisbursement ? `${formatIDR(lastDisbursement.nominalInvestasi)} (Status: ${lastDisbursement.status})` : '-'}</p>
            </div>
          </div>
        </div>

        {/* SECTOR ALLOCATION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-500" />
              Alokasi Sektor Industri (Diversifikasi)
            </h3>
            <p className="text-[11px] text-slate-500">Mencegah konsentrasi risiko dengan diversifikasi sektor sehat.</p>
          </div>

          <div className="space-y-3.5 my-2">
            {sectors.map((sec, idx) => {
              const bgColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
              const lightColors = ['bg-emerald-50 text-emerald-700', 'bg-blue-50 text-blue-700', 'bg-purple-50 text-purple-700', 'bg-amber-50 text-amber-700', 'bg-rose-50 text-rose-700'];
              const colorIdx = idx % bgColors.length;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{sec.name}</span>
                    <span className="font-bold text-slate-950 font-mono">{formatIDR(sec.invested)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${bgColors[colorIdx]} h-full rounded-full`} style={{ width: `${sec.percentage}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{sec.count} Perusahaan</span>
                    <span className="font-semibold text-slate-600">{sec.percentage.toFixed(1)}% Kontribusi</span>
                  </div>
                </div>
              );
            })}

            {sectors.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">Belum ada portofolio investasi terdaftar.</div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
            <span className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5">ℹ</span>
            <p className="leading-normal">
              {topSector
                ? <>Sektor <strong className="text-slate-700">{topSector.name}</strong> memiliki konsentrasi modal terbesar saat ini ({topSector.percentage.toFixed(1)}%).</>
                : 'Belum ada portofolio investasi untuk dianalisis.'}
            </p>
          </div>
        </div>

      </div>

      {/* PORTFOLIO COMPANIES DIRECTORY & DETAIL MODAL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Direktori &amp; Kinerja Investee</h3>
            <p className="text-xs text-slate-500">Rangkuman kinerja modal, kepemilikan saham, serta total dividen yang berhasil direalisasikan.</p>
          </div>
          <button
            onClick={() => onNavigate('ventura_dashboard')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            Lihat Detail Transaksi &amp; Dokumen <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100">
                <th className="p-4">Perusahaan &amp; Sektor</th>
                <th className="p-4">Pendiri (Founder)</th>
                <th className="p-4 text-right">Modal Ditempatkan</th>
                <th className="p-4 text-center">Saham (Equity)</th>
                <th className="p-4 text-right">Realisasi Dividen</th>
                <th className="p-4 text-center">ROI Real-time</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {investments.map((inv) => {
                const totalDiv = inv.dividendHistory?.reduce((sum, d) => sum + d.nominalDividen, 0) || 0;
                const roi = inv.nominalInvestasi > 0 ? (totalDiv / inv.nominalInvestasi) * 100 : 0;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{inv.namaPerusahaan}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{inv.sektorIndustri}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{inv.namaFounder}</div>
                      <div className="text-[10px] text-slate-400">{inv.kontakFounder}</div>
                    </td>
                    <td className="p-4 text-right font-semibold text-slate-900 font-mono">
                      {formatIDR(inv.nominalInvestasi)}
                    </td>
                    <td className="p-4 text-center font-bold text-blue-600 font-mono">
                      {inv.persentaseSaham}%
                    </td>
                    <td className="p-4 text-right font-semibold text-emerald-600 font-mono">
                      {formatIDR(totalDiv)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-800 font-mono">{roi.toFixed(1)}%</span>
                        <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(roi, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {inv.status === 'dicairkan' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Aktif (Dicairkan)
                        </span>
                      )}
                      {inv.status === 'selesai' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          Selesai
                        </span>
                      )}
                      {inv.status === 'pengajuan' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
                          Review (Pengajuan)
                        </span>
                      )}
                      {inv.status === 'disetujui' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                          Disetujui
                        </span>
                      )}
                      {inv.status === 'ditolak' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          Ditolak
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedInvestee(inv)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-900 font-bold border border-slate-200 hover:border-slate-300 rounded-lg transition hover:bg-white text-[10px] cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / POPUP MODAL */}
      {selectedInvestee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold font-mono">Informasi Rinci Investee</span>
                <h4 className="font-extrabold text-base">{selectedInvestee.namaPerusahaan}</h4>
              </div>
              <button 
                onClick={() => setSelectedInvestee(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Business Description */}
              <div className="space-y-1 bg-slate-50 p-3.5 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Deskripsi Usaha &amp; Alokasi</span>
                <p className="text-xs text-slate-600 leading-normal font-medium">{selectedInvestee.deskripsiBisnis}</p>
              </div>

              {/* Founder Profile */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-100 p-3 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Nama Pendiri / CEO</span>
                  <span className="font-bold text-slate-800">{selectedInvestee.namaFounder}</span>
                </div>
                <div className="border border-slate-100 p-3 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Kontak Telepon</span>
                  <span className="font-bold text-slate-800">{selectedInvestee.kontakFounder}</span>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl text-center space-y-0.5 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase">Penyertaan Modal</span>
                  <span className="font-bold text-slate-800 block font-mono">{formatIDR(selectedInvestee.nominalInvestasi)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center space-y-0.5 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase">Porsi Saham</span>
                  <span className="font-bold text-blue-600 block font-mono">{selectedInvestee.persentaseSaham}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center space-y-0.5 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase">Estimasi Hasil</span>
                  <span className="font-bold text-emerald-600 block font-mono">~{selectedInvestee.estimasiDividen}% / th</span>
                </div>
              </div>

              {/* Dividends History */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Histori Pengembalian Dividen</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedInvestee.dividendHistory?.map((div, dIdx) => (
                    <div key={div.id || dIdx} className="p-3 flex justify-between items-center text-xs hover:bg-slate-50 transition">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800">{div.keterangan}</span>
                        <span className="text-[10px] text-slate-400 block">{div.tanggal}</span>
                      </div>
                      <span className="font-black text-emerald-600 font-mono">{formatIDR(div.nominalDividen)}</span>
                    </div>
                  ))}

                  {(!selectedInvestee.dividendHistory || selectedInvestee.dividendHistory.length === 0) && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada catatan dividen/bagi hasil didistribusikan.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvestee(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setSelectedInvestee(null);
                  onNavigate('ventura_dashboard');
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-indigo-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1 cursor-pointer"
              >
                Kelola Investee <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
