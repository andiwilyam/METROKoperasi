# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sidebar.spec.ts >> Sidebar Navigation >> admin role >> should expand and load Simpanan sub-menus
- Location: tests\e2e\sidebar.spec.ts:235:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=e6]:
    - generic [ref=e8]:
      - img [ref=e10]
      - generic [ref=e13]:
        - text: MetroCoop
        - generic [ref=e14]: Koperasi Simpan Pinjam
    - navigation [ref=e15]:
      - generic [ref=e16]:
        - paragraph [ref=e17]: MANAJEMEN UTAMA
        - button "Dashboard Utama" [ref=e18]:
          - img [ref=e19]
          - text: Dashboard Utama
        - button "Manajemen Anggota" [ref=e24]:
          - img [ref=e25]
          - text: Manajemen Anggota
        - button "Simpanan (Savings)" [ref=e31]:
          - generic [ref=e32]:
            - img [ref=e33]
            - text: Simpanan (Savings)
          - img [ref=e36]
        - button "Pinjaman (Loans)" [ref=e39]:
          - generic [ref=e40]:
            - img [ref=e41]
            - text: Pinjaman (Loans)
          - img [ref=e47]
      - generic [ref=e49]:
        - paragraph [ref=e50]: Unit Usaha (Business)
        - button "Unit Toko (POS)" [ref=e52]:
          - generic [ref=e53]:
            - img [ref=e54]
            - text: Unit Toko (POS)
          - img [ref=e58]
        - button "Unit Tambahan" [ref=e61]:
          - generic [ref=e62]:
            - img [ref=e63]
            - text: Unit Tambahan
          - img [ref=e67]
      - generic [ref=e69]:
        - paragraph [ref=e70]: Manajemen Investasi & Penyertaan Modal
        - button "Modul Dashboard" [ref=e71]:
          - img [ref=e72]
          - text: Modul Dashboard
        - button "Data Perusahaan" [ref=e75]:
          - img [ref=e76]
          - text: Data Perusahaan
        - button "Pipeline Investasi" [ref=e80]:
          - img [ref=e81]
          - text: Pipeline Investasi
      - generic [ref=e85]:
        - paragraph [ref=e86]: Akuntansi & Laporan
        - button "Pembukuan & Keuangan" [ref=e88]:
          - generic [ref=e89]:
            - img [ref=e90]
            - text: Pembukuan & Keuangan
          - img [ref=e93]
        - button "Kelola Pengumuman" [ref=e95]:
          - img [ref=e96]
          - text: Kelola Pengumuman
        - button "Tiket & Pengaduan" [ref=e99]:
          - img [ref=e100]
          - text: Tiket & Pengaduan
      - generic [ref=e107]:
        - button "Data Master Organisasi" [ref=e108]:
          - img [ref=e109]
          - text: Data Master Organisasi
        - button "Pengaturan Koperasi" [ref=e112]:
          - img [ref=e113]
          - text: Pengaturan Koperasi
        - button "Kustomisasi Tema" [ref=e116]:
          - img [ref=e117]
          - text: Kustomisasi Tema
        - button "Landing Page Editor" [ref=e123]:
          - img [ref=e124]
          - text: Landing Page Editor
    - generic [ref=e127]:
      - generic [ref=e128]:
        - generic [ref=e129]: Tampilan Mode
        - button "Ganti Tema" [ref=e130]:
          - img [ref=e131]
      - button "Keluar Aplikasi" [ref=e137] [cursor=pointer]:
        - img [ref=e138]
        - text: Keluar Aplikasi
  - generic [ref=e141]:
    - banner [ref=e142]:
      - generic [ref=e144]:
        - generic [ref=e145]:
          - generic [ref=e146]: Aplikasi
          - generic [ref=e147]: /
          - generic [ref=e148]: MetroCoop
        - heading "Dashboard Utama" [level=2] [ref=e149]
      - generic [ref=e150]:
        - generic [ref=e151]:
          - img [ref=e152]
          - generic [ref=e155]: 15 Juli 2026 pukul 10.28.24 WIB
        - generic [ref=e156]: 🔒 Admin
        - button "Notifikasi & pengaduan" [ref=e158] [cursor=pointer]:
          - img [ref=e159]
          - generic [ref=e162]: "20"
        - button "A Ahmad Syarif admin" [ref=e164] [cursor=pointer]:
          - generic [ref=e165]: A
          - generic [ref=e166]:
            - generic [ref=e167]: Ahmad Syarif
            - generic [ref=e168]: admin
    - main [active] [ref=e169]:
      - generic [ref=e172]:
        - generic [ref=e174]:
          - generic [ref=e175]:
            - generic [ref=e176]:
              - generic [ref=e177]: Tahun Buku 2026
              - img [ref=e178]
            - heading "Kesehatan Koperasi Global — Koperasi Simpan Pinjam MetroKSP" [level=1] [ref=e181]
            - paragraph [ref=e182]: Sistem informasi keuangan koperasi & pencatatan transaksi terintegrasi secara profesional.
          - button "Pengaturan Koperasi" [ref=e183] [cursor=pointer]
        - generic [ref=e184]:
          - generic [ref=e185] [cursor=pointer]:
            - generic [ref=e186]:
              - text: Anggota Aktif
              - generic [ref=e187]: "37"
              - generic [ref=e188]:
                - img [ref=e189]
                - text: +5 bulan ini
            - img [ref=e193]
          - generic [ref=e198] [cursor=pointer]:
            - generic [ref=e199]:
              - text: Total Simpanan
              - generic [ref=e200]: Rp 280.547.386
              - generic [ref=e201]:
                - img [ref=e202]
                - text: Setoran aman & transparan
            - img [ref=e206]
          - generic [ref=e209] [cursor=pointer]:
            - generic [ref=e210]:
              - text: Pinjaman Beredar
              - generic [ref=e211]: Rp 2.092.145.600
              - text: Risiko Terkendali
            - img [ref=e213]
          - generic [ref=e219] [cursor=pointer]:
            - generic [ref=e220]:
              - text: SHU Terkumpul
              - generic [ref=e221]: Rp 0
              - text: + Positif (Laba)
            - img [ref=e223]
        - generic [ref=e225]:
          - generic [ref=e226]:
            - generic [ref=e227]:
              - generic [ref=e228]:
                - heading "Perkembangan Transaksi Global" [level=3] [ref=e229]
                - paragraph [ref=e230]: Perbandingan volume Simpanan vs Pinjaman dalam 6 bulan terakhir
              - generic [ref=e231]:
                - generic [ref=e234]: Simpanan
                - generic [ref=e237]: Pinjaman
            - generic [ref=e238]:
              - img [ref=e244]
              - generic [ref=e258]:
                - generic [ref=e259]: Feb
                - generic [ref=e260]: Mar
                - generic [ref=e261]: Apr
                - generic [ref=e262]: Mei
                - generic [ref=e263]: Jun
                - generic [ref=e264]: Jul
          - generic [ref=e265]:
            - generic [ref=e266]:
              - heading "Organisasi Koperasi" [level=3] [ref=e267]
              - paragraph [ref=e268]: Informasi ringkas struktur pengurus berwenang
            - generic [ref=e269]:
              - generic [ref=e270]:
                - generic [ref=e271]: I
                - generic [ref=e272]:
                  - generic [ref=e273]: Ir. H. Supriyanto, M.M.
                  - generic [ref=e274]: Ketua Pengurus
              - generic [ref=e275]:
                - generic [ref=e276]: R
                - generic [ref=e277]:
                  - generic [ref=e278]: Riana Safitri, S.E.
                  - generic [ref=e279]: Bendahara Koperasi
              - generic [ref=e280]:
                - generic [ref=e281]: D
                - generic [ref=e282]:
                  - generic [ref=e283]: Drs. H. Mulyono
                  - generic [ref=e284]: Sekretaris
            - generic [ref=e285]:
              - generic [ref=e286]:
                - img [ref=e287]
                - text: Sertifikasi Standar Mutu Koperasi
              - paragraph [ref=e290]: Koperasi Koperasi Simpan Pinjam MetroKSP telah diaudit dan dinyatakan memenuhi regulasi dan standar mutu dari Dinas Koperasi dan Kementerian Koperasi secara nasional.
        - generic [ref=e291]:
          - generic [ref=e292]:
            - img [ref=e294]
            - generic [ref=e298]:
              - generic [ref=e299]: Unit Toko POS
              - generic [ref=e300]: Rp 9.805.650
              - button "Masuk Kasir" [ref=e301]:
                - text: Masuk Kasir
                - img [ref=e302]
          - generic [ref=e304]:
            - img [ref=e306]
            - generic [ref=e309]:
              - generic [ref=e310]: Unit Sewa Alat
              - generic [ref=e311]: Rp 1.680.000
              - button "Urus Sewa" [ref=e312]:
                - text: Urus Sewa
                - img [ref=e313]
          - generic [ref=e315]:
            - img [ref=e317]
            - generic [ref=e321]:
              - generic [ref=e322]: PPOB Pulsa/Listrik
              - generic [ref=e323]: Rp 7.916.407
              - button "Transaksi PPOB" [ref=e324]:
                - text: Transaksi PPOB
                - img [ref=e325]
          - generic [ref=e327]:
            - img [ref=e329]
            - generic [ref=e332]:
              - generic [ref=e333]: Digital Payment (VA)
              - generic [ref=e334]: Rp 75.959.890
              - button "Layanan VA" [ref=e335]:
                - text: Layanan VA
                - img [ref=e336]
        - generic [ref=e338]:
          - generic [ref=e339]:
            - generic [ref=e340]:
              - generic [ref=e341]: Total Investasi Ventura
              - img [ref=e342]
            - generic [ref=e345]: Rp 310.000.000
            - generic [ref=e346]: 8 Investasi Aktif
          - generic [ref=e347]:
            - generic [ref=e348]: Dividen Terkumpul
            - generic [ref=e349]: Rp 33.250.000
            - button "Manajemen Investasi" [ref=e350]:
              - text: Manajemen Investasi
              - img [ref=e351]
          - generic [ref=e353]:
            - generic [ref=e354]: Pengajuan Baru
            - generic [ref=e355]: "0"
            - button "Tinjau Pengajuan" [ref=e356]:
              - text: Tinjau Pengajuan
              - img [ref=e357]
        - generic [ref=e359]:
          - generic [ref=e360]:
            - generic [ref=e361]:
              - heading "Permohonan Pinjaman Terbaru" [level=3] [ref=e362]
              - paragraph [ref=e363]: Pengajuan pinjaman dari anggota yang membutuhkan verifikasi admin
            - button "Lihat Semua" [ref=e364]:
              - text: Lihat Semua
              - img [ref=e365]
          - table [ref=e368]:
            - rowgroup [ref=e369]:
              - row "Nama Anggota Kategori Produk Jumlah Pokok Tenor (Bulan) Bunga / Margin Angsuran / Bln Aksi Tindakan" [ref=e370]:
                - columnheader "Nama Anggota" [ref=e371]
                - columnheader "Kategori Produk" [ref=e372]
                - columnheader "Jumlah Pokok" [ref=e373]
                - columnheader "Tenor (Bulan)" [ref=e374]
                - columnheader "Bunga / Margin" [ref=e375]
                - columnheader "Angsuran / Bln" [ref=e376]
                - columnheader "Aksi Tindakan" [ref=e377]
            - rowgroup [ref=e378]:
              - row "Kartini Halim Pinjaman Umum Multiguna Rp 27.000.000 6 bulan 1% / bln (flat) Rp 4.770.000 Setujui & Cairkan Tolak" [ref=e379]:
                - cell "Kartini Halim" [ref=e380]
                - cell "Pinjaman Umum Multiguna" [ref=e381]
                - cell "Rp 27.000.000" [ref=e382]
                - cell "6 bulan" [ref=e383]
                - cell "1% / bln (flat)" [ref=e384]
                - cell "Rp 4.770.000" [ref=e385]
                - cell "Setujui & Cairkan Tolak" [ref=e386]:
                  - button "Setujui & Cairkan" [ref=e387] [cursor=pointer]
                  - button "Tolak" [ref=e388] [cursor=pointer]
              - row "Sujono Lestari Pinjaman KPR Syariah Rp 259.000.000 68 bulan 0.75% / bln (effective) Rp 5.751.324 Setujui & Cairkan Tolak" [ref=e389]:
                - cell "Sujono Lestari" [ref=e390]
                - cell "Pinjaman KPR Syariah" [ref=e391]
                - cell "Rp 259.000.000" [ref=e392]
                - cell "68 bulan" [ref=e393]
                - cell "0.75% / bln (effective)" [ref=e394]
                - cell "Rp 5.751.324" [ref=e395]
                - cell "Setujui & Cairkan Tolak" [ref=e396]:
                  - button "Setujui & Cairkan" [ref=e397] [cursor=pointer]
                  - button "Tolak" [ref=e398] [cursor=pointer]
              - row "Wati Lestari Pinjaman Umum Multiguna Rp 7.500.000 21 bulan 1% / bln (flat) Rp 432.143 Setujui & Cairkan Tolak" [ref=e399]:
                - cell "Wati Lestari" [ref=e400]
                - cell "Pinjaman Umum Multiguna" [ref=e401]
                - cell "Rp 7.500.000" [ref=e402]
                - cell "21 bulan" [ref=e403]
                - cell "1% / bln (flat)" [ref=e404]
                - cell "Rp 432.143" [ref=e405]
                - cell "Setujui & Cairkan Tolak" [ref=e406]:
                  - button "Setujui & Cairkan" [ref=e407] [cursor=pointer]
                  - button "Tolak" [ref=e408] [cursor=pointer]
              - row "Marni Purnama Pinjaman Ventura/UMKM Rp 175.000.000 36 bulan 1.2% / bln (anuitas) Rp 6.015.140 Setujui & Cairkan Tolak" [ref=e409]:
                - cell "Marni Purnama" [ref=e410]
                - cell "Pinjaman Ventura/UMKM" [ref=e411]
                - cell "Rp 175.000.000" [ref=e412]
                - cell "36 bulan" [ref=e413]
                - cell "1.2% / bln (anuitas)" [ref=e414]
                - cell "Rp 6.015.140" [ref=e415]
                - cell "Setujui & Cairkan Tolak" [ref=e416]:
                  - button "Setujui & Cairkan" [ref=e417] [cursor=pointer]
                  - button "Tolak" [ref=e418] [cursor=pointer]
              - row "Gunawan Saputri Pinjaman Ventura/UMKM Rp 137.000.000 30 bulan 1.2% / bln (anuitas) Rp 5.464.934 Setujui & Cairkan Tolak" [ref=e419]:
                - cell "Gunawan Saputri" [ref=e420]
                - cell "Pinjaman Ventura/UMKM" [ref=e421]
                - cell "Rp 137.000.000" [ref=e422]
                - cell "30 bulan" [ref=e423]
                - cell "1.2% / bln (anuitas)" [ref=e424]
                - cell "Rp 5.464.934" [ref=e425]
                - cell "Setujui & Cairkan Tolak" [ref=e426]:
                  - button "Setujui & Cairkan" [ref=e427] [cursor=pointer]
                  - button "Tolak" [ref=e428] [cursor=pointer]
              - row "Eko Halim Pinjaman KPR Syariah Rp 449.500.000 114 bulan 0.75% / bln (effective) Rp 7.314.232 Setujui & Cairkan Tolak" [ref=e429]:
                - cell "Eko Halim" [ref=e430]
                - cell "Pinjaman KPR Syariah" [ref=e431]
                - cell "Rp 449.500.000" [ref=e432]
                - cell "114 bulan" [ref=e433]
                - cell "0.75% / bln (effective)" [ref=e434]
                - cell "Rp 7.314.232" [ref=e435]
                - cell "Setujui & Cairkan Tolak" [ref=e436]:
                  - button "Setujui & Cairkan" [ref=e437] [cursor=pointer]
                  - button "Tolak" [ref=e438] [cursor=pointer]
              - row "Maya Gunawan Pinjaman Ventura/UMKM Rp 77.000.000 27 bulan 1.2% / bln (anuitas) Rp 3.355.686 Setujui & Cairkan Tolak" [ref=e439]:
                - cell "Maya Gunawan" [ref=e440]
                - cell "Pinjaman Ventura/UMKM" [ref=e441]
                - cell "Rp 77.000.000" [ref=e442]
                - cell "27 bulan" [ref=e443]
                - cell "1.2% / bln (anuitas)" [ref=e444]
                - cell "Rp 3.355.686" [ref=e445]
                - cell "Setujui & Cairkan Tolak" [ref=e446]:
                  - button "Setujui & Cairkan" [ref=e447] [cursor=pointer]
                  - button "Tolak" [ref=e448] [cursor=pointer]
              - row "Budi Pratama Pinjaman Ventura/UMKM Rp 103.000.000 36 bulan 1.2% / bln (anuitas) Rp 3.540.339 Setujui & Cairkan Tolak" [ref=e449]:
                - cell "Budi Pratama" [ref=e450]
                - cell "Pinjaman Ventura/UMKM" [ref=e451]
                - cell "Rp 103.000.000" [ref=e452]
                - cell "36 bulan" [ref=e453]
                - cell "1.2% / bln (anuitas)" [ref=e454]
                - cell "Rp 3.540.339" [ref=e455]
                - cell "Setujui & Cairkan Tolak" [ref=e456]:
                  - button "Setujui & Cairkan" [ref=e457] [cursor=pointer]
                  - button "Tolak" [ref=e458] [cursor=pointer]
              - row "Siti Nugroho Pinjaman KPR Syariah Rp 202.000.000 72 bulan 0.75% / bln (effective) Rp 4.320.556 Setujui & Cairkan Tolak" [ref=e459]:
                - cell "Siti Nugroho" [ref=e460]
                - cell "Pinjaman KPR Syariah" [ref=e461]
                - cell "Rp 202.000.000" [ref=e462]
                - cell "72 bulan" [ref=e463]
                - cell "0.75% / bln (effective)" [ref=e464]
                - cell "Rp 4.320.556" [ref=e465]
                - cell "Setujui & Cairkan Tolak" [ref=e466]:
                  - button "Setujui & Cairkan" [ref=e467] [cursor=pointer]
                  - button "Tolak" [ref=e468] [cursor=pointer]
              - row "PT Hijau Agri Tech Pinjaman Umum Multiguna Rp 7.000.000 15 bulan 1% / bln (flat) Rp 536.667 Setujui & Cairkan Tolak" [ref=e469]:
                - cell "PT Hijau Agri Tech" [ref=e470]
                - cell "Pinjaman Umum Multiguna" [ref=e471]
                - cell "Rp 7.000.000" [ref=e472]
                - cell "15 bulan" [ref=e473]
                - cell "1% / bln (flat)" [ref=e474]
                - cell "Rp 536.667" [ref=e475]
                - cell "Setujui & Cairkan Tolak" [ref=e476]:
                  - button "Setujui & Cairkan" [ref=e477] [cursor=pointer]
                  - button "Tolak" [ref=e478] [cursor=pointer]
              - row "Sari Rahayu Pinjaman Umum Multiguna Rp 10.500.000 13 bulan 1% / bln (flat) Rp 912.692 Setujui & Cairkan Tolak" [ref=e479]:
                - cell "Sari Rahayu" [ref=e480]
                - cell "Pinjaman Umum Multiguna" [ref=e481]
                - cell "Rp 10.500.000" [ref=e482]
                - cell "13 bulan" [ref=e483]
                - cell "1% / bln (flat)" [ref=e484]
                - cell "Rp 912.692" [ref=e485]
                - cell "Setujui & Cairkan Tolak" [ref=e486]:
                  - button "Setujui & Cairkan" [ref=e487] [cursor=pointer]
                  - button "Tolak" [ref=e488] [cursor=pointer]
              - row "Maya Gunawan Pinjaman Umum Multiguna Rp 17.000.000 15 bulan 1% / bln (flat) Rp 1.303.333 Setujui & Cairkan Tolak" [ref=e489]:
                - cell "Maya Gunawan" [ref=e490]
                - cell "Pinjaman Umum Multiguna" [ref=e491]
                - cell "Rp 17.000.000" [ref=e492]
                - cell "15 bulan" [ref=e493]
                - cell "1% / bln (flat)" [ref=e494]
                - cell "Rp 1.303.333" [ref=e495]
                - cell "Setujui & Cairkan Tolak" [ref=e496]:
                  - button "Setujui & Cairkan" [ref=e497] [cursor=pointer]
                  - button "Tolak" [ref=e498] [cursor=pointer]
              - row "Kartini Halim Pinjaman Ventura/UMKM Rp 116.000.000 30 bulan 1.2% / bln (anuitas) Rp 4.627.244 Setujui & Cairkan Tolak" [ref=e499]:
                - cell "Kartini Halim" [ref=e500]
                - cell "Pinjaman Ventura/UMKM" [ref=e501]
                - cell "Rp 116.000.000" [ref=e502]
                - cell "30 bulan" [ref=e503]
                - cell "1.2% / bln (anuitas)" [ref=e504]
                - cell "Rp 4.627.244" [ref=e505]
                - cell "Setujui & Cairkan Tolak" [ref=e506]:
                  - button "Setujui & Cairkan" [ref=e507] [cursor=pointer]
                  - button "Tolak" [ref=e508] [cursor=pointer]
      - paragraph [ref=e510]: METROCOOP \u2022 Koperasi Simpan Pinjam @2026
```

# Test source

```ts
  138 |   if (await btn.count() > 0 && await btn.isVisible()) {
  139 |     await btn.click();
  140 |     await page.waitForLoadState('networkidle');
  141 |     await page.waitForTimeout(1000);
  142 |     return true;
  143 |   }
  144 |   return false;
  145 | }
  146 | 
  147 | async function clickSubMenu(page, parentMenu, subLabel) {
  148 |   // Parent should already be clicked and expanded
  149 |   await page.waitForTimeout(500);
  150 |   
  151 |   // Try HTML entity version first
  152 |   const labelHtml = subLabel.replace('&', '&');
  153 |   const selectors = [
  154 |     `button:has-text("• ${labelHtml}")`,
  155 |     `button:has-text("• ${subLabel}")`,
  156 |     `button:has-text("${labelHtml}")`,
  157 |     `button:has-text("${subLabel}")`,
  158 |   ];
  159 |   
  160 |   for (const sel of selectors) {
  161 |     const btn = page.locator(sel).first();
  162 |     if (await btn.count() > 0 && await btn.isVisible()) {
  163 |       await btn.click();
  164 |       await page.waitForLoadState('networkidle');
  165 |       await page.waitForTimeout(1000);
  166 |       return true;
  167 |     }
  168 |   }
  169 |   return false;
  170 | }
  171 | 
  172 | async function verifyContentLoaded(page) {
  173 |   const indicators = [
  174 |     'table', '.card', '[class*="card"]', 'form', '[class*="grid"]', '[class*="list"]', '.content',
  175 |     'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
  176 |     'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi',
  177 |     'text=Dividen', 'text=Profil', 'text=Pengumuman', 'text=Dokumen', 'text=Tiket'
  178 |   ];
  179 |   
  180 |   for (const sel of indicators) {
  181 |     if (await page.locator(sel).count() > 0) {
  182 |       return true;
  183 |     }
  184 |   }
  185 |   return false;
  186 | }
  187 | 
  188 | test.describe('Sidebar Navigation', () => {
  189 |   for (const [role, coreMenus] of Object.entries(CORE_MENUS)) {
  190 |     test.describe(`${role} role`, () => {
  191 |       test.beforeEach(async ({ page }) => {
  192 |         await login(page, role);
  193 |       });
  194 |       
  195 |       test.afterEach(async ({ page }) => {
  196 |         await logout(page);
  197 |       });
  198 |       
  199 |       test('should display all core sidebar menus', async ({ page }) => {
  200 |         const foundMenus = await getSidebarMenus(page);
  201 |         
  202 |         // Check all CORE menus are present
  203 |         for (const expected of coreMenus) {
  204 |           const found = foundMenus.some(m => m.toLowerCase().includes(expected.toLowerCase()));
  205 |           expect(found, `Expected core menu "${expected}" not found`).toBeTruthy();
  206 |         }
  207 |         
  208 |         // Check optional menus - just log if found
  209 |         const optionalMenus = OPTIONAL_MENUS[role as keyof typeof OPTIONAL_MENUS] || [];
  210 |         for (const optional of optionalMenus) {
  211 |           const found = foundMenus.some(m => m.toLowerCase().includes(optional.toLowerCase()));
  212 |           if (found) {
  213 |             console.log(`  ✓ Optional menu found: ${optional}`);
  214 |           } else {
  215 |             console.log(`  ℹ️ Optional menu not visible (feature flag?): ${optional}`);
  216 |           }
  217 |         }
  218 |       });
  219 |       
  220 |       test('should load content for each main menu', async ({ page }) => {
  221 |         const foundMenus = await getSidebarMenus(page);
  222 |         const skip = ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout'];
  223 |         const testMenus = foundMenus.filter(m => !skip.includes(m)).slice(0, 10);
  224 |         
  225 |         for (const menu of testMenus) {
  226 |           const clicked = await clickMenu(page, menu);
  227 |           expect(clicked, `Failed to click menu: ${menu}`).toBeTruthy();
  228 |           
  229 |           const loaded = await verifyContentLoaded(page);
  230 |           expect(loaded, `Content not loaded for: ${menu}`).toBeTruthy();
  231 |         }
  232 |       });
  233 |       
  234 |       if (role === 'admin' || role === 'operator') {
  235 |         test('should expand and load Simpanan sub-menus', async ({ page }) => {
  236 |           const parent = 'Simpanan (Savings)';
  237 |           const clicked = await clickMenu(page, parent);
> 238 |           expect(clicked).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
  239 |           
  240 |           for (const sub of SUB_MENUS[parent]) {
  241 |             const subClicked = await clickSubMenu(page, parent, sub.label);
  242 |             expect(subClicked, `Failed to click sub-menu: ${sub.label}`).toBeTruthy();
  243 |             
  244 |             const loaded = await verifyContentLoaded(page);
  245 |             expect(loaded, `Content not loaded for sub-menu: ${sub.label}`).toBeTruthy();
  246 |           }
  247 |         });
  248 |         
  249 |         test('should expand and load Pinjaman sub-menus', async ({ page }) => {
  250 |           const parent = 'Pinjaman (Loans)';
  251 |           const clicked = await clickMenu(page, parent);
  252 |           expect(clicked).toBeTruthy();
  253 |           
  254 |           for (const sub of SUB_MENUS[parent]) {
  255 |             const subClicked = await clickSubMenu(page, parent, sub.label);
  256 |             expect(subClicked, `Failed to click sub-menu: ${sub.label}`).toBeTruthy();
  257 |             
  258 |             const loaded = await verifyContentLoaded(page);
  259 |             expect(loaded, `Content not loaded for sub-menu: ${sub.label}`).toBeTruthy();
  260 |           }
  261 |         });
  262 |       }
  263 |     });
  264 |   }
  265 | });
```