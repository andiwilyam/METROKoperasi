import React, { useEffect } from 'react';
import { ScrollText, User, CheckCircle, RotateCcw, Clock } from 'lucide-react';

interface Props {
  journals: any[];
  fetchJournals: () => Promise<void>;
}

export default function AdminAuditTrail({ journals, fetchJournals }: Props) {
  useEffect(() => { fetchJournals(); }, []);

  const sorted = [...(journals || [])].sort((a, b) => (b.tanggal > a.tanggal ? 1 : -1)).slice(0, 100);

  const statusBadge = (sumber: string) => {
    const map: any = {
      'Manual': 'bg-purple-100 text-purple-700',
      'Reversing': 'bg-red-100 text-red-700',
      'Simpanan': 'bg-blue-100 text-blue-700',
      'Pinjaman': 'bg-indigo-100 text-indigo-700',
      'Toko': 'bg-emerald-100 text-emerald-700',
      'PPOB': 'bg-amber-100 text-amber-700',
    };
    return map[sumber] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-blue-600" /> Audit Trail Jurnal
        </h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-xs">Belum ada aktivitas jurnal</p>
          ) : sorted.map((j) => (
            <div key={j.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                {j.sumber === 'Reversing' ? <RotateCcw className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{j.noJurnal}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusBadge(j.sumber)}`}>{j.sumber}</span>
                </div>
                <p className="text-xs text-slate-700 truncate">{j.keterangan}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-slate-800">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(j.debit || 0)}</div>
                <div className="text-[10px] text-slate-400">{j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
