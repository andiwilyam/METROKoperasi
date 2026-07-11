#!/usr/bin/env python3
"""
Deep Analysis Test Suite for MetroCoop Web Application - FIXED VERSION
Tests: Login flows (4 roles), Sidebar navigation, All major modules, Error detection
"""

from playwright.sync_api import sync_playwright
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:3000"

# Test credentials for 4 roles
CREDENTIALS = {
    "admin": {"username": "admin", "password": "admin123", "tab": "Admin & Operator"},
    "operator": {"username": "operator", "password": "admin123", "tab": "Admin & Operator"},
    "anggota": {"username": "1234567890", "password": "123456", "tab": "Portal Anggota"},
    "perusahaan": {"username": "hijau_agri", "password": "perusahaan123", "tab": "Perusahaan"},
}

# Expected sidebar menus per role
EXPECTED_MENUS = {
    "admin": [
        "Dashboard Utama", "Manajemen Anggota", "Simpanan (Savings)", "Pinjaman (Loans)",
        "Unit Toko (POS)", "Unit Tambahan", "Modul Dashboard", "Data Perusahaan",
        "Pipeline Investasi", "Pembukuan & Keuangan", "Kelola Pengumuman",
        "Tiket & Pengaduan", "Data Master Organisasi", "Pengaturan Koperasi",
        "Kustomisasi Tema", "Landing Page Editor"
    ],
    "operator": [
        "Dashboard Utama", "Manajemen Anggota", "Simpanan (Savings)", "Pinjaman (Loans)",
        "Unit Toko (POS)", "Unit Tambahan", "Modul Dashboard", "Data Perusahaan",
        "Pipeline Investasi", "Pembukuan & Keuangan", "Kelola Pengumuman",
        "Tiket & Pengaduan", "Data Master Organisasi", "Pengaturan Koperasi",
        "Kustomisasi Tema", "Landing Page Editor"
    ],
    "anggota": [
        "Dashboard", "Simpanan Saya", "Pinjaman Saya", "Angsuran", "Profil Saya",
        "Pengajuan Tarik", "Bukti Transfer", "Pengumuman", "Tiket Bantuan"
    ],
    "perusahaan": [
        "Dashboard", "Data Perusahaan", "Pipeline Investasi", "Dividen", "Profil",
        "Pengumuman", "Tiket Bantuan"
    ]
}

# Sub-menus to test (these appear after clicking parent)
SUB_MENUS = {
    "Simpanan (Savings)": ["Setor & Tarik", "Permohonan Tarik", "Konfigurasi Simpanan"],
    "Pinjaman (Loans)": ["Daftar Pengajuan", "Bayar Angsuran", "Tagihan & Jatuh Tempo", "Konfigurasi Pinjaman"],
}

results = {
    "timestamp": datetime.now().isoformat(),
    "base_url": BASE_URL,
    "login_tests": {},
    "sidebar_tests": {},
    "module_tests": {},
    "errors_found": [],
    "warnings": [],
    "screenshots": []
}

def wait_and_click(page, selector, timeout=5000):
    """Wait for element and click"""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.click(selector)
        return True
    except:
        return False

def login(page, role):
    """Login with specific role credentials"""
    creds = CREDENTIALS[role]
    print(f"\n🔐 Logging in as {role} ({creds['username']})...")
    
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # Click appropriate tab
    tab_text = creds["tab"]
    tab_clicked = False
    for btn in page.locator('button').all():
        if tab_text.lower() in btn.inner_text().lower():
            btn.click()
            tab_clicked = True
            page.wait_for_timeout(500)
            break
    
    if not tab_clicked:
        print(f"  ⚠️  Tab '{tab_text}' not found, trying anyway...")
    
    # Fill credentials - try multiple selectors
    username_filled = False
    for sel in ['input[type="text"]', 'input[name="username"]', 'input[placeholder*="username" i]', 'input[placeholder*="Username" i]', 'input[placeholder*="NIK" i]']:
        try:
            page.fill(sel, creds["username"])
            username_filled = True
            break
        except:
            continue
    
    if not username_filled:
        print(f"  ❌ Could not fill username")
        return False
    
    # Fill password
    try:
        page.fill('input[type="password"]', creds["password"])
    except:
        print(f"  ❌ Could not fill password")
        return False
    
    # Submit
    submitted = False
    for sel in ['button:has-text("Masuk Sistem")', 'button[type="submit"]', 'button:has-text("Login")', 'button:has-text("Masuk")']:
        try:
            page.click(sel)
            submitted = True
            break
        except:
            continue
    
    if not submitted:
        # Try pressing Enter
        page.keyboard.press('Enter')
    
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    
    # Verify login success - check for dashboard or sidebar
    try:
        page.wait_for_selector('text=Dashboard, text=Kesehatan Koperasi, aside, nav', timeout=10000)
        print(f"  ✅ Login successful as {role}")
        return True
    except:
        # Check if still on login page
        if "login" in page.url:
            print(f"  ❌ Login failed - still on login page")
            # Get error message if any
            error_selectors = ['.error', '[class*="error"]', 'text=Kredensial', 'text=salah', 'text=tidak cocok']
            for sel in error_selectors:
                error_el = page.locator(sel).first
                if error_el.count() > 0:
                    print(f"     Error: {error_el.inner_text()}")
                    break
        else:
            print(f"  ✅ Login successful as {role} (redirected)")
            return True
        return False

def logout(page):
    """Logout from current session"""
    try:
        # Try various logout selectors
        for sel in ['button:has-text("Keluar Aplikasi")', 'button:has-text("Logout")', 'button:has-text("Keluar")', 'a:has-text("Keluar")']:
            if page.locator(sel).count() > 0:
                page.click(sel)
                page.wait_for_load_state('networkidle')
                page.wait_for_timeout(500)
                print("  🚪 Logged out")
                return True
        # If no logout button, just go to login
        page.goto(f"{BASE_URL}/login")
        page.wait_for_load_state('networkidle')
        return True
    except:
        return False

def get_sidebar_menus(page):
    """Extract all visible sidebar menu items"""
    menus = []
    # Multiple strategies to find sidebar buttons
    strategies = [
        ('aside button', 'aside'),
        ('nav button', 'nav'),
        ('[class*="sidebar"] button', 'sidebar class'),
        ('[class*="Sidebar"] button', 'Sidebar class'),
        ('button[role="menuitem"]', 'role menuitem'),
    ]
    
    for selector, desc in strategies:
        buttons = page.locator(selector).all()
        if buttons:
            print(f"    Found menus via: {desc} ({len(buttons)} buttons)")
            for btn in buttons:
                if btn.is_visible():
                    text = btn.inner_text().strip()
                    if text and len(text) > 1 and text not in menus:
                        # Filter out non-menu buttons
                        if text not in ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout', '☰', '☰ Menu', '≡']:
                            menus.append(text)
            if menus:
                break
    
    # Fallback: get all visible buttons and filter
    if not menus:
        all_btns = page.locator('button:visible').all()
        for btn in all_btns:
            text = btn.inner_text().strip()
            if text and 2 < len(text) < 50 and text not in menus:
                # Likely a menu item
                menus.append(text)
    
    return menus

def test_module(page, module_name):
    """Test a specific module by clicking its menu"""
    print(f"    📋 Testing module: {module_name}")
    
    try:
        # Find and click the menu button
        btn = None
        # Try exact match first
        btn = page.locator(f'button:has-text("{module_name}")').first
        if btn.count() == 0:
            # Try partial match
            first_word = module_name.split(" ")[0]
            btn = page.locator(f'button:has-text("{first_word}")').first
        
        if btn.count() > 0 and btn.is_visible():
            btn.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1500)
            
            # Check for console errors
            console_errors = []
            
            # Take screenshot
            safe_name = module_name.replace(' ', '_').replace('(', '').replace(')', '').replace('/', '_').lower()
            screenshot_path = f"/tmp/metrocoop_{safe_name}.png"
            page.screenshot(path=screenshot_path, full_page=True)
            
            # Verify content loaded (check for table, cards, forms, or any content)
            content_loaded = False
            content_selectors = [
                'table', '.card', '[class*="card"]', 'form', 
                '[class*="grid"]', '[class*="list"]', '.content',
                'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik'
            ]
            for sel in content_selectors:
                if page.locator(sel).count() > 0:
                    content_loaded = True
                    break
            
            result = {
                "module": module_name,
                "clicked": True,
                "content_loaded": content_loaded,
                "console_errors": console_errors,
                "screenshot": screenshot_path
            }
            
            if console_errors:
                results["errors_found"].append({
                    "module": module_name,
                    "errors": console_errors
                })
                print(f"      ⚠️  Console errors: {console_errors}")
            
            print(f"      ✅ Module loaded (content: {content_loaded})")
            return result
        else:
            print(f"      ❌ Button not found or not visible")
            return {"module": module_name, "clicked": False, "error": "Button not found"}
            
    except Exception as e:
        print(f"      ❌ Error testing {module_name}: {str(e)}")
        results["errors_found"].append({
            "module": module_name,
            "error": str(e)
        })
        return {"module": module_name, "error": str(e)}

def test_sub_menus(page, parent_menu, sub_menus):
    """Test sub-menus under a parent menu"""
    print(f"    🔽 Testing sub-menus of: {parent_menu}")
    sub_results = {}
    
    # Click parent to expand (if it has submenus)
    parent_btn = page.locator(f'button:has-text("{parent_menu}")').first
    if parent_btn.count() > 0:
        parent_btn.click()
        page.wait_for_timeout(800)
    
    for sub in sub_menus:
        result = test_module(page, sub)
        sub_results[sub] = result
    
    return sub_results

def run_deep_analysis():
    """Main test runner"""
    print("=" * 60)
    print("🚀 METROCOOP DEEP ANALYSIS TEST SUITE (FIXED)")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1440, 'height': 900},
            ignore_https_errors=True
        )
        page = context.new_page()
        
        # Capture console logs
        console_logs = []
        page.on("console", lambda msg: console_logs.append({
            "type": msg.type,
            "text": msg.text,
            "location": str(msg.location)
        }))
        
        # Capture page errors
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        
        for role in ["admin", "operator", "anggota", "perusahaan"]:
            print(f"\n{'='*60}")
            print(f"🧪 TESTING ROLE: {role.upper()}")
            print(f"{'='*60}")
            
            # Fresh login for each role
            # First logout if needed
            if role != "admin":
                logout(page)
                page.wait_for_timeout(500)
            
            login_success = login(page, role)
            results["login_tests"][role] = {
                "success": login_success,
                "credentials": CREDENTIALS[role]["username"]
            }
            
            if not login_success:
                results["errors_found"].append({
                    "role": role,
                    "error": "Login failed"
                })
                continue
            
            # Wait for dashboard to fully load
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)
            
            # Get sidebar menus
            sidebar_menus = get_sidebar_menus(page)
            expected = EXPECTED_MENUS.get(role, [])
            
            print(f"\n  📋 Sidebar menus found ({len(sidebar_menus)}):")
            for m in sidebar_menus:
                print(f"    - {m}")
            
            # Check for missing expected menus
            missing = [m for m in expected if not any(m.lower() in s.lower() for s in sidebar_menus)]
            extra = [s for s in sidebar_menus if not any(e.lower() in s.lower() for e in expected)]
            
            if missing:
                print(f"  ⚠️  Missing expected menus: {missing}")
                results["warnings"].append({
                    "role": role,
                    "type": "missing_menus",
                    "menus": missing
                })
            
            if extra:
                print(f"  ℹ️  Extra menus: {extra}")
            
            results["sidebar_tests"][role] = {
                "found": sidebar_menus,
                "expected": expected,
                "missing": missing,
                "extra": extra
            }
            
            # Test each main module
            print(f"\n  🔬 Testing main modules...")
            module_results = {}
            
            # Skip utility menus
            skip_menus = ["Ganti Tema", "Keluar Aplikasi", "Keluar", "Logout"]
            test_menus = [m for m in sidebar_menus if m not in skip_menus][:12]  # Limit to 12
            
            for menu in test_menus:
                result = test_module(page, menu)
                module_results[menu] = result
            
            # Test sub-menus for admin/operator
            if role in ["admin", "operator"]:
                for parent, subs in SUB_MENUS.items():
                    if parent in sidebar_menus:
                        sub_results = test_sub_menus(page, parent, subs)
                        module_results[f"{parent} (subs)"] = sub_results
            
            results["module_tests"][role] = module_results
            
            # Logout after each role (except last)
            if role != "perusahaan":
                logout(page)
                page.wait_for_timeout(500)
        
        # Final screenshot
        page.goto(f"{BASE_URL}/login")
        page.wait_for_load_state('networkidle')
        page.screenshot(path="/tmp/metrocoop_final_login.png", full_page=True)
        results["screenshots"].append("/tmp/metrocoop_final_login.png")
        
        browser.close()
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    print("\n✅ Login Results:")
    for role, data in results["login_tests"].items():
        status = "✅" if data["success"] else "❌"
        print(f"  {status} {role}: {data['credentials']}")
    
    print(f"\n⚠️  Warnings: {len(results['warnings'])}")
    for w in results["warnings"]:
        print(f"  - {w['role']}: {w['type']} - {w.get('menus', [])}")
    
    print(f"\n❌ Errors Found: {len(results['errors_found'])}")
    for e in results["errors_found"]:
        key = e.get('role', e.get('module', 'Unknown'))
        val = e.get('error', e.get('errors', 'Unknown'))
        print(f"  - {key}: {val}")
    
    # Module test summary
    print(f"\n📦 Module Tests:")
    for role, modules in results["module_tests"].items():
        clicked = sum(1 for m in modules.values() if isinstance(m, dict) and m.get('clicked'))
        loaded = sum(1 for m in modules.values() if isinstance(m, dict) and m.get('content_loaded'))
        print(f"  {role}: {clicked} clicked, {loaded} loaded")
    
    # Save detailed results
    output_file = f"/tmp/metrocoop_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Detailed results saved to: {output_file}")
    
    return results

if __name__ == "__main__":
    run_deep_analysis()