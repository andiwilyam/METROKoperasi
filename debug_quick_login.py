#!/usr/bin/env python3
"""
Debug quick-login button behavior
"""

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    print("=== BEFORE clicking quick login ===")
    inputs = page.locator('input').all()
    for i, inp in enumerate(inputs):
        print(f"  Input {i}: value='{inp.input_value()}'")
    
    # Click admin quick login
    quick_btn = page.locator('button:has-text("🔑 Admin")').first
    print(f"\nClicking: {quick_btn.inner_text()[:50]}")
    quick_btn.click()
    page.wait_for_timeout(1000)
    
    print("\n=== AFTER clicking quick login ===")
    inputs = page.locator('input').all()
    for i, inp in enumerate(inputs):
        print(f"  Input {i}: value='{inp.input_value()}'")
    
    # Check if submit button is there
    submit = page.locator('button:has-text("Masuk Sistem")')
    print(f"\nSubmit button exists: {submit.count() > 0}, enabled: {submit.is_enabled() if submit.count() > 0 else 'N/A'}")
    
    # Click submit
    print("\nClicking submit...")
    submit.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)
    
    print(f"\n=== AFTER submit ===")
    print(f"URL: {page.url}")
    print(f"Title: {page.title()}")
    
    # Check for dashboard elements
    for sel in ['text=Dashboard', 'text=Kesehatan Koperasi', 'aside', 'nav', 'button:has-text("Keluar Aplikasi")']:
        el = page.locator(sel)
        print(f"  {sel}: count={el.count()}")
    
    page.screenshot(path="/tmp/after_login.png", full_page=True)
    print("\n📸 Screenshot saved")
    
    browser.close()