import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';
import { generateToken } from '../middleware.js';

const router = Router();

// Rate limit: max 10 login attempts per 15 menit per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  // CI/E2E runs the server + all tests from one IP; bypass only when explicitly enabled.
  skip: () => process.env.E2E_LOGIN_UNLIMITED === '1',
});

// Rate limit: max 5 register attempts per jam per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Terlalu banyak percobaan registrasi. Silakan coba lagi dalam 1 jam.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const LoginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

const RegisterSchema = z.object({
  namaPerusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  email: z.string().email().optional().or(z.literal('')),
  telepon: z.string().optional(),
  sektorIndustri: z.string().optional(),
});

router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }
    const { username, password } = parsed.data;

    const result = await pool.query(
      'SELECT id, username, nama_lengkap, role, nik, member_id, is_active, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Kredensial tidak cocok' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(401).json({ error: 'Akun tidak aktif' });
    }

    // Password selalu diverifikasi dengan bcrypt (seed & register menyimpan hash).
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Kredensial tidak cocok' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      memberId: user.member_id || undefined,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        namaLengkap: user.nama_lengkap,
        role: user.role,
        nik: user.nik,
        memberId: user.member_id,
        isActive: user.is_active,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Register new perusahaan member (self-register)
router.post('/register-perusahaan', registerLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Data registrasi tidak valid';
      return res.status(400).json({ error: msg });
    }
    const { namaPerusahaan, username, password, email, telepon, sektorIndustri } = parsed.data;
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username sudah terdaftar' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const memberId = 'ma' + Date.now().toString().slice(-6);
    const userId = 'u_' + Date.now().toString().slice(-6);

    // Create anggota record
    await pool.query(
      `INSERT INTO anggota (id, nik, nama, no_hp, email, alamat, pekerjaan, penghasilan, status_keanggotaan, tanggal_daftar, saldo_simpanan_pokok, saldo_simpanan_wajib, saldo_simpanan_sukarela, tipe_anggota)
       VALUES ($1,$2,$3,$4,$5,'','',0,'aktif',CURRENT_DATE,0,0,0,'perusahaan')`,
      [memberId, username, namaPerusahaan, telepon || '', email || '']
    );

    // Create user
    await pool.query(
      `INSERT INTO users (id, username, nama_lengkap, role, nik, member_id, is_active, password_hash)
       VALUES ($1,$2,$3,'anggota_perusahaan',$4,$5,true,$6)`,
      [userId, username, namaPerusahaan, username, memberId, passwordHash]
    );

    const token = generateToken({ id: userId, username, role: 'anggota_perusahaan', memberId });
    return res.json({
      token,
      user: { id: userId, username, namaLengkap: namaPerusahaan, role: 'anggota_perusahaan', nik: username, memberId, isActive: true }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message || 'Gagal mendaftarkan perusahaan' });
  }
});

// Simple endpoint to hash passwords for seed data (rate limited)
router.post('/hash-password', registerLimiter, async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password || 'admin123', 10);
    return res.json({ hash });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
