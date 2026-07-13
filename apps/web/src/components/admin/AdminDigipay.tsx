/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Search, ArrowRightLeft, ShieldCheck, HelpCircle, FileText,
  DollarSign, Activity, Landmark, Plus, X, Sparkles, CheckCircle,
  RefreshCw, ChevronRight, ChevronDown, Eye, Trash2, Edit
} from 'lucide-react';
import { VirtualAccount, VATransaksi, Anggota } from '../../types';

interface AdminDigipayProps {
  virtualAccounts: VirtualAccount[];
  vaTransactions: VATransaksi[];
  members: Anggota[];
  onGenerateVA: (anggotaId: string, bank: VirtualAccount['bank']) => void;
  onSimulateVATransfer: (
    anggotaId: string, 
    bank: string, 
    nomorVA: string, 
    nominal: number, 
    jenisTrx: VATransaksi['jenisTrx']
  ) => void;
}

const BANK_BADGE: Record<string, string> = {
  Mandiri: 'bg-blue-900/10 text-blue-900 border border-blue-900/20',
  BCA: 'bg-sky-500/10 text-sky-800 border border-sky-500/20',
  BRI: 'bg-blue-600/10 text-blue-600 border border-blue-600/20',
  BNI: 'bg-orange-500/10 text-orange-700 border border-orange-500/20',
  Permata: 'bg-purple-500/10 text-purple-700 border border-purple-500/20',
};

const JENIS_TRX_LABEL: Record<string, string> = {
  topup_sukarela: 'Simpanan Sukarela',
  bayar_angsuran: 'Angsuran Pinjaman',
  bayar_cicilan_barang: 'Cicilan Pengadaan',
};

const STATUS_STYLE: Record<string, string> = {
  aktif: 'mc-badge-ok',
  nonaktif: 'mc-btn-danger',
  pending: 'mc-badge-accent',
};

export default function AdminDigipay({
  virtualAccounts,
  vaTransactions,
  members,
  onGenerateVA,
  onSimulateVATransfer
}: AdminDigipayProps) {
  const [activeTab, setActiveTab] = useState<'va' | 'transaksi' | 'simulasi'>('va');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulation Form State
  const [selectedVAId, setSelectedVAId] = useState('');
  const [nominalSim, setNominalSim] = useState(250000);
  const [jenisTrx, setJenisTrx] = useState<VATransaksi['jenisTrx']>('topup_sukarela');
  const [simSuccess, setSimSuccess] = useState(false);

  // Generate VA Form State
  const [showGenModal, setShowGenModal] = useState(false);
  const [selAnggotaId, setSelAnggotaId] = useState('');
  const [selBank, setSelBank] = useState<VirtualAccount['bank']>('Mandiri');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVAId || nominalSim <= 0) return;

    const va = virtualAccounts.find(v => v.id === selectedVAId);
    if (!va) return;

    onSimulateVATransfer(
      va.anggotaId,
      va.bank,
      va.nomorVA,
      nominalSim,
      jenisTrx
    );

    setSimSuccess(true);
    setTimeout(() => {
      setSimSuccess(false);
      setSelectedVAId('');
      setActiveTab('transaksi');
    }, 2000);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAnggotaId) return;

    onGenerateVA(selAnggotaId, selBank);
    setShowGenModal(false);
    setSelAnggotaId('');
  };

  // Stats
  const totalVA = virtualAccounts.length;
  const totalDeposits = vaTransactions
    .filter(t => t.status === 'sukses' && t.jenisTrx === 'topup_sukarela')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const totalTrxCount = vaTransactions.length;

  const filteredVAs = virtualAccounts.filter(v =>
    v.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.nomorVA.includes(searchTerm) ||
    v.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = vaTransactions.filter(t =>
    t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nomorVA.includes(searchTerm) ||
    t.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBankBadgeClass = (bank: string) => BANK_BADGE[bank] || 'mc-border mc-surface-2 mc-muted';
  const getStatusClass = (status: string) => STATUS_STYLE[status] || 'mc-muted';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold mc-ink-strong text-sm flex items-center gap-2">
            <CreditCard className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />
            Digital Payment & Virtual Account (VA)
          </h2>
          <p className="text-[11px] mc-muted">Integrasi setoran auto-detect via Virtual Account Bank BCA, Mandiri, BRI, BNI untuk simpanan instan anggota.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('va')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'va' 
                ? 'mc-btn-primary' 
                : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'
            }`}
          >
            <Landmark className="w-4 h-4" /> Daftar VA Aktif
          </button>
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transaksi' 
                ? 'mc-btn-primary' 
                : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'
            }`}
          >
            <FileText className="w-4 h-4" /> Transaksi VA Terdeteksi
          </button>
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulasi' 
                ? 'mc-btn-primary' 
                : 'mc-surface-2 mc-border mc-ink hover:mc-surface-2/50'
            }`} style={{ background: 'var(--mc-accent)', borderColor: 'var(--mc-accent)', color: 'white' }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" /> Sandbox Simulator
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-icon-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-primary)' }}>
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Virtual Account Aktif</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{totalVA} Account VA</div>
          </div>
        </div>

        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-ok rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-success)', borderColor: 'var(--mc-success)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Total Setoran VA</div>
            <div className="text-lg font-black mc-ink-strong mt-1 font-mono">{formatIDR(totalDeposits)}</div>
          </div>
        </div>

        <div className="mc-card flex items-center gap-4">
          <div className="w-12 h-12 mc-surface-2 mc-badge-accent rounded-xl flex items-center justify-center" style={{ color: 'var(--mc-accent)', borderColor: 'var(--mc-accent)' }}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] mc-muted uppercase tracking-wider font-extrabold">Hit Transaksi VA</div>
            <div className="text-lg font-black mc-ink-strong mt-1">{totalTrxCount} Sukses</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="mc-card overflow-hidden">
        
        {/* Search header & Actions */}
        <div className="p-4 mc-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mc-surface-2/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 mc-muted" />
            <input
              type="text"
              placeholder={activeTab === 'transaksi' ? "Cari riwayat setoran VA..." : "Cari nama anggota atau nomor Virtual Account..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mc-border mc-surface-2 pl-9 pr-4 py-1.5 text-xs rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong"
            />
          </div>
          
          {activeTab === 'va' && (
            <button
              onClick={() => setShowGenModal(true)}
              className="flex items-center justify-center gap-1.5 mc-btn-primary px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Hubungkan VA Baru
            </button>
          )}
        </div>

        {/* TAB 1: DAFTAR VA AKTIF */}
        {activeTab === 'va' && (
          <div className="overflow-x-auto text-xs">
            {filteredVAs.length === 0 ? (
              <div className="text-center py-12 mc-muted">Tidak ada Virtual Account terdaftar.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">Bank Provider</th>
                    <th className="p-4">Nama Pemilik (Anggota)</th>
                    <th className="p-4">Nomor Virtual Account</th>
                    <th className="p-4">Label Peruntukan</th>
                    <th className="p-4">Status Layanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filteredVAs.map((va) => (
                    <tr key={va.id} className="hover:mc-surface-2/20 transition">
                      <td className="p-4 font-bold">
                        <span className={`px-3 py-1 rounded text-[10px] font-extrabold border ${getBankBadgeClass(va.bank)}`}>
                          {va.bank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold mc-ink-strong">{va.anggotaNama}</div>
                        <div className="text-[10px] mc-muted font-mono">Anggota ID: {va.anggotaId}</div>
                      </td>
                      <td className="p-4 font-mono font-bold mc-ink-strong tracking-wider text-[13px]">
                        {va.nomorVA}
                      </td>
                      <td className="p-4 mc-ink font-medium">
                        {va.label}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getStatusClass(va.status)}`}>
                          {va.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: TRANSAKSI MASUK VA */}
        {activeTab === 'transaksi' && (
          <div className="overflow-x-auto text-xs">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 mc-muted">Tidak ada riwayat transfer Virtual Account yang tertangkap gateway.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">Waktu Transaksi</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Bank & No. VA</th>
                    <th className="p-4">Nominal Transfer</th>
                    <th className="p-4">Jenis Alokasi</th>
                    <th className="p-4">Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:mc-surface-2/20 transition">
                      <td className="p-4 font-mono mc-muted">
                        {tx.tanggal}
                        <div className="text-[9px] mc-icon-accent" style={{ color: 'var(--mc-primary)' }}>Ref ID: {tx.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold mc-ink-strong">{tx.anggotaNama}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold mc-ink">{tx.bank}</div>
                        <div className="text-[10px] font-mono mc-muted">VA: {tx.nomorVA}</div>
                      </td>
                      <td className="p-4 font-bold font-mono mc-ink-strong">
                        {formatIDR(tx.nominal)}
                      </td>
                      <td className="p-4">
                        <span className="mc-surface-2 mc-border mc-ink font-semibold px-2 py-0.5 rounded text-[10px]">
                          {JENIS_TRX_LABEL[tx.jenisTrx] || tx.jenisTrx}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="mc-badge-ok px-2 py-0.5 rounded font-extrabold text-[10px]">
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: SANDBOX SIMULATOR GATEWAY */}
        {activeTab === 'simulasi' && (
          <div className="p-6 max-w-lg mx-auto space-y-6">
            <div className="mc-surface-2 mc-border p-4 rounded-xl mc-muted text-xs leading-relaxed" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
              <h4 className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 animate-bounce" style={{ color: 'var(--mc-accent)' }} />
                Skenario Sandbox Simulation
              </h4>
              Papan simulator ini menirukan API push notification dari bank gateway. Memilih Virtual Account dan melangsungkan transfer di sini akan secara instan memicu mutasi kas, memperbarui saldo anggota, dan mencatat pembukuan akuntansi tanpa keterlambatan.
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Pilih Virtual Account Anggota</label>
                <select
                  required
                  value={selectedVAId}
                  onChange={(e) => setSelectedVAId(e.target.value)}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong"
                >
                  <option value="">-- Pilih Virtual Account --</option>
                  {virtualAccounts.map(v => (
                    <option key={v.id} value={v.id}>
                      [{v.bank}] {v.nomorVA} - {v.anggotaNama} ({v.label})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">Nominal Setoran (Rp)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={nominalSim}
                    onChange={(e) => setNominalSim(Number(e.target.value))}
                    className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] font-mono mc-ink-strong font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mc-ink mb-1">Tujuan Transfer</label>
                  <select
                    value={jenisTrx}
                    onChange={(e) => setJenisTrx(e.target.value as any)}
                    className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong font-semibold"
                  >
                    <option value="topup_sukarela">Top Up Simpanan Sukarela</option>
                    <option value="bayar_angsuran">Angsuran Pinjaman</option>
                    <option value="bayar_cicilan_barang">Angsuran Cicilan Barang</option>
                  </select>
                </div>
              </div>

              {simSuccess ? (
                <div className="mc-badge-ok p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse text-xs" style={{ background: 'var(--mc-success-transparent)', borderColor: 'var(--mc-success)', color: 'var(--mc-success)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--mc-success)' }} /> Transfer Berhasil Dikirim ke Gateway Koperasi!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!selectedVAId}
                  className="w-full mc-btn-primary font-bold p-3 rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" /> Kirim Simulasi Transfer Bank
                </button>
              )}
            </form>
          </div>
        )}

      </div>

      {/* MODAL: GENERATE NEW VA */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 mc-border flex justify-between items-center" style={{ background: 'var(--mc-primary)', borderColor: 'var(--mc-border)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Plus className="w-4 h-4 mc-icon-accent" style={{ color: 'var(--mc-accent)' }} />
                Registrasi Virtual Account Anggota
              </h3>
              <button 
                onClick={() => setShowGenModal(false)}
                className="hover:mc-surface-2/30 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Pilih Anggota Koperasi</label>
                <select
                  required
                  value={selAnggotaId}
                  onChange={(e) => setSelAnggotaId(e.target.value)}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong"
                >
                  <option value="">-- Pilih Anggota --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.nama} - [{m.id.toUpperCase()}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Bank Gateway Provider</label>
                <select
                  value={selBank}
                  onChange={(e) => setSelBank(e.target.value as any)}
                  className="w-full mc-border mc-surface-2 p-2.5 rounded-xl mc-focus focus:ring-[var(--mc-accent)] mc-ink-strong font-semibold"
                >
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BCA">Bank Central Asia (BCA)</option>
                  <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                  <option value="BNI">Bank Negara Indonesia (BNI)</option>
                  <option value="Permata">Permata Bank</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 mc-border">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 mc-surface-2 mc-border mc-ink font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 mc-btn-primary font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Generate VA Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}