import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, EyeOff, FolderOpen, FileText, ChevronRight, ChevronDown, Check, X } from 'lucide-react';
import { ChartOfAccount } from '../../types';

interface AdminCOAProps {
  chartOfAccounts: ChartOfAccount[];
  onAdd: (data: any) => Promise<any>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

const KATEGORI = ['ASET', 'KEWAJIBAN', 'EKUITAS', 'PENDAPATAN', 'BEBAN', 'SHU'];

export default function AdminCOA({ chartOfAccounts, onAdd, onUpdate, onDeactivate }: AdminCOAProps) {
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['coa1','coa2','coa3','coa4','coa5','coa6']));
  const [form, setForm] = useState({ kodeAkun: '', namaAkun: '', kategori: 'ASET', subKategori: '', saldoNormal: 'debit', level: 3, parentId: '', isHeader: false });

  const tree = useMemo(() => {
    const map = new Map(chartOfAccounts.map(a => [a.id, { ...a, children: [] as ChartOfAccount[] }]));
    const roots: ChartOfAccount[] = [];
    map.forEach(a => {
      if (a.parentId && map.has(a.parentId)) map.get(a.parentId)!.children!.push(a);
      else roots.push(a);
    });
    const filterTree = (items: ChartOfAccount[]): ChartOfAccount[] => {
      const s = search.toLowerCase();
      return items
        .map(n => ({ ...n, children: filterTree(n.children || []) }))
        .filter(n => n.namaAkun.toLowerCase().includes(s) || n.kodeAkun.includes(s) || n.children.length > 0)
        .filter(n => !kategoriFilter || n.kategori === kategoriFilter);
    };
    return search || kategoriFilter ? filterTree(roots) : roots;
  }, [chartOfAccounts, search, kategoriFilter]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const renderTree = (items: ChartOfAccount[], depth = 0) => {
    return items.map(acc => {
      const hasChildren = acc.children && acc.children.length > 0;
      const isExpanded = expanded.has(acc.id);
      return (
        <div key={acc.id}>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 text-xs ${!acc.isActive ? 'opacity-40' : ''}`} style={{ marginLeft: depth * 20 }}>
            <button onClick={() => hasChildren && toggleExpand(acc.id)} className="w-4 text-center">
              {hasChildren ? (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : <span className="text-slate-300">-</span>}
            </button>
            {acc.isHeader ? <FolderOpen className="w-3.5 h-3.5 text-amber-500" /> : <FileText className="w-3.5 h-3.5 text-blue-500" />}
            <span className="font-mono text-slate-500 w-20">{acc.kodeAkun}</span>
            <span className="flex-1 font-medium text-slate-800">{acc.namaAkun}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              acc.saldoNormal === 'debit' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>{acc.saldoNormal === 'debit' ? 'D' : 'K'}</span>
            <span className="text-[10px] text-slate-400 w-16">{acc.kategori}</span>
            {!acc.isHeader && editId !== acc.id && (
              <>
                <button onClick={() => { setEditId(acc.id); setForm({ kodeAkun: acc.kodeAkun, namaAkun: acc.namaAkun, kategori: acc.kategori, subKategori: acc.subKategori || '', saldoNormal: acc.saldoNormal, level: acc.level, parentId: acc.parentId || '', isHeader: acc.isHeader }); }} className="p-1 hover:bg-blue-100 rounded"><Edit3 className="w-3 h-3 text-blue-500" /></button>
                <button onClick={() => onDeactivate(acc.id)} className="p-1 hover:bg-red-100 rounded"><EyeOff className="w-3 h-3 text-red-400" /></button>
              </>
            )}
          </div>
          {hasChildren && isExpanded && renderTree(acc.children!, depth + 1)}
        </div>
      );
    });
  };

  const handleSave = async () => {
    if (editId) { await onUpdate(editId, form); setEditId(null); }
    else { await onAdd(form); }
    setShowAdd(false); setForm({ kodeAkun: '', namaAkun: '', kategori: 'ASET', subKategori: '', saldoNormal: 'debit', level: 3, parentId: '', isHeader: false });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><FolderOpen className="w-5 h-5 text-blue-600" /> Bagan Akun (Chart of Accounts)</h3>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"><Plus className="w-3.5 h-3.5" /> Tambah Akun</button>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari akun..." className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs" /></div>
          <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 text-xs"><option value="">Semua Kategori</option>{KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}</select>
        </div>
        {showAdd && (
          <div className="bg-slate-50 border rounded-lg p-4 mb-4 grid grid-cols-4 gap-3">
            <input value={form.kodeAkun} onChange={e => setForm(p => ({ ...p, kodeAkun: e.target.value }))} placeholder="Kode Akun (cth: 1.1.01.01)" className="border px-3 py-1.5 rounded text-xs" />
            <input value={form.namaAkun} onChange={e => setForm(p => ({ ...p, namaAkun: e.target.value }))} placeholder="Nama Akun" className="border px-3 py-1.5 rounded text-xs col-span-2" />
            <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} className="border rounded px-2 py-1.5 text-xs">{KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}</select>
            <select value={form.saldoNormal} onChange={e => setForm(p => ({ ...p, saldoNormal: e.target.value }))} className="border rounded px-2 py-1.5 text-xs"><option value="debit">Debit</option><option value="kredit">Kredit</option></select>
            <div className="col-span-3 flex gap-2">
              <select value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))} className="border rounded px-2 py-1.5 text-xs flex-1"><option value="">Header/Grup</option>{chartOfAccounts.filter(a => a.isHeader).map(a => <option key={a.id} value={a.id}>{a.kodeAkun} - {a.namaAkun}</option>)}</select>
            </div>
            <div className="flex gap-2 justify-end items-center">
              <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 bg-slate-300 rounded text-xs"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
        <div className="border rounded-lg p-2 max-h-[500px] overflow-y-auto bg-white text-xs font-mono divide-y">
          {tree.length === 0 ? <p className="text-slate-400 text-center py-8">Tidak ada akun ditemukan</p> : renderTree(tree)}
        </div>
        <div className="text-[10px] text-slate-400 mt-2 text-right">{chartOfAccounts.length} akun ({chartOfAccounts.filter(a => !a.isHeader).length} detail, {chartOfAccounts.filter(a => a.isHeader).length} grup)</div>
      </div>
    </div>
  );
}
