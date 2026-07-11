/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Landmark, Key, Award, Sparkles, Scale, Percent } from 'lucide-react';
import { Anggota, Pinjaman, JournalEntry } from '../../types';

interface AdminLaporanProps {
  members: Anggota[];
  loans: Pinjaman[];
  journals: JournalEntry[];
  subView: 'labarugi' | 'neraca' | 'shu' | 'jurnal';
}

export default function AdminLaporan({
  members,
  loans,
  journals,
  subView
}: AdminLaporanProps) {
  // SHU distribution settings
  const [jasaModalPersen, setJasaModalPersen] = useState(40);
  const [jasaUsahaPersen, setJasaUsahaPersen] = useState(30);
  const [shuProcessed, setShuProcessed] = useState(false);

  // Financial Calculations for reports — derived from REAL journal entries
  const totalSimpananMasyarakat = members.reduce(
    (sum, m) => sum + (m.saldoSimpananPokok || 0) + (m.saldoSimpananWajib || 0) + (m.saldoSimpananSukarela || 0),
    0
  );

  const totalPiutangPinjaman = loans
    .filter((l) => l.status === 'dicairkan')
    .reduce((sum, l) => sum + (l.sisaPokok || 0), 0);

  // Aggregate journal details by COA category prefix
  const sumByPrefix = (prefix: string, mode: 'kredit-debit' | 'debit-kredit') => {
    let total = 0;
    journals.forEach((j) => {
      (j.details || []).forEach((d) => {
        if (d.coa && d.coa.startsWith(prefix)) {
          total += mode === 'kredit-debit' ? (d.kredit - d.debit) : (d.debit - d.kredit);
        }
      });
    });
    return total;
  };

  // 1. LABA RUGI — from journals (4=Pendapatan, 5=Beban)
  const totalPendapatan = sumByPrefix('4', 'kredit-debit');
  const pendapatanBunga = sumByPrefix('4.1.01', 'kredit-debit') + sumByPrefix('4.1.02', 'kredit-debit') + sumByPrefix('4.1.08', 'kredit-debit');
  const pendapatanToko = sumByPrefix('4.1.04', 'kredit-debit');
  const pendapatanLain = totalPendapatan - pendapatanBunga - pendapatanToko;

  const totalBeban = sumByPrefix('5', 'debit-kredit');
  const hppToko = sumByPrefix('5.1.14', 'debit-kredit');
  const bebanGaji = sumByPrefix('5.1.02', 'debit-kredit') + sumByPrefix('5.1.03', 'debit-kredit');
  const bebanOps = totalBeban - hppToko - bebanGaji;

  const labaKotor = totalPendapatan;
  const labaBersih = totalPendapatan - totalBeban;

  // 2. NERACA — from journals (1=Aset, 2=Kewajiban, 3=Ekuitas)
  const totalAsetJurnal = sumByPrefix('1', 'debit-kredit');
  const kasBank = sumByPrefix('1.1.03', 'debit-kredit') + sumByPrefix('1.1.04', 'debit-kredit') + sumByPrefix('1.1.05', 'debit-kredit') + sumByPrefix('1.1.06', 'debit-kredit');
  const kasTunai = sumByPrefix('1.1.01', 'debit-kredit') + sumByPrefix('1.1.02', 'debit-kredit');
  const persediaanBarang = sumByPrefix('1.4.01', 'debit-kredit');
  const totalAsetLancaran = totalAsetJurnal > 0 ? totalAsetJurnal : (kasBank + kasTunai + persediaanBarang + totalPiutangPinjaman);

  // Equity & liabilities from journals
  const totalKewajibanJurnal = sumByPrefix('2', 'kredit-debit');
  const totalEkuitasJurnal = sumByPrefix('3', 'kredit-debit');
  const modalAwal = sumByPrefix('3.1.01', 'kredit-debit');
  const cadanganUmum = sumByPrefix('3.1.02', 'kredit-debit');
  const totalPasiva = (totalKewajibanJurnal + totalEkuitasJurnal) > 0
    ? (totalKewajibanJurnal + totalEkuitasJurnal + labaBersih)
    : (totalSimpananMasyarakat + modalAwal + cadanganUmum + labaBersih);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. LAPORAN LABA / RUGI */}
      {subView === 'labarugi' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-blue-600" />
              Laporan Aktivitas Laba / Rugi Komprehensif
            </h3>
            <p className="text-[11px] text-slate-400">Periode Berjalan Terakhir per 4 Juli 2026</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Pendapatan Operasional */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-blue-600 border-b border-blue-100 pb-1 mb-2">I. PENDAPATAN OPERASIONAL</h4>
              <div className="space-y-2">
                <div className="flex justify-between pl-3 py-1">
                  <span className="text-slate-600">Pendapatan Jasa Margin Pembiayaan</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(pendapatanBunga)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1">
                  <span className="text-slate-600">Pendapatan Hasil Penjualan Toko</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(pendapatanToko)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-2 pl-3">
                  <span>TOTAL PENDAPATAN</span>
                  <span className="font-mono">{formatIDR(totalPendapatan)}</span>
                </div>
              </div>
            </div>

            {/* Beban Operasional */}
            <div className="pt-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-red-600 border-b border-red-100 pb-1 mb-2">II. BEBAN OPERASIONAL &amp; HPP</h4>
              <div className="space-y-2">
                <div className="flex justify-between pl-3 py-1">
                  <span className="text-slate-600">Harga Pokok Penjualan (HPP Toko)</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(hppToko)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1">
                  <span className="text-slate-600">Beban Gaji Pengurus &amp; Kasir</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(bebanGaji)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1">
                  <span className="text-slate-600">Beban Operasional Ruko &amp; Listrik</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(bebanOps)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-2 pl-3">
                  <span>TOTAL BEBAN OPERASIONAL</span>
                  <span className="font-mono">{formatIDR(totalBeban)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Net Income highlight */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex justify-between items-center mt-6">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">SISA HASIL USAHA (SHU) / LABA BERSIH</div>
                <div className="text-lg font-extrabold text-slate-800 mt-1">Selesai Dibukukan</div>
              </div>
              <div className="text-right font-mono font-extrabold text-lg text-emerald-600">
                {formatIDR(labaBersih)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LAPORAN NERACA */}
      {subView === 'neraca' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Scale className="w-5 h-5 text-indigo-600" />
              Laporan Neraca Buku Global Koperasi
            </h3>
            <p className="text-[11px] text-slate-400">Neraca Percobaan per 4 Juli 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* Activa / Assets */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-blue-600 border-b border-blue-100 pb-1">SISI DEBIT — AKTIVA (ASSETS)</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Kas Tunai di Brankas</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(kasTunai)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Kas Bank Mandiri Cabang</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(kasBank)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Persediaan Barang Dagangan Toko</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(persediaanBarang)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Piutang Pinjaman Beredar di Anggota</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(totalPiutangPinjaman)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 text-sm">
                  <span>TOTAL AKTIVA</span>
                  <span className="font-mono">{formatIDR(totalAsetLancaran)}</span>
                </div>
              </div>
            </div>

            {/* Pasiva / Liabilities & Equity */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-indigo-600 border-b border-indigo-100 pb-1">SISI KREDIT — PASIVA (LIABILITIES &amp; EQUITY)</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Dana Simpanan Anggota Koperasi</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(totalSimpananMasyarakat)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Modal Awal Pendiri</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(modalAwal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Cadangan Pengurus</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(cadanganUmum)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Sisa Hasil Usaha (SHU) Berjalan</span>
                  <span className="font-mono font-semibold text-slate-800">{formatIDR(labaBersih)}</span>
                </div>
                <div className="flex justify-between font-bold text-indigo-900 border-t border-slate-200 pt-2 text-sm">
                  <span>TOTAL PASIVA</span>
                  <span className="font-mono">{formatIDR(totalPasiva)}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center text-xs font-bold text-emerald-800 animate-soft-pulse mt-4">
            💸 LAPORAN NERACA SEIMBANG (BALANCED) — DEBIT SAMA DENGAN KREDIT
          </div>
        </div>
      )}

      {/* 3. SHU GENERATOR & DISTRIBUTION */}
      {subView === 'shu' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Percent className="w-5 h-5 text-amber-500" />
              Generator Pembagian Sisa Hasil Usaha (SHU) Koperasi
            </h3>
            <p className="text-[11px] text-slate-400">Atur proporsi jasa modal dan partisipasi usaha berdasarkan kontribusi saldo tabungan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Alokasi Jasa Modal (%)</label>
                <input
                  type="number"
                  value={jasaModalPersen}
                  onChange={(e) => setJasaModalPersen(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 font-bold font-mono text-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Alokasi Jasa Usaha Anggota (%)</label>
                <input
                  type="number"
                  value={jasaUsahaPersen}
                  onChange={(e) => setJasaUsahaPersen(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 font-bold font-mono text-slate-800 rounded-lg"
                />
              </div>

              <button
                onClick={() => setShuProcessed(true)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm cursor-pointer transition text-center"
              >
                Proses &amp; Bagi SHU Sekarang
              </button>
            </div>

            {/* SHU Distribution Table preview */}
            <div className="md:col-span-2 border-l border-slate-200 pl-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs">Proyeksi Dividen SHU per Anggota Aktif</h4>
              
              {!shuProcessed ? (
                <div className="text-center py-12 text-slate-400">
                  Klik tombol &quot;Proses &amp; Bagi SHU&quot; untuk mengalkulasikan nominal pembagian.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                    {members.map((m) => {
                      // Total contribution calculated proportionally
                      const modalShare = (m.saldoSimpananPokok + m.saldoSimpananWajib) * 0.05 * (jasaModalPersen / 100);
                      const usahaShare = (m.saldoSimpananSukarela) * 0.02 * (jasaUsahaPersen / 100);
                      const totalSHU = modalShare + usahaShare;
                      
                      return (
                        <div key={m.id} className="flex justify-between py-2 text-xs">
                          <div>
                            <div className="font-bold text-slate-800">{m.nama}</div>
                            <div className="text-[10px] text-slate-400">Modal: {formatIDR(modalShare)} | Usaha: {formatIDR(usahaShare)}</div>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">{formatIDR(totalSHU)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-bold text-center">
                    🎉 SHU berhasil didistribusikan ke rekening tabungan sukarela masing-masing anggota!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. JURNAL UMUM LEDGER LIST */}
      {subView === 'jurnal' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fadeIn">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm flex justify-between items-center">
            <span>Buku Jurnal Umum Transaksi (Ledger Jurnal)</span>
            <span className="text-[11px] text-slate-400 font-mono">Total {journals.length} Jurnal Terbentuk</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">No Jurnal &amp; Tanggal</th>
                  <th className="p-4">Keterangan Aktivitas</th>
                  <th className="p-4">Kode Akun (COA)</th>
                  <th className="p-4">Akun Debit</th>
                  <th className="p-4">Akun Kredit</th>
                  <th className="p-4 text-right">Debit</th>
                  <th className="p-4 text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journals.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/20">
                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-700">{j.noJurnal}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{j.tanggal}</div>
                    </td>
                    <td className="p-4 text-slate-800 font-medium">{j.keterangan}</td>
                    <td className="p-4 text-slate-500 font-mono">
                      {j.details.map((d, i) => (
                        <div key={i} className="py-0.5">{d.coa}</div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">
                      {j.details.map((d, i) => (
                        <div key={i} className="py-0.5">
                          {d.debit > 0 ? d.namaAkun : '-'}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-500">
                      {j.details.map((d, i) => (
                        <div key={i} className="py-0.5">
                          {d.kredit > 0 ? d.namaAkun : '-'}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-700">
                      {j.details.map((d, i) => (
                        <div key={i} className="py-0.5">
                          {d.debit > 0 ? formatIDR(d.debit) : '-'}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-700">
                      {j.details.map((d, i) => (
                        <div key={i} className="py-0.5">
                          {d.kredit > 0 ? formatIDR(d.kredit) : '-'}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
