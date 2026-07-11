import React, { useState, useEffect } from 'react';
import { Building2, User, Mail, Phone, MapPin, Calendar, Save, Edit2, AlertCircle } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../api/client';

export default function MemberPerusahaanProfil({ session }: { session: any }) {
  const { perusahaan, fetchPerusahaan } = useDataStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama_perusahaan: '',
    npwp: '',
    alamat: '',
    telepon: '',
    email: '',
    sektor: '',
    deskripsi: '',
    website: '',
    nama_pic: '',
    jabatan_pic: '',
    telepon_pic: '',
    email_pic: '',
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadProfile();
  }, [session]);

  const loadProfile = async () => {
    try {
      await fetchPerusahaan();
      // Find the perusahaan for this session
      const myPerusahaan = perusahaan.find((p: any) => p.id === session.perusahaanId || p.user_id === session.id);
      if (myPerusahaan) {
        setProfile(myPerusahaan);
        setFormData({
          nama_perusahaan: myPerusahaan.nama_perusahaan || '',
          npwp: myPerusahaan.npwp || '',
          alamat: myPerusahaan.alamat || '',
          telepon: myPerusahaan.telepon || '',
          email: myPerusahaan.email || '',
          sektor: myPerusahaan.sektor || '',
          deskripsi: myPerusahaan.deskripsi || '',
          website: myPerusahaan.website || '',
          nama_pic: myPerusahaan.nama_pic || '',
          jabatan_pic: myPerusahaan.jabatan_pic || '',
          telepon_pic: myPerusahaan.telepon_pic || '',
          email_pic: myPerusahaan.email_pic || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile?.id) {
        await api.put(`/data/perusahaan/${profile.id}`, formData);
      } else {
        await api.post('/data/perusahaan', { ...formData, user_id: session.id });
      }
      setMessage({ type: 'success', text: 'Profil perusahaan berhasil disimpan' });
      setEditing(false);
      loadProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menyimpan profil' });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 text-xs">Memuat data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">Profil Perusahaan</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold mt-1">Data Perusahaan & Kontak PIC</h1>
        <p className="text-xs text-slate-300 mt-1">Kelola informasi legalitas, alamat, dan kontak Person In Charge</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 animate-fadeIn ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="pr-6 leading-relaxed">{message.text}</div>
          <button onClick={() => setMessage(null)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        {/* Informasi Legalitas */}
        <div className="border-b border-slate-200 pb-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-purple-600" /> Informasi Legalitas Perusahaan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nama Perusahaan *</label>
              <input name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} required disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">NPWP</label>
              <input name="npwp" value={formData.npwp} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows={2} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Telepon Kantor</label>
              <input name="telepon" value={formData.telepon} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Email Perusahaan</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Website</label>
              <input name="website" value={formData.website} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Sektor Industri</label>
              <select name="sektor" value={formData.sektor} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800">
                <option value="">Pilih Sektor</option>
                <option value="Agroteknologi">Agroteknologi</option>
                <option value="Fintek">Fintek</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Manufaktur">Manufaktur</option>
                <option value="Perdagangan">Perdagangan</option>
                <option value="Jasa">Jasa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-600 mb-1">Deskripsi Bisnis</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Informasi PIC */}
        <div className="border-b border-slate-200 pb-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-purple-600" /> Person In Charge (PIC)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nama PIC *</label>
              <input name="nama_pic" value={formData.nama_pic} onChange={handleChange} required disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Jabatan PIC</label>
              <input name="jabatan_pic" value={formData.jabatan_pic} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Telepon / WhatsApp PIC</label>
              <input name="telepon_pic" value={formData.telepon_pic} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Email PIC</label>
              <input name="email_pic" type="email" value={formData.email_pic} onChange={handleChange} disabled={!editing}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {editing ? (
            <>
              <button type="button" onClick={() => { setFormData({
                nama_perusahaan: profile?.nama_perusahaan || '',
                npwp: profile?.npwp || '',
                alamat: profile?.alamat || '',
                telepon: profile?.telepon || '',
                email: profile?.email || '',
                sektor: profile?.sektor || '',
                deskripsi: profile?.deskripsi || '',
                website: profile?.website || '',
                nama_pic: profile?.nama_pic || '',
                jabatan_pic: profile?.jabatan_pic || '',
                telepon_pic: profile?.telepon_pic || '',
                email_pic: profile?.email_pic || '',
              }); setEditing(false); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 font-bold">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold shadow-sm">
                <Save className="w-4 h-4 inline mr-1" /> Simpan Perubahan
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold shadow-sm">
              <Edit2 className="w-4 h-4 inline mr-1" /> Edit Profil
            </button>
          )}
        </div>
      </form>

      {/* Read-only display when not editing */}
      {!editing && profile && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><span className="text-slate-400 block">Nama Perusahaan</span> <span className="font-bold text-slate-800">{profile.nama_perusahaan}</span></div>
            <div><span className="text-slate-400 block">NPWP</span> <span className="font-mono text-slate-600">{profile.npwp || '-'}</span></div>
            <div className="md:col-span-3"><span className="text-slate-400 block">Alamat</span> <span className="text-slate-600">{profile.alamat || '-'}</span></div>
            <div><span className="text-slate-400 block">Telepon</span> <span className="font-mono text-slate-600">{profile.telepon || '-'}</span></div>
            <div><span className="text-slate-400 block">Email</span> <span className="text-slate-600">{profile.email || '-'}</span></div>
            <div><span className="text-slate-400 block">Website</span> <span className="text-slate-600">{profile.website || '-'}</span></div>
            <div className="md:col-span-3"><span className="text-slate-400 block">Deskripsi</span> <span className="text-slate-600">{profile.deskripsi || '-'}</span></div>
          </div>
          <hr className="border-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><span className="text-slate-400 block">Nama PIC</span> <span className="font-bold text-slate-800">{profile.nama_pic || '-'}</span></div>
            <div><span className="text-slate-400 block">Jabatan</span> <span className="text-slate-600">{profile.jabatan_pic || '-'}</span></div>
            <div><span className="text-slate-400 block">Telepon PIC</span> <span className="font-mono text-slate-600">{profile.telepon_pic || '-'}</span></div>
            <div><span className="text-slate-400 block">Email PIC</span> <span className="text-slate-600">{profile.email_pic || '-'}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}