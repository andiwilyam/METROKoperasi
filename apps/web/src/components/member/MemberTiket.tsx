/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LifeBuoy, Send, CheckCircle, Clock, X } from 'lucide-react';
import { TiketBantuan, UserSession, Anggota } from '../../types';

interface MemberTiketProps {
  session: UserSession;
  members: Anggota[];
  tickets: TiketBantuan[];
  onAddTicket: (newTicket: Omit<TiketBantuan, 'id' | 'anggotaNama' | 'tanggal' | 'status' | 'balasanAdmin'>) => void;
}

export default function MemberTiket({
  session,
  members,
  tickets,
  onAddTicket
}: MemberTiketProps) {
  const member = members.find((m) => m.id === session.memberId);
  const myTickets = tickets.filter((t) => t.anggotaId === session.memberId);

  // New ticket state
  const [subjek, setSubjek] = useState('');
  const [kategori, setKategori] = useState<'Simpanan' | 'Pinjaman' | 'Toko' | 'Aplikasi' | 'Lainnya'>('Simpanan');
  const [prioritas, setPrioritas] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Rendah');
  const [pesan, setPesan] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjek.trim() || !pesan.trim()) return;

    onAddTicket({
      anggotaId: session.memberId!,
      subjek,
      kategori,
      prioritas,
      pesan
    });

    setSuccess(true);
    setSubjek('');
    setPesan('');
  };

  return (
    <div className="space-y-6">
      
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-start gap-3 relative animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="pr-6 leading-relaxed">
            <h4 className="font-bold mb-0.5">Tiket Bantuan Dikirim!</h4>
            <p>Keluhan atau pertanyaan Anda telah masuk antrean Customer Service. Kami akan merespon tiket Anda secepatnya.</p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="absolute right-3 top-3 text-emerald-500 hover:text-emerald-700 p-1 rounded-lg cursor-pointer animate-soft-pulse"
          >
            ❌
          </button>
        </div>
      )}

      {/* Grid: Left create ticket form, Right tickets list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        
        {/* Submit Ticket Form */}
        <form onSubmit={handleCreateTicket} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              Pusat Bantuan &amp; Layanan Pengaduan
            </h3>
            <p className="text-slate-400">Ajukan pertanyaan atau laporkan kendala operasional portal Anda.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Judul Subjek Singkat</label>
              <input
                type="text"
                placeholder="Contoh: Kesalahan nominal transfer"
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
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="Simpanan">Simpanan</option>
                  <option value="Pinjaman">Pinjaman / Kredit</option>
                  <option value="Toko Koperasi">Toko Koperasi</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Prioritas Keluhan</label>
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="Biasa">Biasa / Low</option>
                  <option value="Tinggi">Tinggi / Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1.5">Isi Pesan Detail Keluhan Anda</label>
              <textarea
                placeholder="Deskripsikan kronologi atau nomor referensi setoran agar CS kami dapat melacak data secara akurat..."
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
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow cursor-pointer transition text-center flex items-center justify-center gap-1.5 mt-2"
          >
            <Send className="w-4 h-4" />
            Kirim Pengaduan Tiket
          </button>
        </form>

        {/* Existing Member Support Tickets list */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
            Daftar Tiket Dukungan Anda
          </div>

          {myTickets.length === 0 ? (
            <div className="text-center py-20 text-slate-400">Belum ada riwayat tiket pengaduan diajukan.</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
              {myTickets.map((t) => (
                <div key={t.id} className="p-4 space-y-2.5 bg-slate-50/50 hover:bg-slate-100/30 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold text-white mr-1.5 ${
                        t.prioritas === 'Tinggi' ? 'bg-red-500' : 'bg-slate-400'
                      }`}>
                        {t.prioritas}
                      </span>
                      <span className="font-bold text-slate-800">{t.subjek}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">{t.tanggal}</span>
                  </div>

                  <p className="text-slate-600 italic leading-relaxed text-[11px] bg-white border border-slate-100 rounded p-2.5">
                    &quot;{t.pesan}&quot;
                  </p>

                  <div className="flex justify-between items-center text-[10px]">
                    <div className="text-slate-400">Kategori: <span className="font-bold text-slate-500">{t.kategori}</span></div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${
                      t.status === 'Terbuka'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  {t.balasanAdmin && (
                    <div className="bg-blue-50/50 border border-blue-100 text-blue-900 rounded p-2.5 text-[11px] leading-relaxed">
                      <span className="font-bold">Balasan CS Staff: </span>
                      <span>{t.balasanAdmin}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
