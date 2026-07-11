import { create } from 'zustand';
import { api } from '../api/client.js';

interface DataState {
  members: any[];
  fetchMembers: () => Promise<void>;
  addMember: (data: any) => Promise<any>;
  updateMember: (data: any) => Promise<any>;
  deleteMember: (id: string) => Promise<void>;

  savingsTrans: any[];
  savingsTypes: any[];
  permohonanList: any[];
  fetchSavingsTrans: () => Promise<void>;
  fetchSavingsTypes: () => Promise<void>;
  addSavingsTrans: (data: any) => Promise<void>;
  updateSavingsTypes: (data: any[]) => Promise<void>;
  fetchPermohonan: () => Promise<void>;
  addPermohonan: (data: any) => Promise<void>;
  approvePermohonan: (id: string) => Promise<void>;
  rejectPermohonan: (id: string) => Promise<void>;

  loans: any[];
  loanTypes: any[];
  schedules: any[];
  fetchLoans: () => Promise<void>;
  fetchLoanTypes: () => Promise<void>;
  addLoan: (data: any) => Promise<any>;
  approveLoan: (id: string) => Promise<void>;
  rejectLoan: (id: string) => Promise<void>;
  updateLoanTypes: (data: any[]) => Promise<void>;
  fetchSchedules: () => Promise<void>;
  payAngsuran: (id: string, denda?: number) => Promise<void>;

  journals: any[];
  fetchJournals: () => Promise<void>;

  barang: any[];
  categories: any[];
  suppliers: any[];
  penjualanList: any[];
  pembelianList: any[];
  fetchBarang: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchPenjualan: () => Promise<void>;
  addPenjualan: (data: any) => Promise<any>;
  fetchPembelian: () => Promise<void>;
  addPembelian: (data: any) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;

  investments: any[];
  fetchInvestments: () => Promise<void>;
  addInvestment: (data: any) => Promise<any>;
  updateVentureStatus: (id: string, status: string) => Promise<void>;
  updateVentureInvestment: (id: string, data: any) => Promise<void>;
  addDividen: (id: string, data: any) => Promise<void>;

  pengajuanList: any[];
  fetchPengajuan: () => Promise<void>;
  createPengajuan: (data: any) => Promise<any>;
  updateStatusPengajuan: (id: string, status: string) => Promise<void>;
  uploadDokumenPengajuan: (id: string, dokumenId: string, fileName: string) => Promise<void>;
  validasiDokumen: (pengajuanId: string, dokumenId: string, status: string) => Promise<void>;
  runAIScoring: (id: string) => Promise<any>;
  fetchDokumenTemplates: () => Promise<any[]>;
  konversiPengajuan: (pengajuanId: string) => Promise<any>;

  announcements: any[];
  fetchAnnouncements: () => Promise<void>;
  addAnnouncement: (data: any) => Promise<any>;
  deleteAnnouncement: (id: string) => Promise<void>;
  toggleAnnouncement: (id: string) => Promise<void>;

  tickets: any[];
  fetchTickets: () => Promise<void>;
  addTicket: (data: any) => Promise<any>;
  replyTicket: (id: string, balasan: string) => Promise<void>;

  transferReceipts: any[];
  fetchReceipts: () => Promise<void>;
  addReceipt: (data: any) => Promise<any>;
  approveReceipt: (id: string) => Promise<void>;
  rejectReceipt: (id: string) => Promise<void>;

  featureToggles: any;
  fetchFeatureToggles: () => Promise<void>;
  updateFeatureToggles: (data: any) => Promise<void>;

  sewaAssets: any[];
  sewaTransactions: any[];
  fetchSewaAssets: () => Promise<void>;
  addSewaAsset: (data: any) => Promise<any>;
  updateSewaAsset: (data: any) => Promise<void>;
  deleteSewaAsset: (id: string) => Promise<void>;
  fetchSewaTrans: () => Promise<void>;
  addSewaTrans: (data: any) => Promise<any>;
  approveSewa: (id: string) => Promise<void>;
  rejectSewa: (id: string) => Promise<void>;
  finishSewa: (id: string, denda: number) => Promise<void>;

  ppobLayanan: any[];
  ppobTransactions: any[];
  fetchPpobLayanan: () => Promise<void>;
  togglePpobService: (id: string) => Promise<void>;
  updatePpobPrices: (id: string, min: number, max: number) => Promise<void>;
  fetchPpobTrans: () => Promise<void>;
  addPpobTrans: (data: any) => Promise<any>;

  virtualAccounts: any[];
  vaTransactions: any[];
  fetchVirtualAccounts: () => Promise<void>;
  generateVA: (anggotaId: string, bank: string) => Promise<any>;
  fetchVATrans: () => Promise<void>;
  addVATrans: (data: any) => Promise<any>;

  cicilanBarang: any[];
  cicilanAngsuran: any[];
  fetchCicilanBarang: () => Promise<void>;
  addCicilanBarang: (data: any) => Promise<any>;
  approveCicilan: (id: string) => Promise<void>;
  rejectCicilan: (id: string) => Promise<void>;
  fetchCicilanAngsuran: () => Promise<void>;
  payCicilanAngsuran: (id: string) => Promise<void>;

  landingSettings: any;
  landingHero: any;
  landingFeatures: any[];
  landingTeam: any[];
  landingTestimonials: any[];
  landingPricing: any[];
  landingContact: any;
  fetchLandingSettings: () => Promise<void>;
  saveLandingSettings: (data: any) => Promise<void>;
  saveLandingHero: (data: any) => Promise<void>;
  fetchLandingFeatures: () => Promise<void>;
  addLandingFeature: (data: any) => Promise<any>;
  updateLandingFeature: (id: string, data: any) => Promise<void>;
  deleteLandingFeature: (id: string) => Promise<void>;
  fetchLandingTeam: () => Promise<void>;
  addLandingTeam: (data: any) => Promise<any>;
  updateLandingTeam: (id: string, data: any) => Promise<void>;
  deleteLandingTeam: (id: string) => Promise<void>;
  fetchLandingTestimonials: () => Promise<void>;
  addLandingTestimonial: (data: any) => Promise<any>;
  updateLandingTestimonial: (id: string, data: any) => Promise<void>;
  deleteLandingTestimonial: (id: string) => Promise<void>;
  fetchLandingPricing: () => Promise<void>;
  addLandingPricing: (data: any) => Promise<any>;
  updateLandingPricing: (id: string, data: any) => Promise<void>;
  deleteLandingPricing: (id: string) => Promise<void>;
  saveLandingContact: (data: any) => Promise<void>;

  koperasiInfo: any;
  pengurus: any[];
  karyawan: any[];
  asetBarang: any[];
  sumberBayar: any[];
  perusahaan: any[];
  users: any[];
  fetchKoperasiInfo: () => Promise<void>;
  fetchPerusahaan: () => Promise<void>;
  addPerusahaan: (data: any) => Promise<any>;
  updatePerusahaan: (id: string, data: any) => Promise<void>;
  deletePerusahaan: (id: string) => Promise<void>;
  fetchPengurus: () => Promise<void>;
  addPengurus: (data: any) => Promise<any>;
  updatePengurus: (id: string, data: any) => Promise<void>;
  deletePengurus: (id: string) => Promise<void>;
  fetchKaryawan: () => Promise<void>;
  addKaryawan: (data: any) => Promise<any>;
  updateKaryawan: (id: string, data: any) => Promise<void>;
  deleteKaryawan: (id: string) => Promise<void>;
  fetchAsetBarang: () => Promise<void>;
  addAsetBarang: (data: any) => Promise<any>;
  updateAsetBarang: (id: string, data: any) => Promise<void>;
  deleteAsetBarang: (id: string) => Promise<void>;
  fetchSumberBayar: () => Promise<void>;
  addSumberBayar: (data: any) => Promise<any>;
  updateSumberBayar: (id: string, data: any) => Promise<void>;
  deleteSumberBayar: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  addUser: (data: any) => Promise<any>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  chartOfAccounts: any[];
  accountingPeriods: any[];
  bukuBesar: any;
  neracaSaldo: any[];
  subLedgerPiutang: any[];
  laporanLabarugi: any;
  laporanNeraca: any;
  laporanPde: any;
  laporanRasio: any;
  fetchCOA: () => Promise<void>;
  addCOA: (data: any) => Promise<any>;
  updateCOA: (id: string, data: any) => Promise<void>;
  deactivateCOA: (id: string) => Promise<void>;
  fetchPeriods: () => Promise<void>;
  closePeriod: (id: string) => Promise<void>;
  openPeriod: (id: string) => Promise<void>;
  fetchBukuBesar: (coaId: string, startDate?: string, endDate?: string) => Promise<void>;
  fetchNeracaSaldo: () => Promise<void>;
  fetchSubLedgerPiutang: () => Promise<void>;
  fetchLaporanLabarugi: (startDate?: string, endDate?: string) => Promise<void>;
  fetchLaporanNeraca: () => Promise<void>;
  fetchLaporanPde: () => Promise<void>;
  fetchLaporanRasio: () => Promise<void>;
  createManualJurnal: (data: any) => Promise<any>;
  approveJurnal: (id: string, notes?: string) => Promise<void>;
  reverseJurnal: (id: string) => Promise<any>;
  tutupBuku: (tahun: number) => Promise<any>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  members: [],
  savingsTrans: [],
  savingsTypes: [],
  permohonanList: [],
  loans: [],
  loanTypes: [],
  schedules: [],
  journals: [],
  barang: [],
  categories: [],
  suppliers: [],
  penjualanList: [],
  pembelianList: [],
  investments: [],
  announcements: [],
  tickets: [],
  transferReceipts: [],
  featureToggles: {},
  sewaAssets: [],
  sewaTransactions: [],
  ppobLayanan: [],
  ppobTransactions: [],
  virtualAccounts: [],
  vaTransactions: [],
  cicilanBarang: [],
  cicilanAngsuran: [],
  landingSettings: {},
  landingHero: {},
  landingFeatures: [],
  landingTeam: [],
  landingTestimonials: [],
  landingPricing: [],
  landingContact: {},
  koperasiInfo: {},
  pengurus: [],
  karyawan: [],
  asetBarang: [],
  sumberBayar: [],
  perusahaan: [],
  pengajuanList: [],
  users: [],
  chartOfAccounts: [],
  accountingPeriods: [],
  bukuBesar: null,
  neracaSaldo: [],
  subLedgerPiutang: [],
  laporanLabarugi: null,
  laporanNeraca: null,
  laporanPde: null,
  laporanRasio: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Members
  fetchMembers: async () => {
    try { const data = await api.get<any[]>('/data/anggota'); set({ members: data }); }
    catch (e: any) { set({ error: e.message }); }
  },
  addMember: async (data) => {
    const res = await api.post<any>('/data/anggota', data);
    await get().fetchMembers();
    return res;
  },
  updateMember: async (data) => {
    await api.put<any>(`/data/anggota/${data.id}`, data);
    await get().fetchMembers();
  },
  deleteMember: async (id) => {
    await api.delete(`/data/anggota/${id}`);
    await get().fetchMembers();
  },

  // Savings
  fetchSavingsTrans: async () => {
    try { const d = await api.get<any[]>('/data/simpanan-transaksi'); set({ savingsTrans: d }); } catch {}
  },
  fetchSavingsTypes: async () => {
    try { const d = await api.get<any[]>('/data/jenis-simpanan'); set({ savingsTypes: d }); } catch {}
  },
  addSavingsTrans: async (data) => {
    await api.post<any>('/data/simpanan-transaksi', data);
    await get().fetchSavingsTrans();
    await get().fetchMembers();
    await get().fetchJournals();
  },
  updateSavingsTypes: async (data) => {
    await api.put<any>('/data/jenis-simpanan', data);
    await get().fetchSavingsTypes();
  },
  fetchPermohonan: async () => {
    try { const d = await api.get<any[]>('/data/permohonan-tarik'); set({ permohonanList: d }); } catch {}
  },
  addPermohonan: async (data) => {
    await api.post<any>('/data/permohonan-tarik', data);
    await get().fetchPermohonan();
  },
  approvePermohonan: async (id) => {
    await api.put<any>(`/data/permohonan-tarik/${id}/approve`);
    await get().fetchPermohonan();
    await get().fetchSavingsTrans();
    await get().fetchMembers();
  },
  rejectPermohonan: async (id) => {
    await api.put<any>(`/data/permohonan-tarik/${id}/reject`);
    await get().fetchPermohonan();
  },

  // Loans
  fetchLoans: async () => {
    try { const d = await api.get<any[]>('/data/pinjaman'); set({ loans: d }); } catch {}
  },
  fetchLoanTypes: async () => {
    try { const d = await api.get<any[]>('/data/jenis-pinjaman'); set({ loanTypes: d }); } catch {}
  },
  addLoan: async (data) => {
    const res = await api.post<any>('/data/pinjaman', data);
    await get().fetchLoans();
    return res;
  },
  approveLoan: async (id) => {
    await api.put<any>(`/data/pinjaman/${id}/approve`);
    await get().fetchLoans();
    await get().fetchSchedules();
    await get().fetchJournals();
  },
  rejectLoan: async (id) => {
    await api.put<any>(`/data/pinjaman/${id}/reject`);
    await get().fetchLoans();
  },
  updateLoanTypes: async (data) => {
    await api.put<any>('/data/jenis-pinjaman', data);
    await get().fetchLoanTypes();
  },
  fetchSchedules: async () => {
    try { const d = await api.get<any[]>('/data/angsuran'); set({ schedules: d }); } catch {}
  },
  payAngsuran: async (id, denda) => {
    await api.post<any>(`/data/angsuran/${id}/pay`, { denda });
    await get().fetchSchedules();
    await get().fetchLoans();
    await get().fetchJournals();
  },

  // Journal
  fetchJournals: async () => {
    try { const d = await api.get<any[]>('/data/jurnal'); set({ journals: d }); } catch {}
  },

  // Shop
  fetchBarang: async () => {
    try { const d = await api.get<any[]>('/data/barang'); set({ barang: d }); } catch {}
  },
  fetchCategories: async () => {
    try { const d = await api.get<any[]>('/data/kategori-barang'); set({ categories: d }); } catch {}
  },
  fetchSuppliers: async () => {
    try { const d = await api.get<any[]>('/data/supplier'); set({ suppliers: d }); } catch {}
  },
  fetchPenjualan: async () => {
    try { const d = await api.get<any[]>('/data/penjualan'); set({ penjualanList: d }); } catch {}
  },
  addPenjualan: async (data) => {
    const r = await api.post<any>('/data/penjualan', data);
    await get().fetchPenjualan();
    await get().fetchJournals();
    await get().fetchBarang();
    return r;
  },
  fetchPembelian: async () => {
    try { const d = await api.get<any[]>('/data/pembelian'); set({ pembelianList: d }); } catch {}
  },
  addPembelian: async (data) => {
    await api.post<any>('/data/pembelian', data);
    await get().fetchPembelian();
    await get().fetchJournals();
    await get().fetchBarang();
  },
  updateStock: async (id, newStock) => {
    await api.put<any>(`/data/barang/${id}/stock`, { newStock });
    await get().fetchBarang();
  },

  // Venture
  fetchInvestments: async () => {
    try { const d = await api.get<any[]>('/data/venture'); set({ investments: d }); } catch {}
  },
  addInvestment: async (data) => {
    const res = await api.post<any>('/data/venture', data);
    await get().fetchInvestments();
    return res;
  },
  updateVentureStatus: async (id, status) => {
    await api.put<any>(`/data/venture/${id}/status`, { status });
    await get().fetchInvestments();
    await get().fetchJournals();
  },
  updateVentureInvestment: async (id, data) => {
    await api.put<any>(`/data/venture/${id}`, data);
    await get().fetchInvestments();
  },
  addDividen: async (id, data) => {
    await api.post<any>(`/data/venture/${id}/dividen`, data);
    await get().fetchInvestments();
    await get().fetchJournals();
  },

  // AI Credit Scoring
  fetchPengajuan: async () => {
    try { const d = await api.get<any[]>('/data/pengajuan'); set({ pengajuanList: d }); } catch {}
  },
  createPengajuan: async (data) => {
    const r = await api.post<any>('/data/pengajuan', data);
    await get().fetchPengajuan();
    return r;
  },
  updateStatusPengajuan: async (id, status) => {
    await api.put<any>(`/data/pengajuan/${id}/status`, { status });
    await get().fetchPengajuan();
  },
  uploadDokumenPengajuan: async (id, dokumenId, fileName) => {
    await api.post<any>(`/data/pengajuan/${id}/dokumen`, { dokumenId, fileName });
    await get().fetchPengajuan();
  },
  validasiDokumen: async (pengajuanId, dokumenId, status) => {
    await api.put<any>(`/data/pengajuan/${pengajuanId}/dokumen/${dokumenId}/validasi`, { status });
    await get().fetchPengajuan();
  },
  runAIScoring: async (id) => {
    const r = await api.post<any>(`/data/pengajuan/${id}/analisis-ai`);
    await get().fetchPengajuan();
    return r;
  },
  fetchDokumenTemplates: async () => {
    try { const d = await api.get<any[]>('/data/dokumen-templates'); return d; } catch { return []; }
  },
  konversiPengajuan: async (pengajuanId) => {
    const r = await api.post<any>(`/data/venture/konversi/${pengajuanId}`);
    await get().fetchPengajuan();
    await get().fetchInvestments();
    return r;
  },

  // Announcements
  fetchAnnouncements: async () => {
    try { const d = await api.get<any[]>('/data/pengumuman'); set({ announcements: d }); } catch {}
  },
  addAnnouncement: async (data) => {
    const res = await api.post<any>('/data/pengumuman', data);
    await get().fetchAnnouncements();
    return res;
  },
  deleteAnnouncement: async (id) => {
    await api.delete(`/data/pengumuman/${id}`);
    await get().fetchAnnouncements();
  },
  toggleAnnouncement: async (id) => {
    await api.put<any>(`/data/pengumuman/${id}/toggle`);
    await get().fetchAnnouncements();
  },

  // Tickets
  fetchTickets: async () => {
    try { const d = await api.get<any[]>('/data/tiket'); set({ tickets: d }); } catch {}
  },
  addTicket: async (data) => {
    const res = await api.post<any>('/data/tiket', data);
    await get().fetchTickets();
    return res;
  },
  replyTicket: async (id, balasan) => {
    await api.put<any>(`/data/tiket/${id}/reply`, { balasan });
    await get().fetchTickets();
  },

  // Receipts
  fetchReceipts: async () => {
    try { const d = await api.get<any[]>('/data/bukti-transfer'); set({ transferReceipts: d }); } catch {}
  },
  addReceipt: async (data) => {
    const res = await api.post<any>('/data/bukti-transfer', data);
    await get().fetchReceipts();
    return res;
  },
  approveReceipt: async (id) => {
    await api.put<any>(`/data/bukti-transfer/${id}/approve`);
    await get().fetchReceipts();
    await get().fetchMembers();
    await get().fetchSavingsTrans();
    await get().fetchJournals();
  },
  rejectReceipt: async (id) => {
    await api.put<any>(`/data/bukti-transfer/${id}/reject`);
    await get().fetchReceipts();
  },

  // Feature Toggles
  fetchFeatureToggles: async () => {
    try {
      const d = await api.get<any>('/data/feature-toggles');
      set({ featureToggles: d || {} });
    } catch {}
  },
  updateFeatureToggles: async (data) => {
    await api.put<any>('/data/feature-toggles', data);
    await get().fetchFeatureToggles();
  },

  // Rental
  fetchSewaAssets: async () => {
    try { const d = await api.get<any[]>('/data/sewa-assets'); set({ sewaAssets: d }); } catch {}
  },
  addSewaAsset: async (data) => {
    const res = await api.post<any>('/data/sewa-assets', data);
    await get().fetchSewaAssets();
    return res;
  },
  updateSewaAsset: async (data) => {
    await api.put<any>(`/data/sewa-assets/${data.id}`, data);
    await get().fetchSewaAssets();
  },
  deleteSewaAsset: async (id) => {
    await api.delete(`/data/sewa-assets/${id}`);
    await get().fetchSewaAssets();
  },
  fetchSewaTrans: async () => {
    try { const d = await api.get<any[]>('/data/sewa-transaksi'); set({ sewaTransactions: d }); } catch {}
  },
  addSewaTrans: async (data) => {
    const res = await api.post<any>('/data/sewa-transaksi', data);
    await get().fetchSewaTrans();
    return res;
  },
  approveSewa: async (id) => {
    await api.put<any>(`/data/sewa-transaksi/${id}/approve`);
    await get().fetchSewaTrans();
  },
  rejectSewa: async (id) => {
    await api.put<any>(`/data/sewa-transaksi/${id}/reject`);
    await get().fetchSewaTrans();
  },
  finishSewa: async (id, denda) => {
    await api.put<any>(`/data/sewa-transaksi/${id}/finish`, { denda });
    await get().fetchSewaTrans();
    await get().fetchSewaAssets();
  },

  // PPOB
  fetchPpobLayanan: async () => {
    try { const d = await api.get<any[]>('/data/ppob-layanan'); set({ ppobLayanan: d }); } catch {}
  },
  togglePpobService: async (id) => {
    await api.put<any>(`/data/ppob-layanan/${id}/toggle`);
    await get().fetchPpobLayanan();
  },
  updatePpobPrices: async (id, min, max) => {
    await api.put<any>(`/data/ppob-layanan/${id}/prices`, { nominalMin: min, nominalMax: max });
    await get().fetchPpobLayanan();
  },
  fetchPpobTrans: async () => {
    try { const d = await api.get<any[]>('/data/ppob-transaksi'); set({ ppobTransactions: d }); } catch {}
  },
  addPpobTrans: async (data) => {
    const res = await api.post<any>('/data/ppob-transaksi', data);
    await get().fetchPpobTrans();
    return res;
  },

  // Virtual Account
  fetchVirtualAccounts: async () => {
    try { const d = await api.get<any[]>('/data/virtual-accounts'); set({ virtualAccounts: d }); } catch {}
  },
  generateVA: async (anggotaId, bank) => {
    const res = await api.post<any>('/data/virtual-accounts', { anggotaId, bank });
    await get().fetchVirtualAccounts();
    return res;
  },
  fetchVATrans: async () => {
    try { const d = await api.get<any[]>('/data/va-transaksi'); set({ vaTransactions: d }); } catch {}
  },
  addVATrans: async (data) => {
    const res = await api.post<any>('/data/va-transaksi', data);
    await get().fetchVATrans();
    return res;
  },

  // Cicilan
  fetchCicilanBarang: async () => {
    try { const d = await api.get<any[]>('/data/cicilan-barang'); set({ cicilanBarang: d }); } catch {}
  },
  addCicilanBarang: async (data) => {
    const res = await api.post<any>('/data/cicilan-barang', data);
    await get().fetchCicilanBarang();
    return res;
  },
  approveCicilan: async (id) => {
    await api.put<any>(`/data/cicilan-barang/${id}/approve`);
    await get().fetchCicilanBarang();
    await get().fetchCicilanAngsuran();
  },
  rejectCicilan: async (id) => {
    await api.put<any>(`/data/cicilan-barang/${id}/reject`);
    await get().fetchCicilanBarang();
  },
  fetchCicilanAngsuran: async () => {
    try { const d = await api.get<any[]>('/data/cicilan-angsuran'); set({ cicilanAngsuran: d }); } catch {}
  },
  payCicilanAngsuran: async (id) => {
    await api.post<any>(`/data/cicilan-angsuran/${id}/pay`);
    await get().fetchCicilanAngsuran();
    await get().fetchCicilanBarang();
  },

  // Data Master
  fetchKoperasiInfo: async () => {
    try { const d = await api.get<any[]>('/data/koperasi-info'); set({ koperasiInfo: d }); } catch {}
  },
  fetchPengurus: async () => {
    try { const d = await api.get<any[]>('/data/pengurus'); set({ pengurus: d }); } catch {}
  },
  addPengurus: async (data) => { const r = await api.post<any>('/data/pengurus', data); await get().fetchPengurus(); return r; },
  updatePengurus: async (id, data) => { await api.put<any>(`/data/pengurus/${id}`, data); await get().fetchPengurus(); },
  deletePengurus: async (id) => { await api.delete<any>(`/data/pengurus/${id}`); await get().fetchPengurus(); },
  fetchKaryawan: async () => {
    try { const d = await api.get<any[]>('/data/karyawan'); set({ karyawan: d }); } catch {}
  },
  addKaryawan: async (data) => { const r = await api.post<any>('/data/karyawan', data); await get().fetchKaryawan(); return r; },
  updateKaryawan: async (id, data) => { await api.put<any>(`/data/karyawan/${id}`, data); await get().fetchKaryawan(); },
  deleteKaryawan: async (id) => { await api.delete<any>(`/data/karyawan/${id}`); await get().fetchKaryawan(); },
  fetchAsetBarang: async () => {
    try { const d = await api.get<any[]>('/data/aset-barang'); set({ asetBarang: d }); } catch {}
  },
  addAsetBarang: async (data) => { const r = await api.post<any>('/data/aset-barang', data); await get().fetchAsetBarang(); return r; },
  updateAsetBarang: async (id, data) => { await api.put<any>(`/data/aset-barang/${id}`, data); await get().fetchAsetBarang(); },
  deleteAsetBarang: async (id) => { await api.delete<any>(`/data/aset-barang/${id}`); await get().fetchAsetBarang(); },
  fetchSumberBayar: async () => {
    try { const d = await api.get<any[]>('/data/sumber-bayar'); set({ sumberBayar: d }); } catch {}
  },
  addSumberBayar: async (data) => { const r = await api.post<any>('/data/sumber-bayar', data); await get().fetchSumberBayar(); return r; },
  updateSumberBayar: async (id, data) => { await api.put<any>(`/data/sumber-bayar/${id}`, data); await get().fetchSumberBayar(); },
  deleteSumberBayar: async (id) => { await api.delete<any>(`/data/sumber-bayar/${id}`); await get().fetchSumberBayar(); },
  fetchPerusahaan: async () => {
    try { const d = await api.get<any[]>('/data/perusahaan'); set({ perusahaan: d }); } catch {}
  },
  addPerusahaan: async (data) => { const r = await api.post<any>('/data/perusahaan', data); await get().fetchPerusahaan(); return r; },
  updatePerusahaan: async (id, data) => { await api.put<any>(`/data/perusahaan/${id}`, data); await get().fetchPerusahaan(); },
  deletePerusahaan: async (id) => { await api.delete<any>(`/data/perusahaan/${id}`); await get().fetchPerusahaan(); },
  fetchUsers: async () => {
    try { const d = await api.get<any[]>('/data/users'); set({ users: d }); } catch {}
  },
  addUser: async (data) => { const r = await api.post<any>('/data/users', data); await get().fetchUsers(); return r; },
  updateUser: async (id, data) => { await api.put<any>(`/data/users/${id}`, data); await get().fetchUsers(); },
  deleteUser: async (id) => { await api.delete<any>(`/data/users/${id}`); await get().fetchUsers(); },

  // General Ledger
  fetchCOA: async () => {
    try { const d = await api.get<any[]>('/data/coa'); set({ chartOfAccounts: d }); } catch {}
  },
  addCOA: async (data) => { const r = await api.post<any>('/data/coa', data); await get().fetchCOA(); return r; },
  updateCOA: async (id, data) => { await api.put<any>(`/data/coa/${id}`, data); await get().fetchCOA(); },
  deactivateCOA: async (id) => { await api.delete<any>(`/data/coa/${id}`); await get().fetchCOA(); },
  fetchPeriods: async () => {
    try { const d = await api.get<any[]>('/data/periods'); set({ accountingPeriods: d }); } catch {}
  },
  closePeriod: async (id) => { await api.post<any>('/data/periods/close', { periodeId: id }); await get().fetchPeriods(); },
  openPeriod: async (id) => { await api.post<any>('/data/periods/open', { periodeId: id }); await get().fetchPeriods(); },
  fetchBukuBesar: async (coaId, startDate, endDate) => {
    try {
      let path = `/data/bukubesar/${coaId}`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) path += '?' + params.join('&');
      const d = await api.get<any>(path); set({ bukuBesar: d });
    } catch {}
  },
  fetchNeracaSaldo: async () => {
    try { const d = await api.get<any[]>('/data/neracasaldo'); set({ neracaSaldo: d }); } catch {}
  },
  fetchSubLedgerPiutang: async () => {
    try { const d = await api.get<any[]>('/data/subledger/piutang'); set({ subLedgerPiutang: d }); } catch {}
  },
  fetchLaporanLabarugi: async (startDate, endDate) => {
    try {
      let path = '/data/laporan/labarugi';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) path += '?' + params.join('&');
      const d = await api.get<any>(path); set({ laporanLabarugi: d });
    } catch {}
  },
  fetchLaporanNeraca: async () => {
    try { const d = await api.get<any>('/data/laporan/neraca'); set({ laporanNeraca: d }); } catch {}
  },
  fetchLaporanPde: async () => {
    try { const d = await api.get<any>('/data/laporan/pde'); set({ laporanPde: d }); } catch {}
  },
  fetchLaporanRasio: async () => {
    try { const d = await api.get<any>('/data/laporan/rasio'); set({ laporanRasio: d }); } catch {}
  },
  createManualJurnal: async (data) => {
    const r = await api.post<any>('/data/jurnal/manual', data); await get().fetchJournals(); return r;
  },
  approveJurnal: async (id, notes) => {
    await api.put<any>(`/data/jurnal/${id}/approve`, { notes }); await get().fetchJournals();
  },
  reverseJurnal: async (id) => {
    const r = await api.post<any>(`/data/jurnal/${id}/reverse`); await get().fetchJournals(); return r;
  },
  tutupBuku: async (tahun) => {
    return await api.post<any>('/data/tutupbuku', { tahun });
  },

  // Landing Page CMS
  fetchLandingSettings: async () => {
    try { const d = await api.get<any>('/data/landing-settings'); set({ landingSettings: d }); } catch {}
  },
  saveLandingSettings: async (data) => {
    await api.put<any>('/data/landing-settings', data);
    await get().fetchLandingSettings();
  },
  saveLandingHero: async (data) => {
    await api.put<any>('/data/landing-hero', data);
  },
  fetchLandingFeatures: async () => {
    try { const d = await api.get<any[]>('/data/landing-features'); set({ landingFeatures: d }); } catch {}
  },
  addLandingFeature: async (data) => {
    const r = await api.post<any>('/data/landing-features', data);
    await get().fetchLandingFeatures();
    return r;
  },
  updateLandingFeature: async (id, data) => {
    await api.put<any>(`/data/landing-features/${id}`, data);
    await get().fetchLandingFeatures();
  },
  deleteLandingFeature: async (id) => {
    await api.delete(`/data/landing-features/${id}`);
    await get().fetchLandingFeatures();
  },
  fetchLandingTeam: async () => {
    try { const d = await api.get<any[]>('/data/landing-team'); set({ landingTeam: d }); } catch {}
  },
  addLandingTeam: async (data) => {
    const r = await api.post<any>('/data/landing-team', data);
    await get().fetchLandingTeam();
    return r;
  },
  updateLandingTeam: async (id, data) => {
    await api.put<any>(`/data/landing-team/${id}`, data);
    await get().fetchLandingTeam();
  },
  deleteLandingTeam: async (id) => {
    await api.delete(`/data/landing-team/${id}`);
    await get().fetchLandingTeam();
  },
  fetchLandingTestimonials: async () => {
    try { const d = await api.get<any[]>('/data/landing-testimonials'); set({ landingTestimonials: d }); } catch {}
  },
  addLandingTestimonial: async (data) => {
    const r = await api.post<any>('/data/landing-testimonials', data);
    await get().fetchLandingTestimonials();
    return r;
  },
  updateLandingTestimonial: async (id, data) => {
    await api.put<any>(`/data/landing-testimonials/${id}`, data);
    await get().fetchLandingTestimonials();
  },
  deleteLandingTestimonial: async (id) => {
    await api.delete(`/data/landing-testimonials/${id}`);
    await get().fetchLandingTestimonials();
  },
  fetchLandingPricing: async () => {
    try { const d = await api.get<any[]>('/data/landing-pricing'); set({ landingPricing: d }); } catch {}
  },
  addLandingPricing: async (data) => {
    const r = await api.post<any>('/data/landing-pricing', data);
    await get().fetchLandingPricing();
    return r;
  },
  updateLandingPricing: async (id, data) => {
    await api.put<any>(`/data/landing-pricing/${id}`, data);
    await get().fetchLandingPricing();
  },
  deleteLandingPricing: async (id) => {
    await api.delete(`/data/landing-pricing/${id}`);
    await get().fetchLandingPricing();
  },
  saveLandingContact: async (data) => {
    await api.put<any>('/data/landing-contact', data);
    await get().fetchLandingSettings();
  },
}));

export function useLoadAllData() {
  const store = useDataStore();
  return async () => {
    store.fetchMembers();
    store.fetchSavingsTrans();
    store.fetchSavingsTypes();
    store.fetchPermohonan();
    store.fetchLoans();
    store.fetchLoanTypes();
    store.fetchSchedules();
    store.fetchJournals();
    store.fetchBarang();
    store.fetchCategories();
    store.fetchSuppliers();
    store.fetchPenjualan();
    store.fetchPembelian();
    store.fetchInvestments();
    store.fetchAnnouncements();
    store.fetchTickets();
    store.fetchReceipts();
    store.fetchFeatureToggles();
    store.fetchSewaAssets();
    store.fetchSewaTrans();
    store.fetchPpobLayanan();
    store.fetchPpobTrans();
    store.fetchVirtualAccounts();
    store.fetchVATrans();
    store.fetchCicilanBarang();
    store.fetchCicilanAngsuran();
    store.fetchKoperasiInfo();
    store.fetchPengurus();
    store.fetchKaryawan();
    store.fetchAsetBarang();
    store.fetchSumberBayar();
    store.fetchUsers();
    store.fetchCOA();
    store.fetchPeriods();
    store.fetchSubLedgerPiutang();
    store.fetchPerusahaan();
    store.fetchPengajuan();
    store.fetchLandingSettings();
    store.fetchLandingFeatures();
    store.fetchLandingTeam();
    store.fetchLandingTestimonials();
    store.fetchLandingPricing();
  };
}
