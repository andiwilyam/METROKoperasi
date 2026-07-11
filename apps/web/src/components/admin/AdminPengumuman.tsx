/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, Tag, Users, Calendar, Plus, Trash2, Edit, CheckCircle, Info, ToggleLeft, ToggleRight } from 'lucide-react';
import { Pengumuman } from '../../types';

interface AdminPengumumanProps {
  announcements: Pengumuman[];
  onAddAnnouncement: (newAnn: Omit<Pengumuman, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onToggleAnnouncementStatus: (id: string) => void;
}

export default function AdminPengumuman({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncementStatus
}: AdminPengumumanProps) {
  const [filterType, setFilterType] = useState<'semua' | 'pengumuman' | 'promo'>('semua');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [tipe, setTipe] = useState<'pengumuman' | 'promo'>('pengumuman');
  const [target, setTarget] = useState<'semua' | 'anggota'>('semua');
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalSelesai, setTanggalSelesai] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement({
      judul,
      konten,
      tipe,
      target,
      tanggalMulai,
      tanggalSelesai: tanggalSelesai || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days
      status: 'aktif'
    });

    setSuccessMsg('Pengumuman / promo baru berhasil dipublikasikan!');
    setTimeout(() => setSuccessMsg(''), 4000);

    // Reset form
    setJudul('');
    setKonten('');
    setTipe('pengumuman');
    setTarget('semua');
    setTanggalMulai(new Date().toISOString().split('T')[0]);
    setTanggalSelesai('');
    setShowAddForm(false);
  };

  const filteredList = announcements.filter((a) => {
    if (filterType === 'semua') return true;
    return a.tipe === filterType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            Pengelolaan Pengumuman &amp; Promo Digital Marketing
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            Buat, edit, aktifkan, atau hapus siaran pengumuman serta promo unit usaha yang akan langsung tayang pada dashboard Portal Anggota.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-500/15 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Siarkan Pengumuman Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Creation Form Panel */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-md space-y-4 text-xs animate-slideDown">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-sm">Form Pembuatan Siaran Baru</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Judul Pengumuman / Kampanye Promo</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                placeholder="Contoh: Jadwal Pembagian SHU Buku 2025"
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Kategori Siaran</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as 'pengumuman' | 'promo')}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-medium"
              >
                <option value="pengumuman">Megaphone Pengumuman Koperasi</option>
                <option value="promo">Promo Komersial Unit Usaha (Diskon/Event)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Target Audiens Anggota</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as 'semua' | 'anggota')}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-medium"
              >
                <option value="semua">Semua Pengunjung Aplikasi (Publik)</option>
                <option value="anggota">Hanya Anggota Terdaftar (Private Portal)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Tanggal Mulai Tayang</label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Tanggal Berakhir Tayang (Opsional)</label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                placeholder="Kosongkan untuk durasi 30 hari"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Konten / Narasi Pesan Siaran Lengkap</label>
              <textarea
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                required
                rows={4}
                placeholder="Tulis detail pengumuman secara lengkap dan komunikatif..."
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
            >
              Siarkan Sekarang
            </button>
          </div>
        </form>
      )}

      {/* Main Content List & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-4">
        {/* Filters bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterType('semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                filterType === 'semua'
                  ? 'bg-slate-100 text-slate-800 border-slate-200 font-extrabold'
                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              Semua ({announcements.length})
            </button>
            <button
              onClick={() => setFilterType('pengumuman')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                filterType === 'pengumuman'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              <Megaphone className="w-3 h-3 text-blue-500" />
              Pengumuman ({announcements.filter((a) => a.tipe === 'pengumuman').length})
            </button>
            <button
              onClick={() => setFilterType('promo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                filterType === 'promo'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              <Tag className="w-3 h-3 text-amber-500" />
              Promo Bisnis ({announcements.filter((a) => a.tipe === 'promo').length})
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
            Total Tampil: {filteredList.length} Item
          </span>
        </div>

        {/* List table or card */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Tidak ada pengumuman / materi promosi yang cocok dengan filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((ann) => (
              <div key={ann.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 text-xs">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border ${
                      ann.tipe === 'pengumuman' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {ann.tipe === 'pengumuman' ? <Megaphone className="w-2.5 h-2.5" /> : <Tag className="w-2.5 h-2.5" />}
                      {ann.tipe}
                    </span>

                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-300" />
                      Target: <span className="text-slate-600 capitalize">{ann.target}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                      ann.status === 'aktif' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      ● {ann.status === 'aktif' ? 'Aktif Tayang' : 'Nonaktif'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{ann.judul}</h4>
                  <p className="text-slate-600 leading-relaxed font-normal bg-slate-50/55 border border-slate-100/70 p-3 rounded-xl italic">
                    &quot;{ann.konten}&quot;
                  </p>

                  <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      Mulai: {ann.tanggalMulai}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      Selesai: {ann.tanggalSelesai}
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    onClick={() => onToggleAnnouncementStatus(ann.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-bold text-[10px] cursor-pointer transition ${
                      ann.status === 'aktif'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {ann.status === 'aktif' ? (
                      <>
                        <ToggleRight className="w-3.5 h-3.5" />
                        Nonaktifkan
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-3.5 h-3.5" />
                        Aktifkan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini secara permanen dari feed siaran?')) {
                        onDeleteAnnouncement(ann.id);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Permanen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 flex gap-2 text-[10px] text-slate-400 leading-normal">
        <Info className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
        <span>Siaran promo atau pengumuman koperasi resmi yang diaktifkan di sini otomatis terkirim dan disinkronkan secara real-time pada halaman beranda seluruh perangkat Portal Anggota koperasi.</span>
      </div>
    </div>
  );
}
