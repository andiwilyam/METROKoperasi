import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const RegisterSchema = z.object({
  namaPerusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  email: z.string().email().optional().or(z.literal('')),
  telepon: z.string().optional(),
  sektorIndustri: z.string().optional(),
});

export const SimpananTransaksiSchema = z.object({
  anggotaId: z.string().min(1),
  anggotaNama: z.string().optional(),
  jenisSimpananId: z.string().optional(),
  jenisNama: z.string().optional(),
  tanggal: z.string().optional(),
  tipe: z.enum(['setor', 'tarik']),
  jumlah: z.number().positive(),
  keterangan: z.string().optional(),
});

export const PinjamanSchema = z.object({
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

export const PenjualanSchema = z.object({
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

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type SimpananTransaksiInput = z.infer<typeof SimpananTransaksiSchema>;
export type PinjamanInput = z.infer<typeof PinjamanSchema>;
export type PenjualanInput = z.infer<typeof PenjualanSchema>;
