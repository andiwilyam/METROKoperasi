import { test, expect } from '@playwright/test';

const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123' },
  anggota: { username: '1234567890', password: '123456' },
};

async function quickLogin(page, role) {
  const creds = CREDENTIALS[role as keyof typeof CREDENTIALS];
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  if (role === 'admin') {
    await page.click('button:has-text("🔑 Admin")');
  } else {
    await page.click('button:has-text("👤 Anggota")');
  }
  await page.waitForTimeout(300);
  await page.click('button:has-text("Masuk Sistem")');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
}

test.describe('Smoke Tests - Critical Paths', () => {
  test('admin can access dashboard and key modules', async ({ page }) => {
    await quickLogin(page, 'admin');
    
    // Dashboard should load - check for sidebar or logout button
    await expect(page.locator('aside, nav, button:has-text("Keluar Aplikasi")').first()).toBeVisible({ timeout: 10000 });
    
    // Navigate to key modules
    const keyModules = ['Dashboard Utama', 'Manajemen Anggota', 'Simpanan (Savings)', 'Pinjaman (Loans)'];
    
    for (const module of keyModules) {
      await page.click(`button:has-text("${module}")`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);
      
      // Verify content loads
      await expect(page.locator('table, .card, [class*="card"], form, :text("Data"), :text("Daftar"), :text("Tabel")').first()).toBeVisible({ timeout: 5000 });
    }
  });
  
  test('anggota can access dashboard and savings', async ({ page }) => {
    await quickLogin(page, 'anggota');
    
    // Dashboard should load
    await expect(page.locator('aside, nav, button:has-text("Keluar Aplikasi")').first()).toBeVisible({ timeout: 10000 });
    
    // Test key member modules
    const keyModules = ['Ringkasan Dashboard', 'Simpanan Saya', 'Pinjaman Saya', 'Mutasi Rekening'];
    
    for (const module of keyModules) {
      await page.click(`button:has-text("${module}")`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);
      
      await expect(page.locator('table, .card, [class*="card"], form, :text("Data"), :text("Daftar"), :text("Saldo"), :text("Mutasi")').first()).toBeVisible({ timeout: 5000 });
    }
  });
  
  test('login page has quick login buttons', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('button:has-text("🔑 Admin")')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️ Operator")')).toBeVisible();
    await expect(page.locator('button:has-text("👤 Anggota")')).toBeVisible();
    await expect(page.locator('button:has-text("Perusahaan")')).toBeVisible();
    await expect(page.locator('button:has-text("Masuk Sistem")')).toBeVisible();
  });
});