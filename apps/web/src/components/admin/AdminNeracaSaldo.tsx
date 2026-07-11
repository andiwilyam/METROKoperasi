/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { Scale, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminNeracaSaldoProps {
  neracaSaldo: any[];
  fetchNeracaSaldo: () => Promise<void>;
}

export default function AdminNeracaSaldo({
  neracaSaldo,
  fetchNeracaSaldo
}: AdminNeracaSaldoProps) {
  useEffect(() => {
    fetchNeracaSaldo();
  }, [fetchNeracaSaldo]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const akunAktif = useMemo(
    () => (neracaSaldo || []).filter((a) => (a.debit ?? 0) + (a.kredit ?? 0) > 0),
    [neracaSaldo]
  );

  const totalDebit = useMemo(
    () => akunAktif.reduce((sum, a) => sum + (a.debit ?? 0), 0),
    [akunAktif]
  );

  const totalKredit = useMemo(
    () => akunAktif.reduce((sum, a) => sum + (a.kredit ?? 0), 0),
    [akunAktif]
  );

  const isBalance = Math.abs(totalDebit - totalKredit) < 0.01;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Scale className="w-5 h-5 text-indigo-600" />
              Neraca Saldo (Trial Balance) Koperasi
            </h3>
            <p className="text-[11px] text-slate-400">Ringkasan saldo seluruh akun per periode berjalan</p>
          </div>

          {/* Balance indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              isBalance
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {isBalance ? (
              <>
                <CheckCircle className="w-4 h-4" />
                ✓ Balance
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                ✗ Unbalanced
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Kode Akun</th>
                <th className="p-4">Nama Akun</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-right">Debit</th>
                <th className="p-4 text-right">Kredit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {akunAktif.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada akun dengan saldo.
                  </td>
                </tr>
              ) : (
                akunAktif.map((a) => (
                  <tr key={a.kodeAkun} className="hover:bg-slate-50/20">
                    <td className="p-4 font-mono font-bold text-slate-700">{a.kodeAkun}</td>
                    <td className="p-4 text-slate-800 font-medium">{a.namaAkun}</td>
                    <td className="p-4 text-slate-500">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] uppercase tracking-wide font-semibold text-slate-600">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-700">
                      {a.debit > 0 ? formatIDR(a.debit) : '-'}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-700">
                      {a.kredit > 0 ? formatIDR(a.kredit) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Total row */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                <td className="p-4" colSpan={3}>
                  TOTAL SALDO
                </td>
                <td className="p-4 text-right font-mono text-slate-900">
                  {formatIDR(totalDebit)}
                </td>
                <td className="p-4 text-right font-mono text-slate-900">
                  {formatIDR(totalKredit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom balance status banner */}
        <div
          className={`p-4 rounded-xl text-center text-xs font-bold ${
            isBalance
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {isBalance
            ? '✓ NERACA SEIMBANG — TOTAL DEBIT SAMA DENGAN TOTAL KREDIT'
            : '✗ NERACA TIDAK SEIMBANG — TOTAL DEBIT BERBEDA DENGAN TOTAL KREDIT'}
        </div>
      </div>
    </div>
  );
}
