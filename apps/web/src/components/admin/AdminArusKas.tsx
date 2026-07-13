/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { JournalEntry } from '@metrocoop/shared/types';

interface Props {
  laporanLabarugi: any;
  fetchLaporanLabarugi: (s?: string, e?: string) => Promise<void>;
  journals: JournalEntry[];
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
      <div className="mc-card">
        <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 mc-icon-accent" /> Laporan Arus Kas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-success)' }}>
            <div className="flex items-center gap-2 mb-1"><ArrowDownCircle className="w-4 h-4" style={{ color: 'var(--mc-success)' }} /><span className="text-xs mc-muted">Kas Masuk</span></div>
            <div className="text-lg font-bold" style={{ color: 'var(--mc-success)' }}>{formatIDR(kasMasuk)}</div>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-error)' }}>
            <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4" style={{ color: 'var(--mc-error)' }} /><span className="text-xs mc-muted">Kas Keluar</span></div>
            <div className="text-lg font-bold" style={{ color: 'var(--mc-error)' }}>{formatIDR(kasKeluar)}</div>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: arusBersih >= 0 ? 'var(--mc-primary)' : 'var(--mc-accent)' }}>
            <div className="text-xs mc-muted mb-1">Arus Kas Bersih</div>
            <div className="text-lg font-bold" style={{ color: arusBersih >= 0 ? 'var(--mc-primary)' : 'var(--mc-accent)' }}>{formatIDR(arusBersih)}</div>
          </div>
        </div>
        <div className="mt-4 text-[11px] mc-muted">
          Arus kas dihitung dari seluruh mutasi akun Kas & Bank (kode akun 1.1.0x) pada jurnal umum.
        </div>
      </div>
    </div>
  );
}