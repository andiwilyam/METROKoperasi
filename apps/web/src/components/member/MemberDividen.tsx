import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, CheckCircle, Clock, X, Coins, AlertCircle, HelpCircle, Download } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { api } from '../../api/client';

export default function MemberDividen({ session }: { session: any }) {
  const { investments, fetchInvestments, addDividen, fetchPengajuan } = useDataStore();
  const [tab, setTab] = useState<'overview' | 'riwayat' | 'tambah'>('overview');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    investasiId: '',
    periode: '',
    nominal: 0,
    tanggal_bayar: '',
    catatan: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get company's investments
  const myInvestments = investments.filter((i: any) => i.perusahaanId === session.perusahaanId || i.perusahaanId === session.id);

  // Flatten dividend history
  const allDividends = myInvestments.flatMap((inv: any) => 
    (inv.dividendHistory || []).map((d: any) => ({ ...d, namaPerusahaan: inv.namaPerusahaan, investasiId: inv.id }))
  ).sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.investasiId || !formData.periode || !formData.nominal || !formData.tanggal_bayar) return;
    
    setLoading(true);
    try {
      await addDividen(formData.investasiId, {
        periode: formData.periode,
        nominal: Number(formData.nominal),
        tanggal: formData.tanggal_bayar,
        catatan: formData.catatan,
      });
      setSuccessMessage('Dividen berhasil dicatat!');
      setFormData({ investasiId: '', periode: '', nominal: 0, tanggal_bayar: '', catatan: '' });
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Dividen & Bagi Hasil</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Manajemen Dividen Investasi</h1>
        <p className="text-xs text-slate-300 mt-1">Pencatatan, pelaporan, dan riwayat pembagian dividen penyertaan modal</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex flex-wrap gap-1" role="tablist">
        <button role="tab" aria-selected={tab === 'overview'} onClick={() => setTab('overview')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'overview' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <Coins className="w-3.5 h-3.5 inline mr-1.5" />
          Ringkasan
        </button>
        <button role="tab" aria-selected={tab === 'riwayat'} onClick={() => setTab('riwayat')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'riwayat' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
          Riwayat Dividen ({allDividends.length})
        </button>
        <button role="tab" aria-selected={tab === 'tambah'} onClick={() => setTab('tambah')}
          className={`flex-1 min-w-[120px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            tab === 'tambah' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <span className="w-3.5 h-3.5 inline mr-1.5">➕</span>
          Tambah Dividen
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="p-6">
            {myInvestments.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Coins className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-600">Belum ada investasi aktif</p>
                <p className="text-xs text-slate-400 mt-1">Investasi yang disetujui akan muncul di sini untuk pengelolaan dividen</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <div className="font-bold text-emerald-700 text-xl">{myInvestments.length}</div>
                    <div className="text-emerald-600 text-xs">Investasi Aktif</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="font-bold text-blue-700 text-xl">
                      {formatIDR(myInvestments.reduce((s: number, i: any) => s + (i.nominalInvestasi || 0), 0))}
                    </div>
                    <div className="text-blue-600 text-xs">Total Nilai Investasi</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <div className="font-bold text-amber-700 text-xl">
                      {formatIDR(allDividends.reduce((s: number, d: any) => s + (d.nominal || 0), 0))}
                    </div>
                    <div className="text-amber-600 text-xs">Total Dividen Terbayar</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="font-bold text-purple-700 text-xl">{allDividends.length}</div>
                    <div className="text-purple-600 text-xs">Transaksi Dividen</div>
                  </div>
                </div>

                {/* Investments with Dividend Status */}
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    Status Dividen per Investasi
                  </h3>
                  <div className="space-y-3">
                    {myInvestments.map((inv: any) => {
                      const divs = inv.dividendHistory || [];
                      const totalPaid = divs.reduce((s: number, d: any) => s + (d.nominal || 0), 0);
                      const lastDiv = divs.length > 0 ? divs.sort((a: any, b: any) => 
                        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())[0] : null;
                      return (
                        <div key={inv.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm">{inv.namaPerusahaan}</h4>
                              <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mt-1">
                                <span>Investasi: <span className="font-semibold text-slate-700">{formatIDR(inv.nominalInvestasi)}</span></span>
                                <span>Saham: <span className="font-semibold text-slate-700">{inv.persentaseSaham}%</span></span>
                                <span>Deviden: <span className="font-semibold text-emerald-600">{inv.estimasiDividen}%</span></span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-right md:w-auto">
                              <div className="text-right">
                                <div className="font-bold text-emerald-700 text-sm">{formatIDR(totalPaid)}</div>
                                <div className="text-[10px] text-slate-400">Total Terbayar</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-slate-700 text-sm">{divs.length}</div>
                                <div className="text-[10px] text-slate-400">Kali Bayar</div>
                              </div>
                              {lastDiv && (
                                <div className="text-right">
                                  <div className="font-bold text-slate-700 text-sm">{formatIDR(lastDiv.nominal)}</div>
                                  <div className="text-[10px] text-slate-400">Terakhir: {new Date(lastDiv.tanggal).toLocaleDateString('id-ID')}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Riwayat Tab */}
        {tab === 'riwayat' && (
          <div className="p-6">
            {allDividends.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-600">Belum ada riwayat pembayaran dividen</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allDividends.map((d: any, idx: number) => (
                  <div key={`${d.investasiId}-${idx}`} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{d.namaPerusahaan}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                            {d.periode}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {d.catatan ? `Catatan: ${d.catatan}` : 'Tanpa catatan'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-700 text-lg">{formatIDR(d.nominal)}</div>
                        <div className="text-[10px] text-slate-400">{new Date(d.tanggal).toLocaleDateString('id-ID')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tambah Dividen Tab */}
        {tab === 'tambah' && (
          <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3 animate-fadeIn text-xs leading-relaxed">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Berhasil!</p>
                  <p className="text-emerald-600 mt-1">{successMessage}</p>
                </div>
              </div>
            )}

            <h3 className="font-bold text-slate-800 text-sm mb-2">Catat Pembayaran Dividen Baru</h3>
            
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Pilih Investasi</label>
              <select value={formData.investasiId} onChange={(e) => setFormData({...formData, investasiId: e.target.value})} required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                <option value="">-- Pilih Investasi --</option>
                {myInvestments.map((inv: any) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.namaPerusahaan} ({formatIDR(inv.nominalInvestasi)}) - {inv.persentaseSaham}% saham
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Periode (cth: Q1 2025, Bulan 1-3 2025)</label>
                <input type="text" required value={formData.periode} onChange={(e) => setFormData({...formData, periode: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" placeholder="Q1 2025" />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tanggal Bayar</label>
                <input type="date" required value={formData.tanggal_bayar} onChange={(e) => setFormData({...formData, tanggal_bayar: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nominal Dividen (IDR)</label>
              <input type="number" required min="1" value={formData.nominal} onChange={(e) => setFormData({...formData, nominal: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono font-bold" />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Catatan (opsional)</label>
              <textarea rows={2} value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" placeholder="Catatan tambahan..." />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setFormData({ investasiId: '', periode: '', nominal: 0, tanggal_bayar: '', catatan: '' })}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-bold">Bersihkan</button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-sm disabled:opacity-50">
                {loading ? 'Menyimpan...' : 'Simpan Dividen'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}