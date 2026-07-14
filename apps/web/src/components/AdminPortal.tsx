/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, Settings, LifeBuoy, Check, AlertCircle, X, ShieldAlert,
  Sliders, Mail, Plus, Trash2
} from 'lucide-react';

// Subcomponents import
import AdminDashboard from './admin/AdminDashboard';
import AdminAnggota from './admin/AdminAnggota';
import AdminSimpanan from './admin/AdminSimpanan';
import AdminPinjaman from './admin/AdminPinjaman';
import AdminToko from './admin/AdminToko';
import AdminLaporan from './admin/AdminLaporan';
import AdminPengumuman from './admin/AdminPengumuman';
import AdminTema from './admin/AdminTema';
import AdminVentura from './admin/AdminVentura';
import AdminVentureDashboard from './admin/AdminVentureDashboard';
import AdminSewa from './admin/AdminSewa';
import AdminPpob from './admin/AdminPpob';
import AdminDigipay from './admin/AdminDigipay';
import AdminPembiayaan from './admin/AdminPembiayaan';
import AdminDataMaster from './admin/AdminDataMaster';
import AdminCOA from './admin/AdminCOA';
import AdminJurnal from './admin/AdminJurnal';
import AdminBukuBesar from './admin/AdminBukuBesar';
import AdminNeracaSaldo from './admin/AdminNeracaSaldo';
import AdminSubLedger from './admin/AdminSubLedger';
import AdminPDE from './admin/AdminPDE';
import AdminRasio from './admin/AdminRasio';
import AdminArusKas from './admin/AdminArusKas';
import AdminTutupBuku from './admin/AdminTutupBuku';
import AdminAuditTrail from './admin/AdminAuditTrail';
import AdminPerusahaan from './admin/AdminPerusahaan';
import AdminPengajuanVentura from './admin/AdminPengajuanVentura';
import AdminPipelineVentura from './admin/AdminPipelineVentura';
import { useDataStore } from '../stores/dataStore';

// Types import
import { 
  Anggota, Pinjaman, SimpananTransaksi, JenisSimpanan, 
  JenisPinjaman, PermohonanTarik, Angsuran, JournalEntry,
  Barang, KategoriBarang, Supplier, Penjualan, Pembelian,
  FeatureToggles, UserSession, Pengurus, Karyawan, AsetBarang,
  SumberBayar, TiketBantuan, BuktiTransfer, Pengumuman,
  VentureInvestment, VentureDividend,
  SewaAsset, SewaTransaksi, PpobLayanan, PpobTransaksi,
  VirtualAccount, VATransaksi, CicilanBarang, CicilanAngsuran
} from '../types';

import { 
  initialPengurus, initialKaryawan, initialAsetBarang, 
  initialSumberBayar, defaultKoperasiInfo 
} from '../data';

interface AdminPortalProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  session: UserSession;
  members: Anggota[];
  users: UserSession[];
  setUsers: React.Dispatch<React.SetStateAction<UserSession[]>>;
  loans: Pinjaman[];
  savingsTrans: SimpananTransaksi[];
  permohonanList: PermohonanTarik[];
  schedules: Angsuran[];
  journals: JournalEntry[];
  barang: Barang[];
  categories: KategoriBarang[];
  suppliers: Supplier[];
  penjualanList: Penjualan[];
  pembelianList: Pembelian[];
  tickets: TiketBantuan[];
  transferReceipts: BuktiTransfer[];
  featureToggles: FeatureToggles;
  
  // State changers
  onAddMember: (newMember: Omit<Anggota, 'id' | 'saldoSimpananPokok' | 'saldoSimpananWajib' | 'saldoSimpananSukarela'>) => void;
  onUpdateMember: (updatedMember: Anggota) => void;
  onDeleteMember: (id: string) => void;
  onAddTransaction: (newTrans: Omit<SimpananTransaksi, 'id'>) => void;
  onApproveTarik: (id: string) => void;
  onRejectTarik: (id: string) => void;
  onApproveLoan: (id: string) => void;
  onRejectLoan: (id: string) => void;
  onRecordAngsuran: (angsuranId: string, denda: number) => void;
  onAddLoanRequest: (newLoan: Omit<Pinjaman, 'id' | 'noPinjaman' | 'sisaPokok' | 'status' | 'tanggalPengajuan' | 'tanggalCair'>) => void;
  onRecordSale: (newSale: Omit<Penjualan, 'id' | 'noFaktur' | 'tanggal'>) => void;
  onRecordPurchase: (newPurchase: Omit<Pembelian, 'id' | 'noInvoice' | 'tanggal' | 'status'>) => void;
  onUpdateStock: (barangId: string, newStock: number) => void;
  onReplyTicket: (id: string, balasan: string) => void;
  onApproveReceipt: (id: string) => void;
  onRejectReceipt: (id: string) => void;
  onToggleFeature: (key: keyof FeatureToggles) => void;
  savingsTypes: JenisSimpanan[];
  loanTypes: JenisPinjaman[];
  onUpdateSavingsTypes: (updated: JenisSimpanan[]) => void;
  onUpdateLoanTypes: (updated: JenisPinjaman[]) => void;
  announcements: Pengumuman[];
  onAddAnnouncement: (newAnn: Omit<Pengumuman, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onToggleAnnouncementStatus: (id: string) => void;
  themePreset: string;
  onSelectThemePreset: (presetId: string) => void;
  investments: VentureInvestment[];
  onAddInvestment: (newInv: Omit<VentureInvestment, 'id' | 'dividendHistory'>) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onRecordBagiHasil: (investmentId: string, item: Omit<VentureDividend, 'id'>) => void;

  // --- NEW BUSINESS MODULES ---
  sewaAssets: SewaAsset[];
  sewaTransactions: SewaTransaksi[];
  ppobLayanan: PpobLayanan[];
  ppobTransactions: PpobTransaksi[];
  virtualAccounts: VirtualAccount[];
  vaTransactions: VATransaksi[];
  cicilanBarang: CicilanBarang[];
  cicilanAngsuran: CicilanAngsuran[];
  onAddSewaAsset: (newAsset: Omit<SewaAsset, 'id'>) => void;
  onUpdateSewaAsset: (updated: SewaAsset) => void;
  onDeleteSewaAsset: (id: string) => void;
  onApproveSewa: (id: string) => void;
  onRejectSewa: (id: string) => void;
  onFinishSewa: (id: string, denda: number) => void;
  onTogglePpobService: (id: string) => void;
  onUpdatePpobPrices: (id: string, nominalMin: number, nominalMax: number) => void;
  onGenerateVA: (anggotaId: string, bank: VirtualAccount['bank']) => void;
  onSimulateVATransfer: (anggotaId: string, bank: string, nomorVA: string, nominal: number, jenisTrx: VATransaksi['jenisTrx']) => void;
  onApproveCicilanContract: (id: string) => void;
  onRejectCicilanContract: (id: string) => void;
  onRecordInstallmentPay: (angsuranId: string) => void;
  onAddCicilanContract: (newContract: Omit<CicilanBarang, 'id' | 'sisaPokok' | 'status' | 'tanggalPengajuan'>) => void;
}

export default function AdminPortal({
  activeMenu,
  setActiveMenu,
  session,
  members,
  users,
  setUsers,
  loans,
  savingsTrans,
  permohonanList,
  schedules,
  journals,
  barang,
  categories,
  suppliers,
  penjualanList,
  pembelianList,
  tickets,
  transferReceipts,
  featureToggles,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddTransaction,
  onApproveTarik,
  onRejectTarik,
  onApproveLoan,
  onRejectLoan,
  onRecordAngsuran,
  onAddLoanRequest,
  onRecordSale,
  onRecordPurchase,
  onUpdateStock,
  onReplyTicket,
  onApproveReceipt,
  onRejectReceipt,
  onToggleFeature,
  savingsTypes,
  loanTypes,
  onUpdateSavingsTypes,
  onUpdateLoanTypes,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncementStatus,
  themePreset,
  onSelectThemePreset,
  investments,
  onAddInvestment,
  onUpdateStatus,
  onRecordBagiHasil,

  sewaAssets,
  sewaTransactions,
  ppobLayanan,
  ppobTransactions,
  virtualAccounts,
  vaTransactions,
  cicilanBarang,
  cicilanAngsuran,
  onAddSewaAsset,
  onUpdateSewaAsset,
  onDeleteSewaAsset,
  onApproveSewa,
  onRejectSewa,
  onFinishSewa,
  onTogglePpobService,
  onUpdatePpobPrices,
  onGenerateVA,
  onSimulateVATransfer,
  onApproveCicilanContract,
  onRejectCicilanContract,
  onRecordInstallmentPay,
  onAddCicilanContract
}: AdminPortalProps) {
  
  // Local master states inside view (prepopulated for premium visual)


  // GL Module store access
  const gl = useDataStore();

  // Local setting states
  const [kopInfo, setKopInfo] = useState<typeof defaultKoperasiInfo>(defaultKoperasiInfo);
  const [smtpHost, setSmtpHos] = useState('smtp.metrocoop.co.id');
  const [smtpPort, setSmtpPort] = useState('587');
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [ticketReply, setReply] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicketId || !ticketReply.trim()) return;

    onReplyTicket(replyTicketId, ticketReply);
    setReplyTicketId(null);
    setReply('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. DASHBOARD COMPONENT */}
      {activeMenu === 'dashboard' && (
        <AdminDashboard
          members={members}
          loans={loans}
          savingsTrans={savingsTrans}
          onNavigate={setActiveMenu}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          role={session.role}
          kopInfo={kopInfo}
          journals={journals}
          pengurus={gl.pengurus}
          penjualanList={penjualanList}
          sewaTransactions={sewaTransactions}
          ppobTransactions={ppobTransactions}
          vaTransactions={vaTransactions}
          investments={investments}
        />
      )}

      {/* 2. ANGGOTA COMPONENT */}
      {activeMenu === 'anggota' && (
        <AdminAnggota
          members={members}
          onAddMember={onAddMember}
          onUpdateMember={onUpdateMember}
          onDeleteMember={onDeleteMember}
          pengurus={[]}
          onActivateMember={() => {}}
          onDeactivateMember={() => {}}
          onLoginAsMember={() => {}}
          session={session}
          subView="anggota"
        />
      )}

      {/* 3. SIMPANAN BACK OFFICE VIEWS */}
      {activeMenu === 'simpanan_transaksi' && (
        <AdminSimpanan
          members={members}
          savingsTrans={savingsTrans}
          savingsTypes={savingsTypes}
          onUpdateSavingsTypes={onUpdateSavingsTypes}
          permohonanList={permohonanList}
          onAddTransaction={onAddTransaction}
          onApproveTarik={onApproveTarik}
          onRejectTarik={onRejectTarik}
          subView="transaksi"
        />
      )}

      {activeMenu === 'simpanan_permohonan' && (
        <AdminSimpanan
          members={members}
          savingsTrans={savingsTrans}
          savingsTypes={savingsTypes}
          onUpdateSavingsTypes={onUpdateSavingsTypes}
          permohonanList={permohonanList}
          onAddTransaction={onAddTransaction}
          onApproveTarik={onApproveTarik}
          onRejectTarik={onRejectTarik}
          subView="permohonan"
        />
      )}

      {activeMenu === 'simpanan_jenis' && (
        <AdminSimpanan
          members={members}
          savingsTrans={savingsTrans}
          savingsTypes={savingsTypes}
          onUpdateSavingsTypes={onUpdateSavingsTypes}
          permohonanList={permohonanList}
          onAddTransaction={onAddTransaction}
          onApproveTarik={onApproveTarik}
          onRejectTarik={onRejectTarik}
          subView="jenis"
        />
      )}

      {/* 4. PINJAMAN BACK OFFICE VIEWS */}
      {activeMenu === 'pinjaman_pengajuan' && (
        <AdminPinjaman
          members={members}
          loans={loans}
          loanTypes={loanTypes}
          onUpdateLoanTypes={onUpdateLoanTypes}
          schedules={schedules}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          onRecordAngsuran={onRecordAngsuran}
          onAddLoanRequest={onAddLoanRequest}
          subView="pengajuan"
        />
      )}

      {activeMenu === 'pinjaman_angsuran' && (
        <AdminPinjaman
          members={members}
          loans={loans}
          loanTypes={loanTypes}
          onUpdateLoanTypes={onUpdateLoanTypes}
          schedules={schedules}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          onRecordAngsuran={onRecordAngsuran}
          onAddLoanRequest={onAddLoanRequest}
          subView="angsuran"
        />
      )}

      {activeMenu === 'pinjaman_tagihan' && (
        <AdminPinjaman
          members={members}
          loans={loans}
          loanTypes={loanTypes}
          onUpdateLoanTypes={onUpdateLoanTypes}
          schedules={schedules}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          onRecordAngsuran={onRecordAngsuran}
          onAddLoanRequest={onAddLoanRequest}
          subView="tagihan"
        />
      )}

      {activeMenu === 'pinjaman_konfigurasi' && (
        <AdminPinjaman
          members={members}
          loans={loans}
          loanTypes={loanTypes}
          onUpdateLoanTypes={onUpdateLoanTypes}
          schedules={schedules}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          onRecordAngsuran={onRecordAngsuran}
          onAddLoanRequest={onAddLoanRequest}
          subView="jenis"
        />
      )}

      {/* 5. TOKO / SHOP CHANNELS */}
      {activeMenu === 'toko_kasir' && (
        <AdminToko
          barang={barang}
          categories={categories}
          suppliers={suppliers}
          penjualanList={penjualanList}
          pembelianList={pembelianList}
          onRecordSale={onRecordSale}
          onRecordPurchase={onRecordPurchase}
          onUpdateStock={onUpdateStock}
          subView="kasir"
        />
      )}

      {activeMenu === 'toko_barang' && (
        <AdminToko
          barang={barang}
          categories={categories}
          suppliers={suppliers}
          penjualanList={penjualanList}
          pembelianList={pembelianList}
          onRecordSale={onRecordSale}
          onRecordPurchase={onRecordPurchase}
          onUpdateStock={onUpdateStock}
          subView="barang"
        />
      )}

      {activeMenu === 'toko_supplier' && (
        <AdminToko
          barang={barang}
          categories={categories}
          suppliers={suppliers}
          penjualanList={penjualanList}
          pembelianList={pembelianList}
          onRecordSale={onRecordSale}
          onRecordPurchase={onRecordPurchase}
          onUpdateStock={onUpdateStock}
          subView="supplier"
        />
      )}

      {activeMenu === 'toko_laporan' && (
        <AdminToko
          barang={barang}
          categories={categories}
          suppliers={suppliers}
          penjualanList={penjualanList}
          pembelianList={pembelianList}
          onRecordSale={onRecordSale}
          onRecordPurchase={onRecordPurchase}
          onUpdateStock={onUpdateStock}
          subView="laporan"
        />
      )}

      {/* 6. ADDITIONAL MODULE STATS (Sewa, PPOB, Digital Payment, Pembiayaan) */}
      {activeMenu === 'sewa_dashboard' && (
        <AdminSewa
          assets={sewaAssets}
          transactions={sewaTransactions}
          members={members}
          onAddAsset={onAddSewaAsset}
          onUpdateAsset={onUpdateSewaAsset}
          onDeleteAsset={onDeleteSewaAsset}
          onApproveSewa={onApproveSewa}
          onRejectSewa={onRejectSewa}
          onFinishSewa={onFinishSewa}
        />
      )}

      {activeMenu === 'ppob_dashboard' && (
        <AdminPpob
          services={ppobLayanan}
          transactions={ppobTransactions}
          onToggleService={onTogglePpobService}
          onUpdateServicePrices={onUpdatePpobPrices}
        />
      )}

      {activeMenu === 'digipay_dashboard' && (
        <AdminDigipay
          virtualAccounts={virtualAccounts}
          vaTransactions={vaTransactions}
          members={members}
          onGenerateVA={onGenerateVA}
          onSimulateVATransfer={onSimulateVATransfer}
        />
      )}

      {activeMenu === 'pembiayaan_dashboard' && (
        <AdminPembiayaan
          contracts={cicilanBarang}
          installments={cicilanAngsuran}
          members={members}
          onApproveContract={onApproveCicilanContract}
          onRejectContract={onRejectCicilanContract}
          onRecordInstallmentPay={onRecordInstallmentPay}
          onAddContract={onAddCicilanContract}
        />
      )}

      {activeMenu === 'ventura_dashboard' && (
        <AdminVentura
          investments={investments}
          onAddInvestment={onAddInvestment}
          onUpdateStatus={onUpdateStatus}
          onRecordBagiHasil={onRecordBagiHasil}
          onUpdateInvestment={gl.updateVentureInvestment}
        />
      )}

      {activeMenu === 'ventura_perusahaan' && (
        <AdminPerusahaan
          perusahaan={gl.perusahaan}
          onAdd={gl.addPerusahaan}
          onUpdate={gl.updatePerusahaan}
          onDelete={gl.deletePerusahaan}
        />
      )}

      {activeMenu === 'ventura_analytics' && (
        <AdminVentureDashboard
          investments={investments}
          onNavigate={setActiveMenu}
        />
      )}

      {activeMenu === 'ventura_pipeline' && (
        <AdminPipelineVentura
          pengajuanList={gl.pengajuanList}
          ventureInvestments={investments}
          perusahaan={gl.perusahaan}
          fetchPengajuan={gl.fetchPengajuan}
          fetchInvestments={gl.fetchInvestments}
          onConvertToVenture={gl.konversiPengajuan}
          onUploadDokumen={gl.uploadDokumenPengajuan}
          onValidasiDokumen={gl.validasiDokumen}
        />
      )}

      {activeMenu === 'ventura_pengajuan' && (
        <AdminPengajuanVentura
          pengajuanList={gl.pengajuanList}
          perusahaan={gl.perusahaan}
          fetchPengajuan={gl.fetchPengajuan}
          createPengajuan={gl.createPengajuan}
          updateStatusPengajuan={gl.updateStatusPengajuan}
          runAIScoring={gl.runAIScoring}
          fetchDokumenTemplates={gl.fetchDokumenTemplates}
        />
      )}

      {activeMenu === 'pengumuman_admin' && (
        <AdminPengumuman
          announcements={announcements}
          onAddAnnouncement={onAddAnnouncement}
          onDeleteAnnouncement={onDeleteAnnouncement}
          onToggleAnnouncementStatus={onToggleAnnouncementStatus}
        />
      )}

      {activeMenu === 'tema_tampilan' && (
        <AdminTema
          currentTheme={themePreset}
          onSelectThemePreset={onSelectThemePreset}
        />
      )}

      {/* 7. LAPORAN & JURNAL ACCOUNTS */}
      {activeMenu === 'laporan_labarugi' && (
        <AdminLaporan
          members={members}
          loans={loans}
          journals={journals}
          subView="labarugi"
        />
      )}

      {activeMenu === 'laporan_neraca' && (
        <AdminLaporan
          members={members}
          loans={loans}
          journals={journals}
          subView="neraca"
        />
      )}

      {activeMenu === 'laporan_shu' && (
        <AdminLaporan
          members={members}
          loans={loans}
          journals={journals}
          subView="shu"
        />
      )}

      {/* ============ GENERAL LEDGER MODULE ============ */}
      {activeMenu === 'akuntansi_coa' && (
        <AdminCOA
          chartOfAccounts={gl.chartOfAccounts}
          onAdd={gl.addCOA}
          onUpdate={gl.updateCOA}
          onDeactivate={gl.deactivateCOA}
        />
      )}

      {activeMenu === 'akuntansi_jurnal' && (
        <AdminJurnal
          chartOfAccounts={gl.chartOfAccounts}
          journals={journals}
          createManualJurnal={gl.createManualJurnal}
          approveJurnal={gl.approveJurnal}
          reverseJurnal={gl.reverseJurnal}
          fetchJournals={gl.fetchJournals}
        />
      )}

      {activeMenu === 'akuntansi_bukubesar' && (
        <AdminBukuBesar
          chartOfAccounts={gl.chartOfAccounts}
          fetchBukuBesar={gl.fetchBukuBesar}
          bukuBesar={gl.bukuBesar}
        />
      )}

      {activeMenu === 'akuntansi_neracasaldo' && (
        <AdminNeracaSaldo
          neracaSaldo={gl.neracaSaldo}
          fetchNeracaSaldo={gl.fetchNeracaSaldo}
        />
      )}

      {activeMenu === 'subledger_piutang' && (
        <AdminSubLedger
          subLedgerPiutang={gl.subLedgerPiutang}
          fetchSubLedgerPiutang={gl.fetchSubLedgerPiutang}
        />
      )}

      {activeMenu === 'laporan_aruskas' && (
        <AdminArusKas
          laporanLabarugi={gl.laporanLabarugi}
          fetchLaporanLabarugi={gl.fetchLaporanLabarugi}
          journals={journals}
        />
      )}

      {activeMenu === 'laporan_pde' && (
        <AdminPDE laporanPde={gl.laporanPde} fetchLaporanPde={gl.fetchLaporanPde} />
      )}

      {activeMenu === 'laporan_rasio' && (
        <AdminRasio laporanRasio={gl.laporanRasio} fetchLaporanRasio={gl.fetchLaporanRasio} />
      )}

      {activeMenu === 'akuntansi_periode' && (
        <AdminTutupBuku
          accountingPeriods={gl.accountingPeriods}
          fetchPeriods={gl.fetchPeriods}
          closePeriod={gl.closePeriod}
          openPeriod={gl.openPeriod}
          tutupBuku={gl.tutupBuku}
        />
      )}

      {activeMenu === 'akuntansi_audit' && (
        <AdminAuditTrail journals={journals} fetchJournals={gl.fetchJournals} />
      )}

      {/* 8. CS ASSISTANCE TICKETS AND RECEIPTS REVIEW */}
      {activeMenu === 'tiket_admin' && (
        <div className="space-y-6">
          {/* Support Ticket Section */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
              Tiket Keluhan &amp; Pengaduan Anggota (Pusat Bantuan)
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">Tidak ada tiket bantuan yang terbuka.</div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {tickets.map((t) => (
                  <div key={t.id} className="p-5 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${
                          t.prioritas === 'Tinggi' ? 'bg-red-500' : 'bg-slate-500'
                        } mr-2`}>
                          {t.prioritas}
                        </span>
                        <span className="font-bold text-slate-800">{t.subjek}</span>
                      </div>
                      <span className="font-mono text-slate-400">{t.tanggal}</span>
                    </div>

                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                      &quot;{t.pesan}&quot;
                    </p>

                    <div className="text-[10px] text-slate-400 font-bold">
                      Diajukan oleh: <span className="text-slate-600">{t.anggotaNama}</span> | Kategori: <span className="text-slate-600">{t.kategori}</span>
                    </div>

                    {t.balasanAdmin ? (
                      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg mt-2 text-blue-900 leading-relaxed">
                        <span className="font-bold">Balasan CS Staff: </span>
                        <span>{t.balasanAdmin}</span>
                      </div>
                    ) : (
                      <div className="pt-2">
                        {replyTicketId === t.id ? (
                          <form onSubmit={handleReplySubmit} className="space-y-2">
                            <textarea
                              value={ticketReply}
                              onChange={(e) => setReply(e.target.value)}
                              placeholder="Tuliskan solusi balasan resmi..."
                              required
                              className="w-full border p-2 text-xs rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                              rows={2}
                            />
                            <div className="text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => setReplyTicketId(null)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border rounded font-semibold text-[10px]"
                              >
                                Batal
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[10px]"
                              >
                                Kirim Balasan
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setReplyTicketId(t.id)}
                            className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded font-bold text-[10px] cursor-pointer"
                          >
                            ✍️ Jawab / Beri Solusi
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Transfer Receipts verification */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
              Validasi Bukti Transfer Mandiri Anggota
            </div>

            {transferReceipts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">Tidak ada unggahan bukti transfer baru.</div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="p-4">Tanggal Kirim</th>
                      <th className="p-4">Nama Anggota</th>
                      <th className="p-4">Keterangan</th>
                      <th className="p-4">Bank Pengirim &amp; Reff</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transferReceipts.map((r) => (
                      <tr key={r.id}>
                        <td className="p-4 font-mono text-slate-400">{r.tanggal}</td>
                        <td className="p-4 font-bold text-slate-800">{r.anggotaNama}</td>
                        <td className="p-4 text-slate-600 italic">{r.keterangan}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-700">{r.bankPengirim}</div>
                          <div className="text-[10px] text-slate-400 font-mono">No.Ref: {r.noRef}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900">{formatIDR(r.jumlah)}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            r.status === 'pending' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                              : r.status === 'disetujui' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {r.status === 'pending' ? 'Perlu Validasi' : r.status === 'disetujui' ? 'Terverifikasi' : 'Ditolak'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {r.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Setujui bukti transfer dana sejumlah ${formatIDR(r.jumlah)}?`)) {
                                    onApproveReceipt(r.id);
                                  }
                                }}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer"
                              >
                                Verifikasi Setuju
                              </button>
                              <button
                                onClick={() => onRejectReceipt(r.id)}
                                className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-2.5 py-1 rounded font-semibold text-[10px] cursor-pointer"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. DATA MASTER TABULAR DIRECTORIES */}
      {activeMenu === 'data_master' && (
        <AdminDataMaster
          pengurusList={gl.pengurus}
          karyawanList={gl.karyawan}
          asetList={gl.asetBarang}
          sumberBayarList={gl.sumberBayar}
          users={gl.users}
          members={members}
          onAddUser={gl.addUser}
          onUpdateUser={gl.updateUser}
          onDeleteUser={gl.deleteUser}
          onAddPengurus={gl.addPengurus}
          onUpdatePengurus={gl.updatePengurus}
          onDeletePengurus={gl.deletePengurus}
          onAddKaryawan={gl.addKaryawan}
          onUpdateKaryawan={gl.updateKaryawan}
          onDeleteKaryawan={gl.deleteKaryawan}
          onAddAset={gl.addAsetBarang}
          onUpdateAset={gl.updateAsetBarang}
          onDeleteAset={gl.deleteAsetBarang}
          onAddSumber={gl.addSumberBayar}
          onUpdateSumber={gl.updateSumberBayar}
          onDeleteSumber={gl.deleteSumberBayar}
        />
      )}


      {/* 10. SYSTEM CONFIGURATION & FEATURE TOGGLES */}
      {activeMenu === 'pengaturan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Profile Form */}
          <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              Profil Organisasi Koperasi Simpan Pinjam
            </h3>

            {showSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold">Berhasil Disimpan!</span> Profil Organisasi Koperasi Simpan Pinjam telah sukses diperbarui.
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1">Nama Koperasi Resmi</label>
                <input
                  type="text"
                  value={kopInfo.nama}
                  onChange={(e) => setKopInfo({ ...kopInfo, nama: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Kabupaten/Kota</label>
                <input
                  type="text"
                  value={kopInfo.kota}
                  onChange={(e) => setKopInfo({ ...kopInfo, kota: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={kopInfo.provinsi}
                  onChange={(e) => setKopInfo({ ...kopInfo, provinsi: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1">Alamat Kantor Ruko</label>
                <input
                  type="text"
                  value={kopInfo.alamat}
                  onChange={(e) => setKopInfo({ ...kopInfo, alamat: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">No. Badan Hukum</label>
                <input
                  type="text"
                  value={kopInfo.noBadanHukum}
                  onChange={(e) => setKopInfo({ ...kopInfo, noBadanHukum: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nomor NPWP Pajak</label>
                <input
                  type="text"
                  value={kopInfo.npwp}
                  onChange={(e) => setKopInfo({ ...kopInfo, npwp: e.target.value })}
                  className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                Konfigurasi Notifikasi Mail SMTP (Email)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">SMTP Host Server</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHos(e.target.value)}
                    className="w-full border p-1.5 bg-white rounded text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">SMTP Port</label>
                  <input
                    type="text"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full border p-1.5 bg-white rounded text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Simpan Perubahan Profil
              </button>
            </div>
          </form>

          {/* Feature toggles checklist panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              Sistem Toggle Fitur (Feature Toggle)
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Aktifkan atau nonaktifkan modul-modul tambahan di bawah. Fitur yang dimatikan tidak akan tampil di sidebar navigasi staff Operator.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {(Object.keys(featureToggles) as Array<keyof FeatureToggles>).map((key) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <div className="capitalize text-slate-700 font-semibold tracking-tight">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={featureToggles[key]} 
                      onChange={() => onToggleFeature(key)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 hover:bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
