/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Search, ArrowRightLeft, CheckCircle, XCircle, AlertTriangle,
  Sparkles, FileText, DollarSign, Building2, ChevronRight, ChevronDown, Eye, Trash2, Edit,
  Loader2, Plus, X, Scale, Percent, BarChart3, Calendar
} from 'lucide-react';
import { Perusahaan, VenturaPengajuan } from '../../types';

interface AdminPipelineVenturaProps {
  pipeline: VenturaPengajuan[];
  perusahaan: Perusahaan[];
  fetchPipeline: () => Promise<void>;
  updateStage: (id: string, stage: string) => Promise<void>;
  runAIScoring: (id: string) => Promise<any>;
}

const STAGE_LABEL: Record<string, string> = {
  prospek: 'Prospek Baru',
  kualifikasi: 'Kualifikasi',
  analisis: 'Analisis Kredit',
  komite: 'Komite Kredit',
  disetujui: 'Disetujui',
  dicairkan: 'Dicairkan',
  ditolak: 'Ditolak',
};

const STAGE_STYLE: Record<string, string> = {
  prospek: 'mc-badge-accent',
  kualifikasi: 'mc-badge-accent',
  analisis: 'mc-badge-accent',
  komite: 'mc-badge-accent',
  disetujui: 'mc-badge-ok',
  dicairkan: 'mc-badge-ok',
  ditolak: 'mc-btn-danger',
};

const STAGE_ORDER = ['prospek', 'kualifikasi', 'analisis', 'komite', 'disetujui', 'dicairkan', 'ditolak'];

const formatIDR = (num: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminPipelineVentura({
  pipeline,
  perusahaan,
  fetchPipeline,
  updateStage,
  runAIScoring
}: AdminPipelineVenturaProps) {
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<VenturaPengajuan | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = useMemo(() =>
    pipeline.filter((p) =>
      p.noPengajuan?.toLowerCase().includes(search.toLowerCase()) ||
      p.perusahaanNama?.toLowerCase().includes(search.toLowerCase())
    ), [pipeline, search]
  );

  // Group by stage
  const grouped = useMemo(() => {
    const groups: Record<string, VenturaPengajuan[]> = {};
    STAGE_ORDER.forEach(s => groups[s] = []);
    filtered.forEach(p => {
      if (groups[p.status]) groups[p.status].push(p);
      else groups[p.status] = [p];
    });
    return groups;
  }, [filtered]);

  const totalPipeline = pipeline.reduce((s, p) => s + (p.pokokPinjaman || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <TrendingUp className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            Pipeline Ventura — Funnel Kredit
          </h2>
          <p className="text-[11px] mc-muted">Visualisasi tahapan kredit ventura dari prospek hingga pencairan.</p>
        </div>
        <div className="mc-surface-2 mc-border px-4 py-2 rounded-lg mc-muted text-xs font-semibold">
          Total Pipeline: <span className="font-mono mc-ink-strong ml-2">{formatIDR(totalPipeline)}</span>
        </div>
      </div>

      {/* Search */}
      <div className="mc-card p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 mc-muted" />
          <input
            type="text"
            placeholder="Cari pengajuan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs mc-border mc-surface-2 rounded-lg mc-focus focus:ring-[var(--mc-accent)]"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {STAGE_ORDER.map((stage) => {
          const items = grouped[stage] || [];
          const nominal = items.reduce((s, p) => s + (p.pokokPinjaman || 0), 0);
          const isFinal = ['disetujui', 'dicairkan', 'ditolak'].includes(stage);
          
          return (
            <div key={stage} className={`mc-card flex flex-col min-h-[500px] ${isFinal ? 'ring-1' : ''}`} style={{ borderColor: isFinal ? (stage === 'ditolak' ? 'var(--mc-error)' : 'var(--mc-success)') : 'var(--mc-border)' }}>
              <div className="p-3 mc-border flex items-center justify-between" style={{ background: 'var(--mc-surface-2)' }}>
                <h3 className="font-bold mc-ink-strong text-xs uppercase tracking-wider">{STAGE_LABEL[stage]}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${STAGE_STYLE[stage]}`}>
                  {items.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: '400px' }}>
                {items.length === 0 ? (
                  <div className="text-center text-[11px] mc-muted py-8">
                    <div className="w-8 h-8 mc-border rounded-full flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-4 h-4" />
                    </div>
                    Kosong
                  </div>
                ) : (
                  items.map((p) => (
                    <div
                      key={p.id}
                      className="mc-surface-2 mc-border p-3 rounded-lg cursor-pointer hover:mc-surface/80 hover:shadow-sm transition"
                      onClick={() => setDetail(p)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold mc-muted text-[11px]">{p.noPengajuan || '—'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${STAGE_STYLE[stage]}`}>
                          {STAGE_LABEL[stage]}
                        </span>
                      </div>
                      <p className="font-semibold mc-ink-strong text-[12px] truncate">{p.perusahaanNama || '-'}</p>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className="mc-muted font-mono">{formatIDR(p.pokokPinjaman || 0)}</span>
                        {p.skorAkhir != null && (
                          <span className={`font-bold ${p.skorAkhir >= 80 ? 'mc-badge-ok' : p.skorAkhir >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`}>
                            {p.skorAkhir}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 mc-border text-right">
                <span className="font-bold mc-ink-strong text-xs font-mono">{formatIDR(nominal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 mc-border flex justify-between items-center shrink-0" style={{ background: 'var(--mc-primary)', borderColor: 'var(--mc-border)' }}>
              <div>
                <h3 className="font-extrabold text-sm text-white">{detail.perusahaanNama || 'Detail Pipeline'}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{detail.noPengajuan || '—'}</p>
              </div>
              <button onClick={() => setDetail(null)} className="hover:mc-surface-2/30 p-1 rounded-lg text-slate-300 hover:text-white transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="mc-surface-2 mc-border p-3 rounded-lg">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Pokok Pinjaman</span>
                  <div className="font-extrabold mc-ink-strong flex items-center gap-1">
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
                  <span className="mc-muted font-bold uppercase text-[9px] block">Tahap Saat Ini</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border mt-1 ${STAGE_STYLE[detail.status] || 'mc-muted'}`}>
                    {STAGE_LABEL[detail.status] || detail.status}
                  </span>
                </div>
              </div>

              {detail.tujuan && (
                <div className="mc-surface-2 mc-border p-3 rounded-lg space-y-1">
                  <span className="mc-muted font-bold uppercase text-[9px] block">Tujuan</span>
                  <p className="mc-ink text-xs italic">"{detail.tujuan}"</p>
                </div>
              )}

              {detail.skorAkhir != null && detail.hasilAnalisis && (
                <div className="space-y-3 mc-border pt-4">
                  <div className="flex items-center gap-2 mc-border pb-2">
                    <BarChart3 className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                    <span className="font-extrabold mc-ink-strong text-sm">AI Scoring — 5C Analysis</span>
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

              <div className="flex gap-2 pt-4 mc-border">
                <button
                  onClick={() => handleRunAI(detail.id)}
                  disabled={aiLoading || detail.status === 'dicairkan' || detail.status === 'ditolak'}
                  className="flex-1 mc-btn-primary disabled:opacity-40 px-3 py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} /> {aiLoading ? 'Menganalisis...' : 'Jalankan AI Scoring'}
                </button>
                <select value="" onChange={e => { const v = e.target.value; if (v) handleUpdateStage(detail.id, v); }} className="flex-1 mc-border mc-surface-2 rounded-lg px-2 py-2 text-[10px] font-semibold mc-ink mc-focus focus:ring-[var(--mc-accent)]">
                  <option value="">Update Tahap</option>
                  {STAGE_ORDER.map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <script>
        {`window.handleRunAI = async (id) => {
          const { runAIScoring } = await import('../../services/ventura');
          await runAIScoring(id);
        };
        window.handleUpdateStage = async (id, stage) => {
          const { updateStage } = await import('../../services/ventura');
          await updateStage(id, stage);
        };`}
      </script>
    </div>
  );
}