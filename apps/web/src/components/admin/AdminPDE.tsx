/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  laporanPde: {
    totalDebitur?: number;
    totalPiutang?: number;
    lancar?: number;
    macet?: number;
    npl?: string;
    tanggalLaporan?: string;
    dataPde?: any[];
  } | null;
  fetchLaporanPde: () => Promise<void>;
}

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

export default function AdminPDE({ laporanPde, fetchLaporanPde }: Props) {
  useEffect(() => { fetchLaporanPde(); }, []);

  const d = laporanPde || {};

  return (
    <div className="space-y-4">
      <div className="mc-card">
        <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} /> Laporan Kualitas Aktiva Produktif (PDE)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-primary)' }}>
            <div className="text-xs mc-muted">Total Debitur</div>
            <div className="text-xl font-bold mc-ink-strong">{d.totalDebitur || 0}</div>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4">
            <div className="text-xs mc-muted">Total Piutang</div>
            <div className="text-lg font-bold mc-ink-strong">{formatIDR(d.totalPiutang || 0)}</div>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-success)' }}>
            <div className="text-xs mc-muted">Piutang Lancar</div>
            <div className="text-lg font-bold" style={{ color: 'var(--mc-success)' }}>{formatIDR(d.lancar || 0)}</div>
          </div>
          <div className="mc-surface-2 mc-border rounded-lg p-4" style={{ borderColor: 'var(--mc-error)' }}>
            <div className="text-xs mc-muted">Piutang Macet</div>
            <div className="text-lg font-bold" style={{ color: 'var(--mc-error)' }}>{formatIDR(d.macet || 0)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 mc-surface-2 mc-border rounded-lg" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
          <AlertTriangle className="w-6 h-6" style={{ color: 'var(--mc-accent)' }} />
          <div>
            <div className="text-xs mc-muted">Rasio Kredit Bermasalah (NPL)</div>
            <div className="text-2xl font-bold mc-ink-strong">{d.npl || '0%'}</div>
          </div>
          <div className="ml-auto text-xs mc-muted max-w-xs text-right">
            {'Standar sehat KSP: NPL < 5% sesuai Permenkop No. 2/2024'}
          </div>
        </div>
      </div>
    </div>
  );
}