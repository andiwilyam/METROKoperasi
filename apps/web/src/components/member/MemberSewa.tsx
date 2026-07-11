/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Search, Calendar, Coins, Plus, X, Clock, HelpCircle, CheckCircle, Info
} from 'lucide-react';
import { SewaAsset, SewaTransaksi, UserSession, Anggota } from '../../types';

interface MemberSewaProps {
  session: UserSession;
  assets: SewaAsset[];
  transactions: SewaTransaksi[];
  members: Anggota[];
  onAddSewaRequest: (newReq: Omit<SewaTransaksi, 'id'>) => void;
}

export default function MemberSewa({
  session,
  assets,
  transactions,
  members,
  onAddSewaRequest
}: MemberSewaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRentModal, setShowRentModal] = useState<SewaAsset | null>(null);

  // New Booking States
  const [tglMulai, setTglMulai] = useState('');
  const [tglSelesai, setTglSelesai] = useState('');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const myMember = members.find(m => m.id === session.memberId) || null;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRentModal || !tglMulai || !tglSelesai) return;
    if (!myMember) { alert('Data anggota tidak ditemukan. Silakan login ulang.'); return; }

    const start = new Date(tglMulai);
    const end = new Date(tglSelesai);
    if (end < start) {
      alert("Tanggal selesai tidak boleh mendahului tanggal mulai!");
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalBiaya = diffDays * showRentModal.biayaSewaPerHari;

    onAddSewaRequest({
      anggotaId: myMember.id,
      anggotaNama: myMember.nama,
      asetId: showRentModal.id,
      asetNama: showRentModal.nama,
      tanggalMulai: tglMulai,
      tanggalSelesai: tglSelesai,
      jumlahHari: diffDays,
      totalBiaya,
      status: 'pengajuan'
    });

    setShowRentModal(null);
    setTglMulai('');
    setTglSelesai('');
  };

  const myTransactions = myMember ? transactions.filter(t => t.anggotaId === myMember.id) : [];

  const filteredAssets = assets.filter(a =>
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="bg-emerald-800 text-emerald-300 font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Layanan Unit Usaha Sewa
          </div>
          <h2 className="text-xl font-black tracking-tight md:text-2xl">Rental Sarana &amp; Aset Koperasi</h2>
          <p className="text-xs text-emerald-100/80 max-w-lg leading-relaxed">
            Butuh laptop untuk kerja, proyektor untuk presentasi, atau tenda untuk acara keluarga? Sewa langsung dari koperasi Anda dengan tarif kekeluargaan yang super bersaing.
          </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
          <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Aset Tersedia</div>
          <div className="text-2xl font-black mt-1">{assets.filter(a => a.status === 'Tersedia').length} Unit</div>
        </div>
      </div>

      {/* Grid: Assets Catalog & Bookings History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Katalog Barang Sewaan</h3>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari alat, laptop, proyektor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-slate-200 pl-8 pr-3 py-1 text-xs rounded-xl bg-white w-48 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between hover:shadow transition">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                      {asset.kategori}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      asset.status === 'Tersedia' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-[13px] tracking-tight">{asset.nama}</h4>
                  <p className="text-[11px] text-slate-400 italic line-clamp-2 leading-relaxed">
                    {asset.deskripsi || 'Sewa aset koperasi berkualitas tinggi.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Biaya Sewa</div>
                    <div className="font-extrabold font-mono text-emerald-700 text-xs">{formatIDR(asset.biayaSewaPerHari)}<span className="text-[10px] text-slate-400 font-normal">/hari</span></div>
                  </div>
                  <button
                    onClick={() => setShowRentModal(asset)}
                    disabled={asset.status !== 'Tersedia'}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg disabled:opacity-50 transition cursor-pointer"
                  >
                    Booking Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bookings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Booking Saya ({myTransactions.length})</h3>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">
            {myTransactions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 italic flex flex-col items-center justify-center gap-2">
                <Building2 className="w-8 h-8 text-slate-200" />
                Belum ada pengajuan sewa dari Anda.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {myTransactions.map(tx => (
                  <div key={tx.id} className="p-4 space-y-2.5 hover:bg-slate-50/40 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-extrabold text-slate-800">{tx.asetNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Ref: {tx.id}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        tx.status === 'pengajuan' ? 'bg-amber-100 text-amber-700' :
                        tx.status === 'berjalan' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/10' :
                        tx.status === 'selesai' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                      <div>
                        <span className="block text-[9px] text-slate-400">AMBIL BARANG</span>
                        <span className="font-bold text-slate-700">{tx.tanggalMulai}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400">PENGEMBALIAN</span>
                        <span className="font-bold text-slate-700">{tx.tanggalSelesai}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400">Total Sewa ({tx.jumlahHari} Hari):</span>
                        <span className="font-bold font-mono text-slate-900 ml-1.5">{formatIDR(tx.totalBiaya)}</span>
                      </div>
                      {tx.denda ? (
                        <div className="text-red-600 font-bold font-mono">Denda: +{formatIDR(tx.denda)}</div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL BOOKING */}
      {showRentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 border-b border-slate-200 bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                Formulir Pengajuan Rental
              </h3>
              <button 
                onClick={() => setShowRentModal(null)}
                className="hover:bg-emerald-900 p-1 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-slate-800">Nama Aset: {showRentModal.nama}</div>
                <div className="text-slate-500">Kategori: {showRentModal.kategori}</div>
                <div className="text-emerald-700 font-bold font-mono">Biaya: {formatIDR(showRentModal.biayaSewaPerHari)} / hari</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={tglMulai}
                    onChange={(e) => setTglMulai(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={tglSelesai}
                    onChange={(e) => setTglSelesai(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl leading-relaxed text-[11px] flex gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  Pengajuan sewa akan diproses oleh pengurus koperasi. Anda akan dihubungi untuk pengambilan barang setelah disetujui.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRentModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Ajukan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
