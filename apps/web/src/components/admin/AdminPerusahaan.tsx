import React, { useState } from 'react';
import { Building2, Plus, Search, Edit3, Trash2, X, Check, Globe, Phone, Mail, MapPin, User, FileText, Hash } from 'lucide-react';

interface Props {
  perusahaan: any[];
  onAdd: (data: any) => Promise<any>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
  aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  nonaktif: 'bg-slate-100 text-slate-600 border-slate-200',
  pengajuan: 'bg-amber-50 text-amber-700 border-amber-200',
  disetujui: 'bg-blue-50 text-blue-700 border-blue-200',
  dicairkan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  selesai: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ditolak: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
  aktif: 'AKTIF',
  pending: 'PENDING',
  approved: 'DISETUJUI',
  rejected: 'DITOLAK',
  nonaktif: 'NONAKTIF',
  pengajuan: 'PENGAJUAN',
  disetujui: 'DISETUJUI',
  dicairkan: 'DICAIRKAN',
  selesai: 'SELESAI',
  ditolak: 'DITOLAK',
};

const emptyForm = {
  kodePerusahaan: '', nama: '', sektorIndustri: '', namaDirektur: '', alamat: '',
  kota: '', provinsi: '', tahunBerdiri: '', noAktePendirian: '', npwp: '',
  noIzinUsaha: '', kontakDirektur: '', emailPerusahaan: '', telepon: '',
  website: '', deskripsi: '', status: 'aktif'
};

export default function AdminPerusahaan({ perusahaan, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<any>(null);

  const filtered = perusahaan.filter((p: any) =>
    (p.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sektorIndustri || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.kota || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.namaDirektur || '').toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const handleSave = async () => {
    if (!form.nama) { alert('Nama perusahaan wajib diisi!'); return; }
    const payload = { ...form, tahunBerdiri: Number(form.tahunBerdiri) || null };
    if (editId) { await onUpdate(editId, payload); } else { await onAdd(payload); }
    setShowForm(false); resetForm();
  };

  const handleEdit = (p: any) => {
    setForm({
      kodePerusahaan: p.kodePerusahaan || '', nama: p.nama || '', sektorIndustri: p.sektorIndustri || '',
      namaDirektur: p.namaDirektur || '', alamat: p.alamat || '', kota: p.kota || '',
      provinsi: p.provinsi || '', tahunBerdiri: p.tahunBerdiri || '', noAktePendirian: p.noAktePendirian || '',
      npwp: p.npwp || '', noIzinUsaha: p.noIzinUsaha || '', kontakDirektur: p.kontakDirektur || '',
      emailPerusahaan: p.emailPerusahaan || '', telepon: p.telepon || '', website: p.website || '',
      deskripsi: p.deskripsi || '', status: p.status || 'aktif'
    });
    setEditId(p.id); setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Data Perusahaan & Mitra Bisnis
          </h3>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" /> Tambah Perusahaan
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari perusahaan, sektor, kota, direktur..." className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400 text-xs">Belum ada data perusahaan.</div>
          )}
          {filtered.map((p: any) => (
            <div key={p.id} className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white" onClick={() => setDetail(p)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{p.nama}</div>
                  <div className="text-[10px] text-blue-600 font-semibold">{p.sektorIndustri || '-'}</div>
                  <div className="text-[10px] text-slate-400">{p.kodePerusahaan || '-'}</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${STATUS_STYLES[p.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {STATUS_LABEL[p.status] || (p.status || '-').toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1"><User className="w-3 h-3" /> {p.namaDirektur || '-'}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.kota || '-'}{p.provinsi ? `, ${p.provinsi}` : ''}</div>
              </div>
              <div className="flex justify-end gap-1.5 mt-2 pt-2 border-t border-slate-100">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="p-1 hover:bg-blue-50 rounded"><Edit3 className="w-3.5 h-3.5 text-blue-500" /></button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-sm mb-4">{editId ? 'Edit' : 'Tambah'} Perusahaan</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><label className="block font-semibold text-slate-600 mb-1">Kode Perusahaan</label><input value={form.kodePerusahaan} onChange={e => setForm(f => ({ ...f, kodePerusahaan: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Nama Perusahaan *</label><input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Nama Direktur</label><input value={form.namaDirektur} onChange={e => setForm(f => ({ ...f, namaDirektur: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Sektor Industri</label><input value={form.sektorIndustri} onChange={e => setForm(f => ({ ...f, sektorIndustri: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">Alamat</label><input value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Kota</label><input value={form.kota} onChange={e => setForm(f => ({ ...f, kota: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Provinsi</label><input value={form.provinsi} onChange={e => setForm(f => ({ ...f, provinsi: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Tahun Berdiri</label><input type="number" value={form.tahunBerdiri || ''} onChange={e => setForm(f => ({ ...f, tahunBerdiri: Number(e.target.value) }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">No. Akte Pendirian</label><input value={form.noAktePendirian} onChange={e => setForm(f => ({ ...f, noAktePendirian: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">NPWP</label><input value={form.npwp} onChange={e => setForm(f => ({ ...f, npwp: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">No. Izin Usaha</label><input value={form.noIzinUsaha} onChange={e => setForm(f => ({ ...f, noIzinUsaha: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Kontak Direktur</label><input value={form.kontakDirektur} onChange={e => setForm(f => ({ ...f, kontakDirektur: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Email</label><input value={form.emailPerusahaan} onChange={e => setForm(f => ({ ...f, emailPerusahaan: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Telepon</label><input value={form.telepon} onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border p-2 rounded-lg"><option value="aktif">Aktif</option><option value="pending">Pending</option><option value="approved">Disetujui</option><option value="rejected">Ditolak</option><option value="nonaktif">Nonaktif</option></select></div>
              <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">Deskripsi</label><textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} className="w-full border p-2 rounded-lg" rows={3} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600">Batal</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"><Check className="w-3.5 h-3.5 inline mr-1" /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">{detail.nama}</h3>
              <button onClick={() => setDetail(null)} className="p-1 hover:bg-slate-100 rounded"><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><Hash className="w-3 h-3" /> Kode</span><p className="text-slate-800">{detail.kodePerusahaan || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><User className="w-3 h-3" /> Direktur</span><p className="text-slate-800">{detail.namaDirektur || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Sektor</span><p className="text-slate-800">{detail.sektorIndustri || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" /> Lokasi</span><p className="text-slate-800">{detail.kota || '-'}{detail.provinsi ? `, ${detail.provinsi}` : ''}</p></div>
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><Phone className="w-3 h-3" /> Telepon</span><p className="text-slate-800">{detail.telepon || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span><p className="text-slate-800">{detail.emailPerusahaan || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span><p className="text-slate-800">{detail.website || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Tahun Berdiri</span><p className="text-slate-800">{detail.tahunBerdiri || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">NPWP</span><p className="text-slate-800">{detail.npwp || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">No. Izin Usaha</span><p className="text-slate-800">{detail.noIzinUsaha || '-'}</p></div>
              </div>
              <div className="border-t pt-3"><span className="text-slate-400 font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" /> Alamat</span><p className="text-slate-600">{detail.alamat || '-'}</p></div>
              <div className="border-t pt-3"><span className="text-slate-400 font-semibold flex items-center gap-1"><FileText className="w-3 h-3" /> Deskripsi</span><p className="text-slate-600">{detail.deskripsi || '-'}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-xl p-5 max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Hapus Perusahaan?</h3>
            <p className="text-xs text-slate-500">Data perusahaan akan dihapus permanen. Lanjutkan?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600">Batal</button>
              <button onClick={async () => { await onDelete(deleteId); setDeleteId(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
