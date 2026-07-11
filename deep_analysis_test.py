#!/usr/bin/env python3
"""
Deep Analysis Test Suite for MetroCoop Web Application
Tests: Login flows (4 roles), Sidebar navigation, All major modules, Error detection
"""

from playwright.sync_api import sync_playwright
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:3000"

# Test credentials for 4 roles
CREDENTIALS = {
    "admin": {"username": "admin", "password": "admin123", "tab": "admin"},
    "operator": {"username": "operator", "password": "admin123", "tab": "admin"},
    "anggota": {"username": "1234567890", "password": "123456", "tab": "member"},
    "perusahaan": {"username": "hijau_agri", "password": "perusahaan123", "tab": "perusahaan"},
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

# Sub-menus to test
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

def login(page, role):
    """Login with specific role credentials"""
    creds = CREDENTIALS[role]
    print(f"\n🔐 Logging in as {role}...")
    
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    
    # Click appropriate tab
    tab_button = page.locator(f'button:has-text("{creds["tab"]}")').first
    if tab_button.count() > 0:
        tab_button.click()
        page.wait_for_timeout(500)
    
    # Fill credentials
    page.fill('input[type="text"], input[name="username"]', creds["username"])
    page.fill('input[type="password"]', creds["password"])
    
    # Submit
    page.click('button:has-text("Masuk Sistem"), button[type="submit"]')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # Verify login success
    try:
        page.wait_for_selector('text=Dashboard', timeout=5000)
        print(f"  ✅ Login successful as {role}")
        return True
    except:
        print(f"  ❌ Login failed as {role}")
        return False

def logout(page):
    """Logout from current session"""
    try:
        page.click('button:has-text("Keluar Aplikasi"), button:has-text("Logout"), text=Keluar')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)
        print("  🚪 Logged out")
    except:
        pass

def get_sidebar_menus(page):
    """Extract all visible sidebar menu items"""
    menus = []
    # Try multiple selectors for sidebar buttons
    selectors = [
        'aside button',
        '.sidebar button',
        '[class*="sidebar"] button',
        'nav button',
        'button[role="menuitem"]'
    ]
    
    for sel in selectors:
        buttons = page.locator(sel).all()
        if buttons:
            for btn in buttons:
                if btn.is_visible():
                    text = btn.inner_text().strip()
                    if text and text not in menus:
                        menus.append(text)
            break
    
    return menus

def test_module(page, module_name, expected_content=None):
    """Test a specific module by clicking its menu"""
    print(f"    📋 Testing module: {module_name}")
    
    try:
        # Click the menu button
        btn = page.locator(f'button:has-text("{module_name}")').first
        if btn.count() == 0:
            # Try partial match
            btn = page.locator(f'button:has-text("{module_name.split(" ")[0]}")').first
        
        if btn.count() > 0:
            btn.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)
            
            # Check for errors in console
            errors = []
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            
            # Verify content loads
            content_loaded = True
            if expected_content:
                try:
                    page.wait_for_selector(f'text={expected_content}', timeout=3000)
                except:
                    content_loaded = False
            
            # Take screenshot
            screenshot_path = f"/tmp/metrocoop_{module_name.replace(' ', '_').replace('(', '').replace(')', '').lower()}.png"
            page.screenshot(path=screenshot_path, full_page=True)
            
            result = {
                "module": module_name,
                "clicked": True,
                "content_loaded": content_loaded,
                "console_errors": errors,
                "screenshot": screenshot_path
            }
            
            if errors:
                results["errors_found"].append({
                    "module": module_name,
                    "errors": errors
                })
                print(f"      ⚠️  Console errors: {errors}")
            
            print(f"      ✅ Module loaded (content: {content_loaded})")
            return result
        else:
            print(f"      ❌ Button not found")
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
    
    # Click parent to expand
    parent_btn = page.locator(f'button:has-text("{parent_menu}")').first
    if parent_btn.count() > 0:
        parent_btn.click()
        page.wait_for_timeout(500)
    
    for sub in sub_menus:
        result = test_module(page, sub)
        sub_results[sub] = result
    
    return sub_results

def run_deep_analysis():
    """Main test runner"""
    print("=" * 60)
    print("🚀 METROCOOP DEEP ANALYSIS TEST SUITE")
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
            "location": msg.location
        }))
        
        # Capture page errors
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        
        for role in ["admin", "operator", "anggota", "perusahaan"]:
            print(f"\n{'='*60}")
            print(f"🧪 TESTING ROLE: {role.upper()}")
            print(f"{'='*60}")
            
            # Login
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
            page.wait_for_timeout(1500)
            
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
                print(f"  ℹ️  Extra menus not in expected: {extra}")
            
            results["sidebar_tests"][role] = {
                "found": sidebar_menus,
                "expected": expected,
                "missing": missing,
                "extra": extra
            }
            
            # Test each main module
            print(f"\n  🔬 Testing main modules...")
            module_results = {}
            
            for menu in sidebar_menus[:10]:  # Test first 10 to avoid timeout
                if menu in ["Ganti Tema", "Keluar Aplikasi"]:
                    continue
                result = test_module(page, menu)
                module_results[menu] = result
            
            # Test sub-menus for admin/operator
            if role in ["admin", "operator"]:
                for parent, subs in SUB_MENUS.items():
                    if parent in sidebar_menus:
                        sub_results = test_sub_menus(page, parent, subs)
                        module_results[f"{parent} (subs)"] = sub_results
            
            results["module_tests"][role] = module_results
            
            # Logout
            logout(page)
            page.wait_for_timeout(500)
        
        # Final screenshot of login page
        page.goto(f"{BASE_URL}/login")
        page.wait_for_load_state('networkidle')
        page.screenshot(path="/tmp/metrocoop_final_login.png", full_page=True)
        results["screenshots"].append("/tmp/metrocoop_final_login.png")
        
        # Summary
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
        print(f"  - {e.get('role', e.get('module', 'Unknown'))}: {e.get('error', e.get('errors', 'Unknown'))}")
    
    # Save detailed results
    output_file = f"/tmp/metrocoop_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Detailed results saved to: {output_file}")
    
    return results

if __name__ == "__main__":
    run_deep_analysis()