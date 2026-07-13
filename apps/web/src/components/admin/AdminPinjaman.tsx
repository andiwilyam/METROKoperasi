/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calculator, Check, AlertCircle, Calendar, Receipt, Sparkles, X, Edit, Settings, Plus } from 'lucide-react';
import { Anggota, JenisPinjaman, Pinjaman, Angsuran } from '@metrocoop/shared/types';

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mc-card">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 mc-muted" />
              <input
                type="text"
                placeholder="Cari pengajuan pinjaman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs mc-border mc-surface-2 rounded-lg mc-focus focus:ring-[var(--mc-accent)]"
              />
            </div>

            <button
              onClick={() => {
                setShowSimModal(true);
              }}
              className="w-full sm:w-auto mc-btn-primary px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              Simulasi & Buat Pengajuan Baru
            </button>
          </div>

          {/* Simulation & Creation Modal */}
          {showSimModal && (
            <div className="mc-card relative animate-fadeIn">
              <button
                onClick={() => setShowSimModal(false)}
                className="absolute right-4 top-4 mc-muted hover:mc-ink hover:mc-surface-2 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-bold mc-ink-strong text-sm mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 mc-icon-accent" />
                Simulasi Perhitungan Pinjaman Koperasi
              </h3>

              <form onSubmit={handleCreateLoanSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                
                {/* Inputs Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Anggota</label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      required
                      className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-semibold mc-ink-strong"
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
                    <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Kategori Pinjaman</label>
                    <select
                      value={selectedTypeId}
                      onChange={(e) => setSelectedTypeId(e.target.value)}
                      required
                      className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-semibold mc-ink-strong"
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
                      <label className="block font-semibold mc-ink-strong mb-1.5">Besar Pokok (Rp)</label>
                      <input
                        type="number"
                        value={pokok}
                        step={500000}
                        onChange={(e) => setPokok(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-mono font-bold mc-ink-strong"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mc-ink-strong mb-1.5">Tenor (Bulan)</label>
                      <input
                        type="number"
                        value={tenor}
                        min={1}
                        max={36}
                        onChange={(e) => setTenor(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-mono font-bold mc-ink-strong"
                      />
                    </div>
                  </div>

                  {activeType && (
                    <div className="mc-surface-2 mc-border p-3.5 rounded-lg space-y-1.5">
                      <div className="flex justify-between">
                        <span className="mc-muted">Metode Angsuran:</span>
                        <span className="font-bold mc-ink-strong capitalize">{activeType.metodeBunga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="mc-muted">Biaya Administrasi:</span>
                        <span className="font-mono font-bold mc-ink-strong">{formatIDR(activeType.biayaAdmin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="mc-muted">Plafon Maksimum:</span>
                        <span className="font-mono font-bold mc-ink-strong">{formatIDR(activeType.maksPlafon)}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSimModal(false)}
                      className="px-4 py-2 mc-border hover:mc-surface-2 rounded-lg font-semibold mc-ink"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 mc-btn-primary font-semibold rounded-lg shadow-sm"
                    >
                      Ajukan Sekarang
                    </button>
                  </div>
                </div>

                {/* Simulation Outputs Column */}
                <div className="lg:col-span-7 border-l mc-border pl-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold mc-ink-strong text-xs mb-3 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 mc-icon-accent" />
                      Rencana Tabel Angsuran Bulanan (Proyeksi)
                    </h4>
                    
                    {simulationSchedule.length === 0 ? (
                      <div className="text-center py-12 mc-muted">
                        Select a category and adjust numbers to view projection.
                      </div>
                    ) : (
                      <div className="max-h-56 overflow-y-auto mc-border rounded-lg">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="mc-surface-2 font-semibold mc-muted border-b mc-border sticky top-0">
                              <th className="p-2">Bulan Ke-</th>
                              <th className="p-2">Pokok Dibayar</th>
                              <th className="p-2">Margin Jasa</th>
                              <th className="p-2">Total Setoran</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y mc-border font-mono">
                            {simulationSchedule.map((row) => (
                              <tr key={row.bulan} className="hover:mc-surface-2/50">
                                <td className="p-2 mc-muted font-bold"># {row.bulan}</td>
                                <td className="p-2 mc-ink">{formatIDR(row.pokok)}</td>
                                <td className="p-2" style={{ color: 'var(--mc-accent)' }}>{formatIDR(row.bunga)}</td>
                                <td className="p-2 mc-ink-strong font-bold">{formatIDR(row.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {simulationSchedule.length > 0 && (
                    <div className="mc-surface-2 mc-border rounded-xl flex items-center justify-between mt-4" style={{ borderColor: 'var(--mc-accent)' }}>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--mc-accent)' }}>Rata-rata Angsuran</div>
                        <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--mc-primary)' }}>{formatIDR(simulatedAngsuranPerBulan)} / bulan</div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full mc-badge-accent">
                        Sesuai Kebijakan
                      </span>
                    </div>
                  )}
                </div>

              </form>
            </div>
          )}

          {/* List of Loans Requested or Disbursed */}
          <div className="mc-card overflow-hidden">
            <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm">
              Berkas Pengajuan & Pinjaman Aktif
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="mc-surface-2 border-b mc-border mc-muted font-semibold">
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
                <tbody className="divide-y mc-border">
                  {loans.map((l) => (
                    <tr key={l.id} className="hover:mc-surface-2/50">
                      <td className="p-4 font-mono font-bold mc-muted">{l.noPinjaman || 'PROPOSAL'}</td>
                      <td className="p-4 font-bold mc-ink-strong">{l.anggotaNama}</td>
                      <td className="p-4 mc-ink">{l.jenisNama}</td>
                      <td className="p-4 font-mono font-bold mc-ink-strong">{formatIDR(l.pokok)}</td>
                      <td className="p-4 font-mono">{l.tenorMonths} bln</td>
                      <td className="p-4 font-mono font-semibold mc-ink-strong">{formatIDR(l.angsuranPerBulan)}</td>
                      <td className="p-4 font-mono font-bold mc-ink-strong" style={{ color: 'var(--mc-accent)' }}>
                        {l.status === 'dicairkan' ? formatIDR(l.sisaPokok) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          l.status === 'pengajuan' 
                            ? 'mc-badge-accent' 
                            : l.status === 'disetujui' 
                            ? 'mc-badge-accent' 
                            : l.status === 'dicairkan' 
                            ? 'mc-badge-ok animate-soft-pulse' 
                            : l.status === 'lunas' 
                            ? 'mc-muted line-through' 
                            : 'mc-btn-danger'
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
                              className="mc-badge-ok px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectLoan(l.id)}
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
          </div>
        </>
      )}

      {/* 2. BAYAR ANGSURAN */}
      {subView === 'angsuran' && (
        <div className="mc-card overflow-hidden">
          <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm">
            Loket Pembayaran Angsuran Bulanan (Staff Kasir)
          </div>
          <div className="p-4 mc-surface-2 border-b mc-border text-xs mc-muted flex items-center gap-2">
            <AlertCircle className="w-4 h-4 mc-icon-accent" />
            <span>Pilih jadwal angsuran yang belum dibayar di bawah untuk mencatat pelunasan tunai/transfer.</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="mc-surface-2 border-b mc-border mc-muted font-semibold">
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
              <tbody className="divide-y mc-border">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:mc-surface-2/50">
                    <td className="p-4 font-bold mc-ink-strong">{s.anggotaNama}</td>
                    <td className="p-4 font-mono font-bold mc-muted">Angsuran # {s.angsuranKe}</td>
                    <td className="p-4 font-mono mc-muted">{s.tanggalJatuhTempo}</td>
                    <td className="p-4 font-mono mc-ink">{formatIDR(s.pokokBayar)}</td>
                    <td className="p-4 font-mono" style={{ color: 'var(--mc-accent)' }}>{formatIDR(s.bungaBayar)}</td>
                    <td className="p-4 font-mono font-extrabold mc-ink-strong">{formatIDR(s.totalBayar)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        s.status === 'lunas' 
                          ? 'mc-badge-ok' 
                          : 'mc-badge-accent'
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
                          className="mc-btn-primary px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition shadow-sm"
                        >
                          ✔ Terima Pembayaran
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono mc-muted font-semibold italic">Lunas ({s.tanggalBayar})</span>
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
          <div className="mc-card p-5 space-y-4">
            <div className="flex items-start gap-3 mc-surface-2 mc-border p-4 rounded-xl" style={{ borderColor: 'var(--mc-accent)', background: 'var(--mc-sidebar-active)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--mc-accent)' }} />
              <div>
                <h4 className="font-bold text-xs mc-ink-strong">Peringatan Jatuh Tempo & Risiko Tunggakan</h4>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--mc-ink)' }}>
                  Sistem mendeteksi <b>{overdue.length}</b> jadwal pembayaran pinjaman yang belum diselesaikan walaupun telah melewati batas tanggal jatuh tempo (total <b>{formatIDR(totalOverdue)}</b>). Pengingat SMS / WA otomatis dapat diatur dari modul email di pengaturan.
                </p>
              </div>
            </div>

            <div className="mc-border rounded-lg overflow-hidden text-xs">
              <div className="mc-surface-2 px-4 py-3 font-bold mc-ink-strong border-b mc-border">
                Daftar Keterlambatan Pembayaran Aktif ({overdue.length})
              </div>
              <div className="p-4 space-y-3">
                {overdue.length === 0 && (
                  <div className="text-center mc-muted italic py-6">Tidak ada tunggakan aktif. Semua angsuran tepat waktu.</div>
                )}
                {overdue.map((s, idx) => (
                  <div key={s.id} className={`flex justify-between items-center py-2 ${idx < overdue.length - 1 ? 'border-b mc-border' : ''}`}>
                    <div>
                      <div className="font-bold mc-ink-strong">{s.anggotaNama}</div>
                      <div className="text-[10px] mc-muted">Angsuran Ke-{s.angsuranKe} (Jatuh tempo: {s.tanggalJatuhTempo})</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold" style={{ color: 'var(--mc-error)' }}>{formatIDR(s.totalBayar)}</div>
                      <div className="text-[9px] font-bold mc-badge-accent px-1.5 py-0.5 rounded inline-block mt-0.5">Terlambat {s.lateDays} Hari</div>
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
        <div className="mc-card overflow-hidden">
          <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              Konfigurasi Kebijakan Suku Bunga & Jenis Pinjaman
              <button
                onClick={() => setShowAddType(true)}
                className="flex items-center gap-1 mc-btn-primary text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Jenis Pinjaman
              </button>
            </span>
            <span className="text-xs mc-badge-accent px-2 py-1 rounded-md flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Regulasi OJK / Koperasi
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {loanTypes.map((lt) => (
                <div key={lt.id} className="mc-border rounded-xl p-4 mc-surface-2/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-bold mc-ink-strong text-sm flex justify-between items-start gap-1">
                      <span>{lt.nama}</span>
                      <button
                        onClick={() => startEditType(lt)}
                        className="p-1 hover:mc-surface-2 rounded-lg mc-muted hover:mc-icon-accent transition cursor-pointer"
                        title="Edit Kebijakan Pinjaman"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] mc-muted font-bold uppercase tracking-wider font-mono">Bunga/Margin: {lt.bungaPersen}% / bln</div>
                    
                    <div className="pt-2 flex justify-between text-xs border-t mc-border/50">
                      <span className="mc-muted">Maks. Plafon</span>
                      <span className="font-semibold mc-ink-strong font-mono">{formatIDR(lt.maksPlafon)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="mc-muted">Maks. Tenor</span>
                      <span className="font-semibold mc-ink-strong font-mono">{lt.maksTenor} Bulan</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="mc-muted">Metode</span>
                      <span className="font-bold mc-ink-strong capitalize">{lt.metodeBunga}</span>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="mc-muted">Skema Angsuran</span>
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

      {/* Edit Loan Type Modal */}
      {editingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center" style={{ background: 'var(--mc-primary)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Settings className="w-4 h-4" style={{ color: 'var(--mc-accent)' }} />
                Ubah Kebijakan Pinjaman
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
                <label className="block font-semibold mc-ink mb-1">Nama Kebijakan Pinjaman</label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Suku Bunga Bulanan (%)</label>
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
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Maksimal Plafon Pinjaman (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editMaksPlafon}
                  onChange={(e) => setEditMaksPlafon(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Maksimal Tenor (Bulan)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={editMaksTenor}
                  onChange={(e) => setEditMaksTenor(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Metode Bunga</label>
                <select
                  value={editMetodeBunga}
                  onChange={(e) => setEditMetodeBunga(e.target.value as 'flat' | 'efektif' | 'anuitas')}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                >
                  <option value="flat">Flat</option>
                  <option value="efektif">Menurun (Efektif)</option>
                  <option value="anuitas">Menurun (Anuitas)</option>
                </select>
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

      {/* Add Loan Type Modal */}
      {showAddType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center" style={{ background: 'var(--mc-success)' }}>
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Plus className="w-4 h-4" style={{ color: 'var(--mc-success)' }} />
                Tambah Kebijakan Pinjaman Baru
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
                <label className="block font-semibold mc-ink mb-1">Nama Kebijakan Pinjaman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pinjaman Motor Syariah"
                  value={addNama}
                  onChange={(e) => setAddNama(e.target.value)}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Suku Bunga Bulanan (%)</label>
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

              <div>
                <label className="block font-semibold mc-ink mb-1">Maksimal Plafon Pinjaman (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addMaksPlafon}
                  onChange={(e) => setAddMaksPlafon(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Maksimal Tenor (Bulan)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={addMaksTenor}
                  onChange={(e) => setAddMaksTenor(Number(e.target.value))}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Metode Bunga</label>
                <select
                  value={addMetodeBunga}
                  onChange={(e) => setAddMetodeBunga(e.target.value as 'flat' | 'efektif' | 'anuitas')}
                  className="w-full mc-border p-2 rounded mc-surface-2 mc-focus focus:bg-[var(--mc-surface)] mc-ink-strong"
                >
                  <option value="flat">Flat</option>
                  <option value="efektif">Menurun (Efektif)</option>
                  <option value="anuitas">Menurun (Anuitas)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink mb-1">Biaya Admin (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addBiayaAdmin}
                  onChange={(e) => setAddBiayaAdmin(Number(e.target.value))}
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