import React, { useEffect } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  laporanPde: any;
  fetchLaporanPde: () => Promise<void>;
}

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

export default function AdminPDE({ laporanPde, fetchLaporanPde }: Props) {
  useEffect(() => { fetchLaporanPde(); }, []);

  const d = laporanPde || {};

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-blue-600" /> Laporan Kualitas Aktiva Produktif (PDE)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="text-xs text-slate-500">Total Debitur</div>
            <div className="text-xl font-bold text-blue-700">{d.totalDebitur || 0}</div>
          </div>
          <div className="bg-slate-50 border rounded-lg p-4">
            <div className="text-xs text-slate-500">Total Piutang</div>
            <div className="text-lg font-bold text-slate-800">{formatIDR(d.totalPiutang)}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <div className="text-xs text-slate-500">Piutang Lancar</div>
            <div className="text-lg font-bold text-emerald-700">{formatIDR(d.lancar)}</div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="text-xs text-slate-500">Piutang Macet</div>
            <div className="text-lg font-bold text-red-700">{formatIDR(d.macet)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <div>
            <div className="text-xs text-slate-500">Rasio Kredit Bermasalah (NPL)</div>
            <div className="text-2xl font-bold text-amber-700">{d.npl || '0%'}</div>
          </div>
          <div className="ml-auto text-xs text-slate-400 max-w-xs text-right">
            Standar sehat KSP: NPL &lt; 5% sesuai Permenkop No. 2/2024
          </div>
        </div>
      </div>
    </div>
  );
}
