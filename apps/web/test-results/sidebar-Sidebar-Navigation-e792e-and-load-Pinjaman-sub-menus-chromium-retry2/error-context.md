# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sidebar.spec.ts >> Sidebar Navigation >> admin role >> should expand and load Pinjaman sub-menus
- Location: tests\e2e\sidebar.spec.ts:249:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e9]
        - generic [ref=e12]:
          - heading "MetroCoop v2.0" [level=1] [ref=e13]
          - paragraph [ref=e14]: Sistem Informasi Koperasi Terintegrasi
      - generic [ref=e15]:
        - heading "Platform Digitalisasi Koperasi Masa Kini" [level=2] [ref=e16]
        - paragraph [ref=e17]: Kelola data anggota, transaksi simpanan, pengajuan pinjaman, akuntansi jurnal otomatis, serta unit usaha perdagangan (toko) dalam satu ekosistem cloud terintegrasi.
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: 100%
          - generic [ref=e21]: Auto Journaling
        - generic [ref=e22]:
          - generic [ref=e23]: Multi
          - generic [ref=e24]: Portal Anggota & Admin
      - generic [ref=e25]:
        - generic [ref=e26]:
          - img [ref=e27]
          - text: "Test Credentials (Klik untuk mengisi otomatis):"
        - generic [ref=e30]:
          - 'button "🔑 Admin / Pengurus User: admin / Pass: admin123" [ref=e31] [cursor=pointer]':
            - generic [ref=e32]: 🔑 Admin / Pengurus
            - generic [ref=e33]: "User: admin / Pass: admin123"
          - 'button "⚙️ Operator Staff User: operator / Pass: admin123" [ref=e34] [cursor=pointer]':
            - generic [ref=e35]: ⚙️ Operator Staff
            - generic [ref=e36]: "User: operator / Pass: admin123"
          - 'button "👤 Anggota (Marmad Tuaian) NIK: 1234567890 / Pass: 123456" [ref=e37] [cursor=pointer]':
            - generic [ref=e38]: 👤 Anggota (Marmad Tuaian)
            - generic [ref=e39]: "NIK: 1234567890 / Pass: 123456"
    - generic [ref=e41]:
      - generic [ref=e42]:
        - button "Admin & Operator" [ref=e43]:
          - img [ref=e44]
          - text: Admin & Operator
        - button "Portal Anggota" [ref=e46]:
          - img [ref=e47]
          - text: Portal Anggota
        - button "Perusahaan" [ref=e50]:
          - img [ref=e51]
          - text: Perusahaan
      - generic [ref=e55]:
        - generic [ref=e56]:
          - heading "Masuk Back Office" [level=3] [ref=e57]
          - paragraph [ref=e58]:
            - generic [ref=e59]: Prtal Ba
        - generic [ref=e60]:
          - generic [ref=e61]:
            - generic [ref=e62]:
              - img [ref=e63]
              - text: Username Admin/Operator
            - 'textbox "Masukkan username (misal: admin)" [ref=e66]'
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e69]
              - text: Kata Sandi (Password)
            - generic [ref=e73]:
              - textbox "••••••" [ref=e74]
              - button "Tampilkan kata sandi" [ref=e75] [cursor=pointer]:
                - img [ref=e76]
          - button "Masuk Sistem" [ref=e80] [cursor=pointer]:
            - generic [ref=e81]: Masuk Sistem
            - img [ref=e82]
      - generic [ref=e85]:
        - text: Aplikasi ini dilindungi oleh sertifikat enkripsi SSL.
        - text: © 2026 MetroCoop v2.0 — Sistem Koperasi Terintegrasi.
  - generic [ref=e86]: METRO KOMUNIKA ASIA @2026 • Design By Andi WIlyam
```

# Test source

```ts
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
> 252 |           expect(clicked).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
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