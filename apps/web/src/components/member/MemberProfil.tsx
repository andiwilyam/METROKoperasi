/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { Anggota, UserSession } from '@metrocoop/shared/types';

interface MemberProfilProps {
  session: UserSession;
  members: Anggota[];
  onUpdateMember: (updated: Anggota) => void;
}

export default function MemberProfil({
  session,
  members,
  onUpdateMember
}: MemberProfilProps) {
  const member = members.find((m) => m.id === session.memberId);

  const [nama, setNama] = useState(member?.nama || '');
  const [noHp, setNoHp] = useState(member?.noHp || '');
  const [email, setEmail] = useState(member?.email || '');
  const [alamat, setAlamat] = useState(member?.alamat || '');
  const [pekerjaan, setPekerjaan] = useState(member?.pekerjaan || '');
  const [penghasilan, setPenghasilan] = useState(member?.penghasilan || 0);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!member) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
        Data profil anggota tidak ditemukan. Harap hubungi administrator.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMember({
      ...member,
      nama,
      noHp,
      email,
      alamat,
      pekerjaan,
      penghasilan
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xl font-extrabold shadow-inner">
            {nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">{nama || 'Nama Anggota'}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">NIK: {member.nik} | No. KTP: {member.noKtp}</p>
          </div>
        </div>

        {showSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-semibold">Profil berhasil diperbarui secara aman di database koperasi.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1.5">Nomor WhatsApp / HP</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1.5">Alamat Surat Elektronik (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1.5">Pekerjaan</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1.5">Estimasi Penghasilan Bulanan (Rp)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={penghasilan}
                  onChange={(e) => setPenghasilan(Number(e.target.value))}
                  required
                  min={0}
                  step={500000}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1.5">Alamat Tinggal Sesuai KTP / Domisili</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                  rows={3}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>

        <div className="border-t border-slate-100 pt-4 flex gap-2 text-[10px] text-slate-400 leading-normal">
          <Shield className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
          <span>Informasi identitas Anda dilindungi enkripsi standar keamanan data perbankan dan hanya dipergunakan untuk pelaporan audit kepatuhan koperasi resmi.</span>
        </div>
      </div>
    </div>
  );
}
