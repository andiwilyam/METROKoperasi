/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Users, AlertTriangle, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';

interface AdminSubLedgerProps {
  subLedgerPiutang: any[];
  fetchSubLedgerPiutang: () => Promise<void>;
}

const KOLEKTIBILITAS_COLORS: Record<string, string> = {
  'Lancar': 'bg-green-100 text-green-800 border-green-300',
  'Kurang Lancar': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Diragukan': 'bg-orange-100 text-orange-800 border-orange-300',
  'Macet': 'bg-red-100 text-red-800 border-red-300',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  'Lancar': <CheckCircle className="w-4 h-4 text-green-600" />,
  'Kurang Lancar': <AlertTriangle className="w-4 h-4 text-yellow-600" />,
  'Diragukan': <AlertTriangle className="w-4 h-4 text-orange-600" />,
  'Macet': <XCircle className="w-4 h-4 text-red-600" />,
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sub Ledger Piutang</h2>
            <p className="text-sm text-gray-500">Aging Piutang Anggota (Accounts Receivable)</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Muat Ulang
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Piutang</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{formatRupiah(summary.totalPiutang)}</p>
          <p className="text-xs text-gray-400 mt-1">{summary.count} anggota</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sisa Piutang</p>
          <p className="text-lg font-bold text-orange-600 mt-1">{formatRupiah(summary.totalTunggakan)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Macet</p>
          <p className="text-lg font-bold text-red-600 mt-1">{formatRupiah(summary.totalMacet)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">NPL (%)</p>
          <p className={`text-lg font-bold mt-1 ${summary.npl > 5 ? 'text-red-600' : 'text-green-600'}`}>
            {summary.npl.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari anggota atau no pinjaman..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold">Anggota</th>
                <th className="px-4 py-3 font-semibold">No Pinjaman</th>
                <th className="px-4 py-3 font-semibold text-right">Pokok Piutang</th>
                <th className="px-4 py-3 font-semibold text-right">Sisa Pokok</th>
                <th className="px-4 py-3 font-semibold text-right">Tunggakan (hari)</th>
                <th className="px-4 py-3 font-semibold">Kolektibilitas</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    {loading ? 'Memuat data...' : 'Tidak ada data piutang.'}
                  </td>
                </tr>
              ) : (
                data.map((r, i) => {
                  const kolor = KOLEKTIBILITAS_COLORS[r.kolektibilitas] || 'bg-gray-100 text-gray-700 border-gray-300';
                  return (
                    <tr key={r.anggotaId || r.noPinjaman || i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.anggotaNama}</td>
                      <td className="px-4 py-3 text-gray-600">{r.noPinjaman}</td>
                      <td className="px-4 py-3 text-right text-gray-800">{formatRupiah(r.pokokPiutang)}</td>
                      <td className="px-4 py-3 text-right text-gray-800">{formatRupiah(r.sisaPokok)}</td>
                      <td className="px-4 py-3 text-right text-gray-800">{r.tunggakanHari}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${kolor}`}>
                          {r.kolektibilitas}
                        </span>
                      </td>
                      <td className="px-4 py-3">
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
  );
}
