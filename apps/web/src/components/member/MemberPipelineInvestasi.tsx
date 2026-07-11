import React, { useState } from 'react';
import { TrendingUp, FileText, AlertCircle, CheckCircle, Clock, X, Building2, DollarSign, Calendar, ArrowUpRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { api } from '../../api/client';

export default function MemberPipelineInvestasi({ session }: { session: any }) {
  const { pengajuanList, fetchPengajuan, investments, fetchInvestments } = useDataStore();
  const [tab, setTab] = useState<'pengajuan' | 'aktif' | 'riwayat'>('pengajuan');
  const [loading, setLoading] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Filter pengajuan for this company
  const myPengajuan = pengajuanList.filter((p: any) => p.perusahaanId === session.perusahaanId || p.perusahaanId === session.id);
  const pengajuanMenunggu = myPengajuan.filter((p: any) => p.status === 'pengajuan' || p.status === 'proses_verifikasi');
  const pengajuanDisetujui = myPengajuan.filter((p: any) => p.status === 'disetujui' || p.status === 'dicairkan');
  const pengajuanDitolak = myPengajuan.filter((p: any) => p.status === 'ditolak');
  const pengajuanSelesai = myPengajuan.filter((p: any) => p.status === 'selesai' || p.status === 'lunas');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'pengajuan': 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
      'proses_verifikasi': 'bg-blue-50 text-blue-700 border-blue-200',
      'disetujui': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'dicairkan': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'ditolak': 'bg-red-50 text-red-700 border-red-200',
      'selesai': 'bg-blue-50 text-blue-700 border-blue-200',
      'lunas': 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pengajuan': 'Pengajuan Baru',
      'proses_verifikasi': 'Proses Verifikasi',
      'disetujui': 'Disetujui',
      'dicairkan': 'Dicairkan / Aktif',
      'ditolak': 'Ditolak',
      'selesai': 'Selesai',
      'lunas': 'Lunas',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Pipeline Investasi</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Kelola Pipeline Penyertaan Modal</h1>
        <p className="text-xs text-slate-300 mt-1">Pantau status pengajuan, investasi aktif, dan riwayat transaksi</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex flex-wrap gap-1" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'pengajuan'}
          onClick={() => setTab('pengajuan')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'pengajuan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          Pengajuan ({myPengajuan.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'aktif'}
          onClick={() => setTab('aktif')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'aktif' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
          Aktif ({investments.filter((i: any) => i.perusahaanId === session.perusahaanId || i.perusahaanId === session.id).length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'riwayat'}
          onClick={() => setTab('riwayat')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'riwayat' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 inline mr-1.5" />
          Riwayat ({pengajuanDitolak.length + pengajuanSelesai.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Pengajuan Tab */}
        {tab === 'pengajuan' && (
          <div className="p-6">
            {myPengajuan.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-600">Belum ada pengajuan investasi</p>
                <p className="text-xs text-slate-400 mt-1">Ajukan proposal penyertaan modal melalui menu <strong>Pengajuan Pembiayaan</strong></p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-xs">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <div className="font-bold text-amber-700">{pengajuanMenunggu.length}</div>
                    <div className="text-amber-600">Menunggu Verifikasi</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                    <div className="font-bold text-indigo-700">{pengajuanDisetujui.length}</div>
                    <div className="text-indigo-600">Disetujui / Dicairkan</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="font-bold text-red-700">{pengajuanDitolak.length}</div>
                    <div className="text-red-600">Ditolak</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="font-bold text-blue-700">{pengajuanSelesai.length}</div>
                    <div className="text-blue-600">Selesai / Lunas</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {myPengajuan.map((p: any) => (
                    <div
                      key={p.id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      onClick={() => { setSelectedPengajuan(p); setShowDetail(true); }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{p.namaPerusahaan || p.nama_proyek}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(p.status)}`}>
                            {getStatusLabel(p.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {p.sektorIndustri || '-'}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {formatIDR(p.nominalInvestasi || p.nominal_pembiayaan || 0)}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.tanggalPengajuan || p.tanggal_pengajuan || '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:ml-4">
                        <span className="text-xs text-slate-400 font-medium">Klik untuk detail</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Aktif Tab */}
        {tab === 'aktif' && (
          <div className="p-6">
            const myInvestments = investments.filter((i: any) => i.perusahaanId === session.perusahaanId || i.perusahaanId === session.id);
            {myInvestments.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-600">Belum ada investasi aktif</p>
                <p className="text-xs text-slate-400 mt-1">Investasi yang disetujui akan muncul di sini</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myInvestments.map((inv: any) => (
                  <div key={inv.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm">{inv.namaPerusahaan}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(inv.status)}`}>
                        {getStatusLabel(inv.status)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mb-2">{inv.deskripsiBisnis}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                      <div><span className="text-slate-400 block">Investasi</span> <span className="font-bold text-slate-800">{formatIDR(inv.nominalInvestasi)}</span></div>
                      <div><span className="text-slate-400 block">Saham</span> <span className="font-bold text-slate-800">{inv.persentaseSaham}%</span></div>
                      <div><span className="text-slate-400 block">Deviden</span> <span className="font-bold text-blue-600">{inv.estimasiDividen}%</span></div>
                      <div><span className="text-slate-400 block">Tenor</span> <span className="font-bold text-slate-800">{inv.tenorTahun} Thn</span></div>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Founder: <span className="font-semibold text-slate-700">{inv.namaFounder}</span></span>
                      {inv.dividendHistory && inv.dividendHistory.length > 0 && (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3" /> Dividen Lancar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Riwayat Tab */}
        {tab === 'riwayat' && (
          <div className="p-6">
            const riwayat = [...pengajuanDitolak, ...pengajuanSelesai].sort((a, b) => 
              new Date(b.tanggalPengajuan || b.tanggal_pengajuan || 0).getTime() - new Date(a.tanggalPengajuan || a.tanggal_pengajuan || 0).getTime()
            );
            {riwayat.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-600">Belum ada riwayat pengajuan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {riwayat.map((p: any) => (
                  <div key={p.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-slate-800 text-sm">{p.namaPerusahaan || p.nama_proyek}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(p.status)}`}>
                        {getStatusLabel(p.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
                      <span>{formatIDR(p.nominalInvestasi || p.nominal_pembiayaan || 0)}</span>
                      <span>{p.tanggalPengajuan || p.tanggal_pengajuan || '-'}</span>
                      {p.alasanPenolakan && <span className="text-red-600">Alasan: {p.alasanPenolakan}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedPengajuan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-indigo-600 text-white rounded-t-xl">
              <h3 className="font-bold text-sm">Detail Pengajuan Investasi</h3>
              <button onClick={() => setShowDetail(false)} className="hover:bg-indigo-500 p-1 rounded-full text-slate-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-400 block">Nama Perusahaan</span> <span className="font-bold text-slate-800">{selectedPengajuan.namaPerusahaan}</span></div>
                <div><span className="text-slate-400 block">Sektor</span> <span className="text-slate-600">{selectedPengajuan.sektorIndustri}</span></div>
                <div><span className="text-slate-400 block">Nominal</span> <span className="font-bold text-slate-800">{formatIDR(selectedPengajuan.nominalInvestasi)}</span></div>
                <div><span className="text-slate-400 block">Porsi Saham</span> <span className="font-bold text-slate-800">{selectedPengajuan.persentaseSaham}%</span></div>
                <div><span className="text-slate-400 block">Est. Deviden</span> <span className="font-bold text-blue-600">{selectedPengajuan.estimasiDividen}%</span></div>
                <div><span className="text-slate-400 block">Tenor</span> <span className="font-bold text-slate-800">{selectedPengajuan.tenorTahun} Tahun</span></div>
                <div className="md:col-span-2"><span className="text-slate-400 block">Founder</span> <span className="font-bold text-slate-800">{selectedPengajuan.namaFounder}</span></div>
                <div className="md:col-span-2"><span className="text-slate-400 block">Kontak</span> <span className="font-mono text-slate-600">{selectedPengajuan.kontakFounder}</span></div>
              </div>
              <div>
                <span className="text-slate-400 block">Deskripsi Bisnis</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded text-[10px] leading-relaxed">{selectedPengajuan.deskripsiBisnis}</p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <span className="text-slate-400 block">Status: <span className="font-bold text-slate-800">{getStatusLabel(selectedPengajuan.status)}</span></span>
                {selectedPengajuan.alasanPenolakan && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-[10px]">
                    <strong>Alasan Penolakan:</strong> {selectedPengajuan.alasanPenolakan}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}