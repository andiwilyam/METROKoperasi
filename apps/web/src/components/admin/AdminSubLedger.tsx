/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Users, AlertTriangle, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';

interface SubLedgerPiutangItem {
  anggotaId: string;
  anggotaNama: string;
  noPinjaman: string;
  pokokPiutang: number;
  sisaPokok: number;
  kolektibilitas: 'Lancar' | 'Kurang Lancar' | 'Diragukan' | 'Macet';
  status: string;
  tunggakanHari: number;
}

interface AdminSubLedgerProps {
  subLedgerPiutang: SubLedgerPiutangItem[];
  fetchSubLedgerPiutang: () => Promise<void>;
}

const KOLEKTIBILITAS_CLASS: Record<string, string> = {
  'Lancar': 'mc-badge-ok',
  'Kurang Lancar': 'mc-badge-accent',
  'Diragukan': 'mc-badge-accent',
  'Macet': 'mc-btn-danger',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  'Lancar': <CheckCircle className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-success)' }} />,
  'Kurang Lancar': <AlertTriangle className="w-4 h-4" style={{ color: 'var(--mc-accent)' }} />,
  'Diragukan': <AlertTriangle className="w-4 h-4" style={{ color: 'var(--mc-accent)' }} />,
  'Macet': <XCircle className="w-4 h-4" style={{ color: 'var(--mc-error)' }} />,
};

const formatRupiah = (angka: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);

export default function AdminSubLedger({ subLedgerPiutang, fetchSubLedgerPiutang }: AdminSubLedgerProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      await fetchSubLedgerPiutang();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const data = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (subLedgerPiutang || []).filter((r) =>
      r.anggotaNama?.toLowerCase().includes(term) ||
      r.noPinjaman?.toLowerCase().includes(term)
    );
  }, [subLedgerPiutang, searchTerm]);

  const summary = useMemo(() => {
    const rows = subLedgerPiutang || [];
    const totalPiutang = rows.reduce((s, r) => s + (Number(r.pokokPiutang) || 0), 0);
    const totalTunggakan = rows.reduce((s, r) => s + (Number(r.sisaPokok) || 0), 0);
    const macet = rows.filter((r) => r.kolektibilitas === 'Macet' || (Number(r.tunggakanHari) || 0) > 90);
    const totalMacet = macet.reduce((s, r) => s + (Number(r.sisaPokok) || 0), 0);
    const npl = totalTunggakan > 0 ? (totalMacet / totalTunggakan) * 100 : 0;
    return { totalPiutang, totalTunggakan, totalMacet, npl, count: rows.length };
  }, [subLedgerPiutang]);

  return (
    <div className="space-y-4">
      <div className="mc-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 mc-surface-2 mc-border rounded-lg" style={{ borderColor: 'var(--mc-primary)' }}>
              <Users className="w-6 h-6 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            </div>
            <div>
              <h2 className="font-extrabold mc-ink-strong text-sm">Sub Ledger Piutang</h2>
              <p className="text-[11px] mc-muted">Aging Piutang Anggota (Accounts Receivable)</p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 mc-btn-primary text-white rounded-lg hover:shadow disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-primary)' }}>
            <p className="text-xs mc-muted uppercase tracking-wide">Total Piutang</p>
            <p className="text-lg font-bold mc-ink-strong mt-1">{formatRupiah(summary.totalPiutang)}</p>
            <p className="text-xs mc-muted mt-1">{summary.count} anggota</p>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4">
            <p className="text-xs mc-muted uppercase tracking-wide">Total Sisa Piutang</p>
            <p className="text-lg font-bold mc-ink-strong mt-1" style={{ color: 'var(--mc-accent)' }}>{formatRupiah(summary.totalTunggakan)}</p>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-success)' }}>
            <p className="text-xs mc-muted uppercase tracking-wide">Piutang Lancar</p>
            <p className="text-lg font-bold" style={{ color: 'var(--mc-success)' }}>{formatRupiah(summary.totalTunggakan - summary.totalMacet)}</p>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-error)' }}>
            <p className="text-xs mc-muted uppercase tracking-wide">Piutang Macet</p>
            <p className="text-lg font-bold" style={{ color: 'var(--mc-error)' }}>{formatRupiah(summary.totalMacet)}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 mc-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari anggota atau no pinjaman..."
              className="w-full pl-9 pr-3 py-2 mc-border mc-surface-2 rounded-lg mc-focus focus:ring-[var(--mc-accent)]"
            />
          </div>
        </div>

        <div className="mc-surface mc-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="mc-surface-2 mc-border mc-muted text-left font-semibold">
                  <th className="p-4">Anggota</th>
                  <th className="p-4">No Pinjaman</th>
                  <th className="p-4 text-right">Pokok Piutang</th>
                  <th className="p-4 text-right">Sisa Pokok</th>
                  <th className="p-4 text-right">Tunggakan (hari)</th>
                  <th className="p-4">Kolektibilitas</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y mc-border">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center mc-muted">
                      {loading ? 'Memuat data...' : 'Tidak ada data piutang.'}
                    </td>
                  </tr>
                ) : (
                  data.map((r, i) => {
                    const kolor = KOLEKTIBILITAS_CLASS[r.kolektibilitas] || 'mc-muted';
                    return (
                      <tr key={r.anggotaId || r.noPinjaman || i} className="hover:mc-surface-2/50">
                        <td className="p-4 font-medium mc-ink-strong">{r.anggotaNama}</td>
                        <td className="p-4 mc-ink">{r.noPinjaman}</td>
                        <td className="p-4 text-right mc-ink-strong">{formatRupiah(r.pokokPiutang)}</td>
                        <td className="p-4 text-right mc-ink-strong">{formatRupiah(r.sisaPokok)}</td>
                        <td className="p-4 text-right mc-ink">{r.tunggakanHari}</td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${kolor}`}>
                            {r.kolektibilitas}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                            {STATUS_ICON[r.kolektibilitas]}
                            {r.status}
                          </span>
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
    </div>
  );
}