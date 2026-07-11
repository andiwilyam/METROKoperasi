/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Printer, Calculator, Sparkles, TrendingUp } from 'lucide-react';
import { Anggota, SimpananTransaksi, UserSession } from '../../types';

interface MemberLaporanProps {
  session: UserSession;
  members: Anggota[];
  savingsTrans: SimpananTransaksi[];
}

export default function MemberLaporan({
  session,
  members,
  savingsTrans
}: MemberLaporanProps) {
  const member = members.find((m) => m.id === session.memberId);
  const myTrans = savingsTrans.filter((t) => t.anggotaId === session.memberId);

  // Projection calculator states
  const [targetYears, setTargetYears] = useState(3);
  const [monthlyContribution, setMonthlyContribution] = useState(100000);

  const saldoPokok = member?.saldoSimpananPokok || 0;
  const saldoWajib = member?.saldoSimpananWajib || 0;
  const saldoSukarela = member?.saldoSimpananSukarela || 0;
  const initialTotal = saldoPokok + saldoWajib + saldoSukarela;

  // Simple compound interest projection
  const monthlyRate = 0.05 / 12; // 5% per annum divided by 12
  let projectedBalance = initialTotal;
  const totalMonths = targetYears * 12;

  for (let i = 1; i <= totalMonths; i++) {
    projectedBalance = (projectedBalance + monthlyContribution) * (1 + monthlyRate);
  }

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Projection Calculator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Projection Inputs */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Proyeksi Akumulasi Bunga &amp; Simpanan
            </h3>
            <p className="text-slate-400">Rencanakan tabungan masa depan Anda dengan simulasi bunga majemuk.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Rencana Tabungan Tambahan Bulanan</label>
              <input
                type="number"
                step={50000}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Durasi Menabung (Tahun)</label>
              <select
                value={targetYears}
                onChange={(e) => setTargetYears(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value={1}>1 Tahun</option>
                <option value={3}>3 Tahun</option>
                <option value={5}>5 Tahun</option>
                <option value={10}>10 Tahun</option>
              </select>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-1">
            <span className="text-[9px] text-emerald-600 uppercase font-black tracking-wider block">Estimasi Saldo Akhir (+Suku Bunga)</span>
            <div className="text-lg font-black text-emerald-950 font-mono">{formatIDR(projectedBalance)}</div>
            <p className="text-[10px] text-emerald-700/80 leading-normal pt-1">
              *Angka di atas dihitung berdasarkan proyeksi suku bunga simpanan rata-rata tahunan 5% yang diakumulasikan secara bulanan.
            </p>
          </div>
        </div>

        {/* Mutual Ledger List / Statement of Account */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex justify-between items-center">
            <span>Buku Rekening Koran Mutasi Tabungan</span>
            <button
              onClick={() => window.print()}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1 rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Buku
            </button>
          </div>

          {myTrans.length === 0 ? (
            <div className="text-center py-20 text-slate-400">Belum ada riwayat mutasi tabungan di sistem.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Jenis Tabungan</th>
                    <th className="p-4">Deskripsi Aktivitas</th>
                    <th className="p-4 text-right">Debit / Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myTrans.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/20">
                      <td className="p-4 font-mono font-semibold text-slate-400">{t.tanggal}</td>
                      <td className="p-4 text-slate-700 font-bold">{t.jenisNama}</td>
                      <td className="p-4 text-slate-500 italic max-w-xs truncate" title={t.keterangan}>{t.keterangan}</td>
                      <td className="p-4 text-right font-mono font-bold">
                        <span className={t.tipe === 'setor' ? 'text-emerald-600' : 'text-red-500'}>
                          {t.tipe === 'setor' ? '+' : '-'} {formatIDR(t.jumlah)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
