import React, { useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Props {
  laporanLabarugi: any;
  fetchLaporanLabarugi: (s?: string, e?: string) => Promise<void>;
  journals: any[];
}

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

export default function AdminArusKas({ laporanLabarugi, fetchLaporanLabarugi, journals }: Props) {
  useEffect(() => { fetchLaporanLabarugi(); }, []);

  // Compute cash flows from journals involving Kas/Bank accounts (COA 1.1.xx)
  let kasMasuk = 0, kasKeluar = 0;
  (journals || []).forEach((j: any) => {
    (j.details || []).forEach((d: any) => {
      if (d.coa && (d.coa.startsWith('1.1.0'))) {
        kasMasuk += d.debit || 0;
        kasKeluar += d.kredit || 0;
      }
    });
  });
  const arusBersih = kasMasuk - kasKeluar;

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-blue-600" /> Laporan Arus Kas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1"><ArrowDownCircle className="w-4 h-4 text-emerald-600" /><span className="text-xs text-slate-500">Kas Masuk</span></div>
            <div className="text-lg font-bold text-emerald-700">{formatIDR(kasMasuk)}</div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4 text-red-600" /><span className="text-xs text-slate-500">Kas Keluar</span></div>
            <div className="text-lg font-bold text-red-700">{formatIDR(kasKeluar)}</div>
          </div>
          <div className={`border rounded-lg p-4 ${arusBersih >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className="text-xs text-slate-500 mb-1">Arus Kas Bersih</div>
            <div className={`text-lg font-bold ${arusBersih >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>{formatIDR(arusBersih)}</div>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-slate-400">
          Arus kas dihitung dari seluruh mutasi akun Kas &amp; Bank (kode akun 1.1.0x) pada jurnal umum.
        </div>
      </div>
    </div>
  );
}
