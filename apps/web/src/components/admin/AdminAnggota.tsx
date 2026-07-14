/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, UserPlus, Shield, Sparkles, X, Calendar, Settings, AlertTriangle, UserPlus as UserPlusIcon, X as XIcon, Edit, Plus } from 'lucide-react';
import { Anggota, Pengurus, UserSession } from '@metrocoop/shared/types';

interface AdminAnggotaProps {
  members: Anggota[];
  onAddMember: (newMember: any) => void;
  onUpdateMember: (updatedMember: any) => void;
  onDeleteMember: (id: string) => void;
  [key: string]: any;
}

export default function AdminAnggota({
  members,
  pengurus,
  onApproveMember,
  onRejectMember,
  onAddPengurus,
  onDeletePengurus,
  onActivateMember,
  onDeactivateMember,
  onLoginAsMember,
  session,
  subView
}: AdminAnggotaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<{ member: Anggota | null; nama: string; nik: string; noHp: string; alamat: string; penghasilan: number }>({ member: null, nama: '', nik: '', noHp: '', alamat: '', penghasilan: 0 });

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const startEdit = (m: Anggota) => {
    setEditForm({ member: m, nama: m.nama, nik: m.nik, noHp: m.noHp, alamat: m.alamat, penghasilan: m.penghasilan });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.member) return;
    alert(`Edit data anggota ${editForm.member.nama} disimpan.`);
    setEditForm({ member: null, nama: '', nik: '', noHp: '', alamat: '', penghasilan: 0 });
  };

  const filtered = members.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.noHp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mc-surface mc-border rounded-xl p-5 shadow-md">
        <div>
          <h2 className="text-xl font-bold mc-ink-strong">Manajemen Data Anggota</h2>
          <p className="text-xs mc-muted mt-0.5">Kelola data nasabah, status keanggotaan, dan struktur pengurus koperasi</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-[var(--mc-accent)] hover:bg-[var(--mc-accent-2)] text-[var(--mc-on-accent)] font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Tambah Anggota Baru
        </button>
      </div>

      {/* VIEW: DAFTAR ANGGOTA */}
      {subView === 'anggota' && (
        <>
          {/* Search & Filter */}
          <div className="mc-surface mc-border rounded-xl p-5 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 mc-muted" />
                <input
                  type="text"
                  placeholder="Cari nama, NIK, atau nomor HP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs mc-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)] mc-surface-2 focus:mc-surface mc-ink mc-focus"
                />
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="mc-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="mc-surface-2 mc-border mc-muted font-semibold">
                    <th className="p-4">NIK / ID</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">No HP</th>
                    <th className="p-4">Status Keanggotaan</th>
                    <th className="p-4">Total Simpanan</th>
                    <th className="p-4">Penghasilan / Bln</th>
                    <th className="p-4">Tanggal Gabung</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:mc-surface-2/50">
                      <td className="p-4 font-mono font-bold mc-muted">{m.nik}</td>
                      <td className="p-4 font-bold mc-ink-strong">{m.nama}</td>
                      <td className="p-4 font-mono mc-muted">{m.noHp}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          m.statusKeanggotaan === 'aktif'
                            ? 'mc-badge-ok'
                            : m.statusKeanggotaan === 'nonaktif'
                            ? 'mc-btn-danger'
                            : 'mc-badge-accent'
                        }`}>
                          {m.statusKeanggotaan === 'aktif' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--mc-success)]" />}
                          {m.statusKeanggotaan === 'aktif' ? 'Aktif' : m.statusKeanggotaan === 'nonaktif' ? 'Nonaktif' : 'Cuti'}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold mc-ink-strong">
                        {formatIDR(m.saldoSimpananPokok + m.saldoSimpananWajib + m.saldoSimpananSukarela)}
                      </td>
                      <td className="p-4 font-mono mc-muted">{formatIDR(m.penghasilan)}</td>
                      <td className="p-4 font-mono mc-muted">{m.tanggalDaftar}</td>
                      <td className="p-4 text-right space-x-2">
                        {m.statusKeanggotaan === 'aktif' && (
                          <button
                            onClick={() => onDeactivateMember(m.id)}
                            className="mc-btn-danger border px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                          >
                            Nonaktifkan
                          </button>
                        )}
                        {m.statusKeanggotaan !== 'aktif' && (
                          <button
                            onClick={() => onActivateMember(m.id)}
                            className="mc-badge-ok border px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer transition"
                          >
                            Aktifkan
                          </button>
                        )}
                        <button
                          onClick={() => onLoginAsMember(m.id)}
                          className="mc-surface-2 mc-border px-2.5 py-1 rounded font-semibold text-[10px] mc-ink cursor-pointer transition hover:mc-surface"
                        >
                          Login Sbgn
                        </button>
                        <button
                          onClick={() => startEdit(m)}
                          className="mc-surface-2 mc-border px-2.5 py-1 rounded font-semibold text-[10px] mc-ink cursor-pointer transition hover:mc-surface"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-8 text-center mc-muted text-xs border-t mc-border">Belum ada data anggota.</div>
            )}
          </div>
        </>
      )}

      {/* VIEW: PENGURUS */}
      {subView === 'pengurus' && (
        <div className="mc-card space-y-5">
          <div className="flex justify-between items-center p-5 border-b mc-border">
            <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 mc-icon-accent" /> Struktur Pengurus Koperasi
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-[var(--mc-accent)] hover:bg-[var(--mc-accent-2)] text-[var(--mc-on-accent)] font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Tambah Pengurus
            </button>
          </div>

          <div className="p-5 space-y-3">
            {pengurus.length === 0 ? (
              <div className="text-center py-10 mc-muted text-xs">Belum ada pengurus terdaftar.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pengurus.map((p: any) => (
                  <div key={p.id} className="mc-surface-2 mc-border rounded-xl p-4 space-y-2 hover:shadow-md transition">
                    <div className="font-bold mc-ink-strong text-sm flex justify-between items-start gap-1">
                      <span>{p.nama}</span>
                      <button
                        onClick={() => onDeletePengurus(p.id)}
                        className="p-1 hover:bg-[var(--mc-danger-bg)] rounded-lg text-[var(--mc-danger)] hover:text-[var(--mc-danger)] transition cursor-pointer"
                        title="Hapus"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] mc-muted font-bold uppercase tracking-wider font-mono">{p.jabatan}</div>
                    <div className="pt-2 flex justify-between text-xs border-t mc-border">
                      <span className="mc-muted">NIK</span>
                      <span className="font-semibold mc-ink-strong font-mono">{p.nik}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="mc-muted">No HP</span>
                      <span className="font-semibold mc-ink-strong font-mono">{p.noHp}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="mc-muted">Alamat</span>
                      <span className="font-semibold mc-ink-strong truncate max-w-[100px]">{p.nik}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: PENGAJUAN ANGGOTA */}
      {subView === 'pengajuan' && (
        <div className="mc-card space-y-5">
          <div className="p-5 border-b mc-border">
            <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 mc-icon-accent" /> Verifikasi Pengajuan Keanggotaan Baru
            </h3>
            <p className="text-[11px] mc-muted mt-1">Tinjau data pendaftar yang mendaftar melalui portal anggota / CS.</p>
          </div>
          <div className="p-5">
            <div className="mc-surface-2 mc-border rounded-lg p-4 space-y-2 text-xs">
              <div className="text-center mc-muted italic py-6">Belum ada pengajuan keanggotaan masuk dari portal.</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT MEMBER MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center bg-[var(--mc-accent)] text-[var(--mc-on-accent)]">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Tambah Anggota Baru
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="hover:bg-[var(--mc-accent-2)] p-1.5 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Anggota baru disimpan (mock).'); setShowForm(false); }} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Nama Lengkap</label>
                <input required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">NIK (16 digit)</label>
                  <input required type="number" className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
                </div>
                <div>
                  <label className="block font-semibold mc-ink mb-1">No HP</label>
                  <input required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Alamat Lengkap</label>
                <textarea required rows={2} className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">Penghasilan Bulanan (Rp)</label>
                  <input required type="number" className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)] font-mono" />
                </div>
                <div>
                  <label className="block font-semibold mc-ink mb-1">Pekerjaan</label>
                  <input className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t mc-border">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 mc-surface-2 mc-border hover:mc-surface mc-ink font-bold rounded transition cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-[var(--mc-accent)] hover:bg-[var(--mc-accent-2)] text-[var(--mc-on-accent)] font-bold rounded shadow-sm hover:shadow transition cursor-pointer">Simpan Anggota</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editForm.member && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center bg-[var(--mc-primary)] text-[var(--mc-on-accent)]">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Edit Data Anggota
              </h3>
              <button
                onClick={() => setEditForm({ member: null, nama: '', nik: '', noHp: '', alamat: '', penghasilan: 0 })}
                className="hover:bg-[var(--mc-accent-2)] p-1.5 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink mb-1">Nama Lengkap</label>
                <input value={editForm.nama} onChange={(e) => setEditForm(f => ({ ...f, nama: e.target.value }))} required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink mb-1">NIK</label>
                  <input value={editForm.nik} onChange={(e) => setEditForm(f => ({ ...f, nik: e.target.value }))} required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
                </div>
                <div>
                  <label className="block font-semibold mc-ink mb-1">No HP</label>
                  <input value={editForm.noHp} onChange={(e) => setEditForm(f => ({ ...f, noHp: e.target.value }))} required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Alamat Lengkap</label>
                <textarea value={editForm.alamat} onChange={(e) => setEditForm(f => ({ ...f, alamat: e.target.value }))} required rows={2} className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" />
              </div>
              <div>
                <label className="block font-semibold mc-ink mb-1">Penghasilan Bulanan (Rp)</label>
                <input type="number" value={editForm.penghasilan} onChange={(e) => setEditForm(f => ({ ...f, penghasilan: Number(e.target.value) }))} required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)] font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t mc-border">
                <button type="button" onClick={() => setEditForm({ member: null, nama: '', nik: '', noHp: '', alamat: '', penghasilan: 0 })} className="px-4 py-2 mc-surface-2 mc-border hover:mc-surface mc-ink font-bold rounded transition cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-[var(--mc-primary)] hover:bg-[var(--mc-accent-2)] text-[var(--mc-on-accent)] font-bold rounded shadow-sm hover:shadow transition cursor-pointer">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PENGURUS MODAL */}
      {showForm && subView === 'pengurus' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mc-surface mc-border rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b mc-border flex justify-between items-center bg-[var(--mc-success)] text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Tambah Pengurus Baru
              </h3>
              <button onClick={() => setShowForm(false)} className="hover:bg-[var(--mc-success-bg)] p-1.5 rounded-lg transition cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Pengurus disimpan (mock).'); setShowForm(false); }} className="p-6 space-y-4 text-xs">
              <div><label className="block font-semibold mc-ink mb-1">Nama Lengkap</label><input required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block font-semibold mc-ink mb-1">Jabatan</label><select required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]"><option value="">-- Pilih --</option><option value="Ketua">Ketua</option><option value="Sekretaris">Sekretaris</option><option value="Bendahara">Bendahara</option><option value="Anggota">Anggota</option></select></div><div><label className="block font-semibold mc-ink mb-1">NIK</label><input required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" /></div></div>
              <div><label className="block font-semibold mc-ink mb-1">No HP</label><input required className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" /></div>
              <div><label className="block font-semibold mc-ink mb-1">Alamat</label><textarea required rows={2} className="w-full mc-border mc-surface p-2 rounded mc-ink focus:mc-surface focus:outline-none focus:ring-2 focus:ring-[var(--mc-accent)]" /></div>
              <div className="flex justify-end gap-2 pt-4 border-t mc-border"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 mc-surface-2 mc-border hover:mc-surface mc-ink font-bold rounded transition cursor-pointer">Batal</button><button type="submit" className="px-4 py-2 bg-[var(--mc-success)] hover:bg-[var(--mc-success-bg)] text-white font-bold rounded shadow-sm hover:shadow transition cursor-pointer">Simpan Pengurus</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}