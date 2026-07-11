import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  accountingPeriods: any[];
  fetchPeriods: () => Promise<void>;
  closePeriod: (id: string) => Promise<void>;
  openPeriod: (id: string) => Promise<void>;
  tutupBuku: (tahun: number) => Promise<any>;
}

export default function AdminTutupBuku({ accountingPeriods, fetchPeriods, closePeriod, openPeriod, tutupBuku }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => { fetchPeriods(); }, []);

  const tahun = accountingPeriods[0]?.tahun || 2026;

  const handleTutupBuku = async () => {
    const r = await tutupBuku(tahun);
    setResult(r.message || 'Tutup buku berhasil');
    setConfirming(false);
    fetchPeriods();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" /> Periode Akuntansi &amp; Tutup Buku
        </h3>

        {result && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4" /> {result}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {accountingPeriods.map((p) => (
            <div key={p.id} className={`border rounded-lg p-3 ${p.isClosed ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">{p.namaPeriode}</span>
                {p.isClosed ? <Lock className="w-3.5 h-3.5 text-slate-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <div className={`text-[10px] font-medium ${p.isClosed ? 'text-slate-400' : 'text-emerald-600'}`}>
                {p.isClosed ? 'Tertutup' : 'Terbuka'}
              </div>
              <button
                onClick={() => p.isClosed ? openPeriod(p.id) : closePeriod(p.id)}
                className={`mt-2 w-full text-[10px] py-1 rounded font-semibold ${p.isClosed ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
              >
                {p.isClosed ? 'Buka Periode' : 'Tutup Periode'}
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-red-700 text-sm">Tutup Buku Tahunan {tahun}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Proses ini akan menutup seluruh periode tahun {tahun}, menghitung laba bersih,
                  dan memindahkannya ke akun SHU Belum Dibagi. Tindakan ini mengunci seluruh data tahun berjalan.
                </p>
                {!confirming ? (
                  <button onClick={() => setConfirming(true)} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">
                    Proses Tutup Buku {tahun}
                  </button>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button onClick={handleTutupBuku} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">Ya, Tutup Buku</button>
                    <button onClick={() => setConfirming(false)} className="px-4 py-2 bg-slate-300 rounded-lg text-xs font-semibold">Batal</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
