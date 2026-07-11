/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Plus, Calendar, Coins, Percent, Eye, FileText, Check, X,
  Calculator, Info, CheckCircle2, TrendingUp, HelpCircle
} from 'lucide-react';
import { CicilanBarang, CicilanAngsuran, Anggota } from '../../types';

interface AdminPembiayaanProps {
  contracts: CicilanBarang[];
  installments: CicilanAngsuran[];
  members: Anggota[];
  onApproveContract: (id: string) => void;
  onRejectContract: (id: string) => void;
  onRecordInstallmentPay: (id: string) => void;
  onAddContract: (newContract: Omit<CicilanBarang, 'id' | 'sisaPokok' | 'status' | 'tanggalPengajuan'>) => void;
}

export default function AdminPembiayaan({
  contracts,
  installments,
  members,
  onApproveContract,
  onRejectContract,
  onRecordInstallmentPay,
  onAddContract
}: AdminPembiayaanProps) {
  const [activeTab, setActiveTab] = useState<'kontrak' | 'angsuran'>('kontrak');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<CicilanBarang | null>(null);

  // New Contract States
  const [selAnggotaId, setSelAnggotaId] = useState('');
  const [barangNama, setBarangNama] = useState('');
  const [totalHarga, setTotalHarga] = useState(5000000);
  const [dp, setDp] = useState(500000);
  const [tenorMonths, setTenorMonths] = useState(12);
  const [bungaPersen, setBungaPersen] = useState(1.5); // flat per month

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAnggotaId || !barangNama || totalHarga <= 0) return;

    const am = members.find(m => m.id === selAnggotaId);
    if (!am) return;

    const pokokPembiayaan = totalHarga - dp;
    const bungaBulan = pokokPembiayaan * (bungaPersen / 100);
    const angsuranPerBulan = Math.round((pokokPembiayaan / tenorMonths) + bungaBulan);

    onAddContract({
      anggotaId: selAnggotaId,
      anggotaNama: am.nama,
      barangNama,
      totalHarga,
      dp,
      pokokPembiayaan,
      tenorMonths,
      bungaPersen,
      angsuranPerBulan
    });

    // Reset Form
    setSelAnggotaId('');
    setBarangNama('');
    setTotalHarga(5000000);
    setDp(500000);
    setTenorMonths(12);
    setBungaPersen(1.5);
    setShowAddModal(false);
  };

  // Stats
  const totalContractsCount = contracts.length;
  const activeContractsCount = contracts.filter(c => c.status === 'aktif').length;
  const outstandingPiutang = contracts
    .filter(c => c.status === 'aktif')
    .reduce((acc, curr) => acc + curr.sisaPokok, 0);
  const totalVolumeApproved = contracts
    .filter(c => c.status === 'aktif' || c.status === 'lunas')
    .reduce((acc, curr) => acc + curr.pokokPembiayaan, 0);

  const filteredContracts = contracts.filter(c =>
    c.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.barangNama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstallments = installments.filter(inst =>
    inst.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contracts.find(c => c.id === inst.cicilanBarangId)?.barangNama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            Sistem Kredit &amp; Cicilan Pengadaan Barang
          </h2>
          <p className="text-xs text-slate-400">Pengadaan barang elektronik, kendaraan, atau alat produktif bagi anggota dengan angsuran pembiayaan flat.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('kontrak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kontrak' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Daftar Kontrak Kredit
          </button>
          <button
            onClick={() => setActiveTab('angsuran')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'angsuran' 
                ? 'bg-indigo-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> Tagihan Angsuran
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Kontrak Kredit</div>
            <div className="text-lg font-black text-slate-800 mt-1">{totalContractsCount} Pengajuan</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Kredit Aktif Berjalan</div>
            <div className="text-lg font-black text-slate-800 mt-1">{activeContractsCount} Kontrak</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Sisa Piutang Pengadaan</div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono">{formatIDR(outstandingPiutang)}</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Volume Disalurkan</div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono">{formatIDR(totalVolumeApproved)}</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Actions Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'angsuran' ? "Cari tagihan angsuran..." : "Cari nama anggota atau nama barang..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>
          
          {activeTab === 'kontrak' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Input Akad Kredit Barang
            </button>
          )}
        </div>

        {/* TAB 1: DAFTAR KONTRAK */}
        {activeTab === 'kontrak' && (
          <div className="overflow-x-auto text-xs">
            {filteredContracts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada pengajuan kredit yang ditemukan.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Anggota Pemohon</th>
                    <th className="p-4">Barang Kredit</th>
                    <th className="p-4">Nilai Barang &amp; DP</th>
                    <th className="p-4">Pembiayaan / Tenor</th>
                    <th className="p-4">Angsuran / Bln</th>
                    <th className="p-4">Sisa Piutang</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{c.anggotaNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Anggota ID: {c.anggotaId}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {c.barangNama}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{formatIDR(c.totalHarga)}</div>
                        <div className="text-[10px] text-slate-400">DP: {formatIDR(c.dp)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{formatIDR(c.pokokPembiayaan)}</div>
                        <div className="text-[10px] text-slate-500">{c.tenorMonths} bulan (Bunga {c.bungaPersen}%)</div>
                      </td>
                      <td className="p-4 font-black font-mono text-indigo-700">
                        {formatIDR(c.angsuranPerBulan)}
                      </td>
                      <td className="p-4 font-bold font-mono text-slate-900">
                        {c.status === 'aktif' ? formatIDR(c.sisaPokok) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                          c.status === 'pengajuan' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                            : c.status === 'disetujui' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : c.status === 'aktif'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.status === 'lunas'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {c.status === 'pengajuan' ? 'Minta Persetujuan' : 
                           c.status === 'disetujui' ? 'Menunggu Akad' :
                           c.status === 'aktif' ? 'Cicilan Aktif' :
                           c.status === 'lunas' ? 'Lunas / Selesai' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        {c.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onApproveContract(c.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[10px] transition cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => onRejectContract(c.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2 py-1 rounded text-[10px] transition cursor-pointer"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        {c.status === 'disetujui' && (
                          <button
                            onClick={() => onApproveContract(c.id)} // triggers state changes to active & generates installment schedules
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            Akad &amp; Serah Barang
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedContract(c)}
                          className="bg-slate-50 hover:bg-slate-100 border text-slate-600 p-1 rounded-lg transition cursor-pointer inline-flex items-center"
                          title="Lihat Detail Amortisasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: TAGIHAN ANGSURAN */}
        {activeTab === 'angsuran' && (
          <div className="overflow-x-auto text-xs">
            {filteredInstallments.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada denda atau daftar tagihan angsuran bulanan yang jatuh tempo.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Nama Barang</th>
                    <th className="p-4">Angsuran Ke</th>
                    <th className="p-4">Batas Jatuh Tempo</th>
                    <th className="p-4">Pokok Bayar</th>
                    <th className="p-4">Bunga Margin</th>
                    <th className="p-4">Total Tagihan</th>
                    <th className="p-4">Status Bayar</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredInstallments.map((inst) => {
                    const cParent = contracts.find(c => c.id === inst.cicilanBarangId);
                    return (
                      <tr key={inst.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{inst.anggotaNama}</td>
                        <td className="p-4 text-slate-600 font-semibold">{cParent?.barangNama || 'Barang Hilang'}</td>
                        <td className="p-4 font-mono font-bold">Bulan Ke-{inst.angsuranKe}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{inst.tanggalJatuhTempo}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono">{formatIDR(inst.pokokBayar)}</td>
                        <td className="p-4 font-mono text-emerald-600">+{formatIDR(inst.bungaBayar)}</td>
                        <td className="p-4 font-black font-mono text-slate-900">{formatIDR(inst.totalBayar)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            inst.status === 'lunas' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : inst.status === 'terlambat' 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {inst.status === 'lunas' ? 'Lunas Terbayar' : inst.status === 'terlambat' ? 'Jatuh Tempo!' : 'Belum Bayar'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {inst.status !== 'lunas' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Daftarkan pelunasan angsuran ke-${inst.angsuranKe} sejumlah ${formatIDR(inst.totalBayar)}?`)) {
                                  onRecordInstallmentPay(inst.id);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                            >
                              Terima Setoran Cash
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: INPUT AKAD KREDIT BARU */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 bg-indigo-950 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Daftarkan Akad Kredit Pengadaan Barang
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="hover:bg-indigo-900 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Pilih Anggota Koperasi</label>
                <select
                  required
                  value={selAnggotaId}
                  onChange={(e) => setSelAnggotaId(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="">-- Pilih Anggota Pemohon --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.nama} - [{m.id.toUpperCase()}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nama Barang Pengadaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laptop ASUS ROG Zephyrus G14"
                  value={barangNama}
                  onChange={(e) => setBarangNama(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Total Harga Barang (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={totalHarga}
                    onChange={(e) => setTotalHarga(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white font-mono text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Down Payment / DP (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tenor Cicilan (Bulan)</label>
                  <select
                    value={tenorMonths}
                    onChange={(e) => setTenorMonths(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  >
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan</option>
                    <option value={18}>18 Bulan</option>
                    <option value={24}>24 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Suku Bunga Margin (%/Bulan Flat)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0"
                    value={bungaPersen}
                    onChange={(e) => setBungaPersen(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Quick Math estimation */}
              <div className="p-3 bg-slate-100 rounded-xl space-y-1 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  Kalkulasi Simulasi Kredit
                </div>
                <div className="flex justify-between">
                  <span>Pokok Pembiayaan:</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(totalHarga - dp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin Koperasi/Bulan:</span>
                  <span className="font-mono text-emerald-600">+{formatIDR((totalHarga - dp) * (bungaPersen / 100))}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900 text-xs">
                  <span>Angsuran Per Bulan:</span>
                  <span className="font-mono text-indigo-700">
                    {formatIDR(Math.round(((totalHarga - dp) / tenorMonths) + ((totalHarga - dp) * (bungaPersen / 100))))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AMORTISASI DETAIL */}
      {selectedContract && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Rincian Amortisasi Kredit Barang
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Pemilik Kontrak: {selectedContract.anggotaNama}</p>
              </div>
              <button 
                onClick={() => setSelectedContract(null)}
                className="hover:bg-slate-800 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border bg-slate-50 p-4 rounded-xl text-[11px] text-slate-600">
                <div>
                  <span className="block text-[10px] text-slate-400">NAMA BARANG</span>
                  <span className="font-extrabold text-slate-800">{selectedContract.barangNama}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">HARGA PEROLEHAN</span>
                  <span className="font-bold font-mono text-slate-800">{formatIDR(selectedContract.totalHarga)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">POKOK PEMBIAYAAN</span>
                  <span className="font-bold font-mono text-slate-800">{formatIDR(selectedContract.pokokPembiayaan)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">DOWN PAYMENT (DP)</span>
                  <span className="font-bold font-mono text-slate-800">{formatIDR(selectedContract.dp)}</span>
                </div>
              </div>

              <div className="font-bold text-slate-800 text-[11px] border-b pb-1">Jadwal Angsuran Amortisasi</div>
              <div className="max-h-48 overflow-y-auto divide-y">
                {installments
                  .filter(i => i.cicilanBarangId === selectedContract.id)
                  .map(i => (
                    <div key={i.id} className="flex justify-between items-center py-2 text-[11px]">
                      <div>
                        <span className="font-bold text-slate-700">Angsuran Ke-{i.angsuranKe}</span>
                        <span className="block text-[10px] text-slate-400">Tempo: {i.tanggalJatuhTempo}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-slate-900 block">{formatIDR(i.totalBayar)}</span>
                        <span className={`text-[9px] font-bold ${
                          i.status === 'lunas' ? 'text-emerald-600' : 'text-amber-500'
                        }`}>
                          {i.status === 'lunas' ? 'LUNAS' : 'BELUM BAYAR'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
