/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calculator, Check, AlertCircle, Calendar, Receipt, Sparkles, X, Edit, Settings, Plus } from 'lucide-react';
import { Anggota, JenisPinjaman, Pinjaman, Angsuran } from '../../types';

interface AdminPinjamanProps {
  members: Anggota[];
  loans: Pinjaman[];
  loanTypes: JenisPinjaman[];
  schedules: Angsuran[];
  onApproveLoan: (id: string) => void;
  onRejectLoan: (id: string) => void;
  onRecordAngsuran: (angsuranId: string, denda: number) => void;
  onAddLoanRequest: (newLoan: Omit<Pinjaman, 'id' | 'noPinjaman' | 'sisaPokok' | 'status' | 'tanggalPengajuan' | 'tanggalCair'>) => void;
  onUpdateLoanTypes: (updated: JenisPinjaman[]) => void;
  subView: 'pengajuan' | 'angsuran' | 'tagihan' | 'jenis';
}

export default function AdminPinjaman({
  members,
  loans,
  loanTypes,
  schedules,
  onApproveLoan,
  onRejectLoan,
  onRecordAngsuran,
  onAddLoanRequest,
  onUpdateLoanTypes,
  subView
}: AdminPinjamanProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSimModal, setShowSimModal] = useState(false);

  // Simulation Form State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [pokok, setPokok] = useState(10000000);
  const [tenor, setTenor] = useState(12);

  // Editing Loan Type State
  const [editingType, setEditingType] = useState<JenisPinjaman | null>(null);
  const [editNama, setEditNama] = useState('');
  const [editBungaPersen, setEditBungaPersen] = useState(0);
  const [editMaksPlafon, setEditMaksPlafon] = useState(0);
  const [editMaksTenor, setEditMaksTenor] = useState(0);
  const [editMetodeBunga, setEditMetodeBunga] = useState<'flat' | 'efektif' | 'anuitas'>('flat');

  // Adding Loan Type State
  const [showAddType, setShowAddType] = useState(false);
  const [addNama, setAddNama] = useState('');
  const [addBungaPersen, setAddBungaPersen] = useState(1.0);
  const [addMaksPlafon, setAddMaksPlafon] = useState(10000000);
  const [addMaksTenor, setAddMaksTenor] = useState(12);
  const [addMetodeBunga, setAddMetodeBunga] = useState<'flat' | 'efektif' | 'anuitas'>('flat');
  const [addBiayaAdmin, setAddBiayaAdmin] = useState(50000);

  const startEditType = (type: JenisPinjaman) => {
    setEditingType(type);
    setEditNama(type.nama);
    setEditBungaPersen(type.bungaPersen);
    setEditMaksPlafon(type.maksPlafon);
    setEditMaksTenor(type.maksTenor);
    setEditMetodeBunga(type.metodeBunga);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    const updated = loanTypes.map((t) =>
      t.id === editingType.id
        ? {
            ...t,
            nama: editNama,
            bungaPersen: editBungaPersen,
            maksPlafon: editMaksPlafon,
            maksTenor: editMaksTenor,
            metodeBunga: editMetodeBunga
          }
        : t
    );
    onUpdateLoanTypes(updated);
    setEditingType(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newType: JenisPinjaman = {
      id: `jp_${Date.now()}`,
      nama: addNama,
      bungaPersen: addBungaPersen,
      maksPlafon: addMaksPlafon,
      maksTenor: addMaksTenor,
      metodeBunga: addMetodeBunga,
      biayaAdmin: addBiayaAdmin
    };
    onUpdateLoanTypes([...loanTypes, newType]);
    setAddNama('');
    setAddBungaPersen(1.0);
    setAddMaksPlafon(10000000);
    setAddMaksTenor(12);
    setAddMetodeBunga('flat');
    setAddBiayaAdmin(50000);
    setShowAddType(false);
  };

  // Compute simulation outcomes
  const activeType = loanTypes.find((t) => t.id === selectedTypeId);
  const simulationSchedule: { bulan: number; pokok: number; bunga: number; total: number }[] = [];
  let simulatedAngsuranPerBulan = 0;

  if (activeType) {
    const rate = activeType.bungaPersen / 100;
    if (activeType.metodeBunga === 'flat') {
      const pokokSuku = pokok / tenor;
      const bungaSuku = pokok * rate;
      simulatedAngsuranPerBulan = Math.round(pokokSuku + bungaSuku);
      for (let i = 1; i <= tenor; i++) {
        simulationSchedule.push({
          bulan: i,
          pokok: Math.round(pokokSuku),
          bunga: Math.round(bungaSuku),
          total: simulatedAngsuranPerBulan
        });
      }
    } else {
      // Effective / Annuity simplified calculation
      const pokokSuku = pokok / tenor;
      for (let i = 1; i <= tenor; i++) {
        const sisa = pokok - pokokSuku * (i - 1);
        const bungaSuku = sisa * rate;
        simulationSchedule.push({
          bulan: i,
          pokok: Math.round(pokokSuku),
          bunga: Math.round(bungaSuku),
          total: Math.round(pokokSuku + bungaSuku)
        });
      }
      simulatedAngsuranPerBulan = simulationSchedule.length > 0 
        ? Math.round(simulationSchedule.reduce((acc, curr) => acc + curr.total, 0) / tenor)
        : 0;
    }
  }

  const handleCreateLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedTypeId || !activeType) return;

    onAddLoanRequest({
      anggotaId: selectedMemberId,
      anggotaNama: members.find((m) => m.id === selectedMemberId)?.nama || 'Anggota',
      jenisPinjamanId: selectedTypeId,
      jenisNama: activeType.nama,
      pokok,
      tenorMonths: tenor,
      bungaPersen: activeType.bungaPersen,
      metodeBunga: activeType.metodeBunga,
      angsuranPerBulan: simulatedAngsuranPerBulan,
      biayaAdmin: activeType.biayaAdmin
    });

    setShowSimModal(false);
    setSelectedMemberId('');
    setSelectedTypeId('');
    setPokok(10000000);
    setTenor(12);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PENGAJUAN VIEW & SIMULATION CREATOR */}
      {subView === 'pengajuan' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pengajuan pinjaman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              onClick={() => {
                setShowSimModal(true);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm shadow-blue-500/10"
            >
              <Calculator className="w-4 h-4" />
              Simulasi &amp; Buat Pengajuan Baru
            </button>
          </div>

          {/* Simulation & Creation Modal */}
          {showSimModal && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md relative animate-fadeIn">
              <button
                onClick={() => setShowSimModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Simulasi Perhitungan Pinjaman Koperasi
              </h3>

              <form onSubmit={handleCreateLoanSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                
                {/* Inputs Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Pilih Anggota</label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                    >
                      <option value="">-- Pilih Anggota --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nama} (Penghasilan: {formatIDR(m.penghasilan)}/bln)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Pilih Kategori Pinjaman</label>
                    <select
                      value={selectedTypeId}
                      onChange={(e) => setSelectedTypeId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {loanTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nama} (Margin: {t.bungaPersen}% / bln)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Besar Pokok (Rp)</label>
                      <input
                        type="number"
                        value={pokok}
                        step={500000}
                        onChange={(e) => setPokok(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Tenor (Bulan)</label>
                      <input
                        type="number"
                        value={tenor}
                        min={1}
                        max={36}
                        onChange={(e) => setTenor(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {activeType && (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Metode Angsuran:</span>
                        <span className="font-bold text-slate-700 capitalize">{activeType.metodeBunga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Biaya Administrasi:</span>
                        <span className="font-mono font-bold text-slate-700">{formatIDR(activeType.biayaAdmin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Plafon Maksimum:</span>
                        <span className="font-mono font-bold text-slate-700">{formatIDR(activeType.maksPlafon)}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSimModal(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                    >
                      Ajukan Sekarang
                    </button>
                  </div>
                </div>

                {/* Simulation Outputs Column */}
                <div className="lg:col-span-7 border-l border-slate-200 pl-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-blue-500" />
                      Rencana Tabel Angsuran Bulanan (Proyeksi)
                    </h4>
                    
                    {simulationSchedule.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        Select a category and adjust numbers to view projection.
                      </div>
                    ) : (
                      <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-lg">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 font-semibold text-slate-600 border-b border-slate-200 sticky top-0">
                              <th className="p-2">Bulan Ke-</th>
                              <th className="p-2">Pokok Dibayar</th>
                              <th className="p-2">Margin Jasa</th>
                              <th className="p-2">Total Setoran</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {simulationSchedule.map((row) => (
                              <tr key={row.bulan} className="hover:bg-slate-50/50">
                                <td className="p-2 text-slate-500 font-bold"># {row.bulan}</td>
                                <td className="p-2 text-slate-700">{formatIDR(row.pokok)}</td>
                                <td className="p-2 text-amber-600">{formatIDR(row.bunga)}</td>
                                <td className="p-2 text-slate-900 font-bold">{formatIDR(row.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {simulationSchedule.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between mt-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Rata-rata Angsuran</div>
                        <div className="text-lg font-extrabold text-blue-900 font-mono">{formatIDR(simulatedAngsuranPerBulan)} / bulan</div>
                      </div>
                      <span className="text-[10px] text-blue-700 bg-white/80 border border-blue-200 px-2 py-1 rounded-full font-semibold">
                        Sesuai Kebijakan
                      </span>
                    </div>
                  )}
                </div>

              </form>
            </div>
          )}

          {/* List of Loans Requested or Disbursed */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
              Berkas Pengajuan &amp; Pinjaman Aktif
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">No Pinjaman</th>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">Jenis Pinjaman</th>
                    <th className="p-4">Plafon Pokok</th>
                    <th className="p-4">Tenor</th>
                    <th className="p-4">Angsuran / Bln</th>
                    <th className="p-4">Sisa Saldo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/30">
                      <td className="p-4 font-mono font-bold text-slate-600">{l.noPinjaman || 'PROPOSAL'}</td>
                      <td className="p-4 font-bold text-slate-800">{l.anggotaNama}</td>
                      <td className="p-4 text-slate-600">{l.jenisNama}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">{formatIDR(l.pokok)}</td>
                      <td className="p-4 font-mono">{l.tenorMonths} bln</td>
                      <td className="p-4 font-mono font-semibold text-slate-900">{formatIDR(l.angsuranPerBulan)}</td>
                      <td className="p-4 font-mono font-bold text-slate-900 text-amber-600">
                        {l.status === 'dicairkan' ? formatIDR(l.sisaPokok) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          l.status === 'pengajuan' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : l.status === 'disetujui' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : l.status === 'dicairkan' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-soft-pulse' 
                            : l.status === 'lunas' 
                            ? 'bg-slate-50 text-slate-600 border-slate-200 line-through' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {l.status === 'pengajuan' && 'Draft Pengajuan'}
                          {l.status === 'disetujui' && 'Sudah Disetujui'}
                          {l.status === 'dicairkan' && 'Pencairan Aktif'}
                          {l.status === 'lunas' && 'Lunas Buku'}
                          {l.status === 'ditolak' && 'Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {l.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onApproveLoan(l.id)}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectLoan(l.id)}
                              className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. BAYAR ANGSURAN */}
      {subView === 'angsuran' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
            Loket Pembayaran Angsuran Bulanan (Staff Kasir)
          </div>
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span>Pilih jadwal angsuran yang belum dibayar di bawah untuk mencatat pelunasan tunai/transfer.</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Nama Anggota</th>
                  <th className="p-4">Angsuran Ke-</th>
                  <th className="p-4">Batas Jatuh Tempo</th>
                  <th className="p-4">Pokok Tagihan</th>
                  <th className="p-4">Bunga Pinjaman</th>
                  <th className="p-4">Total Bayar</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">{s.anggotaNama}</td>
                    <td className="p-4 font-mono font-bold text-slate-500">Angsuran # {s.angsuranKe}</td>
                    <td className="p-4 font-mono text-slate-500">{s.tanggalJatuhTempo}</td>
                    <td className="p-4 font-mono text-slate-600">{formatIDR(s.pokokBayar)}</td>
                    <td className="p-4 font-mono text-amber-600">{formatIDR(s.bungaBayar)}</td>
                    <td className="p-4 font-mono font-extrabold text-slate-900">{formatIDR(s.totalBayar)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        s.status === 'lunas' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {s.status === 'lunas' ? 'Lunas Dibayar' : 'Belum Bayar'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {s.status === 'belum_bayar' ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Terima pembayaran angsuran sejumlah ${formatIDR(s.totalBayar)}? Jurnal transaksi akuntansi otomatis akan dibuat.`)) {
                              onRecordAngsuran(s.id, 0);
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition shadow-sm"
                        >
                          ✔ Terima Pembayaran
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 font-semibold italic">Lunas ({s.tanggalBayar})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ALERTS & JATUH TEMPO */}
      {subView === 'tagihan' && (() => {
        const today = new Date();
        const overdue = schedules
          .filter((s) => s.status !== 'lunas' && new Date(s.tanggalJatuhTempo) < today)
          .map((s) => ({ ...s, lateDays: Math.floor((today.getTime() - new Date(s.tanggalJatuhTempo).getTime()) / 86400000) }))
          .sort((a, b) => b.lateDays - a.lateDays);
        const totalOverdue = overdue.reduce((sum, s) => sum + (s.totalBayar || 0), 0);
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">Peringatan Jatuh Tempo &amp; Risiko Tunggakan</h4>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
                  Sistem mendeteksi <b>{overdue.length}</b> jadwal pembayaran pinjaman yang belum diselesaikan walaupun telah melewati batas tanggal jatuh tempo (total <b>{formatIDR(totalOverdue)}</b>). Pengingat SMS / WA otomatis dapat diatur dari modul email di pengaturan.
                </p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">
                Daftar Keterlambatan Pembayaran Aktif ({overdue.length})
              </div>
              <div className="p-4 space-y-3">
                {overdue.length === 0 && (
                  <div className="text-center text-slate-400 italic py-6">Tidak ada tunggakan aktif. Semua angsuran tepat waktu.</div>
                )}
                {overdue.map((s, idx) => (
                  <div key={s.id} className={`flex justify-between items-center py-2 ${idx < overdue.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div>
                      <div className="font-bold text-slate-800">{s.anggotaNama}</div>
                      <div className="text-[10px] text-slate-400">Angsuran Ke-{s.angsuranKe} (Jatuh tempo: {s.tanggalJatuhTempo})</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-red-600">{formatIDR(s.totalBayar)}</div>
                      <div className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Terlambat {s.lateDays} Hari</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. CONFIGURATION OF LOAN TYPES */}
      {subView === 'jenis' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              Konfigurasi Kebijakan Suku Bunga &amp; Jenis Pinjaman
              <button
                onClick={() => setShowAddType(true)}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Jenis Pinjaman
              </button>
            </span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Regulasi OJK / Koperasi
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {loanTypes.map((lt) => (
                <div key={lt.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 text-sm flex justify-between items-start gap-1">
                      <span>{lt.nama}</span>
                      <button
                        onClick={() => startEditType(lt)}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition cursor-pointer"
                        title="Edit Kebijakan Pinjaman"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Bunga/Margin: {lt.bungaPersen}% / bln</div>
                    
                    <div className="pt-2 flex justify-between text-xs border-t border-slate-200/50">
                      <span className="text-slate-500">Maks. Plafon</span>
                      <span className="font-semibold text-slate-800 font-mono">{formatIDR(lt.maksPlafon)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Maks. Tenor</span>
                      <span className="font-semibold text-slate-800 font-mono">{lt.maksTenor} Bulan</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Metode</span>
                      <span className="font-bold text-slate-800 capitalize">{lt.metodeBunga}</span>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-slate-500">Skema Angsuran</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Konvensional
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Loan Type Modal */}
      {editingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-blue-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                Ubah Kebijakan Pinjaman
              </h3>
              <button 
                onClick={() => setEditingType(null)}
                className="hover:bg-blue-800 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nama Kebijakan Pinjaman</label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Suku Bunga Bulanan (%)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={editBungaPersen}
                  onChange={(e) => setEditBungaPersen(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Maksimal Plafon Pinjaman (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editMaksPlafon}
                  onChange={(e) => setEditMaksPlafon(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Maksimal Tenor (Bulan)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={editMaksTenor}
                  onChange={(e) => setEditMaksTenor(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Metode Bunga</label>
                <select
                  value={editMetodeBunga}
                  onChange={(e) => setEditMetodeBunga(e.target.value as 'flat' | 'efektif' | 'anuitas')}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="flat">Flat</option>
                  <option value="efektif">Menurun (Efektif)</option>
                  <option value="anuitas">Menurun (Anuitas)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded shadow-sm hover:shadow transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Loan Type Modal */}
      {showAddType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-emerald-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-300" />
                Tambah Kebijakan Pinjaman Baru
              </h3>
              <button 
                onClick={() => setShowAddType(false)}
                className="hover:bg-emerald-800 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nama Kebijakan Pinjaman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pinjaman Motor Syariah"
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Suku Bunga Bulanan (%)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={addBungaPersen}
                  onChange={(e) => setAddBungaPersen(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Maksimal Plafon Pinjaman (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addMaksPlafon}
                  onChange={(e) => setAddMaksPlafon(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Maksimal Tenor (Bulan)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={addMaksTenor}
                  onChange={(e) => setAddMaksTenor(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Metode Bunga</label>
                <select
                  value={addMetodeBunga}
                  onChange={(e) => setAddMetodeBunga(e.target.value as 'flat' | 'efektif' | 'anuitas')}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="flat">Flat</option>
                  <option value="efektif">Menurun (Efektif)</option>
                  <option value="anuitas">Menurun (Anuitas)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Biaya Admin (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addBiayaAdmin}
                  onChange={(e) => setAddBiayaAdmin(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddType(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm hover:shadow transition cursor-pointer"
                >
                  Tambah Kebijakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
