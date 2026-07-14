import React, { useState, useEffect, useMemo } from 'react';
import {
  Home, Search, FileText, DollarSign, Calendar, AlertTriangle, CheckCircle,
  XCircle, AlertCircle, Sparkles, Building2, Users, ShieldCheck, RefreshCw
} from 'lucide-react';
import { Anggota } from '@metrocoop/shared/types';

interface AdminSewaProps {
  sewaList?: any[];
  members?: Anggota[];
  perusahaan?: any[];
  onSimulateSewa?: (anggotaId: string, perusahaanId: string, dp: number, tenor: number) => void;
  fetchSewa?: () => Promise<void>;
  assets?: any[];
  transactions?: any[];
  onAddAsset?: (newAsset: Omit<any, 'id'>) => void;
  onUpdateAsset?: (updated: any) => void;
  onDeleteAsset?: (id: string) => void;
  onApproveSewa?: (id: string) => void;
  onRejectSewa?: (id: string) => void;
  onFinishSewa?: (id: string, denda: number) => void;
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
  pengajuan: 'Pengajuan',
  disetujui: 'Disetujui',
  dicairkan: 'Dicairkan',
  berjalan: 'Berjalan',
  lunas: 'Lunas',
  ditolak: 'Ditolak',
};

const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function AdminSewa(props: AdminSewaProps) {
  const sewaList = props.sewaList || props.assets || [];
  const members = props.members || [];
  const perusahaan = props.perusahaan || [];
  const onSimulateSewa = props.onSimulateSewa || (() => {});
  const fetchSewa = props.fetchSewa || (() => {});

  const [activeTab, setActiveTab] = useState<'daftar' | 'simulasi'>('daftar');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSewa(); }, [fetchSewa]);

  const [selAnggotaId, setSelAnggotaId] = useState('');
  const [selPerusahaanId, setSelPerusahaanId] = useState('');
  const [dp, setDp] = useState(5000000);
  const [tenor, setTenor] = useState(12);
  const [simSuccess, setSimSuccess] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAnggotaId || !selPerusahaanId || dp < 0 || tenor < 1) return;
    onSimulateSewa(selAnggotaId, selPerusahaanId, dp, tenor);
    setSimSuccess(true);
    setTimeout(() => { setSimSuccess(false); setActiveTab('daftar'); }, 2000);
  };

  const filtered = useMemo(() =>
    sewaList.filter((t: any) =>
      (t.anggotaNama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.perusahaanNama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.noKontrak || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [sewaList, searchTerm]
  );

  const totalSewa = sewaList.length;
  const aktif = sewaList.filter((t: any) => ['dicairkan', 'berjalan'].includes(t.status)).length;
  const lunasCount = sewaList.filter((t: any) => t.status === 'lunas').length;
  const totalSisa = sewaList
    .filter((t: any) => ['dicairkan', 'berjalan'].includes(t.status))
    .reduce((s: number, t: any) => s + (t.sisaPokok || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <Home className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            Sewa Guna Usaha (Asset Rental)
          </h2>
          <p className="text-[11px] mc-muted">Pembiayaan aset & properti — integrasi jurnal & stok toko otomatis.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('daftar')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'daftar' ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`}>
            <FileText className="w-4 h-4" /> Daftar Sewa
          </button>
          <button onClick={() => setActiveTab('simulasi')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'simulasi' ? 'mc-btn-primary' : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'}`} style={{ background: 'var(--mc-accent)', borderColor: 'var(--mc-accent)', color: 'white' }}>
            <Sparkles className="w-4 h-4 animate-pulse" /> Sandbox Simulator
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-primary)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Kontrak</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{totalSewa}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-accent)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Sedang Berjalan</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{aktif}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-success)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Lunas Penuh</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{lunasCount}</div>
          </div>
        </div>
        <div className="mc-card flex items-center gap-4" style={{ borderColor: 'var(--mc-accent)' }}>
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
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
            <input type="text" placeholder="Cari anggota, perusahaan, atau nomor kontrak..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full mc-border mc-surface-2 pl-9 pr-4 py-1.5 text-xs rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong" />
          </div>
        </div>

        {activeTab === 'daftar' && (
          <div className="overflow-x-auto text-xs">
            {filtered.length === 0 ? (
              <div className="text-center py-12 mc-muted">Belum ada kontrak sewa guna usaha.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">No Kontrak</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Perusahaan / Aset</th>
                    <th className="p-4 text-right">Harga / DP</th>
                    <th className="p-4 text-center">Tenor / Angsuran</th>
                    <th className="p-4 text-right">Sisa Pokok</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filtered.map((t: any) => (
                    <tr key={t.id} className="hover:mc-surface-2/20 transition">
                      <td className="p-4 font-mono font-bold mc-muted">{t.noKontrak}</td>
                      <td className="p-4 font-extrabold mc-ink-strong">{t.anggotaNama}</td>
                      <td className="p-4">
                        <div className="font-semibold mc-ink">{t.perusahaanNama}</div>
                        <div className="text-[10px] mc-muted">{t.asetNama || 'Aset'}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold font-mono mc-ink-strong">{formatIDR(t.hargaAset)}</div>
                        <div className="text-[10px] mc-muted">DP: {formatIDR(t.dp || 0)}</div>
                      </td>
                      <td className="p-4 text-center font-mono mc-muted">
                        {t.tenorBulan} bln<br />
                        <span className="font-bold mc-ink-strong">{formatIDR(t.angsuranPerBulan)} / bln</span>
                      </td>
                      <td className="p-4 text-right font-bold font-mono" style={{ color: 'var(--mc-accent)' }}>
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

        {activeTab === 'simulasi' && (
          <div className="p-6 max-w-lg mx-auto space-y-6">
            <div className="mc-surface-2 mc-border p-4 rounded-xl mc-muted text-xs leading-relaxed" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
              <h4 className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 animate-bounce" style={{ color: 'var(--mc-accent)' }} />
                Sandbox Simulasi Sewa Guna Usaha
              </h4>
              Form ini mensimulasikan pembuatan kontrak sewa baru. Akan memotong stok aset, mencatat piutang sewa, dan membuat jurnal akuntansi otomatis.
            </div>

            <form onSubmit={handleSimulate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Pilih Anggota</label>
                <select required value={selAnggotaId} onChange={e => setSelAnggotaId(e.target.value)} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong">
                  <option value="">-- Pilih Anggota --</option>
                  {members.map((m: Anggota) => <option key={m.id} value={m.id}>{m.nama} - [{m.id.toUpperCase()}]</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Pilih Perusahaan / Aset</label>
                <select required value={selPerusahaanId} onChange={e => setSelPerusahaanId(e.target.value)} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong">
                  <option value="">-- Pilih Perusahaan --</option>
                  {perusahaan.map((p: any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">Uang Muka / DP (Rp)</label>
                  <input type="number" required min="0" value={dp} onChange={e => setDp(Number(e.target.value))} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold" />
                </div>
                <div>
                  <label className="block font-semibold mc-ink mb-1">Tenor (Bulan)</label>
                  <input type="number" required min="1" max="60" value={tenor} onChange={e => setTenor(Number(e.target.value))} className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold" />
                </div>
              </div>

              {simSuccess ? (
                <div className="mc-badge-ok p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse text-xs" style={{ background: 'var(--mc-success-transparent)', borderColor: 'var(--mc-success)', color: 'var(--mc-success)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--mc-success)' }} /> Kontrak Sewa Berhasil Dibuat!
                </div>
              ) : (
                <button type="submit" disabled={!selAnggotaId || !selPerusahaanId || loading} className="w-full mc-btn-primary font-bold p-3 rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  <Building2 className="w-4 h-4" /> {loading ? 'Memproses...' : 'Buat Kontrak Sewa'}
                </button>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
