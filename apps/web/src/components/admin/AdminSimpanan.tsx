/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, ArrowUpRight, ArrowDownLeft, X, Sparkles, Edit, Settings } from 'lucide-react';
import { Anggota, JenisSimpanan, SimpananTransaksi, PermohonanTarik } from '../../types';

interface AdminSimpananProps {
  members: Anggota[];
  savingsTrans: SimpananTransaksi[];
  savingsTypes: JenisSimpanan[];
  permohonanList: PermohonanTarik[];
  onAddTransaction: (newTrans: Omit<SimpananTransaksi, 'id'>) => void;
  onApproveTarik: (id: string) => void;
  onRejectTarik: (id: string) => void;
  onUpdateSavingsTypes: (updated: JenisSimpanan[]) => void;
  subView: 'transaksi' | 'permohonan' | 'jenis';
}

export default function AdminSimpanan({
  members,
  savingsTrans,
  savingsTypes,
  permohonanList,
  onAddTransaction,
  onApproveTarik,
  onRejectTarik,
  onUpdateSavingsTypes,
  subView
}: AdminSimpananProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState<'setor' | 'tarik' | null>(null);

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [jumlah, setJumlah] = useState(100000);
  const [keterangan, setKeterangan] = useState('');
  const [error, setError] = useState('');

  // Editing Savings Type State
  const [editingType, setEditingType] = useState<JenisSimpanan | null>(null);
  const [editNama, setEditNama] = useState('');
  const [editMinimalSetoran, setEditMinimalSetoran] = useState(0);
  const [editBungaPersen, setEditBungaPersen] = useState(0);

  // Adding Savings Type State
  const [showAddType, setShowAddType] = useState(false);
  const [addNama, setAddNama] = useState('');
  const [addTipe, setAddTipe] = useState<'pokok' | 'wajib' | 'sukarela' | 'deposito'>('sukarela');
  const [addMinimalSetoran, setAddMinimalSetoran] = useState(10000);
  const [addBungaPersen, setAddBungaPersen] = useState(0);

  const startEditType = (type: JenisSimpanan) => {
    setEditingType(type);
    setEditNama(type.nama);
    setEditMinimalSetoran(type.minimalSetoran);
    setEditBungaPersen(type.bungaPersen);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    const updated = savingsTypes.map((t) =>
      t.id === editingType.id
        ? {
            ...t,
            nama: editNama,
            minimalSetoran: editMinimalSetoran,
            bungaPersen: editBungaPersen
          }
        : t
    );
    onUpdateSavingsTypes(updated);
    setEditingType(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newType: JenisSimpanan = {
      id: `js_${Date.now()}`,
      nama: addNama,
      tipe: addTipe,
      minimalSetoran: addMinimalSetoran,
      bungaPersen: addBungaPersen
    };
    onUpdateSavingsTypes([...savingsTypes, newType]);
    setAddNama('');
    setAddTipe('sukarela');
    setAddMinimalSetoran(10000);
    setAddBungaPersen(0);
    setShowAddType(false);
  };

  const filteredTrans = savingsTrans.filter(
    (t) =>
      t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMemberId || !selectedTypeId || jumlah <= 0) {
      setError('Mohon lengkapi semua isian form.');
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    const type = savingsTypes.find((t) => t.id === selectedTypeId);

    if (!member || !type) return;

    // Validation for withdrawal
    if (showForm === 'tarik') {
      let balance = 0;
      if (type.tipe === 'pokok') balance = member.saldoSimpananPokok;
      else if (type.tipe === 'wajib') balance = member.saldoSimpananWajib;
      else if (type.tipe === 'sukarela') balance = member.saldoSimpananSukarela;

      if (jumlah > balance) {
        setError(`Saldo simpanan tidak mencukupi. Saldo saat ini: ${formatIDR(balance)}`);
        return;
      }
    }

    onAddTransaction({
      anggotaId: selectedMemberId,
      anggotaNama: member.nama,
      jenisSimpananId: selectedTypeId,
      jenisNama: type.nama,
      tanggal: new Date().toISOString().split('T')[0],
      tipe: showForm!,
      jumlah,
      keterangan: keterangan || `${showForm === 'setor' ? 'Penyetoran' : 'Penarikan'} ${type.nama}`
    });

    setShowForm(null);
    setSelectedMemberId('');
    setSelectedTypeId('');
    setJumlah(100000);
    setKeterangan('');
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
      
      {/* 1. TRANSACTION LIST AND DEPOSIT/WITHDRAW ACTIONS */}
      {subView === 'transaksi' && (
        <>
          {/* Action Control Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama anggota atau transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={() => {
                  setError('');
                  setShowForm('setor');
                }}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
                Setor Simpanan
              </button>
              <button
                onClick={() => {
                  setError('');
                  setShowForm('tarik');
                }}
                className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Tarik Tunai
              </button>
            </div>
          </div>

          {/* Form Modal / Panel */}
          {showForm && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md relative animate-fadeIn">
              <button
                onClick={() => setShowForm(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                {showForm === 'setor' ? '🟢 Setor Dana Simpanan Koperasi' : '🔴 Tarik Tunai Dana Simpanan'}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Pilih Anggota Koperasi</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-semibold"
                  >
                    <option value="">-- Pilih Anggota --</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama} (NIK: {m.nik})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Jenis Tabungan</label>
                  <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-semibold"
                  >
                    <option value="">-- Pilih Jenis --</option>
                    {savingsTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama} (Min: {formatIDR(t.minimalSetoran)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Jumlah Nominal (Rp)</label>
                  <input
                    type="number"
                    value={jumlah}
                    min={1000}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Catatan / Keterangan</label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Opsional, tulis keterangan tambahan"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="md:col-span-4 text-right pt-2 space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(null)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-white font-semibold rounded-lg cursor-pointer transition ${
                      showForm === 'setor' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {showForm === 'setor' ? 'Proses Setoran Jurnal' : 'Tarik Tunai Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
              Mutasi Riwayat Transaksi Buku
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Tanggal Transaksi</th>
                    <th className="p-4">Anggota Koperasi</th>
                    <th className="p-4">Jenis Tabungan</th>
                    <th className="p-4">Keterangan Jurnal</th>
                    <th className="p-4">Nominal</th>
                    <th className="p-4">Jenis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrans.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/30">
                      <td className="p-4 font-mono font-semibold text-slate-500">{t.tanggal}</td>
                      <td className="p-4 font-bold text-slate-800">{t.anggotaNama}</td>
                      <td className="p-4 text-slate-600">{t.jenisNama}</td>
                      <td className="p-4 text-slate-500 italic max-w-xs truncate" title={t.keterangan}>{t.keterangan}</td>
                      <td className="p-4 font-mono font-extrabold text-slate-900">{formatIDR(t.jumlah)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          t.tipe === 'setor' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {t.tipe === 'setor' ? '📥 SETOR' : '📤 TARIK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. PENDING WITHDRAWALS BY MEMBERS APPROVAL */}
      {subView === 'permohonan' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
            Permohonan Penarikan Anggota (Portal CS)
          </div>
          
          {permohonanList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              😴 Tidak ada permohonan tarik simpanan dari portal anggota saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4">Tanggal Pengajuan</th>
                    <th className="p-4">Nama Anggota</th>
                    <th className="p-4">Jenis Tabungan</th>
                    <th className="p-4">Jumlah Nominal</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permohonanList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-semibold text-slate-500">{p.tanggal}</td>
                      <td className="p-4 font-bold text-slate-800">{p.anggotaNama}</td>
                      <td className="p-4 text-slate-600">{p.jenisNama}</td>
                      <td className="p-4 font-mono font-extrabold text-slate-900">{formatIDR(p.jumlah)}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          p.status === 'pengajuan' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                            : p.status === 'disetujui' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {p.status === 'pengajuan' ? 'Menunggu Approval' : p.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onApproveTarik(p.id)}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Setujui &amp; Beri Dana
                            </button>
                            <button
                              onClick={() => onRejectTarik(p.id)}
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
          )}
        </div>
      )}

      {/* 3. CONFIGURATION OF SAVINGS TYPES */}
      {subView === 'jenis' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              Konfigurasi Kebijakan Jenis Simpanan
              <button
                onClick={() => setShowAddType(true)}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Jenis Simpanan
              </button>
            </span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Regulasi SAK ETAP
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {savingsTypes.map((st) => (
                <div key={st.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 text-sm flex justify-between items-start gap-1">
                      <span>{st.nama}</span>
                      <button
                        onClick={() => startEditType(st)}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition cursor-pointer"
                        title="Edit Kebijakan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tipe: {st.tipe}</div>
                    
                    <div className="pt-2 flex justify-between text-xs border-t border-slate-200/50">
                      <span className="text-slate-500">Min. Setoran</span>
                      <span className="font-semibold text-slate-800 font-mono">{formatIDR(st.minimalSetoran)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Suku Bunga</span>
                      <span className="font-semibold text-slate-800 font-mono">{st.bungaPersen}% / thn</span>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-slate-500">Skema Akumulasi</span>
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

      {/* Edit Savings Type Modal */}
      {editingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-blue-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                Ubah Kebijakan Simpanan
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
                <label className="block font-semibold text-slate-600 mb-1">Nama Kebijakan Simpanan</label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Minimal Setoran (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editMinimalSetoran}
                  onChange={(e) => setEditMinimalSetoran(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Suku Bunga Tahunan (%)</label>
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
                <span className="text-[10px] text-slate-400 mt-1 block">Suku bunga simpanan tabungan per tahun, disesuaikan dengan regulasi bunga pasar.</span>
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

      {/* Add Savings Type Modal */}
      {showAddType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-emerald-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-300" />
                Tambah Kebijakan Simpanan Baru
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
                <label className="block font-semibold text-slate-600 mb-1">Nama Kebijakan Simpanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Simpanan Sukarela Berjangka"
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tipe Simpanan</label>
                <select
                  value={addTipe}
                  onChange={(e) => setAddTipe(e.target.value as any)}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="sukarela">Sukarela</option>
                  <option value="wajib">Wajib</option>
                  <option value="pokok">Pokok</option>
                  <option value="deposito">Deposito / Berjangka</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Minimal Setoran (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addMinimalSetoran}
                  onChange={(e) => setAddMinimalSetoran(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2 rounded bg-slate-50 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Suku Bunga Tahunan (%)</label>
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
