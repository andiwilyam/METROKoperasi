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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mc-card">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 mc-muted" />
              <input
                type="text"
                placeholder="Cari nama anggota atau transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs mc-border mc-surface-2 rounded-lg mc-focus focus:ring-[var(--mc-accent)]"
              />
            </div>

            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={() => {
                  setError('');
                  setShowForm('setor');
                }}
                className="flex-1 sm:flex-initial mc-btn-primary px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
                Setor Simpanan
              </button>
              <button
                onClick={() => {
                  setError('');
                  setShowForm('tarik');
                }}
                className="flex-1 sm:flex-initial mc-btn-danger px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Tarik Tunai
              </button>
            </div>
          </div>

          {/* Form Modal / Panel */}
          {showForm && (
            <div className="mc-card relative animate-fadeIn">
              <button
                onClick={() => setShowForm(null)}
                className="absolute right-4 top-4 mc-muted hover:mc-ink hover:mc-surface-2 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-bold mc-ink-strong text-sm mb-4 flex items-center gap-2">
                {showForm === 'setor' ? '🟢 Setor Dana Simpanan Koperasi' : '🔴 Tarik Tunai Dana Simpanan'}
              </h3>

              {error && (
                <div className="mb-4 p-3 mc-surface-2 mc-border text-red-600 text-xs font-semibold rounded-lg" style={{ borderColor: 'var(--mc-error)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
                <div>
                  <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Anggota Koperasi</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                    className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 mc-ink-strong font-semibold"
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
                  <label className="block font-semibold mc-ink-strong mb-1.5">Jenis Tabungan</label>
                  <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    required
                    className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 mc-ink-strong font-semibold"
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
                  <label className="block font-semibold mc-ink-strong mb-1.5">Jumlah Nominal (Rp)</label>
                  <input
                    type="number"
                    value={jumlah}
                    min={1000}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-mono font-semibold mc-ink-strong"
                  />
                </div>

                <div>
                  <label className="block font-semibold mc-ink-strong mb-1.5">Catatan / Keterangan</label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Opsional, tulis keterangan tambahan"
                    className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 mc-ink"
                  />
                </div>

                <div className="md:col-span-4 text-right pt-2 space-x-2 border-t mc-border">
                  <button
                    type="button"
                    onClick={() => setShowForm(null)}
                    className="px-4 py-2 mc-border hover:mc-surface-2 rounded-lg mc-muted font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-white font-semibold rounded-lg cursor-pointer transition ${
                      showForm === 'setor' ? 'mc-btn-primary' : 'mc-btn-danger'
                    }`}
                  >
                    {showForm === 'setor' ? 'Proses Setoran Jurnal' : 'Tarik Tunai Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions Table */}
          <div className="mc-card overflow-hidden">
            <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm">
              Mutasi Riwayat Transaksi Buku
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="mc-surface-2 border-b mc-border mc-muted font-semibold">
                    <th className="p-4">Tanggal Transaksi</th>
                    <th className="p-4">Anggota Koperasi</th>
                    <th className="p-4">Jenis Tabungan</th>
                    <th className="p-4">Keterangan Jurnal</th>
                    <th className="p-4">Nominal</th>
                    <th className="p-4">Jenis</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filteredTrans.map((t) => (
                    <tr key={t.id} className="hover:mc-surface-2/50">
                      <td className="p-4 font-mono font-semibold mc-muted">{t.tanggal}</td>
                      <td className="p-4 font-bold mc-ink-strong">{t.anggotaNama}</td>
                      <td className="p-4 mc-ink">{t.jenisNama}</td>
                      <td className="p-4 mc-muted italic max-w-xs truncate" title={t.keterangan}>{t.keterangan}</td>
                      <td className="p-4 font-mono font-extrabold mc-ink-strong">{formatIDR(t.jumlah)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          t.tipe === 'setor' 
                            ? 'mc-badge-ok' 
                            : 'mc-btn-danger'
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
        <div className="mc-card overflow-hidden">
          <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm">
            Permohonan Penarikan Anggota (Portal CS)
          </div>
          
          {permohonanList.length === 0 ? (
            <div className="text-center py-10 mc-muted text-xs">
              😴 Tidak ada permohonan tarik simpanan dari portal anggota saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="mc-surface-2 border-b mc-border mc-muted font-semibold">
                    <th className="p-4">Tanggal Pengajuan</th>
                    <th className="p-4">Nama Anggota</th>
                    <th className="p-4">Jenis Tabungan</th>
                    <th className="p-4">Jumlah Nominal</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {permohonanList.map((p) => (
                    <tr key={p.id} className="hover:mc-surface-2/50">
                      <td className="p-4 font-mono font-semibold mc-muted">{p.tanggal}</td>
                      <td className="p-4 font-bold mc-ink-strong">{p.anggotaNama}</td>
                      <td className="p-4 mc-ink">{p.jenisNama}</td>
                      <td className="p-4 font-mono font-extrabold mc-ink-strong">{formatIDR(p.jumlah)}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          p.status === 'pengajuan' 
                            ? 'mc-badge-accent animate-pulse' 
                            : p.status === 'disetujui' 
                            ? 'mc-badge-ok' 
                            : 'mc-btn-danger'
                        }`}>
                          {p.status === 'pengajuan' ? 'Menunggu Approval' : p.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.status === 'pengajuan' && (
                          <>
                            <button
                              onClick={() => onApproveTarik(p.id)}
                              className="mc-badge-ok px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Setujui & Beri Dana
                            </button>
                            <button
                              onClick={() => onRejectTarik(p.id)}
                              className="mc-btn-danger px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
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
        <div className="mc-card overflow-hidden">
          <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              Konfigurasi Kebijakan Jenis Simpanan
              <button
                onClick={() => setShowAddType(true)}
                className="flex items-center gap-1 mc-btn-primary text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Jenis Simpanan
              </button>
            </span>
            <span className="text-xs mc-badge-accent px-2 py-1 rounded-md flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Regulasi SAK ETAP
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {savingsTypes.map((st) => (
                <div key={st.id} className="mc-border rounded-xl p-4 mc-surface-2/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold mc-ink-strong text-sm flex justify-between items-start gap-1">
                      <span>{st.nama}</span>
                      <button
                        onClick={() => startEditType(st)}
                        className="p-1 hover:mc-surface-2 rounded-lg mc-muted hover:mc-icon-accent transition cursor-pointer"
                        title="Edit Kebijakan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] mc-muted font-bold uppercase tracking-wider font-mono">Tipe: {st.tipe}</div>
                    
                    <div className="pt-2 flex justify-between text-xs border-t mc-border/50">
                      <span className="mc-muted">Min. Setoran</span>
                      <span className="font-semibold mc-ink-strong font-mono">{formatIDR(st.minimalSetoran)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="mc-muted">Suku Bunga</span>
                      <span className="font-semibold mc-ink-strong font-mono">{st.bungaPersen}% / thn</span>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="mc-muted">Skema Akumulasi</span>
                      <span className="text-[10px] font-bold mc-badge-accent px-1.5 py-0.5 rounded">
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
          <div className="mc-surface mc-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center" style={{ background: 'var(--mc-primary)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Settings className="w-4 h-4" style={{ color: 'var(--mc-accent)' }} />
                Ubah Kebijakan Simpanan
              </h3>
              <button 
                onClick={() => setEditingType(null)}
                className="hover:bg-slate-700/50 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Nama Kebijakan Simpanan</label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Minimal Setoran (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editMinimalSetoran}
                  onChange={(e) => setEditMinimalSetoran(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Suku Bunga Tahunan (%)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={editBungaPersen}
                  onChange={(e) => setEditBungaPersen(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
                <span className="text-[10px] mc-muted mt-1 block">Suku bunga simpanan tabungan per tahun, disesuaikan dengan regulasi bunga pasar.</span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mc-border">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="px-4 py-2 mc-surface-2 hover:mc-border mc-ink font-bold rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-bold rounded shadow-sm hover:shadow transition cursor-pointer" style={{ background: 'var(--mc-primary)' }}
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
          <div className="mc-surface mc-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center" style={{ background: 'var(--mc-success)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Plus className="w-4 h-4" style={{ color: 'var(--mc-success)' }} />
                Tambah Kebijakan Simpanan Baru
              </h3>
              <button 
                onClick={() => setShowAddType(false)}
                className="hover:bg-slate-700/50 p-1.5 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Nama Kebijakan Simpanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Simpanan Sukarela Berjangka"
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Tipe Simpanan</label>
                <select
                  value={addTipe}
                  onChange={(e) => setAddTipe(e.target.value as any)}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                >
                  <option value="sukarela">Sukarela</option>
                  <option value="wajib">Wajib</option>
                  <option value="pokok">Pokok</option>
                  <option value="deposito">Deposito / Berjangka</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Minimal Setoran (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addMinimalSetoran}
                  onChange={(e) => setAddMinimalSetoran(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Suku Bunga Tahunan (%)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={addBungaPersen}
                  onChange={(e) => setAddBungaPersen(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mc-border">
                <button
                  type="button"
                  onClick={() => setShowAddType(false)}
                  className="px-4 py-2 mc-surface-2 hover:mc-border mc-ink font-bold rounded transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 mc-btn-primary font-bold rounded shadow-sm hover:shadow transition cursor-pointer"
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