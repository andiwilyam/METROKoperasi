/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Key, Calendar, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  session: UserSession;
  onLogout: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  pendingNotificationsCount: number;
  onNavigateToNotifications?: () => void;
}

export default function Header({
  session,
  onLogout,
  setSidebarOpen,
  activeMenu,
  pendingNotificationsCount,
  onNavigateToNotifications
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIndonesianDate = (date: Date) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} WIB`;
  };

  // Capitalize and format active menu name into human-readable breadcrumb / title
  const formatTitle = (menu: string) => {
    const map: { [key: string]: string } = {
      dashboard: 'Dashboard Utama',
      anggota: 'Manajemen Data Anggota',
      simpanan_transaksi: 'Transaksi Setor & Tarik Simpanan',
      simpanan_permohonan: 'Permohonan Penarikan Simpanan',
      simpanan_jenis: 'Konfigurasi Jenis Simpanan',
      pinjaman_pengajuan: 'Daftar Pengajuan Pinjaman',
      pinjaman_angsuran: 'Pembayaran Angsuran Pinjaman',
      pinjaman_tagihan: 'Tagihan & Jatuh Tempo',
      pinjaman_konfigurasi: 'Konfigurasi Jenis Pinjaman',
      toko_kasir: 'Kasir POS (Point of Sale)',
      toko_barang: 'Katalog & Stok Barang',
      toko_supplier: 'Supplier & Pembelian',
      toko_laporan: 'Laporan Keuangan Toko',
      sewa_dashboard: 'Unit Sewa Aset & Rental',
      ppob_dashboard: 'PPOB & Pembelian Pulsa',
      digipay_dashboard: 'Digital Payment & VA',
      pembiayaan_dashboard: 'Sistem Kredit & Pembiayaan',
      laporan_labarugi: 'Laporan Laba / Rugi Koperasi',
      laporan_neraca: 'Laporan Neraca Global',
      laporan_shu: 'Pembagian Sisa Hasil Usaha (SHU)',
      laporan_aruskas: 'Laporan Arus Kas',
      laporan_pde: 'Laporan Kualitas Aktiva Produktif (PDE)',
      laporan_rasio: 'Rasio Keuangan Koperasi',
      akuntansi_coa: 'Bagan Akun (Chart of Accounts)',
      akuntansi_jurnal: 'Jurnal Umum & Entri Manual',
      akuntansi_bukubesar: 'Buku Besar (General Ledger)',
      akuntansi_neracasaldo: 'Neraca Saldo (Trial Balance)',
      akuntansi_periode: 'Periode Akuntansi & Tutup Buku',
      akuntansi_audit: 'Audit Trail Jurnal',
      subledger_piutang: 'Sub Ledger Piutang Anggota',
      ventura_analytics: 'Venture Dashboard & Analytics',
      ventura_dashboard: 'Pembiayaan Venture / Modal Investasi',
      ventura_perusahaan: 'Data Perusahaan & Mitra Bisnis',
      ventura_pengajuan: 'Pengajuan Pembiayaan & AI Scoring',
      ventura_pipeline: 'Pipeline Investasi Terpadu',
      pengumuman_admin: 'Manajemen Pengumuman & Promo',
      tiket_admin: 'Pusat Bantuan & Pengaduan',
      data_master: 'Data Master Organisasi',
      pengaturan: 'Konfigurasi & Pengaturan Sistem',
      
      // Member menus
      member_dashboard: 'Dashboard Anggota',
      member_simpanan: 'Informasi Simpanan Saya',
      member_pinjaman: 'Informasi Pinjaman Saya',
      member_mutasi: 'Mutasi Transaksi Rekening',
      member_pengajuan: 'Form Pengajuan Baru',
      member_tiket: 'Hubungi Customer Service',
      member_bukti: 'Kirim Bukti Pembayaran',
      member_profil: 'Ubah Data Profil Diri',
      member_ventura_dokumen: 'Upload Dokumen Persyaratan Ventura'
    };
    return map[menu] || 'Menu Koperasi';
  };

  const getBreadcrumbs = (menu: string) => {
    if (menu.startsWith('toko_')) return ['Unit Usaha', 'Toko'];
    if (menu.startsWith('simpanan_')) return ['Simpanan', 'Back Office'];
    if (menu.startsWith('pinjaman_')) return ['Pinjaman', 'Back Office'];
    if (menu.startsWith('laporan_') || menu.startsWith('akuntansi_') || menu === 'subledger_piutang') return ['Laporan & Akuntansi', 'Pembukuan'];
    if (menu.startsWith('member_')) return ['Portal Anggota', 'Masyarakat'];
    return ['Aplikasi', 'MetroCoop'];
  };

  const breadcrumbs = getBreadcrumbs(activeMenu);

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      
      {/* Left side: Toggler & breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          {/* Breadcrumbs */}
          <div className="flex items-center text-[11px] font-medium text-slate-400 space-x-1 mb-0.5">
            <span>{breadcrumbs[0]}</span>
            <span>/</span>
            <span>{breadcrumbs[1]}</span>
          </div>
          {/* Header Title */}
          <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-none">
            {formatTitle(activeMenu)}
          </h2>
        </div>
      </div>

      {/* Right side: Calendar date, Notification and Profile */}
      <div className="flex items-center space-x-4">
        
        {/* Current real-time date */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-purple-50/50 border border-purple-100 rounded-lg text-xs font-bold text-purple-800 font-mono animate-fadeIn">
          <Clock className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span>{formatIndonesianDate(currentTime)}</span>
        </div>

        {/* Portal Identifier Badge */}
        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
          session.role === 'anggota' 
            ? 'bg-amber-50 text-amber-600 border-amber-200/50' 
            : 'bg-blue-50 text-blue-600 border-blue-200/50'
        }`}>
          {session.role === 'admin' && '🔒 Admin'}
          {session.role === 'operator' && '⚙️ Operator'}
          {session.role === 'superadmin' && '👑 Superadmin'}
          {session.role === 'anggota' && '👤 Anggota'}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={onNavigateToNotifications}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition relative cursor-pointer"
            title="Pengaduan & Notifikasi"
          >
            <Bell className="w-4.5 h-4.5" />
            {pendingNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                {pendingNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 text-slate-700 hover:text-slate-950 transition cursor-pointer p-1 rounded-lg hover:bg-slate-50"
          >
            {/* Initial circle avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
              session.role === 'anggota' ? 'bg-amber-500' : 'bg-blue-600'
            }`}>
              {session.namaLengkap.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-tight">{session.namaLengkap}</div>
              <div className="text-[10px] text-slate-400 font-medium capitalize">{session.role}</div>
            </div>
          </button>

          {showUserDropdown && (
            <>
              {/* Overlay clickable backdrop to close dropdown */}
              <div onClick={() => setShowUserDropdown(false)} className="fixed inset-0 z-30" />

              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1.5 py-2 animate-dropdownFade">
                <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-slate-800">{session.namaLengkap}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{session.username}</div>
                </div>

                <div className="space-y-0.5 text-xs text-slate-700">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400">Portal Akses</div>
                  <div className="px-3.5 py-1 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-medium text-slate-600">Sesi Aktif Aman</span>
                  </div>

                  <div className="border-t border-slate-100 my-1.5" />

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center text-left px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
