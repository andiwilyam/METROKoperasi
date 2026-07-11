/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Landmark, ArrowRight, Wallet, CheckCircle, Info, Sparkles, HelpCircle, Copy, Check, X
} from 'lucide-react';
import { VirtualAccount, VATransaksi, UserSession, Anggota } from '../../types';

interface MemberDigipayProps {
  session: UserSession;
  virtualAccounts: VirtualAccount[];
  vaTransactions: VATransaksi[];
  members: Anggota[];
  onSimulateVATransfer: (
    anggotaId: string, 
    bank: string, 
    nomorVA: string, 
    nominal: number, 
    jenisTrx: VATransaksi['jenisTrx']
  ) => void;
}

export default function MemberDigipay({
  session,
  virtualAccounts,
  vaTransactions,
  members,
  onSimulateVATransfer
}: MemberDigipayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Simulation Drawer States
  const [activeSimVA, setActiveSimVA] = useState<VirtualAccount | null>(null);
  const [amount, setAmount] = useState(250000);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const myMember = members.find(m => m.id === session.memberId) || null;
  const mySukarelaSaldo = myMember?.saldoSimpananSukarela || 0;

  const myVAs = myMember ? virtualAccounts.filter(v => v.anggotaId === myMember.id) : [];
  const myTransactions = myMember ? vaTransactions.filter(t => t.anggotaId === myMember.id) : [];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSimVA || amount <= 10000) return;
    if (!myMember) { alert('Data anggota tidak ditemukan. Silakan login ulang.'); return; }

    setLoading(true);
    setTimeout(() => {
      onSimulateVATransfer(
        myMember.id,
        activeSimVA.bank,
        activeSimVA.nomorVA,
        amount,
        'topup_sukarela'
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveSimVA(null);
      }, 2000);
    }, 1200);
  };

  const getBankColor = (bank: string) => {
    switch (bank.toUpperCase()) {
      case 'MANDIRI': return 'from-blue-800 to-amber-600';
      case 'BCA': return 'from-sky-700 to-sky-900';
      case 'BRI': return 'from-blue-600 to-blue-800';
      case 'BNI': return 'from-orange-500 to-teal-800';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="bg-indigo-800 text-indigo-200 font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Virtual Account Gateway
          </div>
          <h2 className="text-xl font-black tracking-tight md:text-2xl">Deposit Instan via Virtual Account</h2>
          <p className="text-xs text-indigo-100/80 max-w-lg leading-relaxed">
            Tidak perlu kirim bukti transfer manual! Anda dapat menambahkan dana ke Simpanan Sukarela Anda secara otomatis dengan melakukan transfer ke salah satu Virtual Account pribadi Anda di bawah.
          </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-300" />
          <div className="text-left">
            <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Simpanan Sukarela Saya</div>
            <div className="text-xl font-black mt-0.5 font-mono">{formatIDR(mySukarelaSaldo)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* VAs Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Daftar Virtual Account Anda</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myVAs.map(va => (
              <div 
                key={va.id} 
                className={`bg-gradient-to-br ${getBankColor(va.bank)} text-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-44 relative overflow-hidden`}
              >
                {/* Decorative chips */}
                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/5 rounded-full" />
                <div className="absolute right-4 top-4 font-black italic tracking-widest text-lg opacity-40">{va.bank}</div>

                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-white/60">{va.label}</div>
                  <div className="text-base font-bold tracking-wide">{va.anggotaNama}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Nomor Virtual Account</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black tracking-widest">{va.nomorVA}</span>
                    <div className="flex gap-1.5 z-10">
                      <button
                        onClick={() => handleCopy(va.id, va.nomorVA)}
                        className="bg-white/15 hover:bg-white/20 p-1.5 rounded-lg border border-white/10 transition cursor-pointer"
                        title="Copy No. VA"
                      >
                        {copiedId === va.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setActiveSimVA(va)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wide transition cursor-pointer"
                      >
                        Simulasi Bayar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transfer Guide */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-slate-600 leading-relaxed text-[11px]">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <Info className="w-4 h-4 text-indigo-600" />
              Petunjuk Cara Transfer
            </h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Salin nomor Virtual Account Bank BCA, Mandiri, atau BRI Anda di atas.</li>
              <li>Buka aplikasi Mobile Banking Anda (misal: BCA Mobile, Livin by Mandiri, BRImob).</li>
              <li>Pilih menu **Transfer** &gt; **Virtual Account** (atau Transfer Ke Rekening Bank Lain).</li>
              <li>Masukkan Nomor Virtual Account yang disalin dan masukkan jumlah nominal setoran.</li>
              <li>Konfirmasi PIN transfer Anda. Saldo Simpanan Sukarela Anda di Koperasi akan ter-top up secara otomatis!</li>
            </ol>
          </div>
        </div>

        {/* Transactions logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Riwayat Setoran VA Saya ({myTransactions.length})</h3>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-[11px]">
            {myTransactions.length === 0 ? (
              <div className="text-center py-16 text-slate-400 italic flex flex-col items-center justify-center gap-2">
                <CreditCard className="w-8 h-8 text-slate-200" />
                Belum ada mutasi setoran Virtual Account.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {myTransactions.map(tx => (
                  <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50/40 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">Setoran Instan VA {tx.bank}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Ref Trx: {tx.id}</div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                        SUKSES
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Waktu Kirim:</span>
                      <span className="font-mono text-slate-700">{tx.tanggal}</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>No. VA Tujuan:</span>
                      <span className="font-mono font-bold text-slate-700">{tx.nomorVA}</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Jumlah Dana:</span>
                      <span className="font-mono font-black text-emerald-700">{formatIDR(tx.nominal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SIMULATOR MODAL */}
      {activeSimVA && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="p-4 bg-amber-500 text-white flex justify-between items-center">
              <h3 className="font-extrabold flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 animate-bounce" />
                Sandbox Mobile Banking Simulator
              </h3>
              <button 
                onClick={() => setActiveSimVA(null)}
                className="hover:bg-amber-600 p-1 rounded-lg text-amber-100 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulate} className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 border rounded-xl leading-normal text-slate-600 space-y-1">
                <div>Bank Tujuan: <span className="font-bold text-slate-800">{activeSimVA.bank} VA</span></div>
                <div>No. VA: <span className="font-bold font-mono text-slate-800">{activeSimVA.nomorVA}</span></div>
                <div>Pemilik: <span className="font-bold text-slate-800">{activeSimVA.anggotaNama}</span></div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Jumlah Nominal Transfer (Rp)</label>
                <input
                  type="number"
                  required
                  min="20000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-slate-800 font-mono font-bold text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {success ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Transfer Berhasil Diproses!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading || amount <= 10000}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold p-3 rounded-xl transition shadow disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Menghubungi API Bank...' : `Kirim Transfer ${formatIDR(amount)}`}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
