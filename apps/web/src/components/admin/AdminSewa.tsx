/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Search, Plus, Calendar, Coins, Percent, AlertCircle, X, Check,
  Trash2, Edit, CheckCircle, FileText, Info, AlertTriangle, RefreshCw
} from 'lucide-react';
import { SewaAsset, SewaTransaksi, Anggota } from '../../types';

interface AdminSewaProps {
  assets: SewaAsset[];
  transactions: SewaTransaksi[];
  members: Anggota[];
  onAddAsset: (newAsset: Omit<SewaAsset, 'id'>) => void;
  onUpdateAsset: (asset: SewaAsset) => void;
  onDeleteAsset: (id: string) => void;
  onApproveSewa: (id: string) => void;
  onRejectSewa: (id: string) => void;
  onFinishSewa: (id: string, denda: number) => void;
}

export default function AdminSewa({
  assets,
  transactions,
  members,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onApproveSewa,
  onRejectSewa,
  onFinishSewa
}: AdminSewaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'aset' | 'transaksi'>('transaksi');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<SewaAsset | null>(null);

  // New Asset Form States
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Elektronik');
  const [biayaSewa, setBiayaSewa] = useState(100000);
  const [deskripsi, setDeskripsi] = useState('');

  // Complete Rental Modal States
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [denda, setDenda] = useState(0);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) return;

    onAddAsset({
      nama,
      kategori,
      biayaSewaPerHari: biayaSewa,
      status: 'Tersedia',
      deskripsi
    });

    setNama('');
    setBiayaSewa(100000);
    setDeskripsi('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    onUpdateAsset(editingAsset);
    setEditingAsset(null);
  };

  const openFinishModal = (tx: SewaTransaksi) => {
    setSelectedTxId(tx.id);
    // Calculate quick estimate of late return
    const seles = new Date(tx.tanggalSelesai);
    const today = new Date();
    if (today > seles) {
      const diffTime = Math.abs(today.getTime() - seles.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Estimate denda: 50% of rental fee per day late
      setDenda(diffDays * Math.round(tx.totalBiaya / tx.jumlahHari * 0.5));
    } else {
      setDenda(0);
    }
  };

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId) return;
    onFinishSewa(selectedTxId, denda);
    setSelectedTxId(null);
    setDenda(0);
  };

  // Stats calculation
  const totalAssetsCount = assets.length;
  const availableCount = assets.filter(a => a.status === 'Tersedia').length;
  const rentedCount = assets.filter(a => a.status === 'Disewa').length;
  const totalRevenue = transactions
    .filter(t => t.status === 'selesai')
    .reduce((acc, curr) => acc + curr.totalBiaya + (curr.denda || 0), 0);

  const filteredAssets = assets.filter(a =>
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.asetNama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Visual Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Unit Usaha Sewa Aset &amp; Inventaris Koperasi
          </h2>
          <p className="text-xs text-slate-400">Penyewaan sarana prasarana, gedung pertemuan, kendaraan, dan alat kerja untuk anggota.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transaksi' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> Daftar Transaksi Sewa
          </button>
          <button
            onClick={() => setActiveTab('aset')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'aset' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" /> Kelola Daftar Aset
          </button>
        </div>
      </div>

      {/* Grid Quick Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Aset Sewa</div>
            <div className="text-lg font-black text-slate-800 mt-1">{totalAssetsCount} Barang</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Tersedia</div>
            <div className="text-lg font-black text-slate-800 mt-1">{availableCount} Unit</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Sedang Disewa</div>
            <div className="text-lg font-black text-slate-800 mt-1">{rentedCount} Unit</div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Omset Sewa</div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono">{formatIDR(totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table Search & Add Action */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'aset' ? "Cari nama aset sewa..." : "Cari penyewa atau aset..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>
          
          {activeTab === 'aset' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Aset Sewa Baru
            </button>
          )}
        </div>

        {/* TAB 1: KELOLA DAFTAR ASET */}
        {activeTab === 'aset' && (
          <div className="overflow-x-auto text-xs">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada aset sewa yang ditemukan.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Barang / Aset</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Biaya Sewa / Hari</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Deskripsi</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800 text-[13px]">{asset.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {asset.id}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium text-[10px]">
                          {asset.kategori}
                        </span>
                      </td>
                      <td className="p-4 font-bold font-mono text-slate-950">
                        {formatIDR(asset.biayaSewaPerHari)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          asset.status === 'Tersedia' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : asset.status === 'Disewa' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate italic">
                        {asset.deskripsi || 'Tidak ada deskripsi.'}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => setEditingAsset(asset)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                          title="Edit Aset"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus aset sewa: ${asset.nama}?`)) {
                              onDeleteAsset(asset.id);
                            }
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-100 transition cursor-pointer"
                          title="Hapus Aset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: DAFTAR TRANSAKSI SEWA */}
        {activeTab === 'transaksi' && (
          <div className="overflow-x-auto text-xs">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Tidak ada pengajuan sewa aktif.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Penyewa</th>
                    <th className="p-4">Aset yang Disewa</th>
                    <th className="p-4">Rentang Waktu</th>
                    <th className="p-4">Durasi / Total Biaya</th>
                    <th className="p-4">Keterangan Denda</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{tx.anggotaNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Anggota ID: {tx.anggotaId}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {tx.asetNama}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tx.tanggalMulai} s/d {tx.tanggalSelesai}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-600">{tx.jumlahHari} Hari</div>
                        <div className="font-bold font-mono text-slate-900">{formatIDR(tx.totalBiaya)}</div>
                      </td>
                      <td className="p-4">
                        {tx.denda ? (
                          <div className="text-red-600 font-bold font-mono">+{formatIDR(tx.denda)}</div>
                        ) : tx.status === 'selesai' ? (
                          <span className="text-slate-400 italic">Tanpa denda</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          tx.status === 'pengajuan' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' 
                            : tx.status === 'disetujui' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : tx.status === 'berjalan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : tx.status === 'selesai'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {tx.status === 'pengajuan' ? 'Pengajuan Baru' : 
                           tx.status === 'disetujui' ? 'Menunggu Ambil' :
                           tx.status === 'berjalan' ? 'Sedang Digunakan' :
                           tx.status === 'selesai' ? 'Selesai Dikembalikan' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {tx.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onApproveSewa(tx.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[10px] transition cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => onRejectSewa(tx.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2 py-1 rounded text-[10px] transition cursor-pointer"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        {tx.status === 'disetujui' && (
                          <button
                            onClick={() => onApproveSewa(tx.id)} // triggers state change to 'berjalan'
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            Ambil Barang / Serahkan
                          </button>
                        )}
                        {tx.status === 'berjalan' && (
                          <button
                            onClick={() => openFinishModal(tx)}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                          >
                            Selesai &amp; Kembalikan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: ADD ASET SEWA BARU */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-emerald-950 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Tambah Aset Sewa Koperasi
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="hover:bg-emerald-900 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nama Aset / Inventaris</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung Aula Graha Koperasi Utama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kategori Aset</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-slate-800"
                >
                  <option value="Elektronik">Elektronik &amp; Multimedia</option>
                  <option value="Peralatan">Peralatan Pesta &amp; Inventaris</option>
                  <option value="Kendaraan">Kendaraan Operasional</option>
                  <option value="Ruangan">Gedung / Ruang Rapat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tarif Biaya Sewa Per Hari (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={biayaSewa}
                  onChange={(e) => setBiayaSewa(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Deskripsi &amp; Spesifikasi Detail</label>
                <textarea
                  placeholder="Kapasitas ruangan, kelengkapan barang, dll..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-slate-800"
                  rows={3}
                />
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm hover:shadow transition cursor-pointer"
                >
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ASET */}
      {editingAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-blue-950 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                Ubah Data Aset Sewa
              </h3>
              <button 
                onClick={() => setEditingAsset(null)}
                className="hover:bg-blue-900 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nama Aset / Inventaris</label>
                <input
                  type="text"
                  required
                  value={editingAsset.nama}
                  onChange={(e) => setEditingAsset({ ...editingAsset, nama: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kategori</label>
                <select
                  value={editingAsset.kategori}
                  onChange={(e) => setEditingAsset({ ...editingAsset, kategori: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="Elektronik">Elektronik &amp; Multimedia</option>
                  <option value="Peralatan">Peralatan Pesta &amp; Inventaris</option>
                  <option value="Kendaraan">Kendaraan Operasional</option>
                  <option value="Ruangan">Gedung / Ruang Rapat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tarif Sewa Per Hari (Rp)</label>
                <input
                  type="number"
                  required
                  value={editingAsset.biayaSewaPerHari}
                  onChange={(e) => setEditingAsset({ ...editingAsset, biayaSewaPerHari: Number(e.target.value) })}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Status Ketersediaan</label>
                <select
                  value={editingAsset.status}
                  onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value as any })}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Disewa">Sedang Disewa</option>
                  <option value="Perawatan">Dalam Perawatan (Maintenance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Ubah Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SELESAI RENTAL & HITUNG DENDA */}
      {selectedTxId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Pengembalian &amp; Selesai Sewa
              </h3>
              <button 
                onClick={() => setSelectedTxId(null)}
                className="hover:bg-slate-800 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFinishSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 leading-relaxed text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  Denda dihitung otomatis jika pengembalian melewati batas tanggal selesai sewa yang disepakati. Silakan sesuaikan denda di bawah jika ada denda kerusakan.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Denda Keterlambatan / Kerusakan (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={denda}
                  onChange={(e) => setDenda(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-mono font-bold"
                />
                {denda > 0 && (
                  <div className="text-red-500 font-semibold mt-1 flex items-center gap-1 text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Ada Denda Aktif Dikenakan!
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTxId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Konfirmasi Pengembalian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
