from playwright.sync_api import sync_playwright
import time

URL = "http://localhost:3000/dashboard"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    msgs = []
    errors = []
    page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text}"))
    page.on("pageerror", lambda e: errors.append(f"[PAGEERROR] {e}"))
    page.on("response", lambda r: msgs.append(f"[API {r.status}] {r.url}"))

    # 1. Navigate to a non-root path to trigger LoginScreen
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path="pw_login_page.png", full_page=True)

    # 2. Fill login form (admin tab is default)
    # Username placeholder: "Masukkan username (misal: admin)"
    username_input = page.locator('input[placeholder*="username"], input[placeholder*="Username"]')
    password_input = page.locator('input[type="password"]')
    print(f"Username inputs found: {username_input.count()}")
    print(f"Password inputs found: {password_input.count()}")

    if username_input.count() > 0:
        username_input.first.fill("admin")
        password_input.first.fill("admin123")
        # 3. Click submit button
        submit_btn = page.locator('button[type="submit"]')
        print(f"Submit buttons: {submit_btn.count()}")
        if submit_btn.count() > 0:
            submit_btn.first.click()
        else:
            # try any button that says Masuk/Login
            page.locator('button:has-text("Masuk")').first.click()

        page.wait_for_timeout(3000)
        page.screenshot(path="pw_after_login.png", full_page=True)

        # 4. Now we should be in the dashboard. Try clicking Ventura sidebar
        print("=== PAGE TITLE ===", page.title())
        content = page.content()
        has_dashboard = "Dashboard" in content or "dashboard" in content.lower()
        print("Has dashboard text:", has_dashboard)

        # Try various selectors for sidebar menu
        ventura_links = page.locator('text=Investasi')
        print(f"'Investasi' links: {ventura_links.count()}")
        if ventura_links.count() == 0:
            ventura_links = page.locator('text=Penyertaan')
            print(f"'Penyertaan' links: {ventura_links.count()}")
        if ventura_links.count() == 0:
            ventura_links = page.locator('text=Ventura')
            print(f"'Ventura' links: {ventura_links.count()}")
        if ventura_links.count() > 0:
            ventura_links.first.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="pw_ventura_page.png", full_page=True)
        else:
            # dump all text to find the sidebar
            all_texts = page.locator('a, button, span').all_inner_texts()
            ventura_texts = [t for t in all_texts if 'ventura' in t.lower() or 'investasi' in t.lower() or 'penyertaan' in t.lower()]
            print(f"Ventura-related texts found: {ventura_texts}")
            # dump full body text
            body_text = page.locator('body').inner_text()
            print(f"BODY TEXT (first 2000): {body_text[:2000]}")
    else:
        # Maybe we're on landing page, check
        page.screenshot(path="pw_no_login_form.png", full_page=True)
        body_text = page.locator('body').inner_text()
        print(f"BODY TEXT (first 2000): {body_text[:2000]}")

        # Try going to /login
        page.goto("http://localhost:3000/login", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path="pw_login_page2.png", full_page=True)
        username_input = page.locator('input[placeholder*="username"], input[placeholder*="Username"]')
        print(f"Username inputs on /login: {username_input.count()}")
        if username_input.count() > 0:
            username_input.first.fill("admin")
            page.locator('input[type="password"]').first.fill("admin123")
            page.locator('button[type="submit"]').first.click()
            page.wait_for_timeout(3000)
            page.screenshot(path="pw_after_login2.png", full_page=True)

    print("\n=== CONSOLE / ERRORS ===")
    for m in msgs:
        print("  ", m[:300])
    for e in errors:
        print("  ", e)
    browser.close()
