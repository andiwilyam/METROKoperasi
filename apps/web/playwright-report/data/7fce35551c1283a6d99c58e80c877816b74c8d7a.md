# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login Flow >> should login as admin
- Location: tests\e2e\login.spec.ts:26:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('aside, nav, button:has-text("Keluar Aplikasi")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('aside, nav, button:has-text("Keluar Aplikasi")').first()

```

```yaml
- heading "MetroCoop v2.0" [level=1]
- paragraph: Sistem Informasi Koperasi Terintegrasi
- heading "Platform Digitalisasi Koperasi Masa Kini" [level=2]
- paragraph: Kelola data anggota, transaksi simpanan, pengajuan pinjaman, akuntansi jurnal otomatis, serta unit usaha perdagangan (toko) dalam satu ekosistem cloud terintegrasi.
- text: "100% Auto Journaling Multi Portal Anggota & Admin Test Credentials (Klik untuk mengisi otomatis):"
- 'button "🔑 Admin / Pengurus User: admin / Pass: admin123"'
- 'button "⚙️ Operator Staff User: operator / Pass: admin123"'
- 'button "👤 Anggota (Marmad Tuaian) NIK: 1234567890 / Pass: 123456"'
- button "Admin & Operator"
- button "Portal Anggota"
- button "Perusahaan"
- heading "Masuk Back Office" [level=3]
- paragraph: Prtal Back Office — Admin, Operator & Pengurus
- text: Username Admin/Operator
- 'textbox "Masukkan username (misal: admin)"': admin
- text: Kata Sandi (Password)
- textbox "••••••": admin123
- button "Tampilkan kata sandi"
- button "Memvalidasi..." [disabled]
- text: Aplikasi ini dilindungi oleh sertifikat enkripsi SSL. © 2026 MetroCoop v2.0 — Sistem Koperasi Terintegrasi. METRO KOMUNIKA ASIA @2026 • Design By Andi WIlyam
```

# Test source

```ts
  1  | /**
  2  |  * E2E Test: Login flows for all 4 roles
  3  |  */
  4  | import { test, expect } from '@playwright/test';
  5  | 
  6  | const CREDENTIALS = {
  7  |   admin: { username: 'admin', password: 'admin123' },
  8  |   operator: { username: 'operator', password: 'admin123' },
  9  |   anggota: { username: '1234567890', password: '123456' },
  10 |   perusahaan: { username: 'hijau_agri', password: 'perusahaan123' },
  11 | };
  12 | 
  13 | const QUICK_LOGIN_BUTTONS = {
  14 |   admin: '🔑 Admin',
  15 |   operator: '⚙️ Operator',
  16 |   anggota: '👤 Anggota',
  17 | };
  18 | 
  19 | test.describe('Login Flow', () => {
  20 |   test.beforeEach(async ({ page }) => {
  21 |     await page.goto('/login');
  22 |     await page.waitForLoadState('networkidle');
  23 |   });
  24 | 
  25 |   for (const [role, creds] of Object.entries(CREDENTIALS)) {
  26 |     test(`should login as ${role}`, async ({ page }) => {
  27 |       // Perusahaan role has no quick login button
  28 |       if (role === 'perusahaan') {
  29 |         await page.click('button:has-text("Perusahaan")');
  30 |         await page.fill('input[type="text"]', creds.username);
  31 |         await page.fill('input[type="password"]', creds.password);
  32 |         await page.click('button:has-text("Masuk Sistem")');
  33 |       } else {
  34 |         // Use quick login button
  35 |         const quickText = QUICK_LOGIN_BUTTONS[role as keyof typeof QUICK_LOGIN_BUTTONS];
  36 |         await page.click(`button:has-text("${quickText}")`);
  37 |         await page.waitForTimeout(500);
  38 |         await page.click('button:has-text("Masuk Sistem")');
  39 |       }
  40 |       
  41 |       // Wait for dashboard to load
  42 |       await page.waitForLoadState('networkidle');
  43 |       await page.waitForTimeout(1000);
  44 |       
  45 |       // Verify logged in - check for sidebar or dashboard content
> 46 |       await expect(page.locator('aside, nav, button:has-text("Keluar Aplikasi")').first()).toBeVisible({ timeout: 5000 });
     |                                                                                            ^ Error: expect(locator).toBeVisible() failed
  47 |     });
  48 |   }
  49 | });
```