/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, Tag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Barang, KategoriBarang } from '../../types';

interface MemberTokoProps {
  barang: Barang[];
  categories: KategoriBarang[];
}

export default function MemberToko({ barang, categories }: MemberTokoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('semua');

  const filteredBarang = barang.filter((b) => {
    const matchesSearch = b.nama.toLowerCase().includes(searchTerm.toLowerCase()) || b.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'semua' || b.kategoriId === selectedCat;
    return matchesSearch && matchesCat;
  });

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm text-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kebutuhan pokok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-xs"
          />
        </div>

        {/* Category tags */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCat('semua')}
            className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              selectedCat === 'semua'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-full font-semibold transition cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Shariah Retail Guarantee banner */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-xs flex gap-3 items-center shadow-sm">
        <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        <div>
          <h4 className="font-bold">Garansi Harga Adil Koperasi</h4>
          <p className="text-emerald-700 mt-0.5 leading-relaxed text-[11px]">
            Seluruh komoditas Toko Koperasi MetroCOOP diselenggarakan dengan skema harga kulakan adil bebas timbangan curang, guna menopang ketahanan pangan keluarga anggota.
          </p>
        </div>
      </div>

      {/* Bento-like Grid of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {filteredBarang.map((b) => {
          const isLow = b.stok <= b.stokMinimum;
          const isOut = b.stok === 0;

          return (
            <div key={b.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
              
              {/* Product Info header */}
              <div className="p-4 space-y-2">
                <span className="bg-slate-50 text-slate-500 border border-slate-200 font-bold font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                  {b.kode}
                </span>

                <h4 className="font-extrabold text-slate-800 text-sm tracking-tight leading-tight pt-1">
                  {b.nama}
                </h4>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Harga Satuan</span>
                  <span className="font-mono font-bold text-slate-900">{formatIDR(b.hargaJual)}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                  <span className="text-slate-400">Tersedia:</span>
                  <span className={`font-mono font-bold ${isOut ? 'text-red-600' : 'text-slate-700'}`}>
                    {b.stok} {b.satuan}
                  </span>
                </div>
              </div>

              {/* Purchase triggers (Simulated - members buy at checkout back office, or catalog serves for transparency) */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px]">
                {isOut ? (
                  <span className="text-red-500 font-bold uppercase tracking-wider">HABIS DEPO</span>
                ) : isLow ? (
                  <span className="text-amber-600 font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> STOK MENIPIS
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold uppercase tracking-wider">✓ STOK CUKUP</span>
                )}

                <span className="text-slate-400">Beli di Ruko Koperasi</span>
              </div>

            </div>
          );
        })}

        {filteredBarang.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 text-xs">
            Barang yang Anda cari tidak ditemukan.
          </div>
        )}
      </div>

    </div>
  );
}
