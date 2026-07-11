import React, { useState } from 'react';
import {
  Settings, Layout, Star, Users, MessageSquare, CreditCard, Phone, Eye, Save, Plus, Trash2, X, CheckCircle, AlertCircle, Image
} from 'lucide-react';
import ThemeProvider from '../landing/ThemeProvider';
import Navbar from '../landing/Navbar';
import HeroSection from '../landing/HeroSection';
import FeaturesGrid from '../landing/FeaturesGrid';
import TeamGrid from '../landing/TeamGrid';
import TestimonialSlider from '../landing/TestimonialSlider';
import PricingTable from '../landing/PricingTable';
import ContactFooter from '../landing/ContactFooter';

type TabKey = 'settings' | 'hero' | 'features' | 'team' | 'testimonials' | 'pricing' | 'contact' | 'preview';

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'settings', label: 'Umum', icon: Settings },
  { key: 'hero', label: 'Hero', icon: Layout },
  { key: 'features', label: 'Fitur', icon: Star },
  { key: 'team', label: 'Tim', icon: Users },
  { key: 'testimonials', label: 'Testimoni', icon: MessageSquare },
  { key: 'pricing', label: 'Harga', icon: CreditCard },
  { key: 'contact', label: 'Kontak', icon: Phone },
  { key: 'preview', label: 'Preview', icon: Eye },
];

interface Props {
  landingSettings: any;
  landingHero: any;
  landingFeatures: any[];
  landingTeam: any[];
  landingTestimonials: any[];
  landingPricing: any[];
  landingContact: any;
  onSaveSettings: (d: any) => Promise<void>;
  onSaveHero: (d: any) => Promise<void>;
  onAddFeature: (d: any) => Promise<any>;
  onUpdateFeature: (id: string, d: any) => Promise<void>;
  onDeleteFeature: (id: string) => Promise<void>;
  onAddTeam: (d: any) => Promise<any>;
  onUpdateTeam: (id: string, d: any) => Promise<void>;
  onDeleteTeam: (id: string) => Promise<void>;
  onAddTestimonial: (d: any) => Promise<any>;
  onUpdateTestimonial: (id: string, d: any) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  onAddPricing: (d: any) => Promise<any>;
  onUpdatePricing: (id: string, d: any) => Promise<void>;
  onDeletePricing: (id: string) => Promise<void>;
  onSaveContact: (d: any) => Promise<void>;
}

export default function AdminLandingCms(props: Props) {
  const [tab, setTab] = useState<TabKey>('settings');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };
  const showError = (msg: string) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 5000); };

  const handleSave = async (fn: () => Promise<void>) => {
    try { await fn(); showSuccess('Berhasil disimpan!'); }
    catch (e: any) { showError(e.message || 'Gagal menyimpan'); }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* SUCCESS/ERROR */}
      {successMsg && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-3 rounded-xl"><CheckCircle className="w-4 h-4" />{successMsg}</div>}
      {errorMsg && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl"><AlertCircle className="w-4 h-4" />{errorMsg}</div>}

      {/* TABS */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-sm">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === t.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          ><t.icon className="w-3.5 h-3.5" />{t.label}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-6" style={tab === 'preview' ? {} : {}}>
        {tab !== 'preview' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {tab === 'settings' && <SettingsTab {...props} onSave={handleSave} />}
            {tab === 'hero' && <HeroTab {...props} onSave={handleSave} />}
            {tab === 'features' && <FeaturesTab {...props} onSave={handleSave} />}
            {tab === 'team' && <TeamTab {...props} onSave={handleSave} />}
            {tab === 'testimonials' && <TestimonialsTab {...props} onSave={handleSave} />}
            {tab === 'pricing' && <PricingTab {...props} onSave={handleSave} />}
            {tab === 'contact' && <ContactTab {...props} onSave={handleSave} />}
          </div>
        )}

        {/* PREVIEW */}
        {tab === 'preview' && (
          <PreviewPanel
            settings={props.landingSettings}
            hero={props.landingHero}
            features={props.landingFeatures}
            team={props.landingTeam}
            testimonials={props.landingTestimonials}
            pricing={props.landingPricing}
            contact={props.landingContact}
          />
        )}
      </div>
    </div>
  );
}

/* ========== TAB: SETTINGS ========== */
function SettingsTab({ landingSettings, onSave }: any) {
  const [form, setForm] = useState({ ...landingSettings });
  const handleChange = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(() => onSave(form)); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Settings className="w-4 h-4 text-blue-600" />Pengaturan Umum</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Nama Koperasi" value={form.koperasiName} onChange={v => handleChange('koperasiName', v)} />
        <Input label="Tagline" value={form.koperasiTagline} onChange={v => handleChange('koperasiTagline', v)} />
        <Input label="Warna Primer (Hex)" value={form.primaryColor} onChange={v => handleChange('primaryColor', v)} type="color" />
        <Input label="Warna Sekunder (Hex)" value={form.secondaryColor} onChange={v => handleChange('secondaryColor', v)} type="color" />
        <Input label="URL Logo" value={form.logoUrl} onChange={v => handleChange('logoUrl', v)} placeholder="https://..." />
        <Input label="URL Favicon" value={form.faviconUrl} onChange={v => handleChange('faviconUrl', v)} placeholder="https://..." />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={form.isPublished} onChange={e => handleChange('isPublished', e.target.checked)} className="rounded" />
        Landing page diterbitkan (publik bisa melihat)
      </label>
      <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"><Save className="w-3.5 h-3.5" />Simpan Pengaturan</button>
    </form>
  );
}

/* ========== TAB: HERO ========== */
function HeroTab({ landingHero, onSave }: any) {
  const [form, setForm] = useState({ ...landingHero });
  const handleChange = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(() => onSave(form)); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Layout className="w-4 h-4 text-blue-600" />Hero Section</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Badge Text" value={form.badgeText} onChange={v => handleChange('badgeText', v)} />
        <Select label="Background" value={form.backgroundType} onChange={v => handleChange('backgroundType', v)} options={[{ value: 'gradient', label: 'Gradient' }, { value: 'image', label: 'Gambar' }, { value: 'solid', label: 'Warna Solid' }]} />
      </div>
      <Input label="Headline (Judul Besar)" value={form.headline} onChange={v => handleChange('headline', v)} />
      <Textarea label="Subheadline" value={form.subheadline} onChange={v => handleChange('subheadline', v)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Teks Tombol 1 (Primer)" value={form.ctaPrimaryText} onChange={v => handleChange('ctaPrimaryText', v)} />
        <Input label="Link Tombol 1" value={form.ctaPrimaryLink} onChange={v => handleChange('ctaPrimaryLink', v)} />
        <Input label="Teks Tombol 2 (Sekunder)" value={form.ctaSecondaryText} onChange={v => handleChange('ctaSecondaryText', v)} />
        <Input label="Link Tombol 2" value={form.ctaSecondaryLink} onChange={v => handleChange('ctaSecondaryLink', v)} />
      </div>
      <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"><Save className="w-3.5 h-3.5" />Simpan Hero</button>
    </form>
  );
}

/* ========== TAB: FEATURES ========== */
function FeaturesTab({ landingFeatures, onAddFeature, onUpdateFeature, onDeleteFeature, onSave }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Star');
  const reset = () => { setTitle(''); setDescription(''); setIconName('Star'); setEditId(null); setShowForm(false); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) { onSave(() => onUpdateFeature(editId, { title, description, iconName })); } else { onAddFeature({ title, description, iconName }).then(reset); }
    reset();
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Star className="w-4 h-4 text-blue-600" />Fitur Unggulan ({landingFeatures.length})</h3>
        {!showForm && <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"><Plus className="w-3.5 h-3.5" />Tambah</button>}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input label="Judul" value={title} onChange={setTitle} />
            <Input label="Nama Icon" value={iconName} onChange={setIconName} placeholder="Users, Star, Shield..." />
            <div className="flex items-end gap-2">
              {editId && <button type="button" onClick={reset} className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">Batal</button>}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer">{editId ? 'Update' : 'Tambah'}</button>
            </div>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Deskripsi fitur..." />
        </form>
      )}
      <div className="space-y-2">
        {landingFeatures?.map((f: any) => (
          <div key={f.id} className="flex items-start justify-between bg-white border border-slate-100 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{f.iconName?.charAt(0) || 'F'}</div>
              <div><p className="text-sm font-bold text-slate-800">{f.title}</p><p className="text-xs text-slate-500">{f.description}</p></div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditId(f.id); setTitle(f.title); setDescription(f.description); setIconName(f.iconName); setShowForm(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
              <button onClick={() => onDeleteFeature(f.id)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
        {!landingFeatures?.length && <p className="text-xs text-slate-400 text-center py-6">Belum ada fitur. Tambah fitur unggulan koperasi Anda.</p>}
      </div>
    </div>
  );
}

/* ========== TAB: TEAM ========== */
function TeamTab({ landingTeam, onAddTeam, onUpdateTeam, onDeleteTeam, onSave }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState(''); const [position, setPosition] = useState(''); const [photoUrl, setPhotoUrl] = useState('');
  const reset = () => { setName(''); setPosition(''); setPhotoUrl(''); setEditId(null); setShowForm(false); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editId ? onSave(() => onUpdateTeam(editId, { name, position, photoUrl })).then(reset) : onAddTeam({ name, position, photoUrl }).then(reset); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" />Tim Pengurus ({landingTeam.length})</h3>{!showForm && <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"><Plus className="w-3.5 h-3.5" />Tambah</button>}</div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input label="Nama" value={name} onChange={setName} />
            <Input label="Jabatan" value={position} onChange={setPosition} />
            <div className="flex items-end gap-2">
              {editId && <button type="button" onClick={reset} className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">Batal</button>}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold">{editId ? 'Update' : 'Tambah'}</button>
            </div>
          </div>
          <Input label="URL Foto" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
        </form>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {landingTeam?.map((t: any) => (
          <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-4 text-center relative group">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-2 flex items-center justify-center text-slate-400 text-sm font-bold">{t.photoUrl ? <img src={t.photoUrl} className="w-full h-full rounded-full object-cover" /> : t.name?.charAt(0)}</div>
            <p className="text-xs font-bold text-slate-800">{t.name}</p><p className="text-[10px] text-blue-600">{t.position}</p>
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
              <button onClick={() => { setEditId(t.id); setName(t.name); setPosition(t.position); setPhotoUrl(t.photoUrl); setShowForm(true); }} className="p-1 bg-white rounded shadow"><svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
              <button onClick={() => onDeleteTeam(t.id)} className="p-1 bg-white rounded shadow"><Trash2 className="w-3 h-3 text-red-400" /></button>
            </div>
          </div>
        ))}
        {!landingTeam?.length && <p className="text-xs text-slate-400 col-span-full text-center py-6">Belum ada tim.</p>}
      </div>
    </div>
  );
}

/* ========== TAB: TESTIMONIALS ========== */
function TestimonialsTab({ landingTestimonials, onAddTestimonial, onUpdateTestimonial, onDeleteTestimonial, onSave }: any) {
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState(''); const [position, setPosition] = useState(''); const [content, setContent] = useState(''); const [rating, setRating] = useState(5);
  const reset = () => { setName(''); setPosition(''); setContent(''); setRating(5); setEditId(null); setShowForm(false); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editId ? onSave(() => onUpdateTestimonial(editId, { name, position, content, rating })).then(reset) : onAddTestimonial({ name, position, content, rating }).then(reset); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-600" />Testimonial ({landingTestimonials.length})</h3>{!showForm && <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"><Plus className="w-3.5 h-3.5" />Tambah</button>}</div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3"><Input label="Nama" value={name} onChange={setName} /><Input label="Jabatan" value={position} onChange={setPosition} /><div className="flex items-end gap-2">{editId && <button type="button" onClick={reset} className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">Batal</button>}<button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold">{editId ? 'Update' : 'Tambah'}</button></div></div>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Isi testimonial..." />
          <div><label className="text-xs font-medium text-slate-600 mb-1 block">Rating: </label><div className="flex gap-1">{[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setRating(n)} className={`w-8 h-8 rounded-lg text-sm font-bold cursor-pointer ${n <= rating ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300'}`}>{n <= rating ? '★' : '☆'}</button>)}</div></div>
        </form>
      )}
      <div className="space-y-2">
        {landingTestimonials?.map((t: any) => (
          <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.name?.charAt(0)}</div>
              <div><p className="text-sm font-bold text-slate-800">{t.name}</p><p className="text-xs text-slate-400">{t.position}</p><p className="text-xs text-slate-500 mt-1 italic">"{t.content?.substring(0, 100)}{t.content?.length > 100 ? '...' : ''}"</p></div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => { setEditId(t.id); setName(t.name); setPosition(t.position); setContent(t.content); setRating(t.rating); setShowForm(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
              <button onClick={() => onDeleteTestimonial(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
        {!landingTestimonials?.length && <p className="text-xs text-slate-400 text-center py-6">Belum ada testimonial.</p>}
      </div>
    </div>
  );
}

/* ========== TAB: PRICING ========== */
function PricingTab({ landingPricing, onAddPricing, onUpdatePricing, onDeletePricing, onSave }: any) {
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<string | null>(null);
  const [planName, setPlanName] = useState(''); const [priceAmount, setPriceAmount] = useState(''); const [description, setDescription] = useState('');
  const [isPopular, setIsPopular] = useState(false); const [features, setFeatures] = useState<string[]>([]); const [featureInput, setFeatureInput] = useState('');
  const reset = () => { setPlanName(''); setPriceAmount(''); setDescription(''); setIsPopular(false); setFeatures([]); setFeatureInput(''); setEditId(null); setShowForm(false); };
  const addFeature = () => { if (featureInput.trim()) { setFeatures([...features, featureInput.trim()]); setFeatureInput(''); } };
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { planName, priceAmount, description, isPopular, features };
    editId ? onSave(() => onUpdatePricing(editId, data)).then(reset) : onAddPricing(data).then(reset);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" />Paket Harga ({landingPricing.length})</h3>{!showForm && <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"><Plus className="w-3.5 h-3.5" />Tambah</button>}</div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input label="Nama Paket" value={planName} onChange={setPlanName} />
            <Input label="Harga" value={priceAmount} onChange={setPriceAmount} placeholder="Gratis / Rp 499K / Custom" />
            <div className="flex items-end gap-2">
              {editId && <button type="button" onClick={reset} className="border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">Batal</button>}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold">{editId ? 'Update' : 'Tambah'}</button>
            </div>
          </div>
          <Input label="Deskripsi" value={description} onChange={setDescription} />
          <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="rounded" />Tandai sebagai paket paling populer</label>
          <div><label className="text-xs font-medium text-slate-600 mb-1 block">Fitur (checklist)</label>
            <div className="flex gap-2 mb-2"><input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="flex-1 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tambah fitur..." /><button type="button" onClick={addFeature} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">+</button></div>
            <div className="flex flex-wrap gap-1">{features.map((f, i) => <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full"><span>{f}</span><button type="button" onClick={() => removeFeature(i)} className="cursor-pointer"><X className="w-3 h-3" /></button></span>)}</div>
          </div>
        </form>
      )}
      <div className="grid md:grid-cols-3 gap-3">
        {landingPricing?.map((p: any) => (
          <div key={p.id} className={`bg-white border rounded-xl p-4 relative ${p.isPopular ? 'border-blue-500 shadow-md' : 'border-slate-100'}`}>
            {p.isPopular && <span className="absolute -top-2 right-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Populer</span>}
            <p className="text-sm font-bold text-slate-800">{p.planName}</p>
            <p className="text-lg font-black text-blue-600">{p.priceAmount}</p>
            <p className="text-[10px] text-slate-400 mb-2">{p.description}</p>
            <ul className="text-[10px] text-slate-500 space-y-0.5 mb-2">{(p.features || []).map((f: string, i: number) => <li key={i} className="flex items-center gap-1"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>{f}</li>)}</ul>
            <div className="flex gap-1 mt-2"><button onClick={() => { setEditId(p.id); setPlanName(p.planName); setPriceAmount(p.priceAmount); setDescription(p.description); setIsPopular(p.isPopular); setFeatures(p.features || []); setShowForm(true); }} className="text-[10px] text-blue-600 hover:underline cursor-pointer">Edit</button><button onClick={() => onDeletePricing(p.id)} className="text-[10px] text-red-500 hover:underline cursor-pointer">Hapus</button></div>
          </div>
        ))}
        {!landingPricing?.length && <p className="text-xs text-slate-400 col-span-full text-center py-6">Belum ada paket harga.</p>}
      </div>
    </div>
  );
}

/* ========== TAB: CONTACT ========== */
function ContactTab({ landingContact, onSave }: any) {
  const [form, setForm] = useState({ ...landingContact });
  const h = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(() => onSave(form)); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" />Kontak & Footer</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Email" value={form.email} onChange={v => h('email', v)} />
        <Input label="Telepon" value={form.phone} onChange={v => h('phone', v)} />
        <Input label="WhatsApp" value={form.whatsapp} onChange={v => h('whatsapp', v)} />
        <Input label="Jam Operasional" value={form.officeHours} onChange={v => h('officeHours', v)} placeholder="Senin-Jumat: 08:00-16:00" />
        <Input label="Facebook URL" value={form.socialFacebook} onChange={v => h('socialFacebook', v)} />
        <Input label="Instagram URL" value={form.socialInstagram} onChange={v => h('socialInstagram', v)} />
        <Input label="YouTube URL" value={form.socialYoutube} onChange={v => h('socialYoutube', v)} />
        <Input label="Google Maps Embed URL" value={form.mapEmbedUrl} onChange={v => h('mapEmbedUrl', v)} />
      </div>
      <Textarea label="Alamat" value={form.address} onChange={v => h('address', v)} />
      <Textarea label="Deskripsi Footer" value={form.footerDescription} onChange={v => h('footerDescription', v)} />
      <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"><Save className="w-3.5 h-3.5" />Simpan Kontak</button>
    </form>
  );
}

/* ========== PREVIEW ========== */
function PreviewPanel({ settings, hero, features, team, testimonials, pricing, contact }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-900 text-white text-[10px] font-semibold px-4 py-2 flex items-center gap-2">
        <Eye className="w-3.5 h-3.5" />Preview Landing Page — tampilan ini adalah hasil real-time dari data yang diinput
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        <ThemeProvider settings={settings}>
          <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center' }}>
            <Navbar settings={settings} />
            <HeroSection hero={hero} featuresCount={features?.length || 0} />
            <FeaturesGrid features={features || []} />
            <TeamGrid team={team || []} />
            <TestimonialSlider testimonials={testimonials || []} />
            <PricingTable pricing={pricing || []} />
            <ContactFooter contact={contact} settings={settings} />
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
}

/* ========== HELPERS ========== */
function Input({ label, value, onChange, type, placeholder }: any) {
  return <div><label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
    {type === 'color' ? <div className="flex items-center gap-2"><input type="color" value={value || '#2563eb'} onChange={e => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" /><span className="text-xs text-slate-400">{value || '#2563eb'}</span></div>
    : <input type={type || 'text'} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500" />}
  </div>;
}

function Textarea({ label, value, onChange }: any) {
  return <div><label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
  </div>;
}

function Select({ label, value, onChange, options }: any) {
  return <div><label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-2 focus:ring-blue-500">
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;
}
