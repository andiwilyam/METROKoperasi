/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, Building2, LayoutDashboard, Users, PiggyBank, HandCoins, 
  Store, Key, Settings, FileText, ChevronDown, ChevronRight, 
  LifeBuoy, FileCheck, User, LogOut, Moon, Sun, ShoppingCart, 
  Tv, PhoneCall, Wallet, Award, Palette, LineChart, GitMerge, Globe
} from 'lucide-react';
import { UserRole, FeatureToggles } from '../types';

interface SidebarProps {
  role: UserRole;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  featureToggles: FeatureToggles;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Sidebar({
  role,
  activeMenu,
  setActiveMenu,
  featureToggles,
  onLogout,
  isOpen,
  setIsOpen,
  theme,
  setTheme
}: SidebarProps) {
  // Collapsible submenus state
  const [openSub, setOpenSub] = useState<{ [key: string]: boolean }>({
    simpanan: false,
    pinjaman: false,
    toko: false,
    unitLain: false,
    laporan: false,
  });

  const toggleSub = (menu: string) => {
    setOpenSub((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    // On mobile, close sidebar on click
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Helper check if a feature is enabled
  const isEnabled = (key: keyof FeatureToggles) => {
    // Superadmin/Admin override toggles for basic core views, operator respects them
    if (role === 'admin' || role === 'superadmin') return true;
    // Regular KSP members cannot access venture/investment features
    if (key === 'ventura' && role === 'anggota') return false;
    return featureToggles[key];
  };

  const isAdminOrOperator = role === 'admin' || role === 'operator' || role === 'superadmin';

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky lg:top-0 h-screen shrink-0 inset-y-0 left-0 z-50 w-64 mc-sidebar border-r mc-border flex flex-col transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide">MetroCoop</span>
              <span className="block text-[9px] mc-sidebar-muted font-medium">Koperasi Simpan Pinjam</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu"
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          
          {/* ADMIN & OPERATOR PORTAL MENU */}
          {isAdminOrOperator ? (
            <>
              {/* Main Core Section */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold mc-sidebar-muted px-3 mb-2">MANAJEMEN UTAMA</p>
                
                {/* Dashboard */}
                <button
                  onClick={() => handleMenuClick('dashboard')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'dashboard' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Dashboard Utama
                </button>

                {/* Anggota */}
                {isEnabled('anggota') && (
                  <button
                    onClick={() => handleMenuClick('anggota')}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                      activeMenu === 'anggota' 
                        ? 'mc-sidebar-active' 
                        : 'mc-sidebar-item'
                    }`}
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Manajemen Anggota
                  </button>
                )}

                {/* Simpanan Dropdown */}
                {isEnabled('simpanan') && (
                  <div className="space-y-0.5">
                    <button
                      onClick={() => toggleSub('simpanan')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg mc-sidebar-item transition"
                    >
                      <span className="flex items-center">
                        <PiggyBank className="w-4 h-4 mr-3 mc-icon-accent" />
                        Simpanan (Savings)
                      </span>
                      {openSub.simpanan ? <ChevronDown className="w-3.5 h-3.5 mc-sidebar-muted" /> : <ChevronRight className="w-3.5 h-3.5 mc-sidebar-muted" />}
                    </button>
                    {openSub.simpanan && (
                      <div className="pl-7 space-y-0.5 mt-0.5">
                        <button 
                          onClick={() => handleMenuClick('simpanan_transaksi')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'simpanan_transaksi' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Setor &amp; Tarik
                        </button>
                        <button 
                          onClick={() => handleMenuClick('simpanan_permohonan')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'simpanan_permohonan' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Permohonan Tarik
                        </button>
                        <button 
                          onClick={() => handleMenuClick('simpanan_jenis')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'simpanan_jenis' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Konfigurasi Simpanan
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pinjaman Dropdown */}
                {isEnabled('pinjaman') && (
                  <div className="space-y-0.5">
                    <button
                      onClick={() => toggleSub('pinjaman')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg mc-sidebar-item transition"
                    >
                      <span className="flex items-center">
                        <HandCoins className="w-4 h-4 mr-3 mc-icon-accent" />
                        Pinjaman (Loans)
                      </span>
                      {openSub.pinjaman ? <ChevronDown className="w-3.5 h-3.5 mc-sidebar-muted" /> : <ChevronRight className="w-3.5 h-3.5 mc-sidebar-muted" />}
                    </button>
                    {openSub.pinjaman && (
                      <div className="pl-7 space-y-0.5 mt-0.5">
                        <button 
                          onClick={() => handleMenuClick('pinjaman_pengajuan')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'pinjaman_pengajuan' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Daftar Pengajuan
                        </button>
                        <button 
                          onClick={() => handleMenuClick('pinjaman_angsuran')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'pinjaman_angsuran' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Bayar Angsuran
                        </button>
                        <button 
                          onClick={() => handleMenuClick('pinjaman_tagihan')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'pinjaman_tagihan' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Tagihan &amp; Jatuh Tempo
                        </button>
                        <button 
                          onClick={() => handleMenuClick('pinjaman_konfigurasi')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'pinjaman_konfigurasi' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Konfigurasi Pinjaman
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Unit Bisnis / Commercial Section */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold mc-sidebar-muted px-3 mb-2">Unit Usaha (Business)</p>
                
                {/* Toko Dropdown */}
                {isEnabled('toko') && (
                  <div className="space-y-0.5">
                    <button
                      onClick={() => toggleSub('toko')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg mc-sidebar-item transition"
                    >
                      <span className="flex items-center">
                        <Store className="w-4 h-4 mr-3 mc-icon-accent" />
                        Unit Toko (POS)
                      </span>
                      {openSub.toko ? <ChevronDown className="w-3.5 h-3.5 mc-sidebar-muted" /> : <ChevronRight className="w-3.5 h-3.5 mc-sidebar-muted" />}
                    </button>
                    {openSub.toko && (
                      <div className="pl-7 space-y-0.5 mt-0.5">
                        <button 
                          onClick={() => handleMenuClick('toko_kasir')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition flex items-center gap-1.5 ${activeMenu === 'toko_kasir' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          • Kasir POS Utama
                        </button>
                        <button 
                          onClick={() => handleMenuClick('toko_barang')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'toko_barang' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Katalog Barang
                        </button>
                        <button 
                          onClick={() => handleMenuClick('toko_supplier')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'toko_supplier' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Supplier &amp; Pembelian
                        </button>
                        <button 
                          onClick={() => handleMenuClick('toko_laporan')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === 'toko_laporan' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          • Laporan Toko
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Other Business Units Dropdown */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => toggleSub('unitLain')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg mc-sidebar-item transition"
                  >
                    <span className="flex items-center">
                      <Key className="w-4 h-4 mr-3 mc-icon-accent" />
                      Unit Tambahan
                    </span>
                    {openSub.unitLain ? <ChevronDown className="w-3.5 h-3.5 mc-sidebar-muted" /> : <ChevronRight className="w-3.5 h-3.5 mc-sidebar-muted" />}
                  </button>
                  {openSub.unitLain && (
                    <div className="pl-7 space-y-0.5 mt-0.5">
                      {isEnabled('sewa') && (
                        <button 
                          onClick={() => handleMenuClick('sewa_dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition flex items-center gap-1.5 ${activeMenu === 'sewa_dashboard' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          <Tv className="w-3 h-3" />
                          • Sewa Aset &amp; Rental
                        </button>
                      )}
                      {isEnabled('ppob') && (
                        <button 
                          onClick={() => handleMenuClick('ppob_dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition flex items-center gap-1.5 ${activeMenu === 'ppob_dashboard' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          <PhoneCall className="w-3 h-3" />
                          • PPOB &amp; Pulsa
                        </button>
                      )}
                      {isEnabled('digitalPayment') && (
                        <button 
                          onClick={() => handleMenuClick('digipay_dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition flex items-center gap-1.5 ${activeMenu === 'digipay_dashboard' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          <Wallet className="w-3 h-3" />
                          • Digital Payment
                        </button>
                      )}
                      {isEnabled('pembiayaan') && (
                        <button 
                          onClick={() => handleMenuClick('pembiayaan_dashboard')}
                          className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition flex items-center gap-1.5 ${activeMenu === 'pembiayaan_dashboard' ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                        >
                          <Award className="w-3 h-3" />
                          • Kredit &amp; Pembiayaan
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Manajemen Investasi & Penyertaan Modal Section */}
              {isEnabled('ventura') && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-semibold mc-sidebar-muted px-3 mb-2">Manajemen Investasi &amp; Penyertaan Modal</p>
                  
                  {/* Dashboard Investasi */}
                  <button
                    onClick={() => handleMenuClick('ventura_analytics')}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                      activeMenu === 'ventura_analytics' 
                        ? 'mc-sidebar-active' 
                        : 'mc-sidebar-item'
                    }`}
                  >
                    <LineChart className="w-4 h-4 mr-3" />
                    Modul Dashboard
                  </button>

                  {/* Data Perusahaan */}
                  <button
                    onClick={() => handleMenuClick('ventura_perusahaan')}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                      activeMenu === 'ventura_perusahaan' 
                        ? 'mc-sidebar-active' 
                        : 'mc-sidebar-item'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mr-3" />
                    Data Perusahaan
                  </button>

                  {/* Pipeline Investasi Terpadu */}
                  <button
                    onClick={() => handleMenuClick('ventura_pipeline')}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                      activeMenu === 'ventura_pipeline' 
                        ? 'mc-sidebar-active' 
                        : 'mc-sidebar-item'
                    }`}
                  >
                    <GitMerge className="w-4 h-4 mr-3" />
                    Pipeline Investasi
                  </button>
                </div>
              )}

              {/* Finance & Reports Section */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold mc-sidebar-muted px-3 mb-2">Akuntansi &amp; Laporan</p>
                
                {/* Laporan Keuangan */}
                {isEnabled('laporan') && (
                  <div className="space-y-0.5">
                    <button
                      onClick={() => toggleSub('laporan')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg mc-sidebar-item transition"
                    >
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 mc-icon-accent" />
                        Pembukuan &amp; Keuangan
                      </span>
                      {openSub.laporan ? <ChevronDown className="w-3.5 h-3.5 mc-sidebar-muted" /> : <ChevronRight className="w-3.5 h-3.5 mc-sidebar-muted" />}
                    </button>
                    {openSub.laporan && (
                      <div className="pl-7 space-y-0.5 mt-0.5">
                        {[
                          { id: 'akuntansi_coa', label: 'Bagan Akun (COA)' },
                          { id: 'akuntansi_jurnal', label: 'Jurnal Umum' },
                          { id: 'akuntansi_bukubesar', label: 'Buku Besar' },
                          { id: 'akuntansi_neracasaldo', label: 'Neraca Saldo' },
                          { id: 'subledger_piutang', label: 'Sub Ledger Piutang' },
                          { id: 'laporan_labarugi', label: 'Laporan Laba / Rugi' },
                          { id: 'laporan_neraca', label: 'Laporan Neraca' },
                          { id: 'laporan_shu', label: 'Laba Bersih & SHU' },
                          { id: 'laporan_aruskas', label: 'Laporan Arus Kas' },
                          { id: 'laporan_pde', label: 'Kualitas Aktiva (PDE)' },
                          { id: 'laporan_rasio', label: 'Rasio Keuangan' },
                          { id: 'akuntansi_periode', label: 'Periode & Tutup Buku' },
                          { id: 'akuntansi_audit', label: 'Audit Trail Jurnal' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full text-left px-3 py-1.5 text-[11px] rounded-md transition ${activeMenu === item.id ? 'mc-sidebar-active' : 'mc-sidebar-muted mc-sidebar-item'}`}
                          >
                            • {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pengumuman Setup */}
                {isEnabled('pengumuman') && (
                  <button
                    onClick={() => handleMenuClick('pengumuman_admin')}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                      activeMenu === 'pengumuman_admin' 
                        ? 'mc-sidebar-active' 
                        : 'mc-sidebar-item'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Kelola Pengumuman
                  </button>
                )}

                {/* Tiket & Bukti Transfer Admin Check */}
                <button
                  onClick={() => handleMenuClick('tiket_admin')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'tiket_admin' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 mr-3" />
                  Tiket &amp; Pengaduan
                </button>
              </div >

              {/* Data Master and Settings */}
              <div className="space-y-1 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleMenuClick('data_master')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'data_master' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <Building className="w-4 h-4 mr-3" />
                  Data Master Organisasi
                </button>
                {(role === 'admin' || role === 'superadmin') && (
                  <>
                    <button
                      onClick={() => handleMenuClick('pengaturan')}
                      className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                        activeMenu === 'pengaturan' 
                          ? 'mc-sidebar-active' 
                          : 'mc-sidebar-item'
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Pengaturan Koperasi
                    </button>
                    <button
                      onClick={() => handleMenuClick('tema_tampilan')}
                      className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                        activeMenu === 'tema_tampilan' 
                          ? 'mc-sidebar-active' 
                          : 'mc-sidebar-item'
                      }`}
                    >
                      <Palette className="w-4 h-4 mr-3" />
                      Kustomisasi Tema
                    </button>
                    <button
                      onClick={() => handleMenuClick('landing_cms')}
                      className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                        activeMenu === 'landing_cms' 
                          ? 'mc-sidebar-active' 
                          : 'mc-sidebar-item'
                      }`}
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Landing Page Editor
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            /* ANGGOTA PORTAL MENU */
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-semibold mc-sidebar-muted px-3 mb-2">Member Portal</p>
              
              <button
                onClick={() => handleMenuClick('member_dashboard')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_dashboard' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Ringkasan Dashboard
              </button>

              <button
                onClick={() => handleMenuClick('member_simpanan')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_simpanan' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <PiggyBank className="w-4 h-4 mr-3" />
                Simpanan Saya
              </button>

              <button
                onClick={() => handleMenuClick('member_pinjaman')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_pinjaman' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <HandCoins className="w-4 h-4 mr-3" />
                Pinjaman Saya
              </button>

              <button
                onClick={() => handleMenuClick('member_mutasi')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_mutasi' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <FileText className="w-4 h-4 mr-3" />
                Mutasi Rekening
              </button>

              <button
                onClick={() => handleMenuClick('member_pengajuan')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_pengajuan' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <FileCheck className="w-4 h-4 mr-3" />
                Pengajuan Pinjam / Tarik
              </button>

              <button
                onClick={() => handleMenuClick('member_tiket')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_tiket' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <LifeBuoy className="w-4 h-4 mr-3" />
                Tiket Bantuan (Helpdesk)
              </button>

              <button
                onClick={() => handleMenuClick('member_bukti')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_bukti' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <FileCheck className="w-4 h-4 mr-3" />
                Kirim Bukti Transfer
              </button>

              {isEnabled('ventura') && (<>
                <button
                  onClick={() => handleMenuClick('member_ventura')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_ventura' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <Award className="w-4 h-4 mr-3" />
                  Investasi Ventura Saya
                </button>

                <button
                  onClick={() => handleMenuClick('member_ventura_dokumen')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_ventura_dokumen' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <FileCheck className="w-4 h-4 mr-3" />
                  Upload Dokumen Ventura
                </button>
              </>)}

              {/* NEW INTEGRATED MODULES FOR MEMBERS */}
              {isEnabled('sewa') && (
                <button
                  onClick={() => handleMenuClick('member_sewa')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_sewa' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <Tv className="w-4 h-4 mr-3" />
                  Sewa Aset Koperasi
                </button>
              )}

              {isEnabled('ppob') && (
                <button
                  onClick={() => handleMenuClick('member_ppob')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_ppob' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 mr-3" />
                  Loket PPOB &amp; Pulsa
                </button>
              )}

              {isEnabled('digitalPayment') && (
                <button
                  onClick={() => handleMenuClick('member_digipay')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_digipay' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <Wallet className="w-4 h-4 mr-3" />
                  Virtual Account Deposit
                </button>
              )}

              {isEnabled('pembiayaan') && (
                <button
                  onClick={() => handleMenuClick('member_cicilan')}
                  className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                    activeMenu === 'member_cicilan' 
                      ? 'mc-sidebar-active' 
                      : 'mc-sidebar-item'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Kredit Cicilan Pengadaan
                </button>
              )}

              <button
                onClick={() => handleMenuClick('member_profil')}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeMenu === 'member_profil' 
                    ? 'mc-sidebar-active' 
                    : 'mc-sidebar-item'
                }`}
              >
                <User className="w-4 h-4 mr-3" />
                Ubah Profil Saya
              </button>
            </div>
          )}
        </nav>

        {/* Footer Area with theme switcher & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Theme switcher */}
          <div className="flex items-center justify-between px-3 py-2 mc-surface-2 rounded-lg text-xs">
            <span className="mc-sidebar-muted font-medium">Tampilan Mode</span>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 transition"
              title="Ganti Tema"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-xs font-medium mc-btn-danger rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </>
  );
}
