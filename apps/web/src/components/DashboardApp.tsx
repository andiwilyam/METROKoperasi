import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminPortal from './AdminPortal';
import MemberPortal from './MemberPortal';
import MemberPerusahaanPortal from './MemberPerusahaanPortal';
import { useTheme } from '../theme/ThemeProvider';

export default function DashboardApp() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const store = useDataStore();
  const { setTheme } = useTheme();

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const pendingNotificationsCount =
    store.transferReceipts.filter((r: any) => r.status === 'pending').length +
    store.permohonanList.filter((p: any) => p.status === 'pengajuan').length +
    store.loans.filter((l: any) => l.status === 'pengajuan').length;

  const isAdmin = user?.role === 'admin' || user?.role === 'operator' || user?.role === 'superadmin';
  const isPerusahaan = user?.role === 'anggota_perusahaan';

  const commonProps = {
    activeMenu,
    setActiveMenu,
    session: user,
    onSelectThemePreset: setTheme,
  };

  const adminProps = {
    ...commonProps,
    members: store.members,
    users: store.users,
    setUsers: () => {},
    loans: store.loans,
    savingsTrans: store.savingsTrans,
    permohonanList: store.permohonanList,
    schedules: store.schedules,
    journals: store.journals,
    barang: store.barang,
    categories: store.categories,
    suppliers: store.suppliers,
    penjualanList: store.penjualanList,
    pembelianList: store.pembelianList,
    tickets: store.tickets,
    transferReceipts: store.transferReceipts,
    featureToggles: store.featureToggles,
    onAddMember: store.addMember,
    onUpdateMember: store.updateMember,
    onDeleteMember: store.deleteMember,
    onAddTransaction: store.addSavingsTrans,
    onApproveTarik: store.approvePermohonan,
    onRejectTarik: store.rejectPermohonan,
    onApproveLoan: store.approveLoan,
    onRejectLoan: store.rejectLoan,
    onRecordAngsuran: (id: string, denda: number = 0) => store.payAngsuran(id, denda),
    onAddLoanRequest: store.addLoan,
    onRecordSale: store.addPenjualan,
    onRecordPurchase: store.addPembelian,
    onUpdateStock: store.updateStock,
    onReplyTicket: store.replyTicket,
    onApproveReceipt: store.approveReceipt,
    onRejectReceipt: store.rejectReceipt,
    onToggleFeature: (key: string) => {
      const updated = { ...store.featureToggles, [key]: !store.featureToggles[key] };
      store.updateFeatureToggles(updated);
    },
    savingsTypes: store.savingsTypes,
    loanTypes: store.loanTypes,
    onUpdateSavingsTypes: store.updateSavingsTypes,
    onUpdateLoanTypes: store.updateLoanTypes,
    announcements: store.announcements,
    onAddAnnouncement: store.addAnnouncement,
    onDeleteAnnouncement: store.deleteAnnouncement,
    onToggleAnnouncementStatus: store.toggleAnnouncement,
    investments: store.investments,
    onAddInvestment: store.addInvestment,
    onUpdateStatus: store.updateVentureStatus,
    onRecordBagiHasil: store.addDividen,
    sewaAssets: store.sewaAssets,
    sewaTransactions: store.sewaTransactions,
    ppobLayanan: store.ppobLayanan,
    ppobTransactions: store.ppobTransactions,
    virtualAccounts: store.virtualAccounts,
    vaTransactions: store.vaTransactions,
    cicilanBarang: store.cicilanBarang,
    cicilanAngsuran: store.cicilanAngsuran,
    onAddSewaAsset: store.addSewaAsset,
    onUpdateSewaAsset: store.updateSewaAsset,
    onDeleteSewaAsset: store.deleteSewaAsset,
    onApproveSewa: store.approveSewa,
    onRejectSewa: store.rejectSewa,
    onFinishSewa: store.finishSewa,
    onTogglePpobService: store.togglePpobService,
    onUpdatePpobPrices: store.updatePpobPrices,
    onGenerateVA: store.generateVA,
    onSimulateVATransfer: store.addVATrans,
    onApproveCicilanContract: store.approveCicilan,
    onRejectCicilanContract: store.rejectCicilan,
    onRecordInstallmentPay: store.payCicilanAngsuran,
    onAddCicilanContract: store.addCicilanBarang,
  };

  const memberProps = {
    ...commonProps,
    members: store.members,
    loans: store.loans,
    savingsTrans: store.savingsTrans,
    savingsTypes: store.savingsTypes,
    loanTypes: store.loanTypes,
    schedules: store.schedules,
    barang: store.barang,
    categories: store.categories,
    tickets: store.tickets,
    onUploadReceipt: store.addReceipt,
    onSubmitWithdrawRequest: store.addPermohonan,
    onAddLoanRequest: store.addLoan,
    onAddTicket: store.addTicket,
    onUpdateMember: store.updateMember,
    announcements: store.announcements,
    investments: store.investments,
    onAddVentureInvestment: store.addInvestment,
    sewaAssets: store.sewaAssets,
    sewaTransactions: store.sewaTransactions,
    ppobLayanan: store.ppobLayanan,
    ppobTransactions: store.ppobTransactions,
    virtualAccounts: store.virtualAccounts,
    vaTransactions: store.vaTransactions,
    cicilanBarang: store.cicilanBarang,
    cicilanAngsuran: store.cicilanAngsuran,
    onAddSewaRequest: store.addSewaTrans,
    onAddPpobTransaksi: store.addPpobTrans,
    onSimulateVATransfer: store.addVATrans,
    onAddContractRequest: store.addCicilanBarang,
    onPayInstallmentFromSukarela: async (id: string) => {
      try {
        await store.payCicilanAngsuran(id);
        return { success: true, message: 'Pembayaran sukses' };
      } catch {
        return { success: false, message: 'Gagal bayar' };
      }
    },
  };

  // Perusahaan portal uses its own layout
  if (isPerusahaan) {
    return <MemberPerusahaanPortal />;
  }

  return (
    <div className="min-h-screen font-sans antialiased mc-bg flex overflow-hidden">
      <Sidebar
        role={user?.role}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        featureToggles={store.featureToggles}
        onLogout={logout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          session={user}
          setSidebarOpen={setSidebarOpen}
          onLogout={logout}
          activeMenu={activeMenu}
          pendingNotificationsCount={pendingNotificationsCount}
          onNavigateToNotifications={() => setActiveMenu(isAdmin ? 'tiket_admin' : 'member_bantuan')}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full flex flex-col justify-between">
          <div className="space-y-6 flex-1 pb-8">
            {isAdmin ? (
              <AdminPortal {...adminProps as any} />
            ) : (
              <MemberPortal {...memberProps as any} />
            )}
          </div>
          <footer className="pt-6 border-t mc-border text-center flex-shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest mc-muted uppercase select-none">
              METROCOOP \u2022 Koperasi Simpan Pinjam @2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

