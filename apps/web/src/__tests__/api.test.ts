import { describe, it, expect } from 'vitest';
import { buildInstallmentSchedule } from '@/server/lib/finance';
import { toCamelCase } from '../lib/api';

// ==============================
// Helper: jumlah pokok dalam array schedule harus = pokok awal
// ==============================
function expectSumPokokEquals(schedule: { pokokBayar: number }[], expected: number) {
  const sum = schedule.reduce((acc, r) => acc + r.pokokBayar, 0);
  expect(sum).toBe(expected);
}

function expectNoNegative(values: number[]) {
  for (const v of values) expect(v).toBeGreaterThanOrEqual(0);
}

// ==============================
// buildInstallmentSchedule
// ==============================
describe('buildInstallmentSchedule (finance)', () => {
  it('flat: pokok dibagi rata, bunga konstan dari pokok penuh', () => {
    const schedule = buildInstallmentSchedule({
      pokok: 12_000_000,
      tenorMonths: 12,
      bungaPersen: 1,   // 1% per bulan
      metodeBunga: 'flat',
      angsuranPerBulan: 1_120_000,
    });

    // 12 baris
    expect(schedule).toHaveLength(12);

    // Setiap bulan pokok_bayar = 12_000_000 / 12 = 1_000_000
    for (const s of schedule) {
      expect(s.pokokBayar).toBe(1_000_000);
    }

    // Bunga per bulan = 12_000_000 * 1% = 120_000
    for (const s of schedule) {
      expect(s.bungaBayar).toBe(120_000);
    }

    // Total pokok kembali = 12_000_000
    expectSumPokokEquals(schedule, 12_000_000);
    expectNoNegative(schedule.map(s => s.pokokBayar));
    expectNoNegative(schedule.map(s => s.bungaBayar));
  });

  it('efektif: bunga dari sisa saldo, pokok periode awal lebih kecil', () => {
    const schedule = buildInstallmentSchedule({
      pokok: 12_000_000,
      tenorMonths: 3,
      bungaPersen: 2,   // 2% per bulan
      metodeBunga: 'efektif',
      angsuranPerBulan: 4_240_000,
    });

    expect(schedule).toHaveLength(3);

    // Bunga menurun karena sisa pokok menurun
    expect(schedule[0].bungaBayar).toBeGreaterThan(schedule[1].bungaBayar);
    expect(schedule[1].bungaBayar).toBeGreaterThan(schedule[2].bungaBayar);

    // Pokok periode 2 > periode 1 (bunga turun, angsuran tetap)
    expect(schedule[0].pokokBayar).toBeLessThan(schedule[1].pokokBayar);

    // Total pokok kembali = 12_000_000
    expectSumPokokEquals(schedule, 12_000_000);
    expectNoNegative(schedule.map(s => s.pokokBayar));
    expectNoNegative(schedule.map(s => s.bungaBayar));
  });

  it('anuitas: sama dengan efektif (bunga sliding)', () => {
    const schedule = buildInstallmentSchedule({
      pokok: 6_000_000,
      tenorMonths: 6,
      bungaPersen: 1.5,
      metodeBunga: 'anuitas',
      angsuranPerBulan: 1_090_000,
    });

    expect(schedule).toHaveLength(6);
    expectSumPokokEquals(schedule, 6_000_000);
    expectNoNegative(schedule.map(s => s.pokokBayar));
    expectNoNegative(schedule.map(s => s.bungaBayar));
  });

  it('bunga 0% mengembalikan semua pokok tanpa bunga', () => {
    const schedule = buildInstallmentSchedule({
      pokok: 10_000_000,
      tenorMonths: 5,
      bungaPersen: 0,
      metodeBunga: 'efektif',
    });

    expect(schedule).toHaveLength(5);
    for (const s of schedule) {
      expect(s.bungaBayar).toBe(0);
    }
    expectSumPokokEquals(schedule, 10_000_000);
  });

  it('tenor 1 bulan: satu baris penuh', () => {
    const schedule = buildInstallmentSchedule({
      pokok: 5_000_000,
      tenorMonths: 1,
      bungaPersen: 2,
      metodeBunga: 'flat',
      angsuranPerBulan: 5_100_000,
    });

    expect(schedule).toHaveLength(1);
    expect(schedule[0].pokokBayar).toBe(5_000_000);
    expect(schedule[0].bungaBayar).toBe(100_000);
    expect(schedule[0].totalBayar).toBe(5_100_000);
  });
});

// ==============================
// toCamelCase
// ==============================
describe('toCamelCase (api client)', () => {
  it('mengubah snake_case keys menjadi camelCase', () => {
    const input = { anggota_id: 'm1', nama_lengkap: 'Budi' };
    const result = toCamelCase(input);
    expect(result).toHaveProperty('anggotaId');
    expect(result).toHaveProperty('namaLengkap');
    expect(result.anggotaId).toBe('m1');
    expect(result.namaLengkap).toBe('Budi');
  });

  it('bekerja secara rekursif pada objek bersarang', () => {
    const input = {
      anggota_id: 'm1',
      pinjaman: [
        { pokok_pinjaman: 10000, tenor_bulan: 12 },
      ],
    };
    const result = toCamelCase(input);
    expect(result.anggotaId).toBe('m1');
    expect(result.pinjaman[0].pokokPinjaman).toBe(10000);
    expect(result.pinjaman[0].tenorBulan).toBe(12);
  });

  it('mengubah string numerik menjadi number untuk field tertentu', () => {
    const input = { pokok: '500000', bunga_persen: '2.5', nama: 'Test' };
    const result = toCamelCase(input);
    expect(result.pokok).toBe(500000);
    expect(result.bungaPersen).toBe(2.5);
    expect(result.nama).toBe('Test');
  });

  it('menangani null/undefined tanpa eror', () => {
    expect(toCamelCase(null)).toBeNull();
    expect(toCamelCase(undefined)).toBeUndefined();
    expect(toCamelCase('string')).toBe('string');
    expect(toCamelCase(42)).toBe(42);
  });

  it('mengubah array objek', () => {
    const arr = [{ id_p: '1' }, { id_p: '2' }];
    const result = toCamelCase(arr);
    expect(result).toHaveLength(2);
    expect(result[0].idP).toBe(1);
    expect(result[1].idP).toBe(2);
  });
});
