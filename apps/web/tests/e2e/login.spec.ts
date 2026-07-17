/**
 * E2E Test: Login flows for all 4 roles
 */
import { test, expect } from '@playwright/test';

const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123' },
  operator: { username: 'operator', password: 'admin123' },
  anggota: { username: '1234567890', password: '123456' },
  perusahaan: { username: 'hijau_agri', password: 'perusahaan123' },
};

const QUICK_LOGIN_BUTTONS = {
  admin: '🔑 Admin',
  operator: '⚙️ Operator',
  anggota: '👤 Anggota',
};

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  for (const [role, creds] of Object.entries(CREDENTIALS)) {
    test(`should login as ${role}`, async ({ page }) => {
      // Perusahaan role has no quick login button
      if (role === 'perusahaan') {
        await page.click('button:has-text("Perusahaan")');
        await page.fill('input[type="text"]', creds.username);
        await page.fill('input[type="password"]', creds.password);
        await page.click('button:has-text("Masuk Sistem")');
      } else {
        // Use quick login button
        const quickText = QUICK_LOGIN_BUTTONS[role as keyof typeof QUICK_LOGIN_BUTTONS];
        await page.click(`button:has-text("${quickText}")`);
        await page.waitForTimeout(500);
        await page.click('button:has-text("Masuk Sistem")');
      }
      
      // Wait for dashboard to render (avoid networkidle: loadAllData fires 40+ fire-and-forget fetches)
      await expect(page.locator('aside, nav, button:has-text("Keluar Aplikasi")').first()).toBeVisible({ timeout: 15000 });
    });
  }
});