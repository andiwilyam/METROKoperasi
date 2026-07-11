import React, { useEffect } from 'react';
import { Percent, TrendingUp, Activity, Gauge } from 'lucide-react';

interface Props {
  laporanRasio: any;
  fetchLaporanRasio: () => Promise<void>;
}

export default function AdminRasio({ laporanRasio, fetchLaporanRasio }: Props) {
  useEffect(() => { fetchLaporanRasio(); }, []);
  const r = laporanRasio || {};

  const rasios = [
    { label: 'CAR (Capital Adequacy Ratio)', value: r.car, unit: '%', desc: 'Rasio Kecukupan Modal', good: '> 8%', color: 'blue' },
    { label: 'NPL (Non-Performing Loan)', value: r.npl, unit: '%', desc: 'Kredit Bermasalah', good: '< 5%', color: 'red' },
    { label: 'ROA (Return on Assets)', value: r.roa, unit: '%', desc: 'Imbal Hasil Aset', good: '> 1.5%', color: 'emerald' },
    { label: 'ROE (Return on Equity)', value: r.roe, unit: '%', desc: 'Imbal Hasil Ekuitas', good: '> 7%', color: 'indigo' },
    { label: 'BOPO', value: r.bopo, unit: '%', desc: 'Beban Ops / Pendapatan Ops', good: '< 85%', color: 'amber' },
    { label: 'LDR (Loan to Deposit)', value: r.ldr, unit: '%', desc: 'Rasio Pinjaman/Simpanan', good: '78-92%', color: 'purple' },
    { label: 'Rasio Likuiditas', value: r.likuiditas, unit: '%', desc: 'Kemampuan Bayar Jk. Pendek', good: '> 100%', color: 'teal' },
  ];

  const colorMap: any = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700', red: 'bg-red-50 border-red-100 text-red-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700', indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700', purple: 'bg-purple-50 border-purple-100 text-purple-700',
    teal: 'bg-teal-50 border-teal-100 text-teal-700'
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-blue-600" /> Rasio Keuangan Koperasi (Tingkat Kesehatan)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rasios.map((rs) => (
            <div key={rs.label} className={`border rounded-lg p-4 ${colorMap[rs.color]}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold opacity-70">{rs.label}</span>
                <Activity className="w-4 h-4 opacity-50" />
              </div>
              <div className="text-2xl font-bold">{rs.value ?? '-'}{rs.unit}</div>
              <div className="text-[10px] opacity-60 mt-1">{rs.desc}</div>
              <div className="text-[10px] mt-1 font-medium">Standar Sehat: {rs.good}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
