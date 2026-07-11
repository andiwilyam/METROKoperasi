# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sidebar.spec.ts >> Sidebar Navigation >> admin role >> should display all core sidebar menus
- Location: tests\e2e\sidebar.spec.ts:199:7

# Error details

```
Error: Expected core menu "Dashboard Utama" not found

expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e6]:
      - img [ref=e8]
      - generic [ref=e11]:
        - text: MetroCoop
        - generic [ref=e12]: Koperasi Simpan Pinjam
    - navigation [ref=e13]:
      - generic [ref=e14]:
        - paragraph [ref=e15]: MANAJEMEN UTAMA
        - button "Dashboard Utama" [ref=e16]:
          - img [ref=e17]
          - text: Dashboard Utama
        - button "Manajemen Anggota" [ref=e22]:
          - img [ref=e23]
          - text: Manajemen Anggota
        - button "Simpanan (Savings)" [ref=e29]:
          - generic [ref=e30]:
            - img [ref=e31]
            - text: Simpanan (Savings)
          - img [ref=e34]
        - button "Pinjaman (Loans)" [ref=e37]:
          - generic [ref=e38]:
            - img [ref=e39]
            - text: Pinjaman (Loans)
          - img [ref=e45]
      - generic [ref=e47]:
        - paragraph [ref=e48]: Unit Usaha (Business)
        - button "Unit Toko (POS)" [ref=e50]:
          - generic [ref=e51]:
            - img [ref=e52]
            - text: Unit Toko (POS)
          - img [ref=e56]
        - button "Unit Tambahan" [ref=e59]:
          - generic [ref=e60]:
            - img [ref=e61]
            - text: Unit Tambahan
          - img [ref=e65]
      - generic [ref=e67]:
        - paragraph [ref=e68]: Manajemen Investasi & Penyertaan Modal
        - button "Modul Dashboard" [ref=e69]:
          - img [ref=e70]
          - text: Modul Dashboard
        - button "Data Perusahaan" [ref=e73]:
          - img [ref=e74]
          - text: Data Perusahaan
        - button "Pipeline Investasi" [ref=e78]:
          - img [ref=e79]
          - text: Pipeline Investasi
      - generic [ref=e83]:
        - paragraph [ref=e84]: Akuntansi & Laporan
        - button "Pembukuan & Keuangan" [ref=e86]:
          - generic [ref=e87]:
            - img [ref=e88]
            - text: Pembukuan & Keuangan
          - img [ref=e91]
        - button "Kelola Pengumuman" [ref=e93]:
          - img [ref=e94]
          - text: Kelola Pengumuman
        - button "Tiket & Pengaduan" [ref=e97]:
          - img [ref=e98]
          - text: Tiket & Pengaduan
      - generic [ref=e105]:
        - button "Data Master Organisasi" [ref=e106]:
          - img [ref=e107]
          - text: Data Master Organisasi
        - button "Pengaturan Koperasi" [ref=e110]:
          - img [ref=e111]
          - text: Pengaturan Koperasi
        - button "Kustomisasi Tema" [ref=e114]:
          - img [ref=e115]
          - text: Kustomisasi Tema
        - button "Landing Page Editor" [ref=e121]:
          - img [ref=e122]
          - text: Landing Page Editor
    - generic [ref=e125]:
      - generic [ref=e126]:
        - generic [ref=e127]: Tampilan Mode
        - button "Ganti Tema" [ref=e128]:
          - img [ref=e129]
      - button "Keluar Aplikasi" [ref=e131] [cursor=pointer]:
        - img [ref=e132]
        - text: Keluar Aplikasi
  - generic [ref=e135]:
    - banner [ref=e136]:
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e140]: Aplikasi
          - generic [ref=e141]: /
          - generic [ref=e142]: MetroCoop
        - heading "Dashboard Utama" [level=2] [ref=e143]
      - generic [ref=e144]:
        - generic [ref=e145]:
          - img [ref=e146]
          - generic [ref=e149]: 12 Juli 2026, 06:30:14 WIB
        - generic [ref=e150]: 🔒 Admin
        - button "Pengaduan & Notifikasi" [ref=e152] [cursor=pointer]:
          - img [ref=e153]
        - button "A Ahmad Syarif admin" [ref=e157] [cursor=pointer]:
          - generic [ref=e158]: A
          - generic [ref=e159]:
            - generic [ref=e160]: Ahmad Syarif
            - generic [ref=e161]: admin
    - main [ref=e162]:
      - generic [ref=e165]:
        - generic [ref=e167]:
          - generic [ref=e168]:
            - generic [ref=e169]:
              - generic [ref=e170]: Tahun Buku 2026
              - img [ref=e171]
            - heading "Kesehatan Koperasi Global — Koperasi Simpan Pinjam MetroKSP" [level=1] [ref=e174]
            - paragraph [ref=e175]: Sistem informasi keuangan koperasi & pencatatan transaksi terintegrasi secara profesional.
          - button "Pengaturan Koperasi" [ref=e176] [cursor=pointer]
        - generic [ref=e177]:
          - generic [ref=e178] [cursor=pointer]:
            - generic [ref=e179]:
              - text: Anggota Aktif
              - generic [ref=e180]: "8"
              - generic [ref=e181]:
                - img [ref=e182]
                - text: +5 bulan ini
            - img [ref=e186]
          - generic [ref=e191] [cursor=pointer]:
            - generic [ref=e192]:
              - text: Total Simpanan
              - generic [ref=e193]: Rp 180.700.000
              - generic [ref=e194]:
                - img [ref=e195]
                - text: Setoran aman & transparan
            - img [ref=e199]
          - generic [ref=e202] [cursor=pointer]:
            - generic [ref=e203]:
              - text: Pinjaman Beredar
              - generic [ref=e204]: Rp 6.000.000
              - generic [ref=e205]: Risiko Terkendali
            - img [ref=e207]
          - generic [ref=e213] [cursor=pointer]:
            - generic [ref=e214]:
              - text: SHU Terkumpul
              - generic [ref=e215]: Rp 5.667.000
              - text: + Positif (Laba)
            - img [ref=e217]
        - generic [ref=e219]:
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]:
                - heading "Perkembangan Transaksi Global" [level=3] [ref=e223]
                - paragraph [ref=e224]: Perbandingan volume Simpanan vs Pinjaman dalam 6 bulan terakhir
              - generic [ref=e225]:
                - generic [ref=e228]: Simpanan
                - generic [ref=e231]: Pinjaman
            - generic [ref=e232]:
              - img [ref=e238]
              - generic [ref=e253]:
                - generic [ref=e254]: Februari
                - generic [ref=e255]: Maret
                - generic [ref=e256]: April
                - generic [ref=e257]: Mei
                - generic [ref=e258]: Juni
                - generic [ref=e259]: Juli
          - generic [ref=e260]:
            - generic [ref=e261]:
              - heading "Organisasi Koperasi" [level=3] [ref=e262]
              - paragraph [ref=e263]: Informasi ringkas struktur pengurus berwenang
            - generic [ref=e264]:
              - generic [ref=e265]:
                - generic [ref=e266]: I
                - generic [ref=e267]:
                  - generic [ref=e268]: Ir. H. Supriyanto, M.M.
                  - generic [ref=e269]: Ketua Pengurus
              - generic [ref=e270]:
                - generic [ref=e271]: R
                - generic [ref=e272]:
                  - generic [ref=e273]: Riana Safitri, S.E.
                  - generic [ref=e274]: Bendahara Koperasi
            - generic [ref=e275]:
              - generic [ref=e276]:
                - img [ref=e277]
                - text: Sertifikasi Standar Mutu Koperasi
              - paragraph [ref=e280]: Koperasi Koperasi Simpan Pinjam MetroKSP telah diaudit dan dinyatakan memenuhi regulasi dan standar mutu dari Dinas Koperasi dan Kementerian Koperasi secara nasional.
        - generic [ref=e281]:
          - generic [ref=e282]:
            - img [ref=e284]
            - generic [ref=e288]:
              - generic [ref=e289]: Unit Toko POS
              - generic [ref=e290]: Rp 156.000
              - button "Masuk Kasir" [ref=e291]:
                - text: Masuk Kasir
                - img [ref=e292]
          - generic [ref=e294]:
            - img [ref=e296]
            - generic [ref=e299]:
              - generic [ref=e300]: Unit Sewa Alat
              - generic [ref=e301]: Rp 0
              - button "Urus Sewa" [ref=e302]:
                - text: Urus Sewa
                - img [ref=e303]
          - generic [ref=e305]:
            - img [ref=e307]
            - generic [ref=e311]:
              - generic [ref=e312]: PPOB Pulsa/Listrik
              - generic [ref=e313]: Rp 0
              - button "Transaksi PPOB" [ref=e314]:
                - text: Transaksi PPOB
                - img [ref=e315]
          - generic [ref=e317]:
            - img [ref=e319]
            - generic [ref=e322]:
              - generic [ref=e323]: Digital Payment (VA)
              - generic [ref=e324]: Rp 0
              - button "Layanan VA" [ref=e325]:
                - text: Layanan VA
                - img [ref=e326]
        - generic [ref=e328]:
          - generic [ref=e329]:
            - generic [ref=e330]:
              - generic [ref=e331]: Total Investasi Ventura
              - img [ref=e332]
            - generic [ref=e335]: Rp 1.330.000.000
            - generic [ref=e336]: 4 Investasi Aktif
          - generic [ref=e337]:
            - generic [ref=e338]: Dividen Terkumpul
            - generic [ref=e339]: Rp 0
            - button "Manajemen Investasi" [ref=e340]:
              - text: Manajemen Investasi
              - img [ref=e341]
          - generic [ref=e343]:
            - generic [ref=e344]: Pengajuan Baru
            - generic [ref=e345]: "2"
            - button "Tinjau Pengajuan" [ref=e346]:
              - text: Tinjau Pengajuan
              - img [ref=e347]
        - generic [ref=e349]:
          - generic [ref=e350]:
            - generic [ref=e351]:
              - heading "Permohonan Pinjaman Terbaru" [level=3] [ref=e352]
              - paragraph [ref=e353]: Pengajuan pinjaman dari anggota yang membutuhkan verifikasi admin
            - button "Lihat Semua" [ref=e354]:
              - text: Lihat Semua
              - img [ref=e355]
          - generic [ref=e357]: ✅ Tidak ada permohonan pinjaman baru yang tertunda.
      - paragraph [ref=e359]: METROCOOP \u2022 Koperasi Simpan Pinjam @2026
```

# Test source

```ts
  105 |     return false;
  106 |   }
  107 | }
  108 | 
  109 | async function getSidebarMenus(page) {
  110 |   const menus = [];
  111 |   const strategies = ['aside button', 'nav button', '[class*="sidebar"] button', '[class*="Sidebar"] button'];
  112 |   
  113 |   for (const selector of strategies) {
  114 |     const buttons = page.locator(selector);
  115 |     const count = await buttons.count();
  116 |     if (count > 0) {
  117 |       for (let i = 0; i < count; i++) {
  118 |         const btn = buttons.nth(i);
  119 |         if (await btn.isVisible()) {
  120 |           const text = (await btn.innerText()).trim();
  121 |           if (text && text.length > 1 && !menus.includes(text)) {
  122 |             const skip = ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout', '☰', '☰ Menu', '≡'];
  123 |             if (!skip.includes(text)) {
  124 |               menus.push(text);
  125 |             }
  126 |           }
  127 |         }
  128 |       }
  129 |       if (menus.length > 0) break;
  130 |     }
  131 |   }
  132 |   
  133 |   return menus;
  134 | }
  135 | 
  136 | async function clickMenu(page, menuName) {
  137 |   const btn = page.locator(`button:has-text("${menuName}")`).first();
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
> 205 |           expect(found, `Expected core menu "${expected}" not found`).toBeTruthy();
      |                                                                       ^ Error: Expected core menu "Dashboard Utama" not found
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
  238 |           expect(clicked).toBeTruthy();
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