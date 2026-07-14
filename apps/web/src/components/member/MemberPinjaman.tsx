/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, Send, CheckCircle, HelpCircle, Receipt, Calendar, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { Anggota, JenisPinjaman, Pinjaman, Angsuran, UserSession } from '@metrocoop/shared/types';

interface MemberPinjamanProps {
  session: UserSession;
  members: Anggota[];
  loanTypes: JenisPinjaman[];
  loans: Pinjaman[];
  schedules: Angsuran[];
  onAddLoanRequest: (newLoan: Omit<Pinjaman, 'id' | 'noPinjaman' | 'sisaPokok' | 'status' | 'tanggalPengajuan' | 'tanggalCair'>) => void;
}

export default function MemberPinjaman({
  session,
  members,
  loanTypes,
  loans,
  schedules,
  onAddLoanRequest
}: MemberPinjamanProps) {
  const member = members.find((m) => m.id === session.memberId);
  const myLoans = loans.filter((l) => l.anggotaId === session.memberId);
  const myLoanIds = myLoans.map((l) => l.id);
  const mySchedules = schedules.filter((s) => myLoanIds.includes(s.pinjamanId));

  // Simulation form states
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [pokok, setPokok] = useState(5000000);
  const [tenor, setTenor] = useState(12);
  const [successMsg, setSuccessMsg] = useState('');

  const activeType = loanTypes.find((t) => t.id === selectedTypeId);
  let simulatedPayment = 0;

  if (activeType) {
    const rate = activeType.bungaPersen / 100;
    if (activeType.metodeBunga === 'flat') {
      const pokokSuku = pokok / tenor;
      const bungaSuku = pokok * rate;
      simulatedPayment = Math.round(pokokSuku + bungaSuku);
    } else {
      // Effective / Annuity simplified
      const totalEstimated = pokok + (pokok * rate * (tenor / 2));
      simulatedPayment = Math.round(totalEstimated / tenor);
    }
  }

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId || !activeType) return;

    if (pokok > activeType.maksPlafon) {
      alert(`Jumlah pinjaman melebihi plafon maksimum kategori ini (${formatIDR(activeType.maksPlafon)})`);
      return;
    }

    if (tenor > activeType.maksTenor) {
      alert(`Tenor melebihi ketentuan maksimum kategori ini (${activeType.maksTenor} bulan)`);
      return;
    }

    onAddLoanRequest({
      anggotaId: session.memberId!,
      anggotaNama: member?.nama || 'Anggota',
      jenisPinjamanId: selectedTypeId,
      jenisNama: activeType.nama,
      pokok,
      tenorMonths: tenor,
      bungaPersen: activeType.bungaPersen,
      metodeBunga: activeType.metodeBunga,
      angsuranPerBulan: simulatedPayment,
      biayaAdmin: activeType.biayaAdmin
    });

    setSuccessMsg(`Pengajuan proposal pinjaman ${activeType.nama} senilai ${formatIDR(pokok)} berhasil diajukan untuk ditelaah Komite Pengawas.`);
    setSelectedTypeId('');
    setPokok(5000000);
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
      
      {/* Alert confirmation */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-start gap-3 relative animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="pr-6 leading-relaxed">
            <h4 className="font-bold mb-0.5">Pengajuan Terkirim!</h4>
            <p>{successMsg}</p>
          </div>
          <button 
            onClick={() => setSuccessMsg('')}
            className="absolute right-3 top-3 text-emerald-500 hover:text-emerald-700 p-1 rounded-lg cursor-pointer"
          >
            ❌
          </button>
        </div>
      )}

      {/* Grid: Left Apply/Simulator, Right Active Loan Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Loan Application and Simulator */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-blue-600" />
            Simulasi &amp; Ajukan Pinjaman Koperasi
          </h3>

          <form onSubmit={handleApplyLoan} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Pilih Kategori Pinjaman</label>
              <select
                value={selectedTypeId}
                onChange={(e) => {
                  setSelectedTypeId(e.target.value);
                  const b = loanTypes.find((x) => x.id === e.target.value);
                  if (b) setPokok(Math.min(5000000, b.maksPlafon));
                }}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
              >
                <option value="">-- Pilih Jenis Pinjaman --</option>
                {loanTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} (Suku Bunga: {t.bungaPersen}% / bln)
                  </option>
                ))}
              </select>
            </div>

            {activeType && (
              <div className="space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                
                {/* Pokok Simulator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Nominal Pokok Pinjaman:</span>
                    <span className="font-mono font-bold text-blue-700">{formatIDR(pokok)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={activeType.maksPlafon}
                    step={500000}
                    value={pokok}
                    onChange={(e) => setPokok(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{formatIDR(1000000)}</span>
                    <span>Maks: {formatIDR(activeType.maksPlafon)}</span>
                  </div>
                </div>

                {/* Tenor Simulator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Tenor Pengembalian (Bulan):</span>
                    <span className="font-mono font-bold text-blue-700">{tenor} Bulan</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={activeType.maksTenor}
                    step={6}
                    value={tenor}
                    onChange={(e) => setTenor(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>6 Bulan</span>
                    <span>Maks: {activeType.maksTenor} Bulan</span>
                  </div>
                </div>

                {/* Suku Bunga Pinjaman description */}
                <div className="border-t border-slate-200/50 pt-3 flex gap-2 text-[10px] text-slate-500 leading-normal">
                  <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    Pinjaman ini menggunakan suku bunga flat/menurun dengan perhitungan bunga bulanan transparan dan disetujui bersama oleh anggota dan koperasi.
                  </span>
                </div>

                {/* Projection highlights */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center mt-2">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-blue-600 font-bold">Estimasi Setoran Bulanan</div>
                    <div className="text-base font-extrabold text-blue-900 font-mono mt-0.5">{formatIDR(simulatedPayment)} / bulan</div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    Ajukan Proposal
                  </button>
                </div>

              </div>
            )}
          </form>
        </div>

        {/* Loan History list */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Status Berkas Pinjaman Anda</h3>
            
            {myLoans.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Anda belum pernah mengajukan pinjaman.
              </div>
            ) : (
              <div className="space-y-3">
                {myLoans.map((l) => (
                  <div key={l.id} className="border border-slate-100 p-4 rounded-xl space-y-2 bg-slate-50/50 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{l.jenisNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{l.noPinjaman || 'No Ref: Proposal'}</div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                        l.status === 'dicairkan'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : l.status === 'pengajuan'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : l.status === 'lunas'
                          ? 'bg-slate-50 text-slate-600 border-slate-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {l.status === 'dicairkan' && 'Pencairan Aktif'}
                        {l.status === 'pengajuan' && 'Menunggu Approval'}
                        {l.status === 'lunas' && 'Sudah Lunas'}
                        {l.status === 'ditolak' && 'Ditolak'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 font-mono text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Pokok</span>
                        <span className="font-bold text-slate-700">{formatIDR(l.pokok)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Angsuran</span>
                        <span className="font-bold text-slate-700">{formatIDR(l.angsuranPerBulan)}/bln</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Sisa Pokok</span>
                        <span className="font-bold text-indigo-700">{l.status === 'dicairkan' ? formatIDR(l.sisaPokok) : '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Monthly billing schedule list */}
      {mySchedules.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
            Tabel Jadwal Pembayaran Angsuran Bulanan (Rencana Buku)
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Bulan Ke-</th>
                  <th className="p-4">Batas Tanggal Jatuh Tempo</th>
                  <th className="p-4">Pokok Tagihan</th>
                  <th className="p-4">Bunga Pinjaman</th>
                  <th className="p-4">Total Harus Dibayar</th>
                  <th className="p-4">Tanggal Pembayaran</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mySchedules.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">Angsuran # {s.angsuranKe}</td>
                    <td className="p-4 font-mono text-slate-500">{s.tanggalJatuhTempo}</td>
                    <td className="p-4 font-mono text-slate-600">{formatIDR(s.pokokBayar)}</td>
                    <td className="p-4 font-mono text-amber-600">{formatIDR(s.bungaBayar)}</td>
                    <td className="p-4 font-mono font-extrabold text-slate-900">{formatIDR(s.totalBayar)}</td>
                    <td className="p-4 font-mono text-slate-500">{s.tanggalBayar || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                        s.status === 'lunas'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {s.status === 'lunas' ? 'Lunas Dibayar' : 'Belum Bayar'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
