/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, CheckCircle, Package, Users, AlertTriangle, Settings, Sparkles, DollarSign } from 'lucide-react';
import { Barang, KategoriBarang, Supplier, Penjualan, Pembelian } from '../../types';

interface AdminTokoProps {
  barang: Barang[];
  categories: KategoriBarang[];
  suppliers: Supplier[];
  penjualanList: Penjualan[];
  pembelianList: Pembelian[];
  onRecordSale: (newSale: Omit<Penjualan, 'id' | 'noFaktur' | 'tanggal'>) => Promise<any> | void;
  onRecordPurchase: (newPurchase: Omit<Pembelian, 'id' | 'noInvoice' | 'tanggal' | 'status'>) => void;
  onUpdateStock: (barangId: string, newStock: number) => void;
  subView: 'kasir' | 'barang' | 'supplier' | 'laporan';
}

export default function AdminToko({
  barang,
  categories,
  suppliers,
  penjualanList,
  pembelianList,
  onRecordSale,
  onRecordPurchase,
  onUpdateStock,
  subView
}: AdminTokoProps) {
  // 1. KASIR STATE
  const [cart, setCart] = useState<{ barangId: string; nama: string; qty: number; hargaJual: number; subtotal: number }[]>([]);
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [metodeBayar, setMetodeBayar] = useState('Tunai');
  const [bayarTunai, setBayarTunai] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [lastFaktur, setLastFaktur] = useState('');

  // 2. PEMBELIAN STATE
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [purchaseBarangId, setPurchaseBarangId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState(10);
  const [purchasePrice, setPurchasePrice] = useState(50000);

  // Computed Cart metrics
  const totalBelanja = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalSetelahDiskon = Math.max(0, totalBelanja - diskon);
  const kembalian = Math.max(0, bayarTunai - totalSetelahDiskon);

  // Kasir Add to Cart
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarangId || saleQty <= 0) return;

    const b = barang.find((item) => item.id === selectedBarangId);
    if (!b) return;

    if (saleQty > b.stok) {
      alert(`Stok tidak mencukupi! Stok saat ini: ${b.stok} ${b.satuan}`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.barangId === selectedBarangId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].qty + saleQty;
      if (newQty > b.stok) {
        alert(`Jumlah komulatif melebihi stok yang ada!`);
        return;
      }
      updatedCart[existingIndex].qty = newQty;
      updatedCart[existingIndex].subtotal = newQty * b.hargaJual;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          barangId: selectedBarangId,
          nama: b.nama,
          qty: saleQty,
          hargaJual: b.hargaJual,
          subtotal: saleQty * b.hargaJual
        }
      ]);
    }

    setSelectedBarangId('');
    setSaleQty(1);
  };

  // Kasir Checkout Pay
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (metodeBayar === 'Tunai' && bayarTunai < totalSetelahDiskon) {
      alert(`Uang pembayaran kurang!`);
      return;
    }

    // Record Sale — capture real faktur from API response
    const result = await onRecordSale({
      items: cart,
      total: totalSetelahDiskon,
      metodeBayar,
      diskon
    });

    // Use real faktur number from backend when available
    const realFaktur = (result && result.noFaktur)
      ? result.noFaktur
      : 'FK-' + new Date().toISOString().slice(2,10).replace(/-/g,'') + '-' + Math.floor(100 + Math.random() * 900);
    setLastFaktur(realFaktur);
    setIsPaid(true);
  };

  // Reset Kasir for next Customer
  const handleResetKasir = () => {
    setCart([]);
    setDiskon(0);
    setBayarTunai(0);
    setIsPaid(false);
    setLastFaktur('');
  };

  // Restock / Purchase Goods from Supplier
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !purchaseBarangId || purchaseQty <= 0) return;

    const b = barang.find((x) => x.id === purchaseBarangId);
    if (!b) return;

    onRecordPurchase({
      supplierId: selectedSupplierId,
      supplierNama: suppliers.find((s) => s.id === selectedSupplierId)?.nama || 'Supplier',
      items: [
        {
          barangId: purchaseBarangId,
          nama: b.nama,
          qty: purchaseQty,
          hargaBeli: purchasePrice,
          subtotal: purchaseQty * purchasePrice
        }
      ],
      total: purchaseQty * purchasePrice
    });

    // Update in-memory stock
    onUpdateStock(purchaseBarangId, b.stok + purchaseQty);

    alert(`Pembelian inventaris baru berhasil didaftarkan! Stok ${b.nama} bertambah ${purchaseQty} ${b.satuan}`);
    setPurchaseBarangId('');
    setPurchaseQty(10);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KASIR POS INTERAKTIF */}
      {subView === 'kasir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Add items to Cart */}
          <div className="lg:col-span-7 space-y-6">
            <div className="mc-card space-y-4">
              <h3 className="font-bold mc-ink-strong text-xs flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 mc-icon-accent" />
                Input Penjualan Kasir POS
              </h3>

              {!isPaid ? (
                <form onSubmit={handleAddToCart} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Produk Barang</label>
                    <select
                      value={selectedBarangId}
                      onChange={(e) => {
                        setSelectedBarangId(e.target.value);
                        const b = barang.find((x) => x.id === e.target.value);
                        if (b) setSaleQty(1);
                      }}
                      required
                      className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 mc-ink-strong font-semibold"
                    >
                      <option value="">-- Pilih Barang --</option>
                      {barang.map((b) => (
                        <option key={b.id} value={b.id} disabled={b.stok === 0}>
                          {b.nama} (Stok: {b.stok} {b.satuan} / Harga: {formatIDR(b.hargaJual)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mc-ink-strong mb-1.5">Kuantitas (Qty)</label>
                    <input
                      type="number"
                      value={saleQty}
                      min={1}
                      onChange={(e) => setSaleQty(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 mc-border rounded-lg mc-focus focus:ring-[var(--mc-accent)] mc-surface-2 font-mono font-bold mc-ink-strong"
                    />
                  </div>

                  <div className="sm:col-span-3 text-right">
                    <button
                      type="submit"
                      disabled={!selectedBarangId}
                      className="mc-btn-primary disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer shadow-sm"
                    >
                      Masukkan Keranjang
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 mc-surface-2 mc-border rounded-xl mc-badge-ok text-xs flex flex-col items-center justify-center text-center space-y-2 py-8 animate-fadeIn" style={{ borderColor: 'var(--mc-success)' }}>
                  <CheckCircle className="w-12 h-12" style={{ color: 'var(--mc-success)' }} />
                  <h4 className="font-bold text-sm">Pembayaran Sukses!</h4>
                  <p className="text-[11px]" style={{ color: 'var(--mc-success)' }}>Faktur {lastFaktur} berhasil dibukukan ke jurnal akuntansi.</p>
                  <button
                    onClick={handleResetKasir}
                    className="mt-2 mc-btn-primary font-semibold px-4 py-2 rounded-lg"
                  >
                    Buka Transaksi Baru
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Content */}
            <div className="mc-card space-y-4">
              <h3 className="font-bold mc-ink-strong text-xs">Keranjang Belanja</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-10 mc-border border-dashed rounded-lg mc-muted text-xs">
                  🛒 Keranjang masih kosong. Pilih barang untuk ditambahkan.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="divide-y mc-border text-xs max-h-56 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={item.barangId} className="flex justify-between items-center py-2.5">
                        <div>
                          <div className="font-bold mc-ink-strong">{item.nama}</div>
                          <div className="text-[10px] mc-muted font-mono mt-0.5">
                            {item.qty} pcs x {formatIDR(item.hargaJual)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold mc-ink-strong">{formatIDR(item.subtotal)}</span>
                          <button
                            type="button"
                            onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Receipt Checkout Area */}
          <div className="lg:col-span-5 mc-card flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold mc-ink-strong text-xs">Struk & Ringkasan Kasir</h3>
              
              {/* Receipt Visual Design */}
              <div className="mc-surface-2 mc-border rounded-xl p-4 font-mono text-[11px] mc-muted space-y-3">
                <div className="text-center border-b border-dashed mc-border pb-2">
                  <div className="font-bold text-xs mc-ink-strong">Toko Koperasi MetroCoop</div>
                  <div className="mc-muted">Jl. Pemuda No. 45, Jakarta</div>
                  <div className="text-[10px] mc-muted mt-1">Faktur: {lastFaktur || 'FK-PENDING-001'}</div>
                  <div className="text-[10px] mc-muted">Kasir: {isPaid ? 'Yulianto' : 'Admin Staff'}</div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 py-1">
                  {cart.map((item) => (
                    <div key={item.barangId} className="flex justify-between">
                      <span className="truncate max-w-[150px]">{item.nama}</span>
                      <span className="mc-ink">{item.qty}x {formatIDR(item.hargaJual)}</span>
                    </div>
                  ))}
                  {cart.length === 0 && <div className="text-center mc-muted py-4">Belum ada barang</div>}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed mc-border pt-2 space-y-1 font-bold">
                  <div className="flex justify-between">
                    <span className="mc-muted">Subtotal:</span>
                    <span className="mc-ink-strong">{formatIDR(totalBelanja)}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--mc-error)' }}>
                    <span className="mc-muted">Diskon Koperasi:</span>
                    <span className="mc-ink-strong">-{formatIDR(diskon)}</span>
                  </div>
                  <div className="flex justify-between mc-ink-strong border-t mc-border pt-1 text-xs">
                    <span>TOTAL AKHIR:</span>
                    <span>{formatIDR(totalSetelahDiskon)}</span>
                  </div>
                  
                  {metodeBayar === 'Tunai' && (
                    <>
                      <div className="flex justify-between mc-muted font-normal">
                        <span>Bayar Tunai:</span>
                        <span className="mc-ink">{formatIDR(bayarTunai)}</span>
                      </div>
                      <div className="flex justify-between mc-muted font-normal">
                        <span>Kembalian:</span>
                        <span className="mc-ink-strong">{formatIDR(kembalian)}</span>
                      </div>
                    </>
                  )}
                  {metodeBayar !== 'Tunai' && (
                    <div className="flex justify-between" style={{ color: 'var(--mc-primary)' }}>
                      <span className="mc-muted">Metode:</span>
                      <span className="mc-ink-strong">{metodeBayar}</span>
                    </div>
                  )}
                </div>

                <div className="text-center border-t border-dashed mc-border pt-2 text-[10px] mc-muted leading-tight">
                  Terima kasih atas belanja Anda.<br />
                  Partisipasi Anda memajukan Koperasi kita!
                </div>
              </div>
            </div>

            {cart.length > 0 && !isPaid && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 mt-4 border-t mc-border text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mc-ink-strong mb-1.5">Metode Bayar</label>
                    <select
                      value={metodeBayar}
                      onChange={(e) => setMetodeBayar(e.target.value)}
                      className="w-full px-2.5 py-2 mc-border rounded-lg mc-surface-2 mc-ink-strong font-semibold"
                    >
                      <option value="Tunai">💵 Tunai Cash</option>
                      <option value="Transfer Mandiri">🏦 Transfer Bank</option>
                      <option value="QRIS">📱 QRIS Standar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mc-ink-strong mb-1.5">Beri Diskon (Rp)</label>
                    <input
                      type="number"
                      step={1000}
                      value={diskon}
                      onChange={(e) => setDiskon(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 mc-border rounded-lg mc-surface-2 font-mono font-bold mc-ink-strong"
                    />
                  </div>
                </div>

                {metodeBayar === 'Tunai' && (
                  <div>
                    <label className="block font-semibold mc-ink-strong mb-1.5">Uang Diterima Tunai (Rp)</label>
                    <input
                      type="number"
                      value={bayarTunai}
                      step={5000}
                      onChange={(e) => setBayarTunai(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 mc-border rounded-lg mc-surface-2 font-mono font-extrabold text-sm mc-ink-strong"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 mc-btn-primary font-semibold rounded-lg shadow-md cursor-pointer transition text-center"
                >
                  Proses Bayar & Potong Stok
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* 2. KATALOG BARANG & LOW STOCK ALERTS */}
      {subView === 'barang' && (
        <div className="mc-card overflow-hidden">
          <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm flex justify-between items-center">
            <span>Stok Barang Toko Koperasi</span>
            <span className="text-xs mc-btn-danger px-2.5 py-0.5 rounded-full font-semibold">
              ⚠️ {barang.filter(x => x.stok <= x.stokMinimum).length} Barang Perlu Restock
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="mc-surface-2 border-b mc-border mc-muted font-semibold">
                  <th className="p-4">Kode Barang</th>
                  <th className="p-4">Nama Barang</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Beli</th>
                  <th className="p-4">Harga Jual</th>
                  <th className="p-4">Stok Saat Ini</th>
                  <th className="p-4">Stok Minimum</th>
                  <th className="p-4">Satuan</th>
                </tr>
              </thead>
              <tbody className="divide-y mc-border">
                {barang.map((b) => {
                  const isLow = b.stok <= b.stokMinimum;
                  return (
                    <tr key={b.id} className={`hover:mc-surface-2/50 ${isLow ? 'mc-surface-2/20' : ''}`} style={{ backgroundColor: isLow ? 'var(--mc-error-transparent)' : 'transparent' }}>
                      <td className="p-4 font-mono font-bold mc-muted">{b.kode}</td>
                      <td className="p-4 font-bold mc-ink-strong">{b.nama}</td>
                      <td className="p-4 mc-ink">{categories.find((c) => c.id === b.kategoriId)?.nama || 'Kategori'}</td>
                      <td className="p-4 font-mono mc-ink">{formatIDR(b.hargaBeli)}</td>
                      <td className="p-4 font-mono font-bold mc-ink-strong">{formatIDR(b.hargaJual)}</td>
                      <td className="p-4">
                        <span className={`font-mono font-extrabold ${isLow ? 'text-red-600' : 'mc-ink-strong'}`}>
                          {b.stok}
                        </span>
                        {isLow && (
                          <span className="ml-2 text-[9px] font-bold mc-btn-danger px-1.5 py-0.5 rounded border">
                            LOW STOCK
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono mc-muted">{b.stokMinimum}</td>
                      <td className="p-4 mc-ink font-semibold">{b.satuan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUPPLIER & PURCHASE ORDER */}
      {subView === 'supplier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Purchase Order Restock Form */}
          <div className="lg:col-span-5 mc-card space-y-4">
            <h3 className="font-bold mc-ink-strong text-xs flex items-center gap-1.5">
              <Package className="w-4 h-4" style={{ color: 'var(--mc-primary)' }} />
              Catat Pembelian Restock Barang
            </h3>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Supplier Resmi</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  required
                  className="w-full px-3 py-2 mc-border rounded-lg mc-surface-2 mc-ink-strong font-semibold"
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mc-ink-strong mb-1.5">Pilih Barang Restock</label>
                <select
                  value={purchaseBarangId}
                  onChange={(e) => {
                    setPurchaseBarangId(e.target.value);
                    const b = barang.find((x) => x.id === e.target.value);
                    if (b) setPurchasePrice(b.hargaBeli);
                  }}
                  required
                  className="w-full px-3 py-2 mc-border rounded-lg mc-surface-2 mc-ink-strong font-semibold"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barang.map((b) => (
                    <option key={b.id} value={b.id}>{b.nama} (Stok saat ini: {b.stok})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mc-ink-strong mb-1.5">Jumlah Qty Beli</label>
                  <input
                    type="number"
                    value={purchaseQty}
                    min={1}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 mc-border rounded-lg mc-surface-2 font-mono font-bold mc-ink-strong"
                  />
                </div>

                <div>
                  <label className="block font-semibold mc-ink-strong mb-1.5">Harga Beli per Pcs (Rp)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    step={1000}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 mc-border rounded-lg mc-surface-2 font-mono font-bold mc-ink-strong"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 font-semibold rounded-lg shadow cursor-pointer transition text-center" style={{ background: 'var(--mc-primary)' }}
              >
                Proses & Catat Restock
              </button>
            </form>
          </div>

          {/* Supplier Directory list */}
          <div className="lg:col-span-7 mc-card overflow-hidden">
            <div className="p-4 border-b mc-border font-bold mc-ink-strong text-sm">
              Direktori Supplier Rekanan Koperasi
            </div>
            <div className="divide-y mc-border text-xs">
              {suppliers.map((s) => (
                <div key={s.id} className="p-4 space-y-1">
                  <div className="font-bold mc-ink-strong text-sm">{s.nama}</div>
                  <div className="mc-ink">Kontak Person: <span className="font-semibold mc-ink-strong">{s.kontak}</span></div>
                  <div className="mc-muted font-mono">{s.noHp}</div>
                  <div className="mc-muted">{s.alamat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. LAPORAN & COA SETTINGS */}
      {subView === 'laporan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Laba Rugi / Sales summary card */}
          <div className="lg:col-span-7 mc-card space-y-4">
            <h3 className="font-bold mc-ink-strong text-xs">Laporan Penjualan Toko Terakhir</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="mc-surface-2 mc-muted font-semibold border-b mc-border">
                    <th className="p-3">Faktur</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Metode</th>
                    <th className="p-3 text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y mc-border">
                  {penjualanList.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-mono font-bold mc-muted">{p.noFaktur}</td>
                      <td className="p-3 mc-muted">{p.tanggal}</td>
                      <td className="p-3 font-semibold mc-ink">{p.metodeBayar}</td>
                      <td className="p-3 text-right font-mono font-bold mc-ink-strong">{formatIDR(p.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Toko Default Accounting Accounts Settings */}
          <div className="lg:col-span-5 mc-card space-y-4">
            <h3 className="font-bold mc-ink-strong text-xs flex items-center gap-1.5">
              <Settings className="w-4 h-4 mc-muted" />
              Pemetaan Akun Akuntansi Toko (COA)
            </h3>
            
            <p className="text-[11px] mc-muted leading-relaxed">
              Konfigurasi nomor akun pembukuan otomatis (auto-journal COA) ketika terjadi penjualan kasir atau pembelian supplier di Unit Toko.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b mc-border">
                <span className="font-medium mc-ink">Akun Kas Toko (Cash)</span>
                <span className="font-mono font-bold mc-badge-accent px-2 py-0.5 rounded">1101 (Kas Kecil)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b mc-border">
                <span className="font-medium mc-ink">Akun Persediaan Barang</span>
                <span className="font-mono font-bold mc-badge-accent px-2 py-0.5 rounded">1103 (Persediaan)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b mc-border">
                <span className="font-medium mc-ink">Pendapatan Penjualan</span>
                <span className="font-mono font-bold mc-badge-accent px-2 py-0.5 rounded">4101 (Hasil Penjualan)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-medium mc-ink">Beban Pokok (HPP)</span>
                <span className="font-mono font-bold mc-badge-accent px-2 py-0.5 rounded">5106 (HPP Pembukuan)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}