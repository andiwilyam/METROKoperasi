/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { ScrollText, Clock, RotateCcw, FileText, CheckCircle } from 'lucide-react';

interface AdminAuditTrailProps {
  journals: any[];
  fetchJournals: () => Promise<void>;
}

const SUMBER_STYLE: Record<string, string> = {
  Manual: 'mc-badge-accent',
  Reversing: 'mc-btn-danger',
  Simpanan: 'mc-badge-accent',
  Pinjaman: 'mc-badge-accent',
  Toko: 'mc-badge-ok',
  PPOB: 'mc-badge-accent',
};

export default function AdminAuditTrail({ journals, fetchJournals }: AdminAuditTrailProps) {
  useEffect(() => { fetchJournals(); }, [fetchJournals]);

  const sorted = useMemo(
    () => [...(journals || [])].sort((a, b) => (b.tanggal > a.tanggal ? 1 : -1)).slice(0, 100),
    [journals]
  );

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(num || 0);

  return (
    <div className="space-y-4">
      <div className="mc-card">
        <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
          Audit Trail Jurnal
        </h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="mc-muted text-center py-8 text-xs">Belum ada aktivitas jurnal</p>
          ) : (
            sorted.map((j) => (
              <div key={j.id} className="flex items-center gap-3 p-3 mc-border rounded-lg hover:mc-surface-2/50">
                <div className="w-9 h-9 rounded-full mc-surface-2 flex items-center justify-center flex-shrink-0">
                  {j.sumber === 'Reversing' ? (
                    <RotateCcw className="w-4 h-4 mc-btn-danger" />
                  ) : (
                    <Clock className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] mc-muted">{j.noJurnal}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${SUMBER_STYLE[j.sumber] || 'mc-muted'}`}>
                      {j.sumber}
                    </span>
                  </div>
                  <p className="text-xs mc-ink truncate">{j.keterangan}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold mc-ink-strong">{formatIDR(j.debit || 0)}</div>
                  <div className="text-[10px] mc-muted">
                    {j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}