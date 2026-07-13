/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Percent, TrendingUp, Activity, Gauge } from 'lucide-react';

interface Props {
  laporanRasio: any;
  fetchLaporanRasio: () => Promise<void>;
}

export default function AdminRasio({ laporanRasio, fetchLaporanRasio }: Props) {
  useEffect(() => { fetchLaporanRasio(); }, []);
  const r = laporanRasio || {};

  const rasios = [
    { label: 'CAR (Capital Adequacy Ratio)', value: r.car, unit: '%', desc: 'Rasio Kecukupan Modal', good: '> 8%', color: 'primary' },
    { label: 'NPL (Non-Performing Loan)', value: r.npl, unit: '%', desc: 'Kredit Bermasalah', good: '< 5%', color: 'error' },
    { label: 'ROA (Return on Assets)', value: r.roa, unit: '%', desc: 'Imbal Hasil Aset', good: '> 1.5%', color: 'success' },
    { label: 'ROE (Return on Equity)', value: r.roe, unit: '%', desc: 'Imbal Hasil Ekuitas', good: '> 7%', color: 'primary' },
    { label: 'BOPO', value: r.bopo, unit: '%', desc: 'Beban Ops / Pendapatan Ops', good: '< 85%', color: 'accent' },
    { label: 'LDR (Loan to Deposit)', value: r.ldr, unit: '%', desc: 'Rasio Pinjaman/Simpanan', good: '78-92%', color: 'accent' },
    { label: 'Rasio Likuiditas', value: r.likuiditas, unit: '%', desc: 'Kemampuan Bayar Jk. Pendek', good: '> 100%', color: 'success' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'mc-surface-2 mc-border mc-icon-accent';
      case 'error': return 'mc-surface-2 mc-border' + ' ' + 'mc-btn-danger';
      case 'success': return 'mc-surface-2 mc-border mc-badge-ok';
      case 'accent': return 'mc-surface-2 mc-border mc-badge-accent';
      default: return 'mc-surface-2 mc-border';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'primary': return 'mc-ink-strong';
      case 'error': return 'text-red-600';
      case 'success': return 'mc-ink-strong';
      case 'accent': return 'mc-ink-strong';
      default: return 'mc-ink-strong';
    }
  };

  return (
    <div className="space-y-4">
      <div className="mc-card">
        <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 mc-icon-accent" /> Rasio Keuangan Koperasi (Tingkat Kesehatan)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rasios.map((rs) => (
            <div key={rs.label} className={`border rounded-lg p-4 ${getColorClasses(rs.color)}`} style={{ borderColor: rs.color === 'error' ? 'var(--mc-error)' : rs.color === 'success' ? 'var(--mc-success)' : rs.color === 'accent' ? 'var(--mc-accent)' : 'var(--mc-primary)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold mc-muted">{rs.label}</span>
                <Activity className="w-4 h-4 mc-muted" />
              </div>
              <div className={`text-2xl font-bold ${getTextColor(rs.color)}`}>{rs.value ?? '-'}{rs.unit}</div>
              <div className="text-[10px] mc-muted mt-1">{rs.desc}</div>
              <div className="text-[10px] mt-1 font-medium mc-muted">Standar Sehat: {rs.good}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}