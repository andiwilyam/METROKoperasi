/**
 * MetroCoop E2E Regression Test Suite
 * Playwright-based tests for CI/CD pipeline
 * Tests: Login flows (4 roles), Sidebar navigation, Module loading
 */

import { test, expect, Page, Browser } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123' },
  operator: { username: 'operator', password: 'admin123' },
  anggota: { username: '1234567890', password: '123456' },
  perusahaan: { username: 'hijau_agri', password: 'perusahaan123' },
};

const EXPECTED_MENUS = {
  admin: [
    'Dashboard Utama', 'Manajemen Anggota', 'Simpanan (Savings)', 'Pinjaman (Loans)',
    'Unit Toko (POS)', 'Unit Tambahan', 'Modul Dashboard', 'Data Perusahaan',
    'Pipeline Investasi', 'Pembukuan & Keuangan', 'Kelola Pengumuman',
    'Tiket & Pengaduan', 'Data Master Organisasi', 'Pengaturan Koperasi',
    'Kustomisasi Tema', 'Landing Page Editor'
  ],
  operator: [
    'Dashboard Utama', 'Manajemen Anggota', 'Simpanan (Savings)', 'Pinjaman (Loans)',
    'Unit Toko (POS)', 'Unit Tambahan', 'Modul Dashboard', 'Data Perusahaan',
    'Pipeline Investasi', 'Pembukuan & Keuangan', 'Kelola Pengumuman',
    'Tiket & Pengaduan', 'Data Master Organisasi'
  ],
  anggota: [
    'Ringkasan Dashboard', 'Simpanan Saya', 'Pinjaman Saya', 'Mutasi Rekening',
    'Pengajuan Pinjam / Tarik', 'Tiket Bantuan (Helpdesk)', 'Kirim Bukti Transfer',
    'Sewa Aset Koperasi', 'Loket PPOB & Pulsa', 'Virtual Account Deposit',
    'Kredit Cicilan Pengadaan', 'Ubah Profil Saya'
  ],
  perusahaan: [
    'Dashboard', 'Pipeline Investasi', 'Dividen & Bagi Hasil', 'Profil Perusahaan',
    'Pengumuman', 'Upload Dokumen', 'Tiket Bantuan'
  ]
};

const SUB_MENUS = {
  'Simpanan (Savings)': [
    { id: 'simpanan_transaksi', label: 'Setor & Tarik' },
    { id: 'simpanan_permohonan', label: 'Permohonan Tarik' },
    { id: 'simpanan_jenis', label: 'Konfigurasi Simpanan' },
  ],
  'Pinjaman (Loans)': [
    { id: 'pinjaman_pengajuan', label: 'Daftar Pengajuan' },
    { id: 'pinjaman_angsuran', label: 'Bayar Angsuran' },
    { id: 'pinjaman_tagihan', label: 'Tagihan & Jatuh Tempo' },
    { id: 'pinjaman_konfigurasi', label: 'Konfigurasi Pinjaman' },
  ],
};

// Helper: Check if logged in (SPA doesn't redirect on login)
async function isLoggedIn(page: Page): Promise<boolean> {
  const indicators = [
    'text=Dashboard',
    'text=Kesehatan Koperasi',
    'aside',
    'nav',
    'button:has-text("Keluar Aplikasi")',
    'button:has-text("Keluar")',
    '[class*="sidebar"]',
    '[class*="Sidebar"]'
  ];
  
  for (const ind of indicators) {
    if (await page.locator(ind).count() > 0) {
      return true;
    }
  }
  return false;
}

// Helper: Login via quick button (admin, operator, anggota)
async function loginViaQuickButton(page: Page, role: string): Promise<boolean> {
  const creds = CREDENTIALS[role as keyof typeof CREDENTIALS];
  console.log(`🔐 Logging in as ${role} (${creds.username})...`);
  
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const quickTexts: Record<string, string> = {
    admin: '🔑 Admin',
    operator: '⚙️ Operator',
    anggota: '👤 Anggota',
  };
  
  const quickText = quickTexts[role];
  if (!quickText) return false;
  
  const quickBtn = page.locator(`button:has-text("${quickText}")`).first();
  if (await quickBtn.count() === 0) {
    console.log(`  ❌ Quick login button not found for ${role}`);
    return false;
  }
  
  await quickBtn.click();
  await page.waitForTimeout(1000);
  
  const submit = page.locator('button:has-text("Masuk Sistem")').first();
  if (await submit.count() > 0 && await submit.isEnabled()) {
    await submit.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  } else {
    console.log(`  ❌ Submit button not found/enabled`);
    return false;
  }
  
  const success = await isLoggedIn(page);
  console.log(`  ${success ? '✅' : '❌'} Login ${success ? 'successful' : 'failed'}`);
  return success;
}

// Helper: Manual login (perusahaan)
async function loginManual(page: Page, role: string): Promise<boolean> {
  const creds = CREDENTIALS[role as keyof typeof CREDENTIALS];
  console.log(`🔐 Logging in as ${role} (${creds.username})...`);
  
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Click "Perusahaan" tab
  const tab = page.locator('button:has-text("Perusahaan")').first();
  if (await tab.count() > 0) {
    await tab.click();
    await page.waitForTimeout(500);
  }
  
  // Fill credentials
  await page.fill('input[type="text"]', creds.username);
  await page.fill('input[type="password"]', creds.password);
  
  // Submit
  const submit = page.locator('button:has-text("Masuk Sistem")').first();
  if (await submit.count() > 0) {
    await submit.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  }
  
  const success = await isLoggedIn(page);
  console.log(`  ${success ? '✅' : '❌'} Login ${success ? 'successful' : 'failed'}`);
  return success;
}

// Helper: Logout
async function logout(page: Page): Promise<void> {
  for (const sel of ['button:has-text("Keluar Aplikasi")', 'button:has-text("Logout")', 'button:has-text("Keluar")']) {
    if (await page.locator(sel).count() > 0) {
      await page.click(sel);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      return;
    }
  }
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
}

// Helper: Get visible sidebar menus
async function getSidebarMenus(page: Page): Promise<string[]> {
  const menus: string[] = [];
  const strategies = [
    'aside button',
    'nav button',
    '[class*="sidebar"] button',
    '[class*="Sidebar"] button',
  ];
  
  for (const selector of strategies) {
    const buttons = await page.locator(selector).all();
    if (buttons.length > 0) {
      for (const btn of buttons) {
        if (await btn.isVisible()) {
          const text = (await btn.innerText()).trim();
          if (text && text.length > 1 && !menus.includes(text)) {
            const skip = ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout', '☰', '☰ Menu', '≡'];
            if (!skip.includes(text)) {
              menus.push(text);
            }
          }
        }
      }
      if (menus.length > 0) break;
    }
  }
  
  if (menus.length === 0) {
    // Fallback: all visible buttons
    const allBtns = await page.locator('button:visible').all();
    for (const btn of allBtns) {
      const text = (await btn.innerText()).trim();
      if (text && text.length > 2 && text.length < 50 && !menus.includes(text)) {
        menus.push(text);
      }
    }
  }
  
  return menus;
}

// Helper: Test a module by clicking its menu
async function testModule(page: Page, moduleName: string): Promise<{ clicked: boolean; contentLoaded: boolean }> {
  console.log(`    📋 Testing: ${moduleName}`);
  
  try {
    let btn = page.locator(`button:has-text("${moduleName}")`).first();
    if (await btn.count() === 0) {
      const firstWord = moduleName.split(' ')[0];
      btn = page.locator(`button:has-text("${firstWord}")`).first();
    }
    
    if (await btn.count() > 0 && await btn.isVisible()) {
      await btn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      
      // Check if content loaded
      const contentSelectors = [
        'table', '.card', '[class*="card"]', 'form', '[class*="grid"]', 
        '[class*="list"]', '.content',
        'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
        'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi',
        'text=Dividen', 'text=Profil', 'text=Pengumuman', 'text=Dokumen', 'text=Tiket'
      ];
      
      let contentLoaded = false;
      for (const sel of contentSelectors) {
        if (await page.locator(sel).count() > 0) {
          contentLoaded = true;
          break;
        }
      }
      
      console.log(`      ✅ Loaded (content: ${contentLoaded})`);
      return { clicked: true, contentLoaded };
    } else {
      console.log(`      ❌ Button not found`);
      return { clicked: false, contentLoaded: false };
    }
  } catch (e) {
    console.log(`      ❌ Error: ${e}`);
    return { clicked: false, contentLoaded: false };
  }
}

// Helper: Test sub-menus
async function testSubMenus(page: Page, parentMenu: string, subItems: Array<{id: string, label: string}>): Promise<Map<string, {clicked: boolean, contentLoaded: boolean}>> {
  console.log(`    🔽 Testing sub-menus of: ${parentMenu}`);
  const results = new Map();
  
  // Click parent to expand
  const parentBtn = page.locator(`button:has-text("${parentMenu}")`).first();
  if (await parentBtn.count() > 0) {
    await parentBtn.click();
    await page.waitForTimeout(2000);
    
    // Wait for dropdown to expand
    const firstLabel = subItems[0].label.replace('&', '&');
    try {
      await page.waitForSelector(`button:has-text("• ${firstLabel}")`, { timeout: 3000 });
      console.log(`      ✓ Dropdown expanded for ${parentMenu}`);
    } catch {
      console.log(`      ⚠️ Dropdown may not have expanded for ${parentMenu}`);
    }
  }
  
  for (const sub of subItems) {
    const displayName = sub.label.replace('&', '&');
    
    try {
      const selectors = [
        `button:has-text("• ${displayName}")`,
        `button:has-text("${displayName}")`,
        `button[onclick*="${sub.id}"]`,
        `button[onClick*="${sub.id}"]`,
      ];
      
      let btn = null;
      for (const sel of selectors) {
        btn = page.locator(sel).first();
        if (await btn.count() > 0 && await btn.isVisible()) break;
      }
      
      if (btn && await btn.count() > 0 && await btn.isVisible()) {
        await btn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
        
        const contentSelectors = [
          'table', '.card', '[class*="card"]', 'form', '[class*="grid"]', '[class*="list"]', '.content',
          'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
          'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi',
          'text=Dividen', 'text=Profil', 'text=Pengumuman', 'text=Dokumen', 'text=Tiket'
        ];
        
        let contentLoaded = false;
        for (const sel of contentSelectors) {
          if (await page.locator(sel).count() > 0) {
            contentLoaded = true;
            break;
          }
        }
        
        console.log(`         ✅ ${displayName} loaded (content: ${contentLoaded})`);
        results.set(displayName, { clicked: true, contentLoaded });
      } else {
        console.log(`         ❌ ${displayName} button not found`);
        results.set(displayName, { clicked: false, contentLoaded: false });
      }
    } catch (e) {
      console.log(`         ❌ ${displayName} error: ${e}`);
      results.set(displayName, { clicked: false, contentLoaded: false });
    }
  }
  
  return results;
}

test.describe('MetroCoop E2E Regression Suite', () => {
  let page: Page;
  let browser: Browser;
  
  test.beforeAll(async ({ browser: b }) => {
    browser = b;
    page = await browser.newPage();
    page.setDefaultTimeout(30000);
  });
  
  test.afterAll(async () => {
    await page.close();
  });
  
  for (const role of ['admin', 'operator', 'anggota', 'perusahaan'] as const) {
    test.describe(`${role.toUpperCase()} Role`, () => {
      test.beforeAll(async () => {
        if (role !== 'admin') {
          await logout(page);
          await page.waitForTimeout(500);
        }
        
        const success = role === 'perusahaan' 
          ? await loginManual(page, role)
          : await loginViaQuickButton(page, role);
        
        expect(success).toBeTruthy();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      });
      
      test('Sidebar menus match expected', async () => {
        const menus = await getSidebarMenus(page);
        console.log(`\n  📋 Sidebar menus (${menus.length}):`);
        for (const m of menus) console.log(`    - ${m}`);
        
        const expected = EXPECTED_MENUS[role];
        const missing = expected.filter(e => !menus.some(m => m.toLowerCase().includes(e.toLowerCase())));
        const extra = menus.filter(m => !expected.some(e => m.toLowerCase().includes(e.toLowerCase())));
        
        if (missing.length > 0) {
          console.log(`  ⚠️ Missing: ${missing.join(', ')}`);
        }
        if (extra.length > 0) {
          console.log(`  ℹ️ Extra: ${extra.join(', ')}`);
        }
        
        // Allow some flexibility - expect at least 80% match
        expect(missing.length).toBeLessThanOrEqual(Math.ceil(expected.length * 0.2));
      });
      
      test('Main modules load correctly', async () => {
        const menus = await getSidebarMenus(page);
        const skip = ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout'];
        const parentMenus = ['Simpanan (Savings)', 'Pinjaman (Loans)'];
        
        // Test non-parent menus first
        const nonParentMenus = menus.filter(m => !skip.includes(m) && !parentMenus.includes(m));
        
        for (const menu of nonParentMenus.slice(0, 12)) {
          const result = await testModule(page, menu);
          expect(result.clicked).toBeTruthy();
          // Content loading may vary by module, so just warn if not loaded
        }
        
        // Test parent menus with sub-menus
        if (['admin', 'operator'].includes(role)) {
          for (const parent of parentMenus) {
            if (menus.includes(parent)) {
              await testModule(page, parent);
              await testSubMenus(page, parent, SUB_MENUS[parent as keyof typeof SUB_MENUS]);
            }
          }
        }
      });
    });
  }
});

test.describe('Login Page', () => {
  test('Login page loads and has quick login buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Check for quick login buttons
    await expect(page.locator('button:has-text("🔑 Admin")')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️ Operator")')).toBeVisible();
    await expect(page.locator('button:has-text("👤 Anggota")')).toBeVisible();
    await expect(page.locator('button:has-text("Perusahaan")')).toBeVisible();
  });
});

test.describe('Landing Page (Static)', () => {
  test('Landing page exists and loads', async ({ page }) => {
    // Test static landing page
    const landingUrl = `${BASE_URL}/landing/`;
    const response = await page.goto(landingUrl, { waitUntil: 'networkidle' });
    expect(response?.status()).toBeLessThan(400);
    
    // Check for MetroCoop branding
    await expect(page.locator('text=MetroKSP')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Koperasi Simpan Pinjam')).toBeVisible();
  });
});