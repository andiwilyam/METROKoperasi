/**
 * E2E Test: Sidebar navigation and module loading
 */
import { test, expect } from '@playwright/test';

const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123' },
  operator: { username: 'operator', password: 'admin123' },
  anggota: { username: '1234567890', password: '123456' },
  perusahaan: { username: 'hijau_agri', password: 'perusahaan123' },
};

// Core menus that should always be present (not feature-flagged)
const CORE_MENUS = {
  admin: [
    'Dashboard Utama', 'Manajemen Anggota', 'Simpanan (Savings)', 'Pinjaman (Loans)',
    'Unit Toko (POS)', 'Tiket & Pengaduan', 'Data Master Organisasi',
    'Pengaturan Koperasi', 'Kustomisasi Tema', 'Landing Page Editor'
  ],
  operator: [
    'Dashboard Utama', 'Manajemen Anggota', 'Simpanan (Savings)', 'Pinjaman (Loans)',
    'Unit Toko (POS)', 'Tiket & Pengaduan', 'Data Master Organisasi'
  ],
  anggota: [
    'Ringkasan Dashboard', 'Simpanan Saya', 'Pinjaman Saya', 'Mutasi Rekening',
    'Pengajuan Pinjam / Tarik', 'Tiket Bantuan (Helpdesk)', 'Kirim Bukti Transfer',
    'Ubah Profil Saya'
  ],
  perusahaan: [
    'Dashboard', 'Pipeline Investasi', 'Dividen & Bagi Hasil', 'Profil Perusahaan',
    'Pengumuman', 'Upload Dokumen', 'Tiket Bantuan'
  ]
};

// Optional/feature-flagged menus (may not be visible depending on config)
const OPTIONAL_MENUS = {
  admin: [
    'Unit Tambahan', 'Modul Dashboard', 'Data Perusahaan',
    'Pipeline Investasi', 'Pembukuan & Keuangan', 'Kelola Pengumuman'
  ],
  operator: [
    'Unit Tambahan', 'Modul Dashboard', 'Data Perusahaan',
    'Pipeline Investasi', 'Pembukuan & Keuangan', 'Kelola Pengumuman'
  ],
  anggota: [
    'Sewa Aset Koperasi', 'Loket PPOB & Pulsa', 'Virtual Account Deposit',
    'Kredit Cicilan Pengadaan'
  ],
  perusahaan: []
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

async function login(page, role) {
  const creds = CREDENTIALS[role as keyof typeof CREDENTIALS];
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  if (role === 'perusahaan') {
    await page.click('button:has-text("Perusahaan")');
    await page.fill('input[type="text"]', creds.username);
    await page.fill('input[type="password"]', creds.password);
    await page.click('button:has-text("Masuk Sistem")');
  } else {
    const quickButtons: Record<string, string> = {
      admin: '🔑 Admin',
      operator: '⚙️ Operator',
      anggota: '👤 Anggota',
    };
    await page.click(`button:has-text("${quickButtons[role]}")`);
    await page.waitForTimeout(500);
    await page.click('button:has-text("Masuk Sistem")');
  }
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

async function logout(page) {
  try {
    for (const sel of ['button:has-text("Keluar Aplikasi")', 'button:has-text("Logout")', 'button:has-text("Keluar")']) {
      if (await page.locator(sel).count() > 0) {
        await page.click(sel);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        return true;
      }
    }
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    return true;
  } catch {
    return false;
  }
}

async function getSidebarMenus(page) {
  const menus = [];
  const strategies = ['aside button', 'nav button', '[class*="sidebar"] button', '[class*="Sidebar"] button'];
  
  for (const selector of strategies) {
    const buttons = page.locator(selector);
    const count = await buttons.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
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
  
  return menus;
}

async function clickMenu(page, menuName) {
  const btn = page.locator(`button:has-text("${menuName}")`).first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    return true;
  }
  return false;
}

async function clickSubMenu(page, parentMenu, subLabel) {
  // Parent should already be clicked and expanded
  await page.waitForTimeout(500);
  
  // Try HTML entity version first
  const labelHtml = subLabel.replace('&', '&');
  const selectors = [
    `button:has-text("• ${labelHtml}")`,
    `button:has-text("• ${subLabel}")`,
    `button:has-text("${labelHtml}")`,
    `button:has-text("${subLabel}")`,
  ];
  
  for (const sel of selectors) {
    const btn = page.locator(sel).first();
    if (await btn.count() > 0 && await btn.isVisible()) {
      await btn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      return true;
    }
  }
  return false;
}

async function verifyContentLoaded(page) {
  const indicators = [
    'table', '.card', '[class*="card"]', 'form', '[class*="grid"]', '[class*="list"]', '.content',
    'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
    'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi',
    'text=Dividen', 'text=Profil', 'text=Pengumuman', 'text=Dokumen', 'text=Tiket'
  ];
  
  for (const sel of indicators) {
    if (await page.locator(sel).count() > 0) {
      return true;
    }
  }
  return false;
}

test.describe('Sidebar Navigation', () => {
  for (const [role, coreMenus] of Object.entries(CORE_MENUS)) {
    test.describe(`${role} role`, () => {
      test.beforeEach(async ({ page }) => {
        await login(page, role);
      });
      
      test.afterEach(async ({ page }) => {
        await logout(page);
      });
      
      test('should display all core sidebar menus', async ({ page }) => {
        const foundMenus = await getSidebarMenus(page);
        
        // Check all CORE menus are present
        for (const expected of coreMenus) {
          const found = foundMenus.some(m => m.toLowerCase().includes(expected.toLowerCase()));
          expect(found, `Expected core menu "${expected}" not found`).toBeTruthy();
        }
        
        // Check optional menus - just log if found
        const optionalMenus = OPTIONAL_MENUS[role as keyof typeof OPTIONAL_MENUS] || [];
        for (const optional of optionalMenus) {
          const found = foundMenus.some(m => m.toLowerCase().includes(optional.toLowerCase()));
          if (found) {
            console.log(`  ✓ Optional menu found: ${optional}`);
          } else {
            console.log(`  ℹ️ Optional menu not visible (feature flag?): ${optional}`);
          }
        }
      });
      
      test('should load content for each main menu', async ({ page }) => {
        const foundMenus = await getSidebarMenus(page);
        const skip = ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout'];
        const testMenus = foundMenus.filter(m => !skip.includes(m)).slice(0, 10);
        
        for (const menu of testMenus) {
          const clicked = await clickMenu(page, menu);
          expect(clicked, `Failed to click menu: ${menu}`).toBeTruthy();
          
          const loaded = await verifyContentLoaded(page);
          expect(loaded, `Content not loaded for: ${menu}`).toBeTruthy();
        }
      });
      
      if (role === 'admin' || role === 'operator') {
        test('should expand and load Simpanan sub-menus', async ({ page }) => {
          const parent = 'Simpanan (Savings)';
          const clicked = await clickMenu(page, parent);
          expect(clicked).toBeTruthy();
          
          for (const sub of SUB_MENUS[parent]) {
            const subClicked = await clickSubMenu(page, parent, sub.label);
            expect(subClicked, `Failed to click sub-menu: ${sub.label}`).toBeTruthy();
            
            const loaded = await verifyContentLoaded(page);
            expect(loaded, `Content not loaded for sub-menu: ${sub.label}`).toBeTruthy();
          }
        });
        
        test('should expand and load Pinjaman sub-menus', async ({ page }) => {
          const parent = 'Pinjaman (Loans)';
          const clicked = await clickMenu(page, parent);
          expect(clicked).toBeTruthy();
          
          for (const sub of SUB_MENUS[parent]) {
            const subClicked = await clickSubMenu(page, parent, sub.label);
            expect(subClicked, `Failed to click sub-menu: ${sub.label}`).toBeTruthy();
            
            const loaded = await verifyContentLoaded(page);
            expect(loaded, `Content not loaded for sub-menu: ${sub.label}`).toBeTruthy();
          }
        });
      }
    });
  }
});