from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/dashboard"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page_errors = []
    api_errs = []
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.on("response", lambda r: api_errs.append(f"[{r.status}] {r.url}") if r.status >= 400 else None)

    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(1500)
    page.locator('input[placeholder*="username"]').first.fill("admin")
    page.locator('input[type="password"]').first.fill("admin123")
    page.locator('button[type="submit"]').first.click()
    page.wait_for_timeout(3000)

    print("=== API ERRORS ===")
    for e in api_errs: print(f"  {e}")
    print("=== PAGE ERRORS ===")
    for e in page_errors: print(f"  {e}")

    for label in ['Data Perusahaan', 'Pipeline Investasi', 'Modul Dashboard']:
        el = page.locator(f'button:has-text("{label}")').first
        if el.is_visible():
            el.click()
            page.wait_for_timeout(2000)
            body = page.locator('body').inner_text()
            lines = [l.strip() for l in body.split('\n') if l.strip()]
            print(f"\n=== '{label}' ===")
            print("  Last 25 lines:")
            for l in lines[-25:]:
                print(f"  {l}")
        else:
            print(f"\n=== '{label}' not visible ===")

    browser.close()
