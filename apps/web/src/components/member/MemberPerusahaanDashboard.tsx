import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp, FileText, CheckCircle, XCircle, DollarSign, Calendar, Award, Sparkles } from 'lucide-react';

interface Props {
  session: any;
}

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

export default function MemberPerusahaanDashboard({ session }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/my-venture-data', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400 text-xs">Memuat data...</div>;
  if (!data) return <div className="p-8 text-center text-slate-400 text-xs">Gagal memuat data</div>;

  const { anggota, pengajuan, venture } = data;
  const totalInvestasi = (venture || []).reduce((s: number, v: any) => s + (v.nominal_investasi || 0), 0);
  const totalPengajuan = (pengajuan || []).length;
  const pendingPengajuan = (pengajuan || []).filter((p: any) => p.status_pengajuan === 'draft' || p.status_pengajuan === 'dokumen_lengkap').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Portal Perusahaan</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Dashboard {anggota?.nama || session.namaLengkap}</h1>
        <p className="text-xs text-slate-300 mt-1">Ringkasan investasi, pengajuan, dan portofolio penyertaan modal.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Investasi</span>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{formatIDR(totalInvestasi)}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Pengajuan</span>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{totalPengajuan}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Menunggu Proses</span>
          <div className="text-xl font-extrabold text-amber-600 mt-1">{pendingPengajuan}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Saldo Sukarela</span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">{formatIDR(anggota?.saldo_simpanan_sukarela || 0)}</div>
        </div>
      </div>

      {/* Pengajuan Terbaru */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-blue-600" /> Pengajuan Pembiayaan Terbaru
        </h3>
        {(pengajuan || []).length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">Belum ada pengajuan pembiayaan.</div>
        ) : (
          <div className="space-y-2">
            {(pengajuan || []).slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{p.no_pengajuan}</div>
                  <div className="text-[10px] text-slate-400">{p.tujuan_pembiayaan?.substring(0, 60)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">{formatIDR(p.pokok_pengajuan)}</div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    p.status_pengajuan === 'layak' ? 'bg-emerald-100 text-emerald-700' :
                    p.status_pengajuan === 'ditolak' ? 'bg-red-100 text-red-700' :
                    p.status_pengajuan === 'dicairkan' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{p.status_pengajuan}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Venture Aktif */}
      {(venture || []).length > 0 && (
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-purple-600" /> Investasi Ventura Aktif
          </h3>
          <div className="space-y-2">
            {(venture || []).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between border rounded-lg p-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{v.nama_perusahaan}</div>
                  <div className="text-[10px] text-slate-400">{v.sektor_industri}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-700">{formatIDR(v.nominal_investasi)}</div>
                  <span className="text-[9px] text-slate-400">{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
