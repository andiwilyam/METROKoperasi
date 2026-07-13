/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, CreditCard, TrendingUp, FileText, Users, Settings, 
  DollarSign, ArrowRightLeft, Sparkles, CheckCircle, X, Plus, Search,
  AlertTriangle, Loader2, Calendar, RefreshCw, ShieldCheck
} from 'lucide-react';
import { CicilanTransaksi, Anggota, Barang } from '../../types';

interface AdminCicilanDashboardProps {
  cicilanList: CicilanTransaksi[];
  members: Anggota[];
  barangList: Barang[];
  onSimulateCicilan: (anggotaId: string, barangId: string, dp: number, tenor: number) => void;
  fetchCicilan: () => Promise<void>;
}

const STATUS_STYLE: Record<string, string> = {
  pengajuan: 'mc-badge-accent',
  disetujui: 'mc-badge-accent',
  dicairkan: 'mc-badge-ok',
  berjalan: 'mc-badge-ok',
  lunas: 'mc-muted',
  ditolak: 'mc-btn-danger',
};

const STATUS_LABEL: Record<string, string> = {
  pengajuan: 'Pengajuan Baru',
  disetujui: 'Disetujui',
  dicairkan: 'Dicairkan',
  berjalan: 'Berjalan',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
};

const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminCicilanDashboard({ cicilanList, members, barangList, onSimulateCicilan, fetchCicilan }: AdminCicilanDashboardProps) {
  const [activeTab, setActiveTab] = useState<'daftar' | 'simulasi'>('daftar');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCicilan(); }, [fetchCicilan]);

  // Simulasi state
  const [selAnggotaId, setSelAnggotaId] = useState('');
  const [selBarangId, setSelBarangId] = useState('');
  const [dp, setDp] = useState(1000000);
  const [tenor, setTenor] = useState(6);
  const [simSuccess, setSimSuccess] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAnggotaId || !selBarangId || dp < 0 || tenor < 1) return;
    onSimulateCicilan(selAnggotaId, selBarangId, dp, tenor);
    setSimSuccess(true);
    setTimeout(() => { setSimSuccess(false); setActiveTab('daftar'); }, 2000);
  };

  const filtered = cicilanList.filter(t =>
    t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.barangNama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCicilan = cicilanList.length;
  const aktif = cicilanList.filter(t => ['dicairkan', 'berjalan'].includes(t.status)).length;
  const lunasCount = cicilanList.filter(t => t.status === 'lunas').length;
  const totalSisa = cicilanList
    .filter(t => ['dicairkan', 'berjalan'].includes(t.status))
    .reduce((s, t) => s + (t.sisaPokok || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <Package className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            Cicilan Pengadaan Barang & Elektronik
          </h2>
          <p className="text-[11px] mc-muted">Pembelian barang cicilan (DP + angsuran) — integrasi stok toko & jurnal akuntansi otomatis.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('daftar')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'daftar' ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`}>
            <FileText className="w-4 h-4" /> Daftar Cicilan
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
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Cicilan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{totalCicilan}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Sedang Berjalan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{aktif}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Lunas Penuh</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{lunasCount}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Sisa Piutang</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{formatIDR(totalSisa)}</div>
          </div>
        </div>
      </div>

      {/* Main Frame */}
      <div className="mc-card overflow-hidden">
        <div className="p-4 mc-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mc-surface-2/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 mc-muted" />
            <input type="text" placeholder="Cari anggota, barang, atau nomor kontrak..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full mc-border mc-surface-2 pl-9 pr-4 py-1.5 text-xs rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong" />
          </div>
        </div>

        {/* TAB: DAFTAR CICILAN */}
        {activeTab === 'daftar' && (
          <div className="overflow-x-auto text-xs">
            {filtered.length === 0 ? (
              <div className="text-center py-12 mc-muted">Belum ada pengajuan cicilan.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">No Kontrak</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Barang Dibeli</th>
                    <th className="p-4 text-right">Harga / DP</th>
                    <th className="p-4 text-center">Tenor / Angsuran</th>
                    <th className="p-4 text-right">Sisa Pokok</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:mc-surface-2/20 transition">
                      <td className="p-4 font-mono font-bold mc-muted">{t.noKontrak}</td>
                      <td className="p-4 font-extrabold mc-ink-strong">{t.anggotaNama}</td>
                      <td className="p-4">
                        <div className="font-semibold mc-ink">{t.barangNama}</div>
                        <div className="text-[10px] mc-muted">Kategori: {t.barangKategori}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold font-mono mc-ink-strong">{formatIDR(t.hargaBarang)}</div>
                        <div className="text-[10px] mc-muted">DP: {formatIDR(t.dp || 0)}</div>
                      </td>
                      <td className="p-4 text-center font-mono mc-muted">
                        {t.tenorBulan} bln<br />
                        <span className="font-bold mc-ink-strong">{formatIDR(t.angsuranPerBulan)} / bln</span>
                      </td>
                      <td className="p-4 text-right font-bold font-mono mc-ink-strong" style={{ color: 'var(--mc-accent)' }}>
                        {formatIDR(t.sisaPokok || 0)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${STATUS_STYLE[t.status] || 'mc-muted'}`}>
                          {STATUS_LABEL[t.status] || t.status}
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
                Sandbox Simulasi Cicilan Baru
              </h4>
              Form ini mensimulasikan pembuatan kontrak cicilan baru. Akan memotong stok barang, mencatat piutang cicilan, dan membuat jurnal akuntansi otomatis.
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
                <label className="block font-semibold mc-ink mb-1">Pilih Barang (Stok Tersedia)</label>
                <select required value={selBarangId} onChange={e => setSelBarangId(e.target.value)} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong">
                  <option value="">-- Pilih Barang --</option>
                  {barangList.filter(b => b.stok > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nama} (Stok: {b.stok} | {formatIDR(b.hargaJual)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">Uang Muka / DP (Rp)</label>
                  <input type="number" required min="0" value={dp} onChange={e => setDp(Number(e.target.value))} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold" />
                </div>
                <div>
                  <label className="block font-semibold mc-ink mb-1">Tenor (Bulan)</label>
                  <input type="number" required min="1" max="36" value={tenor} onChange={e => setTenor(Number(e.target.value))} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold" />
                </div>
              </div>

              {simSuccess ? (
                <div className="mc-badge-ok p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse text-xs" style={{ background: 'var(--mc-success-transparent)', borderColor: 'var(--mc-success)', color: 'var(--mc-success)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--mc-success)' }} /> Kontrak Cicilan Berhasil Dibuat!
                </div>
              ) : (
                <button type="submit" disabled={!selAnggotaId || !selBarangId || loading} className="w-full mc-btn-primary font-bold p-3 rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowRightLeft className="w-4 h-4" /> {loading ? 'Memproses...' : 'Buat Kontrak Cicilan'}
                </button>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}