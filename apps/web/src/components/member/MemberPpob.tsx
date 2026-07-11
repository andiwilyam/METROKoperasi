/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Tv, Phone, Zap, Droplet, Heart, Wallet, CheckCircle2, AlertCircle, Sparkles, X, Info
} from 'lucide-react';
import { PpobLayanan, PpobTransaksi, UserSession, Anggota } from '../../types';

interface MemberPpobProps {
  session: UserSession;
  services: PpobLayanan[];
  transactions: PpobTransaksi[];
  members: Anggota[];
  onAddPpobTransaksi: (
    layananId: string, 
    targetNumber: string, 
    nominal: number, 
    hargaKoperasi: number, 
    hargaJual: number
  ) => { success: boolean; message: string; sn?: string };
}

export default function MemberPpob({
  session,
  services,
  transactions,
  members,
  onAddPpobTransaksi
}: MemberPpobProps) {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [targetNumber, setTargetNumber] = useState('');
  const [selectedNominal, setSelectedNominal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    sn?: string;
    product: string;
    target: string;
    total: number;
  } | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const myMember = members.find(m => m.id === session.memberId) || null;
  const saldoSukarela = myMember?.saldoSimpananSukarela || 0;

  const currentService = services.find(s => s.id === selectedServiceId);

  // Predefined Nominals based on service type
  const getNominalsList = () => {
    if (!currentService) return [];
    if (currentService.tipe === 'Voucher') {
      return [10000, 20000, 25000, 50000, 100000];
    } else if (currentService.tipe === 'Listrik') {
      return [20000, 50000, 100000, 200000, 500000];
    } else {
      // Tagihan PDAM / BPJS usually custom, we can mock it as a flat simulation
      return [45000, 85000, 120000];
    }
  };

  // Pricing calculations
  const markupFee = 2000; // flat cooperative markup for support and profits
  const hargaJual = selectedNominal > 0 ? selectedNominal + markupFee : 0;
  const hargaKoperasi = selectedNominal;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !targetNumber || selectedNominal <= 0) return;
    if (!myMember) { alert('Data anggota tidak ditemukan. Silakan login ulang.'); return; }

    if (saldoSukarela < hargaJual) {
      alert(`Maaf, Saldo Simpanan Sukarela Anda (${formatIDR(saldoSukarela)}) tidak mencukupi untuk melakukan pembelian ini (${formatIDR(hargaJual)}). Silakan lakukan top up saldo simpanan terlebih dahulu!`);
      return;
    }

    setLoading(true);

    // Simulate Network Latency
    setTimeout(() => {
      const result = onAddPpobTransaksi(
        selectedServiceId,
        targetNumber,
        selectedNominal,
        hargaKoperasi,
        hargaJual
      );

      setLoading(false);

      if (result.success) {
        setCheckoutSuccess({
          sn: result.sn,
          product: currentService?.nama || 'Produk PPOB',
          target: targetNumber,
          total: hargaJual
        });

        // Clear Form
        setSelectedServiceId('');
        setTargetNumber('');
        setSelectedNominal(0);
      } else {
        alert("Gagal melakukan transaksi PPOB: " + result.message);
      }
    }, 1500);
  };

  const myTransactions = myMember ? transactions.filter(t => t.anggotaId === myMember.id) : [];

  const getServiceIcon = (tipe: string) => {
    switch (tipe.toLowerCase()) {
      case 'voucher': return <Phone className="w-5 h-5 text-blue-500" />;
      case 'listrik': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'tagihan': return <Droplet className="w-5 h-5 text-teal-500" />;
      default: return <Tv className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="bg-indigo-800 text-indigo-200 font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Loket Pembayaran PPOB Online
          </div>
          <h2 className="text-xl font-black tracking-tight md:text-2xl">Beli Pulsa, Token PLN &amp; BPJS</h2>
          <p className="text-xs text-indigo-100/80 max-w-lg leading-relaxed">
            Butuh isi pulsa darurat atau token listrik malam hari? Bayar langsung secara instan memotong **Simpanan Sukarela** Anda dengan potongan biaya admin termurah.
          </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-300" />
          <div className="text-left">
            <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Saldo Sukarela Anda</div>
            <div className="text-xl font-black mt-0.5 font-mono">{formatIDR(saldoSukarela)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Checkout Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 border-b pb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Isi Ulang Baru / Bayar Tagihan
          </h3>

          <form onSubmit={handlePaySubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Pilih Produk Layanan PPOB</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.filter(s => s.status === 'Aktif').map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(s.id);
                      setSelectedNominal(0);
                    }}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-2 font-bold text-center transition cursor-pointer ${
                      selectedServiceId === s.id 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {getServiceIcon(s.tipe)}
                    <span>{s.nama}</span>
                  </button>
                ))}
              </div>
            </div>

            {currentService && (
              <>
                <div className="animate-in fade-in duration-150 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">
                      {currentService.tipe === 'Voucher' ? 'Nomor Handphone Penerima' : 
                       currentService.tipe === 'Listrik' ? 'Nomor Meteran PLN / ID Pelanggan' : 'ID Pelanggan / No BPJS'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 08129948281 atau 140928448102"
                      value={targetNumber}
                      onChange={(e) => setTargetNumber(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 font-mono tracking-wider text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Pilih Nominal Pembelian</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {getNominalsList().map(nom => (
                        <button
                          key={nom}
                          type="button"
                          onClick={() => setSelectedNominal(nom)}
                          className={`p-2.5 border rounded-xl font-mono text-center font-bold text-[11px] transition cursor-pointer ${
                            selectedNominal === nom 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {formatIDR(nom)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedNominal > 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 animate-in slide-in-from-bottom-2 duration-150">
                    <div className="font-bold text-slate-800 text-[11px] mb-1">Detail Rincian Pembayaran</div>
                    <div className="flex justify-between text-slate-500">
                      <span>Harga Produk PPOB:</span>
                      <span className="font-mono">{formatIDR(hargaKoperasi)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Biaya Admin Loket:</span>
                      <span className="font-mono">+{formatIDR(markupFee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 font-extrabold text-slate-900">
                      <span>TOTAL POTONG SALDO SUKARELA:</span>
                      <span className="font-mono text-indigo-700">{formatIDR(hargaJual)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || selectedNominal <= 0 || !targetNumber}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl shadow-sm transition disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Konfirmasi Pembelian &amp; Potong Saldo</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* History Transactions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Pembelian Saya ({myTransactions.length})</h3>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-[11px]">
            {myTransactions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 italic flex flex-col items-center justify-center gap-2">
                <Tv className="w-8 h-8 text-slate-200" />
                Belum ada transaksi PPOB dari Anda.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {myTransactions.map(tx => (
                  <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50/40 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{tx.layananNama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Ref: {tx.noReferensi}</div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                        SUKSES
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>No. Pelanggan:</span>
                      <span className="font-mono font-bold text-slate-700">{tx.targetNumber}</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Nominal Potong:</span>
                      <span className="font-mono font-bold text-slate-800">{formatIDR(tx.hargaJual)}</span>
                    </div>

                    {tx.sn && (
                      <div className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-900 font-mono text-[10px] tracking-widest text-center">
                        <span className="font-bold block text-[8px] text-indigo-400 uppercase tracking-wider mb-0.5">Voucher SN / Token PLN</span>
                        {tx.sn}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* POPUP MODAL ON SUCCESSFUL PURCHASE */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center text-xs animate-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-[11px] text-slate-400">Saldo Sukarela Anda telah berhasil dipotong.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-1 text-left leading-normal text-slate-600 border">
                <div>Produk: <span className="font-bold text-slate-800">{checkoutSuccess.product}</span></div>
                <div>No. Pelanggan: <span className="font-bold font-mono text-slate-800">{checkoutSuccess.target}</span></div>
                <div>Total Bayar: <span className="font-bold font-mono text-slate-800">{formatIDR(checkoutSuccess.total)}</span></div>
              </div>

              {checkoutSuccess.sn && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl text-center">
                  <div className="text-[8px] text-indigo-400 font-extrabold uppercase mb-0.5 tracking-wider">VOUCHER SN / TOKEN PLN</div>
                  <div className="font-mono font-bold tracking-widest text-sm">{checkoutSuccess.sn}</div>
                </div>
              )}

              <button
                onClick={() => setCheckoutSuccess(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Tutup Resi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
