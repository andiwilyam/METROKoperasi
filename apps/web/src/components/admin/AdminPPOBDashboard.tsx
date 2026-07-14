/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wifi, Smartphone, CreditCard, TrendingUp, FileText, Users, Settings, 
  DollarSign, ArrowRightLeft, Sparkles, CheckCircle, X, Plus, Search,
  AlertTriangle, Loader2, Heart, Droplets, Coins
} from 'lucide-react';
import { Anggota } from '@metrocoop/shared/types';

interface AdminPPOBDashboardProps {
  ppobTransactions: any[];
  members: Anggota[];
  onSimulatePPOB: (anggotaId: string, produkId: string, nominal: number) => void;
  fetchPPOB: () => Promise<void>;
}

const KATEGORI_PPOB = [
  { id: 'pulsa', label: 'Pulsa & Data', icon: Smartphone, color: 'text-purple-600' },
  { id: 'pln', label: 'PLN Prabayar', icon: Wifi, color: 'text-yellow-600' },
  { id: 'bpjs', label: 'BPJS Kesehatan', icon: Heart, color: 'text-red-600' },
  { id: 'pdam', label: 'PDAM Air', icon: Droplets, color: 'text-blue-600' },
  { id: 'internet', label: 'Internet Rumah', icon: Wifi, color: 'text-indigo-600' },
  { id: 'emas', label: 'Top Up Emas Digital', icon: Coins, color: 'text-amber-600' },
];

const STATUS_STYLE: Record<string, string> = {
  sukses: 'mc-badge-ok',
  pending: 'mc-badge-accent',
  gagal: 'mc-btn-danger',
  batal: 'mc-muted',
};

const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminPPOBDashboard({ ppobTransactions, members, onSimulatePPOB, fetchPPOB }: AdminPPOBDashboardProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'simulasi'>('daftar');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPPOB(); }, [fetchPPOB]);

  // Simulasi state
  const [selAnggotaId, setSelAnggotaId] = useState('');
  const [selProduk, setSelProduk] = useState('pulsa');
  const [nominal, setNominal] = useState(50000);
  const [simSuccess, setSimSuccess] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAnggotaId || nominal <= 0) return;
    onSimulatePPOB(selAnggotaId, selProduk, nominal);
    setSimSuccess(true);
    setTimeout(() => { setSimSuccess(false); setActiveTab('daftar'); }, 2000);
  };

  const filtered = ppobTransactions.filter(t =>
    t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nomorTujuan.includes(searchTerm)
  );

  const today = ppobTransactions.filter(t => t.tanggal === new Date().toISOString().split('T')[0]);
  const totalHariIni = today.reduce((s, t) => s + (t.status === 'sukses' ? t.nominal : 0), 0);
  const totalSukses = ppobTransactions.filter(t => t.status === 'sukses').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <Smartphone className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            PPOB Multi-Provider Gateway
          </h2>
          <p className="text-[11px] mc-muted">Pulsa, Data, PLN, BPJS, PDAM, Internet, Emas Digital — auto-bukukan ke jurnal akuntansi.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('daftar')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'daftar' ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`}>
            <FileText className="w-4 h-4" /> Riwayat Transaksi
          </button>
          <button onClick={() => setActiveTab('simulasi')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'simulasi' ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`} style={{ background: 'var(--mc-accent)', borderColor: 'var(--mc-accent)', color: 'white' }}>
            <Sparkles className="w-4 h-4 animate-pulse" /> Sandbox Simulator
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Transaksi Hari Ini</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{today.length} Trx</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Sukses</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{totalSukses}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Omset PPOB Hari Ini</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{formatIDR(totalHariIni)}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)' }}>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Rate Keberhasilan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{totalSukses > 0 ? `${Math.round((totalSukses / ppobTransactions.length) * 100)}%` : '0%'}</div>
          </div>
        </div>
      </div>

      {/* Main Frame */}
      <div className="mc-card overflow-hidden">
        <div className="p-4 mc-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mc-surface-2/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 mc-muted" />
            <input type="text" placeholder="Cari transaksi, nomor tujuan, atau produk..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full mc-border mc-surface-2 pl-9 pr-4 py-1.5 text-xs rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong" />
          </div>
        </div>

        {/* TAB: DAFTAR TRANSAKSI */}
        {activeTab === 'daftar' && (
          <div className="overflow-x-auto text-xs">
            {filtered.length === 0 ? (
              <div className="text-center py-12 mc-muted">Belum ada transaksi PPOB.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">Waktu</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Produk & Kategori</th>
                    <th className="p-4">Nomor Tujuan</th>
                    <th className="p-4 text-right">Nominal</th>
                    <th className="p-4 text-right">Fee Admin</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:mc-surface-2/20 transition">
                      <td className="p-4 font-mono mc-muted">{t.tanggal}<div className="text-[9px] mc-icon-accent" style={{ color: 'var(--mc-primary)' }}>Ref: {t.id}</div></td>
                      <td className="p-4 font-extrabold mc-ink-strong">{t.anggotaNama}</td>
                      <td className="p-4">
                        <div className="font-semibold mc-ink">{t.produk}</div>
                        <div className="text-[10px] mc-muted">{t.kategori}</div>
                      </td>
                      <td className="p-4 font-mono mc-ink">{t.nomorTujuan}</td>
                      <td className="p-4 text-right font-bold font-mono mc-ink-strong">{formatIDR(t.nominal)}</td>
                      <td className="p-4 text-right font-mono mc-muted">{formatIDR(t.feeAdmin || 0)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${STATUS_STYLE[t.status] || 'mc-muted'}`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB: SANDBOX SIMULATOR */}
        {activeTab === 'simulasi' && (
          <div className="p-6 max-w-lg mx-auto space-y-6">
            <div className="mc-surface-2 mc-border p-4 rounded-xl mc-muted text-xs leading-relaxed" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
              <h4 className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 animate-bounce" style={{ color: 'var(--mc-accent)' }} />
                Sandbox Simulasi Transaksi PPOB
              </h4>
              Form ini meniru alur API ke penyedia layanan (Midtrans, Flip, dll). Setoran sukses akan langsung memotong saldo kas anggota dan mencatat jurnal otomatis.
            </div>

            <form onSubmit={handleSimulate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Pilih Anggota</label>
                <select required value={selAnggotaId} onChange={e => setSelAnggotaId(e.target.value)} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong">
                  <option value="">-- Pilih Anggota --</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.nama} - [{m.id.toUpperCase()}]</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Produk PPOB</label>
                <select value={selProduk} onChange={e => setSelProduk(e.target.value)} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong">
                  {KATEGORI_PPOB.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Nominal (Rp)</label>
                <input type="number" required min="5000" value={nominal} onChange={e => setNominal(Number(e.target.value))} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold" />
              </div>

              {simSuccess ? (
                <div className="mc-badge-ok p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse text-xs" style={{ background: 'var(--mc-success-transparent)', borderColor: 'var(--mc-success)', color: 'var(--mc-success)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--mc-success)' }} /> Transaksi PPOB Sukses Dikirim ke Gateway!
                </div>
              ) : (
                <button type="submit" disabled={!selAnggotaId || loading} className="w-full mc-btn-primary font-bold p-3 rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowRightLeft className="w-4 h-4" /> {loading ? 'Memproses...' : 'Kirim Simulasi ke Gateway'}
                </button>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}