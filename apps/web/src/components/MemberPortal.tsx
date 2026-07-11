/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Subcomponents import
import MemberDashboard from './member/MemberDashboard';
import MemberSimpanan from './member/MemberSimpanan';
import MemberPinjaman from './member/MemberPinjaman';
import MemberToko from './member/MemberToko';
import MemberLaporan from './member/MemberLaporan';
import MemberTiket from './member/MemberTiket';
import MemberProfil from './member/MemberProfil';
import MemberPengajuan from './member/MemberPengajuan';
import MemberVentura from './member/MemberVentura';
import MemberSewa from './member/MemberSewa';
import MemberPpob from './member/MemberPpob';
import MemberDigipay from './member/MemberDigipay';
import MemberCicilan from './member/MemberCicilan';
import MemberUploadDokumen from './member/MemberUploadDokumen';
import { useDataStore } from '../stores/dataStore';

// Types import
import { 
  Anggota, Pinjaman, SimpananTransaksi, JenisSimpanan, 
  JenisPinjaman, PermohonanTarik, Angsuran, UserSession,
  Barang, KategoriBarang, TiketBantuan, BuktiTransfer, Pengumuman,
  VentureInvestment,
  SewaAsset, SewaTransaksi, PpobLayanan, PpobTransaksi,
  VirtualAccount, VATransaksi, CicilanBarang, CicilanAngsuran
} from '../types';

interface MemberPortalProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  session: UserSession;
  members: Anggota[];
  loans: Pinjaman[];
  savingsTrans: SimpananTransaksi[];
  savingsTypes: JenisSimpanan[];
  loanTypes: JenisPinjaman[];
  schedules: Angsuran[];
  barang: Barang[];
  categories: KategoriBarang[];
  tickets: TiketBantuan[];
  onUploadReceipt: (newReceipt: Omit<BuktiTransfer, 'id' | 'tanggal' | 'status'>) => void;
  onSubmitWithdrawRequest: (newReq: Omit<PermohonanTarik, 'id' | 'tanggal' | 'status'>) => void;
  onAddLoanRequest: (newLoan: Omit<Pinjaman, 'id' | 'noPinjaman' | 'sisaPokok' | 'status' | 'tanggalPengajuan' | 'tanggalCair'>) => void;
  onAddTicket: (newTicket: Omit<TiketBantuan, 'id' | 'anggotaNama' | 'tanggal' | 'status' | 'balasanAdmin'>) => void;
  onUpdateMember: (updated: Anggota) => void;
  announcements: Pengumuman[];
  investments: VentureInvestment[];
  onAddVentureInvestment: (newInv: Omit<VentureInvestment, 'id' | 'dividendHistory'>) => void;

  // --- NEW MODULES FOR MEMBERS ---
  sewaAssets: SewaAsset[];
  sewaTransactions: SewaTransaksi[];
  ppobLayanan: PpobLayanan[];
  ppobTransactions: PpobTransaksi[];
  virtualAccounts: VirtualAccount[];
  vaTransactions: VATransaksi[];
  cicilanBarang: CicilanBarang[];
  cicilanAngsuran: CicilanAngsuran[];
  onAddSewaRequest: (newReq: Omit<SewaTransaksi, 'id'>) => void;
  onAddPpobTransaksi: (
    layananId: string, 
    targetNumber: string, 
    nominal: number, 
    hargaKoperasi: number, 
    hargaJual: number
  ) => { success: boolean; message: string; sn?: string };
  onSimulateVATransfer: (anggotaId: string, bank: string, nomorVA: string, nominal: number, jenisTrx: VATransaksi['jenisTrx']) => void;
  onAddContractRequest: (newContract: Omit<CicilanBarang, 'id' | 'status' | 'sisaPokok' | 'tanggalPengajuan'>) => void;
  onPayInstallmentFromSukarela: (installmentId: string) => { success: boolean; message: string };
}

export default function MemberPortal({
  activeMenu,
  setActiveMenu,
  session,
  members,
  loans,
  savingsTrans,
  savingsTypes,
  loanTypes,
  schedules,
  barang,
  categories,
  tickets,
  onUploadReceipt,
  onSubmitWithdrawRequest,
  onAddLoanRequest,
  onAddTicket,
  onUpdateMember,
  announcements,
  investments,
  onAddVentureInvestment,

  sewaAssets,
  sewaTransactions,
  ppobLayanan,
  ppobTransactions,
  virtualAccounts,
  vaTransactions,
  cicilanBarang,
  cicilanAngsuran,
  onAddSewaRequest,
  onAddPpobTransaksi,
  onSimulateVATransfer,
  onAddContractRequest,
  onPayInstallmentFromSukarela
}: MemberPortalProps) {
  
  return (
    <div className="space-y-6">
      
      {/* 1. MEMBER DASHBOARD */}
      {(activeMenu === 'dashboard' || activeMenu === 'member_dashboard') && (
        <MemberDashboard
          session={session}
          members={members}
          loans={loans}
          savingsTrans={savingsTrans}
          onNavigate={setActiveMenu}
          announcements={announcements}
          investments={investments}
        />
      )}

      {/* 2. MEMBER SIMPANAN / TABUNGAN */}
      {activeMenu === 'member_simpanan' && (
        <MemberSimpanan
          session={session}
          members={members}
          savingsTypes={savingsTypes}
          onUploadReceipt={onUploadReceipt}
          onSubmitWithdrawRequest={onSubmitWithdrawRequest}
        />
      )}

      {/* 3. MEMBER PINJAMAN / PEMBIAYAAN */}
      {activeMenu === 'member_pinjaman' && (
        <MemberPinjaman
          session={session}
          members={members}
          loanTypes={loanTypes}
          loans={loans}
          schedules={schedules}
          onAddLoanRequest={onAddLoanRequest}
        />
      )}

      {/* 4. TOKO SEMBAKO REVENUE TRANSPARENCY */}
      {activeMenu === 'member_toko' && (
        <MemberToko
          barang={barang}
          categories={categories}
        />
      )}

      {/* 5. STATEMENT & ACCOUNT LOGS / MUTASI REKENING */}
      {(activeMenu === 'member_mutasi' || activeMenu === 'member_laporan') && (
        <MemberLaporan
          session={session}
          members={members}
          savingsTrans={savingsTrans}
        />
      )}

      {/* 6. HELP TICKETS */}
      {(activeMenu === 'member_tiket' || activeMenu === 'member_bantuan') && (
        <MemberTiket
          session={session}
          members={members}
          tickets={tickets}
          onAddTicket={onAddTicket}
        />
      )}

      {/* 7. PENGAJUAN PINJAM / TARIK */}
      {activeMenu === 'member_pengajuan' && (
        <MemberPengajuan
          session={session}
          members={members}
          loanTypes={loanTypes}
          savingsTypes={savingsTypes}
          loans={loans}
          schedules={schedules}
          onAddLoanRequest={onAddLoanRequest}
          onSubmitWithdrawRequest={onSubmitWithdrawRequest}
          onUploadReceipt={onUploadReceipt}
        />
      )}

      {/* 8. KIRIM BUKTI TRANSFER */}
      {activeMenu === 'member_bukti' && (
        <MemberSimpanan
          session={session}
          members={members}
          savingsTypes={savingsTypes}
          onUploadReceipt={onUploadReceipt}
          onSubmitWithdrawRequest={onSubmitWithdrawRequest}
          initialTab="setor"
        />
      )}

      {/* 9. UBAH PROFIL SAYA */}
      {activeMenu === 'member_profil' && (
        <MemberProfil
          session={session}
          members={members}
          onUpdateMember={onUpdateMember}
        />
      )}

      {/* 10. INVESTASI VENTURA */}
      {activeMenu === 'member_ventura' && (
        <MemberVentura
          investments={investments}
          onAddInvestment={onAddVentureInvestment}
          session={session}
        />
      )}

      {/* 10b. UPLOAD DOKUMEN VENTURA */}
      {activeMenu === 'member_ventura_dokumen' && (
        <MemberUploadDokumen
          pengajuanList={useDataStore.getState().pengajuanList}
          session={session}
          uploadDokumenPengajuan={useDataStore.getState().uploadDokumenPengajuan}
        />
      )}

      {/* 11. UNIT SEWA ASET */}
      {activeMenu === 'member_sewa' && (
        <MemberSewa
          session={session}
          members={members}
          assets={sewaAssets}
          transactions={sewaTransactions}
          onAddSewaRequest={onAddSewaRequest}
        />
      )}

      {/* 12. PPOB & PULSA */}
      {activeMenu === 'member_ppob' && (
        <MemberPpob
          session={session}
          members={members}
          services={ppobLayanan}
          transactions={ppobTransactions}
          onAddPpobTransaksi={onAddPpobTransaksi}
        />
      )}

      {/* 13. DIGITAL PAYMENT & VA */}
      {activeMenu === 'member_digipay' && (
        <MemberDigipay
          session={session}
          members={members}
          virtualAccounts={virtualAccounts}
          vaTransactions={vaTransactions}
          onSimulateVATransfer={onSimulateVATransfer}
        />
      )}

      {/* 14. KREDIT CICILAN PENGADAAN */}
      {activeMenu === 'member_cicilan' && (
        <MemberCicilan
          session={session}
          members={members}
          contracts={cicilanBarang}
          installments={cicilanAngsuran}
          onAddContractRequest={onAddContractRequest}
          onPayInstallmentFromSukarela={onPayInstallmentFromSukarela}
        />
      )}

    </div>
  );
}
