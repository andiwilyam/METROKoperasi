import React, { useState } from 'react';
import { LifeBuoy, Send, CheckCircle, Clock, X, AlertCircle, HelpCircle, FileText, MessageSquare } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';

export default function MemberPerusahaanTiket({ session }: { session: any }) {
  const { tickets, fetchTickets, addTicket, replyTicket } = useDataStore();
  
  // Filter tickets for this company
  const myTickets = tickets.filter((t: any) => 
    t.perusahaanId === session.perusahaanId || t.perusahaanId === session.id || 
    t.anggotaId === session.memberId || t.userId === session.id
  );

  // Form state
  const [subjek, setSubjek] = useState('');
  const [kategori, setKategori] = useState<'Simpanan' | 'Pinjaman' | 'Ventura' | 'Aplikasi' | 'Lainnya'>('Ventura');
  const [prioritas, setPrioritas] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
  const [pesan, setPesan] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjek.trim() || !pesan.trim()) return;

    addTicket({
      perusahaanId: session.perusahaanId || session.id,
      userId: session.id,
      subjek,
      kategori,
      prioritas,
      pesan,
    });

    setSuccess(true);
    setSubjek('');
    setPesan('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Terbuka') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'Diproses') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getPriorityStyle = (priority: string) => {
    if (priority === 'Tinggi') return 'bg-red-50 text-red-700';
    if (priority === 'Sedang') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-orange-700 to-amber-700 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <LifeBuoy className="w-5 h-5 text-amber-200" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Pusat Bantuan</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Tiket Bantuan & Pengaduan</h1>
        <p className="text-xs text-slate-300 mt-1">Laporkan kendala, ajukan pertanyaan, atau minta bantuan teknis</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3 animate-fadeIn text-xs leading-relaxed">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Tiket Bantuan Dikirim!</p>
            <p className="text-emerald-600 mt-1">Keluhan atau pertanyaan Anda telah masuk antrean. Tim CS kami akan merespon secepatnya.</p>
          </div>
          <button onClick={() => setSuccess(false)} className="absolute right-3 top-3 text-emerald-500 hover:text-emerald-700 p-1 rounded-lg cursor-pointer">✕</button>
        </div>
      )}

      {/* Layout: Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Ticket Form */}
        <form onSubmit={handleCreateTicket} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              Buat Tiket Baru
            </h3>
            <p className="text-slate-400 text-xs">Isi formulir di bawah untuk mengajukan keluhan atau pertanyaan.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Judul Subjek Singkat</label>
              <input
                type="text"
                placeholder="Contoh: Error saat upload prospektus"
                value={subjek}
                onChange={(e) => setSubjek(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Kategori Masalah</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="Ventura">Ventura / Investasi</option>
                  <option value="Simpanan">Simpanan</option>
                  <option value="Pinjaman">Pinjaman / Kredit</option>
                  <option value="Aplikasi">Aplikasi / Teknis</option>
                  <option value="Lainnya">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Prioritas Keluhan</label>
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="Rendah">Biasa / Low</option>
                  <option value="Sedang">Sedang / Normal</option>
                  <option value="Tinggi">Tinggi / Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Isi Pesan Detail</label>
              <textarea
                placeholder="Deskripsikan kronologi, nomor referensi, atau screenshot error agar CS kami dapat melacak data secara akurat..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                required
                rows={4}
                className="w-full border p-2.5 text-xs rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow cursor-pointer transition text-center flex items-center justify-center gap-1.5 mt-2"
          >
            <Send className="w-4 h-4" />
            Kirim Tiket Bantuan
          </button>
        </form>

        {/* Tickets List */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-red-600" />
            Daftar Tiket Anda ({myTickets.length})
          </div>

          {myTickets.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-slate-600">Belum ada tiket pengaduan</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan formulir di samping untuk membuat tiket pertama</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {myTickets.map((t) => (
                <div key={t.id} className="p-4 space-y-2.5 bg-slate-50/50 hover:bg-slate-100/30 transition cursor-pointer"
                  onClick={() => setShowDetail(t)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold text-white mr-1.5 ${getPriorityStyle(t.prioritas)}`}>
                        {t.prioritas}
                      </span>
                      <span className="font-bold text-slate-800">{t.subjek}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ml-2 ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">{formatDate(t.tanggal || t.createdAt)}</span>
                  </div>

                  <p className="text-slate-600 italic leading-relaxed text-[11px] bg-white border border-slate-100 rounded p-2.5">
                    "{t.pesan}"
                  </p>

                  <div className="flex justify-between items-center text-[10px]">
                    <div className="text-slate-400">Kategori: <span className="font-bold text-slate-500">{t.kategori}</span></div>
                    {t.balasanAdmin && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Sudah Dibalas
                      </span>
                    )}
                  </div>

                  {t.balasanAdmin && (
                    <div className="bg-blue-50/50 border border-blue-100 text-blue-900 rounded p-2.5 text-[11px] leading-relaxed">
                      <span className="font-bold">Balasan CS: </span>
                      <span>{t.balasanAdmin}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-red-600 text-white rounded-t-xl">
              <h3 className="font-bold text-sm">Detail Tiket: {showDetail.subjek}</h3>
              <button onClick={() => setShowDetail(null)} className="hover:bg-red-500 p-1 rounded-full text-slate-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getPriorityStyle(showDetail.prioritas)}`}>
                  Prioritas: {showDetail.prioritas}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusStyle(showDetail.status)}`}>
                  Status: {showDetail.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-50 text-slate-700 border-slate-200">
                  Kategori: {showDetail.kategori}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div><span className="text-slate-400 block">Tanggal</span> <span className="font-semibold text-slate-700">{formatDate(showDetail.tanggal || showDetail.createdAt)}</span></div>
                <div><span className="text-slate-400 block">ID Tiket</span> <span className="font-mono text-slate-600">{showDetail.id}</span></div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <span className="font-bold text-slate-700">Isi Pesan:</span>
                <p className="text-slate-600 mt-1 whitespace-pre-wrap">{showDetail.pesan}</p>
              </div>
              {showDetail.balasanAdmin && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                  <span className="font-bold text-blue-800 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Balasan CS Staff
                  </span>
                  <div className="text-blue-900 whitespace-pre-wrap">{showDetail.balasanAdmin}</div>
                  {showDetail.balasanTanggal && (
                    <span className="text-[9px] text-blue-600">Dibalas: {formatDate(showDetail.balasanTanggal)}</span>
                  )}
                </div>
              )}
              {!showDetail.balasanAdmin && showDetail.status === 'Terbuka' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-center">
                  <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                  Tiket ini belum mendapat balasan dari tim CS.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}