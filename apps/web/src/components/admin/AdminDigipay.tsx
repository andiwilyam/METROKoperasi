/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Search, ArrowRightLeft, ShieldCheck, HelpCircle, FileText,
  DollarSign, Activity, Landmark, Plus, X, Sparkles, CheckCircle
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

  const getBankBadgeColor = (bank: string) => {
    switch (bank.toUpperCase()) {
      case 'MANDIRI': return 'bg-blue-900/10 text-blue-900 border border-blue-900/20';
      case 'BCA': return 'bg-sky-500/10 text-sky-800 border border-sky-500/20';
      case 'BRI': return 'bg-blue-600/10 text-blue-600 border border-blue-600/20';
      case 'BNI': return 'bg-orange-500/10 text-orange-700 border border-orange-500/20';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Digital Payment &amp; Virtual Account (VA)
          </h2>
          <p className="text-xs text-slate-400">Integrasi setoran auto-detect via Virtual Account Bank BCA, Mandiri, BRI, BNI untuk simpanan instan anggota.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('va')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'va' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-4 h-4" /> Daftar VA Aktif
          </button>
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transaksi' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Transaksi VA Terdeteksi
          </button>
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulasi' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" /> Sandbox Simulator
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Virtual Account Aktif</div>
            <div className="text-lg font-black text-slate-800 mt-1">{totalVA} Account VA</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Setoran VA</div>
            <div className="text-lg font-black text-slate-800 mt-1 font-mono">{formatIDR(totalDeposits)}</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Hit Transaksi VA</div>
            <div className="text-lg font-black text-slate-800 mt-1">{totalTrxCount} Sukses</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Search header & Actions */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'transaksi' ? "Cari riwayat setoran VA..." : "Cari nama anggota atau nomor Virtual Account..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>
          
          {activeTab === 'va' && (
            <button
              onClick={() => setShowGenModal(true)}
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Hubungkan VA Baru
            </button>
          )}
        </div>

        {/* TAB 1: DAFTAR VA AKTIF */}
        {activeTab === 'va' && (
          <div className="overflow-x-auto text-xs">
            {filteredVAs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada Virtual Account terdaftar.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Bank Provider</th>
                    <th className="p-4">Nama Pemilik (Anggota)</th>
                    <th className="p-4">Nomor Virtual Account</th>
                    <th className="p-4">Label Peruntukan</th>
                    <th className="p-4">Status Layanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVAs.map((va) => (
                    <tr key={va.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold">
                        <span className={`px-3 py-1 rounded text-[10px] font-extrabold ${getBankBadgeColor(va.bank)}`}>
                          {va.bank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{va.anggotaNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Anggota ID: {va.anggotaId}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 tracking-wider text-[13px]">
                        {va.nomorVA}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {va.label}
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
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
              <div className="text-center py-12 text-slate-400">Tidak ada riwayat transfer Virtual Account yang tertangkap gateway.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Waktu Transaksi</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Bank &amp; No. VA</th>
                    <th className="p-4">Nominal Transfer</th>
                    <th className="p-4">Jenis Alokasi</th>
                    <th className="p-4">Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-slate-400">
                        {tx.tanggal}
                        <div className="text-[9px] text-indigo-500">Ref ID: {tx.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{tx.anggotaNama}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{tx.bank}</div>
                        <div className="text-[10px] font-mono text-slate-400">VA: {tx.nomorVA}</div>
                      </td>
                      <td className="p-4 font-bold font-mono text-slate-950">
                        {formatIDR(tx.nominal)}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 border text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                          {tx.jenisTrx === 'topup_sukarela' ? 'Simpanan Sukarela' : 
                           tx.jenisTrx === 'bayar_angsuran' ? 'Angsuran Pinjaman' : 'Cicilan Pengadaan'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-extrabold text-[10px]">
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
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-xs leading-relaxed">
              <h4 className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 animate-bounce" />
                Skenario Sandbox Simulation
              </h4>
              Papan simulator ini menirukan API push notification dari bank gateway. Memilih Virtual Account dan melangsungkan transfer di sini akan secara instan memicu mutasi kas, memperbarui saldo anggota, dan mencatat pembukuan akuntansi tanpa keterlambatan.
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Pilih Virtual Account Anggota</label>
                <select
                  required
                  value={selectedVAId}
                  onChange={(e) => setSelectedVAId(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
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
                  <label className="block font-semibold text-slate-600 mb-1">Nominal Setoran (Rp)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={nominalSim}
                    onChange={(e) => setNominalSim(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white font-mono text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tujuan Transfer</label>
                  <select
                    value={jenisTrx}
                    onChange={(e) => setJenisTrx(e.target.value as any)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  >
                    <option value="topup_sukarela">Top Up Simpanan Sukarela</option>
                    <option value="bayar_angsuran">Angsuran Pinjaman</option>
                    <option value="bayar_cicilan_barang">Angsuran Cicilan Barang</option>
                  </select>
                </div>
              </div>

              {simSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-center gap-2 font-bold animate-pulse text-xs">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Transfer Berhasil Dikirim ke Gateway Koperasi!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!selectedVAId}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 bg-indigo-950 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Registrasi Virtual Account Anggota
              </h3>
              <button 
                onClick={() => setShowGenModal(false)}
                className="hover:bg-indigo-900 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Pilih Anggota Koperasi</label>
                <select
                  required
                  value={selAnggotaId}
                  onChange={(e) => setSelAnggotaId(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="">-- Pilih Anggota --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.nama} - [{m.id.toUpperCase()}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Bank Gateway Provider</label>
                <select
                  value={selBank}
                  onChange={(e) => setSelBank(e.target.value as any)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                >
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BCA">Bank Central Asia (BCA)</option>
                  <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                  <option value="BNI">Bank Negara Indonesia (BNI)</option>
                  <option value="Permata">Permata Bank</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
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
