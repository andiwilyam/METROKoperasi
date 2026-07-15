# Dokumen Kebutuhan Bisnis (BRD/URS)
## Sistem Informasi Koperasi Simpan Pinjam (KSP) — MetroCoop
**Versi Regulatif: Sesuai UU No. 17 Tahun 2012, POJK Koperasi, SAK ETAP, UU PDP**

---

### 1. Latar Belakang & Dasar Hukum

| Regulasi | Relevansi untuk Sistem |
|----------|------------------------|
| **UU No. 17 Tahun 2012** tentang Koperasi | Dasar utama: keanggotaan, modal, pengurus, pengawas, RAT, SHU, sanksi |
| **POJK No. 12/POJK.03/2018** (dan amandemennya) tentang KSP | Prinsip kehati-hatian, KPMM, Kolektibilitas, Pelaporan ke OJK |
| **POJK No. 70/POJK.03/2019** tentang Laku Pandai | Inklusi keuangan, layanan digital, e-KYC |
| **SEOJK No. 14/SEOJK.03/2019** | Standar Pelaporan KSP ke OJK (LKP, BMPK, dll) |
| **SAK ETAP** (PSAK 70) | Standar akuntansi: COA, Jurnal, Neraca, Laba Rugi, Arus Kas, Catatan atas LK |
| **UU No. 27 Tahun 2022** (PDP) | Perlindungan data pribadi anggota, consent, DPO, breach notification |
| **UU ITE (UU 11/2008 jo UU 1/2024)** | Transaksi elektronik, tanda tangan digital, bukti elektronik |

---

### 2. Pemetaan Proses Bisnis ke Regulasi

#### 2.1 Keanggotaan (Pasal 34-39 UU 17/2012)
| Proses | Aturan Regulatif | Implementasi Sistem |
|--------|------------------|---------------------|
| **Syarat Jadi Anggota** | WNI, berumur ≥17 th / sudah menikah, bertempat tinggal/berusaha di wilayah kerja | Validasi NIK (Dukcapil), cek umur otomatis, cek wilayah kode pos |
| **Hak & Kewajiban** | Pasal 36-37: Hak suara, hak SHU, kewajiban setor modal | Role-based access: Anggota punya akses portal, voting e-RAT |
| **Ketentuan Keluar** | Pasal 38: Pengunduran diri, meninggal, PHK, dikeluarkan | Workflow keluar: hitung saldo, kembalikan modal (Pokok), blokir akses |
| **Buku Anggota** | Wajib ada buku daftar anggota (Pasal 39) | Master data digital + audit trail, export PDF untuk keperluan hukum |

#### 2.2 Modal & Simpanan (Pasal 40-43 UU 17/2012)
| Jenis | Regulasi | Aturan Sistem |
|-------|----------|---------------|
| **Modal Pokok** | Pasal 40: Setoran wajib saat daftar, tidak bisa ditarik selagi jadi anggota | Lock saldo pokok saat aktif, auto-return saat keluar |
| **Simpanan Wajib** | Pasal 41: Berlaku sebagai jaminan pinjaman, setoran berkala | Validasi pinjaman: cek kelengkapan simpanan wajib min. 3-6 bln terakhir |
| **Simpanan Sukarela** | Pasal 42: Bisa ditarik kapan saja, mendapat jasa/bunga | Bunga harian (daily balance) / bulanan, hitung otomatis per SEOJK |
| **Deposito** | Pasal 43: Berjangka, bunga lebih tinggi, penalti tarik sebelum tempo | Konfigurasi tenor & rate, auto-rollover, penalty calc otomatis |

#### 2.3 Pinjaman & Prinsip Kehati-hatian (POJK 12/2018)
| Aspek | Regulasi | Implementasi Sistem |
|-------|----------|---------------------|
| **Plafon Maksimal** | Pasal 14 POJK: Maks 20% Modal Sendiri per debitur (bisa naik jadi 25% dgn syarat) | Auto-check plafon per anggota vs modal koperasi, hard-stop di API |
| **Kolektibilitas** | SEOJK: Lancar (1), DPK (2), Kurang Lancar (3), Diragukan (4), Macet (5) | Scheduler harian update status berdasarkan hari tunggakan |
| **Cadangan Kerugian (CKPN)** | PSAK 71 / POJK: Minimum cadangan per kolektibilitas | Auto-calculate CKPN bulanan, jurnal otomatis ke Beban CKPN |
| **Analisis 5C** | Prinsip Kehati-hatian: Character, Capacity, Capital, Collateral, Condition | **AI Credit Scoring** (Gemini) generate skor 0-100 + rekomendasi |
| **Denda Tunggakan** | SEOJK: Maks 2%/bulan dari pokok tunggakan (bukan compound) | Konfigurasi rate denda, kalkulasi harian, cap maksimal per regulasi |
| **Restrukturisasi** | POJK: Diizinkan dengan syarat, tidak reset kolektibilitas otomatis | Workflow restruktur: approval pengawas, simpan history kolektibilitas lama |

#### 2.4 Pengurus & Pengawas (Pasal 45-52 UU 17/2012)
| Peran | Regulasi | Mapping Role Sistem |
|-------|----------|---------------------|
| **Ketua** | Menjalankan RAT, menandatangani laporan | Superadmin / Admin Utama: approve laporan OJK, e-sign dokumen |
| **Bendahara** | Mengelola keuangan, kas | Operator Keuangan: validasi transaksi > threshold, manage kas |
| **Sekretaris** | Administrasi, buku anggota | Admin Data: manage master anggota, dokumen legal |
| **Pengawas** | Mengawasi pengurus, audit internal | Role **Pengawas** (read-only + audit trail access, export laporan) |

#### 2.5 RAT & SHU (Pasal 53-58 UU 17/2012)
| Proses | Regulasi | Fitur Sistem |
|--------|----------|--------------|
| **RAT Tahunan** | Maks 6 bln setelah akhir tahun buku | Modul **e-RAT**: agenda, undangan digital, voting online, risalah otomatis |
| **Penggunaan SHU** | Prioritas: Cadangan (min 10%), Pendidikan (max 5%), Jasa Modal, SHU Anggota | Wizard alokasi SHU dengan validasi persentase wajib |
| **Pembagian SHU** | Berdasarkan jasa modal (simpanan) & jasa usaha (transaksi) | Kalkulasi otomatis per anggota, generate SLIP SHU digital |

#### 2.6 Akuntansi & Pelaporan (SAK ETAP / PSAK 70 / SEOJK)
| Laporan | Standar | Frekuensi | Fitur Sistem |
|---------|---------|-----------|--------------|
| **Neraca** | PSAK 70 | Bulanan/Tahunan | Auto-generate dari COA hierarchical, format OJK |
| **Laporan Laba Rugi** | PSAK 70 | Bulanan/Tahunan | Termasuk SHU, pembagian SHU, pajak |
| **Laporan Arus Kas** | PSAK 70 (Metode Langsung) | Tahunan | Auto dari jurnal kas/bank |
| **Catatan Atas LK** | PSAK 70 | Tahunan | Template terisi otomatis (kebijakan akuntansi, related party, dll) |
| **LKP (Laporan Keuangan Penyelesaian)** | SEOJK 14 | Bulanan (OJK) | Export XML/JSON sesuai skema OJK (XBRL-ready) |
| **BMPK (Bukti Mutasi Penempatan Kas)** | SEOJK | Bulanan | Auto dari transaksi kas/bank + investasi |
| **Laporan Kolektibilitas** | SEOJK | Bulanan | Per debitur & agregat, dengan CKPN |

#### 2.7 Unit Usaha Koperasi (Pasal 7 UU 17/2012)
| Unit | Regulasi Spesifik | Catatan Sistem |
|------|-------------------|----------------|
| **Toko/Retail** | Perdagangan biasa, wajib NPWP jika >4,8M/th | POS, HPP FIFO, PPN (jika PKP) |
| **Jasa/PPOB** | Perizinan terkait (BI, PLN, PDAM, BPJS) | Integrasi API agregator (Midtrans, Digiflazz, dll) |
| **Sewa Aset** | Kontrak sewa, pajak PPh Final 10% | Kontrak digital, jadwal bayar, auto PPh |
| **Ventura/Investasi** | Pasal 7 ayat 2: investasi pada anggota/pihak ketiga | Pipeline deal, term sheet digital, dividen tracking |
| **Cicilan Barang** | Penjualan kredit, akad Murabahah (jika Syariah) | Skema bunga flat/efektif, akad digital |

---

### 3. Kebutuhan Fungsional Terperinci (Functional Requirements)

#### 3.1 Modul Keanggotaan (BR-F-01)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-01-01 | Pendaftaran anggota dengan e-KYC (NIK + Face Match opsional) | Must | UU 17/2012 Ps.34, POJK 70/2019 (Laku Pandai) |
| BR-F-01-02 | Validasi duplikat NIK & Nomor Anggota unik national (jika terpusat) | Must | UU 17/2012 Ps.39 |
| BR-F-01-03 | Manajemen dokumen: KTP, KK, NPWP, Surat Nikah, Foto (digital, encrypted) | Must | UU PDP Ps.14 (Keamanan Data) |
| BR-F-01-04 | Status keanggotaan: Aktif, Non-aktif, Cuti, Keluar, Dikeluarkan | Must | UU 17/2012 Ps.38 |
| BR-F-01-05 | Histori perubahan data (audit trail) dengan timestamp & user | Must | UU PDP Ps.15 (Log Akses), SAK ETAP (Audit Trail) |

#### 3.2 Modul Simpanan (BR-F-02)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-02-01 | 4 Jenis simpanan: Pokok, Wajib, Sukarela, Deposito | Must | UU 17/2012 Ps.40-43 |
| BR-F-02-02 | Bunga Simpanan Sukarela: Daily Balance / Bulanan, configurable rate | Must | SEOJK (Transparansi bunga) |
| BR-F-02-03 | Bunga Deposito: Fixed rate per tenor, penalty tarik sebelum tempo | Must | UU 17/2012 Ps.43 |
| BR-F-02-04 | Transaksi: Setor (Teller/Transfer/Virtual Account), Tarik (Teller/ATM/QRIS) | Must | POJK 70/2019 (Layanan Digital) |
| BR-F-02-05 | Mutasi Rekening: PDF/Excel, periodik, digital signature | Must | SAK ETAP (Evidensi), UU ITE (Tanda Tangan Elektronik) |
| BR-F-02-06 | Auto-jurnal setiap transaksi (Debit Kas/Bank, Kredit Simpanan) | Must | SAK ETAP (Double Entry) |

#### 3.3 Modul Pinjaman (BR-F-03)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-03-01 | Produk Pinjaman: KUR, Mikro, Konsumtif, Produktif, Ventura, Syariah (opsional) | Must | POJK 12/2018 (Jenis Usaha KSP) |
| BR-F-03-02 | 3 Metode Bunga: **Flat**, **Efektif (Menurun/Harian)**, **Anuitas** | Must | Transparansi biaya (SEOJK) |
| BR-F-03-03 | Plafon: Auto-check 20% Modal Sendiri (hard limit), 25% dengan syarat | Must | POJK 12/2018 Ps.14 |
| BR-F-03-04 | Workflow: Pengajuan → Verifikasi (5C) → Approval Pengurus → Cair | Must | Prinsip Kehati-hatian |
| BR-F-03-05 | **AI Credit Scoring**: Analisis 5C + Rasio Keuangan (Likuiditas, Solvabilitas, Rentabilitas, BOPO, BMPK) | Should | POJK 12/2018 (Prinsip Kehati-hatian) |
| BR-F-03-06 | Jaminan: Fisik (SHM, BPKB), Non-fisik (Simpanan, Jaminan Pribadi), Syariah (Rahn) | Must | POJK 12/2018 Ps.15-16 |
| BR-F-03-07 | Angsuran: Auto-generate jadwal, notifikasi (WA/Email), pembayaran parsial/full | Must | SEOJK (Kolektibilitas) |
| BR-F-03-08 | Denda: Konfigurasi %/hari, cap maks, tidak compound, akrual otomatis | Must | SEOJK (Denda Tunggakan) |
| BR-F-03-09 | Kolektibilitas: Auto-update harian (1-5), histori perubahan | Must | SEOJK 14 (Pelaporan Kolektibilitas) |
| BR-F-03-10 | CKPN: Auto-calculate per PSAK 71/POJK, jurnal otomatis ke Beban CKPN | Must | PSAK 71, POJK 12/2018 |
| BR-F-03-11 | Restrukturisasi: Perpanjangan, Rescheduling, Rekondisionering, dengan approval Pengawas | Should | POJK 12/2018 Ps.20 |
| BR-F-03-12 | Write-off: Approval RAT, pencatatan off-balance sheet, upaya penagihan lanjut | Could | POJK 12/2018 Ps.21 |

#### 3.4 Modul Akuntansi & Pelaporan (BR-F-04)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-04-01 | COA Hierarchical 6 Level (SAK ETAP): Kelompok > Jenis > Kategori > Sub > Detail > Sub-detail | Must | PSAK 70 |
| BR-F-04-02 | Jurnal Otomatis: Setiap transaksi generate jurnal balanced (Debit = Kredit) | Must | SAK ETAP (Double Entry) |
| BR-F-04-03 | Jurnal Manual: Untuk koreksi, penyusutan, amortisasi, akrual (dengan approval) | Must | SAK ETAP |
| BR-F-04-04 | Periode Akuntansi: 12 periode + 1 periode penyesuaian (Adjusting) | Must | PSAK 70 |
| BR-F-04-05 | Tutup Buku: Proses lock periode, hitung SHU, generate jurnal penutup | Must | UU 17/2012 Ps.56, PSAK 70 |
| BR-F-04-06 | Laporan: Neraca, Laba Rugi, Arus Kas, Perubahan Ekuitas, Catatan LK | Must | PSAK 70, SEOJK 14 |
| BR-F-04-07 | Laporan OJK (LKP, BMPK, Kolektibilitas, KPMM): Export format XML/JSON OJK | Must | SEOJK 14 |
| BR-F-04-08 | Buku Besar & Buku Jurnal: Filter per akun, periode, status (Posted/Draft) | Must | SAK ETAP (Evidensi) |
| BR-F-04-09 | Neraca Saldo: Sebelum & Sesudah Penyesuaian | Must | PSAK 70 |

#### 3.5 Modul Unit Usaha (BR-F-05)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-05-01 | **POS Retail**: Kasir, stok real-time, HPP FIFO, multi-harga (anggota/non-anggota) | Must | UU 17/2012 Ps.7 |
| BR-F-05-02 | **Pembelian**: PO, Penerimaan Barang, Invoice Matching, Hutang Dagang | Should | SAK ETAP (Hutang) |
| BR-F-05-03 | **PPOB**: Pulsa, PLN, PDAM, BPJS, VA Bank, QRIS, e-Wallet (via agregator) | Should | POJK 70/2019 (Layanan Digital) |
| BR-F-05-04 | **Sewa Aset**: Kontrak, jadwal bayar, denda, PPh Final 10%, jurnal sewa | Could | UU PPh, UU 17/2012 Ps.7 |
| BR-F-05-05 | **Cicilan Barang**: Akad Jual Beli Kredit / Murabahah, DP, tenor, angsuran | Could | UU 17/2012 Ps.7, DSN-MUI (jika Syariah) |
| BR-F-05-06 | **Ventura**: Pipeline investasi, term sheet, dividen, laporan keuangan anak usaha | Could | UU 17/2012 Ps.7, PSAK 70 (Consolidation) |

#### 3.6 Modul Administrasi & Umum (BR-F-06)
| ID | Kebutuhan | Prioritas | Referensi Regulasi |
|----|-----------|-----------|-------------------|
| BR-F-06-01 | **e-RAT**: Undangan digital, voting online, risalah otomatis, e-signature | Should | UU 17/2012 Ps.53, UU ITE |
| BR-F-06-02 | **Pengumuman & Surat**: Broadcast ke anggota (WA/Email/App), template surat | Must | UU 17/2012 (Transparansi) |
| BR-F-06-03 | **Tiket Bantuan**: SLA, kategori, escalation, knowledge base | Should | Layanan Anggota |
| BR-F-06-04 | **Feature Toggle**: Enable/disable modul per kebutuhan koperasi | Must | Fleksibilitas operasional |
| BR-F-06-05 | **Landing Page CMS**: Hero, fitur, tim, testimoni, pricing, kontak (editable admin) | Should | Marketing & Transparansi |

---

### 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Kebutuhan | Target / Standar | Referensi |
|----------|-----------|------------------|-----------|
| **Keamanan** | Enkripsi data at rest (AES-256), in transit (TLS 1.3) | 100% data sensitif | UU PDP Ps.14, ISO 27001 |
| **Keamanan** | RBAC ketat: Superadmin, Admin, Operator, Anggota, Pengawas, Perusahaan | Zero unauthorized access | UU 17/2012 (Segregasi Tugas) |
| **Keamanan** | Audit Trail: Semua CRUD data kritis (log: user, waktu, before, after) | 100% transaksi keuangan & master | SAK ETAP, UU PDP Ps.15 |
| **Keamanan** | Rate limiting API, WAF, DDoS protection | < 1% downtime attack | POJK Keamanan Siber |
| **Performa** | Response time API < 500ms (p95), Dashboard load < 2s | SLA 99.9% uptime | POJK Layanan Digital |
| **Skalabilitas** | Support 50.000+ anggota, 1.000+ transaksi/hari | Horizontal scaling ready | POJK KPMM |
| **Ketersediaan** | Backup harian (RPO 24h), Point-in-time recovery (RTO < 4h) | Tested quarterly | POJK BCM, UU PDP |
| **Kepatuhan** | Data residency: Primary DC di Indonesia (Railway Jakarta/Singapura) | Wajib | UU PDP Ps.17, POJK Data Lokal |
| **Aksesibilitas** | WCAG 2.1 AA (kontras, keyboard nav, screen reader) | 100% halaman publik | Inklusi keuangan |
| **Integritas Data** | Foreign key constraints, database triggers untuk validasi kritis | Zero data corrupt | SAK ETAP (Reliability) |

---

### 5. Integrasi Eksternal (External Interfaces)

| Sistem Eksternal | Tujuan | Protokol / Standar | Frekuensi |
|------------------|--------|-------------------|-----------|
| **OJK (SIPED / Lapor OJK)** | Kirim LKP, BMPK, Kolektibilitas, KPMM | XML/JSON (XBRL), SFTP/API | Bulanan / Insidental |
| **Dukcapil (SIAK)** | Verifikasi NIK & KTP (e-KYC) | API SOAP/REST, Kunci Publik | Real-time (saat daftar) |
| **BI-Fast / SKN / RTGS** | Transfer antar bank, clearing | ISO 20022, API BI | Real-time |
| **VA Bank (Mandiri/BNI/BRI/BCA/Permata)** | Virtual Account untuk setor simpanan/bayar angsuran | API Bank / Aggregator (Midtrans/Xendit) | Real-time |
| **QRIS / GPN** | Pembayaran QR di POS & Angsuran | EMVCo QR, API Aggregator | Real-time |
| **Aggregator PPOB (Digiflazz, Midtrans, Tripay)** | Pulsa, Listrik, PDAM, BPJS, Game, dll | REST API, Callback/WEBHOOK | Real-time |
| **Email (SMTP/Resend/SendGrid)** | Notifikasi transaksi, OTP, pengumuman, laporan | SMTP API, Template HTML | Event-driven |
| **WhatsApp Business API (Meta/BSSP)** | Notifikasi WA, reminder angsuran, broadcast | Cloud API / On-premise | Event-driven / Scheduled |
| **Google Gemini (Vertex AI)** | AI Credit Scoring, OCR Dokumen, Chatbot | REST API, JSON | On-demand (scoring) |
| **PJOK / BPJS Kesehatan / Ketenagakerjaan** | Cek status anggota, iuran (jika koperasi bayar) | API BPJS / SJSN | Bulanan / On-demand |

---

### 6. Matriks Traceabilitas (Regulasi → Fitur → Test Case)

| Regulasi | Fitur Sistem (BR-F-ID) | Kriteria Penerimaan (UAT) |
|----------|------------------------|---------------------------|
| UU 17/2012 Ps.40 (Modal Pokok) | BR-F-02-01, BR-F-02-06 | Simpanan Pokok tidak bisa ditarik saat status Aktif; auto-kembali saat Keluar |
| POJK 12/2018 Ps.14 (Plafon 20%) | BR-F-03-03 | Penolakan otomatis jika plafo > 20% modal sendiri per debitur |
| SEOJK 14 (Kolektibilitas 1-5) | BR-F-03-09 | Scheduler 00:05 WIB update status berdasarkan hari tunggakan; histori tersimpan |
| PSAK 70 (Jurnal Double Entry) | BR-F-02-06, BR-F-03-02, BR-F-04-02 | Setiap transaksi generate jurnal balanced; Neraca Saldo selalu 0 |
| UU PDP Ps.14 (Keamanan Data) | BR-NF-01, BR-NF-02 | Enkripsi AES-256 at rest; TLS 1.3 in transit; RBAC enforced |
| UU 17/2012 Ps.53 (RAT) | BR-F-06-01 | e-RAT: undangan digital, voting, risalah, e-sign; export PDF legal |

---

### 7. Asumsi, Ketergantungan & Batasan

| Kategori | Deskripsi |
|----------|-----------|
| **Asumsi** | Koperasi sudah memiliki izin usaha (SITU) dan terdaftar di OJK |
| **Asumsi** | Koneksi internet stabil di kantor cabang (min 10 Mbps) |
| **Ketergantungan** | Ketersediaan API Bank/VA (Midtrans/Xendit) untuk integrasi pembayaran |
| **Ketergantungan** | Kuota & akses Google Gemini API untuk AI Scoring |
| **Batasan** | Sistem **bukan** Core Banking RTGS (bukan participant BI langsung) — menggunakan aggregator |
| **Batasan** | Modul Syariah (Murabahah, Mudharobah, Wadiah) **tidak** termasuk dalam scope standar (opsional custom) |
| **Batasan** | Konsolidasi laporan keuangan multi-cabang/anak usaha — dasarnya tersedia, konsolidasi lanjutan custom |

---

### 8. Kriteria Penerimaan Proyek (Project Acceptance Criteria)

Proyek dinyatakan **SELESAI & DITERIMA** jika:
1. ✅ Semua fitur **Must** (Priority: Must) lolos UAT tanpa bug Critical/High.
2. ✅ Laporan OJK (LKP, BMPK, Kolektibilitas) bisa diekspor & **lolos validasi skema OJK** (test ke sandbox OJK).
3. ✅ Laporan Keuangan (Neraca, Laba Rugi, Arus Kas) **seimbang** & sesuai SAK ETAP.
4. ✅ Jurnal otomatis dari **semua modul** (Simpanan, Pinjaman, Toko, PPOB, Sewa, Ventura) **balanced** & traceable ke source transaction.
5. ✅ AI Credit Scoring menghasilkan skor & rekomendasi untuk min. 10 sample pengajuan dengan akurasi > 80% vs analisis manual.
6. ✅ Audit trail lengkap untuk 100% transaksi keuangan & perubahan master data.
7. ✅ Penetrasi keamanan (Penetration Test) oleh pihak ketiga: **Zero Critical/High** vulnerability.
8. ✅ Pelatihan Admin & Operator selesai (min 3 sesi), materi dokumentasi diserahkan.
9. ✅ Go-Live Production: Health check green, data migrasi tervalidasi, rollback plan tested.

---

### 9. Lampiran

*   **Lampiran A**: Data Dictionary (Data Elements & Definisi)
*   **Lampiran B**: COA Standar KSP (Mapping ke SAK ETAP & OJK)
*   **Lampiran C**: Matrix Hak Akses per Role (RBAC Matrix)
*   **Lampiran D**: Contoh Formulir & Alur Kerja (Workflow Diagrams)
*   **Lampiran E**: SLA Dukungan & Wartel Pasca Go-Live

---

**Disetujui Oleh:**

| Peran | Nama | Tanda Tangan | Tanggal |
|-------|------|--------------|---------|
| **Ketua Pengurus Koperasi** | | | |
| **Bendahara / Manajer Keuangan** | | | |
| **Pengawas** | | | |
| **Project Manager MetroCoop** | | | |
| **Tech Lead MetroCoop** | | | |

---

*Dokumen ini adalah **Business Requirements Document (BRD) / User Requirements Specification (URS)** yang menjadi **acuan teknis** untuk pengembangan Spesifikasi Kebutuhan Sistem (SRS) dan desain sistem detail. Setiap perubahan pada dokumen ini memerlukan proses **Change Request** formal.*