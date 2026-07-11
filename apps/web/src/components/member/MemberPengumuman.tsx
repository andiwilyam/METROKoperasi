import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Bell, AlertCircle, CheckCircle, X, Clock } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';

export default function MemberPengumuman({ session }: { session: any }) {
  const { announcements, fetchAnnouncements } = useDataStore();
  const [activeTab, setActiveTab] = useState<'semua' | 'penting' | 'arsip'>('semua');
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Filter announcements for this company (visible to all or targeted)
  const visibleAnnouncements = announcements.filter((a: any) => 
    a.targetRoles?.includes('perusahaan') || 
    a.targetRoles?.includes('all') || 
    !a.targetRoles || 
    a.targetRoles.length === 0
  );

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      'pengumuman': 'bg-blue-50 text-blue-700 border-blue-200',
      'promo': 'bg-purple-50 text-purple-700 border-purple-200',
      'peraturan': 'bg-red-50 text-red-700 border-red-200',
      'event': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return styles[type] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'pengumuman': 'Pengumuman',
      'promo': 'Promo',
      'peraturan': 'Peraturan',
      'event': 'Acara',
      'maintenance': 'Maintenance',
    };
    return labels[type] || type;
  };

  const filteredAnnouncements = visibleAnnouncements.filter((a: any) => {
    if (activeTab === 'penting') return a.priority === 'tinggi' || a.pinned;
    if (activeTab === 'arsip') return a.status === 'arsip';
    return a.status !== 'arsip';
  }).sort((a, b) => {
    // Pinned first, then by date
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt || b.tanggal).getTime() - new Date(a.createdAt || a.tanggal).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="w-5 h-5 text-amber-200" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Pengumuman</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Informasi Resmi Koperasi</h1>
        <p className="text-xs text-slate-300 mt-1">Pengumuman, promo, peraturan, dan jadwal maintenance dari pengurus</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex flex-wrap gap-1" role="tablist">
        <button role="tab" aria-selected={activeTab === 'semua'} onClick={() => setActiveTab('semua')}
          className={`flex-1 min-w-[100px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'semua' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <Megaphone className="w-3.5 h-3.5 inline mr-1.5" />
          Semua ({visibleAnnouncements.length})
        </button>
        <button role="tab" aria-selected={activeTab === 'penting'} onClick={() => setActiveTab('penting')}
          className={`flex-1 min-w-[100px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'penting' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <AlertCircle className="w-3.5 h-3.5 inline mr-1.5" />
          Penting ({visibleAnnouncements.filter(a => a.priority === 'tinggi' || a.pinned).length})
        </button>
        <button role="tab" aria-selected={activeTab === 'arsip'} onClick={() => setActiveTab('arsip')}
          className={`flex-1 min-w-[100px] px-4 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'arsip' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}>
          <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />
          Arsip ({visibleAnnouncements.filter(a => a.status === 'arsip').length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-600">Tidak ada pengumuman</p>
            <p className="text-xs text-slate-400 mt-1">Pengumuman baru dari pengurus akan muncul di sini</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAnnouncements.map((ann: any) => (
              <div 
                key={ann.id} 
                className={`p-5 hover:bg-slate-50/50 transition ${ann.pinned ? 'bg-amber-50/30 border-l-4 border-amber-500' : ''}`}
                onClick={() => setShowDetail(ann)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getTypeBadge(ann.type)}`}>
                        {getTypeLabel(ann.type)}
                      </span>
                      {ann.priority === 'tinggi' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Prioritas Tinggi
                        </span>
                      )}
                      {ann.pinned && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                          <Bell className="w-3 h-3" /> Diping
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{ann.judul}</h4>
                    <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">{ann.isi}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ann.tanggal || ann.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      {ann.expiredAt && (
                        <span className="flex items-center gap-1 text-red-600">
                          <Clock className="w-3 h-3" />
                          Berlaku s.d: {new Date(ann.expiredAt).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:ml-4">
                    <span className="text-[10px] text-slate-400">Klik untuk baca</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-orange-600 text-white rounded-t-xl">
              <h3 className="font-bold text-sm">Detail Pengumuman</h3>
              <button onClick={() => setShowDetail(null)} className="hover:bg-orange-500 p-1 rounded-full text-slate-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getTypeBadge(showDetail.type)}`}>
                  {getTypeLabel(showDetail.type)}
                </span>
                {showDetail.priority === 'tinggi' && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Prioritas Tinggi
                  </span>
                )}
                {showDetail.pinned && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Diping
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-lg">{showDetail.judul}</h4>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{showDetail.isi}</div>
              
              <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <span className="text-slate-400 block">Tanggal Terbit</span>
                  <span className="font-semibold text-slate-700">{new Date(showDetail.tanggal || showDetail.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="font-semibold text-slate-700 capitalize">{showDetail.status || 'aktif'}</span>
                </div>
                {showDetail.expiredAt && (
                  <div>
                    <span className="text-slate-400 block">Berlaku Sampai</span>
                    <span className="font-semibold text-red-600">{new Date(showDetail.expiredAt).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block">Target Audiens</span>
                  <span className="font-semibold text-slate-700">{showDetail.targetRoles?.join(', ') || 'Semua'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}