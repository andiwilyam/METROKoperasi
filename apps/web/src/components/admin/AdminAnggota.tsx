/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, UserPlus, Edit2, Trash2, Mail, Phone, MapPin, Briefcase, DollarSign, X, Check } from 'lucide-react';
import { Anggota } from '../../types';

interface AdminAnggotaProps {
  members: Anggota[];
  onAddMember: (newMember: Omit<Anggota, 'id' | 'saldoSimpananPokok' | 'saldoSimpananWajib' | 'saldoSimpananSukarela'>) => void;
  onUpdateMember: (updatedMember: Anggota) => void;
  onDeleteMember: (id: string) => void;
}

export default function AdminAnggota({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember
}: AdminAnggotaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMember, setEditMember] = useState<Anggota | null>(null);

  // Form State
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [noKtp, setNoKtp] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [penghasilan, setPenghasilan] = useState(5000000);
  const [status, setStatus] = useState<'aktif' | 'nonaktif' | 'keluar'>('aktif');

  const filteredMembers = members.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nik.includes(searchTerm) ||
      m.noHp.includes(searchTerm)
  );

  const resetForm = () => {
    setNik('');
    setNama('');
    setNoKtp('');
    setNoHp('');
    setEmail('');
    setAlamat('');
    setPekerjaan('');
    setPenghasilan(5000000);
    setStatus('aktif');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !nama || !noKtp) return;
    
    onAddMember({
      nik,
      nama,
      noKtp,
      noHp,
      email,
      alamat,
      pekerjaan,
      penghasilan,
      statusKeanggotaan: status,
      tanggalDaftar: new Date().toISOString().split('T')[0]
    });

    setShowAddForm(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;

    onUpdateMember({
      ...editMember,
      nik,
      nama,
      noKtp,
      noHp,
      email,
      alamat,
      pekerjaan,
      penghasilan,
      statusKeanggotaan: status
    });

    setEditMember(null);
    resetForm();
  };

  const startEdit = (m: Anggota) => {
    setEditMember(m);
    setNik(m.nik);
    setNama(m.nama);
    setNoKtp(m.noKtp);
    setNoHp(m.noHp);
    setEmail(m.email);
    setAlamat(m.alamat);
    setPekerjaan(m.pekerjaan);
    setPenghasilan(m.penghasilan);
    setStatus(m.statusKeanggotaan);
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
      
      {/* Control Row with Search and Add buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIK, nama atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditMember(null);
            setShowAddForm(true);
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm shadow-blue-500/10"
        >
          <UserPlus className="w-4 h-4" />
          Registrasi Anggota Baru
        </button>
      </div>

      {/* Forms Section: Add or Edit */}
      {(showAddForm || editMember) && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md relative animate-fadeIn">
          <button
            onClick={() => {
              setShowAddForm(false);
              setEditMember(null);
            }}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            {editMember ? '✍️ Edit Profil Anggota' : '👤 Registrasi Anggota Koperasi Baru'}
          </h3>

          <form onSubmit={editMember ? handleEditSubmit : handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Nomor Induk Kependudukan (NIK)</label>
              <input
                type="text"
                maxLength={10}
                required
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="10 digit nomor NIK unik"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">No. Kartu Tanda Penduduk (KTP)</label>
              <input
                type="text"
                maxLength={16}
                required
                value={noKtp}
                onChange={(e) => setNoKtp(e.target.value)}
                placeholder="16 digit nomor KTP"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Nama Lengkap Sesuai KTP</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">No. HP / WhatsApp Aktif</label>
              <input
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Alamat Email Korespondensi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@mail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Status Keanggotaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-semibold"
              >
                <option value="aktif">🟢 Anggota Aktif</option>
                <option value="nonaktif">🟡 Nonaktif Sementara</option>
                <option value="keluar">🔴 Dikeluarkan / Keluar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Pekerjaan Utama</label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                placeholder="Contoh: Karyawan, PNS, Wiraswasta"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Penghasilan Bulanan (Rp)</label>
              <input
                type="number"
                value={penghasilan}
                onChange={(e) => setPenghasilan(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800 font-mono font-semibold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1.5">Alamat Lengkap Rumah Tinggal</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Tuliskan RT/RW, Desa, Kecamatan, Kota dan Provinsi secara lengkap"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-800"
                rows={2}
              />
            </div>

            <div className="md:col-span-3 text-right space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditMember(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-500/10 cursor-pointer"
              >
                {editMember ? 'Simpan Perubahan' : 'Registrasi Sekarang'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Grid/Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">NIK &amp; Nama Anggota</th>
                <th className="p-4">Hubungan Kontak</th>
                <th className="p-4">Alamat Rumah</th>
                <th className="p-4">Pekerjaan</th>
                <th className="p-4">Saldo Simpanan Pokok</th>
                <th className="p-4">Saldo Sukarela</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/30">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-[13px]">{m.nama}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">NIK: {m.nik}</div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{m.noHp}</span>
                    </div>
                    {m.email && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 max-w-xs truncate text-slate-500" title={m.alamat}>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{m.alamat}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.pekerjaan}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{formatIDR(m.penghasilan)}/bln</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-900 font-mono">
                    {formatIDR(m.saldoSimpananPokok)}
                  </td>
                  <td className="p-4 font-semibold text-slate-900 font-mono text-emerald-600">
                    {formatIDR(m.saldoSimpananSukarela)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      m.statusKeanggotaan === 'aktif' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : m.statusKeanggotaan === 'nonaktif' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.statusKeanggotaan === 'aktif' 
                          ? 'bg-emerald-500' 
                          : m.statusKeanggotaan === 'nonaktif' 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                      }`} />
                      {m.statusKeanggotaan === 'aktif' ? 'Aktif' : m.statusKeanggotaan === 'nonaktif' ? 'Masa Tangguh' : 'Keluar'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => startEdit(m)}
                      className="p-1.5 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                      title="Edit Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus data keanggotaan ${m.nama}? Tindakan ini bersifat permanen!`)) {
                          onDeleteMember(m.id);
                        }
                      }}
                      className="p-1.5 border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
