/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, Users, UserPlus, Briefcase, Trash2, Edit, Plus, Check, 
  X, AlertCircle, Search, Filter, Coins, ShieldAlert, CreditCard, 
  Calendar, Key, MapPin, Phone, Settings2, Info
} from 'lucide-react';
import { Pengurus, Karyawan, AsetBarang, SumberBayar, UserSession, Anggota, UserRole } from '../../types';

interface AdminDataMasterProps {
  pengurusList: Pengurus[];
  karyawanList: Karyawan[];
  asetList: AsetBarang[];
  sumberBayarList: SumberBayar[];
  users: UserSession[];
  members: Anggota[];
  onAddUser?: (data: any) => Promise<any>;
  onUpdateUser?: (id: string, data: any) => Promise<void>;
  onDeleteUser?: (id: string) => Promise<void>;
  onAddPengurus?: (data: any) => Promise<any>;
  onUpdatePengurus?: (id: string, data: any) => Promise<void>;
  onDeletePengurus?: (id: string) => Promise<void>;
  onAddKaryawan?: (data: any) => Promise<any>;
  onUpdateKaryawan?: (id: string, data: any) => Promise<void>;
  onDeleteKaryawan?: (id: string) => Promise<void>;
  onAddAset?: (data: any) => Promise<any>;
  onUpdateAset?: (id: string, data: any) => Promise<void>;
  onDeleteAset?: (id: string) => Promise<void>;
  onAddSumber?: (data: any) => Promise<any>;
  onUpdateSumber?: (id: string, data: any) => Promise<void>;
  onDeleteSumber?: (id: string) => Promise<void>;
}

type ActiveTab = 'pengurus' | 'karyawan' | 'aset' | 'sumber_bayar' | 'user_management';

export default function AdminDataMaster({
  pengurusList,
  karyawanList,
  asetList,
  sumberBayarList,
  users,
  members,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddPengurus,
  onUpdatePengurus,
  onDeletePengurus,
  onAddKaryawan,
  onUpdateKaryawan,
  onDeleteKaryawan,
  onAddAset,
  onUpdateAset,
  onDeleteAset,
  onAddSumber,
  onUpdateSumber,
  onDeleteSumber
}: AdminDataMasterProps) {
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('pengurus');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Success / Error Feedback State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Field States
  // 1. Pengurus Form
  const [pengurusForm, setPengurusForm] = useState<Omit<Pengurus, 'id'>>({
    nik: '',
    nama: '',
    jabatan: 'Anggota Pengurus',
    periodeMulai: '2024-01-01',
    periodeSelesai: '2027-12-31',
    noSk: '',
    noHp: '',
    status: 'aktif'
  });

  // 2. Karyawan Form
  const [karyawanForm, setKaryawanForm] = useState<Omit<Karyawan, 'id'>>({
    nik: '',
    nama: '',
    jabatan: '',
    departemen: '',
    noHp: '',
    gajiPokok: 4500000,
    status: 'tetap',
    statusAktif: true
  });

  // 3. Aset Form
  const [asetForm, setAsetForm] = useState<Omit<AsetBarang, 'id' | 'kode'>>({
    nama: '',
    kategori: 'Inventaris',
    hargaPerolehan: 0,
    nilaiResidu: 0,
    masaManfaat: 5,
    kondisi: 'Baik',
    lokasi: ''
  });

  // 4. Sumber Bayar Form
  const [sumberForm, setSumberForm] = useState<Omit<SumberBayar, 'id'>>({
    nama: '',
    tipe: 'Tunai',
    noRekening: '',
    akunCoa: ''
  });

  // 5. User Form
  const [userForm, setUserForm] = useState({
    username: '',
    namaLengkap: '',
    role: 'operator' as UserRole,
    nik: '',
    memberId: '',
    isActive: true,
    password: ''
  });

  // Formatting helpers
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Reset form states
  const resetForms = () => {
    setPengurusForm({
      nik: '',
      nama: '',
      jabatan: 'Anggota Pengurus',
      periodeMulai: '2024-01-01',
      periodeSelesai: '2027-12-31',
      noSk: '',
      noHp: '',
      status: 'aktif'
    });
    setKaryawanForm({
      nik: '',
      nama: '',
      jabatan: '',
      departemen: '',
      noHp: '',
      gajiPokok: 4500000,
      status: 'tetap',
      statusAktif: true
    });
    setAsetForm({
      nama: '',
      kategori: 'Inventaris',
      hargaPerolehan: 0,
      nilaiResidu: 0,
      masaManfaat: 5,
      kondisi: 'Baik',
      lokasi: ''
    });
    setSumberForm({
      nama: '',
      tipe: 'Tunai',
      noRekening: '',
      akunCoa: ''
    });
    setUserForm({
      username: '',
      namaLengkap: '',
      role: 'operator',
      nik: '',
      memberId: '',
      isActive: true,
      password: ''
    });
    setSelectedId(null);
  };

  // Opening Modal for Edit
  const handleOpenEdit = (id: string) => {
    setSelectedId(id);
    if (activeTab === 'pengurus') {
      const found = pengurusList.find(p => p.id === id);
      if (found) {
        setPengurusForm({
          nik: found.nik,
          nama: found.nama,
          jabatan: found.jabatan,
          periodeMulai: found.periodeMulai,
          periodeSelesai: found.periodeSelesai,
          noSk: found.noSk,
          noHp: found.noHp,
          status: found.status
        });
        setShowEditModal(true);
      }
    } else if (activeTab === 'karyawan') {
      const found = karyawanList.find(k => k.id === id);
      if (found) {
        setKaryawanForm({
          nik: found.nik,
          nama: found.nama,
          jabatan: found.jabatan,
          departemen: found.departemen,
          noHp: found.noHp,
          gajiPokok: found.gajiPokok,
          status: found.status,
          statusAktif: found.statusAktif
        });
        setShowEditModal(true);
      }
    } else if (activeTab === 'aset') {
      const found = asetList.find(a => a.id === id);
      if (found) {
        setAsetForm({
          nama: found.nama,
          kategori: found.kategori,
          hargaPerolehan: found.hargaPerolehan,
          nilaiResidu: found.nilaiResidu,
          masaManfaat: found.masaManfaat,
          kondisi: found.kondisi,
          lokasi: found.lokasi
        });
        setShowEditModal(true);
      }
    } else if (activeTab === 'sumber_bayar') {
      const found = sumberBayarList.find(s => s.id === id);
      if (found) {
        setSumberForm({
          nama: found.nama,
          tipe: found.tipe,
          noRekening: found.noRekening || '',
          akunCoa: found.akunCoa
        });
        setShowEditModal(true);
      }
    } else if (activeTab === 'user_management') {
      const found = users.find(u => u.id === id);
      if (found) {
        setUserForm({
          username: found.username,
          namaLengkap: found.namaLengkap,
          role: found.role,
          nik: found.nik || '',
          memberId: found.memberId || '',
          isActive: found.isActive,
          password: found.password || ''
        });
        setShowEditModal(true);
      }
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm CRUD Actions
  // 1. CREATE ACTION
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'pengurus') {
      if (!pengurusForm.nik || !pengurusForm.nama || !pengurusForm.noSk) {
        triggerToast('Harap lengkapi field wajib (NIK, Nama, No SK)!', 'error');
        return;
      }
      try {
        await onAddPengurus?.(pengurusForm);
        triggerToast(`Pengurus "${pengurusForm.nama}" berhasil ditambahkan!`);
      } catch (err: any) { triggerToast(err.message || 'Gagal menambah pengurus', 'error'); return; }
    } else if (activeTab === 'karyawan') {
      if (!karyawanForm.nik || !karyawanForm.nama || !karyawanForm.jabatan) {
        triggerToast('Harap lengkapi field wajib (NIK, Nama, Jabatan)!', 'error');
        return;
      }
      try {
        await onAddKaryawan?.(karyawanForm);
        triggerToast(`Karyawan "${karyawanForm.nama}" berhasil ditambahkan!`);
      } catch (err: any) { triggerToast(err.message || 'Gagal menambah karyawan', 'error'); return; }
    } else if (activeTab === 'aset') {
      if (!asetForm.nama || asetForm.hargaPerolehan <= 0) {
        triggerToast('Nama aset wajib diisi & nilai perolehan harus > 0!', 'error');
        return;
      }
      try {
        await onAddAset?.(asetForm);
        triggerToast(`Aset "${asetForm.nama}" berhasil didaftarkan!`);
      } catch (err: any) { triggerToast(err.message || 'Gagal menambah aset', 'error'); return; }
    } else if (activeTab === 'sumber_bayar') {
      if (!sumberForm.nama || !sumberForm.akunCoa) {
        triggerToast('Nama metode & Kode COA Akuntansi wajib diisi!', 'error');
        return;
      }
      try {
        await onAddSumber?.(sumberForm);
        triggerToast(`Metode Pembayaran "${sumberForm.nama}" berhasil didaftarkan!`);
      } catch (err: any) { triggerToast(err.message || 'Gagal menambah metode bayar', 'error'); return; }
    } else if (activeTab === 'user_management') {
      if (!userForm.username || !userForm.namaLengkap || !userForm.password) {
        triggerToast('Username, nama lengkap, dan password wajib diisi!', 'error');
        return;
      }
      const isUsernameExists = users.some(u => u.username.toLowerCase() === userForm.username.toLowerCase());
      if (isUsernameExists) {
        triggerToast('Username ini sudah terdaftar!', 'error');
        return;
      }
      if (userForm.role === 'anggota' && !userForm.memberId) {
        triggerToast('Akun anggota wajib ditautkan ke data anggota!', 'error');
        return;
      }
      if (onAddUser) {
        try {
          await onAddUser({
            username: userForm.username,
            namaLengkap: userForm.namaLengkap,
            role: userForm.role,
            nik: userForm.nik || undefined,
            memberId: userForm.memberId || undefined,
            isActive: userForm.isActive,
            password: userForm.password
          });
          triggerToast(`User account "${userForm.username}" berhasil dibuat!`);
        } catch (err: any) {
          triggerToast(err.message || 'Gagal membuat user account', 'error');
          return;
        }
      }
    }
    setShowCreateModal(false);
    resetForms();
  };

  // 2. UPDATE ACTION
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    if (activeTab === 'pengurus') {
      try { await onUpdatePengurus?.(selectedId, pengurusForm); triggerToast('Data pengurus berhasil diperbarui!'); }
      catch (err: any) { triggerToast(err.message || 'Gagal update pengurus', 'error'); return; }
    } else if (activeTab === 'karyawan') {
      try { await onUpdateKaryawan?.(selectedId, karyawanForm); triggerToast('Data karyawan berhasil diperbarui!'); }
      catch (err: any) { triggerToast(err.message || 'Gagal update karyawan', 'error'); return; }
    } else if (activeTab === 'aset') {
      try { await onUpdateAset?.(selectedId, asetForm); triggerToast('Data inventaris aset berhasil diperbarui!'); }
      catch (err: any) { triggerToast(err.message || 'Gagal update aset', 'error'); return; }
    } else if (activeTab === 'sumber_bayar') {
      try { await onUpdateSumber?.(selectedId, sumberForm); triggerToast('Metode pembayaran berhasil diperbarui!'); }
      catch (err: any) { triggerToast(err.message || 'Gagal update metode bayar', 'error'); return; }
    } else if (activeTab === 'user_management') {
      if (onUpdateUser) {
        try {
          await onUpdateUser(selectedId, {
            username: userForm.username,
            namaLengkap: userForm.namaLengkap,
            role: userForm.role,
            nik: userForm.nik || undefined,
            memberId: userForm.memberId || undefined,
            isActive: userForm.isActive,
            password: userForm.password || ''
          });
          triggerToast('Data user account berhasil diperbarui!');
        } catch (err: any) {
          triggerToast(err.message || 'Gagal memperbarui user account', 'error');
          return;
        }
      }
    }
    setShowEditModal(false);
    resetForms();
  };

  // 3. DELETE ACTION
  const handleDeleteSubmit = async () => {
    if (!selectedId) return;

    if (activeTab === 'pengurus') {
      const found = pengurusList.find(p => p.id === selectedId);
      try { await onDeletePengurus?.(selectedId); triggerToast(`Data pengurus "${found?.nama || ''}" telah dihapus.`); }
      catch (err: any) { triggerToast(err.message || 'Gagal hapus pengurus', 'error'); setShowDeleteConfirm(false); return; }
    } else if (activeTab === 'karyawan') {
      const found = karyawanList.find(k => k.id === selectedId);
      try { await onDeleteKaryawan?.(selectedId); triggerToast(`Data karyawan "${found?.nama || ''}" telah dihapus.`); }
      catch (err: any) { triggerToast(err.message || 'Gagal hapus karyawan', 'error'); setShowDeleteConfirm(false); return; }
    } else if (activeTab === 'aset') {
      const found = asetList.find(a => a.id === selectedId);
      try { await onDeleteAset?.(selectedId); triggerToast(`Aset "${found?.nama || ''}" telah dihapus dari inventaris.`); }
      catch (err: any) { triggerToast(err.message || 'Gagal hapus aset', 'error'); setShowDeleteConfirm(false); return; }
    } else if (activeTab === 'sumber_bayar') {
      const found = sumberBayarList.find(s => s.id === selectedId);
      try { await onDeleteSumber?.(selectedId); triggerToast(`Metode pembayaran "${found?.nama || ''}" telah dihapus.`); }
      catch (err: any) { triggerToast(err.message || 'Gagal hapus metode bayar', 'error'); setShowDeleteConfirm(false); return; }
    } else if (activeTab === 'user_management') {
      const found = users.find(u => u.id === selectedId);
      if (onDeleteUser) {
        try {
          await onDeleteUser(selectedId);
          triggerToast(`Akses user "${found?.username || ''}" telah dihapus dari sistem.`);
        } catch (err: any) {
          triggerToast(err.message || 'Gagal menghapus user', 'error');
          setShowDeleteConfirm(false);
          return;
        }
      }
    }
    setShowDeleteConfirm(false);
    resetForms();
  };

  // Search & Filter Operations
  const getFilteredData = () => {
    if (activeTab === 'pengurus') {
      return pengurusList.filter(p => {
        const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.nik.includes(searchQuery) || 
                              p.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.noSk.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true : p.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'karyawan') {
      return karyawanList.filter(k => {
        const matchesSearch = k.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              k.nik.includes(searchQuery) || 
                              k.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              k.departemen.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true : k.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'aset') {
      return asetList.filter(a => {
        const matchesSearch = a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              a.kode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              a.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              a.kategori.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true : a.kondisi === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'sumber_bayar') {
      return sumberBayarList.filter(s => {
        const matchesSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.tipe.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.akunCoa.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' ? true : s.tipe === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'user_management') {
      return users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (u.nik && u.nik.includes(searchQuery));
        const matchesStatus = filterStatus === 'all' ? true : 
                              filterStatus === 'aktif' ? u.isActive === true : 
                              filterStatus === 'nonaktif' ? u.isActive === false : true;
        return matchesSearch && matchesStatus;
      });
    }
    return [];
  };

  const filteredItems = getFilteredData();

  // Metrics for Cards
  const getMetrics = () => {
    if (activeTab === 'pengurus') {
      const activeCount = pengurusList.filter(p => p.status === 'aktif').length;
      return [
        { label: 'Total Pengurus & Pengawas', value: pengurusList.length, color: 'text-blue-600 bg-blue-50' },
        { label: 'Pengurus Status Aktif', value: activeCount, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Pengurus Nonaktif', value: pengurusList.length - activeCount, color: 'text-slate-500 bg-slate-50' }
      ];
    } else if (activeTab === 'karyawan') {
      const totalSalary = karyawanList.reduce((sum, k) => sum + k.gajiPokok, 0);
      return [
        { label: 'Total Karyawan KSP', value: karyawanList.length, color: 'text-purple-600 bg-purple-50' },
        { label: 'Total Gaji Bulanan', value: formatIDR(totalSalary), color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Karyawan Tetap', value: karyawanList.filter(k => k.status === 'tetap').length, color: 'text-blue-600 bg-blue-50' }
      ];
    } else if (activeTab === 'aset') {
      const totalValue = asetList.reduce((sum, a) => sum + a.hargaPerolehan, 0);
      const baikCount = asetList.filter(a => a.kondisi === 'Baik').length;
      return [
        { label: 'Total Nilai Aset KSP', value: formatIDR(totalValue), color: 'text-blue-600 bg-blue-50' },
        { label: 'Aset Kondisi Baik', value: baikCount, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Aset Rusak/Maintenance', value: asetList.length - baikCount, color: 'text-amber-600 bg-amber-50' }
      ];
    } else if (activeTab === 'sumber_bayar') {
      return [
        { label: 'Total Channel Pembayaran', value: sumberBayarList.length, color: 'text-blue-600 bg-blue-50' },
        { label: 'Metode Non-Tunai / Digital', value: sumberBayarList.filter(s => s.tipe !== 'Tunai').length, color: 'text-purple-600 bg-purple-50' },
        { label: 'Metode Kas Tunai', value: sumberBayarList.filter(s => s.tipe === 'Tunai').length, color: 'text-emerald-600 bg-emerald-50' }
      ];
    } else if (activeTab === 'user_management') {
      const activeCount = users.filter(u => u.isActive).length;
      const adminCount = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
      const staffCount = users.filter(u => u.role === 'operator').length;
      return [
        { label: 'Total Pengguna Terdaftar', value: users.length, color: 'text-blue-600 bg-blue-50' },
        { label: 'Akses Pengguna Aktif', value: activeCount, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Staf Admin & Operator', value: `${adminCount} Admin / ${staffCount} Operator`, color: 'text-purple-600 bg-purple-50' }
      ];
    }
    return [];
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slideIn ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toastMessage.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <div className="text-xs font-semibold">{toastMessage.text}</div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              Sistem Master Data Terpadu
            </span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Data Master &amp; Struktur Organisasi Koperasi
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Modul pengawasan legalitas pengurus, kontrak staff, pemeliharaan aset prasarana kantor, serta channel pembiayaan resmi.
          </p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => { setActiveTab('pengurus'); setSearchQuery(''); setFilterStatus('all'); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pengurus' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Pengurus &amp; Pengawas ({pengurusList.length})
        </button>

        <button
          onClick={() => { setActiveTab('karyawan'); setSearchQuery(''); setFilterStatus('all'); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'karyawan' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Karyawan &amp; Staff Kasir ({karyawanList.length})
        </button>

        <button
          onClick={() => { setActiveTab('aset'); setSearchQuery(''); setFilterStatus('all'); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'aset' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Inventaris Aset Sarpras ({asetList.length})
        </button>

        <button
          onClick={() => { setActiveTab('sumber_bayar'); setSearchQuery(''); setFilterStatus('all'); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sumber_bayar' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Channel Pembayaran ({sumberBayarList.length})
        </button>

        <button
          onClick={() => { setActiveTab('user_management'); setSearchQuery(''); setFilterStatus('all'); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'user_management' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          User Management (5) ({users.length})
        </button>
      </div>

      {/* METRIC CARD PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-center space-y-1.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">{m.label}</span>
            <div className="text-xl font-black text-slate-900">{m.value}</div>
            <div className="w-max px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 border border-slate-100 text-slate-500">
              MetroMitra Core Database
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH, FILTER AND ACTION BUTTON */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari master data ${activeTab === 'pengurus' ? 'pengurus...' : activeTab === 'karyawan' ? 'karyawan...' : activeTab === 'aset' ? 'aset...' : activeTab === 'sumber_bayar' ? 'metode bayar...' : 'username/nama...'}`}
            className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter dropdown and Create button */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'user_management' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border bg-slate-50 p-1.5 rounded-lg text-xs text-slate-700 outline-none"
              >
                <option value="all">Semua Akun</option>
                <option value="aktif">Status Aktif</option>
                <option value="nonaktif">Status Nonaktif</option>
              </select>
            </div>
          )}

          {activeTab === 'pengurus' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border bg-slate-50 p-1.5 rounded-lg text-xs text-slate-700 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          )}

          {activeTab === 'karyawan' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border bg-slate-50 p-1.5 rounded-lg text-xs text-slate-700 outline-none"
              >
                <option value="all">Semua Kontrak</option>
                <option value="tetap">Karyawan Tetap</option>
                <option value="kontrak">Karyawan Kontrak</option>
                <option value="magang">Magang</option>
              </select>
            </div>
          )}

          {activeTab === 'aset' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border bg-slate-50 p-1.5 rounded-lg text-xs text-slate-700 outline-none"
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Kondisi Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
          )}

          {activeTab === 'sumber_bayar' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border bg-slate-50 p-1.5 rounded-lg text-xs text-slate-700 outline-none"
              >
                <option value="all">Semua Tipe Channel</option>
                <option value="Tunai">Tunai (Cash)</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          )}

          <button
            onClick={() => { resetForms(); setShowCreateModal(true); }}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data Baru
          </button>
        </div>
      </div>

      {/* DIRECTORY LIST - TABLES */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Tab 1: Pengurus Table */}
        {activeTab === 'pengurus' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Identitas &amp; NIK</th>
                  <th className="p-4">Jabatan Struktural</th>
                  <th className="p-4">Masa Bhakti (Periode)</th>
                  <th className="p-4">SK Pengangkatan</th>
                  <th className="p-4">Kontak Telepon</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((p) => {
                  const peng = p as Pengurus;
                  return (
                    <tr key={peng.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{peng.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NIK: {peng.nik}</div>
                      </td>
                      <td className="p-4 text-slate-700 font-semibold">{peng.jabatan}</td>
                      <td className="p-4 text-slate-500 font-mono">{peng.periodeMulai} s/d {peng.periodeSelesai}</td>
                      <td className="p-4 text-slate-500 font-mono">{peng.noSk}</td>
                      <td className="p-4 text-slate-600 font-mono">{peng.noHp}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          peng.status === 'aktif' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-50 text-slate-400 border-slate-150'
                        }`}>
                          {peng.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(peng.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-md transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(peng.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-md transition cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">Tidak ada data pengurus ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Karyawan Table */}
        {activeTab === 'karyawan' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Identitas Karyawan</th>
                  <th className="p-4">Jabatan &amp; Departemen</th>
                  <th className="p-4">Nomor HP</th>
                  <th className="p-4 text-right">Gaji Pokok Utama</th>
                  <th className="p-4 text-center">Tipe Kontrak</th>
                  <th className="p-4 text-center">Aktivitas</th>
                  <th className="p-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((k) => {
                  const kar = k as Karyawan;
                  return (
                    <tr key={kar.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{kar.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NIK: {kar.nik}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{kar.jabatan}</div>
                        <div className="text-[10px] text-slate-400">{kar.departemen}</div>
                      </td>
                      <td className="p-4 text-slate-600 font-mono">{kar.noHp}</td>
                      <td className="p-4 text-right font-semibold text-slate-900 font-mono">{formatIDR(kar.gajiPokok)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          kar.status === 'tetap' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : kar.status === 'kontrak'
                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {kar.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          kar.statusAktif 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {kar.statusAktif ? 'Aktif' : 'Cuti/Resign'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(kar.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-md transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(kar.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-md transition cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">Tidak ada data karyawan ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Aset Table */}
        {activeTab === 'aset' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Kode &amp; Nama Aset</th>
                  <th className="p-4">Kategori Aset</th>
                  <th className="p-4 text-right">Nilai Perolehan</th>
                  <th className="p-4 text-right">Nilai Residu</th>
                  <th className="p-4 text-center">Masa Manfaat</th>
                  <th className="p-4">Lokasi Fisik</th>
                  <th className="p-4 text-center">Kondisi Fisik</th>
                  <th className="p-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((a) => {
                  const ast = a as AsetBarang;
                  return (
                    <tr key={ast.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{ast.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold">KODE: {ast.kode}</div>
                      </td>
                      <td className="p-4 text-slate-600">{ast.kategori}</td>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono">{formatIDR(ast.hargaPerolehan)}</td>
                      <td className="p-4 text-right font-medium text-slate-500 font-mono">{formatIDR(ast.nilaiResidu)}</td>
                      <td className="p-4 text-center font-mono">{ast.masaManfaat} tahun</td>
                      <td className="p-4 text-slate-600">{ast.lokasi}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          ast.kondisi === 'Baik' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : ast.kondisi === 'Rusak Ringan'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {ast.kondisi}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(ast.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-md transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(ast.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-md transition cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 italic">Tidak ada data aset terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Sumber Bayar Table */}
        {activeTab === 'sumber_bayar' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Nama Channel Kas / Bank</th>
                  <th className="p-4">Tipe Transaksi</th>
                  <th className="p-4">Nomor Rekening / Merchant ID</th>
                  <th className="p-4">Kode COA Akuntansi (GL)</th>
                  <th className="p-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((s) => {
                  const sum = s as SumberBayar;
                  return (
                    <tr key={sum.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{sum.nama}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-slate-50 text-slate-700">
                          {sum.tipe}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-mono">{sum.noRekening || '- (Kas Tunai)'}</td>
                      <td className="p-4 text-slate-700 font-mono font-bold text-blue-600">{sum.akunCoa}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(sum.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-md transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(sum.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-md transition cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">Tidak ada metode pembayaran terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: User Management Table */}
        {activeTab === 'user_management' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Username &amp; Akun</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Role Akses</th>
                  <th className="p-4">Link NIK Anggota</th>
                  <th className="p-4 font-mono">Password</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((u) => {
                  const userObj = u as UserSession;
                  return (
                    <tr key={userObj.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-extrabold font-sans">
                          {userObj.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{userObj.username}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {userObj.id}</div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{userObj.namaLengkap}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          userObj.role === 'superadmin' 
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : userObj.role === 'admin'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : userObj.role === 'operator'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {userObj.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono">
                        {userObj.nik ? (
                          <div className="space-y-0.5">
                            <div>NIK: {userObj.nik}</div>
                            {userObj.memberId && <div className="text-[10px] text-slate-400">ID Member: {userObj.memberId}</div>}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">Sistem / Staff (No Link)</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 font-mono font-semibold">
                        {userObj.password ? (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{userObj.password}</span>
                        ) : (
                          <span className="text-slate-400">admin123 (Default)</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide inline-block ${
                          userObj.isActive
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-400 line-through'
                        }`}>
                          {userObj.isActive ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(userObj.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-md transition cursor-pointer"
                            title="Edit Akses User"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(userObj.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-md transition cursor-pointer"
                            title="Hapus User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">Tidak ada user account terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* CREATE DATA MASTER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-400 font-extrabold block">Database Organisasi</span>
                <h3 className="font-extrabold text-base">
                  Tambah {activeTab === 'pengurus' ? 'Pengurus Baru' : activeTab === 'karyawan' ? 'Karyawan Baru' : activeTab === 'aset' ? 'Aset Kantor Baru' : activeTab === 'sumber_bayar' ? 'Channel Bayar Baru' : 'Akses User Baru'}
                </h3>
              </div>
              <button 
                onClick={() => { setShowCreateModal(false); resetForms(); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Form 1: Pengurus */}
              {activeTab === 'pengurus' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nomor Induk Kependudukan (NIK) *</label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={pengurusForm.nik}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, nik: e.target.value.replace(/\D/g, '') })}
                      placeholder="Masukkan 16 digit NIK"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap &amp; Gelar *</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.nama}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                      placeholder="Contoh: Dr. Hermawan, M.B.A."
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Jabatan Struktural</label>
                    <select
                      value={pengurusForm.jabatan}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, jabatan: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Ketua Pengurus">Ketua Pengurus</option>
                      <option value="Wakil Ketua Pengurus">Wakil Ketua Pengurus</option>
                      <option value="Sekretaris">Sekretaris Koperasi</option>
                      <option value="Bendahara Koperasi">Bendahara Koperasi</option>
                      <option value="Ketua Pengawas">Ketua Pengawas</option>
                      <option value="Anggota Pengawas">Anggota Pengawas</option>
                      <option value="Komite Penasihat">Komite Penasihat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor SK Pengangkatan *</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.noSk}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, noSk: e.target.value })}
                      placeholder="No. SK-XXX/M-COOP/..."
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Periode Masa Bhakti Mulai</label>
                    <input
                      type="date"
                      required
                      value={pengurusForm.periodeMulai}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, periodeMulai: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Masa Bhakti Selesai</label>
                    <input
                      type="date"
                      required
                      value={pengurusForm.periodeSelesai}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, periodeSelesai: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor HP/WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.noHp}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, noHp: e.target.value })}
                      placeholder="0812XXXXXXXX"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Keanggotaan</label>
                    <select
                      value={pengurusForm.status}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, status: e.target.value as 'aktif' | 'nonaktif' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="aktif">Aktif Menjabat</option>
                      <option value="nonaktif">Demisioner/Nonaktif</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 2: Karyawan */}
              {activeTab === 'karyawan' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">NIK Kependudukan *</label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={karyawanForm.nik}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, nik: e.target.value.replace(/\D/g, '') })}
                      placeholder="16 digit NIK"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap Staff *</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.nama}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, nama: e.target.value })}
                      placeholder="Nama lengkap sesuai KTP"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Jabatan Fungsional</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.jabatan}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, jabatan: e.target.value })}
                      placeholder="Contoh: Kasir Utama, Staf IT"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Departemen / Divisi Unit</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.departemen}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, departemen: e.target.value })}
                      placeholder="Contoh: Keuangan, Toko Retail"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">No HP/WhatsApp Staff</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.noHp}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, noHp: e.target.value })}
                      placeholder="08XXXXXXXXXX"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Gaji Pokok Karyawan (Rp) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={karyawanForm.gajiPokok}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, gajiPokok: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tipe Kontrak Kerja</label>
                    <select
                      value={karyawanForm.status}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, status: e.target.value as 'tetap' | 'kontrak' | 'magang' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="tetap">Karyawan Tetap (KSP)</option>
                      <option value="kontrak">Karyawan Kontrak</option>
                      <option value="magang">Magang / Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Aktivitas Kerja</label>
                    <select
                      value={karyawanForm.statusAktif ? 'true' : 'false'}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, statusAktif: e.target.value === 'true' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="true">Aktif Bekerja</option>
                      <option value="false">Resign / Cuti Panjang</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 3: Aset */}
              {activeTab === 'aset' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Aset Sarana Prasarana *</label>
                    <input
                      type="text"
                      required
                      value={asetForm.nama}
                      onChange={(e) => setAsetForm({ ...asetForm, nama: e.target.value })}
                      placeholder="Contoh: Komputer Server Utama, Meja Pengurus"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Kategori Klasifikasi</label>
                    <select
                      value={asetForm.kategori}
                      onChange={(e) => setAsetForm({ ...asetForm, kategori: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Tanah">Tanah</option>
                      <option value="Bangunan">Bangunan</option>
                      <option value="Kendaraan">Kendaraan</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Perabotan">Perabotan</option>
                      <option value="Inventaris">Inventaris Kantor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Masa Manfaat (Tahun) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={asetForm.masaManfaat}
                      onChange={(e) => setAsetForm({ ...asetForm, masaManfaat: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Harga Perolehan Awal (Rp) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={asetForm.hargaPerolehan}
                      onChange={(e) => setAsetForm({ ...asetForm, hargaPerolehan: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Taksiran Nilai Residu (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      value={asetForm.nilaiResidu}
                      onChange={(e) => setAsetForm({ ...asetForm, nilaiResidu: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Lokasi Penempatan Fisik *</label>
                    <input
                      type="text"
                      required
                      value={asetForm.lokasi}
                      onChange={(e) => setAsetForm({ ...asetForm, lokasi: e.target.value })}
                      placeholder="Contoh: Kantor Cabang, Ruang Administrasi"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Kondisi Fisik Saat Ini</label>
                    <select
                      value={asetForm.kondisi}
                      onChange={(e) => setAsetForm({ ...asetForm, kondisi: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Baik">Kondisi Baik &amp; Layak</option>
                      <option value="Rusak Ringan">Rusak Ringan (Butuh Servis)</option>
                      <option value="Rusak Berat">Rusak Berat (Tidak Layak)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 4: Sumber Bayar */}
              {activeTab === 'sumber_bayar' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Metode Channel Kas / Bank *</label>
                    <input
                      type="text"
                      required
                      value={sumberForm.nama}
                      onChange={(e) => setSumberForm({ ...sumberForm, nama: e.target.value })}
                      placeholder="Contoh: Bank BNI Kantor Cabang, QRIS Gopay"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tipe Transaksi Finansial</label>
                    <select
                      value={sumberForm.tipe}
                      onChange={(e) => setSumberForm({ ...sumberForm, tipe: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Tunai">Tunai (Cash)</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet Merchant</option>
                      <option value="QRIS">QRIS Dinamis / Statis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor Rekening / Merchant ID</label>
                    <input
                      type="text"
                      value={sumberForm.noRekening}
                      onChange={(e) => setSumberForm({ ...sumberForm, noRekening: e.target.value })}
                      placeholder="Contoh: 1240-09-082302"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Kode Akun COA Akuntansi (GL) *</label>
                    <input
                      type="text"
                      required
                      value={sumberForm.akunCoa}
                      onChange={(e) => setSumberForm({ ...sumberForm, akunCoa: e.target.value })}
                      placeholder="Contoh: 1101 untuk Kas, 1102 untuk Bank"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Form 5: User Management */}
              {activeTab === 'user_management' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Username / Akun Login *</label>
                    <input
                      type="text"
                      required
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value.trim() })}
                      placeholder="Contoh: admin_toko, budi12"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Password Baru *</label>
                    <input
                      type="text"
                      required
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap Pengguna *</label>
                    <input
                      type="text"
                      required
                      value={userForm.namaLengkap}
                      onChange={(e) => setUserForm({ ...userForm, namaLengkap: e.target.value })}
                      placeholder="Contoh: Budi Susanto"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Role Akses Aplikasi *</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold text-blue-700"
                    >
                      <option value="superadmin">SUPERADMIN</option>
                      <option value="admin">ADMIN (Koperasi)</option>
                      <option value="operator">OPERATOR / STAFF</option>
                      <option value="anggota">ANGGOTA (Portal Anggota)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Akun *</label>
                    <select
                      value={userForm.isActive ? 'aktif' : 'nonaktif'}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'aktif' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold text-emerald-700"
                    >
                      <option value="aktif">Aktif (Diberi Izin Login)</option>
                      <option value="nonaktif">Nonaktif (Blokir Akses)</option>
                    </select>
                  </div>
                  {userForm.role === 'anggota' && (
                    <div className="col-span-2 bg-blue-50/50 border border-blue-100 p-3 rounded-lg space-y-2">
                      <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        Integrasi Data Keanggotaan (Portal Anggota)
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Link NIK Anggota Terdaftar</label>
                          <select
                            value={userForm.nik}
                            onChange={(e) => {
                              const foundMember = members.find(m => m.nik === e.target.value);
                              setUserForm({
                                ...userForm,
                                nik: e.target.value,
                                memberId: foundMember ? foundMember.id : '',
                                namaLengkap: foundMember ? foundMember.nama : userForm.namaLengkap
                              });
                            }}
                            className="w-full border p-1.5 bg-white rounded-lg text-slate-800 font-mono text-[11px]"
                          >
                            <option value="">-- Pilih NIK Anggota --</option>
                            {members.map(m => (
                              <option key={m.id} value={m.nik}>{m.nik} - {m.nama}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">ID Member Linked</label>
                          <input
                            type="text"
                            disabled
                            value={userForm.memberId}
                            placeholder="Auto linked"
                            className="w-full border p-1.5 bg-slate-100 rounded-lg text-slate-500 font-mono text-[11px] cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForms(); }}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow cursor-pointer"
                >
                  Simpan Baru
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT DATA MASTER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-400 font-extrabold block">Pembaruan Database</span>
                <h3 className="font-extrabold text-base">
                  Ubah {activeTab === 'pengurus' ? 'Data Pengurus' : activeTab === 'karyawan' ? 'Data Karyawan' : activeTab === 'aset' ? 'Data Aset Kantor' : activeTab === 'sumber_bayar' ? 'Data Channel Bayar' : 'Akses User / Kredensial'}
                </h3>
              </div>
              <button 
                onClick={() => { setShowEditModal(false); resetForms(); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Form 1: Pengurus */}
              {activeTab === 'pengurus' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nomor Induk Kependudukan (NIK) *</label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={pengurusForm.nik}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, nik: e.target.value.replace(/\D/g, '') })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap &amp; Gelar *</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.nama}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Jabatan Struktural</label>
                    <select
                      value={pengurusForm.jabatan}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, jabatan: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Ketua Pengurus">Ketua Pengurus</option>
                      <option value="Wakil Ketua Pengurus">Wakil Ketua Pengurus</option>
                      <option value="Sekretaris">Sekretaris Koperasi</option>
                      <option value="Bendahara Koperasi">Bendahara Koperasi</option>
                      <option value="Ketua Pengawas">Ketua Pengawas</option>
                      <option value="Anggota Pengawas">Anggota Pengawas</option>
                      <option value="Komite Penasihat">Komite Penasihat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor SK Pengangkatan *</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.noSk}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, noSk: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Periode Masa Bhakti Mulai</label>
                    <input
                      type="date"
                      required
                      value={pengurusForm.periodeMulai}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, periodeMulai: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Masa Bhakti Selesai</label>
                    <input
                      type="date"
                      required
                      value={pengurusForm.periodeSelesai}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, periodeSelesai: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor HP/WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={pengurusForm.noHp}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, noHp: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Keanggotaan</label>
                    <select
                      value={pengurusForm.status}
                      onChange={(e) => setPengurusForm({ ...pengurusForm, status: e.target.value as 'aktif' | 'nonaktif' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="aktif">Aktif Menjabat</option>
                      <option value="nonaktif">Demisioner/Nonaktif</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 2: Karyawan */}
              {activeTab === 'karyawan' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">NIK Kependudukan *</label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={karyawanForm.nik}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, nik: e.target.value.replace(/\D/g, '') })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap Staff *</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.nama}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, nama: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Jabatan Fungsional</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.jabatan}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, jabatan: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Departemen / Divisi Unit</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.departemen}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, departemen: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">No HP/WhatsApp Staff</label>
                    <input
                      type="text"
                      required
                      value={karyawanForm.noHp}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, noHp: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Gaji Pokok Karyawan (Rp) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={karyawanForm.gajiPokok}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, gajiPokok: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tipe Kontrak Kerja</label>
                    <select
                      value={karyawanForm.status}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, status: e.target.value as 'tetap' | 'kontrak' | 'magang' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="tetap">Karyawan Tetap (KSP)</option>
                      <option value="kontrak">Karyawan Kontrak</option>
                      <option value="magang">Magang / Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Aktivitas Kerja</label>
                    <select
                      value={karyawanForm.statusAktif ? 'true' : 'false'}
                      onChange={(e) => setKaryawanForm({ ...karyawanForm, statusAktif: e.target.value === 'true' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="true">Aktif Bekerja</option>
                      <option value="false">Resign / Cuti Panjang</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 3: Aset */}
              {activeTab === 'aset' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Aset Sarana Prasarana *</label>
                    <input
                      type="text"
                      required
                      value={asetForm.nama}
                      onChange={(e) => setAsetForm({ ...asetForm, nama: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Kategori Klasifikasi</label>
                    <select
                      value={asetForm.kategori}
                      onChange={(e) => setAsetForm({ ...asetForm, kategori: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Tanah">Tanah</option>
                      <option value="Bangunan">Bangunan</option>
                      <option value="Kendaraan">Kendaraan</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Perabotan">Perabotan</option>
                      <option value="Inventaris">Inventaris Kantor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Masa Manfaat (Tahun) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={asetForm.masaManfaat}
                      onChange={(e) => setAsetForm({ ...asetForm, masaManfaat: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Harga Perolehan Awal (Rp) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={asetForm.hargaPerolehan}
                      onChange={(e) => setAsetForm({ ...asetForm, hargaPerolehan: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Taksiran Nilai Residu (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      value={asetForm.nilaiResidu}
                      onChange={(e) => setAsetForm({ ...asetForm, nilaiResidu: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Lokasi Penempatan Fisik *</label>
                    <input
                      type="text"
                      required
                      value={asetForm.lokasi}
                      onChange={(e) => setAsetForm({ ...asetForm, lokasi: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Kondisi Fisik Saat Ini</label>
                    <select
                      value={asetForm.kondisi}
                      onChange={(e) => setAsetForm({ ...asetForm, kondisi: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Baik">Kondisi Baik &amp; Layak</option>
                      <option value="Rusak Ringan">Rusak Ringan (Butuh Servis)</option>
                      <option value="Rusak Berat">Rusak Berat (Tidak Layak)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 4: Sumber Bayar */}
              {activeTab === 'sumber_bayar' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Metode Channel Kas / Bank *</label>
                    <input
                      type="text"
                      required
                      value={sumberForm.nama}
                      onChange={(e) => setSumberForm({ ...sumberForm, nama: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Tipe Transaksi Finansial</label>
                    <select
                      value={sumberForm.tipe}
                      onChange={(e) => setSumberForm({ ...sumberForm, tipe: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    >
                      <option value="Tunai">Tunai (Cash)</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet Merchant</option>
                      <option value="QRIS">QRIS Dinamis / Statis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nomor Rekening / Merchant ID</label>
                    <input
                      type="text"
                      value={sumberForm.noRekening}
                      onChange={(e) => setSumberForm({ ...sumberForm, noRekening: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Kode Akun COA Akuntansi (GL) *</label>
                    <input
                      type="text"
                      required
                      value={sumberForm.akunCoa}
                      onChange={(e) => setSumberForm({ ...sumberForm, akunCoa: e.target.value })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-bold text-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Form 5: User Management Edit */}
              {activeTab === 'user_management' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Username / Akun Login *</label>
                    <input
                      type="text"
                      required
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value.trim() })}
                      placeholder="Contoh: admin_toko, budi12"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Password Baru (Ubah jika perlu)</label>
                    <input
                      type="text"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Tetap gunakan password lama jika kosong"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap Pengguna *</label>
                    <input
                      type="text"
                      required
                      value={userForm.namaLengkap}
                      onChange={(e) => setUserForm({ ...userForm, namaLengkap: e.target.value })}
                      placeholder="Contoh: Budi Susanto"
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Role Akses Aplikasi *</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold text-blue-700"
                    >
                      <option value="superadmin">SUPERADMIN</option>
                      <option value="admin">ADMIN (Koperasi)</option>
                      <option value="operator">OPERATOR / STAFF</option>
                      <option value="anggota">ANGGOTA (Portal Anggota)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Status Akun *</label>
                    <select
                      value={userForm.isActive ? 'aktif' : 'nonaktif'}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'aktif' })}
                      className="w-full border p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold text-emerald-700"
                    >
                      <option value="aktif">Aktif (Diberi Izin Login)</option>
                      <option value="nonaktif">Nonaktif (Blokir Akses)</option>
                    </select>
                  </div>
                  {userForm.role === 'anggota' && (
                    <div className="col-span-2 bg-blue-50/50 border border-blue-100 p-3 rounded-lg space-y-2">
                      <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        Integrasi Data Keanggotaan (Portal Anggota)
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Link NIK Anggota Terdaftar</label>
                          <select
                            value={userForm.nik}
                            onChange={(e) => {
                              const foundMember = members.find(m => m.nik === e.target.value);
                              setUserForm({
                                ...userForm,
                                nik: e.target.value,
                                memberId: foundMember ? foundMember.id : '',
                                namaLengkap: foundMember ? foundMember.nama : userForm.namaLengkap
                              });
                            }}
                            className="w-full border p-1.5 bg-white rounded-lg text-slate-800 font-mono text-[11px]"
                          >
                            <option value="">-- Pilih NIK Anggota --</option>
                            {members.map(m => (
                              <option key={m.id} value={m.nik}>{m.nik} - {m.nama}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">ID Member Linked</label>
                          <input
                            type="text"
                            disabled
                            value={userForm.memberId}
                            placeholder="Auto linked"
                            className="w-full border p-1.5 bg-slate-100 rounded-lg text-slate-500 font-mono text-[11px] cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForms(); }}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE MASTER DATA CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Konfirmasi Penghapusan Data</h4>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin menghapus data master ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-2 text-xs font-bold pt-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setSelectedId(null); }}
                  className="flex-1 py-2.5 border rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
