# Draft Perjanjian Kerahasiaan (Non-Disclosure Agreement / NDA)
## MetroCoop — Sistem Informasi Koperasi Terintegrasi

---

**VERSI:** 1.0  
**TANGGAL:** Juli 2026  
**STATUS:** Draft untuk Negosiasi  
**KLASIFIKASI:** Konfidensial

---

## PIHAK-PIHAK

**PIHAK PERTAMA (Pemberi Informasi / Disclosing Party):**

| | |
|---|---|
| **Nama Entitas** | Koperasi Simpan Pinjam [NAMA KOPERASI ANDA] |
| **Bentuk Hukum** | Koperasi Simpan Pinjam (KSP) |
| **Nomor Badan Hukum** | [AHU-XXXXXX.AH.01.XX.TAHUN-XXXX] |
| **Nomor Izin Usaha** | [SITU-XXX/XXX/KPPT/XXXX] |
| **Alamat** | [ALAMAT LENGKAP KOPERASI] |
| **Dewan Pengurus** | Ketua: [NAMA], Bendahara: [NAMA], Sekretaris: [NAMA] |
| **Diwakili Oleh** | [NAMA PEWAKIL], selaku [JABATAN] |
| **Dasar Hukum** | SK Pengurus No. [NOMOR] tanggal [TANGGAL] |

**PIHAK KEDUA (Penerima Informasi / Receiving Party):**

| | |
|---|---|
| **Nama Entitas** | PT Metro Mitra Digital (MetroCoop) |
| **Bentuk Hukum** | Perseroan Terbatas |
| **Nomor AKTA Pendirian** | AHU-XXXXXX.AH.01.XX.TAHUN-202X |
| **NPWP** | XX.XXX.XXX.X-XXX.XXX |
| **Alamat** | Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan 12120 |
| **Diwakili Oleh** | [NAMA DIREKTUR], selaku Direktur Utama |
| **Dasar Hukum** | AKTA Perusahaan & SK Direksi No. [NOMOR] tanggal [TANGGAL] |

**KEDUANYA DISAMAAN SEBUT "PIHAK" DAN SECARA INDIVIDU "PIHAK".**

---

## LATAR BELAKANG

**BAHWA:**

1. Pihak Pertama berencana mengembangkan / mengimplementasikan **Sistem Informasi Koperasi Terintegrasi (MetroCoop)** untuk mengelola operasional keanggotaan, simpanan, pinjaman, akuntansi, unit usaha, dan pelaporan;

2. Dalam rangka evaluasi kelayakan, perancangan solusi, dan/atau pelaksanaan proyek, Pihak Pertama perlu membagikan **Informasi Konfidensial** meliputi data anggota, transaksi keuangan, proses bisnis internal, dokumen legal, dan strategi organisasi kepada Pihak Kedua;

3. Pihak Kedua bersedia menerima dan memproses Informasi Konfidensial tersebut **hanya untuk keperluan proyek MetroCoop** dan berkomitmen menjaga kerahasiaannya;

4. Kedua Pihak sepakat mengikatkan diri dalam **Perjanjian Kerahasiaan (NDA)** ini.

---

## DEFINISI

| Istilah | Definisi |
|---------|----------|
| **Informasi Konfidensial** | Semua informasi non-publik, baik tertulis, lisan, elektronik, visual, maupun dalam bentuk apapun, yang diungkapkan oleh Pihak Pertama kepada Pihak Kedua (atau sebaliknya) sehubungan dengan proyek ini, termasuk tapi tidak terbatas pada: data anggota (NIK, nama, alamat, penghasilan, saldo), transaksi simpanan/pinjaman, jurnal akuntansi, laporan keuangan, struktur organisasi, dokumen legal (AKTA, SK, izin), strategi bisnis, rencana ekspansi, data karyawan/pengurus, kode sumber (source code) custom, credential sistem, API keys, dan analisis risiko kredit. |
| **Informasi Terbuka** | Informasi yang: (a) sudah publik sebelum diungkapkan; (b) menjadi publik tanpa kesalahan Pihak Penerima; (c) diterima dari pihak ketiga yang berhak membagikannya tanpa pelanggaran NDA; (d) dikembangkan independen oleh Pihak Penerima tanpa menggunakan Informasi Konfidensial. |
| **Tujuan** | Evaluasi kelayakan, perancangan arsitektur, pengembangan, testing, deployment, pelatihan, dan dukungan sistem MetroCoop bagi Pihak Pertama. |
| **Periode Rahasia** | 3 (tiga) tahun terhitung dari tanggal berakhirnya proyek atau berakhirnya hubungan kerja sama, mana yang lebih lama. Untuk **data pribadi anggota (PII)** dan **rahasia dagang**, berlaku **selamanya** (indefinite) sebagaimana diatur UU PDP dan UU Rahasia Dagang. |
| **Proyek** | Pengembangan & implementasi sistem MetroCoop untuk Pihak Pertama, termasuk fase: discovery, design, development, UAT, go-live, dan warranty support. |

---

## PASAL 1: KEWAJIBAN KERAHASIAAN

### 1.1 Perlindungan Informasi
Pihak Kedua wajib:
- **(a)** Menjaga kerahasiaan Informasi Konfidensial dengan standar perlindungan **minimal setara** dengan perlindungan informasi rahasia sendiri, namun tidak kurang dari **standar wajar (reasonable care)**;
- **(b)** **TIDAK** mengungkapkan, membagikan, menyalin, mereproduksi, memodifikasi, atau mendistribusikan Informasi Konfidensial kepada pihak ketiga manapun tanpa persetujuan tertulis Pihak Pertama;
- **(c)** Membatasi akses Informasi Konfidensial hanya kepada **personel yang benar-benar perlu tahu (need-to-know basis)** yang: (i) terikat kewajiban kerahasiaan setara NDA ini; (ii) telah menandatangani pernyataan kerahasiaan individual; (iii) dilatih prosedur keamanan data.

### 1.2 Penggunaan Terbatas
Informasi Konfidensial **HANYA** boleh digunakan untuk **Tujuan** sebagaimana didefinisikan di atas. Dilarang keras menggunakan informasi untuk:
- Kepentingan komersial Pihak Kedua sendiri (termasuk pengembangan produk lain)
- Analisis kompetitif terhadap Pihak Pertama
- Pemasaran ke klien lain tanpa anonimisasi agregat & persetujuan
- Pelatihan model AI/ML eksternal tanpa anonimisasi & persetujuan tertulis

### 1.3 Keamanan Teknis & Organisatorial
Pihak Kedua menerapkan minimal:
| Tindakan | Detail |
|----------|--------|
| **Enkripsi** | AES-256 at rest, TLS 1.3 in transit untuk semua data Pihak Pertama |
| **Access Control** | RBAC, MFA wajib untuk sistem production, principle of least privilege |
| **Audit Log** | Log akses (read/write/delete) disimpan minimal 1 tahun, tamper-evident |
| **Backup** | Enkripsi backup, offsite, tested restore quarterly |
| **Personel** | Background check karyawan akses production, NDA individual, training keamanan tahunan |
| **Insiden** | Prosedur breach notification < 24 jam ke Pihak Pertama & otoritas (UU PDP) |

---

## PASAL 2: EKSEPSI KEWAJIBAN

Kewajiban kerahasiaan **TIDAK BERLAKU** untuk informasi yang:
1. Sudah menjadi milik publik **sebelum** diungkapkan;
2. Menjadi publik **tanpa kesalahan** Pihak Penerima;
3. Diterima dari **pihak ketiga berhak** tanpa pelanggaran kewajiban rahasia;
4. Dikembangkan **independen** tanpa referensi Informasi Konfidensial (dibuktikan bukti dokumentasi);
5. **Wajib diungkapkan** oleh hukum/peraturan/pengadilan/otoritas — **SYARATNYA**: Pihak Penerima segera memberitahu Pihak Pemberi (kecuali dilarang hukum) dan memberikan kesempatan mengajukan upaya hukum/protective order.

---

## PASAL 3: PERLINDUNGAN DATA PRIBADI (UU PDP COMPLIANCE)

### 3.1 Peran Pihak
- **Pihak Pertama** = **Pengendali Data Pribadi (Data Controller)**
- **Pihak Kedua** = **Prosesor Data Pribadi (Data Processor)**

### 3.2 Kewajiban Khusus Pihak Kedua (Processor)
- Memproses data pribadi **hanya sesuai instruksi tertulis** Pihak Pertama (termasuk NDA ini & DPA terpisah jika perlu)
- **TIDAK** menggunakan data pribadi untuk tujuan sendiri (profiling, marketing, AI training)
- Mengimplementasikan **teknis & organisatoris** per Pasal 1.3 & UU PDP
- Membantu Pihak Pertama memenuhi **hak subjek data** (akses, koreksi, hapus, portabilitas, keberatan)
- **Breach Notification**: Maksimal **24 jam** setelah mengetahui pelanggaran data pribadi
- **Sub-processor**: Hanya dengan persetujuan tertulis sebelumnya Pihak Pertama (daftar sub-processor lampiran)
- **Transfer Lintas Batas**: Hanya ke negara dengan proteksi setara / SCC / persetujuan subjek data

### 3.3 Penghapusan/Pengembalian Data
Pada berakhirnya proyek atau permintaan Pihak Pertama, Pihak Kedua:
- Menghapus **secara permanen & terverifikasi** (NIST 800-88) semua data pribadi dari sistem production, staging, backup, log, dan environment development
- Menyediakan **sertifikat penghapusan** tertulis
- **Eksepsi**: Data yang wajib disimpan hukum (pajak 10 tahun, AML 5 tahun) — diarsipkan terpisah, enkripsi, akses terbatas, dihapus setelah masa retensi hukum

---

## PASAL 4: HAK KEPEMILIKAN INTELEKTUAL

### 4.1 Kepemilikan Data & Konten
Semua **data, konten, laporan, analisis, dokumen** yang berasal dari Pihak Pertama (termasuk data anggota, transaksi, konfigurasi koperasi) **KEMILIKAN SEPENUHNYA PIHAK PERTAMA**. Pihak Kedua tidak memperoleh hak apapun kecuali lisensi terbatas untuk Tujuan.

### 4.2 Source Code & IP Sistem MetroCoop
- **Core Platform MetroCoop** (framework, library, UI components, arsitektur dasar) = **Hak Kekayaan Intelektual Pihak Kedua** (MetroCoop).
- **Customisasi & Konfigurasi Khusus Koperasi** (custom module, report, workflow, integration config) yang dibayar penuh oleh Pihak Pertama = **Hak Pihak Pertama** (work for hire) — diserahkan source code & dokumentasi penuh saat go-live / akhir kontrak.
- **Lisensi Core Platform**: Pihak Pertama mendapat **lisensi non-eksklusif, perpetual, worldwide, royalty-free** untuk menggunakan Core Platform MetroCoop untuk operasional koperasi mereka sendiri, termasuk hak memodifikasi untuk keperluan internal (tidak untuk redistribusi/SaaS ke pihak ketiga).

### 4.3 Feedback & Improvements
Saran, bug report, feature request, atau improvement dari Pihak Pertama yang dimasukkan ke Core Platform MetroCoop menjadi **hak Pihak Kedua**, tanpa kewajiban royalti/kompensasi ke Pihak Pertama.

---

## PASAL 5: PERIODE BERLAKU & PENGHENTIAN

### 5.1 Periode Berlaku
NDA ini berlaku mulai **tanggal penandatanganan** hingga **berakhirnya Periode Rahasia** (Pasal Definisi).

### 5.2 Pengembalian/Penghancuran Informasi
Pada berakhirnya proyek atau permintaan tertulis Pihak Pertama, dalam **14 hari kerja** Pihak Kedua:
- Mengembalikan **semua** dokumen fisik & media penyimpanan berisi Informasi Konfidensial
- Menghapus permanen semua salinan elektronik (termasuk backup, staging, dev env, log) — **terverifikasi**
- Menyediakan **Surat Pernyataan Penghancuran/Kembalian** ditandatangani pejabat berwenang

### 5.3 Survival Clause
Kewajiban Pasal 1, 3, 4, 6, 7, 8, 9 **tetap berlaku** setelah berakhirnya NDA ini.

---

## PASAL 6: SANKSI & GANTI RUGI

### 6.1 Denda Pelanggaran
Setiap pelanggaran NDA ini membebankan **denda tetap (liquidated damages)** sebesar:
> **Rp 500.000.000 (Lima Ratus Juta Rupiah) per insiden pelanggaran**
> **+ ganti rugi aktual** (termasuk biaya hukum, investigasi forensik, notifikasi, kerugian reputasi, denda regulasi)

> **Catatan**: Denda ini **bukan** batas maksimal ganti rugi. Pihak Pertama berhak menuntut ganti rugi **melebihi** jumlah ini jika kerugian aktual lebih besar.

### 6.2 Injunctive Relief
Pihak Pertama berhak mengajukan **gugatan penghentian (injunction)** ke Pengadilan Negeri Jakarta Selatan tanpa harus membuktikan kerugian finansial, mengakui kerugian tidak terukur dengan uang.

### 6.3 Tanggung Jawab Karyawan/Agen
Pihak Kedua **bertanggung jawab penuh** atas pelanggaran oleh karyawan, kontraktor, sub-kontraktor, konsultan, atau afiliasinya. Pihak Kedua wajib memastikan mereka terikat kewajiban setara NDA ini.

---

## PASAL 7: PENYELESAIAN SENGKETA

### 7.1 Musyawarah
Kedua Pihak berusaha menyelesaikan sengketa melalui **musyawarah mufakat** maksimal **30 hari** sejak surat pemberitahuan sengketa.

### 7.2 Mediasi
Jika musyawarah gagal, diselesaikan melalui **mediasi** di **Lembaga Mediasi Pengadilan Negeri Jakarta Selatan** atau lembaga mediasi terakreditasi lain yang disepakati.

### 7.3 Litigasi
Jika mediasi gagal, diselesaikan di **Pengadilan Negeri Jakarta Selatan** dengan hukum Indonesia.

### 7.4 Hukum Berlaku
**Hukum Republik Indonesia** (termasuk UU No. 27/2022 PDP, UU No. 30/2000 Rahasia Dagang, KUH Perdata, UU Koperasi).

---

## PASAL 8: KETENTUM UMUM

| Klausul | Isi |
|---------|-----|
| **8.1 Penugasan (Assignment)** | Tidak boleh mentransfer hak/kewajiban tanpa persetujuan tertulis Pihak lain, kecuali ke afiliasi (dengan notifikasi 14 hari & afiliasi terikat NDA ini). |
| **8.2 Pemisahan (Severability)** | Jika bagian mana batal, bagian lain tetap berlaku. Pihak mengganti klausul batal dengan yang valid & mendekati niat asli. |
| **8.3 Tidak Ada Penghapusan Hak (No Waiver)** | Ketidakberlakuan hak sekali/tidak berarti penghapusan hak. Penghapusan hak harus tertulis. |
| **8.4 Seluruh Perjanjian (Entire Agreement)** | NDA ini menggantikan semua perjanjian/sepakatan sebelumnya (lisan/tertulis) soal kerahasiaan. Perubahan hanya sah jika tertulis & ditandatangani. |
| **8.5 Salinan (Counterparts)** | Dapat ditandatangani dalam beberapa salinan (termasuk digital/e-signature), masing-masing sah sebagai asli. |
| **8.6 Notifikasi** | Surat resmi via email resmi + kurir ke alamat di atas. Berlaku saat diterima (bukti kurir/read receipt email). |
| **8.7 Bahasa** | Bahasa Indonesia mengikat. Terjemahan Inggris hanya referensi. |
| **8.8 Force Majeure** | Pihak dibebaskan kewajiban selama force majeure (bencana alam, perang, pandemi, regulasi baru) dengan notifikasi 7 hari. Kewajiban kerahasiaan **TIDAK** dibebaskan oleh force majeure. |

---

## PASAL 9: TANDA TANGAN

**Dibuat dalam 2 (dua) salinan bermaterai cukup, masing-masing mempunyai kekuatan hukum yang sama, setelah dibaca dan dipahami dengan sepenuhnya.**

| | **PIHAK PERTAMA**<br>Koperasi Simpan Pinjam [NAMA KOPERASI] | **PIHAK KEDUA**<br>PT Metro Mitra Digital (MetroCoop) |
|---|---|---|
| **Nama** | [NAMA KETUA PENGURUS] | [NAMA DIREKTUR UTAMA] |
| **Jabatan** | Ketua Pengurus | Direktur Utama |
| **Tanda Tangan** | | |
| **Tanggal** | [TANGGAL], 202[ ] | [TANGGAL], 202[ ] |
| **Materai** | [Rp 10.000] | [Rp 10.000] |

---

### SAKSI 1 (Pihak Pertama)

| Nama | [NAMA SAKSI 1] |
|------|----------------|
| NIK | [NIK SAKSI 1] |
| Alamat | [ALAMAT SAKSI 1] |
| Tanda Tangan | |
| Tanggal | |

### SAKSI 2 (Pihak Kedua)

| Nama | [NAMA SAKSI 2] |
|------|----------------|
| NIK | [NIK SAKSI 2] |
| Alamat | [ALAMAT SAKSI 2] |
| Tanda Tangan | |
| Tanggal | |

---

## LAMPIRAN

### Lampiran A: Daftar Sub-Processor (Contoh)
| Sub-Processor | Layanan | Lokasi Data | Alasan |
|---------------|---------|-------------|--------|
| Railway.app | Hosting PostgreSQL & Container | Singapura / US | Managed infrastructure |
| Google Cloud (Gemini API) | AI Credit Scoring | Singapura / US | LLM inference |
| Cloudflare | CDN, DNS, WAF | Global (edge) | Performance & security |
| Resend / SendGrid | Email Transaksional | Singapura / US | Notifikasi & OTP |
| WhatsApp Business API (Meta/BSSP) | Notifikasi WA | Singapura | Komunikasi anggota |

> *Daftar final disepakati terpisah & diperbarui berkala dengan notifikasi 14 hari.*

### Lampiran B: Data Processing Addendum (DPA) — Ringkasan
Jika diperlukan, DPA terpisah mengikat sebagai **Data Processing Agreement** per UU PDP Pasal 28, mencakup: subjek data, kategori data, tujuan pemrosesan, durasi, hak & kewajiban controller/processor, tindakan keamanan, sub-processor, transfer lintas batas, audit rights, breach notification, penghapusan data.

### Lampiran C: Pernyataan Kerahasiaan Individual (Contoh)
> "Saya, [NAMA], NIK [NIK], sebagai [JABATAN] di PT Metro Mitra Digital, menyatakan telah membaca, memahami, dan mengikatkan diri pada NDA No. [NOMOR] tanggal [TANGGAL] antara Koperasi [NAMA] dan PT Metro Mitra Digital. Saya berkomitmen menjaga kerahasiaan semua Informasi Konfidensial yang saya akses sehubungan dengan proyek MetroCoop, selama masa kerja dan setelahnya, sesuai ketentuan NDA tersebut."

---

**— AKHIR DARI DRAFT NDA —**

*Catatan: Draft ini untuk keperluan negosiasi. Sebelum ditandatangani, disarankan ditinjau oleh hukum masing-masing Pihak. Klause spesifik (jurisdiksi, denda, periode, sub-processor) dapat disesuaikan kesepakatan bersama.*