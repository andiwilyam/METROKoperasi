/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Calendar, Coins, Percent, Plus, X, Eye, Calculator, Info, CheckCircle, Wallet
} from 'lucide-react';
import { CicilanBarang, CicilanAngsuran, UserSession, Anggota } from '@metrocoop/shared/types';

interface MemberCicilanProps {
  session: UserSession;
  contracts: CicilanBarang[];
  installments: CicilanAngsuran[];
  members: Anggota[];
  onAddContractRequest: (newContract: Omit<CicilanBarang, 'id' | 'sisaPokok' | 'status' | 'tanggalPengajuan'>) => void;
  onPayInstallmentFromSukarela: (angsuranId: string) => { success: boolean; message: string };
}

export default function MemberCicilan({
  session,
  contracts,
  installments,
  members,
  onAddContractRequest,
  onPayInstallmentFromSukarela
}: MemberCicilanProps) {
  const [activeTab, setActiveTab] = useState<'kontrak' | 'tagihan'>('kontrak');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<CicilanBarang | null>(null);

  // New Form States
  const [barangNama, setBarangNama] = useState('');
  const [totalHarga, setTotalHarga] = useState(3000000);
  const [dp, setDp] = useState(300000);
  const [tenorMonths, setTenorMonths] = useState(12);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const myMember = members.find(m => m.id === session.memberId) || null;
  const mySukarelaSaldo = myMember?.saldoSimpananSukarela || 0;

  const myContracts = myMember ? contracts.filter(c => c.anggotaId === myMember.id) : [];
  const myContractIds = myContracts.map(c => c.id);
  const myInstallments = installments.filter(i => myContractIds.includes(i.cicilanBarangId));

  const flatInterestRate = 1.5; // 1.5% flat monthly interest margin

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barangNama || totalHarga <= 0) return;
    if (!myMember) { alert('Data anggota tidak ditemukan. Silakan login ulang.'); return; }

    const pokokPembiayaan = totalHarga - dp;
    const bungaBulan = pokokPembiayaan * (flatInterestRate / 100);
    const angsuranPerBulan = Math.round((pokokPembiayaan / tenorMonths) + bungaBulan);

    onAddContractRequest({
      anggotaId: myMember.id,
      anggotaNama: myMember.nama,
      barangNama,
      totalHarga,
      dp,
      pokokPembiayaan,
      tenorMonths,
      bungaPersen: flatInterestRate,
      angsuranPerBulan
    });

    // Reset Form
    setBarangNama('');
    setTotalHarga(3000000);
    setDp(300000);
    setTenorMonths(12);
    setShowApplyModal(false);
    alert("Pengajuan kredit pengadaan barang Anda berhasil diajukan! Silakan tunggu verifikasi admin.");
  };

  const handleAutopay = (angsuranId: string, amount: number) => {
    if (mySukarelaSaldo < amount) {
      alert(`Maaf, Saldo Simpanan Sukarela Anda (${formatIDR(mySukarelaSaldo)}) tidak mencukupi untuk melakukan pembayaran angsuran sejumlah ${formatIDR(amount)}. Silakan isi ulang / top up saldo simpanan terlebih dahulu!`);
      return;
    }

    if (window.confirm(`Gunakan Saldo Simpanan Sukarela Anda untuk melunasi angsuran ini sejumlah ${formatIDR(amount)}?`)) {
      const result = onPayInstallmentFromSukarela(angsuranId);
      if (result.success) {
        alert("Pembayaran Berhasil! Angsuran Anda telah lunas didebit dari Simpanan Sukarela.");
      } else {
        alert("Gagal melakukan autodebet: " + result.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="bg-indigo-900/60 text-indigo-200 border border-indigo-700/30 font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Sistem Kredit Cicilan Pengadaan
          </div>
          <h2 className="text-xl font-black tracking-tight md:text-2xl">Kredit &amp; Cicilan Barang Anggota</h2>
          <p className="text-xs text-indigo-100/80 max-w-lg leading-relaxed">
            Ingin membeli smartphone baru, laptop, atau peralatan elektronik lainnya? Ajukan kredit pengadaan langsung dari koperasi dengan bunga flat terjangkau dan tenor fleksibel.
          </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-300" />
          <div className="text-left">
            <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider font-sans">Simpanan Sukarela Autodebet</div>
            <div className="text-xl font-black mt-0.5 font-mono">{formatIDR(mySukarelaSaldo)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Contracts Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Daftar Pengajuan &amp; Kontrak Saya</h3>
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              + Ajukan Pengadaan Baru
            </button>
          </div>

          <div className="space-y-3">
            {myContracts.length === 0 ? (
              <div className="bg-white border p-12 text-center text-slate-400 italic rounded-2xl">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                Belum ada kontrak pengadaan barang aktif.
              </div>
            ) : (
              myContracts.map(c => (
                <div key={c.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4 hover:shadow transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-[13px] text-slate-800 tracking-tight">{c.barangNama}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">No. Akad: {c.id}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      c.status === 'pengajuan' ? 'bg-amber-100 text-amber-700' :
                      c.status === 'disetujui' ? 'bg-blue-100 text-blue-700' :
                      c.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'lunas' ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'
                    }`}>
                      {c.status === 'pengajuan' ? 'Minta Validasi' : 
                       c.status === 'disetujui' ? 'Menunggu Akad' :
                       c.status === 'aktif' ? 'Cicilan Aktif' : 'Lunas'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600">
                    <div>
                      <span className="block text-[9px] text-slate-400">HARGA BARANG</span>
                      <span className="font-bold text-slate-700 font-mono">{formatIDR(c.totalHarga)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400">POKOK FINANCING</span>
                      <span className="font-bold text-slate-700 font-mono">{formatIDR(c.pokokPembiayaan)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400">TENOR CICILAN</span>
                      <span className="font-bold text-slate-700">{c.tenorMonths} Bulan ({c.bungaPersen}% Flat)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-slate-400">Angsuran / Bulan:</span>
                      <span className="font-black text-xs font-mono text-indigo-700 ml-1.5">{formatIDR(c.angsuranPerBulan)}</span>
                    </div>
                    {c.status === 'aktif' && (
                      <div className="text-right">
                        <span className="text-slate-400 block text-[9px]">SISA PIUTANG POKOK</span>
                        <span className="font-extrabold font-mono text-slate-900">{formatIDR(c.sisaPokok)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Installments Dues (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Tagihan Angsuran Saya ({myInstallments.filter(i => i.status !== 'lunas').length} Belum Bayar)</h3>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-[11px]">
            {myInstallments.length === 0 ? (
              <div className="text-center py-16 text-slate-400 italic flex flex-col items-center justify-center gap-2">
                <Calendar className="w-8 h-8 text-slate-200" />
                Belum ada denda atau daftar angsuran diterbitkan.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {myInstallments.map(inst => {
                  const parent = contracts.find(c => c.id === inst.cicilanBarangId);
                  return (
                    <div key={inst.id} className="p-4 space-y-2.5 hover:bg-slate-50/40 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-slate-800">{parent?.barangNama}</div>
                          <div className="text-[10px] text-slate-400">Angsuran Ke-{inst.angsuranKe} (Tempo: {inst.tanggalJatuhTempo})</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          inst.status === 'lunas' ? 'bg-emerald-50 text-emerald-700' :
                          inst.status === 'terlambat' ? 'bg-rose-100 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {inst.status === 'lunas' ? 'LUNAS' : inst.status === 'terlambat' ? 'TERLAMBAT' : 'BELUM BAYAR'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Total Angsuran:</span>
                          <span className="font-extrabold font-mono text-slate-900 ml-1.5">{formatIDR(inst.totalBayar)}</span>
                        </div>
                        {inst.status !== 'lunas' && (
                          <button
                            onClick={() => handleAutopay(inst.id, inst.totalBayar)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow"
                          >
                            <Wallet className="w-3 h-3" /> Autodebet Sukarela
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: AJUKAN KREDIT */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                Formulir Pengadaan Kredit Barang
              </h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="hover:bg-slate-800 p-1 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nama Barang yang Diinginkan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laptop Acer Swift Go OLED"
                  value={barangNama}
                  onChange={(e) => setBarangNama(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Perkiraan Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1000000"
                    value={totalHarga}
                    onChange={(e) => setTotalHarga(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Down Payment / DP (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Pilih Tenor Bulan</label>
                <select
                  value={tenorMonths}
                  onChange={(e) => setTenorMonths(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 font-semibold focus:outline-none"
                >
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={18}>18 Bulan</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                </select>
              </div>

              {/* Calculator Panel */}
              <div className="p-3 bg-slate-50 border rounded-xl space-y-1 text-[11px] text-slate-500 leading-normal">
                <div className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  Estimasi Angsuran (Bunga {flatInterestRate}% Flat)
                </div>
                <div className="flex justify-between">
                  <span>Sisa Pokok Pembiayaan:</span>
                  <span className="font-mono font-bold text-slate-700">{formatIDR(totalHarga - dp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin Koperasi/Bulan:</span>
                  <span className="font-mono text-emerald-600">+{formatIDR((totalHarga - dp) * (flatInterestRate / 100))}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-slate-900 text-[11px]">
                  <span>Angsuran Per Bulan:</span>
                  <span className="font-mono text-indigo-700">
                    {formatIDR(Math.round(((totalHarga - dp) / tenorMonths) + ((totalHarga - dp) * (flatInterestRate / 100))))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
