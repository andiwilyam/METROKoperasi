/*
 * seed_comprehensive.cjs
 * MetroCoop KSP - Comprehensive interconnected demo seed data.
 * Strategy: clean reseed (TRUNCATE all transactional tables except users & koperasi_info),
 * then insert a coherent dataset across all 4 module groups.
 * Connection: Supabase pooler (object config so the '@' in password parses correctly).
 */
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.brrjbrrgmjgbcylpccdz',
  password: 'yd4h@h73CHERIO',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  family: 4,
  max: 3,
  connectionTimeoutMillis: 30000
});

// ---------- helpers ----------
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const rdate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const D = (y, m, d) => new Date(y, m - 1, d);
const tid = (prefix) => { let c = 0; return () => `${prefix}${++c}`; };

const FIRST = ['Budi','Siti','Ahmad','Dewi','Hendra','Rina','Joko','Ani','Eko','Sri','Tono','Maya','Agus','Nur','Yanti','Hasan','Fitri','Slamet','Wati','Rudi','Dian','Sabar','Lina','Pardi','Sujono','Tuti','Bambang','Sari','Gunawan','Ningsih','Rahmat','Yusuf','Kartini','Suparman','Indah','Wahyu','Santi','Heri','Marni','Maulana'];
const LAST = ['Saputra','Wijaya','Susanto','Pratama','Lestari','Rahayu','Kusuma','Halim','Setiawan','Anggraini','Permata','Nugroho','Wulandari','Hidayat','Suryani','Gunawan','Utami','Purnama','Saputri','Firmansyah'];
const PEKERJAAN = ['Karyawan Swasta','Pedagang','Petani','PNS','Wiraswasta','Guru','Tukang Ojek','Ibu Rumah Tangga','Karyawan BUMN','Montir','Penjahit','Nelayan','Supir','Admin','Perawat'];
const AREA = ['Kebayoran Baru','Pancoran','Tebet','Cilandak','Pondok Labu','Kalibata','Mampang','Setiabudi','Cipete','Fatmawati','Lebak Bulus','Pesanggrahan','Cinere','Pondok Indah','Kuningan','Senayan','Blok M','Pejaten'];
const DOMAIN = ['gmail.com','yahoo.com','outlook.com'];
const BANK = ['Mandiri','BNI','BRI','BCA','Permata'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const HASH_ADMIN = '$2b$10$6awUwNIuzQOyYY7L3shB9OE8AGT6oRV4TBJpu3AOFG9VRmiA5N8Mq';
const HASH_MEMBER = '$2b$10$aEXzzidWaF/C4OvC5rfHUeTt86wBVuXlDzzUSlAf1eorv8ML3vKhC';

let nikSeq = 100000;
function name() { return `${pick(FIRST)} ${pick(LAST)}`; }
function phone() { return '08' + rnd(100000000, 9999999999).toString().slice(0, 10 + (chance(0.3) ? 1 : 0)); }
function genNik() { return '3174' + String(nikSeq++).padStart(12, '0'); }

function calcAngsuran(pokok, tenor, bungaPct, metode) {
  if (metode === 'anuitas') {
    const r = bungaPct / 100;
    const f = Math.pow(1 + r, tenor);
    return Math.round((pokok * r * f) / (f - 1));
  }
  const bungaTotal = pokok * (bungaPct / 100) * tenor;
  return Math.round((pokok + bungaTotal) / tenor);
}

function mkAnggota(id, nama, penghasilan, tipe, tanggalDaftar, opts = {}) {
  return {
    id,
    nik: opts.nik || genNik(),
    nama,
    no_ktp: opts.no_ktp || genNik(),
    no_hp: opts.no_hp || phone(),
    email: opts.email || `${id.toLowerCase()}@mail.metromitra.co.id`,
    alamat: opts.alamat || `Jl. ${pick(AREA)} No. ${rnd(1, 99)}, RT 0${rnd(1,9)}/RW 0${rnd(1,9)}, ${pick(AREA)}, Jakarta Selatan`,
    pekerjaan: opts.pekerjaan || pick(PEKERJAAN),
    penghasilan,
    status_keanggotaan: opts.status || (chance(0.1) ? pick(['nonaktif','keluar']) : 'aktif'),
    tanggal_daftar: tanggalDaftar,
    saldo_simpanan_pokok: 0,
    saldo_simpanan_wajib: 0,
    saldo_simpanan_sukarela: 0,
    tipe_anggota: tipe
  };
}

// ---------- insert helper (parameterized, chunked) ----------
async function insertRows(table, columns, rows, batch = 200, onConflict = null) {
  if (!rows.length) return;
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch);
    const colList = columns.join(', ');
    const parts = [];
    const vals = [];
    let p = 1;
    for (const row of chunk) {
      const ph = [];
      for (const c of columns) { ph.push('$' + p); vals.push(row[c] === undefined ? null : row[c]); p++; }
      parts.push('(' + ph.join(', ') + ')');
    }
    let q = `INSERT INTO ${table} (${colList}) VALUES ${parts.join(', ')}`;
    if (onConflict) q += ` ON CONFLICT (${onConflict}) DO NOTHING`;
    await pool.query(q, vals);
  }
}

// ---------- main ----------
(async () => {
  const client = await pool.connect();
  try {
    console.log('▶ Clean reseed: truncating transactional tables...');
    await client.query(`
      TRUNCATE TABLE
        anggota, pengurus, karyawan, aset_barang, sumber_bayar,
        jenis_simpanan, simpanan_transaksi, permohonan_tarik, jenis_pinjaman,
        pinjaman, angsuran, journal_entries, journal_approvals,
        kategori_barang, supplier, barang, penjualan, pembelian,
        venture_investments, venture_dividends, pengumuman, tiket_bantuan,
        bukti_transfer, sewa_assets, sewa_transactions, ppob_layanan,
        ppob_transactions, virtual_accounts, va_transactions, cicilan_barang,
        cicilan_angsuran, feature_toggles, perusahaan, chart_of_accounts,
        accounting_periods, subledger_piutang, pengajuan_pembiayaan,
        dokumen_pengajuan, hasil_skoring, landing_settings, landing_hero,
        landing_features, landing_team, landing_testimonials, landing_pricing,
        landing_contact
      RESTART IDENTITY CASCADE;
    `);

    // ===== Reference: koperasi_info (keep, upsert) =====
    await client.query(`
      INSERT INTO koperasi_info (id, nama, alamat, kota, provinsi, telp, email, no_badan_hukum, no_izin_usaha, npwp)
      VALUES (1, 'Koperasi Simpan Pinjam MetroMitra', 'Jl. Pemuda No. 45, Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', '(021) 789-0123', 'info@metromitra.co.id', 'AHU-0012345.AH.01.26.TAHUN-2024', 'SITU-503/450/KPPT/2024', '01.234.567.8-012.000')
      ON CONFLICT (id) DO NOTHING;
    `);

    // ===== Users: keep existing 1-4, add member accounts =====
    console.log('▶ Users & anggota...');
    await insertRows('users', ['id','username','nama_lengkap','role','nik','member_id','is_active','password_hash'], [
      { id:'1', username:'admin', nama_lengkap:'Ahmad Syarif', role:'admin', nik:null, member_id:null, is_active:true, password_hash:HASH_ADMIN },
      { id:'2', username:'operator', nama_lengkap:'Budi Raharjo', role:'operator', nik:null, member_id:null, is_active:true, password_hash:HASH_ADMIN },
      { id:'3', username:'1234567890', nama_lengkap:'Marmad Tuaian', role:'anggota', nik:'1234567890', member_id:'m1', is_active:true, password_hash:HASH_MEMBER },
      { id:'4', username:'hijau_agri', nama_lengkap:'PT Hijau Agri Tech', role:'anggota_perusahaan', nik:'hijau_agri', member_id:'ma1', is_active:true, password_hash:HASH_MEMBER }
    ], 50, 'id');

    // ===== Anggota: 39 konvensional (m1..m39) + 1 perusahaan (ma1) =====
    const anggotaRows = [];
    anggotaRows.push(mkAnggota('m1','Marmad Tuaian', 8500000, 'konvensional', D(2023,1,15), { nik:'1234567890', no_ktp:'3174011204850001', no_hp:'081234567890', email:'marmad@gmail.com', pekerjaan:'Karyawan Swasta', alamat:'Jl. Merdeka No. 12, RT 01/RW 03, Pancoran, Jakarta Selatan' }));
    for (let i = 2; i <= 39; i++) {
      const id = 'm' + i;
      anggotaRows.push(mkAnggota(id, name(), pick([3500000,5000000,6500000,8000000,9500000,12000000,15000000]), 'konvensional', rdate(D(2022,1,1), D(2025,12,1))));
    }
    anggotaRows.push(mkAnggota('ma1','PT Hijau Agri Tech', 0, 'perusahaan', D(2024,1,1), { nik:'hijau_agri', no_ktp:'', no_hp:'0812-9900-1122', email:'info@hijauagritech.co.id', pekerjaan:'Perusahaan Ventura', alamat:'Jl. Industri Hijau No. 88, Bandung', status:'aktif' }));
    await insertRows('anggota', ['id','nik','nama','no_ktp','no_hp','email','alamat','pekerjaan','penghasilan','status_keanggotaan','tanggal_daftar','saldo_simpanan_pokok','saldo_simpanan_wajib','saldo_simpanan_sukarela','tipe_anggota'], anggotaRows);

    // member users for m2..m39
    const memberUsers = [];
    for (let i = 2; i <= 39; i++) {
      const id = 'm' + i;
      const a = anggotaRows.find((x) => x.id === id);
      memberUsers.push({ id, username: a.nama.replace(/\s/g,'').toLowerCase().slice(0,10) + i, nama_lengkap:a.nama, role:'anggota', nik:null, member_id:id, is_active:true, password_hash:HASH_MEMBER });
    }
    await insertRows('users', ['id','username','nama_lengkap','role','nik','member_id','is_active','password_hash'], memberUsers, 50, 'id');

    // ===== Reference tables =====
    await insertRows('jenis_simpanan', ['id','nama','tipe','minimal_setoran','bunga_persen'], [
      { id:'js1', nama:'Simpanan Pokok', tipe:'pokok', minimal_setoran:1000000, bunga_persen:0 },
      { id:'js2', nama:'Simpanan Wajib Bulanan', tipe:'wajib', minimal_setoran:100000, bunga_persen:0 },
      { id:'js3', nama:'Simpanan Sukarela Harian', tipe:'sukarela', minimal_setoran:10000, bunga_persen:2 },
      { id:'js4', nama:'Deposito Berjangka MetroSafe', tipe:'deposito', minimal_setoran:5000000, bunga_persen:5 }
    ]);
    await insertRows('jenis_pinjaman', ['id','nama','bunga_persen','metode_bunga','maks_tenor','maks_plafon','biaya_admin'], [
      { id:'jp1', nama:'Pinjaman Umum Multiguna (Flat)', bunga_persen:1.0, metode_bunga:'flat', maks_tenor:24, maks_plafon:50000000, biaya_admin:50000 },
      { id:'jp2', nama:'Pinjaman KPR Syariah (Efektif)', bunga_persen:0.75, metode_bunga:'efektif', maks_tenor:120, maks_plafon:500000000, biaya_admin:100000 },
      { id:'jp3', nama:'Pinjaman Ventura/UMKM', bunga_persen:1.2, metode_bunga:'anuitas', maks_tenor:36, maks_plafon:200000000, biaya_admin:75000 }
    ]);
    await insertRows('sumber_bayar', ['id','nama','tipe','no_rekening','akun_coa'], [
      { id:'sb1', nama:'Kas Kecil Tunai', tipe:'Tunai', no_rekening:'', akun_coa:'1101' },
      { id:'sb2', nama:'Bank Mandiri Kantor Cabang', tipe:'Transfer Bank', no_rekening:'123-00-0987654-3', akun_coa:'1102' },
      { id:'sb3', nama:'E-Wallet DANA Merchant', tipe:'E-Wallet', no_rekening:'081234567890', akun_coa:'1104' },
      { id:'sb4', nama:'QRIS Bank Indonesia', tipe:'QRIS', no_rekening:'90823402804', akun_coa:'1105' }
    ]);
    await insertRows('pengurus', ['id','nik','nama','jabatan','periode_mulai','periode_selesai','no_sk','no_hp','status'], [
      { id:'pg1', nik:'3174011212750001', nama:'Ir. H. Supriyanto, M.M.', jabatan:'Ketua Pengurus', periode_mulai:D(2024,1,1), periode_selesai:D(2027,12,31), no_sk:'SK-001/M-COOP/I/2024', no_hp:'081299008822', status:'aktif' },
      { id:'pg2', nik:'3174011405800002', nama:'Riana Safitri, S.E.', jabatan:'Bendahara Koperasi', periode_mulai:D(2024,1,1), periode_selesai:D(2027,12,31), no_sk:'SK-002/M-COOP/I/2024', no_hp:'081377443311', status:'aktif' },
      { id:'pg3', nik:'3174022210800003', nama:'Drs. H. Mulyono', jabatan:'Sekretaris', periode_mulai:D(2024,1,1), periode_selesai:D(2027,12,31), no_sk:'SK-003/M-COOP/I/2024', no_hp:'081288776655', status:'aktif' }
    ]);
    await insertRows('karyawan', ['id','nik','nama','jabatan','departemen','no_hp','gaji_pokok','status','status_aktif'], [
      { id:'k1', nik:'3174021203900001', nama:'Yulianto Saputro', jabatan:'Kasir Utama & POS', departemen:'Unit Toko Perdagangan', no_hp:'085699001122', gaji_pokok:4800000, status:'tetap', status_aktif:true },
      { id:'k2', nik:'3174022511920002', nama:'Siska Amelia', jabatan:'Staf Administrasi Pinjaman', departemen:'Keuangan & Pembiayaan', no_hp:'081266554433', gaji_pokok:4500000, status:'tetap', status_aktif:true },
      { id:'k3', nik:'3174030303950003', nama:'Bagus Pratama', jabatan:'Staf Akuntansi', departemen:'Akuntansi', no_hp:'081277889900', gaji_pokok:5000000, status:'tetap', status_aktif:true }
    ]);
    await insertRows('aset_barang', ['id','kode','nama','kategori','harga_perolehan','nilai_residu','masa_manfaat','kondisi','lokasi'], [
      { id:'as1', kode:'AST-001', nama:'Gedung Kantor Ruko Kebayoran', kategori:'Bangunan', harga_perolehan:850000000, nilai_residu:100000000, masa_manfaat:20, kondisi:'Baik', lokasi:'Ruko Kebayoran Square Blok A-2' },
      { id:'as2', kode:'AST-002', nama:'Komputer Server ASUS TS100', kategori:'Elektronik', harga_perolehan:18500000, nilai_residu:1500000, masa_manfaat:5, kondisi:'Baik', lokasi:'Ruang Server Kantor Utama' },
      { id:'as3', kode:'AST-003', nama:'Motor Honda Vario 160 Operasional', kategori:'Kendaraan', harga_perolehan:26500000, nilai_residu:5000000, masa_manfaat:8, kondisi:'Baik', lokasi:'Parkir Kantor Utama' },
      { id:'as4', kode:'AST-004', nama:'Meja & Kursi Kantor 20 Set', kategori:'Perabotan', harga_perolehan:12000000, nilai_residu:1000000, masa_manfaat:10, kondisi:'Baik', lokasi:'Ruang Administrasi' }
    ]);
    await insertRows('feature_toggles', ['id','anggota','simpanan','pinjaman','data_master','laporan','portal_anggota','toko','sewa','ppob','digital_payment','pembiayaan','pengumuman','ventura'], [
      { id:'main', anggota:true, simpanan:true, pinjaman:true, data_master:true, laporan:true, portal_anggota:true, toko:true, sewa:true, ppob:true, digital_payment:true, pembiayaan:true, pengumuman:true, ventura:true }
    ]);

    // ===== Simpanan transaksi (saldo computed from these) =====
    console.log('▶ Simpanan transaksi...');
    const stId = tid('st');
    const simpananRows = [];
    const saldoMap = {};
    for (const a of anggotaRows) {
      saldoMap[a.id] = { pokok:0, wajib:0, sukarela:0 };
      const daftar = a.tanggal_daftar;
      simpananRows.push({ id:stId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:'js1', jenis_nama:'Simpanan Pokok', tanggal:daftar, tipe:'setor', jumlah:1000000, keterangan:'Setoran awal simpanan pokok' });
      saldoMap[a.id].pokok += 1000000;
      const wMonths = rnd(6, 24);
      for (let m = 0; m < wMonths; m++) {
        const tgl = addMonths(daftar, m);
        if (tgl > new Date()) break;
        simpananRows.push({ id:stId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:'js2', jenis_nama:'Simpanan Wajib Bulanan', tanggal:tgl, tipe:'setor', jumlah:100000, keterangan:'Simpanan wajib bulan ke-' + (m+1) });
        saldoMap[a.id].wajib += 100000;
      }
      const sCount = rnd(3, 10);
      for (let s = 0; s < sCount; s++) {
        const tgl = rdate(daftar, new Date());
        if (chance(0.2) && saldoMap[a.id].sukarela > 200000) {
          const tarik = Math.min(saldoMap[a.id].sukarela, rnd(100000, 1500000));
          simpananRows.push({ id:stId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:'js3', jenis_nama:'Simpanan Sukarela Harian', tanggal:tgl, tipe:'tarik', jumlah:tarik, keterangan:'Penarikan sukarela' });
          saldoMap[a.id].sukarela -= tarik;
        } else {
          const setor = rnd(100000, 2000000);
          simpananRows.push({ id:stId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:'js3', jenis_nama:'Simpanan Sukarela Harian', tanggal:tgl, tipe:'setor', jumlah:setor, keterangan:'Setoran sukarela' });
          saldoMap[a.id].sukarela += setor;
        }
      }
    }
    await insertRows('simpanan_transaksi', ['id','anggota_id','anggota_nama','jenis_simpanan_id','jenis_nama','tanggal','tipe','jumlah','keterangan'], simpananRows);
    for (const a of anggotaRows) {
      const s = saldoMap[a.id];
      await client.query('UPDATE anggota SET saldo_simpanan_pokok=$1, saldo_simpanan_wajib=$2, saldo_simpanan_sukarela=$3 WHERE id=$4', [s.pokok, s.wajib, s.sukarela, a.id]);
    }

    // ===== Pinjaman + angsuran =====
    console.log('▶ Pinjaman & angsuran...');
    const pjId = tid('pj');
    const agId = tid('ag');
    const pinjamanRows = [];
    const angsuranRows = [];
    const subledgerRows = [];
    const subId = tid('sl');
    const jenisList = [
      { id:'jp1', bunga:1.0, metode:'flat', tenor:[6,24], plafon:[5000000,50000000] },
      { id:'jp2', bunga:0.75, metode:'effective', tenor:[60,120], plafon:[100000000,500000000] },
      { id:'jp3', bunga:1.2, metode:'anuitas', tenor:[12,36], plafon:[10000000,200000000] }
    ];
    const totalPinjaman = 60;
    const today = new Date();
    for (let i = 0; i < totalPinjaman; i++) {
      const a = pick(anggotaRows);
      const jp = pick(jenisList);
      const pokok = Math.round(rnd(jp.plafon[0], jp.plafon[1]) / 500000) * 500000;
      const tenor = rnd(jp.tenor[0], jp.tenor[1]);
      const angsuran = calcAngsuran(pokok, tenor, jp.bunga, jp.metode);
      const statusRoll = Math.random();
      let status = 'dicairkan';
      if (statusRoll < 0.15) status = 'pengajuan';
      else if (statusRoll < 0.30) status = 'disetujui';
      else if (statusRoll > 0.85) status = 'lunas';
      const tglPengajuan = rdate(D(2023,1,1), D(2026,6,1));
      let tglCair = null, paidCount = 0;
      if (status === 'dicairkan') { tglCair = new Date(tglPengajuan.getTime() + rnd(5,30)*86400000); paidCount = rnd(1, Math.max(1, tenor - 2)); }
      else if (status === 'lunas') { tglCair = new Date(tglPengajuan.getTime() + rnd(5,30)*86400000); paidCount = tenor; }
      const pid = pjId();
      const noPj = 'PN-' + fmt(tglPengajuan).replace(/-/g,'') + '-' + String(i+1).padStart(3,'0');
      let sisa = pokok;
      if (paidCount > 0) sisa = pokok - paidCount * Math.round(pokok / tenor);
      pinjamanRows.push({ id:pid, anggota_id:a.id, anggota_nama:a.nama, jenis_pinjaman_id:jp.id, jenis_nama:jp.id==='jp1'?'Pinjaman Umum Multiguna':jp.id==='jp2'?'Pinjaman KPR Syariah':'Pinjaman Ventura/UMKM', no_pinjaman:noPj, pokok, tenor_months:tenor, bunga_persen:jp.bunga, metode_bunga:jp.metode, angsuran_per_bulan:angsuran, biaya_admin:jp.id==='jp2'?100000:jp.id==='jp3'?75000:50000, sisa_pokok:sisa, status, tanggal_pengajuan:tglPengajuan, tanggal_cair:tglCair });
      if ((status === 'dicairkan' || status === 'lunas') && tglCair) {
        const perInstall = Math.round(pokok / tenor);
        for (let k = 1; k <= tenor; k++) {
          const due = addMonths(tglCair, k - 1);
          let st = 'belum_bayar', tglBayar = null;
          if (k <= paidCount) { st = 'lunas'; tglBayar = due; }
          else if (due < today) { st = 'terlambat'; }
          angsuranRows.push({ id:agId(), pinjaman_id:pid, anggota_nama:a.nama, angsuran_ke:k, tanggal_jatuh_tempo:due, pokok_bayar:perInstall, bunga_bayar:angsuran - perInstall, total_bayar:angsuran, status:st, tanggal_bayar:tglBayar });
        }
      }
      if (status === 'dicairkan' && sisa > 0) {
        const hari = rnd(0, 90);
        const tunggakanPokok = chance(0.4) ? Math.round(sisa * (chance(0.5)?0.1:0.25)) : 0;
        const tunggakanBunga = Math.round(tunggakanPokok * (jp.bunga/100) * (hari/30 || 1));
        let kol = 'Lancar';
        if (hari > 90) kol = 'Macet';
        else if (hari > 60) kol = 'Diragukan';
        else if (hari > 30) kol = 'Kurang Lancar';
        subledgerRows.push({ id:subId(), anggota_id:a.id, no_pinjaman:noPj, pokok_piutang:sisa, tunggakan_pokok:tunggakanPokok, tunggakan_bunga:tunggakanBunga, hari_tunggakan:hari, kolektibilitas:kol, tanggal_update:today });
      }
    }
    await insertRows('pinjaman', ['id','anggota_id','anggota_nama','jenis_pinjaman_id','jenis_nama','no_pinjaman','pokok','tenor_months','bunga_persen','metode_bunga','angsuran_per_bulan','biaya_admin','sisa_pokok','status','tanggal_pengajuan','tanggal_cair'], pinjamanRows);
    await insertRows('angsuran', ['id','pinjaman_id','anggota_nama','angsuran_ke','tanggal_jatuh_tempo','pokok_bayar','bunga_bayar','total_bayar','status','tanggal_bayar'], angsuranRows);
    await insertRows('subledger_piutang', ['id','anggota_id','no_pinjaman','pokok_piutang','tunggakan_pokok','tunggakan_bunga','hari_tunggakan','kolektibilitas','tanggal_update'], subledgerRows);

    // permohonan_tarik & bukti_transfer
    console.log('▶ Permohonan tarik & bukti transfer...');
    const ptId = tid('pt'); const btId = tid('bt');
    const permohonanRows = []; const buktiRows = [];
    for (let i = 0; i < 12; i++) {
      const a = pick(anggotaRows);
      const js = pick(['js2','js3']);
      permohonanRows.push({ id:ptId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:js, jenis_nama:js==='js2'?'Simpanan Wajib Bulanan':'Simpanan Sukarela Harian', tanggal:rdate(D(2025,1,1), today), jumlah:rnd(100000,1500000), status:pick(['pengajuan','disetujui','ditolak']) });
    }
    for (let i = 0; i < 10; i++) {
      const a = pick(anggotaRows);
      buktiRows.push({ id:btId(), anggota_id:a.id, anggota_nama:a.nama, jenis_simpanan_id:'js3', jenis_nama:'Simpanan Sukarela Harian', tanggal:rdate(D(2025,1,1), today), jumlah:rnd(100000,2000000), keterangan:'Transfer dari bank anggota', bank_pengirim:pick(BANK), no_ref:'TF' + rnd(100000,999999), status:pick(['pending','disetujui','ditolak']) });
    }
    await insertRows('permohonan_tarik', ['id','anggota_id','anggota_nama','jenis_simpanan_id','jenis_nama','tanggal','jumlah','status'], permohonanRows);
    await insertRows('bukti_transfer', ['id','anggota_id','anggota_nama','jenis_simpanan_id','jenis_nama','tanggal','jumlah','keterangan','bank_pengirim','no_ref','status'], buktiRows);

    // ===== Unit Usaha: Toko =====
    console.log('▶ Unit Usaha (Toko/PPOB/VA)...');
    await insertRows('kategori_barang', ['id','nama'], [
      { id:'kb1', nama:'Sembako' }, { id:'kb2', nama:'Minuman' }, { id:'kb3', nama:'Snack' }, { id:'kb4', nama:'Elektronik' },
      { id:'kb5', nama:'Alat Tulis' }, { id:'kb6', nama:'Perlengkapan Rumah' }, { id:'kb7', nama:'Bumbu Dapur' }, { id:'kb8', nama:'Kesehatan' }
    ]);
    await insertRows('supplier', ['id','nama','kontak','no_hp','alamat'], [
      { id:'sp1', nama:'PT Sumber Rejeki', kontak:'Bpk. Anton', no_hp:'081211223344', alamat:'Jl. Industri Raya No. 10, Jakarta' },
      { id:'sp2', nama:'CV Berkah Sentosa', kontak:'Ibu Ratna', no_hp:'081233445566', alamat:'Jl. Gudang No. 22, Bekasi' },
      { id:'sp3', nama:'UD Makmur Abadi', kontak:'Bpk. Joko', no_hp:'081244556677', alamat:'Jl. Pasar Induk No. 5, Jakarta' },
      { id:'sp4', nama:'PT Elektrindo', kontak:'Bpk. Herman', no_hp:'081255667788', alamat:'Jl. Industri Elektronik No. 8, Tangerang' },
      { id:'sp5', nama:'Toko Grosir Sejahtera', kontak:'Ibu Sri', no_hp:'081266778899', alamat:'Jl. Palmerah No. 15, Jakarta' },
      { id:'sp6', nama:'PD Sinar Abadi', kontak:'Bpk. Yadi', no_hp:'081277889900', alamat:'Jl. Ciledug Raya No. 30, Tangerang' }
    ]);
    const barangList = [
      ['Beras Premium 5kg','kb1','sp3',58000,63000],['Minyak Goreng 2L','kb1','sp3',28000,31000],['Gula Pasir 1kg','kb1','sp5',14000,16000],
      ['Tepung Terigu 1kg','kb1','sp5',12000,14000],['Kopi Sachet 10pcs','kb2','sp2',15000,18000],['Teh Celup 25pcs','kb2','sp2',9000,12000],
      ['Air Mineral Galon','kb2','sp1',18000,21000],['Susu Kental 200g','kb2','sp1',11000,13500],['Wafer Coklat','kb3','sp2',8000,10500],
      ['Biskuit Kelapa','kb3','sp2',7000,9500],['Permen Mint 100g','kb3','sp2',6000,8500],['Kerupuk Udang','kb3','sp5',10000,13000],
      ['Charger HP Fast','kb4','sp4',45000,65000],['Kabel Data 1m','kb4','sp4',25000,38000],['Earphone Bluetooth','kb4','sp4',85000,130000],
      ['Bola Lampu LED 9W','kb4','sp4',12000,18000],['Pulpen Biru','kb5','sp6',3000,5000],['Buku Tulis 38','kb5','sp6',5000,8000],
      ['Penggaris 30cm','kb5','sp6',4000,7000],['Sabun Cuci Piring','kb6','sp1',9000,13000],['Deterjen 1kg','kb6','sp1',15000,20000],
      ['Sikat Gigi','kb6','sp1',7000,11000],['Sapu Lidi','kb6','sp5',12000,17000],['Garam Dapur 500g','kb7','sp5',4000,7000],
      ['Royco Ayam','kb7','sp5',2500,4500],['Saus Sambal 500g','kb7','sp2',18000,24000],['Vitamin C 1000mg','kb8','sp3',35000,55000],
      ['Masker Bedah 50pcs','kb8','sp3',28000,45000],['Obat Nyamuk','kb8','sp3',15000,22000],['Plester Luka','kb8','sp6',6000,10000]
    ];
    const barangRows = barangList.map((b, i) => ({ id:'br'+(i+1), kode:'BRG-'+String(i+1).padStart(3,'0'), nama:b[0], kategori_id:b[1], supplier_id:b[2], harga_beli:b[3], harga_jual:b[4], stok:rnd(10,200), stok_minimum:rnd(5,20), satuan:'Pcs' }));
    await insertRows('barang', ['id','kode','nama','kategori_id','supplier_id','harga_beli','harga_jual','stok','stok_minimum','satuan'], barangRows);

    const pjId2 = tid('pj'); const pbId = tid('pb');
    const penjualanRows = []; const pembelianRows = [];
    for (let i = 0; i < 50; i++) {
      const n = rnd(1, 4);
      const items = []; let total = 0;
      for (let j = 0; j < n; j++) {
        const br = pick(barangRows);
        const qty = rnd(1, 5);
        const sub = br.harga_jual * qty;
        total += sub;
        items.push({ kode: br.kode, nama: br.nama, qty, harga: br.harga_jual, subtotal: sub });
      }
      const diskon = chance(0.3) ? Math.round(total * 0.05) : 0;
      penjualanRows.push({ id:pjId2(), no_faktur:'FJ-'+fmt(rdate(D(2025,1,1), today)).replace(/-/g,'')+'-'+String(i+1).padStart(3,'0'), tanggal:rdate(D(2025,1,1), today), items, total:total-diskon, metode_bayar:pick(['Tunai','Transfer Bank','E-Wallet','QRIS']), diskon });
    }
    for (let i = 0; i < 15; i++) {
      const sp = pick(['sp1','sp2','sp3','sp4','sp5','sp6']);
      const n = rnd(1, 3); const items = []; let total = 0;
      for (let j = 0; j < n; j++) {
        const br = pick(barangRows);
        const qty = rnd(10, 50);
        const sub = br.harga_beli * qty;
        total += sub;
        items.push({ kode: br.kode, nama: br.nama, qty, harga: br.harga_beli, subtotal: sub });
      }
      pembelianRows.push({ id:pbId(), no_invoice:'INV-'+String(i+1).padStart(3,'0'), tanggal:rdate(D(2025,1,1), today), supplier_id:sp, supplier_nama:sp, items, total, status:pick(['pesan','diterima','batal']) });
    }
    await insertRows('penjualan', ['id','no_faktur','tanggal','items','total','metode_bayar','diskon'], penjualanRows);
    await insertRows('pembelian', ['id','no_invoice','tanggal','supplier_id','supplier_nama','items','total','status'], pembelianRows);

    // PPOB
    await insertRows('ppob_layanan', ['id','nama','tipe','nominal_min','nominal_max','status'], [
      { id:'pl1', nama:'Pulsa Telkomsel', tipe:'Voucher', nominal_min:5000, nominal_max:1000000, status:'Aktif' },
      { id:'pl2', nama:'Pulsa XL', tipe:'Voucher', nominal_min:5000, nominal_max:1000000, status:'Aktif' },
      { id:'pl3', nama:'Token PLN', tipe:'Listrik', nominal_min:20000, nominal_max:1000000, status:'Aktif' },
      { id:'pl4', nama:'Tagihan PLN', tipe:'Listrik', nominal_min:50000, nominal_max:2000000, status:'Aktif' },
      { id:'pl5', nama:'PDAM', tipe:'Tagihan', nominal_min:10000, nominal_max:500000, status:'Aktif' },
      { id:'pl6', nama:'BPJS Kesehatan', tipe:'Tagihan', nominal_min:50000, nominal_max:500000, status:'Aktif' },
      { id:'pl7', nama:'Voucher Game', tipe:'Voucher', nominal_min:10000, nominal_max:1000000, status:'Aktif' },
      { id:'pl8', nama:'Paket Data', tipe:'Voucher', nominal_min:10000, nominal_max:500000, status:'Aktif' }
    ]);
    const ppobId = tid('pp'); const ppobRows = [];
    for (let i = 0; i < 40; i++) {
      const a = pick(anggotaRows);
      const lay = pick(['pl1','pl2','pl3','pl4','pl5','pl6','pl7','pl8']);
      const nominal = lay==='pl3'||lay==='pl4' ? rnd(20000,500000) : lay==='pl5'||lay==='pl6' ? rnd(50000,300000) : rnd(5000,200000);
      const hargaKop = Math.round(nominal * 0.97);
      ppobRows.push({ id:ppobId(), anggota_id:a.id, anggota_nama:a.nama, layanan_id:lay, layanan_nama:lay, target_number:phone(), nominal, harga_koperasi:hargaKop, harga_jual:nominal, tanggal:rdate(D(2025,1,1), today), status:pick(['sukses','sukses','sukses','proses','gagal']), sn:chance(0.5)?'SN'+rnd(100000,999999):'', no_referensi:'PPOB'+rnd(100000,999999) });
    }
    await insertRows('ppob_transactions', ['id','anggota_id','anggota_nama','layanan_id','layanan_nama','target_number','nominal','harga_koperasi','harga_jual','tanggal','status','sn','no_referensi'], ppobRows);

    // Virtual Accounts
    const vaId = tid('va'); const vaRows = []; const vatId = tid('vt'); const vaTrxRows = [];
    const vaAnggota = anggotaRows.slice(0, 30);
    for (const a of vaAnggota) {
      const bank = pick(BANK);
      const nomor = '8808' + rnd(1000000000, 9999999999);
      vaRows.push({ id:vaId(), anggota_id:a.id, anggota_nama:a.nama, bank, nomor_va:nomor, label:'VA ' + a.nama, status:'aktif' });
      const tn = rnd(1, 3);
      for (let t = 0; t < tn; t++) {
        vaTrxRows.push({ id:vatId(), anggota_id:a.id, anggota_nama:a.nama, nomor_va:nomor, bank, nominal:rnd(100000,5000000), jenis_trx:pick(['topup_sukarela','bayar_angsuran','bayar_cicilan_barang']), tanggal:rdate(D(2025,1,1), today), status:pick(['sukses','sukses','pending','expired']) });
      }
    }
    await insertRows('virtual_accounts', ['id','anggota_id','anggota_nama','bank','nomor_va','label','status'], vaRows);
    await insertRows('va_transactions', ['id','anggota_id','anggota_nama','nomor_va','bank','nominal','jenis_trx','tanggal','status'], vaTrxRows);

    // Cicilan Barang
    const cbId = tid('cb'); const caId = tid('ca'); const cbRows = []; const caRows = [];
    for (let i = 0; i < 20; i++) {
      const a = pick(anggotaRows);
      const br = pick(barangRows);
      const total = br.harga_jual * rnd(1, 3);
      const dp = Math.round(total * (chance(0.5)?0.3:0.2));
      const pokokPem = total - dp;
      const tenor = rnd(6, 24);
      const bunga = pick([1.0, 1.5, 2.0]);
      const angs = calcAngsuran(pokokPem, tenor, bunga, 'flat');
      const statusRoll = Math.random();
      const status = statusRoll < 0.1 ? 'pengajuan' : statusRoll < 0.2 ? 'disetujui' : statusRoll > 0.85 ? 'lunas' : 'aktif';
      const tglPengajuan = rdate(D(2024,1,1), D(2026,6,1));
      let tglMulai = null, paidCount = 0;
      if (status === 'aktif') { tglMulai = new Date(tglPengajuan.getTime()+rnd(3,15)*86400000); paidCount = rnd(1, Math.max(1, tenor-2)); }
      else if (status === 'lunas') { tglMulai = new Date(tglPengajuan.getTime()+rnd(3,15)*86400000); paidCount = tenor; }
      const cid = cbId();
      let sisa = pokokPem;
      if (paidCount > 0) sisa = pokokPem - paidCount * Math.round(pokokPem / tenor);
      cbRows.push({ id:cid, anggota_id:a.id, anggota_nama:a.nama, barang_nama:br.nama, total_harga:total, dp, pokok_pembiayaan:pokokPem, tenor_months:tenor, bunga_persen:bunga, angsuran_per_bulan:angs, sisa_pokok:sisa, status, tanggal_pengajuan:tglPengajuan, tanggal_mulai:tglMulai });
      if ((status === 'aktif' || status === 'lunas') && tglMulai) {
        const per = Math.round(pokokPem / tenor);
        for (let k = 1; k <= tenor; k++) {
          const due = addMonths(tglMulai, k - 1);
          let st = 'belum_bayar', tglBayar = null;
          if (k <= paidCount) { st = 'lunas'; tglBayar = due; }
          else if (due < today) st = 'terlambat';
          caRows.push({ id:caId(), cicilan_barang_id:cid, anggota_nama:a.nama, angsuran_ke:k, tanggal_jatuh_tempo:due, pokok_bayar:per, bunga_bayar:angs-per, total_bayar:angs, status:st, tanggal_bayar:tglBayar });
        }
      }
    }
    await insertRows('cicilan_barang', ['id','anggota_id','anggota_nama','barang_nama','total_harga','dp','pokok_pembiayaan','tenor_months','bunga_persen','angsuran_per_bulan','sisa_pokok','status','tanggal_pengajuan','tanggal_mulai'], cbRows);
    await insertRows('cicilan_angsuran', ['id','cicilan_barang_id','anggota_nama','angsuran_ke','tanggal_jatuh_tempo','pokok_bayar','bunga_bayar','total_bayar','status','tanggal_bayar'], caRows);

    // Sewa aset
    await insertRows('sewa_assets', ['id','nama','kategori','biaya_sewa_per_hari','status','deskripsi'], [
      { id:'sa1', nama:'Sound System 2000W', kategori:'Elektronik', biaya_sewa_per_hari:250000, status:'Tersedia', deskripsi:'Speaker aktif + mixer lengkap' },
      { id:'sa2', nama:'Tenda Pesta 10x10', kategori:'Perlengkapan', biaya_sewa_per_hari:150000, status:'Tersedia', deskripsi:'Tenda parasut kapasitas 100 orang' },
      { id:'sa3', nama:'Kursi Futura 100pcs', kategori:'Perlengkapan', biaya_sewa_per_hari:200000, status:'Tersedia', deskripsi:'Kursi lipat futura' },
      { id:'sa4', nama:'Meja Bundar 20pcs', kategori:'Perlengkapan', biaya_sewa_per_hari:120000, status:'Disewa', deskripsi:'Meja bundar diameter 1.5m' },
      { id:'sa5', nama:'Generator 3000W', kategori:'Elektronik', biaya_sewa_per_hari:180000, status:'Tersedia', deskripsi:'Genset silent' },
      { id:'sa6', nama:'Projector Full HD', kategori:'Elektronik', biaya_sewa_per_hari:100000, status:'Perawatan', deskripsi:'Proyektor Epson' }
    ]);
    const stxId = tid('sx'); const sewaRows = [];
    for (let i = 0; i < 12; i++) {
      const a = pick(anggotaRows);
      const as = pick(['sa1','sa2','sa3','sa4','sa5','sa6']);
      const mulai = rdate(D(2025,1,1), today);
      const hari = rnd(1, 7);
      const selesai = new Date(mulai.getTime() + hari*86400000);
      const biaya = { sa1:250000, sa2:150000, sa3:200000, sa4:120000, sa5:180000, sa6:100000 }[as] * hari;
      sewaRows.push({ id:stxId(), anggota_id:a.id, anggota_nama:a.nama, aset_id:as, aset_nama:as, tanggal_mulai:mulai, tanggal_selesai:selesai, jumlah_hari:hari, total_biaya:biaya, denda:chance(0.2)?rnd(50000,200000):0, status:pick(['pengajuan','disetujui','berjalan','selesai','ditolak']), bukti_bayar_url:'' });
    }
    await insertRows('sewa_transactions', ['id','anggota_id','anggota_nama','aset_id','aset_nama','tanggal_mulai','tanggal_selesai','jumlah_hari','total_biaya','denda','status','bukti_bayar_url'], sewaRows);

    // ===== Ventura & Pembiayaan AI =====
    console.log('▶ Ventura & Pembiayaan AI...');
    const perusahaanList = [
      ['PT Hijau Agri Tech','Pertanian & IoT (Agrotech)','Dr. Fahmi Idris','Jl. Industri Hijau No. 88, Bandung','Bandung','Jawa Barat',2019,'01.222.333.4-555.000'],
      ['PT Cahaya Energi Surya','Energi Terbarukan (Solar)','Ir. Bambang Sutrisno','Jl. Matahari No. 12, Surabaya','Surabaya','Jawa Timur',2018,'02.333.444.5-666.000'],
      ['PT Nusantara Fintech','Teknologi Keuangan','Rina Marlina, S.Kom','Jl. Digital No. 5, Jakarta Selatan','Jakarta','DKI Jakarta',2020,'03.444.555.6-777.000'],
      ['PT Boga Rasa Nusantara','F&B / Kuliner','Chef Junaedi','Jl. Rasa No. 30, Yogyakarta','Yogyakarta','DI Yogyakarta',2017,'04.555.666.7-888.000'],
      ['PT Sehat Medika Digital','HealthTech','Dr. Anindya Putri','Jl. Sehat No. 8, Tangerang','Tangerang','Banten',2021,'05.666.777.8-999.000'],
      ['PT Logistik Cepat Indonesia','Logistik & Supply Chain','Hendra Kusuma','Jl. Raya Industri No. 50, Bekasi','Bekasi','Jawa Barat',2016,'06.777.888.9-111.000'],
      ['PT Edukasi Cerdas','EdTech','Siti Nurhaliza, M.Pd','Jl. Pendidikan No. 20, Semarang','Semarang','Jawa Tengah',2019,'07.888.999.0-222.000'],
      ['PT Eco Fashion Indonesia','Fashion Berkelanjutan','Maya Sari, S.Ds','Jl. Mode No. 15, Bandung','Bandung','Jawa Barat',2020,'08.999.000.1-333.000']
    ];
    const slug = (s) => s.toLowerCase().replace(/[^a-z]/g,'').slice(0,12);
    const perusahaanRows = perusahaanList.map((p, i) => ({ id:'pr'+(i+1), kode_perusahaan:'P-' + String(i+1).padStart(3,'0'), nama:p[0], alamat:p[3], kota:p[4], provinsi:p[5], sektor_industri:p[1], tahun_berdiri:p[6], no_akte_pendirian:'AHU-'+rnd(1000,9999), npwp:p[7], no_izin_usaha:'SIU-'+rnd(1000,9999), nama_direktur:p[2], kontak_direktur:phone(), email_perusahaan:'info@'+slug(p[0])+'.co.id', telepon:phone(), website:'https://www.'+slug(p[0])+'.co.id', deskripsi:'Perusahaan di sektor '+p[1]+' dengan prospek pertumbuhan positif.', status:'aktif' }));
    await insertRows('perusahaan', ['id','kode_perusahaan','nama','alamat','kota','provinsi','sektor_industri','tahun_berdiri','no_akte_pendirian','npwp','no_izin_usaha','nama_direktur','kontak_direktur','email_perusahaan','telepon','website','deskripsi','status'], perusahaanRows);

    // pengajuan_pembiayaan (1 perusahaan/anggota)
    const pengajuanRows = [];
    for (let i = 0; i < 12; i++) {
      const pr = pick(perusahaanRows);
      const a = pick(anggotaRows);
      const jenis = pick(['Modal Kerja','Investasi Mesin Baru','Ekspansi Cabang','R&D Produk Baru','Digitalisasi Sistem','Pembelian Inventori']);
      const pokok = Math.round(rnd(50000000, 180000000) / 1000000) * 1000000;
      const tenor = pick([12, 18, 24, 36]);
      const statusP = pick(['pengajuan','dianalisis','disetujui','dicairkan','ditolak']);
      const tgl = rdate(D(2024,1,1), D(2026,6,1));
      const no = 'PJ-' + fmt(tgl).replace(/-/g,'') + '-' + String(i+1).padStart(3,'0');
      pengajuanRows.push({
        id:'pp' + String(i+1).padStart(3,'0'),
        perusahaan_id:pr.id,
        anggota_id:a.id,
        anggota_nama:a.nama,
        no_pengajuan:no,
        tanggal_pengajuan:tgl,
        jenis_pembiayaan:jenis,
        pokok_pengajuan:pokok,
        tenor_bulan:tenor,
        tujuan_pembiayaan:'Pembiayaan untuk ' + pr.nama + ' (' + jenis + ')',
        bunga_diharapkan:pick([1.0,1.2,1.5]),
        status_pengajuan:statusP,
        skor_akhir:null,
        status_kelayakan:null,
        rekomendasi:'',
        created_at:new Date(tgl.getTime())
      });
    }
    await insertRows('pengajuan_pembiayaan', ['id','perusahaan_id','anggota_id','anggota_nama','no_pengajuan','tanggal_pengajuan','jenis_pembiayaan','pokok_pengajuan','tenor_bulan','tujuan_pembiayaan','bunga_diharapkan','status_pengajuan','skor_akhir','status_kelayakan','rekomendasi','created_at'], pengajuanRows);

    // hasil_skoring (1 per pengajuan) + sync pengajuan
    const skoringRows = [];
    for (const p of pengajuanRows) {
      const skor = Math.round(rnd(55, 95) * 100) / 100;
      const layak = skor >= 80 ? 'Layak' : skor >= 65 ? 'Layak dengan Syarat' : 'Kurang Layak';
      skoringRows.push({
        id:'hs' + p.id.slice(2),
        pengajuan_id:p.id,
        skor_keseluruhan:skor,
        status_kelayakan:layak,
        skor_character:Math.round(rnd(60,95)*100)/100,
        skor_capacity:Math.round(rnd(60,95)*100)/100,
        skor_capital:Math.round(rnd(60,95)*100)/100,
        skor_collateral:Math.round(rnd(60,95)*100)/100,
        skor_condition:Math.round(rnd(60,95)*100)/100,
        rasio_likuiditas:Math.round(rnd(120,250)*100)/100,
        rasio_solvabilitas:Math.round(rnd(20,60)*100)/100,
        rasio_profitabilitas:Math.round(rnd(8,25)*100)/100,
        rasio_bopo:Math.round(rnd(60,90)*100)/100,
        bmpk_persen:Math.round(rnd(5,25)*100)/100,
        bmpk_status:pick(['Aman','Waspada','Batas']),
        collateral_coverage:Math.round(rnd(110,180)*100)/100,
        rekomendasi_plafon:Math.round(p.pokok_pengajuan * (skor/100)),
        rekomendasi_tenor:p.tenor_bulan,
        rekomendasi_bunga:pick([1.0,1.2,1.5]),
        syarat_khusus:layak === 'Layak dengan Syarat' ? 'Menyertakan agunan tambahan dan laporan keuangan triwulanan.' : 'Tidak ada syarat khusus.',
        ai_analisis_json:{ ringkasan:'Analisis AI terhadap pengajuan ' + p.no_pengajuan, model:'gemini-2.0-flash', skor }
      });
    }
    await insertRows('hasil_skoring', ['id','pengajuan_id','skor_keseluruhan','status_kelayakan','skor_character','skor_capacity','skor_capital','skor_collateral','skor_condition','rasio_likuiditas','rasio_solvabilitas','rasio_profitabilitas','rasio_bopo','bmpk_persen','bmpk_status','collateral_coverage','rekomendasi_plafon','rekomendasi_tenor','rekomendasi_bunga','syarat_khusus','ai_analisis_json'], skoringRows);
    for (const s of skoringRows) {
      await client.query('UPDATE pengajuan_pembiayaan SET skor_akhir=$1, status_kelayakan=$2 WHERE id=$3', [s.skor_keseluruhan, s.status_kelayakan, s.pengajuan_id]);
    }

    // dokumen_pengajuan
    const dokRows = [];
    const dId = tid('dk');
    const kelompokMap = {
      LEGALITAS: [['AKT-001','Akta Pendirian Perusahaan'],['NPWP-001','NPWP Perusahaan'],['SIUP-001','Izin Usaha (NIB)']],
      KEUANGAN: [['LK-001','Laporan Keuangan Auditan'],['LK-002','Rekening Koran 6 Bulan']],
      AGUNAN: [['AGN-001','Sertifikat Agunan'],['AGN-002','BPKB Kendaraan']],
      TATA_KELOLA: [['TK-001','Profil Direksi'],['TK-002','Struktur Organisasi']]
    };
    for (const p of pengajuanRows) {
      for (const k of Object.keys(kelompokMap)) {
        for (const d of kelompokMap[k]) {
          dokRows.push({ id:dId(), pengajuan_id:p.id, kelompok:k, kode_dokumen:d[0], nama_dokumen:d[1], deskripsi:'Dokumen ' + d[1] + ' untuk ' + p.no_pengajuan, dasar_hukum:'POJK No. 12/2023', status_upload:pick(['terupload','valid','valid','invalid']), file_path:'/docs/' + p.id + '/' + d[0] + '.pdf', file_type:'application/pdf', tanggal_upload:new Date(), tanggal_kedaluwarsa:addMonths(new Date(), 12), ai_validasi:chance(0.2)?'Dokumen terdeteksi tidak sesuai, mohon perbarui.':'', ai_confidence:Math.round(rnd(70,99)*100)/100 });
        }
      }
    }
    await insertRows('dokumen_pengajuan', ['id','pengajuan_id','kelompok','kode_dokumen','nama_dokumen','deskripsi','dasar_hukum','status_upload','file_path','file_type','tanggal_upload','tanggal_kedaluwarsa','ai_validasi','ai_confidence'], dokRows);

    // venture_investments + dividends
    const viId = tid('vi'); const vdId = tid('vd');
    const viRows = []; const vdRows = [];
    for (let i = 0; i < 8; i++) {
      const pr = perusahaanRows[i];
      const p = pengajuanRows.find((x) => x.perusahaan_id === pr.id) || pick(pengajuanRows);
      const a = pick(anggotaRows);
      const nominal = Math.round(rnd(10000000, 60000000) / 1000000) * 1000000;
      const vid = viId();
      viRows.push({
        id:vid,
        nama_perusahaan:pr.nama,
        sektor_industri:pr.sektor_industri,
        nama_founder:pr.nama_direktur,
        nominal_investasi:nominal,
        persentase_saham:Math.round(rnd(5, 25) * 100) / 100,
        estimasi_dividen:Math.round(rnd(8, 20) * 100) / 100,
        tanggal_investasi:rdate(D(2024,1,1), D(2026,5,1)),
        tenor_tahun:pick([2,3,5]),
        status:'dicairkan',
        deskripsi_bisnis:'Investasi ventura pada ' + pr.nama,
        kontak_founder:pr.kontak_direktur,
        prospektus_url:'/prospektus/' + pr.kode_perusahaan + '.pdf',
        pengaju_anggota_id:a.id,
        pengaju_anggota_nama:a.nama,
        pengajuan_id:p.id,
        perusahaan_id_fk:pr.id
      });
      const divCount = rnd(1, 3);
      for (let d = 0; d < divCount; d++) {
        vdRows.push({ id:vdId(), investment_id:vid, tanggal:rdate(D(2024,6,1), today), nominal_dividen:Math.round(nominal * (rnd(2,8)/100) / 1000) * 1000, keterangan:'Dividen triwulanan ' + pr.nama });
      }
    }
    await insertRows('venture_investments', ['id','nama_perusahaan','sektor_industri','nama_founder','nominal_investasi','persentase_saham','estimasi_dividen','tanggal_investasi','tenor_tahun','status','deskripsi_bisnis','kontak_founder','prospektus_url','pengaju_anggota_id','pengaju_anggota_nama','pengajuan_id','perusahaan_id_fk'], viRows);
    await insertRows('venture_dividends', ['id','investment_id','tanggal','nominal_dividen','keterangan'], vdRows);

    // ===== Akuntansi: COA, periods, journals =====
    console.log('▶ Akuntansi (COA / periode / jurnal)...');
    const coaRows = [
      ['1000','Aset','ASET',1,null,true],
      ['1101','Kas Kecil','ASET',2,'1000',false],
      ['1102','Kas Bank Mandiri','ASET',2,'1000',false],
      ['1104','Kas E-Wallet DANA','ASET',2,'1000',false],
      ['1105','Kas QRIS BI','ASET',2,'1000',false],
      ['1150','Piutang Simpan Pinjam','ASET',2,'1000',false],
      ['1190','Investasi Ventura','ASET',2,'1000',false],
      ['1200','Persediaan Barang','ASET',2,'1000',false],
      ['1500','Aset Tetap','ASET',1,null,true],
      ['1510','Bangunan','ASET',2,'1500',false],
      ['1520','Kendaraan','ASET',2,'1500',false],
      ['1530','Peralatan & Komputer','ASET',2,'1500',false],
      ['2000','Kewajiban','KEWAJIBAN',1,null,true],
      ['2100','Simpanan Anggota','KEWAJIBAN',2,'2000',false],
      ['2200','Hutang Usaha','KEWAJIBAN',2,'2000',false],
      ['2300','Hutang Bank','KEWAJIBAN',2,'2000',false],
      ['3000','Ekuitas','EKUITAS',1,null,true],
      ['3100','Simpanan Pokok Anggota','EKUITAS',2,'3000',false],
      ['3200','Cadangan Umum','EKUITAS',2,'3000',false],
      ['3300','SHU Tahun Berjalan','EKUITAS',2,'3000',false],
      ['4000','Pendapatan','PENDAPATAN',1,null,true],
      ['4100','Pendapatan Simpanan','PENDAPATAN',2,'4000',false],
      ['4200','Pendapatan Pinjaman','PENDAPATAN',2,'4000',false],
      ['4300','Pendapatan Penjualan','PENDAPATAN',2,'4000',false],
      ['4400','Pendapatan PPOB','PENDAPATAN',2,'4000',false],
      ['4500','Pendapatan Ventura','PENDAPATAN',2,'4000',false],
      ['5000','Beban','BEBAN',1,null,true],
      ['5100','Beban Operasional','BEBAN',2,'5000',false],
      ['5200','Beban Penyusutan','BEBAN',2,'5000',false],
      ['5300','Beban Bunga','BEBAN',2,'5000',false],
      ['9000','SHU','SHU',1,null,true]
    ].map((c) => ({ id:'coa'+c[0], kode_akun:c[0], nama_akun:c[1], kategori:c[2], sub_kategori:'', saldo_normal:(c[2]==='KEWAJIBAN'||c[2]==='EKUITAS'||c[2]==='PENDAPATAN'||c[2]==='SHU')?'kredit':'debit', level:c[3], parent_id:c[4]?('coa'+c[4]):null, is_active:true, is_header:c[5] }));
    await insertRows('chart_of_accounts', ['id','kode_akun','nama_akun','kategori','sub_kategori','saldo_normal','level','parent_id','is_active','is_header'], coaRows);

    const periodRows = [];
    let pidPer = 1;
    for (let y = 2024; y <= 2026; y++) {
      for (let m = 1; m <= 12; m++) {
        if (y === 2026 && m > 7) break;
        const start = D(y, m, 1);
        const end = new Date(y, m, 0);
        periodRows.push({ id:'prd' + String(pidPer++).padStart(3,'0'), tahun:y, bulan:m, nama_periode:BULAN[m-1] + ' ' + y, tanggal_mulai:start, tanggal_selesai:end, is_open:(y===2026 && m>=7), is_closed:(y<2026)||(y===2026&&m<7) });
      }
    }
    await insertRows('accounting_periods', ['id','tahun','bulan','nama_periode','tanggal_mulai','tanggal_selesai','is_open','is_closed'], periodRows);

    // journal entries (derived from transactions)
    const jrId = tid('jr'); const jrRows = [];
    const jrn = (tgl, ket, sumber, dtls) => {
      const d = Math.round(dtls.reduce((s,x)=>s+(x.debit||0),0));
      const k = Math.round(dtls.reduce((s,x)=>s+(x.kredit||0),0));
      jrRows.push({ id:jrId(), no_jurnal:'JU-' + fmt(tgl).replace(/-/g,'') + '-' + String(jrRows.length+1).padStart(4,'0'), tanggal:tgl, keterangan:ket, sumber, debit:d, kredit:k, details:dtls });
    };
    jrn(D(2024,1,1), 'Saldo awal pembukuan koperasi', 'opening', [
      { kode_akun:'3100', nama_akun:'Simpanan Pokok Anggota', debit:0, kredit:40000000 },
      { kode_akun:'1102', nama_akun:'Kas Bank Mandiri', debit:40000000, kredit:0 }
    ]);
    for (const pj of penjualanRows) {
      jrn(pj.tanggal, 'Penjualan ' + pj.no_faktur, 'penjualan', [
        { kode_akun:'1101', nama_akun:'Kas Kecil', debit:pj.total, kredit:0 },
        { kode_akun:'4300', nama_akun:'Pendapatan Penjualan', debit:0, kredit:pj.total - (pj.diskon||0) },
        { kode_akun:'5100', nama_akun:'Beban Operasional', debit:pj.diskon||0, kredit:0 }
      ]);
    }
    for (const pj of pinjamanRows) {
      if ((pj.status === 'dicairkan' || pj.status === 'lunas') && pj.tanggal_cair) {
        jrn(pj.tanggal_cair, 'Pencairan pinjaman ' + pj.no_pinjaman, 'pinjaman', [
          { kode_akun:'1150', nama_akun:'Piutang Simpan Pinjam', debit:pj.pokok, kredit:0 },
          { kode_akun:'1102', nama_akun:'Kas Bank Mandiri', debit:0, kredit:pj.pokok }
        ]);
      }
    }
    for (const vi of viRows) {
      jrn(vi.tanggal_investasi, 'Investasi ventura ' + vi.nama_perusahaan, 'ventura', [
        { kode_akun:'1190', nama_akun:'Investasi Ventura', debit:vi.nominal_investasi, kredit:0 },
        { kode_akun:'1102', nama_akun:'Kas Bank Mandiri', debit:0, kredit:vi.nominal_investasi }
      ]);
    }
    for (const st of simpananRows.filter((x)=>x.tipe==='setor')) {
      jrn(st.tanggal, 'Setoran simpanan ' + st.anggota_nama, 'simpanan', [
        { kode_akun:'1101', nama_akun:'Kas Kecil', debit:st.jumlah, kredit:0 },
        { kode_akun:'2100', nama_akun:'Simpanan Anggota', debit:0, kredit:st.jumlah }
      ]);
    }
    await insertRows('journal_entries', ['id','no_jurnal','tanggal','keterangan','sumber','debit','kredit','details'], jrRows);

    const jaId = tid('ja'); const jaRows = [];
    for (const jr of jrRows) {
      jaRows.push({ id:jaId(), jurnal_id:jr.id, status:'posted', created_by:'1', created_at:new Date(jr.tanggal.getTime()), approved_by:'1', approved_at:new Date(jr.tanggal.getTime()), reversed_by:null, reversed_at:null, notes:'Otomatis diposting oleh seed.' });
    }
    await insertRows('journal_approvals', ['id','jurnal_id','status','created_by','created_at','approved_by','approved_at','reversed_by','reversed_at','notes'], jaRows);

    // ===== Landing CMS =====
    console.log('▶ Landing CMS & pengumuman/tiket...');
    await insertRows('landing_settings', ['id','koperasi_name','koperasi_tagline','primary_color','secondary_color','logo_url','favicon_url','is_published'], [
      { id:'landing_main', koperasi_name:'KSP MetroMitra', koperasi_tagline:'Sistem Informasi Koperasi Simpan Pinjam Terintegrasi', primary_color:'#2563eb', secondary_color:'#d97706', logo_url:'', favicon_url:'', is_published:true }
    ]);
    await insertRows('landing_hero', ['id','badge_text','headline','subheadline','cta_primary_text','cta_primary_link','cta_secondary_text','cta_secondary_link','background_type','bg_image_url','is_active'], [
      { id:'hero_main', badge_text:'Platform Koperasi Digital #1', headline:'Kelola Koperasi Simpan Pinjam Jadi Mudah & Profesional', subheadline:'Satu platform terintegrasi untuk anggota, simpanan, pinjaman, akuntansi, unit usaha, dan ventura berbasis AI.', cta_primary_text:'Coba Demo', cta_primary_link:'/login', cta_secondary_text:'Lihat Fitur', cta_secondary_link:'#fitur', background_type:'gradient', bg_image_url:'', is_active:true }
    ]);
    await insertRows('landing_features', ['id','icon_name','title','description','sort_order','is_active'], [
      { id:'lf1', icon_name:'Users', title:'Manajemen Anggota', description:'Kelola anggota, 4 jenis simpanan, dan mutasi rekening real-time.', sort_order:1, is_active:true },
      { id:'lf2', icon_name:'DollarSign', title:'Pinjaman 3 Metode', description:'Flat, Efektif, dan Anuitas dengan angsuran otomatis.', sort_order:2, is_active:true },
      { id:'lf3', icon_name:'BookOpen', title:'Akuntansi SAK ETAP', description:'Jurnal otomatis, COA, buku besar, dan laporan keuangan.', sort_order:3, is_active:true },
      { id:'lf4', icon_name:'ShoppingCart', title:'POS Retail & Toko', description:'Stok, supplier, kasir penjualan, dan laba-rugi real-time.', sort_order:4, is_active:true },
      { id:'lf5', icon_name:'Smartphone', title:'PPOB & Digital Payment', description:'Pulsa, listrik, PDAM, BPJS, Virtual Account, top-up.', sort_order:5, is_active:true },
      { id:'lf6', icon_name:'TrendingUp', title:'Ventura & AI Audit', description:'Investasi ventura, dividen, dan audit risiko AI Gemini.', sort_order:6, is_active:true }
    ]);
    await insertRows('landing_team', ['id','name','position','photo_url','sort_order'], [
      { id:'tm1', name:'Ir. H. Supriyanto, M.M.', position:'Ketua Pengurus', photo_url:'', sort_order:1 },
      { id:'tm2', name:'Riana Safitri, S.E.', position:'Bendahara', photo_url:'', sort_order:2 },
      { id:'tm3', name:'Drs. H. Mulyono', position:'Sekretaris', photo_url:'', sort_order:3 }
    ]);
    await insertRows('landing_testimonials', ['id','name','position','content','avatar_url','rating','sort_order'], [
      { id:'ts1', name:'Budi Santoso', position:'Anggota Sejak 2022', content:'Aplikasi sangat membantu mengelola simpanan dan pinjaman saya dengan mudah.', avatar_url:'', rating:5, sort_order:1 },
      { id:'ts2', name:'Siti Rahmawati', position:'Pedagang Anggota', content:'Fitur PPOB dan toko menguntungkan usaha saya setiap hari.', avatar_url:'', rating:5, sort_order:2 },
      { id:'ts3', name:'Hendra Wijaya', position:'Pengusaha UMKM', content:'Pembiayaan ventura berbasis AI cepat dan transparan.', avatar_url:'', rating:4, sort_order:3 }
    ]);
    await insertRows('landing_pricing', ['id','plan_name','price_label','price_amount','description','is_popular','features','cta_text','cta_link','sort_order'], [
      { id:'pr1', plan_name:'Paket Starter', price_label:'Gratis', price_amount:'0', description:'Untuk koperasi pemula.', is_popular:false, features:['Anggota & Simpanan','Pinjaman Dasar'], cta_text:'Mulai', cta_link:'#', sort_order:1 },
      { id:'pr2', plan_name:'Paket Pro', price_label:'Rp 299rb/bln', price_amount:'299000', description:'Untuk koperasi berkembang.', is_popular:true, features:['Semua modul','POS & PPOB','Akuntansi'], cta_text:'Pilih Pro', cta_link:'#', sort_order:2 },
      { id:'pr3', plan_name:'Paket Enterprise', price_label:'Kustom', price_amount:'Kustom', description:'Untuk koperasi besar.', is_popular:false, features:['Ventura AI','Multi-cabang','Prioritas'], cta_text:'Hubungi', cta_link:'#', sort_order:3 }
    ]);
    await insertRows('landing_contact', ['id','email','phone','whatsapp','address','office_hours','map_embed_url','footer_description','social_facebook','social_twitter','social_instagram','social_youtube'], [
      { id:'contact_main', email:'info@metromitra.co.id', phone:'(021) 789-0123', whatsapp:'6281234567890', address:'Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan', office_hours:'Senin-Jumat 08:00-17:00', map_embed_url:'', footer_description:'Koperasi simpan pinjam digital terpercaya.', social_facebook:'', social_twitter:'', social_instagram:'', social_youtube:'' }
    ]);

    // pengumuman & tiket_bantuan
    await insertRows('pengumuman', ['id','judul','konten','tipe','target','tanggal_mulai','tanggal_selesai','status'], [
      { id:'pg01', judul:'Jadwal RAT Tahunan 2026', konten:'Rapat Anggota Tahunan akan dilaksanakan pada Maret 2026. Mohon kehadiran seluruh anggota.', tipe:'pengumuman', target:'semua', tanggal_mulai:D(2026,2,1), tanggal_selesai:D(2026,3,15), status:'aktif' },
      { id:'pg02', judul:'Promo Bunga Simpanan Sukarela', konten:'Nikmati bunga tambahan untuk setoran sukarela di bulan ini.', tipe:'promo', target:'anggota', tanggal_mulai:D(2026,6,1), tanggal_selesai:D(2026,6,30), status:'aktif' },
      { id:'pg03', judul:'Pemeliharaan Sistem', konten:'Sistem akan maintenance pada Minggu dini hari. Mohon maaf atas ketidaknyamanan.', tipe:'pengumuman', target:'semua', tanggal_mulai:D(2026,7,1), tanggal_selesai:D(2026,7,2), status:'aktif' }
    ]);
    const tkId = tid('tk'); const tiketRows = [];
    const subjekList = ['Tidak bisa login','Cara mencairkan pinjaman','Mutasi simpanan tidak muncul','Error saat bayar PPOB','Upload bukti transfer'];
    for (let i = 0; i < 8; i++) {
      const a = pick(anggotaRows);
      tiketRows.push({ id:tkId(), anggota_id:a.id, anggota_nama:a.nama, subjek:pick(subjekList), pesan:'Saya butuh bantuan mengenai ' + pick(subjekList).toLowerCase() + '.', kategori:pick(['Simpanan','Pinjaman','Toko','Aplikasi','Lainnya']), prioritas:pick(['Rendah','Sedang','Tinggi']), tanggal:rdate(D(2026,1,1), today), status:pick(['Terbuka','Diproses','Selesai']), balasan_admin:chance(0.3)?'Terima kasih, silakan cek menu terkait.':'' });
    }
    await insertRows('tiket_bantuan', ['id','anggota_id','anggota_nama','subjek','pesan','kategori','prioritas','tanggal','status','balasan_admin'], tiketRows);

    console.log('✅ Seed selesai.');
  } catch (e) {
    console.error('❌ ERROR:', e.message);
    console.error(e.stack);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('▶ Koneksi ditutup.');
  }
})();