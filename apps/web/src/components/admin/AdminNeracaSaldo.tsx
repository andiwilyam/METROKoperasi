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
      <div className="mc-card space-y-6">
        <div className="border-b mc-border pb-4 flex items-start justify-between">
          <div>
            <h3 className="font-extrabold mc-ink-strong text-sm flex items-center gap-1.5">
              <Scale className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
              Neraca Saldo (Trial Balance) Koperasi
            </h3>
            <p className="text-[11px] mc-muted">Ringkasan saldo seluruh akun per periode berjalan</p>
          </div>

          {/* Balance indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              isBalance
                ? 'mc-badge-ok'
                : 'mc-btn-danger'
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
              <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                <th className="p-4">Kode Akun</th>
                <th className="p-4">Nama Akun</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-right">Debit</th>
                <th className="p-4 text-right">Kredit</th>
              </tr>
            </thead>
            <tbody className="divide-y mc-border">
              {akunAktif.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center mc-muted">
                    Belum ada akun dengan saldo.
                  </td>
                </tr>
              ) : (
                akunAktif.map((a) => (
                  <tr key={a.kodeAkun} className="hover:mc-surface-2/20">
                    <td className="p-4 font-mono font-bold mc-ink-strong">{a.kodeAkun}</td>
                    <td className="p-4 mc-ink font-medium">{a.namaAkun}</td>
                    <td className="p-4 mc-muted">
                      <span className="inline-block px-2 py-0.5 rounded mc-surface-2 mc-border text-[10px] uppercase tracking-wide font-semibold">
                        {a.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono mc-ink-strong">
                      {a.debit > 0 ? formatIDR(a.debit) : '-'}
                    </td>
                    <td className="p-4 text-right font-mono mc-ink-strong">
                      {a.kredit > 0 ? formatIDR(a.kredit) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Total row */}
            <tfoot>
              <tr className="border-t-2 mc-border mc-surface font-bold mc-ink-strong">
                <td className="p-4" colSpan={3}>
                  TOTAL SALDO
                </td>
                <td className="p-4 text-right font-mono mc-ink-strong">
                  {formatIDR(totalDebit)}
                </td>
                <td className="p-4 text-right font-mono mc-ink-strong">
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
              ? 'mc-badge-ok'
              : 'mc-btn-danger'
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