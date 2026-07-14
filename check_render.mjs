const playwright = require('playwright');
(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const html = await page.content();
  const hasCreds = html.includes('Test Credentials');
  const hasAdmin = html.includes('admin');
  console.log('Has Test Credentials:', hasCreds);
  console.log('Has admin text:', hasAdmin);
  // screenshot to confirm visual
  await page.screenshot({ path: 'login_page.png', fullPage: true });
  console.log('Screenshot saved: login_page.png');
  await browser.close();
})();
