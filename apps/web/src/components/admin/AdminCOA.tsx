/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:mc-surface-2/50 text-xs ${!acc.isActive ? 'opacity-40' : ''}`} style={{ marginLeft: depth * 20 }}>
            <button onClick={() => hasChildren && toggleExpand(acc.id)} className="w-4 text-center">
              {hasChildren ? (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : <span className="text-slate-300">-</span>}
            </button>
            {acc.isHeader ? <FolderOpen className="w-3.5 h-3.5 mc-icon-accent" style={{ color: 'var(--mc-accent)' }} /> : <FileText className="w-3.5 h-3.5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} />}
            <span className="font-mono mc-muted w-20">{acc.kodeAkun}</span>
            <span className="flex-1 font-medium mc-ink-strong">{acc.namaAkun}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${acc.saldoNormal === 'debit' ? 'mc-badge-accent' : 'mc-badge-ok'}`} style={{ backgroundColor: acc.saldoNormal === 'debit' ? 'var(--mc-accent-transparent)' : 'var(--mc-success-transparent)', borderColor: acc.saldoNormal === 'debit' ? 'var(--mc-accent)' : 'var(--mc-success)' }}>
              {acc.saldoNormal === 'debit' ? 'D' : 'K'}
            </span>
            <span className="text-[10px] mc-muted w-16">{acc.kategori}</span>
            {!acc.isHeader && editId !== acc.id && (
              <>
                <button onClick={() => { setEditId(acc.id); setForm({ kodeAkun: acc.kodeAkun, namaAkun: acc.namaAkun, kategori: acc.kategori, subKategori: acc.subKategori || '', saldoNormal: acc.saldoNormal, level: acc.level, parentId: acc.parentId || '', isHeader: acc.isHeader }); }} className="p-1 hover:mc-surface-2 rounded cursor-pointer" title="Edit Akun"><Edit3 className="w-3 h-3 mc-icon-accent" /></button>
                <button onClick={() => onDeactivate(acc.id)} className="p-1 hover:mc-surface-2 rounded cursor-pointer" title="Nonaktifkan"><EyeOff className="w-3 h-3 mc-btn-danger" /></button>
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
      <div className="mc-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold mc-ink-strong text-sm flex items-center gap-2"><FolderOpen className="w-5 h-5 mc-icon-accent" style={{ color: 'var(--mc-primary)' }} /> Bagan Akun (Chart of Accounts)</h3>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 mc-btn-primary text-white rounded-lg text-xs font-semibold hover:shadow cursor-pointer"><Plus className="w-3.5 h-3.5" /> Tambah Akun</button>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-2 w-4 h-4 mc-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari akun..." className="w-full pl-9 pr-3 py-1.5 mc-border mc-surface-2 rounded-lg text-xs mc-focus focus:ring-[var(--mc-accent)]" /></div>
          <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)} className="mc-border mc-surface-2 rounded-lg px-3 py-1.5 text-xs mc-focus focus:ring-[var(--mc-accent)]"><option value="">Semua Kategori</option>{KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}</select>
        </div>
        {showAdd && (
          <div className="mc-surface-2 mc-border p-4 mb-4 grid grid-cols-4 gap-3">
            <input value={form.kodeAkun} onChange={e => setForm(p => ({ ...p, kodeAkun: e.target.value }))} placeholder="Kode Akun (cth: 1.1.01.01)" className="mc-border mc-surface-2 rounded px-3 py-1.5 text-xs mc-focus focus:ring-[var(--mc-accent)]" />
            <input value={form.namaAkun} onChange={e => setForm(p => ({ ...p, namaAkun: e.target.value }))} placeholder="Nama Akun" className="mc-border mc-surface-2 rounded px-3 py-1.5 text-xs col-span-2 mc-focus focus:ring-[var(--mc-accent)]" />
            <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} className="mc-border mc-surface-2 rounded px-2 py-1.5 text-xs mc-focus focus:ring-[var(--mc-accent)]">{KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}</select>
            <select value={form.saldoNormal} onChange={e => setForm(p => ({ ...p, saldoNormal: e.target.value }))} className="mc-border mc-surface-2 rounded px-2 py-1.5 text-xs mc-focus focus:ring-[var(--mc-accent)]"><option value="debit">Debit</option><option value="kredit">Kredit</option></select>
            <div className="col-span-3 flex gap-2">
              <select value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))} className="mc-border mc-surface-2 rounded px-2 py-1.5 text-xs flex-1 mc-focus focus:ring-[var(--mc-accent)]"><option value="">Header/Grup</option>{chartOfAccounts.filter(a => a.isHeader).map(a => <option key={a.id} value={a.id}>{a.kodeAkun} - {a.namaAkun}</option>)}</select>
            </div>
            <div className="flex gap-2 justify-end items-center">
              <button onClick={handleSave} className="px-3 py-1.5 mc-badge-ok rounded text-xs"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 mc-surface-2 mc-border rounded text-xs cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
        <div className="mc-border rounded-lg p-2 max-h-[500px] overflow-y-auto mc-surface text-xs font-mono divide-y mc-border/50">
          {tree.length === 0 ? <p className="mc-muted text-center py-8">Tidak ada akun ditemukan</p> : renderTree(tree)}
        </div>
        <div className="text-[10px] mc-muted mt-2 text-right">{chartOfAccounts.length} akun ({chartOfAccounts.filter(a => !a.isHeader).length} detail, {chartOfAccounts.filter(a => a.isHeader).length} grup)</div>
      </div>
    </div>
  );
}