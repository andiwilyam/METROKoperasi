# Design: Comprehensive Interconnected Seed Data (MetroCoop KSP)

**Date:** 2026-07-13
**Status:** Approved direction (user skipped clarifying gate → proceed with recommended approach)
**Author:** TRAE assistant

## 1. Context & Problem

The Railway-deployed MetroCoop app shows "tidak ada data apapun" (no data) because the
production database has little to no demo/transactional data across modules. The backend and
API were verified to return data correctly — the gap is a complete, coherent dataset for
simulation/demo purposes across ALL modules.

**Goal:** Generate comprehensive, interconnected dummy/seed data covering every menu, module,
and feature, with related entities correctly linked, as a simulation for users.

## 2. Confirmed Parameters

- **Volume:** Medium — ~40 anggota/members, ~60 pinjaman/loans, plus proportional transaction
  volume for toko/PPOB/VA modules.
- **Strategy:** Clean reseed — delete old transactional data, KEEP login accounts
  (admin/operator/anggota users), then insert a new fully coherent & interconnected dataset.
- **Scope:** ALL 4 module groups:
  1. Inti KSP (anggota / simpan / pinjam)
  2. Unit Usaha (toko / PPOB / Virtual Account)
  3. Ventura & Pembiayaan AI
  4. Akuntansi & Landing CMS

## 3. Chosen Approach

**Pendekatan A — Programmatic Node.js seed script** (`seed_comprehensive.cjs`).

A single Node script generates all data in-memory with referential integrity computed
programmatically (e.g. `saldo_simpanan_* = Σ simpanan_transaksi`, `angsuran` rows derived from
`pinjaman` pokok/tenor), then bulk-inserts into the Supabase PostgreSQL database. Volume is
parameterized so it can be re-run/adjusted.

Rationale: guarantees internal consistency across modules (the core requirement "saling
terkoneksi"), is idempotent via a clean-truncate step, and is easy to re-run against Railway's
Supabase.

## 4. Database Connection

Reuse the Supabase connection string + pooler (`family: 4`) already established for
`seed_final.cjs`. The script reads `DATABASE_URL` from env (Railway injects Supabase URL).

## 5. Data Model & Volume (per module group)

### Group 1 — Inti KSP
- `koperasi_info`: 1 row (identitas koperasi).
- `users`: KEEP existing login accounts (superadmin/admin/operator + anggota). Generate
  additional anggota user accounts linked via `member_id` ↔ `anggota.id`.
- `anggota`: ~40 rows (mix of `konvensional` + a few `perusahaan` tipe).
- `jenis_simpanan`: 4 (pokok, wajib, sukarela, deposito).
- `simpanan_transaksi`: multiple per anggota; `saldo_simpanan_*` on `anggota` = Σ per jenis.
- `jenis_pinjaman`: 3 (with metode_bunga flat/efektif/anuitas).
- `pinjaman`: ~60 rows across anggota; status mix (pengajuan/disetujui/dicairkan/lunas).
- `angsuran`: derived per pinjaman (angsuran_ke 1..tenor, matches angsuran_per_bulan,
  sisa_pokok decreasing, status belum_bayar/lunas/terlambat).
- `permohonan_tarik`, `bukti_transfer`: a handful each.
- `pengurus`, `karyawan`, `aset_barang`, `sumber_bayar`: reference/support data.

### Group 2 — Unit Usaha (Toko / PPOB / VA)
- `kategori_barang`, `supplier`: reference data.
- `barang`: ~30 rows (kategori_id, supplier_id, stok, harga).
- `penjualan`: ~50 faktur (items JSONB, total, metode_bayar).
- `pembelian`: ~15 invoice (supplier_id, items, status).
- `ppob_layanan`: voucher/listrik/tagihan types.
- `ppob_transactions`: ~40 (layanan_id, nominal, harga_koperasi, harga_jual, status, sn).
- `virtual_accounts`: ~30 (anggota_id, bank, nomor_va, status).
- `va_transactions`: linked to virtual_accounts/anggota.
- `cicilan_barang`: ~20 (anggota_id, barang_nama, dp, tenor, angsuran_per_bulan).
- `cicilan_angsuran`: derived from cicilan_barang.
- `sewa_assets`, `sewa_transactions`: a few (aset disewa anggota).

### Group 3 — Ventura & Pembiayaan AI
- `perusahaan`: ~8 rows (kode_perusahaan, sektor, npwp, direktur).
- `pengajuan_pembiayaan`: ~12 (perusahaan_id, anggota_id, no_pengajuan, status, skor_akhir).
- `hasil_skoring`: 1 per pengajuan (skor_character/capacity/capital/collateral/condition,
  rasio_*, rekomendasi_*, ai_analisis_json).
- `dokumen_pengajuan`: kelompok LEGALITAS/KEUANGAN/AGUNAN/TATA_KELOLA with status_upload.
- `venture_investments`: ~8 (pengajuan_id ↔ pengajuan_pembiayaan, perusahaan_id ↔ perusahaan,
  nominal, persentase_saham, estimasi_dividen).
- `venture_dividends`: ~16 (investment_id, tanggal, nominal_dividen).
- `subledger_piutang`: linked to `pinjaman.no_pinjaman` (pokok_piutang, tunggakan, kolektibilitas).

### Group 4 — Akuntansi & Landing CMS
- `chart_of_accounts`: ~30 accounts (kode_akun, kategori ASET/KEWAJIBAN/EKUITAS/PENDAPATAN/
  BEBAN/SHU, saldo_normal, parent hierarchy).
- `accounting_periods`: 2024–2026 months (is_open/is_closed).
- `journal_entries`: reflect simpan/pinjam/penjualan flows; `details` JSONB; `journal_approvals`
  status (draft/posted/approved).
- `landing_settings`, `landing_hero`, `landing_features` (lf1–lf6), `landing_team`,
  `landing_testimonials`, `landing_pricing`, `landing_contact`: CMS content.
- `feature_toggles`: enable all modules.
- `pengumuman`: a few announcements.
- `tiket_bantuan`: a few (anggota_id, kategori, prioritas, status).

## 6. Cross-Module Connection Rules (the "saling terkoneksi" requirement)

- `anggota.id` ↔ `users.member_id` (login ↔ member profile).
- `angsuran.pinjaman_id` ↔ `pinjaman.id`; `pinjaman.anggota_id` ↔ `anggota.id`.
- `saldo_simpanan_pokok/wajib/sukarela` on `anggota` = Σ `simpanan_transaksi` per jenis (no drift).
- `virtual_accounts.anggota_id` ↔ `anggota.id`; `va_transactions.anggota_id` ↔ `anggota.id`.
- `cicilan_angsuran.cicilan_barang_id` ↔ `cicilan_barang.id`; `cicilan_barang.anggota_id` ↔ `anggota`.
- `subledger_piutang.no_pinjaman` ↔ `pinjaman.no_pinjaman`.
- `venture_investments.pengajuan_id` ↔ `pengajuan_pembiayaan.id`; `perusahaan_id` ↔ `perusahaan.id`.
- `hasil_skoring.pengajuan_id` ↔ `pengajuan_pembiayaan.id` (UNIQUE).
- `tiket_bantuan.anggota_id` ↔ `anggota.id`; `dokumen_pengajuan.pengajuan_id` ↔ `pengajuan_pembiayaan.id`.
- `journal_entries` reference real anggota/periode; `journal_approvals.jurnal_id` ↔ `journal_entries.id`.

## 7. Clean Reseed Procedure

1. TRUNCATE all transactional tables (CASCADE) EXCEPT `users` and `koperasi_info`.
2. Re-insert reference data (jenis_simpanan, jenis_pinjaman, chart_of_accounts, accounting_periods,
   kategori_barang, supplier, sumber_bayar, feature_toggles, landing_*).
3. Generate & insert anggota + linked member users.
4. Generate & insert simpanan/pinjaman/angsuran with computed consistency.
5. Generate Unit Usaha, Ventura, Akuntansi, CMS data in dependency order.
6. Print a summary count per table for verification.

## 8. Verification

- Run script against Supabase; confirm row counts.
- Query a few cross-links (e.g. `saldo = Σ mutasi`, `angsuran count = Σ tenor`).
- Login on Railway with admin/anggota accounts and confirm all menus now show data.

## 9. Out of Scope

- No schema migrations (reuse existing `db/schema.sql`).
- No password/account changes beyond preserving logins.
- No real PPOB/VA provider integration (all dummy).
