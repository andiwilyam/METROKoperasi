import React, { useState } from 'react';
import { Building2, Plus, Search, Edit3, Trash2, X, Check, Globe, Phone, Mail, MapPin, User, FileText } from 'lucide-react';

interface Props {
  perusahaan: any[];
  onAdd: (data: any) => Promise<any>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = {
  kodePerusahaan: '', nama: '', alamat: '', kota: '', provinsi: '',
  sektorIndustri: '', tahunBerdiri: undefined as number | undefined,
  noAktePendirian: '', npwp: '', noIzinUsaha: '',
  namaDirektur: '', kontakDirektur: '', emailPerusahaan: '', telepon: '', website: '',
  deskripsi: '', status: 'aktif'
};

export default function AdminPerusahaan({ perusahaan, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<any>(null);

  const filtered = perusahaan.filter((p: any) =>
    p.nama?.toLowerCase().includes(search.toLowerCase()) ||
    p.kodePerusahaan?.toLowerCase().includes(search.toLowerCase()) ||
    p.sektorIndustri?.toLowerCase().includes(search.toLowerCase()) ||
    p.namaDirektur?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const handleSave = async () => {
    if (!form.nama) { alert('Nama perusahaan wajib diisi!'); return; }
    if (editId) { await onUpdate(editId, form); } else { await onAdd(form); }
    setShowForm(false); resetForm();
  };

  const handleEdit = (p: any) => {
    setForm({
      kodePerusahaan: p.kodePerusahaan || '', nama: p.nama, alamat: p.alamat || '',
      kota: p.kota || '', provinsi: p.provinsi || '', sektorIndustri: p.sektorIndustri || '',
      tahunBerdiri: p.tahunBerdiri || undefined, noAktePendirian: p.noAktePendirian || '',
      npwp: p.npwp || '', noIzinUsaha: p.noIzinUsaha || '', namaDirektur: p.namaDirektur || '',
      kontakDirektur: p.kontakDirektur || '', emailPerusahaan: p.emailPerusahaan || '',
      telepon: p.telepon || '', website: p.website || '', deskripsi: p.deskripsi || '',
      status: p.status || 'aktif'
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari perusahaan, sektor, direktur..." className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs" />
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
                  <div className="text-[10px] text-blue-600 font-semibold">{p.kodePerusahaan}</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${p.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  {p.status?.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.kota || '-'}, {p.provinsi || '-'}</div>
                <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {p.sektorIndustri || '-'}</div>
                <div className="flex items-center gap-1"><User className="w-3 h-3" /> {p.namaDirektur || '-'}</div>
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
              <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">Nama Perusahaan *</label><input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Kode Perusahaan</label><input value={form.kodePerusahaan} onChange={e => setForm(f => ({ ...f, kodePerusahaan: e.target.value }))} className="w-full border p-2 rounded-lg" placeholder="Auto" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Sektor Industri</label><input value={form.sektorIndustri} onChange={e => setForm(f => ({ ...f, sektorIndustri: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Tahun Berdiri</label><input type="number" value={form.tahunBerdiri || ''} onChange={e => setForm(f => ({ ...f, tahunBerdiri: e.target.value ? parseInt(e.target.value) : undefined }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border p-2 rounded-lg"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
              <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">Alamat</label><textarea value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} className="w-full border p-2 rounded-lg" rows={2} /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Kota</label><input value={form.kota} onChange={e => setForm(f => ({ ...f, kota: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Provinsi</label><input value={form.provinsi} onChange={e => setForm(f => ({ ...f, provinsi: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Direktur</label><input value={form.namaDirektur} onChange={e => setForm(f => ({ ...f, namaDirektur: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Kontak Direktur</label><input value={form.kontakDirektur} onChange={e => setForm(f => ({ ...f, kontakDirektur: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Email</label><input value={form.emailPerusahaan} onChange={e => setForm(f => ({ ...f, emailPerusahaan: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Telepon</label><input value={form.telepon} onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">No. Akte</label><input value={form.noAktePendirian} onChange={e => setForm(f => ({ ...f, noAktePendirian: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-600 mb-1">NPWP</label><input value={form.npwp} onChange={e => setForm(f => ({ ...f, npwp: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
              <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">No. Izin Usaha</label><input value={form.noIzinUsaha} onChange={e => setForm(f => ({ ...f, noIzinUsaha: e.target.value }))} className="w-full border p-2 rounded-lg" /></div>
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
                <div><span className="text-slate-400 font-semibold">Kode</span><p className="font-mono text-slate-800">{detail.kodePerusahaan}</p></div>
                <div><span className="text-slate-400 font-semibold">Sektor</span><p className="text-slate-800">{detail.sektorIndustri || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Tahun Berdiri</span><p className="text-slate-800">{detail.tahunBerdiri || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Status</span><p className={`font-bold ${detail.status === 'aktif' ? 'text-emerald-600' : 'text-slate-400'}`}>{detail.status?.toUpperCase()}</p></div>
              </div>
              <div className="border-t pt-3">
                <span className="text-slate-400 font-semibold block mb-1">Alamat</span><p className="text-slate-800">{detail.alamat ? `${detail.alamat}, ${detail.kota}, ${detail.provinsi}` : '-'}</p>
              </div>
              <div className="border-t pt-3 grid grid-cols-2 gap-3">
                <div><span className="text-slate-400 font-semibold">Direktur</span><p className="text-slate-800">{detail.namaDirektur || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Kontak</span><p className="text-slate-800">{detail.kontakDirektur || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Email</span><p className="text-slate-800">{detail.emailPerusahaan || '-'}</p></div>
                <div><span className="text-slate-400 font-semibold">Telepon</span><p className="text-slate-800">{detail.telepon || '-'}</p></div>
                {detail.website && <div className="col-span-2"><span className="text-slate-400 font-semibold">Website</span><p className="text-blue-600">{detail.website}</p></div>}
              </div>
              <div className="border-t pt-3">
                <span className="text-slate-400 font-semibold block mb-1">Legal</span>
                <div className="text-slate-800 space-y-1">
                  <div>No. Akte: {detail.noAktePendirian || '-'}</div>
                  <div>NPWP: {detail.npwp || '-'}</div>
                  <div>Izin Usaha: {detail.noIzinUsaha || '-'}</div>
                </div>
              </div>
              {detail.deskripsi && <div className="border-t pt-3"><span className="text-slate-400 font-semibold block mb-1">Deskripsi</span><p className="text-slate-600">{detail.deskripsi}</p></div>}
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

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
