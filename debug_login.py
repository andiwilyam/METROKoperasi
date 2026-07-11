#!/usr/bin/env python3
"""
Debug login page structure
"""

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # Visible for debugging
    page = browser.new_page()
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    print("=== PAGE URL ===")
    print(page.url)
    
    print("\n=== ALL INPUTS ===")
    inputs = page.locator('input').all()
    for i, inp in enumerate(inputs):
        print(f"  [{i}] type={inp.get_attribute('type')} name={inp.get_attribute('name')} id={inp.get_attribute('id')} placeholder={inp.get_attribute('placeholder')}")
    
    print("\n=== ALL BUTTONS ===")
    buttons = page.locator('button').all()
    for i, btn in enumerate(buttons):
        print(f"  [{i}] text='{btn.inner_text()}' class={btn.get_attribute('class')}")
    
    print("\n=== ALL TABS/ROLE BUTTONS ===")
    tabs = page.locator('button:has-text("Admin"), button:has-text("Operator"), button:has-text("Anggota"), button:has-text("Perusahaan")').all()
    for i, tab in enumerate(tabs):
        print(f"  [{i}] text='{tab.inner_text()}' class={tab.get_attribute('class')}")
    
    print("\n=== FULL HTML (first 5000 chars) ===")
    print(page.content()[:5000])
    
    # Take screenshot
    page.screenshot(path="/tmp/login_debug.png", full_page=True)
    print("\n📸 Screenshot saved to /tmp/login_debug.png")
    
    browser.close()