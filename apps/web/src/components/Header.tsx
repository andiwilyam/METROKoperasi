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
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Asia/Jakarta',
    }).format(date) + ' WIB';
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
    <header className="h-16 mc-surface mc-border sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      
      {/* Left side: Toggler & breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka menu"
          className="lg:hidden mc-muted hover:mc-ink p-1.5 rounded-lg hover:mc-surface-2 cursor-pointer mc-focus"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div className="hidden sm:block">
          {/* Breadcrumbs */}
          <div className="flex items-center mc-muted text-[11px] font-medium space-x-1 mb-0.5">
            <span>{breadcrumbs[0]}</span>
            <span>/</span>
            <span>{breadcrumbs[1]}</span>
          </div>
          {/* Header Title */}
          <h2 className="text-sm font-bold mc-ink-strong tracking-tight leading-none">
            {formatTitle(activeMenu)}
          </h2>
        </div>
      </div>

      {/* Right side: Calendar date, Notification and Profile */}
      <div className="flex items-center space-x-4">
        
        {/* Current real-time date — pakai token accent */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 mc-surface-2 mc-border rounded-lg text-xs font-bold mc-muted font-mono animate-fadeIn">
          <Clock className="w-3.5 h-3.5 mc-icon-accent animate-pulse" />
          <span>{formatIndonesianDate(currentTime)}</span>
        </div>

        {/* Portal Identifier Badge */}
        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full mc-border ${
          session.role === 'anggota' 
            ? 'mc-badge-accent' 
            : 'mc-badge-ok'
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
            className="p-2 mc-muted hover:mc-ink rounded-lg hover:mc-surface-2 transition relative cursor-pointer mc-focus"
            aria-label="Notifikasi & pengaduan"
          >
            <Bell className="w-4.5 h-4.5" />
            {pendingNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[var(--mc-danger)] border-2 border-[var(--mc-surface)] rounded-full flex items-center justify-center text-[8px] font-bold">
                {pendingNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 mc-ink hover:mc-ink-strong transition cursor-pointer p-1 rounded-lg hover:mc-surface-2 mc-focus"
          >
            {/* Initial circle avatar — pakai token accent */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
              session.role === 'anggota' ? 'bg-[var(--mc-accent)]' : 'bg-[var(--mc-primary)]'
            }`}>
              {session.namaLengkap.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-tight mc-ink-strong">{session.namaLengkap}</div>
              <div className="text-[10px] mc-muted font-medium capitalize">{session.role}</div>
            </div>
          </button>

          {showUserDropdown && (
            <>
              {/* Overlay clickable backdrop to close dropdown */}
              <div onClick={() => setShowUserDropdown(false)} className="fixed inset-0 z-30" />

              <div className="absolute right-0 mt-2 w-56 mc-surface mc-border rounded-xl shadow-xl z-40 p-1.5 py-2 animate-dropdownFade">
                <div className="px-3.5 py-2 border-b mc-border mb-1">
                  <div className="text-xs font-bold mc-ink-strong">{session.namaLengkap}</div>
                  <div className="text-[10px] mc-muted font-mono mt-0.5">{session.username}</div>
                </div>

                <div className="space-y-0.5 text-xs mc-muted">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold mc-muted">Portal Akses</div>
                  <div className="px-3.5 py-1 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--mc-success)]" />
                    <span className="font-medium mc-ink">Sesi Aktif Aman</span>
                  </div>

                  <div className="border-t mc-border my-1.5" />

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center text-left px-3.5 py-2 text-xs font-medium text-[var(--mc-danger)] hover:mc-danger-bg rounded-lg transition cursor-pointer mc-focus"
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