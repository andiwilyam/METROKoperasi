/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { 
  Building2, TrendingUp, DollarSign, CreditCard, CheckCircle, XCircle, 
  AlertTriangle, Search, FileText, Sparkles, BarChart3, Percent, Scale
} from 'lucide-react';
import { Perusahaan } from '../../types';

interface AdminVentureDashboardProps {
  perusahaanList: Perusahaan[];
  fetchPerusahaan: () => Promise<void>;
}

const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminVentureDashboard({ perusahaanList, fetchPerusahaan }: AdminVentureDashboardProps) {
  useEffect(() => { fetchPerusahaan(); }, [fetchPerusahaan]);

  const stats = useMemo(() => {
    const list = perusahaanList || [];
    const total = list.length;
    const layak = list.filter(p => p.status === 'layak').length;
    const tidakLayak = list.filter(p => ['tidak_layak', 'ditolak'].includes(p.status)).length;
    const dalamProses = list.filter(p => ['draft', 'proses_analisis', 'selesai_skoring'].includes(p.status)).length;
    const totalPlafon = list.reduce((s, p) => s + (p.plafonDisetujui || 0), 0);
    const totalOutstanding = list.reduce((s, p) => s + (p.outstanding || 0), 0);
    return { total, layak, tidakLayak, dalamProses, totalPlafon, totalOutstanding };
  }, [perusahaanList]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <Building2 className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            Ventura Dashboard — Portfolio Pembiayaan
          </h2>
          <p className="text-[11px] mc-muted">Overview performa kredit ventura dan kesehatan portofolio perusahaan.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-primary)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Perusahaan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{stats.total}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-success)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Layak Disalurkan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{stats.layak}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-error)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-btn-danger rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-error)', borderColor: 'var(--mc-error)' }}>
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Tidak Layak</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{stats.tidakLayak}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-accent)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Dalam Proses</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{stats.dalamProses}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-primary)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Plafon Disetujui</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{formatIDR(stats.totalPlafon)}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-accent)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Outstanding Saat Ini</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{formatIDR(stats.totalOutstanding)}</div>
          </div>
        </div>
      </div>

      {/* Company List */}
      <div className="mc-card overflow-hidden">
        <div className="p-4 mc-border font-bold mc-ink-strong text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
          Daftar Perusahaan Ventura
        </div>

        <div className="overflow-x-auto text-xs">
          {perusahaanList.length === 0 ? (
            <div className="text-center py-12 mc-muted">Belum ada data perusahaan.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                  <th className="p-4">Nama Perusahaan</th>
                  <th className="p-4">Sektor Industri</th>
                  <th className="p-4">Direktur</th>
                  <th className="p-4 text-right">Plafon Disetujui</th>
                  <th className="p-4 text-right">Outstanding</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Skor Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y mc-border">
                {perusahaanList.map((p) => (
                  <tr key={p.id} className="hover:mc-surface-2/20 transition">
                    <td className="p-4 font-extrabold mc-ink-strong">{p.nama}</td>
                    <td className="p-4 mc-ink">{p.sektorIndustri}</td>
                    <td className="p-4 mc-ink">{p.namaDirektur}</td>
                    <td className="p-4 text-right font-bold font-mono mc-ink-strong">{formatIDR(p.plafonDisetujui || 0)}</td>
                    <td className="p-4 text-right font-bold font-mono" style={{ color: 'var(--mc-accent)' }}>{formatIDR(p.outstanding || 0)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'layak' ? 'mc-badge-ok' :
                        p.status === 'tidak_layak' ? 'mc-btn-danger' :
                        p.status === 'ditolak' ? 'mc-btn-danger' :
                        'mc-badge-accent'
                      }`}>
                        {p.status === 'layak' ? 'LAYAK' :
                         p.status === 'tidak_layak' ? 'TIDAK LAYAK' :
                         p.status === 'ditolak' ? 'DITOLAK' :
                         p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.skorKredit != null ? (
                        <span className={`font-extrabold ${p.skorKredit >= 80 ? 'mc-badge-ok' : p.skorKredit >= 60 ? 'mc-badge-accent' : 'mc-btn-danger'}`}>
                          {p.skorKredit}
                        </span>
                      ) : (
                        <span className="mc-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}