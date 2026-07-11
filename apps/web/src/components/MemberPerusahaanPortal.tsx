import React, { useState } from 'react';
import { Award, FileText, Building2, TrendingUp, LifeBuoy, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import MemberPerusahaanDashboard from './member/MemberPerusahaanDashboard';
import MemberVentura from './member/MemberVentura';
import MemberUploadDokumen from './member/MemberUploadDokumen';

export default function MemberPerusahaanPortal() {
  const session = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const gl = useDataStore();
  const [activeMenu, setActiveMenu] = useState('perusahaan_dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menus = [
    { id: 'perusahaan_dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'member_ventura', label: 'Pengajuan Pembiayaan', icon: FileText },
    { id: 'member_ventura_dokumen', label: 'Upload Dokumen', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800 z-50 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-sm font-bold text-white">MetroMitra</div>
              <div className="text-[9px] text-slate-500">Portal Perusahaan</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menus.map((m) => (
            <button key={m.id} onClick={() => { setActiveMenu(m.id); setSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeMenu === m.id ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <m.icon className="w-4 h-4 mr-3" />
              {m.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="px-3 py-2 text-[10px] text-slate-500 truncate">{session?.namaLengkap}</div>
          <button onClick={logout} className="w-full flex items-center px-3 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-100 rounded"><Menu className="w-5 h-5" /></button>
          <span className="text-xs font-bold text-slate-600">Portal Perusahaan</span>
          <div />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeMenu === 'perusahaan_dashboard' && <MemberPerusahaanDashboard session={session} />}
          {activeMenu === 'member_ventura' && (
            <MemberVentura investments={gl.investments} onAddInvestment={gl.addInvestment} session={session} />
          )}
          {activeMenu === 'member_ventura_dokumen' && (
            <MemberUploadDokumen pengajuanList={gl.pengajuanList} session={session} uploadDokumenPengajuan={gl.uploadDokumenPengajuan} />
          )}
          <footer className="pt-6 mt-8 border-t border-slate-200 text-center">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">METRO KOMUNIKA ASIA @2026</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
