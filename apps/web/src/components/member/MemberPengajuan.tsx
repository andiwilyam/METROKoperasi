/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HandCoins, PiggyBank } from 'lucide-react';
import MemberPinjaman from './MemberPinjaman';
import MemberSimpanan from './MemberSimpanan';
import { 
  Anggota, JenisPinjaman, JenisSimpanan, Pinjaman, Angsuran, 
  UserSession, PermohonanTarik, BuktiTransfer 
} from '../../types';

interface MemberPengajuanProps {
  session: UserSession;
  members: Anggota[];
  loanTypes: JenisPinjaman[];
  savingsTypes: JenisSimpanan[];
  loans: Pinjaman[];
  schedules: Angsuran[];
  onAddLoanRequest: (newLoan: Omit<Pinjaman, 'id' | 'noPinjaman' | 'sisaPokok' | 'status' | 'tanggalPengajuan' | 'tanggalCair'>) => void;
  onSubmitWithdrawRequest: (newReq: Omit<PermohonanTarik, 'id' | 'tanggal' | 'status'>) => void;
  onUploadReceipt: (newReceipt: Omit<BuktiTransfer, 'id' | 'tanggal' | 'status'>) => void;
}

export default function MemberPengajuan({
  session,
  members,
  loanTypes,
  savingsTypes,
  loans,
  schedules,
  onAddLoanRequest,
  onSubmitWithdrawRequest,
  onUploadReceipt
}: MemberPengajuanProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pinjam' | 'tarik'>('pinjam');

  return (
    <div className="space-y-6">
      {/* Header section with instructions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800">Layanan Pengajuan Mandiri Anggota</h2>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Pilih jenis pengajuan di bawah ini. Pengajuan Anda akan divalidasi dan diproses secara aman oleh pengurus dan dewan pengawas koperasi.
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveSubTab('pinjam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
              activeSubTab === 'pinjam'
                ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <HandCoins className="w-3.5 h-3.5" />
            Ajukan Pinjaman
          </button>
          <button
            onClick={() => setActiveSubTab('tarik')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
              activeSubTab === 'tarik'
                ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            Ajukan Tarik Simpanan (Tarik)
          </button>
        </div>
      </div>

      {activeSubTab === 'pinjam' ? (
        <div className="animate-fadeIn">
          {/* We only render the core calculator & history inside MemberPinjaman */}
          <MemberPinjaman
            session={session}
            members={members}
            loanTypes={loanTypes}
            loans={loans}
            schedules={schedules}
            onAddLoanRequest={onAddLoanRequest}
          />
        </div>
      ) : (
        <div className="animate-fadeIn">
          {/* We render MemberSimpanan with the 'tarik' tab enabled */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm hidden">
            {/* hidden config element to pass down state, but actually MemberSimpanan has internal selector */}
          </div>
          <MemberSimpanan
            session={session}
            members={members}
            savingsTypes={savingsTypes}
            onUploadReceipt={onUploadReceipt}
            onSubmitWithdrawRequest={onSubmitWithdrawRequest}
            initialTab="tarik"
          />
        </div>
      )}
    </div>
  );
}
