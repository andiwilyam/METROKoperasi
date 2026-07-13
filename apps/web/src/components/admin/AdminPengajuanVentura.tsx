import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3, Search, Plus, X, Building2, Calendar, DollarSign, Clock, User, Scale, FileCheck, Sparkles } from 'lucide-react';

interface Props {
  pengajuanList: any[];
  perusahaan: any[];
  fetchPengajuan: () => Promise<void>;
  createPengajuan: (data: any) => Promise<any>;
  updateStatusPengajuan: (id: string, status: string) => Promise<void>;
  runAIScoring: (id: string) => Promise<any>;
  fetchDokumenTemplates: () => Promise<any[]>;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  dokumen_lengkap: 'bg-blue-50 text-blue-700 border-blue-200',
  proses_analisis: 'bg-purple-50 text-purple-700 border-purple-200',
  selesai_skoring: 'bg-teal-50 text-teal-700 border-teal-200',
  layak: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  layak_bersyarat: 'bg-amber-50 text-amber-700 border-amber-200',
  tidak_layak: 'bg-red-50 text-red-700 border-red-200',
  dicairkan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ditolak: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  dokumen_lengkap: 'Dokumen Lengkap',
  proses_analisis: 'Proses Analisis',
  selesai_skoring: 'Selesai Skoring',
  layak: 'LAYAK',
  layak_bersyarat: 'Layak Bersyarat',
  tidak_layak: 'TIDAK LAYAK',
  dicairkan: 'Dicairkan',
  ditolak: 'Ditolak',
};

const formatIDR = (num: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminPengajuanVentura({
  pengajuanList,
  perusahaan,
  fetchPengajuan,
  createPengajuan,
  updateStatusPengajuan,
  runAIScoring,
  fetchDokumenTemplates,
}: Props) {
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [dokumenTemplates, setDokumenTemplates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('LEGALITAS');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ perusahaanId: '', pokokPinjaman: 50000000, tenorBulan: 12, tujuan: '', bungaPersen: 1.5 });

  useEffect(() => {
    fetchDokumenTemplates().then(setDokumenTemplates).catch(() => {});
  }, []);

  const filtered = pengajuanList.filter((p: any) =>
    p.noPengajuan?.toLowerCase().includes(search.toLowerCase()) ||
    p.perusahaanNama?.toLowerCase().includes(search.toLowerCase())
  );

  const total = pengajuanList.length;
  const countLayak = pengajuanList.filter((p: any) => p.status === 'layak').length;
  const countTidakLayak = pengajuanList.filter((p: any) => p.status === 'tidak_layak' || p.status === 'ditolak').length;
  const countPending = pengajuanList.filter((p: any) => p.status === 'draft' || p.status === 'dokumen_lengkap' || p.status === 'proses_analisis' || p.status === 'selesai_skoring').length;
  const totalNominal = pengajuanList.reduce((s: number, p: any) => s + (p.pokokPinjaman || 0), 0);
  const totalDicairkan = pengajuanList.filter((p: any) => p.status === 'dicairkan').reduce((s: number, p: any) => s + (p.pokokPinjaman || 0), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.perusahaanId || !form.pokokPinjaman || !form.tenorBulan) return;
    await createPengajuan(form);
    setShowCreate(false);
    setForm({ perusahaanId: '', pokokPinjaman: 50000000, tenorBulan: 12, tujuan: '', bungaPersen: 1.5 });
  };

  const handleRunAI = async (id: string) => {
    setAiLoading(true);
    try {
      const result = await runAIScoring(id);
      if (detail?.id === id) setDetail((prev: any) => ({ ...prev, ...result, skorAkhir: result?.skorAkhir ?? prev?.skorAkhir, hasilAnalisis: result?.hasilAnalisis ?? prev?.hasilAnalisis }));
    } catch (err) { alert('Gagal menjalankan AI Scoring.'); }
    setAiLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatusPengajuan(id, status);
    if (detail?.id === id) setDetail((prev: any) => ({ ...prev, status }));
  };

  const getDokumenByKelompok = (kelompok: string) =>
    (detail?.dokumen || []).filter((d: any) => d.kelompok === kelompok);

  const getTemplateByKelompok = (kelompok: string) =>
    dokumenTemplates.filter((t: any) => t.kelompok === kelompok);

  const dokumenKelompokList = ['LEGALITAS', 'KEUANGAN', 'AGUNAN', 'TATA_KELOLA'];

  const getPerusahaanDetail = (id: string) => perusahaan.find((p: any) => p.id === id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm text-white space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Pengajuan</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black">{total}</div>
          <p className="text-[10px] text-slate-400">Seluruh pengajuan pembiayaan ventura</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Jumlah LAYAK</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{countLayak}</div>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold inline-block">Kredit layak disalurkan</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>TIDAK LAYAK</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{countTidakLayak}</div>
          <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-semibold inline-block">Ditolak / Tidak layak</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Nominal</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-slate-800">{formatIDR(totalNominal)}</div>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold inline-block">{formatIDR(totalDicairkan)} sudah dicairkan</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex flex-1 w-full gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari No. Pengajuan atau Perusahaan..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white transition-all" />
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> Pengajuan Baru
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" /> Daftar Pengajuan Pembiayaan Ventura
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
                    <ShieldIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">Belum ada data pengajuan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">No. Pengajuan</th>
                  <th className="p-4">Perusahaan</th>
                  <th className="p-4 text-right">Pokok Pinjaman</th>
                  <th className="p-4 text-center">Tenor</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Skor</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition cursor-pointer" onClick={() => setDetail(p)}>
                    <td className="p-4 font-mono font-bold text-slate-800">{p.noPengajuan || '—'}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{p.perusahaanNama || '-'}</div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatIDR(p.pokokPinjaman || 0)}</td>
                    <td className="p-4 text-center font-mono text-slate-600">{p.tenorBulan || 0} bln</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${STATUS_STYLES[p.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.skorAkhir != null ? (
                        <span className={`font-extrabold text-sm ${p.skorAkhir >= 80 ? 'text-emerald-600' : p.skorAkhir >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {p.skorAkhir}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setDetail(p); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 border border-slate-300 rounded font-semibold text-[10px] cursor-pointer inline-flex items-center gap-1 transition">
                        <FileText className="w-3 h-3" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400" /> Pengajuan Pembiayaan Baru</h3>
              <button onClick={() => setShowCreate(false)} className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Perusahaan *</label>
                <select required value={form.perusahaanId} onChange={e => setForm(f => ({ ...f, perusahaanId: e.target.value }))} className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800">
                  <option value="">Pilih Perusahaan</option>
                  {perusahaan.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.nama || '-'}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Pokok Pinjaman (IDR) *</label>
                <input type="number" required min={1000000} value={form.pokokPinjaman} onChange={e => setForm(f => ({ ...f, pokokPinjaman: Number(e.target.value) }))} className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono font-bold" />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tenor (Bulan) *</label>
                <input type="number" required min={1} max={60} value={form.tenorBulan} onChange={e => setForm(f => ({ ...f, tenorBulan: Number(e.target.value) }))} className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Bunga (% per bulan)</label>
                <input type="number" step="0.1" min={0} value={form.bungaPersen} onChange={e => setForm(f => ({ ...f, bungaPersen: Number(e.target.value) }))} className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tujuan Pembiayaan</label>
                <textarea rows={3} value={form.tujuan} onChange={e => setForm(f => ({ ...f, tujuan: e.target.value }))} className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white text-slate-800" placeholder="Deskripsi tujuan penggunaan dana..." />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold text-xs">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm">Simpan Pengajuan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white shrink-0">
              <div>
                <h3 className="font-extrabold text-sm">{detail.perusahaanNama || 'Detail Pengajuan'}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{detail.noPengajuan || '—'}</p>
              </div>
              <button onClick={() => setDetail(null)} className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Pokok Pinjaman</span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-blue-600" />{formatIDR(detail.pokokPinjaman || 0)}</div>
                </div>
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Tenor</span>
                  <div className="font-extrabold text-slate-800 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" />{detail.tenorBulan || 0} Bulan</div>
                </div>
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Bunga</span>
                  <div className="font-extrabold text-slate-800 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-amber-500" />{detail.bungaPersen || 0}% / bln</div>
                </div>
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border mt-1 ${STATUS_STYLES[detail.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {STATUS_LABEL[detail.status] || detail.status}
                  </span>
                </div>
              </div>

              {detail.tanggalPengajuan && (
                <div className="flex items-center gap-4 text-[10px] text-slate-500 border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Diajukan: {detail.tanggalPengajuan}</span>
                  {detail.tanggalAnalisis && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> Analisis AI: {detail.tanggalAnalisis}</span>}
                </div>
              )}

              {detail.tujuan && (
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Tujuan Pembiayaan</span>
                  <p className="text-slate-700 text-xs italic">&quot;{detail.tujuan}&quot;</p>
                </div>
              )}

              {getPerusahaanDetail(detail.perusahaanId) && (
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Informasi Perusahaan</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Sektor:</span> <span className="font-semibold text-slate-700">{getPerusahaanDetail(detail.perusahaanId)?.sektorIndustri || '-'}</span></div>
                    <div><span className="text-slate-400">Direktur:</span> <span className="font-semibold text-slate-700">{getPerusahaanDetail(detail.perusahaanId)?.namaDirektur || '-'}</span></div>
                    <div><span className="text-slate-400">Kota:</span> <span className="font-semibold text-slate-700">{getPerusahaanDetail(detail.perusahaanId)?.kota || '-'}</span></div>
                    <div><span className="text-slate-400">Status:</span> <span className="font-semibold text-slate-700">{getPerusahaanDetail(detail.perusahaanId)?.status || '-'}</span></div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-extrabold text-slate-800 text-sm">Dokumen Checklist</span>
                </div>
                <div className="flex gap-1 border-b border-slate-200 pb-2">
                  {dokumenKelompokList.map(k => (
                    <button key={k} onClick={() => setActiveTab(k)} className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold transition ${activeTab === k ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {k}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {getDokumenByKelompok(activeTab).length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-slate-400 text-[11px] mb-3">Belum ada dokumen untuk kelompok {activeTab}.</p>
                      {getTemplateByKelompok(activeTab).length > 0 && (
                        <div className="space-y-1.5 max-w-md mx-auto">
                          <p className="text-[10px] font-semibold text-slate-500">Template dokumen yang diperlukan:</p>
                          {getTemplateByKelompok(activeTab).map((t: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-dashed border-slate-200">
                              <FileCheck className="w-3 h-3 text-slate-300 shrink-0" />
                              <span>{t.nama}</span>
                              {t.basisHukum && <span className="text-[8px] text-slate-400 italic">({t.basisHukum})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    getDokumenByKelompok(activeTab).map((d: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <span className="font-semibold text-slate-700">{d.nama}</span>
                            {d.basisHukum && <span className="text-[9px] text-slate-400 ml-2 italic">({d.basisHukum})</span>}
                          </div>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          d.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          d.status === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' :
                          d.status === 'terupload' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {d.status === 'valid' ? 'Valid' : d.status === 'invalid' ? 'Invalid' : d.status === 'terupload' ? 'Terupload' : 'Belum'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {detail.skorAkhir != null && detail.hasilAnalisis && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="font-extrabold text-slate-800 text-sm">AI Scoring — 5C Credit Analysis</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['character', 'capacity', 'capital', 'collateral', 'condition'].map(c => {
                      const val = detail.hasilAnalisis?.[`skor${c.charAt(0).toUpperCase() + c.slice(1)}`] ?? detail.hasilAnalisis?.[c];
                      const score = typeof val === 'number' ? val : 0;
                      return (
                        <div key={c} className="border border-slate-100 p-3 rounded-lg bg-white shadow-sm space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700 capitalize text-[11px]">{c}</span>
                            <span className={`font-extrabold text-xs ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{score}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Total Skor</span>
                      <div className="text-2xl font-black text-slate-900">{detail.skorAkhir}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Rekomendasi</span>
                      <div className={`font-extrabold text-sm ${detail.skorAkhir >= 80 ? 'text-emerald-600' : detail.skorAkhir >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {detail.skorAkhir >= 80 ? 'LAYAK' : detail.skorAkhir >= 60 ? 'Layak Bersyarat' : 'TIDAK LAYAK'}
                      </div>
                    </div>
                  </div>

                  {detail.hasilAnalisis?.rekomendasi && (
                    <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                      <span className="text-slate-400 font-bold uppercase text-[9px] block mb-1">Catatan Rekomendasi</span>
                      <p className="text-slate-700 text-xs italic">{detail.hasilAnalisis.rekomendasi}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => handleRunAI(detail.id)} disabled={aiLoading || detail.status === 'dicairkan' || detail.status === 'ditolak'} className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition cursor-pointer">
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} /> {aiLoading ? 'Menganalisis...' : 'Jalankan AI Scoring'}
                </button>
                {aiLoading && <span className="text-[10px] text-purple-600 animate-pulse font-semibold">Memproses 5C Analysis...</span>}
                <select value="" onChange={e => { const v = e.target.value; if (v) handleStatusChange(detail.id, v); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-700 bg-white focus:outline-none">
                  <option value="">Update Status</option>
                  <option value="draft">Draft</option>
                  <option value="dokumen_lengkap">Dokumen Lengkap</option>
                  <option value="proses_analisis">Proses Analisis</option>
                  <option value="selesai_skoring">Selesai Skoring</option>
                  <option value="layak">LAYAK</option>
                  <option value="layak_bersyarat">Layak Bersyarat</option>
                  <option value="tidak_layak">TIDAK LAYAK</option>
                  <option value="dicairkan">Dicairkan</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
              <button onClick={() => { setDetail(null); setAiLoading(false); }} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] cursor-pointer transition">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
