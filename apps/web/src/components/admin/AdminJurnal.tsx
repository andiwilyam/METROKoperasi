/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Check, X, RotateCcw, FileText } from 'lucide-react';
import { ChartOfAccount, JournalEntry } from '@metrocoop/shared/types';

interface AdminJurnalProps {
  chartOfAccounts: ChartOfAccount[];
  journals: JournalEntry[];
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
  draft: 'mc-badge-accent',
  posted: 'mc-badge-accent',
  approved: 'mc-badge-ok',
  reversed: 'mc-btn-danger',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  posted: 'Posted',
  approved: 'Disetujui',
  reversed: 'Dibalik',
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
        namaAkun: acc?.namaAkun || '',
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
      <div className="mc-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2">
            <FileText className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} /> Entri Jurnal Manual
          </h3>
          <button
            onClick={() => { setShowForm(s => !s); if (!showForm) resetForm(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 mc-btn-primary text-white rounded-lg text-xs font-semibold hover:shadow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {showForm ? 'Tutup' : 'Buat Jurnal'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mc-muted mb-1">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full mc-border mc-surface-2 rounded-lg text-xs mc-focus focus:ring-[var(--mc-accent)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mc-muted mb-1">Keterangan</label>
                <input
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  placeholder="Keterangan transaksi..."
                  className="w-full mc-border mc-surface-2 rounded-lg text-xs mc-focus focus:ring-[var(--mc-accent)]"
                />
              </div>
            </div>

            <div className="mc-border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="mc-surface-2 mc-muted">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Pilih Akun</th>
                    <th className="px-3 py-2 font-semibold w-32">Debit</th>
                    <th className="px-3 py-2 font-semibold w-32">Kredit</th>
                    <th className="px-3 py-2 font-semibold w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td className="px-3 py-2">
                        <select
                          value={r.coa}
                          onChange={e => setRow(r.id, { coa: e.target.value })}
                          className="w-full mc-border mc-surface-2 rounded px-2 py-1.5 text-xs mc-focus focus:ring-[var(--mc-accent)]"
                        >
                          <option value="">-- Pilih Akun --</option>
                          {chartOfAccounts.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.kodeAkun || ''} - {a.namaAkun}
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
                          className="w-full mc-border mc-surface-2 rounded px-2 py-1.5 text-xs text-right mc-focus focus:ring-[var(--mc-accent)]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={r.kredit || ''}
                          onChange={e => setRow(r.id, { kredit: Number(e.target.value), debit: 0 })}
                          placeholder="0"
                          className="w-full mc-border mc-surface-2 rounded px-2 py-1.5 text-xs text-right mc-focus focus:ring-[var(--mc-accent)]"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeRow(r.id)}
                          disabled={rows.length <= 2}
                          className="p-1.5 rounded hover:mc-surface-2 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5 mc-btn-danger" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="mc-surface-2 mc-border font-semibold">
                  <tr>
                    <td className="px-3 py-2 mc-muted">Total</td>
                    <td className="px-3 py-2 text-right" style={{ color: 'var(--mc-primary)' }}>{formatRupiah(totalDebit)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: 'var(--mc-accent)' }}>{formatRupiah(totalKredit)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed mc-border mc-icon-accent rounded-lg text-xs font-semibold hover:mc-surface-2/50 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
              <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isBalanced ? 'mc-badge-ok' : 'mc-btn-danger'}`}>
                Selisih: {formatRupiah(Math.abs(selisih))} {isBalanced ? '(Seimbang)' : '(Belum Seimbang)'}
              </div>
            </div>

            {error && <p className="text-xs mc-btn-danger mc-surface-2 mc-border px-3 py-2 rounded-lg" style={{ borderColor: 'var(--mc-error)' }}>{error}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-3 py-1.5 mc-surface-2 mc-border rounded-lg text-xs font-semibold hover:mc-border cursor-pointer flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isBalanced || submitting}
                className="px-4 py-1.5 mc-btn-primary text-white rounded-lg text-xs font-semibold hover:shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> {submitting ? 'Menyimpan...' : 'Simpan Jurnal'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Daftar Jurnal */}
      <div className="mc-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2">
            <FileText className="w-5 h-5 mc-badge-ok" /> Daftar Jurnal
          </h3>
          <button onClick={() => fetchJournals()} className="px-3 py-1.5 mc-border mc-surface-2 rounded-lg text-xs font-semibold hover:mc-border cursor-pointer">
            Segarkan
          </button>
        </div>

        <div className="mc-border rounded-lg overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="mc-surface-2 mc-muted">
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
            <tbody className="divide-y mc-border">
              {journals.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center mc-muted">Belum ada jurnal</td></tr>
              ) : (
                journals.map(j => {
                  const status = (j.status || 'draft').toLowerCase();
                  return (
                    <tr key={j.id} className="hover:mc-surface-2/20">
                      <td className="px-3 py-2 font-mono mc-muted whitespace-nowrap">{j.noJurnal}</td>
                      <td className="px-3 py-2 whitespace-nowrap mc-muted">{j.tanggal}</td>
                      <td className="px-3 py-2 mc-ink">{j.keterangan}</td>
                      <td className="px-3 py-2 whitespace-nowrap mc-muted">{j.sumber}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap font-mono mc-ink-strong" style={{ color: 'var(--mc-primary)' }}>{formatRupiah(j.debit)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap font-mono mc-ink-strong" style={{ color: 'var(--mc-accent)' }}>{formatRupiah(j.kredit)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLE[status] || 'mc-muted'}`}>
                          {STATUS_LABEL[status] || status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {status === 'posted' && (
                            <button
                              onClick={() => handleApprove(j.id)}
                              disabled={busyId === j.id}
                              className="p-1.5 rounded hover:mc-surface-2 mc-badge-ok disabled:opacity-40 cursor-pointer"
                              title="Setujui"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {status === 'approved' && (
                            <button
                              onClick={() => handleReverse(j.id)}
                              disabled={busyId === j.id}
                              className="p-1.5 rounded hover:mc-surface-2 mc-btn-danger disabled:opacity-40 cursor-pointer"
                              title="Membalik (Reverse)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {status !== 'posted' && status !== 'approved' && <span className="mc-muted">-</span>}
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