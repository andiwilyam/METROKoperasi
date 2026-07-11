import React, { useState, useMemo, useRef } from 'react';
import { Search, Calendar, Download, BookOpen, Loader2, Inbox } from 'lucide-react';

interface AdminBukuBesarProps {
  chartOfAccounts: any[];
  fetchBukuBesar: (coaId: string, startDate?: string, endDate?: string) => Promise<void>;
  bukuBesar: any; // { account: {...}, lines: [...], saldoAkhir: number }
}

const todayStr = () => new Date().toISOString().slice(0, 10);
const firstDayOfMonthStr = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

const formatIDR = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num || 0);
};

const formatTanggal = (tgl: string) => {
  if (!tgl) return '-';
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return tgl;
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};

export default function AdminBukuBesar({ chartOfAccounts, fetchBukuBesar, bukuBesar }: AdminBukuBesarProps) {
  const detailAccounts = useMemo(
    () => chartOfAccounts.filter(a => !a.isHeader && a.isActive !== false),
    [chartOfAccounts]
  );

  const [coaId, setCoaId] = useState('');
  const [startDate, setStartDate] = useState(firstDayOfMonthStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleCari = async () => {
    if (!coaId) return;
    setLoading(true);
    try {
      await fetchBukuBesar(coaId, startDate || undefined, endDate || undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!bukuBesar || !bukuBesar.lines || bukuBesar.lines.length === 0) return;
    const acc = bukuBesar.account;
    const lines = bukuBesar.lines;
    let csv = 'Tanggal,No Jurnal,Keterangan,Debit,Kredit,Saldo\n';
    let running = 0;
    const isDebit = acc?.saldoNormal === 'debit';
    lines.forEach((l: any) => {
      const d = Number(l.debit) || 0;
      const k = Number(l.kredit) || 0;
      running += isDebit ? d - k : k - d;
      csv += `"${l.tanggal}","${l.noJurnal}","${l.keterangan}","${d}","${k}","${running}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buku-besar-${acc?.kodeAkun || 'akun'}-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const linesWithSaldo = useMemo(() => {
    if (!bukuBesar || !bukuBesar.lines) return [];
    const isDebit = bukuBesar.account?.saldoNormal === 'debit';
    let running = 0;
    return bukuBesar.lines.map((l: any) => {
      const d = Number(l.debit) || 0;
      const k = Number(l.kredit) || 0;
      running += isDebit ? d - k : k - d;
      return { ...l, saldo: running };
    });
  }, [bukuBesar]);

  const hasResult = bukuBesar && bukuBesar.account && coaId;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Buku Besar (General Ledger)
          </h3>
          {hasResult && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
            >
              <Download className="w-3.5 h-3.5" /> Unduh CSV
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pilih Akun</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                value={coaId}
                onChange={e => setCoaId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="">-- Pilih Akun Detail --</option>
                {detailAccounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.kodeAkun} - {a.namaAkun} ({a.saldoNormal === 'debit' ? 'D' : 'K'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal Mulai</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-9 pr-2 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal Akhir</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-9 pr-2 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCari}
            disabled={!coaId || loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-3.5 h-3.5" /> {loading ? 'Memuat...' : 'Tampilkan Buku Besar'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-xs">Memuat data buku besar...</p>
        </div>
      )}

      {!loading && !hasResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-slate-400">
          <Inbox className="w-10 h-10 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Belum ada data buku besar</p>
          <p className="text-[11px] mt-1">Pilih akun detail dan klik &quot;Tampilkan Buku Besar&quot; untuk melihat mutasi.</p>
        </div>
      )}

      {!loading && hasResult && linesWithSaldo.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-slate-400">
          <Inbox className="w-10 h-10 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Tidak ada transaksi</p>
          <p className="text-[11px] mt-1">Tidak ditemukan jurnal pada akun ini untuk periode yang dipilih.</p>
        </div>
      )}

      {!loading && hasResult && linesWithSaldo.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="font-mono text-indigo-600">{bukuBesar.account.kodeAkun}</span>
                {bukuBesar.account.namaAkun}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Periode: {formatTanggal(startDate)} s.d. {formatTanggal(endDate)} &middot; Saldo Normal:{' '}
                <span className={`font-semibold ${bukuBesar.account.saldoNormal === 'debit' ? 'text-blue-600' : 'text-amber-600'}`}>
                  {bukuBesar.account.saldoNormal === 'debit' ? 'Debit' : 'Kredit'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Saldo Akhir</div>
              <div className="font-mono font-bold text-slate-800 text-sm">{formatIDR(bukuBesar.saldoAkhir)}</div>
            </div>
          </div>

          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3 w-28">Tanggal</th>
                  <th className="p-3 w-32">No Jurnal</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3 text-right w-36">Debit</th>
                  <th className="p-3 text-right w-36">Kredit</th>
                  <th className="p-3 text-right w-36">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {linesWithSaldo.map((l: any, i: number) => (
                  <tr key={l.id || i} className="hover:bg-slate-50/40">
                    <td className="p-3 text-slate-500 whitespace-nowrap">{formatTanggal(l.tanggal)}</td>
                    <td className="p-3 font-mono font-semibold text-slate-700 whitespace-nowrap">{l.noJurnal}</td>
                    <td className="p-3 text-slate-800">{l.keterangan}</td>
                    <td className="p-3 text-right font-mono text-blue-700">{(Number(l.debit) || 0) > 0 ? formatIDR(l.debit) : '-'}</td>
                    <td className="p-3 text-right font-mono text-amber-700">{(Number(l.kredit) || 0) > 0 ? formatIDR(l.kredit) : '-'}</td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-800">{formatIDR(l.saldo)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
                  <td className="p-3" colSpan={3}>Saldo Akhir</td>
                  <td className="p-3 text-right font-mono text-blue-700">
                    {formatIDR(linesWithSaldo.reduce((s: number, l: any) => s + (Number(l.debit) || 0), 0))}
                  </td>
                  <td className="p-3 text-right font-mono text-amber-700">
                    {formatIDR(linesWithSaldo.reduce((s: number, l: any) => s + (Number(l.kredit) || 0), 0))}
                  </td>
                  <td className="p-3 text-right font-mono">{formatIDR(bukuBesar.saldoAkhir)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
