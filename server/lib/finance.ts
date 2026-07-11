export interface ScheduleRow {
  pokokBayar: number;
  bungaBayar: number;
  totalBayar: number;
}

export interface BuildScheduleOptions {
  pokok: number;
  tenorMonths: number;
  bungaPersen: number; // bunga per bulan (persen)
  metodeBunga?: 'flat' | 'efektif' | 'anuitas';
  angsuranPerBulan?: number;
}

// Membangun jadwal angsuran dengan pembagian pokok/bunga per periode.
// - metode 'flat': pokok tiap periode konstan, bunga dihitung dari pokok awal.
// - metode 'efektif'/'anuitas': bunga dihitung dari sisa saldo (sliding balance),
//   pokok = angsuran - bunga, sehingga total pokok kembali tepat ke pokok awal.
export function buildInstallmentSchedule(opts: BuildScheduleOptions): ScheduleRow[] {
  const { pokok, tenorMonths, bungaPersen } = opts;
  const metode = (opts.metodeBunga || 'flat').toLowerCase();
  const isFlat = metode === 'flat';
  const i = bungaPersen / 100;
  const angsuran =
    opts.angsuranPerBulan && opts.angsuranPerBulan > 0
      ? opts.angsuranPerBulan
      : Math.round(pokok / tenorMonths);

  let sisa = pokok;
  const rows: ScheduleRow[] = [];

  for (let m = 1; m <= tenorMonths; m++) {
    const bungaBayar = isFlat
      ? Math.round(pokok * i)
      : Math.round(sisa * i);
    let pokokBayar: number;
    if (isFlat) {
      pokokBayar = Math.round(pokok / tenorMonths);
    } else {
      pokokBayar = Math.round(angsuran - bungaBayar);
    }
    // Angsuran terakhir membersihkan sisa saldo agar tidak ada sisa pembulatan.
    if (m === tenorMonths) {
      pokokBayar = Math.round(sisa);
    }
    const total = pokokBayar + bungaBayar;
    sisa = Math.max(0, sisa - pokokBayar);
    rows.push({ pokokBayar, bungaBayar, totalBayar: total });
  }

  return rows;
}

// Menghitung HPP (Harga Pokok Penjualan) riil dari harga beli per barang.
export function computeTotalHpp(
  items: { barangId?: string; qty?: number }[],
  hargaBeliById: Record<string, number>
): number {
  let total = 0;
  for (const item of items || []) {
    if (item.barangId && item.qty) {
      const hpp = (hargaBeliById[item.barangId] || 0) * item.qty;
      total += hpp;
    }
  }
  return Math.round(total);
}
