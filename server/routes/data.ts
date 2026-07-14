import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import pool from '../db.js';
import { AuthRequest, authMiddleware, adminOnly } from '../middleware.js';
import { buildInstallmentSchedule, computeTotalHpp } from '../lib/finance.js';

const router = Router();

// All data routes require auth
router.use(authMiddleware);

// Helper: generate unique IDs
const genId = () => Math.random().toString(36).substr(2, 9);

// Helper: convert snake_case object keys to camelCase
const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
const mapRow = <T extends Record<string, any>>(row: T) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [toCamel(k), v])) as any;
const mapRows = <T extends Record<string, any>>(rows: T[]) => rows.map(mapRow as any) as any[];

// ==================== DATA SCOPING (role-based) ====================
// Staff (admin/operator/superadmin) boleh melihat seluruh data.
// Anggota biasa / anggota perusahaan hanya boleh melihat data miliknya sendiri.
const STAFF_ROLES = ['admin', 'superadmin', 'operator'];
function isStaff(req: AuthRequest): boolean {
  return !!req.user && STAFF_ROLES.includes(req.user.role);
}
// Mengembalikan memberId yang boleh diakses, atau null bila staff (lihat semua).
function scopeMemberId(req: AuthRequest): string | null {
  if (isStaff(req)) return null;
  return req.user?.memberId ?? req.user?.id ?? '__none__';
}
// Guard: hanya staff yang boleh. Mengirim 403 bila bukan staff.
function requireStaff(req: AuthRequest, res: Response): boolean {
  if (!isStaff(req)) {
    res.status(403).json({ error: 'Akses ditolak: hanya staff yang diizinkan melihat data ini' });
    return false;
  }
  return true;
}

// ==================== Zod Schemas for key POST endpoints ====================
const SimpananTransaksiSchema = z.object({
  anggotaId: z.string().min(1),
  anggotaNama: z.string().optional(),
  jenisSimpananId: z.string().optional(),
  jenisNama: z.string().optional(),
  tanggal: z.string().optional(),
  tipe: z.enum(['setor', 'tarik']),
  jumlah: z.number().positive(),
  keterangan: z.string().optional(),
});

const PinjamanSchema = z.object({
  anggotaId: z.string().min(1),
  anggotaNama: z.string().optional(),
  jenisPinjamanId: z.string().optional(),
  jenisNama: z.string().optional(),
  pokok: z.number().positive(),
  tenorMonths: z.number().int().positive(),
  bungaPersen: z.number().min(0),
  metodeBunga: z.enum(['flat', 'efektif', 'anuitas']).optional(),
  angsuranPerBulan: z.number().optional(),
  biayaAdmin: z.number().optional(),
  tujuan: z.string().optional(),
});

const PenjualanSchema = z.object({
  items: z.array(z.object({
    barangId: z.string().optional(),
    namaBarang: z.string().optional(),
    qty: z.number().positive().optional(),
    hargaJual: z.number().optional(),
  })),
  total: z.number().positive(),
  metodeBayar: z.string().optional(),
  diskon: z.number().optional(),
});

// ==================== ANGGOTA (Members) ====================

router.get('/anggota', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM anggota WHERE id=$1 ORDER BY nama ASC' : 'SELECT * FROM anggota ORDER BY nama ASC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/anggota', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nik, nama, noKtp, noHp, email, alamat, pekerjaan, penghasilan } = req.body;
    const id = 'm' + genId();
    const result = await pool.query(
      `INSERT INTO anggota (id, nik, nama, no_ktp, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'aktif', CURRENT_DATE, 100000, 50000, 0)
       RETURNING *`,
      [id, nik, nama, noKtp || '', noHp || '', email || '', alamat || '', pekerjaan || '', penghasilan || 0]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/anggota/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nik, nama, noKtp, noHp, email, alamat, pekerjaan, penghasilan, statusKeanggotaan } = req.body;
    const result = await pool.query(
      `UPDATE anggota SET nik=$1, nama=$2, no_ktp=$3, no_hp=$4, email=$5, alamat=$6, pekerjaan=$7, penghasilan=$8, status_keanggotaan=$9
       WHERE id=$10 RETURNING *`,
      [nik, nama, noKtp || '', noHp || '', email || '', alamat || '', pekerjaan || '', penghasilan || 0, statusKeanggotaan || 'aktif', id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/anggota/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM anggota WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== JENIS SIMPANAN ====================

let jenisSimpananCache: any[] | null = null;

router.get('/jenis-simpanan', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM jenis_simpanan ORDER BY id');
    jenisSimpananCache = result.rows;
    return res.json(mapRows(result.rows));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/jenis-simpanan', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Array expected' });
    for (const item of items) {
      await pool.query(
        `UPDATE jenis_simpanan SET nama=$1, tipe=$2, minimal_setoran=$3, bunga_persen=$4 WHERE id=$5`,
        [item.nama, item.tipe, item.minimalSetoran, item.bungaPersen, item.id]
      );
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== SIMPANAN TRANSAKSI ====================

router.get('/simpanan-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM simpanan_transaksi WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM simpanan_transaksi ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/simpanan-transaksi', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = SimpananTransaksiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Data tidak lengkap atau tidak valid' });
    }
    const { anggotaId, anggotaNama, jenisSimpananId, jenisNama, tanggal, tipe, jumlah, keterangan } = parsed.data;

    const id = 'trans-' + genId();
    const tgl = tanggal || new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO simpanan_transaksi (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, tanggal, tipe, jumlah, keterangan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, anggotaId, anggotaNama, jenisSimpananId, jenisNama, tgl, tipe, jumlah, keterangan || '']
    );

    // Update member balance
    const sign = tipe === 'setor' ? '+' : '-';
    const balanceField = jenisSimpananId === 'js1' ? 'saldo_simpanan_pokok' :
                         jenisSimpananId === 'js2' ? 'saldo_simpanan_wajib' : 'saldo_simpanan_sukarela';
    await pool.query(`UPDATE anggota SET ${balanceField} = GREATEST(0, ${balanceField} ${sign} $1) WHERE id=$2`, [jumlah, anggotaId]);

    // Create journal entry
    const simpananCoa = jenisSimpananId === 'js1' ? '2.1.01' : jenisSimpananId === 'js2' ? '2.1.02' : '2.1.03';
    const coaDebet = tipe === 'setor' ? '1.1.03' : simpananCoa;
    const coaKredit = tipe === 'setor' ? simpananCoa : '1.1.03';
    const namaDebet = tipe === 'setor' ? 'Bank Mandiri' : `Simpanan ${jenisNama}`;
    const namaKredit = tipe === 'setor' ? `Simpanan ${jenisNama}` : 'Bank Mandiri';
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,$3,$4,'Simpanan',$5,$5,$6)`,
      ['j' + genId(), 'JR-' + Date.now(),
       tgl, `${tipe === 'setor' ? 'Setor' : 'Tarik'} ${jenisNama} - ${anggotaNama}`,
       jumlah,
       JSON.stringify([
         { coa: coaDebet, namaAkun: namaDebet, debit: jumlah, kredit: 0 },
         { coa: coaKredit, namaAkun: namaKredit, debit: 0, kredit: jumlah }
       ])]
    );

    return res.json({ id, success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== PERMOHONAN TARIK ====================

router.get('/permohonan-tarik', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM permohonan_tarik WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM permohonan_tarik ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/permohonan-tarik', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, anggotaNama, jenisSimpananId, jenisNama, jumlah } = req.body;
    const id = 'pt-' + genId();
    await pool.query(
      `INSERT INTO permohonan_tarik (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, jumlah, status)
       VALUES ($1,$2,$3,$4,$5,$6,'pengajuan')`,
      [id, anggotaId, anggotaNama, jenisSimpananId, jenisNama, jumlah]
    );
    return res.json({ id, success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/permohonan-tarik/:id/:action', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id, action } = req.params;
    if (action === 'approve') {
      const perm = await pool.query('SELECT * FROM permohonan_tarik WHERE id=$1', [id]);
      if (perm.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      const p = perm.rows[0];
      await pool.query(`UPDATE permohonan_tarik SET status='disetujui' WHERE id=$1`, [id]);
      // Execute withdrawal
      await pool.query(
        `INSERT INTO simpanan_transaksi (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, tanggal, tipe, jumlah, keterangan)
         VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,'tarik',$6,$7)`,
        ['trans-' + genId(), p.anggota_id, p.anggota_nama, p.jenis_simpanan_id, p.jenis_nama, p.jumlah, 'Pencairan Tarik Tunai']
      );
      return res.json({ success: true });
    } else {
      await pool.query(`UPDATE permohonan_tarik SET status='ditolak' WHERE id=$1`, [id]);
      return res.json({ success: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== JENIS PINJAMAN ====================

router.get('/jenis-pinjaman', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM jenis_pinjaman ORDER BY id');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/jenis-pinjaman', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Array expected' });
    for (const item of items) {
      await pool.query(
        `UPDATE jenis_pinjaman SET nama=$1, bunga_persen=$2, metode_bunga=$3, maks_tenor=$4, maks_plafon=$5, biaya_admin=$6 WHERE id=$7`,
        [item.nama, item.bungaPersen, item.metodeBunga, item.maksTenor, item.maksPlafon, item.biayaAdmin, item.id]
      );
    }
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PINJAMAN ====================

router.get('/pinjaman', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM pinjaman WHERE anggota_id=$1 ORDER BY tanggal_pengajuan DESC' : 'SELECT * FROM pinjaman ORDER BY tanggal_pengajuan DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/pinjaman', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = PinjamanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Data pinjaman tidak valid' });
    }
    const { anggotaId, anggotaNama, jenisPinjamanId, jenisNama, pokok, tenorMonths, bungaPersen, metodeBunga, angsuranPerBulan, biayaAdmin, tujuan } = parsed.data;
    const id = 'p_' + genId();
    const result = await pool.query(
      `INSERT INTO pinjaman (id, anggota_id, anggota_nama, jenis_pinjaman_id, jenis_nama, no_pinjaman, pokok, tenor_months, bunga_persen, metode_bunga, angsuran_per_bulan, biaya_admin, sisa_pokok, status, tanggal_pengajuan)
       VALUES ($1,$2,$3,$4,$5,'',$6,$7,$8,$9,$10,$11,$12,'pengajuan',CURRENT_DATE) RETURNING *`,
      [id, anggotaId, anggotaNama, jenisPinjamanId, jenisNama, pokok, tenorMonths, bungaPersen, metodeBunga, angsuranPerBulan || 0, biayaAdmin || 0, pokok]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/pinjaman/:id/approve', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const loan = await pool.query('SELECT * FROM pinjaman WHERE id=$1', [req.params.id]);
    if (loan.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const l = loan.rows[0];

    const noRef = 'PJ-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    await pool.query(
      `UPDATE pinjaman SET status='dicairkan', no_pinjaman=$1, tanggal_cair=CURRENT_DATE WHERE id=$2`,
      [noRef, req.params.id]
    );

    // Generate installment schedule (sliding balance untuk efektif/anuitas)
    const schedule = buildInstallmentSchedule({
      pokok: l.pokok,
      tenorMonths: l.tenor_months,
      bungaPersen: l.bunga_persen,
      metodeBunga: l.metode_bunga,
      angsuranPerBulan: l.angsuran_per_bulan,
    });
    for (let i = 0; i < schedule.length; i++) {
      const s = schedule[i];
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (i + 1));
      await pool.query(
        `INSERT INTO angsuran (id, pinjaman_id, anggota_nama, angsuran_ke, tanggal_jatuh_tempo, pokok_bayar, bunga_bayar, total_bayar, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'belum_bayar')`,
        ['a' + genId(), l.id, l.anggota_nama, i + 1, dueDate.toISOString().split('T')[0], s.pokokBayar, s.bungaBayar, s.totalBayar]
      );
    }

    // Journal entry
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Pinjaman',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Pencairan Pembiayaan ${l.jenis_nama} - Ref ${noRef}`, l.pokok,
       JSON.stringify([{ coa: '1.2.01', namaAkun: 'Piutang Pinjaman Anggota - Lancar', debit: l.pokok, kredit: 0 }, { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: 0, kredit: l.pokok }])]
    );

    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/pinjaman/:id/reject', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(`UPDATE pinjaman SET status='ditolak' WHERE id=$1`, [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== ANGSURAN ====================

router.get('/angsuran', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      `SELECT a.* FROM angsuran a
       JOIN pinjaman p ON a.pinjaman_id = p.id
       ${mid ? 'WHERE p.anggota_id=$1' : ''}
       ORDER BY a.tanggal_jatuh_tempo`,
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/angsuran/:id/pay', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { denda } = req.body;
    const s = await pool.query('SELECT * FROM angsuran WHERE id=$1', [id]);
    if (s.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const schedule = s.rows[0];

    await pool.query(
      `UPDATE angsuran SET status='lunas', tanggal_bayar=CURRENT_DATE WHERE id=$1`,
      [id]
    );

    await pool.query(
      `UPDATE pinjaman SET sisa_pokok = GREATEST(0, sisa_pokok - $1), status = CASE WHEN GREATEST(0, sisa_pokok - $1) <= 0 THEN 'lunas' ELSE status END WHERE id=$2`,
      [schedule.pokok_bayar, schedule.pinjaman_id]
    );

    // Journal entry
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Pinjaman',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Terima Angsuran #${schedule.angsuran_ke} - ${schedule.anggota_nama}`,
       schedule.total_bayar,
       JSON.stringify([
         { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: schedule.total_bayar, kredit: 0 },
         { coa: '1.2.01', namaAkun: 'Piutang Pinjaman Anggota - Lancar', debit: 0, kredit: schedule.pokok_bayar },
         { coa: '4.1.01', namaAkun: 'Pendapatan Bunga Pinjaman', debit: 0, kredit: schedule.bunga_bayar }
       ])]
    );

    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== JURNAL ====================

router.get('/jurnal', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const result = await pool.query('SELECT * FROM journal_entries ORDER BY tanggal DESC');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== TOKO / BARANG ====================

router.get('/barang', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM barang ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/barang/:id/stock', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { newStock } = req.body;
    await pool.query('UPDATE barang SET stok=$1 WHERE id=$2', [newStock, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/kategori-barang', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM kategori_barang ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/supplier', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM supplier ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PENJUALAN & PEMBELIAN ====================

router.get('/penjualan', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const result = await pool.query('SELECT * FROM penjualan ORDER BY tanggal DESC');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/penjualan', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = PenjualanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Data penjualan tidak valid' });
    }
    const { items, total, metodeBayar, diskon } = parsed.data;
    const id = 's-' + genId();
    const ref = 'FK-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    await pool.query(
      `INSERT INTO penjualan (id, no_faktur, tanggal, items, total, metode_bayar, diskon)
       VALUES ($1,$2,CURRENT_DATE,$3,$4,$5,$6)`,
      [id, ref, JSON.stringify(items || []), total, metodeBayar || 'Tunai', diskon || 0]
    );

    // --- Hitung HPP riil dari harga_beli barang ---
    const barangIds: string[] = [];
    for (const item of (items || [])) {
      if (item.barangId && !barangIds.includes(item.barangId)) barangIds.push(item.barangId);
    }
    const hargaBeliById: Record<string, number> = {};
    if (barangIds.length > 0) {
      const placeholders = barangIds.map((_, i) => `$${i + 1}`).join(',');
      const hbResult = await pool.query(`SELECT id, harga_beli FROM barang WHERE id IN (${placeholders})`, barangIds);
      for (const row of hbResult.rows) {
        hargaBeliById[row.id] = parseFloat(row.harga_beli) || 0;
      }
    }
    const estimatedHpp = computeTotalHpp(items || [], hargaBeliById);

    // Decrement stock for each sold item
    for (const item of (items || [])) {
      if (item.barangId && item.qty) {
        await pool.query('UPDATE barang SET stok = GREATEST(0, stok - $1) WHERE id=$2', [item.qty, item.barangId]);
      }
    }

    // Journal entry
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Toko',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Penjualan Toko - Faktur ${ref}`, (total || 0) + estimatedHpp,
       JSON.stringify([
         { coa: '1.1.01', namaAkun: 'Kas Kecil', debit: total || 0, kredit: 0 },
         { coa: '4.1.04', namaAkun: 'Pendapatan Penjualan Toko', debit: 0, kredit: total || 0 },
         { coa: '5.1.14', namaAkun: 'Harga Pokok Penjualan (HPP)', debit: estimatedHpp, kredit: 0 },
         { coa: '1.4.01', namaAkun: 'Persediaan Barang Dagangan', debit: 0, kredit: estimatedHpp }
       ])]
    );

    return res.json({ id, noFaktur: ref, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/pembelian', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const result = await pool.query('SELECT * FROM pembelian ORDER BY tanggal DESC');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/pembelian', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { supplierId, supplierNama, items, total } = req.body;
    const id = 'pur-' + genId();
    const ref = 'INV-' + Date.now();
    await pool.query(
      `INSERT INTO pembelian (id, no_invoice, tanggal, supplier_id, supplier_nama, items, total, status)
       VALUES ($1,$2,CURRENT_DATE,$3,$4,$5,$6,'diterima')`,
      [id, ref, supplierId || '', supplierNama || '', JSON.stringify(items || []), total || 0]
    );

    // Increment stock for each purchased item
    for (const item of (items || [])) {
      if (item.barangId && item.qty) {
        await pool.query('UPDATE barang SET stok = stok + $1 WHERE id=$2', [item.qty, item.barangId]);
      }
    }

    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Toko',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Restock Inventaris - Invoice ${ref}`, total || 0,
       JSON.stringify([
         { coa: '1.4.01', namaAkun: 'Persediaan Barang Dagangan', debit: total || 0, kredit: 0 },
         { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: 0, kredit: total || 0 }
       ])]
    );

    return res.json({ id, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== VENTURE INVESTMENTS ====================

router.get('/venture', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const investments = await pool.query(`
      SELECT vi.*, pn.nama as perusahaan_nama_ref, pn.sektor_industri as perusahaan_sektor_ref, pp.no_pengajuan as pengajuan_ref, pp.status_pengajuan as pengajuan_status_ref
      FROM venture_investments vi
      LEFT JOIN perusahaan pn ON vi.perusahaan_id_fk = pn.id
      LEFT JOIN pengajuan_pembiayaan pp ON vi.pengajuan_id = pp.id
      ORDER BY vi.tanggal_investasi DESC
    `);
    const dividends = await pool.query('SELECT * FROM venture_dividends ORDER BY tanggal DESC');
    const result = investments.rows.map((inv: any) => ({
      ...inv,
      dividendHistory: dividends.rows.filter((d: any) => d.investment_id === inv.id),
    }));
    return res.json(result);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/venture', async (req: AuthRequest, res: Response) => {
  try {
    const { namaPerusahaan, sektorIndustri, namaFounder, nominalInvestasi, persentaseSaham, estimasiDividen, tanggalInvestasi, tenorTahun, deskripsiBisnis, kontakFounder, prospektusUrl, pengajuAnggotaId, pengajuAnggotaNama, pengajuanId, perusahaanIdFk } = req.body;
    const id = 'vi' + genId();
    const result = await pool.query(
      `INSERT INTO venture_investments (id, nama_perusahaan, sektor_industri, nama_founder, nominal_investasi, persentase_saham, estimasi_dividen, tanggal_investasi, tenor_tahun, status, deskripsi_bisnis, kontak_founder, prospektus_url, pengaju_anggota_id, pengaju_anggota_nama, pengajuan_id, perusahaan_id_fk)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pengajuan',$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [id, namaPerusahaan, sektorIndustri, namaFounder, nominalInvestasi, persentaseSaham, estimasiDividen, tanggalInvestasi, tenorTahun, deskripsiBisnis, kontakFounder, prospektusUrl || '', pengajuAnggotaId || null, pengajuAnggotaNama || '', pengajuanId || null, perusahaanIdFk || null]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/venture/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { namaPerusahaan, sektorIndustri, namaFounder, nominalInvestasi, persentaseSaham, estimasiDividen, tanggalInvestasi, tenorTahun, deskripsiBisnis, kontakFounder, prospektusUrl } = req.body;
    await pool.query(
      `UPDATE venture_investments SET nama_perusahaan=$1, sektor_industri=$2, nama_founder=$3, nominal_investasi=$4, persentase_saham=$5, estimasi_dividen=$6, tanggal_investasi=$7, tenor_tahun=$8, deskripsi_bisnis=$9, kontak_founder=$10, prospektus_url=$11 WHERE id=$12`,
      [namaPerusahaan, sektorIndustri, namaFounder, nominalInvestasi, persentaseSaham, estimasiDividen, tanggalInvestasi, tenorTahun, deskripsiBisnis, kontakFounder, prospektusUrl || '', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/venture/:id/status', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const old = await pool.query('SELECT * FROM venture_investments WHERE id=$1', [req.params.id]);
    if (old.rows.length === 0) return res.status(404).json({ error: 'Investasi tidak ditemukan' });
    const inv = old.rows[0];
    const oldStatus = inv.status;

    await pool.query('UPDATE venture_investments SET status=$1 WHERE id=$2', [status, req.params.id]);

    // Journal: Pencairan investasi (debit investasi aset, credit bank)
    if (status === 'dicairkan' && oldStatus !== 'dicairkan') {
      await pool.query(
        `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
         VALUES ($1,$2,CURRENT_DATE,$3,'Ventura',$4,$4,$5)`,
        ['j' + genId(), 'JR-' + Date.now(), `Pencairan Investasi Ventura: ${inv.nama_perusahaan}`, inv.nominal_investasi,
         JSON.stringify([
           { coa: '1.6.04', namaAkun: 'Penyertaan Modal Ventura', debit: inv.nominal_investasi, kredit: 0 },
           { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: 0, kredit: inv.nominal_investasi }
         ])]
      );
    }

    // Journal: Pengembalian investasi (selesai — reverse entry)
    if (status === 'selesai' && oldStatus === 'dicairkan') {
      await pool.query(
        `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
         VALUES ($1,$2,CURRENT_DATE,$3,'Ventura',$4,$4,$5)`,
        ['j' + genId(), 'JR-' + Date.now(), `Pengembalian Investasi Ventura: ${inv.nama_perusahaan}`, inv.nominal_investasi,
         JSON.stringify([
           { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: inv.nominal_investasi, kredit: 0 },
           { coa: '1.6.04', namaAkun: 'Penyertaan Modal Ventura', debit: 0, kredit: inv.nominal_investasi }
         ])]
      );
    }

    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/venture/:id/dividen', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { tanggal, nominalDividen, keterangan } = req.body;
    const id = 'bh' + genId();
    const tgl = tanggal || new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO venture_dividends (id, investment_id, tanggal, nominal_dividen, keterangan)
       VALUES ($1,$2,$3,$4,$5)`,
      [id, req.params.id, tgl, nominalDividen, keterangan || '']
    );
    // Journal: Kas masuk (debit) & Pendapatan Dividen (kredit)
    const inv = await pool.query('SELECT nama_perusahaan FROM venture_investments WHERE id=$1', [req.params.id]);
    const namaPerusahaan = inv.rows[0]?.nama_perusahaan || 'Investee';
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,$3,$4,'Ventura',$5,$5,$6)`,
      ['j' + genId(), 'JR-' + Date.now(), tgl, `Penerimaan Dividen Ventura: ${namaPerusahaan}`, nominalDividen,
       JSON.stringify([
         { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: nominalDividen, kredit: 0 },
         { coa: '4.1.07', namaAkun: 'Pendapatan Dividen Investasi', debit: 0, kredit: nominalDividen }
       ])]
    );
    return res.json({ id, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PIPELINE & KONVERSI ====================

// GET pipeline: gabungan pengajuan + venture dalam satu view
router.get('/venture/pipeline', async (req: AuthRequest, res: Response) => {
  try {
    const pengajuan = await pool.query(`
      SELECT pp.*, pn.nama as perusahaan_nama, pn.sektor_industri as perusahaan_sektor,
        'pengajuan' as tipe_item, pp.skor_akhir as skor, pp.status_kelayakan as kelayakan
      FROM pengajuan_pembiayaan pp
      LEFT JOIN perusahaan pn ON pp.perusahaan_id = pn.id
      ORDER BY pp.created_at DESC
    `);
    const venture = await pool.query(`
      SELECT vi.*, pn.nama as perusahaan_nama, pn.sektor_industri as perusahaan_sektor,
        'venture' as tipe_item, vi.nominal_investasi as pokok_pengajuan
      FROM venture_investments vi
      LEFT JOIN perusahaan pn ON vi.perusahaan_id_fk = pn.id
      ORDER BY vi.tanggal_investasi DESC
    `);
    return res.json({
      pengajuan: pengajuan.rows,
      venture: venture.rows,
      total: pengajuan.rows.length + venture.rows.length
    });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// POST konversi pengajuan → venture investment
router.post('/venture/konversi/:pengajuanId', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { pengajuanId } = req.params;
    const pengajuan = await pool.query('SELECT * FROM pengajuan_pembiayaan WHERE id=$1', [pengajuanId]);
    if (pengajuan.rows.length === 0) return res.status(404).json({ error: 'Pengajuan tidak ditemukan' });
    const pp = pengajuan.rows[0];
    if (pp.status_pengajuan !== 'layak' && pp.status_pengajuan !== 'layak_bersyarat') {
      return res.status(400).json({ error: 'Pengajuan harus berstatus LAYAK atau LAYAK_BERSYARAT untuk dikonversi' });
    }

    // Get perusahaan info
    let namaPerusahaan = 'Perusahaan';
    let sektorIndustri = '';
    let founderName = '-';
    let kontakFounder = '';
    let deskripsiBisnis = pp.tujuan_pembiayaan || '';
    if (pp.perusahaan_id) {
      const pn = await pool.query('SELECT * FROM perusahaan WHERE id=$1', [pp.perusahaan_id]);
      if (pn.rows.length > 0) {
        namaPerusahaan = pn.rows[0].nama;
        sektorIndustri = pn.rows[0].sektor_industri;
        founderName = pn.rows[0].nama_direktur || '-';
        kontakFounder = pn.rows[0].kontak_direktur || '';
      }
    }

    const id = 'vi-' + genId();
    const noJurnal = 'JR-' + Date.now();

    // Create venture investment
    await pool.query(
      `INSERT INTO venture_investments (id, nama_perusahaan, sektor_industri, nama_founder, nominal_investasi, persentase_saham, estimasi_dividen, tanggal_investasi, tenor_tahun, status, deskripsi_bisnis, kontak_founder, pengajuan_id, perusahaan_id_fk)
       VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,$8,'dicairkan',$9,$10,$11,$12)`,
      [id, namaPerusahaan, sektorIndustri, founderName, pp.pokok_pengajuan, 0, pp.bunga_diharapkan || 10, pp.tenor_bulan, deskripsiBisnis, kontakFounder, pp.id, pp.perusahaan_id]
    );

    // Journal: pencairan investasi
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Ventura',$4,$4,$5)`,
      ['j-' + genId(), noJurnal, 'Pencairan Investasi (Konversi Pengajuan): ' + namaPerusahaan, pp.pokok_pengajuan,
       JSON.stringify([
         { coa: '1.6.04', namaAkun: 'Penyertaan Modal Ventura', debit: pp.pokok_pengajuan, kredit: 0 },
         { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: 0, kredit: pp.pokok_pengajuan }
       ])]
    );

    // Update pengajuan status
    await pool.query('UPDATE pengajuan_pembiayaan SET status_pengajuan=$1 WHERE id=$2', ['dicairkan', pp.id]);

    return res.json({
      success: true,
      ventureId: id,
      message: `Pengajuan "${pp.no_pengajuan}" berhasil dikonversi menjadi Investasi Ventura.`
    });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== MY VENTURE DATA (for anggota_perusahaan) ====================
router.get('/my-venture-data', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const memberId = req.user?.memberId;
    // Get anggota record
    const anggota = await pool.query('SELECT * FROM anggota WHERE id=$1', [memberId]);
    if (anggota.rows.length === 0) return res.json({ anggota: null, pengajuan: [], venture: [] });

    // Get pengajuan for this company
    const pengajuan = await pool.query(`
      SELECT pp.*, pn.nama as perusahaan_nama FROM pengajuan_pembiayaan pp
      LEFT JOIN perusahaan pn ON pp.perusahaan_id = pn.id
      WHERE pp.created_by = $1 OR pp.anggota_id = $2 ORDER BY pp.created_at DESC`, [userId, memberId]);

    // Get ventures
    const venture = await pool.query(`
      SELECT vi.*, pn.nama as perusahaan_nama FROM venture_investments vi
      LEFT JOIN perusahaan pn ON vi.perusahaan_id_fk = pn.id
      WHERE vi.pengajuan_id IS NOT NULL ORDER BY vi.tanggal_investasi DESC`);

    return res.json({ anggota: anggota.rows[0], pengajuan: pengajuan.rows, venture: venture.rows });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PERUSAHAAN (Company) MODULE ====================

router.get('/perusahaan', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM perusahaan ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/perusahaan/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM perusahaan WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Perusahaan tidak ditemukan' });
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/perusahaan', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kodePerusahaan, nama, alamat, kota, provinsi, sektorIndustri, tahunBerdiri,
            noAktePendirian, npwp, noIzinUsaha, namaDirektur, kontakDirektur,
            emailPerusahaan, telepon, website, deskripsi, status } = req.body;
    const id = 'p_' + genId();
    const result = await pool.query(
      `INSERT INTO perusahaan (id, kode_perusahaan, nama, alamat, kota, provinsi, sektor_industri, tahun_berdiri, no_akte_pendirian, npwp, no_izin_usaha, nama_direktur, kontak_direktur, email_perusahaan, telepon, website, deskripsi, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [id, kodePerusahaan || '', nama || '', alamat || '', kota || '', provinsi || '',
       sektorIndustri || '', Number(tahunBerdiri) || null, noAktePendirian || '', npwp || '', noIzinUsaha || '',
       namaDirektur || '', kontakDirektur || '', emailPerusahaan || '', telepon || '', website || '', deskripsi || '',
       status || 'pending']
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/perusahaan/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kodePerusahaan, nama, alamat, kota, provinsi, sektorIndustri, tahunBerdiri,
            noAktePendirian, npwp, noIzinUsaha, namaDirektur, kontakDirektur,
            emailPerusahaan, telepon, website, deskripsi, status } = req.body;
    await pool.query(
      `UPDATE perusahaan SET kode_perusahaan=$1, nama=$2, alamat=$3, kota=$4, provinsi=$5, sektor_industri=$6,
       tahun_berdiri=$7, no_akte_pendirian=$8, npwp=$9, no_izin_usaha=$10, nama_direktur=$11, kontak_direktur=$12,
       email_perusahaan=$13, telepon=$14, website=$15, deskripsi=$16, status=$17 WHERE id=$18`,
      [kodePerusahaan || '', nama || '', alamat || '', kota || '', provinsi || '',
       sektorIndustri || '', Number(tahunBerdiri) || null, noAktePendirian || '', npwp || '', noIzinUsaha || '',
       namaDirektur || '', kontakDirektur || '', emailPerusahaan || '', telepon || '', website || '', deskripsi || '',
       status || 'pending', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/perusahaan/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM perusahaan WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== AI CREDIT SCORING (Pengajuan Pembiayaan) ====================

// GET all pengajuan
router.get('/pengajuan', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const result = await pool.query(`
      SELECT pp.*, 
             pn.nama as perusahaan_nama, 
             pn.sektor_industri as sektor_industri,
             pp.pokok_pengajuan as pokok_pinjaman,
             pp.status_pengajuan as status,
             pp.created_at as tanggal_pengajuan,
             a.nama as anggota_nama,
             pp.skor_akhir as skor_akhir
      FROM pengajuan_pembiayaan pp
      LEFT JOIN perusahaan pn ON pp.perusahaan_id = pn.id
      LEFT JOIN anggota a ON pp.anggota_id = a.id
      ORDER BY pp.created_at DESC
    `);
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// GET single pengajuan with dokumen + hasil skoring
router.get('/pengajuan/:id', async (req: AuthRequest, res: Response) => {
  try {
    const pengajuan = await pool.query(`
      SELECT pp.*, 
             pn.nama as perusahaan_nama, 
             pn.sektor_industri as sektor_industri,
             pp.pokok_pengajuan as pokok_pinjaman,
             pp.status_pengajuan as status,
             pp.created_at as tanggal_pengajuan,
             pp.tujuan_pembiayaan as tujuan,
             pp.bunga_diharapkan as bunga_persen,
             a.nama as anggota_nama,
             pp.skor_akhir as skor_akhir
      FROM pengajuan_pembiayaan pp
      LEFT JOIN perusahaan pn ON pp.perusahaan_id = pn.id
      LEFT JOIN anggota a ON pp.anggota_id = a.id
      WHERE pp.id = $1
    `, [req.params.id]);
    if (pengajuan.rows.length === 0) return res.status(404).json({ error: 'Pengajuan tidak ditemukan' });

    const dokumen = await pool.query('SELECT * FROM dokumen_pengajuan WHERE pengajuan_id = $1 ORDER BY kelompok, kode_dokumen', [req.params.id]);
    const skoring = await pool.query('SELECT * FROM hasil_skoring WHERE pengajuan_id = $1', [req.params.id]);

    return res.json({
      ...pengajuan.rows[0],
      dokumen: dokumen.rows,
      hasilAnalisis: skoring.rows[0] || null
    });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// POST create new pengajuan
router.post('/pengajuan', async (req: AuthRequest, res: Response) => {
  try {
    const { perusahaanId, anggotaId, pokokPengajuan, tenorBulan, tujuanPembiayaan, bungaDiharapkan, jenisPembiayaan } = req.body;
    const id = 'pp-' + genId();
    const noPengajuan = 'PJV-' + new Date().toISOString().slice(2,10).replace(/-/g,'') + '-' + Math.floor(100 + Math.random() * 900);
    const result = await pool.query(
      `INSERT INTO pengajuan_pembiayaan (id, perusahaan_id, anggota_id, no_pengajuan, jenis_pembiayaan, pokok_pengajuan, tenor_bulan, tujuan_pembiayaan, bunga_diharapkan, status_pengajuan, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft',$10) RETURNING *`,
      [id, perusahaanId || null, anggotaId || null, noPengajuan, jenisPembiayaan || 'modal_ventura',
       pokokPengajuan, tenorBulan, tujuanPembiayaan || '', bungaDiharapkan || 0, req.user?.id || null]
    );

    // Copy document templates to this pengajuan
    const templates = await pool.query("SELECT * FROM dokumen_pengajuan WHERE pengajuan_id = '' OR pengajuan_id IS NULL");
    for (const tpl of templates.rows) {
      const docId = 'doc-' + genId();
      await pool.query(
        `INSERT INTO dokumen_pengajuan (id, pengajuan_id, kelompok, kode_dokumen, nama_dokumen, deskripsi, dasar_hukum, status_upload)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'belum')`,
        [docId, id, tpl.kelompok, tpl.kode_dokumen, tpl.nama_dokumen, tpl.deskripsi, tpl.dasar_hukum]
      );
    }

    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// PUT update pengajuan status
router.put('/pengajuan/:id/status', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft','dokumen_lengkap','proses_analisis','selesai_skoring','layak','layak_bersyarat','tidak_layak','akad','dicairkan','ditolak'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Status tidak valid' });
    await pool.query('UPDATE pengajuan_pembiayaan SET status_pengajuan=$1 WHERE id=$2', [status, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// POST upload dokumen (simulasi)
router.post('/pengajuan/:id/dokumen', async (req: AuthRequest, res: Response) => {
  try {
    const { dokumenId, fileName, fileType } = req.body;
    await pool.query(
      `UPDATE dokumen_pengajuan SET status_upload='terupload', file_path=$1, file_type=$2, tanggal_upload=NOW() WHERE id=$3 AND pengajuan_id=$4`,
      [fileName || '/uploads/mock.pdf', fileType || 'application/pdf', dokumenId, req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// PUT validasi dokumen (terima/tolak by admin)
router.put('/pengajuan/:id/dokumen/:dokumenId/validasi', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // 'valid' or 'invalid'
    await pool.query(
      `UPDATE dokumen_pengajuan SET status_upload=$1, ai_validasi=$2 WHERE id=$3 AND pengajuan_id=$4`,
      [status, status === 'valid' ? 'Diverifikasi admin' : 'Dokumen ditolak admin', req.params.dokumenId, req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// POST run AI analysis + credit scoring
router.post('/pengajuan/:id/analisis-ai', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const pengajuan = await pool.query('SELECT * FROM pengajuan_pembiayaan WHERE id=$1', [req.params.id]);
    if (pengajuan.rows.length === 0) return res.status(404).json({ error: 'Pengajuan tidak ditemukan' });
    const pp = pengajuan.rows[0];

    const dokumen = await pool.query('SELECT * FROM dokumen_pengajuan WHERE pengajuan_id=$1', [req.params.id]);
    const perusahaan = await pool.query('SELECT * FROM perusahaan WHERE id=$1', [pp.perusahaan_id || '']);

    // Step 1: Count uploaded documents
    const uploadedCount = dokumen.rows.filter((d: any) => d.status_upload === 'terupload' || d.status_upload === 'valid').length;
    const totalDocs = dokumen.rows.length;
    const completenessPct = totalDocs > 0 ? (uploadedCount / totalDocs) * 100 : 0;

    // Step 2: Compute credit scoring algorithm (simulated AI)
    const seed = parseInt(pp.id.slice(-6), 36) % 100;

    // 5C Scoring
    const skorCharacter = Math.min(20, Math.round(10 + (seed % 11)));
    const skorCapacity = Math.min(25, Math.round(12 + ((seed * 3) % 14)));
    const skorCapital = Math.min(20, Math.round(8 + ((seed * 2) % 13)));
    const skorCollateral = Math.min(20, Math.round(10 + ((uploadedCount % 5) * 2)));
    const skorCondition = Math.min(15, Math.round(7 + ((seed * 5) % 9)));
    const totalSkor = Math.round((skorCharacter + skorCapacity + skorCapital + skorCollateral + skorCondition) / 100 * 100);

    // Financial ratios (simulated)
    const rasioLikuiditas = 80 + (seed % 60);
    const rasioSolvabilitas = 120 + (seed % 200);
    const rasioProfitabilitas = 1 + ((seed & 7) / 4);
    const rasioBopo = 70 + (seed % 20);

    // BMPK check (simulated: modal koperasi ~ 5M)
    const modalKoperasi = 5000000000;
    const bmpkPersen = (pp.pokok_pengajuan / modalKoperasi) * 100;
    const bmpkStatus = bmpkPersen <= 10 ? 'AMAN' : bmpkPersen <= 20 ? 'MENDEKAT' : 'MELAMPAUI';

    // Collateral coverage (simulated)
    const collateralCoverage = 80 + (uploadedCount * 8);

    // Determine status
    let statusKelayakan = 'TIDAK_LAYAK';
    let rekomendasi = '';
    if (totalSkor >= 80) {
      statusKelayakan = 'LAYAK';
      rekomendasi = 'Pengajuan layak disetujui. Disarankan plafon sesuai pengajuan.';
    } else if (totalSkor >= 55) {
      statusKelayakan = 'LAYAK_DENGAN_SYARAT';
      rekomendasi = 'Disetujui dengan syarat tambahan agunan dan monitoring berkala.';
    } else {
      statusKelayakan = 'TIDAK_LAYAK';
      rekomendasi = 'Pengajuan belum layak. Disarankan perbaikan rasio keuangan dan kelengkapan dokumen.';
    }

    // Recommendations
    const rekomendasiPlafon = Math.round(pp.pokok_pengajuan * (totalSkor / 100));
    const rekomendasiTenor = Math.max(12, Math.min(60, pp.tenor_bulan));
    const rekomendasiBunga = Math.max(8, Math.min(20, 15 - Math.round(totalSkor / 20)));

    // AI analysis JSON
    const aiAnalisis = {
      completeness: { uploaded: uploadedCount, total: totalDocs, percentage: completenessPct },
      statusCompleteness: completenessPct >= 80 ? 'LENGKAP' : completenessPct >= 50 ? 'CUKUP' : 'KURANG',
      keuangan: { rasioLikuiditas, rasioSolvabilitas, rasioProfitabilitas, rasioBopo },
      bmpk: { persen: bmpkPersen, status: bmpkStatus, modalKoperasi },
      peringatan: completenessPct < 80 ? ['Dokumen belum lengkap, mohon lengkapi sebelum pencairan'] : []
    };

    // Save hasil skoring
    const skoringId = 'hs-' + genId();
    await pool.query(
      `INSERT INTO hasil_skoring (id, pengajuan_id, skor_keseluruhan, status_kelayakan, skor_character, skor_capacity, skor_capital, skor_collateral, skor_condition, rasio_likuiditas, rasio_solvabilitas, rasio_profitabilitas, rasio_bopo, bmpk_persen, bmpk_status, collateral_coverage, rekomendasi_plafon, rekomendasi_tenor, rekomendasi_bunga, syarat_khusus, ai_analisis_json)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [skoringId, pp.id, totalSkor, statusKelayakan, skorCharacter, skorCapacity, skorCapital, skorCollateral, skorCondition,
       rasioLikuiditas, rasioSolvabilitas, rasioProfitabilitas, rasioBopo, bmpkPersen, bmpkStatus, collateralCoverage,
       rekomendasiPlafon, rekomendasiTenor, rekomendasiBunga, rekomendasi || '', JSON.stringify(aiAnalisis)]
    );

    // Update pengajuan
    await pool.query(
      'UPDATE pengajuan_pembiayaan SET status_pengajuan=$1, skor_akhir=$2, status_kelayakan=$3, rekomendasi=$4 WHERE id=$5',
      ['selesai_skoring', totalSkor, statusKelayakan, rekomendasi, pp.id]
    );

    return res.json({
      id: skoringId,
      skorKeseluruhan: totalSkor,
      statusKelayakan,
      detail5c: { character: skorCharacter, capacity: skorCapacity, capital: skorCapital, collateral: skorCollateral, condition: skorCondition },
      rekomendasiPlafon,
      rekomendasiTenor,
      rekomendasiBunga,
      rasio: { likuiditas: rasioLikuiditas, solvabilitas: rasioSolvabilitas, profitabilitas: rasioProfitabilitas, bopo: rasioBopo },
      bmpk: { persen: bmpkPersen, status: bmpkStatus },
      collateralCoverage,
      analisis: aiAnalisis
    });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// GET dokumen templates (for reference)
router.get('/dokumen-templates', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM dokumen_pengajuan WHERE pengajuan_id = '' OR pengajuan_id IS NULL ORDER BY kelompok, kode_dokumen");
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PENGUMUMAN ====================

router.get('/pengumuman', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pengumuman ORDER BY tanggal_mulai DESC');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/pengumuman', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { judul, konten, tipe, target, tanggalMulai, tanggalSelesai } = req.body;
    const id = 'an' + genId();
    const result = await pool.query(
      `INSERT INTO pengumuman (id, judul, konten, tipe, target, tanggal_mulai, tanggal_selesai, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'aktif') RETURNING *`,
      [id, judul, konten || '', tipe || 'pengumuman', target || 'semua', tanggalMulai || null, tanggalSelesai || null]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/pengumuman/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM pengumuman WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/pengumuman/:id/toggle', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE pengumuman SET status = CASE WHEN status='aktif' THEN 'nonaktif' ELSE 'aktif' END WHERE id=$1`,
      [req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== TIKET BANTUAN ====================

router.get('/tiket', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM tiket_bantuan WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM tiket_bantuan ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/tiket', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, subjek, pesan, kategori, prioritas } = req.body;
    const id = 't' + genId();
    const result = await pool.query(
      `INSERT INTO tiket_bantuan (id, anggota_id, subjek, pesan, kategori, prioritas, status)
       VALUES ($1,$2,$3,$4,$5,$6,'Terbuka') RETURNING *`,
      [id, anggotaId, subjek, pesan || '', kategori || 'Lainnya', prioritas || 'Sedang']
    );
    // Get member name
    const member = await pool.query('SELECT nama FROM anggota WHERE id=$1', [anggotaId]);
    if (member.rows.length > 0) {
      await pool.query('UPDATE tiket_bantuan SET anggota_nama=$1 WHERE id=$2', [member.rows[0].nama, id]);
    }
    return res.json({ ...mapRow(result.rows[0]), anggotaNama: member.rows[0]?.nama || '' });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/tiket/:id/reply', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { balasan } = req.body;
    await pool.query(
      `UPDATE tiket_bantuan SET balasan_admin=$1, status='Selesai' WHERE id=$2`,
      [balasan, req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== BUKTI TRANSFER ====================

router.get('/bukti-transfer', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM bukti_transfer WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM bukti_transfer ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/bukti-transfer', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, anggotaNama, jenisSimpananId, jenisNama, jumlah, bankPengirim, noRef, keterangan } = req.body;
    const id = 'bt' + genId();
    const result = await pool.query(
      `INSERT INTO bukti_transfer (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, jumlah, bank_pengirim, no_ref, keterangan, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending') RETURNING *`,
      [id, anggotaId, anggotaNama, jenisSimpananId, jenisNama || '', jumlah, bankPengirim || '', noRef || '', keterangan || '']
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/bukti-transfer/:id/:action', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id, action } = req.params;
    if (action === 'approve') {
      const bt = await pool.query('SELECT * FROM bukti_transfer WHERE id=$1', [id]);
      if (bt.rows.length === 0) return res.status(404).json({ error: 'Bukti transfer tidak ditemukan' });
      const r = bt.rows[0];
      if (r.status === 'disetujui') return res.json({ success: true, message: 'Sudah disetujui sebelumnya' });

      await pool.query(`UPDATE bukti_transfer SET status='disetujui' WHERE id=$1`, [id]);

      // Create savings transaction (setor)
      const transId = 'trans-' + genId();
      await pool.query(
        `INSERT INTO simpanan_transaksi (id, anggota_id, anggota_nama, jenis_simpanan_id, jenis_nama, tanggal, tipe, jumlah, keterangan)
         VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,'setor',$6,$7)`,
        [transId, r.anggota_id, r.anggota_nama, r.jenis_simpanan_id, r.jenis_nama, r.jumlah, `Verifikasi Transfer Setor - Ref ${r.no_ref}`]
      );

      // Update member balance based on savings type
      const balanceField = r.jenis_simpanan_id === 'js1' ? 'saldo_simpanan_pokok' :
                           r.jenis_simpanan_id === 'js2' ? 'saldo_simpanan_wajib' : 'saldo_simpanan_sukarela';
      await pool.query(`UPDATE anggota SET ${balanceField} = ${balanceField} + $1 WHERE id=$2`, [r.jumlah, r.anggota_id]);

      // Journal entry
      await pool.query(
        `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
         VALUES ($1,$2,CURRENT_DATE,$3,'Simpanan',$4,$4,$5)`,
        ['j' + genId(), 'JR-' + Date.now(), `Setor ${r.jenis_nama} (Verifikasi Bukti) - ${r.anggota_nama}`, r.jumlah,
         JSON.stringify([
           { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: r.jumlah, kredit: 0 },
           { coa: '2.1.03', namaAkun: `Simpanan ${r.jenis_nama}`, debit: 0, kredit: r.jumlah }
         ])]
      );
    } else {
      await pool.query(`UPDATE bukti_transfer SET status='ditolak' WHERE id=$1`, [id]);
    }
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== FEATURE TOGGLES ====================

router.get('/feature-toggles', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM feature_toggles WHERE id='main'");
    if (result.rows.length > 0) return res.json(mapRow(result.rows[0]));
    return res.json({});
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/feature-toggles', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const toggles = req.body;
    await pool.query(`UPDATE feature_toggles SET
      anggota=$1, simpanan=$2, pinjaman=$3, data_master=$4, laporan=$5,
      portal_anggota=$6, toko=$7, sewa=$8, ppob=$9, digital_payment=$10,
      pembiayaan=$11, pengumuman=$12, ventura=$13 WHERE id='main'`,
      [toggles.anggota, toggles.simpanan, toggles.pinjaman, toggles.dataMaster, toggles.laporan,
       toggles.portalAnggota, toggles.toko, toggles.sewa, toggles.ppob, toggles.digitalPayment,
       toggles.pembiayaan, toggles.pengumuman, toggles.ventura]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== SEWA ====================

router.get('/sewa-assets', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM sewa_assets ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/sewa-assets', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nama, kategori, biayaSewaPerHari, deskripsi } = req.body;
    const id = 'sw' + genId();
    const result = await pool.query(
      `INSERT INTO sewa_assets (id, nama, kategori, biaya_sewa_per_hari, status, deskripsi)
       VALUES ($1,$2,$3,$4,'Tersedia',$5) RETURNING *`,
      [id, nama, kategori || '', biayaSewaPerHari || 0, deskripsi || '']
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/sewa-assets/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nama, kategori, biayaSewaPerHari, status, deskripsi } = req.body;
    await pool.query(
      `UPDATE sewa_assets SET nama=$1, kategori=$2, biaya_sewa_per_hari=$3, status=$4, deskripsi=$5 WHERE id=$6`,
      [nama, kategori, biayaSewaPerHari, status, deskripsi, req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/sewa-assets/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM sewa_assets WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/sewa-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM sewa_transactions WHERE anggota_id=$1 ORDER BY tanggal_mulai DESC' : 'SELECT * FROM sewa_transactions ORDER BY tanggal_mulai DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/sewa-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, anggotaNama, asetId, asetNama, tanggalMulai, tanggalSelesai, jumlahHari, totalBiaya } = req.body;
    const id = 'swt' + genId();
    const result = await pool.query(
      `INSERT INTO sewa_transactions (id, anggota_id, anggota_nama, aset_id, aset_nama, tanggal_mulai, tanggal_selesai, jumlah_hari, total_biaya, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pengajuan') RETURNING *`,
      [id, anggotaId, anggotaNama, asetId, asetNama, tanggalMulai, tanggalSelesai, jumlahHari, totalBiaya]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/sewa-transaksi/:id/:action', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { id, action } = req.params;
    const statusMap: any = { approve: 'disetujui', reject: 'ditolak', start: 'berjalan', finish: 'selesai' };
    const newStatus = statusMap[action];
    if (!newStatus) return res.status(400).json({ error: 'Invalid action' });

    if (action === 'start' || action === 'approve_berjalan') {
      await pool.query(`UPDATE sewa_transactions SET status='berjalan' WHERE id=$1`, [id]);
      const tx = await pool.query('SELECT * FROM sewa_transactions WHERE id=$1', [id]);
      if (tx.rows.length > 0) {
        await pool.query(`UPDATE sewa_assets SET status='Disewa' WHERE id=$1`, [tx.rows[0].aset_id]);
      }
    } else if (action === 'finish') {
      const { denda } = req.body;
      const tx = await pool.query('SELECT * FROM sewa_transactions WHERE id=$1', [id]);
      if (tx.rows.length > 0) {
        await pool.query(`UPDATE sewa_assets SET status='Tersedia' WHERE id=$1`, [tx.rows[0].aset_id]);
        await pool.query(`UPDATE sewa_transactions SET status='selesai', denda=$1 WHERE id=$2`, [denda || 0, id]);
        await pool.query(
          `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
           VALUES ($1,$2,CURRENT_DATE,$3,'Sewa',$4,$4,$5)`,
          ['j' + genId(), 'JR-' + Date.now(), `Pendapatan Sewa: ${tx.rows[0].aset_nama}`, tx.rows[0].total_biaya + (denda || 0),
           JSON.stringify([
           { coa: '1.1.01', namaAkun: 'Kas Kecil', debit: tx.rows[0].total_biaya + (denda || 0), kredit: 0 },
           { coa: '4.1.05', namaAkun: 'Pendapatan Unit Sewa', debit: 0, kredit: tx.rows[0].total_biaya + (denda || 0) }
           ])]
        );
      }
    } else {
      await pool.query(`UPDATE sewa_transactions SET status=$1 WHERE id=$2`, [newStatus, id]);
    }
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== PPOB ====================

router.get('/ppob-layanan', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM ppob_layanan ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/ppob-layanan/:id/toggle', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE ppob_layanan SET status = CASE WHEN status='Aktif' THEN 'Nonaktif' ELSE 'Aktif' END WHERE id=$1`,
      [req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/ppob-layanan/:id/prices', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nominalMin, nominalMax } = req.body;
    await pool.query('UPDATE ppob_layanan SET nominal_min=$1, nominal_max=$2 WHERE id=$3',
      [nominalMin, nominalMax, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/ppob-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM ppob_transactions WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM ppob_transactions ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/ppob-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, anggotaNama, layananId, layananNama, targetNumber, nominal, hargaKoperasi, hargaJual } = req.body;
    const id = 'pptx' + genId();
    const snVal = 'SN-' + Math.floor(100000 + Math.random() * 900000);
    const noRef = 'REF-' + Math.floor(10000000 + Math.random() * 90000000);

    await pool.query(
      `INSERT INTO ppob_transactions (id, anggota_id, anggota_nama, layanan_id, layanan_nama, target_number, nominal, harga_koperasi, harga_jual, status, sn, no_referensi)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'sukses',$10,$11)`,
      [id, anggotaId, anggotaNama, layananId, layananNama, targetNumber, nominal, hargaKoperasi, hargaJual, snVal, noRef]
    );

    // Deduct from member savings
    await pool.query(`UPDATE anggota SET saldo_simpanan_sukarela = GREATEST(0, saldo_simpanan_sukarela - $1) WHERE id=$2`,
      [hargaJual, anggotaId]);

    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'PPOB',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Pembelian PPOB ${layananNama}`, hargaJual,
       JSON.stringify([
         { coa: '2.1.03', namaAkun: 'Simpanan Sukarela Anggota', debit: hargaJual, kredit: 0 },
         { coa: '4.1.06', namaAkun: 'Pendapatan PPOB / Digital', debit: 0, kredit: hargaJual }
       ])]
    );

    return res.json({ id, sn: snVal, noReferensi: noRef, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== VIRTUAL ACCOUNT ====================

router.get('/virtual-accounts', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM virtual_accounts WHERE anggota_id=$1 ORDER BY anggota_nama' : 'SELECT * FROM virtual_accounts ORDER BY anggota_nama',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/virtual-accounts', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, bank } = req.body;
    const am = await pool.query('SELECT * FROM anggota WHERE id=$1', [anggotaId]);
    if (am.rows.length === 0) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    const bankCode = bank === 'Mandiri' ? '8890' : bank === 'BCA' ? '3901' : bank === 'BRI' ? '1280' : '9880';
    const id = 'va-' + genId();
    const result = await pool.query(
      `INSERT INTO virtual_accounts (id, anggota_id, anggota_nama, bank, nomor_va, label, status)
       VALUES ($1,$2,$3,$4,$5,'Setoran Sukarela Tambahan','aktif') RETURNING *`,
      [id, anggotaId, am.rows[0].nama, bank, bankCode + '0812' + Math.floor(100000 + Math.random() * 900000)]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/va-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM va_transactions WHERE anggota_id=$1 ORDER BY tanggal DESC' : 'SELECT * FROM va_transactions ORDER BY tanggal DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/va-transaksi', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, bank, nomorVA, nominal, jenisTrx } = req.body;
    const am = await pool.query('SELECT * FROM anggota WHERE id=$1', [anggotaId]);
    if (am.rows.length === 0) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    const id = 'vatx-' + genId();

    await pool.query(
      `INSERT INTO va_transactions (id, anggota_id, anggota_nama, nomor_va, bank, nominal, jenis_trx, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'sukses')`,
      [id, anggotaId, am.rows[0].nama, nomorVA, bank, nominal, jenisTrx || 'topup_sukarela']
    );

    if (jenisTrx === 'topup_sukarela' || !jenisTrx) {
      await pool.query(`UPDATE anggota SET saldo_simpanan_sukarela = saldo_simpanan_sukarela + $1 WHERE id=$2`,
        [nominal, anggotaId]);
      await pool.query(
        `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
         VALUES ($1,$2,CURRENT_DATE,$3,'Digital Payment',$4,$4,$5)`,
        ['j' + genId(), 'JR-' + Date.now(), `Topup Sukarela via VA ${bank}`, nominal,
         JSON.stringify([
         { coa: '1.1.03', namaAkun: 'Bank Mandiri', debit: nominal, kredit: 0 },
         { coa: '2.1.03', namaAkun: 'Simpanan Sukarela Anggota', debit: 0, kredit: nominal }
         ])]
      );
    }

    return res.json({ id, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== CICILAN BARANG ====================

router.get('/cicilan-barang', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      mid ? 'SELECT * FROM cicilan_barang WHERE anggota_id=$1 ORDER BY tanggal_pengajuan DESC' : 'SELECT * FROM cicilan_barang ORDER BY tanggal_pengajuan DESC',
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/cicilan-barang', async (req: AuthRequest, res: Response) => {
  try {
    const { anggotaId, anggotaNama, barangNama, totalHarga, dp, pokokPembiayaan, tenorMonths, bungaPersen, angsuranPerBulan } = req.body;
    const id = 'kred-' + genId();
    const result = await pool.query(
      `INSERT INTO cicilan_barang (id, anggota_id, anggota_nama, barang_nama, total_harga, dp, pokok_pembiayaan, tenor_months, bunga_persen, angsuran_per_bulan, sisa_pokok, status, tanggal_pengajuan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pengajuan',CURRENT_DATE) RETURNING *`,
      [id, anggotaId, anggotaNama, barangNama, totalHarga, dp, pokokPembiayaan, tenorMonths, bungaPersen, angsuranPerBulan, pokokPembiayaan]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/cicilan-barang/:id/approve', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const c = await pool.query('SELECT * FROM cicilan_barang WHERE id=$1', [req.params.id]);
    if (c.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const contract = c.rows[0];

    const nextStatus = contract.status === 'pengajuan' ? 'disetujui' : 'aktif';
    await pool.query(`UPDATE cicilan_barang SET status=$1, tanggal_mulai=CURRENT_DATE WHERE id=$2`,
      [nextStatus, req.params.id]);

    if (nextStatus === 'aktif') {
      // Generate schedules (sliding balance default)
      const schedule = buildInstallmentSchedule({
        pokok: contract.pokok_pembiayaan,
        tenorMonths: contract.tenor_months,
        bungaPersen: contract.bunga_persen,
        metodeBunga: 'efektif',
        angsuranPerBulan: contract.angsuran_per_bulan,
      });
      for (let i = 0; i < schedule.length; i++) {
        const s = schedule[i];
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i + 1));
        dueDate.setDate(10);
        await pool.query(
          `INSERT INTO cicilan_angsuran (id, cicilan_barang_id, anggota_nama, angsuran_ke, tanggal_jatuh_tempo, pokok_bayar, bunga_bayar, total_bayar, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'belum_bayar')`,
          ['cang-' + genId(), contract.id, contract.anggota_nama, i + 1, dueDate.toISOString().split('T')[0], s.pokokBayar, s.bungaBayar, s.totalBayar]
        );
      }
      // Journal
      await pool.query(
        `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
         VALUES ($1,$2,CURRENT_DATE,$3,'Pembiayaan',$4,$4,$5)`,
        ['j' + genId(), 'JR-' + Date.now(), `Pencairan Kredit Barang: ${contract.barang_nama}`, contract.pokok_pembiayaan,
         JSON.stringify([
           { coa: '1.2.05', namaAkun: 'Piutang Kredit Barang', debit: contract.pokok_pembiayaan, kredit: 0 },
           { coa: '1.1.01', namaAkun: 'Kas Kecil', debit: 0, kredit: contract.pokok_pembiayaan }
         ])]
      );
    }

    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/cicilan-barang/:id/reject', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(`UPDATE cicilan_barang SET status='ditolak' WHERE id=$1`, [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/cicilan-angsuran', async (req: AuthRequest, res: Response) => {
  try {
    const mid = scopeMemberId(req);
    const result = await pool.query(
      `SELECT ca.* FROM cicilan_angsuran ca
       JOIN cicilan_barang cb ON ca.cicilan_barang_id = cb.id
       ${mid ? 'WHERE cb.anggota_id=$1' : ''}
       ORDER BY ca.tanggal_jatuh_tempo`,
      mid ? [mid] : []
    );
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/cicilan-angsuran/:id/pay', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const angs = await pool.query('SELECT * FROM cicilan_angsuran WHERE id=$1', [req.params.id]);
    if (angs.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const a = angs.rows[0];

    await pool.query(`UPDATE cicilan_angsuran SET status='lunas', tanggal_bayar=CURRENT_DATE WHERE id=$1`, [req.params.id]);
    await pool.query(
      `UPDATE cicilan_barang SET sisa_pokok = GREATEST(0, sisa_pokok - $1),
        status = CASE WHEN GREATEST(0, sisa_pokok - $1) <= 0 THEN 'lunas' ELSE status END WHERE id=$2`,
      [a.pokok_bayar, a.cicilan_barang_id]
    );

    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Pembiayaan',$4,$4,$5)`,
      ['j' + genId(), 'JR-' + Date.now(), `Terima Angsuran Kredit Barang #${a.angsuran_ke}`, a.total_bayar,
       JSON.stringify([
         { coa: '1.1.01', namaAkun: 'Kas Kecil', debit: a.total_bayar, kredit: 0 },
         { coa: '1.2.05', namaAkun: 'Piutang Kredit Barang', debit: 0, kredit: a.pokok_bayar },
         { coa: '4.1.08', namaAkun: 'Pendapatan Jasa Cicilan Barang', debit: 0, kredit: a.bunga_bayar }
       ])]
    );

    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== DATA MASTER ====================

router.get('/koperasi-info', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM koperasi_info WHERE id=1');
    return res.json(mapRow(result.rows[0]) || {});
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/pengurus', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pengurus ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/karyawan', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM karyawan ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/aset-barang', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM aset_barang ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/sumber-bayar', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM sumber_bayar ORDER BY nama');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- PENGURUS CRUD ---
router.post('/pengurus', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nik, nama, jabatan, periodeMulai, periodeSelesai, noSk, noHp, status } = req.body;
    const id = 'p' + genId();
    const r = await pool.query(
      `INSERT INTO pengurus (id, nik, nama, jabatan, periode_mulai, periode_selesai, no_sk, no_hp, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, nik || '', nama, jabatan || '', periodeMulai || null, periodeSelesai || null, noSk || '', noHp || '', status || 'aktif']
    );
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/pengurus/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nik, nama, jabatan, periodeMulai, periodeSelesai, noSk, noHp, status } = req.body;
    await pool.query(
      `UPDATE pengurus SET nik=$1, nama=$2, jabatan=$3, periode_mulai=$4, periode_selesai=$5, no_sk=$6, no_hp=$7, status=$8 WHERE id=$9`,
      [nik || '', nama, jabatan || '', periodeMulai || null, periodeSelesai || null, noSk || '', noHp || '', status || 'aktif', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/pengurus/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM pengurus WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- KARYAWAN CRUD ---
router.post('/karyawan', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nik, nama, jabatan, departemen, noHp, gajiPokok, status, statusAktif } = req.body;
    const id = 'k' + genId();
    const r = await pool.query(
      `INSERT INTO karyawan (id, nik, nama, jabatan, departemen, no_hp, gaji_pokok, status, status_aktif)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, nik || '', nama, jabatan || '', departemen || '', noHp || '', gajiPokok || 0, status || 'tetap', statusAktif !== undefined ? statusAktif : true]
    );
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/karyawan/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nik, nama, jabatan, departemen, noHp, gajiPokok, status, statusAktif } = req.body;
    await pool.query(
      `UPDATE karyawan SET nik=$1, nama=$2, jabatan=$3, departemen=$4, no_hp=$5, gaji_pokok=$6, status=$7, status_aktif=$8 WHERE id=$9`,
      [nik || '', nama, jabatan || '', departemen || '', noHp || '', gajiPokok || 0, status || 'tetap', statusAktif !== undefined ? statusAktif : true, req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/karyawan/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM karyawan WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- ASET BARANG CRUD ---
router.post('/aset-barang', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kode, nama, kategori, hargaPerolehan, nilaiResidu, masaManfaat, kondisi, lokasi } = req.body;
    const id = 'as' + genId();
    const kodeGen = kode || ('AST-' + Math.floor(100 + Math.random() * 900));
    const r = await pool.query(
      `INSERT INTO aset_barang (id, kode, nama, kategori, harga_perolehan, nilai_residu, masa_manfaat, kondisi, lokasi)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, kodeGen, nama, kategori || 'Inventaris', hargaPerolehan || 0, nilaiResidu || 0, masaManfaat || 0, kondisi || 'Baik', lokasi || '']
    );
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/aset-barang/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kode, nama, kategori, hargaPerolehan, nilaiResidu, masaManfaat, kondisi, lokasi } = req.body;
    await pool.query(
      `UPDATE aset_barang SET kode=$1, nama=$2, kategori=$3, harga_perolehan=$4, nilai_residu=$5, masa_manfaat=$6, kondisi=$7, lokasi=$8 WHERE id=$9`,
      [kode || '', nama, kategori || 'Inventaris', hargaPerolehan || 0, nilaiResidu || 0, masaManfaat || 0, kondisi || 'Baik', lokasi || '', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/aset-barang/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM aset_barang WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- SUMBER BAYAR CRUD ---
router.post('/sumber-bayar', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nama, tipe, noRekening, akunCoa } = req.body;
    const id = 'sb' + genId();
    const r = await pool.query(
      `INSERT INTO sumber_bayar (id, nama, tipe, no_rekening, akun_coa) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, nama, tipe || 'Tunai', noRekening || '', akunCoa || '']
    );
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/sumber-bayar/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { nama, tipe, noRekening, akunCoa } = req.body;
    await pool.query(
      `UPDATE sumber_bayar SET nama=$1, tipe=$2, no_rekening=$3, akun_coa=$4 WHERE id=$5`,
      [nama, tipe || 'Tunai', noRekening || '', akunCoa || '', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/sumber-bayar/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM sumber_bayar WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== USERS (Admin) ====================

router.get('/users', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT id, username, nama_lengkap, role, nik, member_id, is_active FROM users ORDER BY username');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/users', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { username, namaLengkap, role, nik, memberId, isActive, password } = req.body;
    if (!username || !namaLengkap || !password) {
      return res.status(400).json({ error: 'Username, nama lengkap, dan password wajib diisi' });
    }
    // Check uniqueness
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username sudah terdaftar' });
    }
    const id = 'u_' + genId();
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (id, username, nama_lengkap, role, nik, member_id, is_active, password_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, username, nama_lengkap, role, nik, member_id, is_active`,
      [id, username, namaLengkap, role || 'operator', nik || null, memberId || null, isActive !== undefined ? isActive : true, passwordHash]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/users/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { username, namaLengkap, role, nik, memberId, isActive, password } = req.body;
    // Check uniqueness against other users
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2', [username, req.params.id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username sudah dipakai user lain' });
    }
    if (password && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET username=$1, nama_lengkap=$2, role=$3, nik=$4, member_id=$5, is_active=$6, password_hash=$7 WHERE id=$8',
        [username, namaLengkap, role, nik || null, memberId || null, isActive, passwordHash, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET username=$1, nama_lengkap=$2, role=$3, nik=$4, member_id=$5, is_active=$6 WHERE id=$7',
        [username, namaLengkap, role, nik || null, memberId || null, isActive, req.params.id]
      );
    }
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/users/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    // Prevent deleting yourself
    if (req.user?.id === req.params.id) {
      return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
    }
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== GENERAL LEDGER MODULE ====================

// --- COA (Chart of Accounts) ---
router.get('/coa', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM chart_of_accounts ORDER BY kode_akun');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/coa', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kodeAkun, namaAkun, kategori, subKategori, saldoNormal, level, parentId, isHeader } = req.body;
    const id = 'coa' + genId();
    const result = await pool.query(
      `INSERT INTO chart_of_accounts (id, kode_akun, nama_akun, kategori, sub_kategori, saldo_normal, level, parent_id, is_header)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, kodeAkun, namaAkun, kategori, subKategori || '', saldoNormal, level || 3, parentId || null, isHeader || false]
    );
    return res.json(mapRow(result.rows[0]));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/coa/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { kodeAkun, namaAkun, kategori, subKategori, saldoNormal, isActive, isHeader } = req.body;
    const result = await pool.query(
      `UPDATE chart_of_accounts SET kode_akun=$1, nama_akun=$2, kategori=$3, sub_kategori=$4, saldo_normal=$5, is_active=$6, is_header=$7 WHERE id=$8 RETURNING *`,
      [kodeAkun, namaAkun, kategori, subKategori, saldoNormal, isActive !== undefined ? isActive : true, isHeader || false, req.params.id]
    );
    return res.json(mapRow(result.rows[0]) || { success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.delete('/coa/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('UPDATE chart_of_accounts SET is_active=false WHERE id=$1', [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- ACCOUNTING PERIODS ---
router.get('/periods', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM accounting_periods ORDER BY tahun DESC, bulan DESC');
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/periods/close', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { periodeId } = req.body;
    await pool.query(
      `UPDATE accounting_periods SET is_open=false, is_closed=true, closed_at=NOW(), closed_by=$1 WHERE id=$2`,
      [req.user?.id, periodeId]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/periods/open', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { periodeId } = req.body;
    await pool.query('UPDATE accounting_periods SET is_open=true, is_closed=false WHERE id=$1', [periodeId]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- MANUAL JOURNAL ---
router.get('/jurnal/manual', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const { startDate, endDate, sumber } = req.query;
    let query = 'SELECT je.*, ja.status as approval_status, ja.created_by, ja.approved_by, ja.approved_at FROM journal_entries je LEFT JOIN journal_approvals ja ON je.id = ja.jurnal_id WHERE 1=1';
    const params: any[] = [];
    let paramIdx = 1;
    if (startDate) { query += ` AND je.tanggal >= $${paramIdx++}`; params.push(startDate); }
    if (endDate) { query += ` AND je.tanggal <= $${paramIdx++}`; params.push(endDate); }
    if (sumber) { query += ` AND je.sumber = $${paramIdx++}`; params.push(sumber); }
    query += ' ORDER BY je.tanggal DESC, je.id DESC';
    const result = await pool.query(query, params);
    return res.json(mapRows(result.rows));
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/jurnal/manual', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { tanggal, keterangan, details } = req.body;
    if (!tanggal || !keterangan || !details || details.length < 2) {
      return res.status(400).json({ error: 'Jurnal minimal 2 baris (debit & kredit)' });
    }
    // Check balance
    const totalDebit = details.reduce((s: number, d: any) => s + (d.debit || 0), 0);
    const totalKredit = details.reduce((s: number, d: any) => s + (d.kredit || 0), 0);
    if (Math.abs(totalDebit - totalKredit) > 100) {
      return res.status(400).json({ error: `Total debit (${totalDebit}) ≠ total kredit (${totalKredit})` });
    }
    const id = 'j-' + genId();
    const noJurnal = 'JR-' + tanggal.replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const maxVal = Math.max(totalDebit, totalKredit);
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,$3,$4,'Manual',$5,$5,$6)`,
      [id, noJurnal, tanggal, keterangan, maxVal, JSON.stringify(details)]
    );
    // Create approval record
    await pool.query(
      `INSERT INTO journal_approvals (id, jurnal_id, status, created_by) VALUES ($1,$2,'posted',$3)`,
      ['ja-' + genId(), id, req.user?.id]
    );
    return res.json({ id, noJurnal: noJurnal, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.put('/jurnal/:id/approve', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { notes } = req.body;
    await pool.query(
      `UPDATE journal_approvals SET status='approved', approved_by=$1, approved_at=NOW(), notes=$2 WHERE jurnal_id=$3`,
      [req.user?.id, notes || '', req.params.id]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.post('/jurnal/:id/reverse', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const original = await pool.query('SELECT * FROM journal_entries WHERE id=$1', [req.params.id]);
    if (original.rows.length === 0) return res.status(404).json({ error: 'Jurnal tidak ditemukan' });
    const j = original.rows[0];
    const reversedDetails = j.details.map((d: any) => ({ ...d, debit: d.kredit, kredit: d.debit }));
    const maxRev = Math.max(
      reversedDetails.reduce((s: number, d: any) => s + (d.debit || 0), 0),
      reversedDetails.reduce((s: number, d: any) => s + (d.kredit || 0), 0)
    );
    const newId = 'j-' + genId();
    const noJurnal = 'REV-' + j.no_jurnal;
    await pool.query(
      `INSERT INTO journal_entries (id, no_jurnal, tanggal, keterangan, sumber, debit, kredit, details)
       VALUES ($1,$2,CURRENT_DATE,$3,'Reversing',$4,$4,$5)`,
      [newId, noJurnal, 'Reversal: ' + j.keterangan, maxRev, JSON.stringify(reversedDetails)]
    );
    await pool.query(`UPDATE journal_approvals SET status='reversed', reversed_by=$1, reversed_at=NOW() WHERE jurnal_id=$2`,
      [req.user?.id, req.params.id]);
    return res.json({ id: newId, noJurnal: noJurnal, success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- BUKU BESAR ---
router.get('/bukubesar/:coaId', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const { startDate, endDate } = req.query;
    const { coaId } = req.params;
    // Get COA info
    const coa = await pool.query('SELECT * FROM chart_of_accounts WHERE id=$1', [coaId]);
    if (coa.rows.length === 0) return res.status(404).json({ error: 'Akun tidak ditemukan' });
    const account = coa.rows[0];
    // Get all journal entries involving this COA code
    const code = account.kode_akun;
    let query = `SELECT je.id, je.no_jurnal, je.tanggal, je.keterangan, je.details FROM journal_entries je WHERE je.details @> '[{"coa":"${code}"}]'::jsonb`;
    const params: any[] = [];
    let paramIdx = 1;
    if (startDate) { query += ` AND je.tanggal >= $${paramIdx++}`; params.push(startDate); }
    if (endDate) { query += ` AND je.tanggal <= $${paramIdx++}`; params.push(endDate); }
    query += ' ORDER BY je.tanggal ASC, je.id ASC';
    const entries = await pool.query(query, params);
    // Compute running balance
    let saldoAwal = 0;
    const lines = entries.rows.map((e: any) => {
      const line = (e.details || []).find((d: any) => d.coa === code);
      const debit = line?.debit || 0;
      const kredit = line?.kredit || 0;
      if (account.saldo_normal === 'debit') {
        saldoAwal = saldoAwal + debit - kredit;
      } else {
        saldoAwal = saldoAwal + kredit - debit;
      }
      return {
        id: e.id, noJurnal: e.no_jurnal, tanggal: e.tanggal,
        keterangan: e.keterangan, debit, kredit, saldo: saldoAwal
      };
    });
    return res.json({ account, lines, saldoAkhir: saldoAwal });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- NERACA SALDO (Trial Balance) ---
router.get('/neracasaldo', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const coas = await pool.query("SELECT * FROM chart_of_accounts WHERE is_header=false AND is_active=true ORDER BY kode_akun");
    const result = [];
    for (const coa of coas.rows) {
      const entries = await pool.query(
        `SELECT details FROM journal_entries WHERE details @> '[{"coa":"${coa.kode_akun}"}]'::jsonb`
      );
      let totalDebit = 0, totalKredit = 0;
      for (const e of entries.rows) {
        for (const d of (e.details || [])) {
          if (d.coa === coa.kode_akun) {
            totalDebit += d.debit || 0;
            totalKredit += d.kredit || 0;
          }
        }
      }
      const saldoDebit = coa.saldo_normal === 'debit'
        ? Math.max(0, totalDebit - totalKredit) : Math.max(0, totalKredit - totalDebit);
      const saldoKredit = coa.saldo_normal === 'kredit'
        ? Math.max(0, totalKredit - totalDebit) : Math.max(0, totalDebit - totalKredit);
      if (totalDebit > 0 || totalKredit > 0) {
        result.push({
          kodeAkun: coa.kode_akun, namaAkun: coa.nama_akun,
          kategori: coa.kategori, saldoNormal: coa.saldo_normal,
          debit: saldoDebit, kredit: saldoKredit
        });
      }
    }
    return res.json(result);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- SUB LEDGER PIUTANG ---
router.get('/subledger/piutang', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    // Aggregate from loans data
    const loans = await pool.query(`
      SELECT p.id, a.id as anggota_id, a.nama as anggota_nama, p.no_pinjaman,
        p.pokok, p.sisa_pokok, p.status, p.tanggal_pengajuan, p.tanggal_cair
      FROM pinjaman p JOIN anggota a ON p.anggota_id = a.id
      WHERE p.status IN ('dicairkan','lunas') ORDER BY a.nama
    `);
    const result = loans.rows.map((l: any) => {
      const today = new Date();
      const cairDate = l.tanggal_cair ? new Date(l.tanggal_cair) : null;
      const tunggakanHari = cairDate ? Math.floor((today.getTime() - cairDate.getTime()) / (86400000)) - 30 : 0;
      const kolektibilitas = l.sisa_pokok <= 0 ? 'Lancar' :
        tunggakanHari <= 30 ? 'Lancar' :
        tunggakanHari <= 60 ? 'Kurang Lancar' :
        tunggakanHari <= 90 ? 'Diragukan' : 'Macet';
      return {
        anggotaId: l.anggota_id, anggotaNama: l.anggota_nama,
        noPinjaman: l.no_pinjaman, pokokPiutang: l.pokok,
        sisaPokok: l.sisa_pokok, tunggakanHari: Math.max(0, tunggakanHari),
        kolektibilitas, status: l.status
      };
    });
    return res.json(result);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- LAPORAN KEUANGAN REAL ---
router.get('/laporan/labarugi', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const { startDate, endDate } = req.query;
    const pendapatan = await pool.query(
      `SELECT COALESCE(SUM(d.kredit::numeric - d.debit::numeric), 0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, nama_akun text, debit numeric, kredit numeric) WHERE d.coa LIKE '4.%' AND ($1::date IS NULL OR je.tanggal >= $1) AND ($2::date IS NULL OR je.tanggal <= $2)`,
      [startDate || null, endDate || null]
    );
    const beban = await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric), 0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, nama_akun text, debit numeric, kredit numeric) WHERE d.coa LIKE '5.%' AND ($1::date IS NULL OR je.tanggal >= $1) AND ($2::date IS NULL OR je.tanggal <= $2)`,
      [startDate || null, endDate || null]
    );
    const totalPendapatan = parseFloat(pendapatan.rows[0].total) || 0;
    const totalBeban = parseFloat(beban.rows[0].total) || 0;
    const labaBersih = totalPendapatan - totalBeban;
    return res.json({ totalPendapatan, totalBeban, labaBersih, isProfit: labaBersih >= 0 });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/laporan/neraca', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    // Aset: normal debit balance = SUM(debit) - SUM(kredit)
    const aset = await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric), 0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, nama_akun text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun = d.coa WHERE ca.kategori = 'ASET'`
    );
    const kewajiban = await pool.query(
      `SELECT COALESCE(SUM(d.kredit::numeric - d.debit::numeric), 0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, nama_akun text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun = d.coa WHERE ca.kategori = 'KEWAJIBAN'`
    );
    const ekuitas = await pool.query(
      `SELECT COALESCE(SUM(d.kredit::numeric - d.debit::numeric), 0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, nama_akun text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun = d.coa WHERE ca.kategori = 'EKUITAS'`
    );
    // Laba berjalan (pendapatan - beban) masuk ke ekuitas
    const labaRugi = await pool.query(
      `SELECT
        COALESCE((SELECT SUM(d.kredit::numeric - d.debit::numeric) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) WHERE d.coa LIKE '4.%'), 0) -
        COALESCE((SELECT SUM(d.debit::numeric - d.kredit::numeric) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) WHERE d.coa LIKE '5.%'), 0) as laba`
    );
    const totalAset = parseFloat(aset.rows[0].total) || 0;
    const totalKewajiban = parseFloat(kewajiban.rows[0].total) || 0;
    const totalEkuitasAkun = parseFloat(ekuitas.rows[0].total) || 0;
    const laba = parseFloat(labaRugi.rows[0].laba) || 0;
    const totalEkuitas = totalEkuitasAkun + laba;
    const totalPasiva = totalKewajiban + totalEkuitas;
    const balanced = Math.abs(totalAset - totalPasiva) < 1000;
    return res.json({ totalAset, totalKewajiban, totalEkuitas, totalPasiva, balanced });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/laporan/pde', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE p.status = 'dicairkan') as total_debitur,
        COALESCE(SUM(p.sisa_pokok) FILTER (WHERE p.status = 'dicairkan'), 0) as total_piutang,
        COALESCE(SUM(p.sisa_pokok) FILTER (WHERE p.status = 'dicairkan' AND p.sisa_pokok > 0 AND p.sisa_pokok <= p.pokok * 0.95), 0) as lancar,
        COALESCE(SUM(p.sisa_pokok) FILTER (WHERE p.status = 'dicairkan' AND p.sisa_pokok > p.pokok * 0.95), 0) as macet
      FROM pinjaman p
    `);
    const d = mapRow(result.rows[0]);
    const npl = d.total_piutang > 0 ? (parseFloat(d.macet) / parseFloat(d.total_piutang) * 100).toFixed(2) : '0';
    return res.json({
      totalDebitur: parseInt(d.total_debitur), totalPiutang: parseFloat(d.total_piutang),
      lancar: parseFloat(d.lancar), macet: parseFloat(d.macet), npl: npl + '%'
    });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

router.get('/laporan/rasio', async (req: AuthRequest, res: Response) => {
  try {
    if (!requireStaff(req, res)) return;
    const { endDate } = req.query;
    const tglFilter = endDate && String(endDate).trim() ? `AND je.tanggal <= '${String(endDate).trim()}'` : '';

    // Total Aset (1.x + 2.x aset tetap lancar + tetap)
    const aset = await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) as total
       FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric)
       JOIN chart_of_accounts ca ON ca.kode_akun = d.coa
       WHERE ca.kategori = 'ASET' AND ca.is_header = false ${tglFilter}`
    );
    const totalAset = parseFloat(aset.rows[0]?.total) || 0;

    // Total Kewajiban (2.x)
    const kewajiban = await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) as total
       FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric)
       JOIN chart_of_accounts ca ON ca.kode_akun = d.coa
       WHERE ca.kategori = 'KEWAJIBAN' AND ca.is_header = false ${tglFilter}`
    );
    const totalKewajiban = parseFloat(kewajiban.rows[0]?.total) || 0;

    // Total Ekuitas (3.x)
    const ekuitas = await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) as total
       FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric)
       JOIN chart_of_accounts ca ON ca.kode_akun = d.coa
       WHERE ca.kategori = 'EKUITAS' AND ca.is_header = false ${tglFilter}`
    );
    const totalEkuitas = parseFloat(ekuitas.rows[0]?.total) || 0;

    // Laba bersih = Pendapatan (4.x) - Beban (5.x)
    const laba = await pool.query(
      `SELECT
        (SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun=d.coa WHERE ca.kategori='PENDAPATAN' AND ca.is_header=false ${tglFilter}) -
        (SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun=d.coa WHERE ca.kategori='BEBAN' AND ca.is_header=false ${tglFilter}) as laba_bersih`
    );
    const labaBersih = parseFloat(laba.rows[0]?.laba_bersih) || 0;
    const totalPendapatan = parseFloat((await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun=d.coa WHERE ca.kategori='PENDAPATAN' AND ca.is_header=false ${tglFilter}`
    )).rows[0]?.total) || 0;
    const totalBeban = parseFloat((await pool.query(
      `SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric),0) as total FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) JOIN chart_of_accounts ca ON ca.kode_akun=d.coa WHERE ca.kategori='BEBAN' AND ca.is_header=false ${tglFilter}`
    )).rows[0]?.total) || 0;

    // Piutang macet proxy (pinjaman dengan sisa_pokok > 95% dari pokok = baru cair/belum bayar)
    const pde = await pool.query(
      `SELECT
        COALESCE(SUM(sisa_pokok) FILTER (WHERE status='dicairkan'),0) as total_piutang,
        COALESCE(SUM(sisa_pokok) FILTER (WHERE status='dicairkan' AND sisa_pokok > pokok * 0.95),0) as piutang_macet
       FROM pinjaman`
    );
    const totalPiutang = parseFloat(pde.rows[0]?.total_piutang) || 0;
    const piutangMacet = parseFloat(pde.rows[0]?.piutang_macet) || 0;

    // Hitung rasio
    const car = totalAset > 0 ? parseFloat(((totalEkuitas + labaBersih) / totalAset * 100).toFixed(2)) : 0;
    const npl = totalPiutang > 0 ? parseFloat((piutangMacet / totalPiutang * 100).toFixed(2)) : 0;
    const roa = totalAset > 0 ? parseFloat((labaBersih / totalAset * 100).toFixed(2)) : 0;
    const roe = totalEkuitas > 0 ? parseFloat((labaBersih / totalEkuitas * 100).toFixed(2)) : 0;
    const bopo = totalPendapatan > 0 ? parseFloat((totalBeban / totalPendapatan * 100).toFixed(2)) : 0;
    const ldr = totalAset > 0 ? parseFloat((totalPiutang / totalAset * 100).toFixed(2)) : 0;

    return res.json({ car, npl, roa, roe, bopo, ldr });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// --- TUTUP BUKU ---
router.post('/tutupbuku', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { tahun } = req.body;
    // Get laba/rugi
    const labaRugi = await pool.query(
      `SELECT 
        (SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric), 0) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) WHERE d.coa LIKE '4.%' AND EXTRACT(YEAR FROM je.tanggal) = $1) -
        (SELECT COALESCE(SUM(d.debit::numeric - d.kredit::numeric), 0) FROM journal_entries je, LATERAL jsonb_to_recordset(je.details) AS d(coa text, debit numeric, kredit numeric) WHERE d.coa LIKE '5.%' AND EXTRACT(YEAR FROM je.tanggal) = $1) as laba_bersih`,
      [tahun]
    );
    const laba = parseFloat(labaRugi.rows[0].laba_bersih) || 0;
    // Close all periods
    await pool.query('UPDATE accounting_periods SET is_open=false, is_closed=true, closed_at=NOW(), closed_by=$1 WHERE tahun=$2', [req.user?.id, tahun]);
    return res.json({ success: true, labaDitahan: laba, tahun, message: `Tutup buku ${tahun} berhasil. Laba ditahan: Rp ${laba.toLocaleString('id-ID')}` });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// ==================== LANDING PAGE CMS ====================

// LANDING SETTINGS (single row)
router.get('/landing-settings', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM landing_settings WHERE id='landing_main'");
    return res.json(mapRow(result.rows[0]) || {});
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.put('/landing-settings', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { koperasiName, koperasiTagline, primaryColor, secondaryColor, logoUrl, faviconUrl, isPublished } = req.body;
    await pool.query(
      `UPDATE landing_settings SET koperasi_name=$1, koperasi_tagline=$2, primary_color=$3, secondary_color=$4, logo_url=$5, favicon_url=$6, is_published=$7, updated_at=NOW() WHERE id='landing_main'`,
      [koperasiName||'', koperasiTagline||'', primaryColor||'#2563eb', secondaryColor||'#d97706', logoUrl||'', faviconUrl||'', isPublished||false]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING HERO (single row)
router.put('/landing-hero', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { badgeText, headline, subheadline, ctaPrimaryText, ctaPrimaryLink, ctaSecondaryText, ctaSecondaryLink, backgroundType, bgImageUrl, isActive } = req.body;
    await pool.query(
      `UPDATE landing_hero SET badge_text=$1, headline=$2, subheadline=$3, cta_primary_text=$4, cta_primary_link=$5, cta_secondary_text=$6, cta_secondary_link=$7, background_type=$8, bg_image_url=$9, is_active=$10 WHERE id='hero_main'`,
      [badgeText||'', headline||'', subheadline||'', ctaPrimaryText||'', ctaPrimaryLink||'', ctaSecondaryText||'', ctaSecondaryLink||'', backgroundType||'gradient', bgImageUrl||'', isActive!==false]
    );
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING FEATURES (multi-row)
router.get('/landing-features', async (req: AuthRequest, res: Response) => {
  try { const r = await pool.query('SELECT * FROM landing_features ORDER BY sort_order ASC'); return res.json(r.rows); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.post('/landing-features', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { iconName, title, description } = req.body;
    const id = 'lf_' + genId();
    const r = await pool.query('INSERT INTO landing_features (id,icon_name,title,description) VALUES ($1,$2,$3,$4) RETURNING *', [id, iconName||'Star', title, description||'']);
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.put('/landing-features/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { iconName, title, description, sortOrder, isActive } = req.body;
    await pool.query('UPDATE landing_features SET icon_name=$1, title=$2, description=$3, sort_order=$4, is_active=$5 WHERE id=$6',
      [iconName||'Star', title, description||'', sortOrder||0, isActive!==false, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.delete('/landing-features/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try { await pool.query('DELETE FROM landing_features WHERE id=$1', [req.params.id]); return res.json({ success: true }); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING TEAM (multi-row)
router.get('/landing-team', async (req: AuthRequest, res: Response) => {
  try { const r = await pool.query('SELECT * FROM landing_team ORDER BY sort_order ASC'); return res.json(r.rows); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.post('/landing-team', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { name, position, photoUrl } = req.body;
    const id = 'lt_' + genId();
    const r = await pool.query('INSERT INTO landing_team (id,name,position,photo_url) VALUES ($1,$2,$3,$4) RETURNING *', [id, name, position||'', photoUrl||'']);
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.put('/landing-team/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { name, position, photoUrl, sortOrder } = req.body;
    await pool.query('UPDATE landing_team SET name=$1, position=$2, photo_url=$3, sort_order=$4 WHERE id=$5',
      [name, position||'', photoUrl||'', sortOrder||0, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.delete('/landing-team/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try { await pool.query('DELETE FROM landing_team WHERE id=$1', [req.params.id]); return res.json({ success: true }); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING TESTIMONIALS (multi-row)
router.get('/landing-testimonials', async (req: AuthRequest, res: Response) => {
  try { const r = await pool.query('SELECT * FROM landing_testimonials ORDER BY sort_order ASC'); return res.json(r.rows); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.post('/landing-testimonials', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { name, position, content, avatarUrl, rating } = req.body;
    const id = 'lts_' + genId();
    const r = await pool.query('INSERT INTO landing_testimonials (id,name,position,content,avatar_url,rating) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, name, position||'', content||'', avatarUrl||'', rating||5]);
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.put('/landing-testimonials/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { name, position, content, avatarUrl, rating, sortOrder } = req.body;
    await pool.query('UPDATE landing_testimonials SET name=$1, position=$2, content=$3, avatar_url=$4, rating=$5, sort_order=$6 WHERE id=$7',
      [name, position||'', content||'', avatarUrl||'', rating||5, sortOrder||0, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.delete('/landing-testimonials/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try { await pool.query('DELETE FROM landing_testimonials WHERE id=$1', [req.params.id]); return res.json({ success: true }); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING PRICING (multi-row)
router.get('/landing-pricing', async (req: AuthRequest, res: Response) => {
  try { const r = await pool.query('SELECT * FROM landing_pricing ORDER BY sort_order ASC'); return res.json(r.rows); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.post('/landing-pricing', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { planName, priceLabel, priceAmount, description, isPopular, features, ctaText, ctaLink } = req.body;
    const id = 'lp_' + genId();
    const r = await pool.query(
      `INSERT INTO landing_pricing (id,plan_name,price_label,price_amount,description,is_popular,features,cta_text,cta_link)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, planName, priceLabel||'', priceAmount||'0', description||'', isPopular||false, JSON.stringify(features||[]), ctaText||'Pilih', ctaLink||'#']);
    return res.json(r.rows[0]);
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.put('/landing-pricing/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { planName, priceLabel, priceAmount, description, isPopular, features, ctaText, ctaLink, sortOrder } = req.body;
    await pool.query(
      `UPDATE landing_pricing SET plan_name=$1, price_label=$2, price_amount=$3, description=$4, is_popular=$5, features=$6, cta_text=$7, cta_link=$8, sort_order=$9 WHERE id=$10`,
      [planName, priceLabel||'', priceAmount||'0', description||'', isPopular||false, JSON.stringify(features||[]), ctaText||'Pilih', ctaLink||'#', sortOrder||0, req.params.id]);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});
router.delete('/landing-pricing/:id', adminOnly, async (req: AuthRequest, res: Response) => {
  try { await pool.query('DELETE FROM landing_pricing WHERE id=$1', [req.params.id]); return res.json({ success: true }); }
  catch (err: any) { return res.status(500).json({ error: err.message }); }
});

// LANDING CONTACT (single row)
router.put('/landing-contact', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { email, phone, whatsapp, address, officeHours, mapEmbedUrl, footerDescription, socialFacebook, socialTwitter, socialInstagram, socialYoutube } = req.body;
    await pool.query(
      `UPDATE landing_contact SET email=$1, phone=$2, whatsapp=$3, address=$4, office_hours=$5, map_embed_url=$6, footer_description=$7, social_facebook=$8, social_twitter=$9, social_instagram=$10, social_youtube=$11 WHERE id='contact_main'`,
      [email||'', phone||'', whatsapp||'', address||'', officeHours||'', mapEmbedUrl||'', footerDescription||'', socialFacebook||'', socialTwitter||'', socialInstagram||'', socialYoutube||'']);
    return res.json({ success: true });
  } catch (err: any) { return res.status(500).json({ error: err.message }); }
});

export default router;
