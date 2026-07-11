import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, XCircle, AlertCircle, ChevronRight, FileCheck, Clock, Search } from 'lucide-react';

interface Props {
  pengajuanList: any[];
  session: any;
  uploadDokumenPengajuan?: (pengajuanId: string, dokumenId: string, fileName: string) => Promise<void>;
}

export default function MemberUploadDokumen({ pengajuanList, session, uploadDokumenPengajuan }: Props) {
  const myPengajuan = (pengajuanList || []).filter(
    (p: any) => p.createdBy === session?.id || p.anggotaId === session?.memberId
  );
  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const openDetail = async (p: any) => {
    setSelected(p);
    try {
      const res = await fetch(`/api/data/pengajuan/${p.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setDetail(data);
    } catch { setDetail({ ...p, dokumen: [] }); }
  };

  const handleUpload = async (dokumenId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png,.jpeg';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file || !selected) return;
      setUploading(dokumenId);
      if (uploadDokumenPengajuan) await uploadDokumenPengajuan(selected.id, dokumenId, file.name);
      await openDetail(selected);
      setUploading(null);
    };
    input.click();
  };

  const filtered = myPengajuan.filter((p: any) =>
    (p.no_pengajuan || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.perusahaan_nama || '').toLowerCase().includes(search.toLowerCase())
  );

  const dokumenKelompok = ['LEGALITAS', 'KEUANGAN', 'AGUNAN', 'TATA_KELOLA'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-purple-100">Portal Anggota</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Upload Dokumen Persyaratan Pembiayaan</h1>
        <p className="text-xs text-slate-300 mt-1">Lengkapi dokumen pengajuan Anda untuk diproses lebih lanjut oleh tim analis kredit.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengajuan..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs" />
      </div>

      {/* List */}
      {!selected && (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white border rounded-xl p-8 text-center text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Belum ada pengajuan pembiayaan. Silakan ajukan melalui menu Ventura.
            </div>
          )}
          {filtered.map((p: any) => {
            const dokCount = detail?.id === p.id ? (detail.dokumen || []).filter((d: any) => d.status === 'terupload' || d.status === 'valid').length : 0;
            const totalDocs = detail?.id === p.id ? (detail.dokumen || []).length : 22;
            return (
              <div key={p.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => openDetail(p)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{p.no_pengajuan}</div>
                    <div className="text-[10px] text-slate-400">{p.perusahaan_nama || 'Perusahaan'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      p.status_pengajuan === 'layak' || p.status_pengajuan === 'dicairkan' ? 'bg-emerald-100 text-emerald-700' :
                      p.status_pengajuan === 'draft' || p.status_pengajuan === 'dokumen_lengkap' ? 'bg-amber-100 text-amber-700' :
                      p.status_pengajuan === 'tidak_layak' || p.status_pengajuan === 'ditolak' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{p.status_pengajuan}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Pokok: Rp {p.pokok_pengajuan?.toLocaleString('id-ID')} | Tenor: {p.tenor_bulan} bln
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60" onClick={() => { setSelected(null); setDetail(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{selected.no_pengajuan}</h3>
                <p className="text-[10px] text-slate-400">{selected.perusahaan_nama || '-'}</p>
              </div>
              <button onClick={() => { setSelected(null); setDetail(null); }} className="p-1 hover:bg-slate-100 rounded"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3 text-xs mb-4">
              <div className="border rounded-lg p-2"><span className="text-slate-400">Pokok</span><p className="font-bold">Rp {(selected.pokok_pengajuan || 0).toLocaleString('id-ID')}</p></div>
              <div className="border rounded-lg p-2"><span className="text-slate-400">Tenor</span><p className="font-bold">{selected.tenor_bulan} bulan</p></div>
              <div className="border rounded-lg p-2"><span className="text-slate-400">Status</span><p className="font-bold text-blue-600">{selected.status_pengajuan}</p></div>
            </div>

            {/* Dokumen Checklist */}
            {detail && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b font-bold text-slate-700 text-xs flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Dokumen Persyaratan
                  {detail.dokumen && (
                    <span className="text-[10px] text-slate-400 font-normal ml-auto">
                      {(detail.dokumen || []).filter((d: any) => d.status === 'terupload' || d.status === 'valid').length}/{detail.dokumen.length}
                    </span>
                  )}
                </div>
                {(!detail.dokumen || detail.dokumen.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 text-xs">Detail dokumen tidak tersedia.</div>
                ) : (
                  dokumenKelompok.map(kel => {
                    const docs = detail.dokumen.filter((d: any) => d.kelompok === kel);
                    if (docs.length === 0) return null;
                    const uploaded = docs.filter((d: any) => d.status === 'terupload' || d.status === 'valid').length;
                    return (
                      <div key={kel} className="border-b last:border-0">
                        <div className="px-4 py-2 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>{kel} ({uploaded}/{docs.length})</span>
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(uploaded/docs.length)*100}%` }} />
                          </div>
                        </div>
                        {docs.map((doc: any) => (
                          <div key={doc.id} className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 text-[11px]">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-700 truncate">{doc.namaDokumen || doc.nama_dokumen}</div>
                              <div className="text-[9px] text-slate-400 truncate">{doc.deskripsi}</div>
                              {doc.dasarHukum && <div className="text-[8px] text-slate-300">Dasar: {doc.dasar_hukum || doc.dasarHukum}</div>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                                doc.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                doc.status === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' :
                                doc.status === 'terupload' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {doc.status === 'valid' ? '✓ Valid' : doc.status === 'invalid' ? '✗ Invalid' : doc.status === 'terupload' ? 'Terupload' : 'Upload'}
                              </span>
                              {(doc.status === 'belum' || doc.status === 'invalid') && (
                                <button
                                  onClick={() => handleUpload(doc.id)}
                                  disabled={uploading === doc.id}
                                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                  title="Upload Dokumen"
                                >
                                  {uploading === doc.id ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
