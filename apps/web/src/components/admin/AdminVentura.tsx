/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Search, Plus, Calendar, Coins, Percent, Award, Briefcase, 
  User, CheckCircle2, AlertCircle, X, ShieldAlert, TrendingUp, Handshake, DollarSign,
  FileText, Phone, Sparkles, Cpu
} from 'lucide-react';
import { VentureInvestment, VentureDividend } from '../../types';

interface AdminVenturaProps {
  investments: VentureInvestment[];
  onAddInvestment: (newInv: Omit<VentureInvestment, 'id' | 'dividendHistory'>) => void;
  onUpdateStatus: (id: string, newStatus: VentureInvestment['status']) => void;
  onRecordBagiHasil: (investmentId: string, item: Omit<VentureDividend, 'id'>) => void;
  onUpdateInvestment?: (id: string, data: any) => Promise<void>;
}

export default function AdminVentura({
  investments,
  onAddInvestment,
  onUpdateStatus,
  onRecordBagiHasil
}: AdminVenturaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<VentureInvestment | null>(null);
  const [showBagiHasilModal, setShowBagiHasilModal] = useState(false);
  
  // AI Audit Modal States
  const [showAiAuditModal, setShowAiAuditModal] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditProgress, setAuditProgress] = useState(1); // 1: Connecting, 2: Auditing
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleOpenAiAudit = async (inv: VentureInvestment) => {
    setSelectedInvestment(inv);
    setShowAiAuditModal(true);
    setAuditLoading(true);
    setAuditError(null);
    setAuditResult(null);
    setAuditProgress(1); // Connecting

    const timer = setTimeout(() => {
      setAuditProgress(2); // Analyzing
    }, 1500);

    try {
      const response = await fetch('/api/gemini/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ investment: inv })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Terjadi kesalahan saat menghubungi server audit.');
      }

      const data = await response.json();
      
      // Artificial delay so the loading phases can be visibly seen and read by the user
      setTimeout(() => {
        setAuditResult(data);
        setAuditLoading(false);
      }, 3000);

    } catch (err: any) {
      clearTimeout(timer);
      setAuditError(err.message || 'Gagal terhubung ke Gemini AI.');
      setAuditLoading(false);
    }
  };

  // Form states for new investment
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [sektorIndustri, setSektorIndustri] = useState('');
  const [namaFounder, setNamaFounder] = useState('');
  const [nominalInvestasi, setNominalInvestasi] = useState(100000000);
  const [persentaseSaham, setPersentaseSaham] = useState(15);
  const [estimasiNisbahBagiHasil, setEstimasiNisbahBagiHasil] = useState(25);
  const [tanggalInvestasi, setTanggalInvestasi] = useState(new Date().toISOString().split('T')[0]);
  const [tenorTahun, setTenorTahun] = useState(3);
  const [deskripsiBisnis, setDeskripsiBisnis] = useState('');
  const [kontakFounder, setKontakFounder] = useState('');

  // Form states for new dividend record
  const [bagihasilTanggal, setBagihasilTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [bagihasilNominal, setBagihasilNominal] = useState(5000000);
  const [bagihasilKeterangan, setBagihasilKeterangan] = useState('');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPerusahaan || !sektorIndustri || !namaFounder || !kontakFounder) return;

    onAddInvestment({
      namaPerusahaan,
      sektorIndustri,
      namaFounder,
      nominalInvestasi,
      persentaseSaham,
      estimasiDividen: estimasiNisbahBagiHasil,
      tanggalInvestasi,
      tenorTahun,
      status: 'pengajuan',
      deskripsiBisnis,
      kontakFounder,
      prospektusUrl: 'prospektus_' + namaPerusahaan.toLowerCase().replace(/\s+/g, '_') + '.pdf'
    });

    // Reset fields & close
    setNamaPerusahaan('');
    setSektorIndustri('');
    setNamaFounder('');
    setNominalInvestasi(100000000);
    setPersentaseSaham(15);
    setEstimasiNisbahBagiHasil(25);
    setTanggalInvestasi(new Date().toISOString().split('T')[0]);
    setTenorTahun(3);
    setDeskripsiBisnis('');
    setKontakFounder('');
    setShowAddModal(false);
  };

  const handleBagiHasilSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestment || !bagihasilNominal) return;

    onRecordBagiHasil(selectedInvestment.id, {
      tanggal: bagihasilTanggal,
      nominalDividen: bagihasilNominal,
      keterangan: bagihasilKeterangan || 'Distribusi Dividen'
    });

    // Re-sync detail view
    const updated = investments.find(inv => inv.id === selectedInvestment.id);
    if (updated) {
      setSelectedInvestment({
        ...updated,
        dividendHistory: [
          ...updated.dividendHistory,
          {
            id: 'temp_' + Date.now(),
            tanggal: bagihasilTanggal,
            nominalDividen: bagihasilNominal,
            keterangan: bagihasilKeterangan || 'Distribusi Dividen'
          }
        ]
      });
    }

    setBagihasilNominal(5000000);
    setBagihasilKeterangan('');
    setShowBagiHasilModal(false);
  };

  // Filter logic
  const filtered = investments.filter(inv => {
    const matchSearch = inv.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        inv.sektorIndustri.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inv.namaFounder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalDanaDisalurkan = investments
    .filter(inv => inv.status === 'dicairkan' || inv.status === 'selesai')
    .reduce((acc, curr) => acc + curr.nominalInvestasi, 0);

  const totalBagiHasilDiterima = investments.reduce((acc, curr) => {
    const investmentTotal = curr.dividendHistory?.reduce((sum, bh) => sum + bh.nominalDividen, 0) || 0;
    return acc + investmentTotal;
  }, 0);

  const portfolioAktifCount = investments.filter(inv => inv.status === 'dicairkan').length;
  const averageSaham = investments.length > 0 
    ? (investments.reduce((acc, curr) => acc + curr.persentaseSaham, 0) / investments.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      
      {/* 1. PORTFOLIO METRICS / BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm text-white space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Dana Ventura Disalurkan</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{formatIDR(totalDanaDisalurkan)}</div>
          <p className="text-[10px] text-slate-400 leading-none">Dari akumulasi penyertaan modal ventura.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Realisasi Dividen / Hasil</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-800">{formatIDR(totalBagiHasilDiterima)}</div>
          <p className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold">
            Yield Berjalan Koperasi
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Portofolio Investee Aktif</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-800">{portfolioAktifCount} Perusahaan</div>
          <p className="text-[10px] text-slate-400 leading-none">Dalam masa kontrak penyertaan.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Rata-rata Kepemilikan Saham</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-800">{averageSaham}% Ekuitas</div>
          <p className="text-[10px] text-slate-400 leading-none">Kontrol kepemilikan modal sehat.</p>
        </div>
      </div>

      {/* 2. CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex flex-1 w-full gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari investee, founder, sektor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pengajuan">📋 Pengajuan</option>
            <option value="disetujui">👍 Disetujui</option>
            <option value="dicairkan">🚀 Dicairkan (Aktif)</option>
            <option value="selesai">✅ Selesai Kontrak</option>
            <option value="ditolak">❌ Ditolak</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Prospektus / Ajukan Investasi Baru
        </button>
      </div>

      {/* 3. MAIN INVESTMENTS DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Direktori Portofolio Penyertaan Modal Ventura (Equity Venture)
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">Tidak ditemukan data investasi yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Perusahaan &amp; Sektor</th>
                  <th className="p-4">Founder</th>
                  <th className="p-4">Pengaju</th>
                  <th className="p-4 text-right">Modal Investasi</th>
                  <th className="p-4 text-center">Ekuitas / Porsi Deviden</th>
                  <th className="p-4">Tenor</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => {
                  const realization = inv.dividendHistory?.reduce((sum, bh) => sum + bh.nominalDividen, 0) || 0;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800 text-xs">{inv.namaPerusahaan}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{inv.sektorIndustri}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{inv.namaFounder}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.kontakFounder}</div>
                      </td>
                      <td className="p-4">
                        {inv.pengajuAnggotaNama ? (
                          <>
                            <div className="font-medium text-slate-700 text-[11px]">{inv.pengajuAnggotaNama}</div>
                            <div className="text-[9px] text-slate-400 font-mono">Anggota</div>
                          </>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">Admin/Internal</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-950">
                        {formatIDR(inv.nominalInvestasi)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-bold text-slate-800">{inv.persentaseSaham}% Saham</div>
                        <div className="text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded-full inline-block mt-1 font-semibold">
                          Imbal Hasil {inv.estimasiDividen}%
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-700">{inv.tenorTahun} Tahun</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Mulai: {inv.tanggalInvestasi}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${
                          inv.status === 'pengajuan' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          inv.status === 'disetujui' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          inv.status === 'dicairkan' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          inv.status === 'selesai' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {inv.status === 'pengajuan' && '📋 Pengajuan'}
                          {inv.status === 'disetujui' && '👍 Disetujui'}
                          {inv.status === 'dicairkan' && '🚀 Dicairkan'}
                          {inv.status === 'selesai' && '✅ Lunas/Selesai'}
                          {inv.status === 'ditolak' && '❌ Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInvestment(inv)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 border border-slate-300 rounded font-semibold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
                        >
                          <FileText className="w-3 h-3" />
                          Rincian
                        </button>

                        <button
                          onClick={() => handleOpenAiAudit(inv)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 border border-purple-200 rounded font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                          AI Audit
                        </button>
                        
                        {inv.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onUpdateStatus(inv.id, 'disetujui')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => onUpdateStatus(inv.id, 'ditolak')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 border border-red-200 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {inv.status === 'disetujui' && (
                          <button
                            onClick={() => onUpdateStatus(inv.id, 'dicairkan')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition"
                          >
                            Cairkan Modal 🚀
                          </button>
                        )}

                        {inv.status === 'dicairkan' && (
                          <button
                            onClick={() => {
                              setSelectedInvestment(inv);
                              setShowBagiHasilModal(true);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition inline-flex items-center gap-1"
                          >
                            <Coins className="w-3 h-3" />
                            Catat Dividen
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. MODAL: ADD NEW VENTURE CAPITAL INVESTMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Registrasi Investasi Ventura Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Nama Perusahaan Investee</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Kuliner Hijrah Abadi"
                    value={namaPerusahaan}
                    onChange={(e) => setNamaPerusahaan(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
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
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nama Pendiri (Founder)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap founder"
                    value={namaFounder}
                    onChange={(e) => setNamaFounder(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Kontak WhatsApp Founder</label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor HP/WA aktif"
                    value={kontakFounder}
                    onChange={(e) => setKontakFounder(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nominal Penyertaan Modal (IDR)</label>
                  <input
                    type="number"
                    required
                    value={nominalInvestasi}
                    onChange={(e) => setNominalInvestasi(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Porsi Ekuitas / Saham (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={persentaseSaham}
                    onChange={(e) => setPersentaseSaham(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Estimasi Imbal Hasil (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={estimasiNisbahBagiHasil}
                    onChange={(e) => setEstimasiNisbahBagiHasil(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tenor Penyertaan (Tahun)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={tenorTahun}
                    onChange={(e) => setTenorTahun(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tanggal Mulai Penyertaan</label>
                  <input
                    type="date"
                    required
                    value={tanggalInvestasi}
                    onChange={(e) => setTanggalInvestasi(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Deskripsi Ringkas &amp; Rencana Bisnis</label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan prospek bisnis utama dan bagaimana modal akan digunakan..."
                    value={deskripsiBisnis}
                    onChange={(e) => setDeskripsiBisnis(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm"
                >
                  Ajukan Prospektus Investasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: DETAILED VENTURE VIEW AND DIVIDEND LOGS */}
      {selectedInvestment && !showBagiHasilModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="font-extrabold text-sm">{selectedInvestment.namaPerusahaan}</h3>
                <p className="text-[10px] text-slate-400 font-medium">Sektor: {selectedInvestment.sektorIndustri}</p>
              </div>
              <button 
                onClick={() => setSelectedInvestment(null)}
                className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Pendiri / Founder</span>
                  <div className="font-extrabold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    {selectedInvestment.namaFounder}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selectedInvestment.kontakFounder}
                  </div>
                </div>

                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Penyertaan Modal</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {formatIDR(selectedInvestment.nominalInvestasi)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold text-blue-600">
                    {selectedInvestment.persentaseSaham}% Saham &bull; Tenor {selectedInvestment.tenorTahun} Tahun
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Rencana &amp; Deskripsi Bisnis</span>
                <p className="text-slate-700 bg-slate-50 p-3 border border-slate-100 rounded-lg italic leading-relaxed">
                  &quot;{selectedInvestment.deskripsiBisnis || 'Tidak ada deskripsi rinci.'}&quot;
                </p>
              </div>

              {/* Dividen Logs inside details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500" />
                    Riwayat Pembagian Dividen &amp; Hasil Investasi
                  </span>
                  
                  {selectedInvestment.status === 'dicairkan' && (
                    <button
                      onClick={() => setShowBagiHasilModal(true)}
                      className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 px-2 py-0.5 rounded font-bold text-[10px]"
                    >
                      + Tambah Log Dividen
                    </button>
                  )}
                </div>

                {!selectedInvestment.dividendHistory || selectedInvestment.dividendHistory.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-[11px]">
                    Belum ada deviden yang tercatat untuk portofolio ini.
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[9px] uppercase">
                          <th className="p-3">Tanggal</th>
                          <th className="p-3">Keterangan</th>
                          <th className="p-3 text-right">Nominal Terima</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedInvestment.dividendHistory.map((bh) => (
                          <tr key={bh.id} className="hover:bg-slate-50 font-mono text-[11px]">
                            <td className="p-3 text-slate-400">{bh.tanggal}</td>
                            <td className="p-3 font-sans text-slate-600">{bh.keterangan}</td>
                            <td className="p-3 text-right font-extrabold text-emerald-600">
                              {formatIDR(bh.nominalDividen)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedInvestment(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CREATE DIVIDEND TRANSACTION */}
      {showBagiHasilModal && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-amber-500 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Catat Dividen &amp; Hasil Investasi
              </h3>
              <button 
                onClick={() => setShowBagiHasilModal(false)}
                className="hover:bg-amber-600 p-1 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBagiHasilSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Input setoran deviden hasil investasi yang diperoleh Koperasi dari investee <span className="font-bold text-slate-800">{selectedInvestment.namaPerusahaan}</span> sesuai porsi kepemilikan {selectedInvestment.estimasiDividen}%.
              </p>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tanggal Terima Kas</label>
                <input
                  type="date"
                  required
                  value={bagihasilTanggal}
                  onChange={(e) => setBagihasilTanggal(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nominal Distribusi Dividen (IDR)</label>
                <input
                  type="number"
                  required
                  value={bagihasilNominal}
                  onChange={(e) => setBagihasilNominal(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Keterangan / Deskripsi Panen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dividen Triwulan II"
                  value={bagihasilKeterangan}
                  onChange={(e) => setBagihasilKeterangan(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBagiHasilModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold text-xs"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs shadow-sm"
                >
                  Simpan Transaksi Dividen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: AI AUDIT DETAILS (GEMINI SAK ETAP AUDIT) */}
      {showAiAuditModal && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-purple-900 text-white">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  Audit Investasi &amp; SAK ETAP
                </h3>
                <p className="text-[10px] text-purple-200 font-medium mt-0.5">
                  Layanan Konsultasi &amp; Audit AI Berbasis Permenkop &amp; SAK ETAP
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAiAuditModal(false);
                  setAuditResult(null);
                  setAuditError(null);
                }}
                className="hover:bg-purple-800 p-1 rounded-full text-purple-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* LOADING STATE */}
              {auditLoading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                    <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  
                  <div className="space-y-3 max-w-lg px-4">
                    <p className="font-extrabold text-purple-800 text-sm animate-pulse">
                      {auditProgress === 1 ? "Menghubungkan ke Gemini AI..." : "Menganalisis & Memformulasikan Laporan..."}
                    </p>
                    <p className="text-slate-500 leading-relaxed text-[11px] animate-fadeIn">
                      {auditProgress === 1 
                        ? "Memulai handshake aman dengan mesin kecerdasan buatan Gemini AI..." 
                        : "Kecerdasan Buatan sedang mengaudit Laporan Keuangan Investee, menghitung rasio leverage (DER), tingkat pengembalian ekuitas (ROE), menganalisis kepatuhan Permenkop No. 2/2024, serta memformulasikan estimasi Nilai Terpulihkan (Recoverable Amount) sesuai standar akuntansi SAK ETAP Bab 22..."}
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR STATE */}
              {auditError && (
                <div className="p-6 border border-red-100 rounded-xl bg-red-50 text-center space-y-4">
                  <AlertCircle className="w-12 h-12 mx-auto text-red-500 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-red-800 text-sm">Gagal Melakukan Audit AI</h4>
                    <p className="text-red-600 text-[11px] max-w-md mx-auto">{auditError}</p>
                  </div>
                  <button
                    onClick={() => handleOpenAiAudit(selectedInvestment)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition shadow-sm"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* AUDIT RESULT RENDER */}
              {!auditLoading && !auditError && auditResult && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* HEADER OF RESULTS */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-purple-100 bg-purple-50/50 rounded-xl gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">Standar Kepatuhan Audit</span>
                      <div className="font-extrabold text-slate-800 text-sm">
                        Audit standard: SAK ETAP (Sistem Akuntansi Koperasi Konvensional)
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-800 font-black px-3 py-1 rounded-full text-[10px]">
                      VERIFIED BY GEMINI AI
                    </div>
                  </div>

                  {/* INVESTEE SUMMARY CARD */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Perusahaan Audit</span>
                      <div className="font-extrabold text-slate-800 text-sm">{auditResult.perusahaan}</div>
                      <span className="text-[10px] text-slate-500">Subjek Penyertaan Modal</span>
                    </div>

                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Sektor &amp; Kualifikasi</span>
                      <div className="font-extrabold text-slate-800 text-sm">{auditResult.sektor}</div>
                      <span className="text-[10px] text-slate-500">Tergolong Anggota KSP</span>
                    </div>

                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Status Kesehatan Investasi</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-black text-xs border ${
                          auditResult.statusKesehatan?.toLowerCase().includes('kurang') || auditResult.statusKesehatan?.toLowerCase().includes('tidak')
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : auditResult.statusKesehatan?.toLowerCase().includes('cukup')
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {auditResult.statusKesehatan}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS SECTIONS */}
                  <div className="space-y-4">
                    
                    {/* SECTION 1 */}
                    <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                        Analisis Kinerja Keuangan (ROE &amp; DER)
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-wrap">
                        {auditResult.analisisKeuangan}
                      </p>
                    </div>

                    {/* SECTION 2 */}
                    <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                        Analisis Kepatuhan Regulasi Koperasi
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-wrap">
                        {auditResult.analisisRegulasi}
                      </p>
                    </div>

                    {/* SECTION 3 */}
                    <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                        Penilaian Penurunan Nilai (SAK ETAP)
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-wrap">
                        {auditResult.penilaianPenurunanNilai}
                      </p>
                    </div>

                    {/* SECTION 4 */}
                    <div className="border border-purple-50 rounded-xl p-5 bg-purple-50/20 shadow-sm space-y-3">
                      <h4 className="font-extrabold text-purple-900 text-sm flex items-center gap-2 border-b border-purple-100 pb-2">
                        <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">4</span>
                        Langkah Strategis Pengurus KSP
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {auditResult.langkahStrategis?.map((step: string, index: number) => (
                          <div key={index} className="flex gap-3 bg-white border border-slate-100 p-3 rounded-lg">
                            <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                              {index + 1}
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            <div className="p-4 border-t border-slate-100 text-right flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAiAuditModal(false);
                  setAuditResult(null);
                  setAuditError(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer transition shadow-sm"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
