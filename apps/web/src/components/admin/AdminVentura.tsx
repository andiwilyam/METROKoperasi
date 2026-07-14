/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Search, Plus, Calendar, Coins, Percent, AlertCircle, X, Check,
  Trash2, Edit, CheckCircle, FileText, Info, AlertTriangle, RefreshCw,
  BarChart3, Sparkles, DollarSign, Scale, TrendingUp, User, Award
} from 'lucide-react';
import { Anggota } from '@metrocoop/shared/types';

interface AdminVenturaProps {
  investments: any[];
  onAddInvestment: (newInv: any) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onRecordBagiHasil: (investmentId: string, item: any) => void;
  onUpdateInvestment: (id: string, data: any) => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'mc-badge-accent',
  dokumen_lengkap: 'mc-badge-accent',
  proses_analisis: 'mc-badge-accent',
  selesai_skoring: 'mc-badge-accent',
  layak: 'mc-badge-ok',
  layak_bersyarat: 'mc-badge-accent',
  tidak_layak: 'mc-btn-danger',
  dicairkan: 'mc-badge-ok',
  ditolak: 'mc-btn-danger',
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

export default function AdminVentura({
  pengajuanList,
  perusahaan,
  members,
  fetchPengajuan,
  createPengajuan,
  updateStatusPengajuan,
  runAIScoring,
  fetchDokumenTemplates
}: AdminVenturaProps) {
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<VenturaPengajuan | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [dokumenTemplates, setDokumenTemplates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('LEGALITAS');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ 
    perusahaanId: '', 
    pokokPinjaman: 50000000, 
    tenorBulan: 12, 
    tujuan: '', 
    bungaPersen: 1.5 
  });

  useEffect(() => {
    fetchDokumenTemplates().then(setDokumenTemplates).catch(() => {});
  }, []);

  const filtered = useMemo(() => 
    pengajuanList.filter((p) =>
      p.noPengajuan?.toLowerCase().includes(search.toLowerCase()) ||
      p.perusahaanNama?.toLowerCase().includes(search.toLowerCase())
    ), [pengajuanList, search]
  );

  const total = pengajuanList.length;
  const countLayak = pengajuanList.filter((p) => p.status === 'layak').length;
  const countTidakLayak = pengajuanList.filter((p) => p.status === 'tidak_layak' || p.status === 'ditolak').length;
  const countPending = pengajuanList.filter((p) => ['draft', 'dokumen_lengkap', 'proses_analisis', 'selesai_skoring'].includes(p.status)).length;
  const totalNominal = pengajuanList.reduce((s, p) => s + (p.pokokPinjaman || 0), 0);
  const totalDicairkan = pengajuanList.filter((p) => p.status === 'dicairkan').reduce((s, p) => s + (p.pokokPinjaman || 0), 0);

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
      
      {/* 1. DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-primary)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Pengajuan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{total}</div>
            <p className="text-[10px] mc-muted">Seluruh pengajuan pembiayaan ventura</p>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-success)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Jumlah LAYAK</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{countLayak}</div>
            <span className="text-[10px] font-semibold mc-badge-ok px-2 py-0.5 rounded inline-block mt-1">Kredit layak disalurkan</span>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-error)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-btn-danger rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-error)', borderColor: 'var(--mc-error)' }}>
            <X className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">TIDAK LAYAK</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{countTidakLayak}</div>
            <span className="text-[10px] font-semibold mc-btn-danger px-2 py-0.5 rounded inline-block mt-1">Ditolak / Tidak layak</span>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-accent)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Nominal</div>
            <div className="text-xl font-black mc-ink-strong mt-1 font-mono">{formatIDR(totalNominal)}</div>
            <span className="text-[10px] mc-badge-accent px-2 py-0.5 rounded inline-block mt-1">{formatIDR(totalDicairkan)} sudah dicairkan</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & ACTION BAR */}
      <div className="mc-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 w-full gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 mc-muted" />
            <input
              type="text"
              placeholder="Cari No. Pengajuan atau Perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs mc-border mc-surface-2 rounded-lg mc-focus focus:ring-[var(--mc-accent)]"
            />
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-full sm:w-auto mc-btn-primary px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Pengajuan Baru
        </button>
      </div>

      {/* 3. PENGAJUAN TABLE */}
      <div className="mc-card overflow-hidden">
        <div className="p-4 mc-border font-bold mc-ink-strong text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
          Daftar Pengajuan & Pembiayaan Ventura
        </div>
        
        {filtered.length === 0 ? (
          <div className="text-center py-16 mc-muted text-xs">
            <ShieldCheck className="w-10 h-10 mx-auto mc-muted" />
            <p className="text-xs mt-2">Belum ada data pengajuan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                  <th className="p-4">No Pengajuan</th>
                  <th className="p-4">Perusahaan</th>
                  <th className="p-4 text-right">Pokok Pinjaman</th>
                  <th className="p-4 text-center">Tenor</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Skor</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y mc-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:mc-surface-2/50 cursor-pointer" onClick={() => setDetail(p)}>
                    <td className="p-4 font-mono font-bold mc-muted">{p.noPengajuan || '—'}</td>
                    <td className="p-4">
                      <div className="font-bold mc-ink-strong">{p.perusahaanNama || '-'}</div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold mc-ink-strong">{formatIDR(p.pokokPinjaman || 0)}</td>
                    <td className="p-4 text-center font-mono mc-muted">{p.tenorBulan || 0} bln</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${STATUS_STYLES[p.status] || 'mc-muted'}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.skorAkhir != null ? (
                        <span className={`font-extrabold text-sm ${p.skorAkhir >= 80 ? 'mc-badge-ok' : p.skorAkhir >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`}>
                          {p.skorAkhir}
                        </span>
                      ) : (
                        <span className="mc-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDetail(p); }}
                        className="mc-surface-2 mc-border mc-ink px-2 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 mc-border flex justify-between items-center" style={{ background: 'var(--mc-primary)', borderColor: 'var(--mc-border)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Plus className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-accent)' }} />
                Pengajuan Pembiayaan Baru
              </h3>
              <button 
                onClick={() => setShowCreate(false)}
                className="hover:mc-surface-2/30 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Perusahaan *</label>
                <select
                  required
                  value={form.perusahaanId}
                  onChange={(e) => setForm(f => ({ ...f, perusahaanId: e.target.value }))}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong"
                >
                  <option value="">Pilih Perusahaan</option>
                  {perusahaan.map((pr: any) => <option key={pr.id} value={pr.id}>{pr.nama || '-'}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Pokok Pinjaman (IDR) *</label>
                <input
                  type="number"
                  required
                  min={1000000}
                  value={form.pokokPinjaman}
                  onChange={(e) => setForm(f => ({ ...f, pokokPinjaman: Number(e.target.value) }))}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-lg mc-focus focus:ring-[var(--mc-accent)] font-mono font-bold mc-ink-strong"
                />
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Tenor (Bulan) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={60}
                  value={form.tenorBulan}
                  onChange={(e) => setForm(f => ({ ...f, tenorBulan: Number(e.target.value) }))}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-lg mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong"
                />
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Bunga (% per bulan)</label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={form.bungaPersen}
                  onChange={(e) => setForm(f => ({ ...f, bungaPersen: Number(e.target.value) }))}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-lg mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong"
                />
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Tujuan Pembiayaan</label>
                <textarea
                  rows={3}
                  value={form.tujuan}
                  onChange={(e) => setForm(f => ({ ...f, tujuan: e.target.value }))}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-ink"
                  placeholder="Deskripsi tujuan penggunaan dana..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 mc-border">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 mc-surface-2 mc-border mc-ink font-bold rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 mc-btn-primary font-bold rounded shadow-sm"
                >
                  Simpan Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DETAIL MODAL */}
      {detail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 mc-border flex justify-between items-center shrink-0" style={{ background: 'var(--mc-primary)', borderColor: 'var(--mc-border)' }}>
              <div>
                <h3 className="font-extrabold text-sm text-white">{detail.perusahaanNama || 'Detail Pengajuan'}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{detail.noPengajuan || '—'}</p>
              </div>
              <button onClick={() => setDetail(null)} className="hover:mc-surface-2/30 p-1 rounded-lg text-slate-300 hover:text-white transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="mc-surface-2 mc-border p-3 rounded-lg">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Pokok Pinjaman</span>
                  <div className="font-extrabold mc-ink-strong text-sm flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                    {formatIDR(detail.pokokPinjaman || 0)}
                  </div>
                </div>
                <div className="mc-surface-2 mc-border p-3 rounded-lg">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Tenor</span>
                  <div className="font-extrabold mc-ink-strong flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                    {detail.tenorBulan || 0} Bulan
                  </div>
                </div>
                <div className="mc-surface-2 mc-border p-3 rounded-lg">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Bunga</span>
                  <div className="font-extrabold mc-ink-strong flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 mc-icon-accent" style={{ color: 'var(--mc-accent)' }} />
                    {detail.bungaPersen || 0}% / bln
                  </div>
                </div>
                <div className="mc-surface-2 mc-border p-3 rounded-lg">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border mt-1 ${STATUS_STYLES[detail.status] || 'mc-muted'}`}>
                    {STATUS_LABEL[detail.status] || detail.status}
                  </span>
                </div>
              </div>

              {detail.tanggalPengajuan && (
                <div className="flex items-center gap-4 text-[10px] mc-muted mc-border pb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Diajukan: {detail.tanggalPengajuan}</span>
                  {detail.tanggalAnalisis && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 mc-icon-accent" style={{ color: 'var(--mc-accent)' }} /> Analisis AI: {detail.tanggalAnalisis}</span>}
                </div>
              )}

              {detail.tujuan && (
                <div className="mc-surface-2 mc-border p-3 rounded-lg space-y-1">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Tujuan Pembiayaan</span>
                  <p className="mc-ink text-xs italic">"{detail.tujuan}"</p>
                </div>
              )}

              {getPerusahaanDetail(detail.perusahaanId) && (
                <div className="mc-surface-2 mc-border p-3 rounded-lg space-y-1">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Informasi Perusahaan</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="mc-muted">Sektor:</span> <span className="font-semibold mc-ink">{getPerusahaanDetail(detail.perusahaanId)?.sektorIndustri || '-'}</span></div>
                    <div><span className="mc-muted">Direktur:</span> <span className="font-semibold mc-ink">{getPerusahaanDetail(detail.perusahaanId)?.namaDirektur || '-'}</span></div>
                    <div><span className="mc-muted">Kota:</span> <span className="font-semibold mc-ink">{getPerusahaanDetail(detail.perusahaanId)?.kota || '-'}</span></div>
                    <div><span className="mc-muted">Status:</span> <span className="font-semibold mc-ink">{getPerusahaanDetail(detail.perusahaanId)?.status || '-'}</span></div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 mc-border pb-2">
                  <FileText className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                  <span className="font-extrabold mc-ink-strong text-sm">Dokumen Checklist</span>
                </div>
                <div className="flex gap-1 mc-border pb-2">
                  {dokumenKelompokList.map(k => (
                    <button key={k} onClick={() => setActiveTab(k)} className={`px-3 py-1.5 rounded-t-lg text-[10px] font-bold transition ${activeTab === k ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`}>
                      {k}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {getDokumenByKelompok(activeTab).length === 0 ? (
                    <div className="text-center py-6">
                      <p className="mc-muted text-[11px] mb-3">Belum ada dokumen untuk kelompok {activeTab}.</p>
                      {getTemplateByKelompok(activeTab).length > 0 && (
                        <div className="space-y-1.5 max-w-md mx-auto">
                          <p className="text-[10px] font-semibold mc-muted">Template dokumen yang diperlukan:</p>
                          {getTemplateByKelompok(activeTab).map((t: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] mc-muted mc-surface-2 mc-border px-3 py-1.5 rounded-lg border-dashed">
                              <FileText className="w-3 h-3 mc-muted" />
                              <span>{t.nama}</span>
                              {t.basisHukum && <span className="text-[8px] mc-muted italic">({t.basisHukum})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    getDokumenByKelompok(activeTab).map((d: any, i: number) => (
                      <div key={i} className="flex items-center justify-between mc-surface-2 mc-border p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 mc-muted" />
                          <div>
                            <span className="font-semibold mc-ink">{d.nama}</span>
                            {d.basisHukum && <span className="text-[9px] mc-muted ml-2 italic">({d.basisHukum})</span>}
                          </div>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          d.status === 'valid' ? 'mc-badge-ok' :
                          d.status === 'invalid' ? 'mc-btn-danger' :
                          d.status === 'terupload' ? 'mc-badge-accent' :
                          'mc-muted'
                        }`}>
                          {d.status === 'valid' ? 'Valid' : d.status === 'invalid' ? 'Invalid' : d.status === 'terupload' ? 'Terupload' : 'Belum'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {detail.skorAkhir != null && detail.hasilAnalisis && (
                <div className="space-y-3 mc-border pt-4">
                  <div className="flex items-center gap-2 mc-border pb-2">
                    <BarChart3 className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                    <span className="font-extrabold mc-ink-strong text-sm">AI Scoring — 5C Credit Analysis</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['character', 'capacity', 'capital', 'collateral', 'condition'].map(c => {
                      const val = detail.hasilAnalisis?.[`skor${c.charAt(0).toUpperCase() + c.slice(1)}`] ?? detail.hasilAnalisis?.[c];
                      const score = typeof val === 'number' ? val : 0;
                      return (
                        <div key={c} className="mc-surface-2 mc-border p-3 rounded-lg space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold mc-ink capitalize text-[11px]">{c}</span>
                            <span className={`font-extrabold text-xs ${score >= 80 ? 'mc-badge-ok' : score >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`}>{score}</span>
                          </div>
                          <div className="w-full h-2 mc-surface rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${score >= 80 ? 'mc-badge-ok' : score >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`} style={{ width: `${score}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mc-surface-2 mc-border p-4 rounded-xl flex items-center justify-between" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
                    <div>
                      <span className="text-[10px] font-bold mc-badge-accent uppercase tracking-wider">Total Skor</span>
                      <div className="text-2xl font-black mc-ink-strong">{detail.skorAkhir}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold mc-badge-accent uppercase tracking-wider">Rekomendasi</span>
                      <div className={`font-extrabold text-sm ${detail.skorAkhir >= 80 ? 'mc-badge-ok' : detail.skorAkhir >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`}>
                        {detail.skorAkhir >= 80 ? 'LAYAK' : detail.skorAkhir >= 60 ? 'Layak Bersyarat' : 'TIDAK LAYAK'}
                      </div>
                    </div>
                  </div>

                  {detail.hasilAnalisis?.rekomendasi && (
                    <div className="mc-surface-2 mc-border p-3 rounded-lg">
                      <span className="mc-muted font-bold uppercase text-[9px] block mb-1">Catatan Rekomendasi</span>
                      <p className="mc-ink text-xs italic">{detail.hasilAnalisis.rekomendasi}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 mc-border flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAI(detail.id)}
                  disabled={aiLoading || detail.status === 'dicairkan' || detail.status === 'ditolak'}
                  className="mc-btn-primary disabled:opacity-40 px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} /> {aiLoading ? 'Menganalisis...' : 'Jalankan AI Scoring'}
                </button>
                {aiLoading && <span className="text-[10px] mc-badge-accent animate-pulse font-semibold">Memproses 5C Analysis...</span>}
                <select value="" onChange={e => { const v = e.target.value; if (v) handleStatusChange(detail.id, v); }} className="mc-border mc-surface-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold mc-ink mc-focus focus:ring-[var(--mc-accent)]">
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
              <button onClick={() => { setDetail(null); setAiLoading(false); }} className="px-4 py-1.5 mc-surface mc-border mc-ink rounded-lg font-bold text-[10px] cursor-pointer transition">Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}