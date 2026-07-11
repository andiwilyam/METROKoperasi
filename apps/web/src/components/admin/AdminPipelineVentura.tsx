import React, { useState, useMemo } from 'react';
import {
  GitMerge, FileText, TrendingUp, Building2, Award, CheckCircle, XCircle, AlertCircle,
  Search, X, Calendar, DollarSign, User, FileCheck, Sparkles, BarChart3,
  Coins, ArrowRight, ShieldAlert, Eye
} from 'lucide-react';

interface Props {
  pengajuanList: any[];
  ventureInvestments: any[];
  perusahaan: any[];
  fetchPengajuan: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  onConvertToVenture: (pengajuanId: string) => Promise<any>;
  onUploadDokumen?: (pengajuanId: string, dokumenId: string, fileName: string) => any;
  onValidasiDokumen?: (pengajuanId: string, dokumenId: string, status: string) => any;
}

type PipelineTab = 'semua' | 'pengajuan' | 'investasi_aktif' | 'selesai';

type PipelineItem = {
  type: 'pengajuan' | 'venture';
  id: string;
  noRef: string;
  perusahaanNama: string;
  sektor?: string;
  nominal: number;
  status: string;
  tanggal: string;
  skor?: number | null;
  data: any;
};

const PENGAJUAN_STATUS_STYLES: Record<string, string> = {
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

const PENGAJUAN_STATUS_LABEL: Record<string, string> = {
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

const VENTURE_STATUS_STYLES: Record<string, string> = {
  pengajuan: 'bg-amber-50 text-amber-700 border-amber-200',
  disetujui: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  dicairkan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  selesai: 'bg-blue-50 text-blue-700 border-blue-200',
  ditolak: 'bg-red-50 text-red-700 border-red-200',
};

const VENTURE_STATUS_LABEL: Record<string, string> = {
  pengajuan: 'Pengajuan',
  disetujui: 'Disetujui',
  dicairkan: 'Dicairkan',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

const formatIDR = (num: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminPipelineVentura(props: Props) {
  const { pengajuanList, ventureInvestments, perusahaan, fetchPengajuan, fetchInvestments, onConvertToVenture } = props;
  const $up = (props as any).onUploadDokumen;
  const $val = (props as any).onValidasiDokumen;
  const [activeTab, setActiveTab] = useState<PipelineTab>('semua');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<PipelineItem | null>(null);
  const [convertLoading, setConvertLoading] = useState<string | null>(null);

  const mergedPipeline = useMemo<PipelineItem[]>(() => {
    const pengajuan: PipelineItem[] = (pengajuanList || []).map((p: any) => ({
      type: 'pengajuan',
      id: p.id,
      noRef: p.noPengajuan || p.id?.slice(0, 8) || '—',
      perusahaanNama: p.perusahaanNama || '-',
      sektor: p.sektorIndustri,
      nominal: p.pokokPinjaman || 0,
      status: p.status || 'draft',
      tanggal: p.tanggalPengajuan || p.createdAt || '',
      skor: p.skorAkhir ?? null,
      data: p,
    }));

    const venture: PipelineItem[] = (ventureInvestments || []).map((v: any) => ({
      type: 'venture',
      id: v.id,
      noRef: 'VEN-' + (v.id?.slice(0, 8) || '—'),
      perusahaanNama: v.namaPerusahaan || '-',
      sektor: v.sektorIndustri,
      nominal: v.nominalInvestasi || 0,
      status: v.status || 'pengajuan',
      tanggal: v.tanggalInvestasi || v.createdAt || '',
      skor: null,
      data: v,
    }));

    const merged = [...pengajuan, ...venture];
    merged.sort((a, b) => new Date(b.tanggal || 0).getTime() - new Date(a.tanggal || 0).getTime());
    return merged;
  }, [pengajuanList, ventureInvestments]);

  const filtered = useMemo(() => {
    return mergedPipeline.filter((item) => {
      const matchSearch =
        !search ||
        item.noRef.toLowerCase().includes(search.toLowerCase()) ||
        item.perusahaanNama.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      switch (activeTab) {
        case 'pengajuan':
          return item.type === 'pengajuan';
        case 'investasi_aktif':
          return item.type === 'venture' && (item.status === 'dicairkan' || item.status === 'disetujui');
        case 'selesai':
          return item.type === 'venture' && item.status === 'selesai';
        default:
          return true;
      }
    });
  }, [mergedPipeline, search, activeTab]);

  const stats = useMemo(() => {
    const totalPipeline = mergedPipeline.length;
    const totalPengajuan = mergedPipeline.filter((i) => i.type === 'pengajuan').length;
    const totalInvestasi = mergedPipeline.filter(
      (i) => i.type === 'venture' && (i.status === 'dicairkan' || i.status === 'selesai')
    ).length;
    const totalNominal = mergedPipeline.reduce((sum, i) => {
      if (i.type === 'venture' && (i.status === 'dicairkan' || i.status === 'selesai')) {
        return sum + i.nominal;
      }
      if (i.type === 'pengajuan' && (i.status === 'dicairkan' || i.status === 'layak')) {
        return sum + i.nominal;
      }
      return sum;
    }, 0);
    return { totalPipeline, totalPengajuan, totalInvestasi, totalNominal };
  }, [mergedPipeline]);

  const getStatusStyle = (item: PipelineItem) => {
    if (item.type === 'pengajuan') {
      return PENGAJUAN_STATUS_STYLES[item.status] || 'bg-slate-50 text-slate-600 border-slate-200';
    }
    return VENTURE_STATUS_STYLES[item.status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const getStatusLabel = (item: PipelineItem) => {
    if (item.type === 'pengajuan') {
      return PENGAJUAN_STATUS_LABEL[item.status] || item.status;
    }
    return VENTURE_STATUS_LABEL[item.status] || item.status;
  };

  const handleConvert = async (id: string) => {
    setConvertLoading(id);
    try {
      await onConvertToVenture(id);
      await fetchPengajuan();
      await fetchInvestments();
    } catch (err) {
      console.error('Konversi gagal:', err);
    }
    setConvertLoading(null);
  };

  const getIcon = (item: PipelineItem) => {
    if (item.type === 'pengajuan') return <FileText className="w-4 h-4 text-blue-600" />;
    return <TrendingUp className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm text-white space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Pipeline</span>
            <GitMerge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black">{stats.totalPipeline}</div>
          <p className="text-[10px] text-slate-400">Gabungan pengajuan + investasi ventura</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Pengajuan</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalPengajuan}</div>
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold inline-block">Pembiayaan ventura masuk</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Investasi Aktif</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalInvestasi}</div>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold inline-block">Penyertaan modal berjalan</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Nominal</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-slate-800">{formatIDR(stats.totalNominal)}</div>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold inline-block">Total dana tersalur</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="border-b border-slate-200">
          <div className="flex">
            {(['semua', 'pengajuan', 'investasi_aktif', 'selesai'] as PipelineTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700 bg-blue-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab === 'semua' && 'Semua Pipeline'}
                {tab === 'pengajuan' && 'Pengajuan'}
                {tab === 'investasi_aktif' && 'Investasi Aktif'}
                {tab === 'selesai' && 'Selesai'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. Referensi atau Perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">Tidak ada data pipeline yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4"><span className="flex items-center gap-1"><GitMerge className="w-3 h-3" /> Tipe</span></th>
                  <th className="p-4">No. Ref</th>
                  <th className="p-4"><span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> Perusahaan</span></th>
                  <th className="p-4 text-right">Pokok / Nominal</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4 text-center"><span className="flex items-center justify-center gap-1"><Award className="w-3 h-3" /> Skor</span></th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${item.type === 'pengajuan' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                          {getIcon(item)}
                        </span>
                        <span className={`text-[9px] font-bold uppercase ${item.type === 'pengajuan' ? 'text-blue-700' : 'text-emerald-700'}`}>
                          {item.type === 'pengajuan' ? 'Pengajuan' : 'Investasi'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">{item.noRef}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{item.perusahaanNama}</div>
                      {item.sektor && <div className="text-[10px] text-slate-400">{item.sektor}</div>}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatIDR(item.nominal)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(item)}`}>
                        {(item.status === 'selesai' || item.status === 'layak' || item.status === 'dicairkan') && <CheckCircle className="w-3 h-3" />}
                        {(item.status === 'ditolak' || item.status === 'tidak_layak') && <XCircle className="w-3 h-3" />}
                        {getStatusLabel(item)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-[10px] font-mono">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="p-4 text-center">
                      {item.skor != null ? (
                        <span className={`inline-flex items-center gap-1 font-extrabold text-sm ${item.skor >= 80 ? 'text-emerald-600' : item.skor >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {item.skor >= 80 && <Award className="w-3.5 h-3.5" />}
                          {item.skor}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      {item.type === 'pengajuan' && (item.status === 'layak' || item.status === 'layak_bersyarat') && (
                        <button
                          onClick={() => handleConvert(item.id)}
                          disabled={convertLoading === item.id}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-2 py-1 rounded font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
                        >
                          {convertLoading === item.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-3 h-3" />
                              Konversi ke Investasi
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => setDetail(item)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 border border-slate-300 rounded font-semibold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" />
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

      {detail && detail.type === 'pengajuan' && (
        <PengajuanDetailModal
          item={detail}
          perusahaan={perusahaan}
          onClose={() => setDetail(null)}
          onConvert={handleConvert}
          convertLoading={convertLoading}
          onUpload={$up}
          onValidasi={$val}
        />
      )}

      {detail && detail.type === 'venture' && (
        <VentureDetailModal
          item={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}

function PengajuanDetailModal({
  item: _item,
  perusahaan: _perus,
  onClose: _oc,
  onConvert: _ocv,
  convertLoading: _cl,
  onUpload,
  onValidasi,
}: {
  item: any; perusahaan: any[]; onClose: () => void; onConvert: (id: string) => Promise<void>;
  convertLoading: string | null; onUpload?: any; onValidasi?: any;
}) {
  const item = _item; const perusahaan = _perus; const onClose = _oc; const onConvert = _ocv; const convertLoading = _cl;
  const $up = onUpload || (async () => {}); const $val = onValidasi || (async () => {});
  const d = item.data;
  const perusahaanDetail = perusahaan.find((p: any) => p.id === d.perusahaanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white shrink-0">
          <div>
            <h3 className="font-extrabold text-sm">{d.perusahaanNama || 'Detail Pengajuan'}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{d.noPengajuan || '—'}</p>
          </div>
          <button onClick={onClose} className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 text-xs overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Pokok Pinjaman</span>
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-blue-600" />{formatIDR(d.pokokPinjaman || 0)}</div>
            </div>
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Tenor</span>
              <div className="font-extrabold text-slate-800 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" />{d.tenorBulan || 0} Bulan</div>
            </div>
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Bunga</span>
              <div className="font-extrabold text-slate-800 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-amber-500" />{d.bungaPersen || 0}% / bln</div>
            </div>
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Status</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border mt-1 ${PENGAJUAN_STATUS_STYLES[d.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {PENGAJUAN_STATUS_LABEL[d.status] || d.status}
              </span>
            </div>
          </div>

          {d.tanggalPengajuan && (
            <div className="flex items-center gap-4 text-[10px] text-slate-500 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Diajukan: {d.tanggalPengajuan}</span>
              {d.tanggalAnalisis && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> Analisis AI: {d.tanggalAnalisis}</span>}
            </div>
          )}

          {d.tujuan && (
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Tujuan Pembiayaan</span>
              <p className="text-slate-700 text-xs italic">&quot;{d.tujuan}&quot;</p>
            </div>
          )}

          {perusahaanDetail && (
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Informasi Perusahaan</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Sektor:</span> <span className="font-semibold text-slate-700">{perusahaanDetail.sektorIndustri || '-'}</span></div>
                <div><span className="text-slate-400">Direktur:</span> <span className="font-semibold text-slate-700">{perusahaanDetail.namaDirektur || '-'}</span></div>
                <div><span className="text-slate-400">Kota:</span> <span className="font-semibold text-slate-700">{perusahaanDetail.kota || '-'}</span></div>
                <div><span className="text-slate-400">Status:</span> <span className="font-semibold text-slate-700">{perusahaanDetail.status || '-'}</span></div>
              </div>
            </div>
          )}

            {(d.dokumen || []).length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span className="font-extrabold text-slate-800 text-sm">Dokumen Checklist</span>
                      <span className="text-[10px] text-slate-400 ml-auto">
                        {d.dokumen.filter((x: any) => x.status === 'valid' || x.status === 'terupload').length}/{d.dokumen.length} Terupload
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {d.dokumen.map((doc: any, i: number) => (
                        <div key={doc.id || i} className="flex items-center justify-between border rounded-lg px-3 py-2 text-[11px]">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-700 truncate" title={doc.deskripsi || ''}>{doc.namaDokumen || doc.nama_dokumen}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              doc.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              doc.status === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' :
                              doc.status === 'terupload' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-slate-50 text-slate-400 border-slate-200'
                            }`}>
                              {doc.status === 'valid' ? 'Valid' : doc.status === 'invalid' ? 'Invalid' : doc.status === 'terupload' ? 'Terupload' : 'Belum'}
                            </span>
                            {(d.type === 'pengajuan' && (d.status === 'draft' || d.status === 'dokumen_lengkap')) && (
                              <>
                                <label className="p-1 hover:bg-blue-50 rounded cursor-pointer" title="Upload Dokumen">
                                  <input type="file" className="hidden" accept=".pdf,.jpg,.png" style={{display:'none'}} onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) $up(d.id, doc.id || doc.id, file.name);
                                  }} />
                                  <FileText className="w-3 h-3 text-blue-500" />
                                </label>
                                {doc.status === 'terupload' && (
                                  <select
                                    className="text-[8px] border rounded px-1 py-0.5"
                                    onChange={(e) => $val(d.id, doc.id || doc.id, e.target.value)}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>Validasi</option>
                                    <option value="valid">✓ Terima</option>
                                    <option value="invalid">✗ Tolak</option>
                                  </select>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

          {d.skorAkhir != null && d.hasilAnalisis && (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="font-extrabold text-slate-800 text-sm">AI Scoring — 5C Credit Analysis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['character', 'capacity', 'capital', 'collateral', 'condition'].map((c) => {
                  const val = d.hasilAnalisis?.[`skor${c.charAt(0).toUpperCase() + c.slice(1)}`] ?? d.hasilAnalisis?.[c];
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
                  <div className="text-2xl font-black text-slate-900">{d.skorAkhir}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Rekomendasi</span>
                  <div className={`font-extrabold text-sm ${d.skorAkhir >= 80 ? 'text-emerald-600' : d.skorAkhir >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {d.skorAkhir >= 80 ? 'LAYAK' : d.skorAkhir >= 60 ? 'Layak Bersyarat' : 'TIDAK LAYAK'}
                  </div>
                </div>
              </div>

              {d.hasilAnalisis?.rekomendasi && (
                <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block mb-1">Catatan Rekomendasi</span>
                  <p className="text-slate-700 text-xs italic">{d.hasilAnalisis.rekomendasi}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            {(d.status === 'layak' || d.status === 'layak_bersyarat') && (
              <button
                onClick={() => onConvert(item.id)}
                disabled={convertLoading === item.id}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 transition cursor-pointer"
              >
                {convertLoading === item.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengonversi...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Konversi ke Investasi Ventura
                  </>
                )}
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer transition">Tutup</button>
        </div>
      </div>
    </div>
  );
}

function VentureDetailModal({
  item,
  onClose,
}: {
  item: PipelineItem;
  onClose: () => void;
}) {
  const v = item.data;
  const totalDividen = (v.dividendHistory || []).reduce((sum: number, d: any) => sum + (d.nominalDividen || 0), 0);
  const roi = v.nominalInvestasi > 0 ? ((totalDividen / v.nominalInvestasi) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white shrink-0">
          <div>
            <h3 className="font-extrabold text-sm">{v.namaPerusahaan || 'Detail Investasi'}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Sektor: {v.sektorIndustri || '—'}</p>
          </div>
          <button onClick={onClose} className="hover:bg-slate-800 p-1 rounded-full text-slate-300 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Founder</span>
              <div className="font-extrabold text-slate-800 flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-600" />{v.namaFounder || '—'}</div>
              {v.kontakFounder && <div className="text-[10px] text-slate-500 font-mono">{v.kontakFounder}</div>}
            </div>
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Penyertaan Modal</span>
              <div className="font-extrabold text-slate-900 text-sm">{formatIDR(v.nominalInvestasi || 0)}</div>
              <div className="text-[10px] text-blue-600 font-semibold">{v.persentaseSaham || 0}% Saham &bull; Tenor {v.tenorTahun || 0} Tahun</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border border-slate-100 p-3 rounded-lg text-center space-y-0.5">
              <span className="text-slate-400 text-[9px] block uppercase font-bold">Estimasi Hasil</span>
              <span className="font-extrabold text-emerald-600">{v.estimasiDividen || 0}%</span>
            </div>
            <div className="border border-slate-100 p-3 rounded-lg text-center space-y-0.5">
              <span className="text-slate-400 text-[9px] block uppercase font-bold">Total Dividen</span>
              <span className="font-extrabold text-emerald-600">{formatIDR(totalDividen)}</span>
            </div>
            <div className="border border-slate-100 p-3 rounded-lg text-center space-y-0.5">
              <span className="text-slate-400 text-[9px] block uppercase font-bold">ROI</span>
              <span className={`font-extrabold ${roi > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>{roi.toFixed(1)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${VENTURE_STATUS_STYLES[v.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
              {VENTURE_STATUS_LABEL[v.status] || v.status}
            </span>
            <span className="text-[10px] text-slate-400 font-mono"><Calendar className="w-3 h-3 inline mr-1" />{v.tanggalInvestasi || '—'}</span>
          </div>

          {v.deskripsiBisnis && (
            <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[9px] block">Deskripsi Bisnis</span>
              <p className="text-slate-700 text-xs italic leading-relaxed">&quot;{v.deskripsiBisnis}&quot;</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Riwayat Pembagian Dividen & Hasil Investasi
              </span>
            </div>

            {(!v.dividendHistory || v.dividendHistory.length === 0) ? (
              <div className="text-center py-6 text-slate-400 text-[11px]">Belum ada dividen yang tercatat.</div>
            ) : (
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[9px] uppercase">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {v.dividendHistory.map((bh: any) => (
                      <tr key={bh.id} className="hover:bg-slate-50 font-mono text-[11px]">
                        <td className="p-3 text-slate-400">{bh.tanggal}</td>
                        <td className="p-3 font-sans text-slate-600">{bh.keterangan}</td>
                        <td className="p-3 text-right font-extrabold text-emerald-600">{formatIDR(bh.nominalDividen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer transition">Tutup Rincian</button>
        </div>
      </div>
    </div>
  );
}
