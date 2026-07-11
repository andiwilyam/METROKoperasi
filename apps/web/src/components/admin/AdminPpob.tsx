/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Tv, Search, Percent, Smartphone, Zap, Droplet, Heart, CheckCircle2,
  AlertCircle, ShieldAlert, TrendingUp, DollarSign, FileText, Settings, ToggleLeft, X
} from 'lucide-react';
import { PpobLayanan, PpobTransaksi } from '../../types';

interface AdminPpobProps {
  services: PpobLayanan[];
  transactions: PpobTransaksi[];
  onToggleService: (id: string) => void;
  onUpdateServicePrices: (id: string, nominalMin: number, nominalMax: number) => void;
}

export default function AdminPpob({
  services,
  transactions,
  onToggleService,
  onUpdateServicePrices
}: AdminPpobProps) {
  const [activeTab, setActiveTab] = useState<'transaksi' | 'layanan'>('transaksi');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<PpobLayanan | null>(null);

  // Editing state
  const [minNom, setMinNom] = useState(0);
  const [maxNom, setMaxNom] = useState(0);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateServicePrices(editingService.id, minNom, maxNom);
    setEditingService(null);
  };

  const startEdit = (s: PpobLayanan) => {
    setEditingService(s);
    setMinNom(s.nominalMin);
    setMaxNom(s.nominalMax);
  };

  // Stats
  const totalTrxCount = transactions.length;
  const totalVolume = transactions
    .filter(t => t.status === 'sukses')
    .reduce((acc, curr) => acc + curr.hargaJual, 0);
  const totalProfit = transactions
    .filter(t => t.status === 'sukses')
    .reduce((acc, curr) => acc + (curr.hargaJual - curr.hargaKoperasi), 0);
  const pendingTrx = transactions.filter(t => t.status === 'proses').length;

  const filteredServices = services.filter(s =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tipe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.layananNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.targetNumber.includes(searchTerm)
  );

  const getServiceIcon = (tipe: string) => {
    switch (tipe.toLowerCase()) {
      case 'voucher': return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'listrik': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'tagihan': return <Droplet className="w-4 h-4 text-teal-500" />;
      default: return <Tv className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Tv className="w-5 h-5 text-indigo-600" />
            PPOB (Payment Point Online Bank)
          </h2>
          <p className="text-xs text-slate-400">Pembelian Token Listrik, Pulsa Seluler, PDAM, dan pembayaran iuran BPJS Kesehatan terintegrasi loket.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transaksi' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Riwayat Transaksi PPOB
          </button>
          <button
            onClick={() => setActiveTab('layanan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'layanan' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" /> Atur Parameter Layanan
          </button>
        </div>
      </div>

      {/* Stats Dashboard Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Transaksi Terproses</div>
            <div className="text-lg font-black text-slate-800 mt-1">{totalTrxCount} Kali</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Volume Penjualan</div>
            <div className="text-lg font-black text-slate-800 mt-1 font-mono">{formatIDR(totalVolume)}</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-semibold">Margin Keuntungan Koperasi</div>
            <div className="text-lg font-black text-amber-600 mt-1 font-mono">{formatIDR(totalProfit)}</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Antrean Proses</div>
            <div className="text-lg font-black text-slate-800 mt-1">{pendingTrx} Antrean</div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'layanan' ? "Cari nama layanan..." : "Cari nama anggota, no handphone, no meter..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* TAB 1: LOG TRANSAKSI */}
        {activeTab === 'transaksi' && (
          <div className="overflow-x-auto text-xs">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada log pembelian PPOB yang terekam.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Tanggal / Ref</th>
                    <th className="p-4">Nama Anggota</th>
                    <th className="p-4">Produk PPOB</th>
                    <th className="p-4">Nomor Pelanggan / HP</th>
                    <th className="p-4">Nominal / Jual</th>
                    <th className="p-4">Margin Laba</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">SN / Token PLN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-slate-400">
                        <div>{tx.tanggal}</div>
                        <div className="text-[9px] text-indigo-500">Ref: {tx.noReferensi}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {tx.anggotaNama}
                        <div className="text-[10px] text-slate-400 font-normal">ID: {tx.anggotaId}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          {getServiceIcon(tx.layananNama.includes('Token') ? 'listrik' : tx.layananNama.includes('PDAM') ? 'tagihan' : 'voucher')}
                          <span>{tx.layananNama}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-600">
                        {tx.targetNumber}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-400 text-[10px]">Nominal: {formatIDR(tx.nominal)}</div>
                        <div className="font-bold font-mono text-slate-900">{formatIDR(tx.hargaJual)}</div>
                      </td>
                      <td className="p-4 font-bold font-mono text-emerald-600">
                        +{formatIDR(tx.hargaJual - tx.hargaKoperasi)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          tx.status === 'sukses' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : tx.status === 'proses' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {tx.status === 'sukses' ? 'Berhasil' : tx.status === 'proses' ? 'Diproses' : 'Gagal'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500 italic max-w-xs truncate">
                        {tx.sn || 'SN Belum Terbit'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: ATUR PARAMETER LAYANAN */}
        {activeTab === 'layanan' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Nama Layanan</th>
                  <th className="p-4">Jenis</th>
                  <th className="p-4">Keterbatasan Nominal</th>
                  <th className="p-4">Status Loket</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-extrabold text-slate-800 text-[13px] flex items-center gap-2">
                      {getServiceIcon(service.tipe)}
                      {service.nama}
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded">
                        {service.tipe}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {service.nominalMin > 0 ? (
                        <span>{formatIDR(service.nominalMin)} s/d {formatIDR(service.nominalMax)}</span>
                      ) : (
                        <span className="text-slate-400 italic">Disesuaikan Jumlah Tagihan Biller</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        service.status === 'Aktif' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onToggleService(service.id)}
                        className={`font-semibold text-[10px] px-2 py-1 rounded border cursor-pointer ${
                          service.status === 'Aktif' 
                            ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent'
                        }`}
                      >
                        {service.status === 'Aktif' ? 'Matikan Loket' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={() => startEdit(service)}
                        className="bg-slate-100 hover:bg-slate-200 border text-slate-600 px-2 py-1 rounded font-semibold text-[10px] cursor-pointer"
                      >
                        Atur Tarif
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL EDIT HARGA PARAMETER */}
      {editingService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-indigo-950 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                Atur Tarif Layanan PPOB
              </h3>
              <button 
                onClick={() => setEditingService(null)}
                className="hover:bg-indigo-900 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div className="font-bold text-slate-700">
                Nama Layanan: <span className="text-indigo-600">{editingService.nama}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Batas Minimal Nominal Beli (Rp)</label>
                <input
                  type="number"
                  required
                  value={minNom}
                  onChange={(e) => setMinNom(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Batas Maksimal Nominal Beli (Rp)</label>
                <input
                  type="number"
                  required
                  value={maxNom}
                  onChange={(e) => setMaxNom(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
