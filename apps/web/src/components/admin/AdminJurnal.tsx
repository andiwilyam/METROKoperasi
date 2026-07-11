import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Check, X, RotateCcw, FileText } from 'lucide-react';

interface AdminJurnalProps {
  chartOfAccounts: any[];
  journals: any[];
  createManualJurnal: (data: any) => Promise<any>;
  approveJurnal: (id: string, notes?: string) => Promise<void>;
  reverseJurnal: (id: string) => Promise<any>;
  fetchJournals: () => Promise<void>;
}

interface JournalRow {
  id: string;
  coa: string;
  debit: number;
  kredit: number;
}

const today = () => new Date().toISOString().slice(0, 10);

const emptyRow = (): JournalRow => ({ id: `row_${Math.random().toString(36).slice(2, 9)}`, coa: '', debit: 0, kredit: 0 });

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  posted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  reversed: 'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  posted: 'Posted',
  approved: 'Approved',
  reversed: 'Reversed',
};

export default function AdminJurnal({
  chartOfAccounts,
  journals,
  createManualJurnal,
  approveJurnal,
  reverseJurnal,
  fetchJournals,
}: AdminJurnalProps) {
  const [showForm, setShowForm] = useState(false);
  const [tanggal, setTanggal] = useState(today());
  const [keterangan, setKeterangan] = useState('');
  const [rows, setRows] = useState<JournalRow[]>([emptyRow(), emptyRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalDebit = useMemo(() => rows.reduce((s, r) => s + (Number(r.debit) || 0), 0), [rows]);
  const totalKredit = useMemo(() => rows.reduce((s, r) => s + (Number(r.kredit) || 0), 0), [rows]);
  const selisih = totalDebit - totalKredit;
  const isBalanced = Math.abs(selisih) < 0.01;

  const setRow = (id: string, patch: Partial<JournalRow>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const removeRow = (id: string) => {
    if (rows.length <= 2) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const resetForm = () => {
    setTanggal(today());
    setKeterangan('');
    setRows([emptyRow(), emptyRow()]);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!tanggal) return setError('Tanggal wajib diisi.');
    if (!keterangan.trim()) return setError('Keterangan wajib diisi.');
    const valid = rows.filter(r => r.coa);
    if (valid.length < 2) return setError('Minimal 2 baris akun harus dipilih.');
    if (!isBalanced) return setError('Total Debit harus sama dengan Total Kredit.');

    const details = valid.map(r => {
      const acc = chartOfAccounts.find(a => a.id === r.coa);
      return {
        coa: r.coa,
        namaAkun: acc?.namaAkun || acc?.nama || '',
        kodeAkun: acc?.kodeAkun || '',
        debit: Number(r.debit) || 0,
        kredit: Number(r.kredit) || 0,
      };
    });

    setSubmitting(true);
    try {
      await createManualJurnal({ tanggal, keterangan: keterangan.trim(), details });
      await fetchJournals();
      resetForm();
      setShowForm(false);
    } catch (e: any) {
      setError(e?.message || 'Gagal menyimpan jurnal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      await approveJurnal(id);
      await fetchJournals();
    } finally {
      setBusyId(null);
    }
  };

  const handleReverse = async (id: string) => {
    setBusyId(id);
    try {
      await reverseJurnal(id);
      await fetchJournals();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Form Entri Jurnal Manual */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Entri Jurnal Manual
          </h3>
          <button
            onClick={() => { setShowForm(s => !s); if (!showForm) resetForm(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" /> {showForm ? 'Tutup' : 'Buat Jurnal'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full border px-3 py-1.5 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Keterangan</label>
                <input
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  placeholder="Keterangan transaksi..."
                  className="w-full border px-3 py-1.5 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Pilih Akun</th>
                    <th className="px-3 py-2 font-semibold w-32">Debit</th>
                    <th className="px-3 py-2 font-semibold w-32">Kredit</th>
                    <th className="px-3 py-2 font-semibold w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td className="px-3 py-2">
                        <select
                          value={r.coa}
                          onChange={e => setRow(r.id, { coa: e.target.value })}
                          className="w-full border px-2 py-1.5 rounded text-xs"
                        >
                          <option value="">-- Pilih Akun --</option>
                          {chartOfAccounts.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.kodeAkun || ''} - {a.namaAkun || a.nama}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={r.debit || ''}
                          onChange={e => setRow(r.id, { debit: Number(e.target.value), kredit: 0 })}
                          placeholder="0"
                          className="w-full border px-2 py-1.5 rounded text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={r.kredit || ''}
                          onChange={e => setRow(r.id, { kredit: Number(e.target.value), debit: 0 })}
                          placeholder="0"
                          className="w-full border px-2 py-1.5 rounded text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeRow(r.id)}
                          disabled={rows.length <= 2}
                          className="p-1.5 rounded hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t font-semibold">
                  <tr>
                    <td className="px-3 py-2 text-slate-600">Total</td>
                    <td className="px-3 py-2 text-right text-blue-700">{formatRupiah(totalDebit)}</td>
                    <td className="px-3 py-2 text-right text-amber-700">{formatRupiah(totalKredit)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-blue-300 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50">
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
              <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isBalanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Selisih: {formatRupiah(Math.abs(selisih))} {isBalanced ? '(Seimbang)' : '(Belum Seimbang)'}
              </div>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-3 py-1.5 bg-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-400 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isBalanced || submitting}
                className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> {submitting ? 'Menyimpan...' : 'Simpan Jurnal'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Daftar Jurnal */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" /> Daftar Jurnal
          </h3>
          <button onClick={() => fetchJournals()} className="px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-slate-50">
            Segarkan
          </button>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold whitespace-nowrap">No Jurnal</th>
                <th className="px-3 py-2 font-semibold whitespace-nowrap">Tanggal</th>
                <th className="px-3 py-2 font-semibold">Keterangan</th>
                <th className="px-3 py-2 font-semibold whitespace-nowrap">Sumber</th>
                <th className="px-3 py-2 font-semibold text-right whitespace-nowrap">Total Debit</th>
                <th className="px-3 py-2 font-semibold text-right whitespace-nowrap">Total Kredit</th>
                <th className="px-3 py-2 font-semibold whitespace-nowrap">Status</th>
                <th className="px-3 py-2 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {journals.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-400">Belum ada jurnal</td></tr>
              ) : (
                journals.map(j => {
                  const status = (j.status || 'draft').toLowerCase();
                  return (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono whitespace-nowrap">{j.noJurnal}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{j.tanggal}</td>
                      <td className="px-3 py-2">{j.keterangan}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{j.sumber}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{formatRupiah(j.debit)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{formatRupiah(j.kredit)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLE[status] || 'bg-slate-100 text-slate-600'}`}>
                          {STATUS_LABEL[status] || status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {status === 'posted' && (
                            <button
                              onClick={() => handleApprove(j.id)}
                              disabled={busyId === j.id}
                              className="p-1.5 rounded hover:bg-green-100 text-green-600 disabled:opacity-40"
                              title="Setujui"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {status === 'approved' && (
                            <button
                              onClick={() => handleReverse(j.id)}
                              disabled={busyId === j.id}
                              className="p-1.5 rounded hover:bg-red-100 text-red-600 disabled:opacity-40"
                              title="Membalik (Reverse)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {status !== 'posted' && status !== 'approved' && <span className="text-slate-300">-</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
