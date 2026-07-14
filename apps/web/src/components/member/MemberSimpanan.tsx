/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Anggota, JenisSimpanan, SimpananTransaksi, UserSession, PermohonanTarik, BuktiTransfer } from '@metrocoop/shared/types';

interface MemberSimpananProps {
  session: UserSession;
  members: Anggota[];
  savingsTypes: JenisSimpanan[];
  onUploadReceipt: (newReceipt: Omit<BuktiTransfer, 'id' | 'tanggal' | 'status'>) => void;
  onSubmitWithdrawRequest: (newReq: Omit<PermohonanTarik, 'id' | 'tanggal' | 'status'>) => void;
  initialTab?: 'setor' | 'tarik';
}

export default function MemberSimpanan({
  session,
  members,
  savingsTypes,
  onUploadReceipt,
  onSubmitWithdrawRequest,
  initialTab = 'setor'
}: MemberSimpananProps) {
  const member = members.find((m) => m.id === session.memberId);
  const currentSukarela = member?.saldoSimpananSukarela || 0;

  const [activeTab, setActiveTab] = useState<'setor' | 'tarik'>(initialTab);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. SETOR TAB STATES
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [jumlahSetor, setJumlahSetor] = useState(250000);
  const [bankPengirim, setBankPengirim] = useState('BSI');
  const [noRef, setNoRef] = useState('');
  const [keteranganSetor, setKeteranganSetor] = useState('');

  // 2. TARIK TAB STATES
  const [jumlahTarik, setJumlahTarik] = useState(50000);
  const [bankTujuan, setBankTujuan] = useState('BSI');
  const [noRekTujuan, setNoRekTujuan] = useState('');
  const [errorTarik, setErrorTarik] = useState('');

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleSetorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId || jumlahSetor <= 0 || !noRef) return;

    const type = savingsTypes.find((t) => t.id === selectedTypeId);
    if (!type) return;

    onUploadReceipt({
      anggotaId: session.memberId!,
      anggotaNama: member?.nama || 'Anggota',
      jenisSimpananId: selectedTypeId,
      jenisNama: type.nama,
      jumlah: jumlahSetor,
      bankPengirim,
      noRef,
      keterangan: keteranganSetor || `Transfer setoran mandiri ${type.nama}`
    });

    setSuccessMessage(`Bukti setoran transfer senilai ${formatIDR(jumlahSetor)} berhasil dikirim untuk divalidasi Operator.`);
    setSelectedTypeId('');
    setJumlahSetor(250000);
    setNoRef('');
    setKeteranganSetor('');
  };

  const handleTarikSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorTarik('');

    if (jumlahTarik <= 0 || !noRekTujuan) return;

    if (jumlahTarik > currentSukarela) {
      setErrorTarik(`Jumlah penarikan melebihi saldo tabungan sukarela Anda (${formatIDR(currentSukarela)})`);
      return;
    }

    const typeSukarela = savingsTypes.find((t) => t.tipe === 'sukarela');
    if (!typeSukarela) return;

    onSubmitWithdrawRequest({
      anggotaId: session.memberId!,
      anggotaNama: member?.nama || 'Anggota',
      jenisSimpananId: typeSukarela.id,
      jenisNama: typeSukarela.nama,
      jumlah: jumlahTarik
    });

    setSuccessMessage(`Permohonan penarikan dana senilai ${formatIDR(jumlahTarik)} berhasil didaftarkan di sistem antrean loket CS.`);
    setJumlahTarik(50000);
    setNoRekTujuan('');
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('setor');
            setSuccessMessage('');
          }}
          className={`flex-1 text-center py-3 text-xs font-bold border-b-2 cursor-pointer transition ${
            activeTab === 'setor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📥 Kirim Bukti Transfer Setoran
        </button>
        <button
          onClick={() => {
            setActiveTab('tarik');
            setSuccessMessage('');
          }}
          className={`flex-1 text-center py-3 text-xs font-bold border-b-2 cursor-pointer transition ${
            activeTab === 'tarik'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📤 Pengajuan Tarik Dana Sukarela
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-start gap-3 relative animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="pr-6 leading-relaxed">
            <h4 className="font-bold mb-0.5">Transaksi Terkirim!</h4>
            <p>{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage('')}
            className="absolute right-3 top-3 text-emerald-500 hover:text-emerald-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. SETOR TAB */}
      {activeTab === 'setor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <form onSubmit={handleSetorSubmit} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Formulir Konfirmasi Pembayaran Setoran</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1.5">Pilih Simpanan Rekening</label>
                <select
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="">-- Pilih Jenis --</option>
                  {savingsTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama} (Minimum: {formatIDR(t.minimalSetoran)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Jumlah Setoran (Rp)</label>
                <input
                  type="number"
                  value={jumlahSetor}
                  min={1000}
                  step={50000}
                  onChange={(e) => setJumlahSetor(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Bank Asal Anda</label>
                <select
                  value={bankPengirim}
                  onChange={(e) => setBankPengirim(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="BCA">Bank BCA</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1.5">Nomor Referensi Transfer / ID Transaksi</label>
                <input
                  type="text"
                  placeholder="Contoh: REF983281093"
                  value={noRef}
                  onChange={(e) => setNoRef(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono font-semibold"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1.5">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Opsional, misalnya: Pembayaran simpanan wajib bulan Juli"
                  value={keteranganSetor}
                  onChange={(e) => setKeteranganSetor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 bg-slate-50/50">
              <Upload className="w-7 h-7 text-slate-400" />
              <div className="font-bold text-slate-700">Lampirkan Foto Bukti Transfer</div>
              <p className="text-[10px] text-slate-400">Pilih berkas file JPG, PNG, atau PDF (Disimulasikan)</p>
              <span className="text-[9px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase mt-1">bukti_transfer_juli.png (Simulated)</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow cursor-pointer transition text-center"
            >
              Kirim Bukti Pembayaran Setoran
            </button>
          </form>

          {/* Right panel instructions */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs text-slate-600">
            <h3 className="font-bold text-slate-800 text-sm">Instruksi Rekening Tujuan Transfer Koperasi</h3>
            <p className="leading-relaxed">
              Silakan lakukan transfer antar bank ke nomor rekening resmi Koperasi MetroCOOP di bawah ini sebelum mengirimkan form bukti setoran.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 border rounded-lg bg-slate-50 space-y-1">
                <div className="font-bold text-slate-800">Bank Mandiri</div>
                <div className="font-mono text-blue-700 font-extrabold text-sm tracking-widest">123-00-1234567-8</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">A.N. Koperasi Simpan Pinjam MetroCOOP</div>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50 space-y-1">
                <div className="font-bold text-slate-800">Bank Central Asia (BCA)</div>
                <div className="font-mono text-blue-700 font-extrabold text-sm tracking-widest">800-4567-890</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">A.N. Koperasi Simpan Pinjam MetroCOOP</div>
              </div>
            </div>

            <div className="flex gap-2 text-[10px] bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 leading-normal">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Harap pastikan nominal transfer persis sesuai rupiah yang dimasukkan di form agar sistem auto-matching mendeteksi dengan cepat.</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. TARIK TAB */}
      {activeTab === 'tarik' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <form onSubmit={handleTarikSubmit} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs animate-fadeIn">
            <h3 className="font-bold text-slate-800 text-sm">Formulir Tarik Simpanan Sukarela</h3>
            
            {errorTarik && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold">
                {errorTarik}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Saldo Sukarela Tersedia</div>
                    <div className="text-lg font-black text-slate-800 font-mono mt-0.5">{formatIDR(currentSukarela)}</div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    Bisa ditarik instan
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  value={jumlahTarik}
                  min={10000}
                  step={10000}
                  onChange={(e) => setJumlahTarik(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Bank Tujuan Pencairan</label>
                <select
                  value={bankTujuan}
                  onChange={(e) => setBankTujuan(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="Dana">DANA (E-Wallet)</option>
                  <option value="Gopay">GoPay (E-Wallet)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-600 mb-1.5">Nomor Rekening Bank / No. HP E-Wallet Anda</label>
                <input
                  type="text"
                  placeholder="Masukkan no rekening target tujuan"
                  value={noRekTujuan}
                  onChange={(e) => setNoRekTujuan(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow cursor-pointer transition text-center"
            >
              Kirim Pengajuan Tarik Dana Sukarela
            </button>
          </form>

          {/* Tarik instructions */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs text-slate-600">
            <h3 className="font-bold text-slate-800 text-sm">Ketentuan Penarikan Dana Sukarela</h3>
            <p className="leading-relaxed">
              Dana simpanan sukarela dapat ditarik sewaktu-waktu oleh anggota tanpa biaya penalti atau potongan apa pun. Namun penarikan wajib melewati proses tinjauan oleh CS/Operator dalam kurun waktu 1x24 jam demi keamanan saldo.
            </p>

            <ul className="space-y-1.5 list-disc pl-4 text-slate-500">
              <li>Dana Pokok dan Dana Wajib Koperasi tidak dapat ditarik selama Anda masih berstatus anggota resmi aktif.</li>
              <li>Limit nominal penarikan per hari maks Rp 5.000.000 melalui e-banking.</li>
              <li>Proses transfer diselenggarakan di jam kerja (Senin - Jumat, 08:00 - 15:00 WIB).</li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
