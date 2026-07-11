/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Plus, Calendar, Coins, Percent, Award, Briefcase, 
  User, CheckCircle2, AlertCircle, X, ShieldCheck, HelpCircle,
  FileText, ArrowUpRight, Check
} from 'lucide-react';
import { VentureInvestment, UserSession } from '../../types';

interface MemberVenturaProps {
  investments: VentureInvestment[];
  onAddInvestment: (newInv: Omit<VentureInvestment, 'id' | 'dividendHistory'>) => void;
  session?: UserSession;
}

export default function MemberVentura({
  investments,
  onAddInvestment,
  session
}: MemberVenturaProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [sektorIndustri, setSektorIndustri] = useState('');
  const [namaFounder, setNamaFounder] = useState('');
  const [nominalInvestasi, setNominalInvestasi] = useState(100000000);
  const [persentaseSaham, setPersentaseSaham] = useState(15);
  const [estimasiNisbahBagiHasil, setEstimasiNisbahBagiHasil] = useState(25);
  const [deskripsiBisnis, setDeskripsiBisnis] = useState('');
  const [kontakFounder, setKontakFounder] = useState('');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPerusahaan || !sektorIndustri || !namaFounder || !kontakFounder) return;

    onAddInvestment({
      namaPerusahaan,
      sektorIndustri,
      namaFounder,
      nominalInvestasi,
      persentaseSaham,
      estimasiDividen: estimasiNisbahBagiHasil,
      tanggalInvestasi: new Date().toISOString().split('T')[0],
      tenorTahun: 3,
      status: 'pengajuan',
      deskripsiBisnis,
      kontakFounder,
      prospektusUrl: 'prospektus_' + namaPerusahaan.toLowerCase().replace(/\s+/g, '_') + '.pdf',
      pengajuAnggotaId: session?.memberId,
      pengajuAnggotaNama: session?.namaLengkap
    });

    setNamaPerusahaan('');
    setSektorIndustri('');
    setNamaFounder('');
    setNominalInvestasi(100000000);
    setPersentaseSaham(15);
    setEstimasiNisbahBagiHasil(25);
    setDeskripsiBisnis('');
    setKontakFounder('');
    setShowApplyModal(false);

    setSuccessMessage('Prospektus bisnis Anda berhasil diajukan! Tim analis investasi MetroCOOP akan menghubungi Anda dalam 3-5 hari kerja.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 8000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center">
          <Building2 className="w-64 h-64" />
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Unit Investasi Produktif &amp; Modal Ventura
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Penyertaan Modal Ventura (Venture Capital / Equity Investment)
          </h2>
          <p className="text-xs text-indigo-100 leading-relaxed">
            MetroCOOP mendukung pertumbuhan UKM &amp; Start-up potensial dengan menyertakan modal langsung (investasi ekuitas) dengan sistem pembagian dividen hasil usaha yang profesional dan menguntungkan.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-amber-500/15"
            >
              Ajukan Penyertaan Modal Bisnis Saya
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-indigo-200 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sesuai Regulasi UU Koperasi No. 25 Tahun 1992
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUCCESS FEEDBACK */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3 animate-fadeIn text-xs leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pengajuan Berhasil</p>
            <p className="text-emerald-600 mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* 3. COOPERATIVE'S VENTURE PORTFOLIO GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Portofolio Investasi Koperasi Saat Ini
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Jumlah Portofolio: {investments.length} Perusahaan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="p-5 border-b border-slate-100 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{inv.namaPerusahaan}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{inv.sektorIndustri}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    inv.status === 'dicairkan' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    inv.status === 'pengajuan' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                    inv.status === 'disetujui' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    inv.status === 'selesai' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {inv.status === 'dicairkan' ? 'Aktif' : inv.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {inv.deskripsiBisnis}
                </p>

                <div className="grid grid-cols-2 gap-3 text-[10px] pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[8px]">Nominal Investasi</span>
                    <span className="font-bold text-slate-800">{formatIDR(inv.nominalInvestasi)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[8px]">Porsi Saham</span>
                    <span className="font-bold text-slate-800">{inv.persentaseSaham}% Ekuitas</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[8px]">Porsi Deviden</span>
                    <span className="font-bold text-blue-600">{inv.estimasiDividen}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[8px]">Masa Kontrak</span>
                    <span className="font-bold text-slate-800">{inv.tenorTahun} Tahun</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-[10px]">
                <div className="text-slate-400 font-semibold">
                  Founder: <span className="text-slate-700">{inv.namaFounder}</span>
                </div>
                {inv.dividendHistory && inv.dividendHistory.length > 0 && (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    <Coins className="w-3.5 h-3.5" />
                    Dividen Lancar
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VENTURE COMPLIANCE INFORMATION */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
        <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Bagaimana Skema Investasi &amp; Modal Ventura MetroCOOP Bekerja?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600 leading-relaxed text-[11px]">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 block">1. Analisis Prospektus</span>
            <p>Setiap pengajuan proposal modal ventura di MetroCOOP akan dievaluasi kelayakan bisnisnya, aliran kas (cash flow), serta kompetensi founder oleh Komite Investasi Koperasi.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-800 block">2. Investasi Ekuitas (Saham)</span>
            <p>Modal diberikan berupa kepemilikan saham langsung. Pembagian deviden berdasarkan laba bersih operasional riil bulanan/triwulan yang disepakati bersama.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-800 block">3. Opsi Redemptasi Modal</span>
            <p>Koperasi memiliki rencana divestasi atau pembelian kembali saham secara bertahap oleh founder (Equity Buyback / Redemptasi) setelah berakhirnya tenor investasi.</p>
          </div>
        </div>
      </div>

      {/* 5. MODAL: MEMBER APPLICATION FORM */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-blue-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Formulir Pengajuan Penyertaan Modal Ventura
              </h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="hover:bg-blue-800 p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Nama Perusahaan / Merek Usaha</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Kuliner Nusantara Abadi"
                    value={namaPerusahaan}
                    onChange={(e) => setNamaPerusahaan(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Sektor Industri / Bisnis</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Agrotech, FinTech, Retail"
                    value={sektorIndustri}
                    onChange={(e) => setSektorIndustri(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap Founder / Anda</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama founder utama"
                    value={namaFounder}
                    onChange={(e) => setNamaFounder(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nomor Kontak WhatsApp / HP</label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor WA aktif"
                    value={kontakFounder}
                    onChange={(e) => setKontakFounder(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Target Modal Penyertaan (IDR)</label>
                  <input
                    type="number"
                    required
                    value={nominalInvestasi}
                    onChange={(e) => setNominalInvestasi(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Porsi Ekuitas Ditawarkan (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={persentaseSaham}
                    onChange={(e) => setPersentaseSaham(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Estimasi Pengembalian / Dividen (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={estimasiNisbahBagiHasil}
                    onChange={(e) => setEstimasiNisbahBagiHasil(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Rencana Penggunaan Dana &amp; Profil Usaha</label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan secara ringkas kegiatan utama usaha dan alokasi dana modal ventura..."
                    value={deskripsiBisnis}
                    onChange={(e) => setDeskripsiBisnis(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded font-bold shadow-sm"
                >
                  Ajukan Proposal Bisnis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
