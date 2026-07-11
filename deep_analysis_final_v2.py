#!/usr/bin/env python3
"""
Deep Analysis Test Suite for MetroCoop Web Application - FINAL VERSION
Tests: Login flows (4 roles), Sidebar navigation, All major modules, Error detection
"""

from playwright.sync_api import sync_playwright
import json
from datetime import datetime

BASE_URL = "http://localhost:3000"

# Test credentials for 4 roles
CREDENTIALS = {
    "admin": {"username": "admin", "password": "admin123"},
    "operator": {"username": "operator", "password": "admin123"},
    "anggota": {"username": "1234567890", "password": "123456"},
    "perusahaan": {"username": "hijau_agri", "password": "perusahaan123"},
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
        "Tiket & Pengaduan", "Data Master Organisasi"
    ],
    "anggota": [
        "Ringkasan Dashboard", "Simpanan Saya", "Pinjaman Saya", "Mutasi Rekening",
        "Pengajuan Pinjam / Tarik", "Tiket Bantuan (Helpdesk)", "Kirim Bukti Transfer",
        "Sewa Aset Koperasi", "Loket PPOB & Pulsa", "Virtual Account Deposit",
        "Kredit Cicilan Pengadaan", "Ubah Profil Saya"
    ],
    "perusahaan": [
        "Dashboard", "Pipeline Investasi", "Dividen & Bagi Hasil", "Profil Perusahaan",
        "Pengumuman", "Upload Dokumen", "Tiket Bantuan"
    ]
}

# Sub-menus with their internal IDs
# Note: Button text uses HTML entities (& for &)
SUB_MENUS = {
    "Simpanan (Savings)": {
        "expand_id": "simpanan",
        "items": [
            {"id": "simpanan_transaksi", "label": "Setor & Tarik"},  # HTML entity for &
            {"id": "simpanan_permohonan", "label": "Permohonan Tarik"},
            {"id": "simpanan_jenis", "label": "Konfigurasi Simpanan"},
        ]
    },
    "Pinjaman (Loans)": {
        "expand_id": "pinjaman",
        "items": [
            {"id": "pinjaman_pengajuan", "label": "Daftar Pengajuan"},
            {"id": "pinjaman_angsuran", "label": "Bayar Angsuran"},
            {"id": "pinjaman_tagihan", "label": "Tagihan & Jatuh Tempo"},  # HTML entity for &
            {"id": "pinjaman_konfigurasi", "label": "Konfigurasi Pinjaman"},
        ]
    },
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

def is_logged_in(page):
    """Check if user is logged in by looking for dashboard indicators"""
    indicators = [
        'text=Dashboard', 'text=Kesehatan Koperasi', 'aside', 'nav',
        'button:has-text("Keluar Aplikasi")', 'button:has-text("Keluar")',
        '[class*="sidebar"]', '[class*="Sidebar"]'
    ]
    for ind in indicators:
        if page.locator(ind).count() > 0:
            return True
    return False

def login_via_quick_button(page, role):
    """Login using the quick-login buttons on login page"""
    creds = CREDENTIALS[role]
    print(f"\n🔐 Logging in as {role} ({creds['username']})...")
    
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # Map role to quick login button text
    quick_texts = {
        "admin": "🔑 Admin",
        "operator": "⚙️ Operator",
        "anggota": "👤 Anggota",
    }
    
    quick_text = quick_texts.get(role)
    if not quick_text:
        return False
    
    # Click quick login button
    quick_btn = page.locator(f'button:has-text("{quick_text}")').first
    if quick_btn.count() == 0:
        print(f"  ❌ Quick login button not found")
        return False
    
    quick_btn.click()
    page.wait_for_timeout(1000)
    
    # Click submit
    submit = page.locator('button:has-text("Masuk Sistem")').first
    if submit.count() > 0 and submit.is_enabled():
        submit.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
    else:
        print(f"  ❌ Submit button not found/enabled")
        return False
    
    # Check if logged in
    if is_logged_in(page):
        print(f"  ✅ Login successful")
        return True
    else:
        print(f"  ❌ Login failed")
        return False

def login_manual(page, role):
    """Manual login for perusahaan (no quick button)"""
    creds = CREDENTIALS[role]
    print(f"\n🔐 Logging in as {role} ({creds['username']})...")
    
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # Click "Perusahaan" tab
    tab = page.locator('button:has-text("Perusahaan")').first
    if tab.count() > 0:
        tab.click()
        page.wait_for_timeout(500)
    
    # Fill credentials
    page.fill('input[type="text"]', creds["username"])
    page.fill('input[type="password"]', creds["password"])
    
    # Submit
    submit = page.locator('button:has-text("Masuk Sistem")').first
    if submit.count() > 0:
        submit.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
    
    if is_logged_in(page):
        print(f"  ✅ Login successful")
        return True
    else:
        print(f"  ❌ Login failed")
        return False

def logout(page):
    """Logout from current session"""
    try:
        for sel in ['button:has-text("Keluar Aplikasi")', 'button:has-text("Logout")', 'button:has-text("Keluar")']:
            if page.locator(sel).count() > 0:
                page.click(sel)
                page.wait_for_load_state('networkidle')
                page.wait_for_timeout(500)
                return True
        page.goto(f"{BASE_URL}/login")
        page.wait_for_load_state('networkidle')
        return True
    except:
        return False

def get_sidebar_menus(page):
    """Extract all visible sidebar menu items"""
    menus = []
    strategies = [
        'aside button',
        'nav button',
        '[class*="sidebar"] button',
        '[class*="Sidebar"] button',
    ]
    
    for selector in strategies:
        buttons = page.locator(selector).all()
        if buttons:
            for btn in buttons:
                if btn.is_visible():
                    text = btn.inner_text().strip()
                    if text and len(text) > 1 and text not in menus:
                        if text not in ['Ganti Tema', 'Keluar Aplikasi', 'Keluar', 'Logout', '☰', '☰ Menu', '≡']:
                            menus.append(text)
            if menus:
                break
    
    if not menus:
        all_btns = page.locator('button:visible').all()
        for btn in all_btns:
            text = btn.inner_text().strip()
            if text and 2 < len(text) < 50 and text not in menus:
                menus.append(text)
    
    return menus

def test_module(page, module_name):
    """Test a specific module by clicking its menu"""
    print(f"    📋 Testing: {module_name}")
    
    try:
        btn = page.locator(f'button:has-text("{module_name}")').first
        if btn.count() == 0:
            first_word = module_name.split(" ")[0]
            btn = page.locator(f'button:has-text("{first_word}")').first
        
        if btn.count() > 0 and btn.is_visible():
            btn.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1500)
            
            safe_name = module_name.replace(' ', '_').replace('(', '').replace(')', '').replace('/', '_').lower()
            screenshot_path = f"/tmp/metrocoop_{safe_name}.png"
            page.screenshot(path=screenshot_path, full_page=True)
            
            # Check content loaded
            content_loaded = False
            for sel in ['table', '.card', '[class*="card"]', 'form', '[class*="grid"]', '[class*="list"]', '.content', 
                       'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
                       'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi']:
                if page.locator(sel).count() > 0:
                    content_loaded = True
                    break
            
            result = {
                "module": module_name,
                "clicked": True,
                "content_loaded": content_loaded,
                "screenshot": screenshot_path
            }
            print(f"      ✅ Loaded (content: {content_loaded})")
            return result
        else:
            print(f"      ❌ Button not found")
            return {"module": module_name, "clicked": False, "error": "Button not found"}
            
    except Exception as e:
        print(f"      ❌ Error: {str(e)}")
        results["errors_found"].append({"module": module_name, "error": str(e)})
        return {"module": module_name, "error": str(e)}

def test_module_by_id(page, menu_id, display_name):
    """Test a specific module by its internal ID"""
    print(f"      📋 Testing sub-menu: {display_name} (id: {menu_id})")
    
    try:
        # Note: Sidebar uses HTML entity & for & in button text
        # So "Setor & Tarik" renders as "Setor & Tarik" in the DOM
        display_name_html = display_name.replace('&', '&')
        
        # Try multiple selectors for sub-menu buttons
        selectors = [
            f'button:has-text("• {display_name_html}")',  # HTML entity version
            f'button:has-text("• {display_name}")',        # Plain text version
            f'button:has-text("{display_name_html}")',     # HTML entity version without bullet
            f'button:has-text("{display_name}")',          # Plain text version without bullet
            f'button[onclick*="{menu_id}"]',
            f'button[onClick*="{menu_id}"]',
        ]
        
        btn = None
        for sel in selectors:
            btn = page.locator(sel).first
            if btn.count() > 0 and btn.is_visible():
                break
        
        if btn and btn.count() > 0 and btn.is_visible():
            btn.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1500)
            
            safe_name = display_name.replace(' ', '_').replace('(', '').replace(')', '').replace('/', '_').replace('&', '').replace(';', '').lower()
            screenshot_path = f"/tmp/metrocoop_{safe_name}.png"
            page.screenshot(path=screenshot_path, full_page=True)
            
            content_loaded = False
            for sel in ['table', '.card', '[class*="card"]', 'form', '[class*="grid"]', '[class*="list"]', '.content',
                       'text=Data', 'text=Daftar', 'text=Tabel', 'text=Statistik', 'text=Total', 'text=Saldo',
                       'text=Anggota', 'text=Pinjaman', 'text=Simpanan', 'text=Transaksi', 'text=Investasi',
                       'text=Dividen', 'text=Profil', 'text=Pengumuman', 'text=Dokumen', 'text=Tiket']:
                if page.locator(sel).count() > 0:
                    content_loaded = True
                    break
            
            result = {
                "module": display_name,
                "clicked": True,
                "content_loaded": content_loaded,
                "screenshot": screenshot_path
            }
            print(f"         ✅ Loaded (content: {content_loaded})")
            return result
        else:
            print(f"         ❌ Button not found/visible (tried selectors)")
            # Debug: list all visible buttons
            all_btns = page.locator('button:visible').all()
            for b in all_btns:
                txt = b.inner_text().strip()
                if '•' in txt or display_name.lower() in txt.lower():
                    print(f"           Found related: '{txt}'")
            return {"module": display_name, "clicked": False, "error": "Button not found"}
            
    except Exception as e:
        print(f"         ❌ Error: {str(e)}")
        results["errors_found"].append({"module": display_name, "error": str(e)})
        return {"module": display_name, "error": str(e)}

def test_sub_menus(page, parent_menu, sub_data):
    """Test sub-menus under a parent menu"""
    print(f"    🔽 Testing sub-menus of: {parent_menu}")
    sub_results = {}
    
    # Parent was already clicked by test_module, dropdown should be open
    # Wait a bit more for dropdown animation
    page.wait_for_timeout(1000)
    
    for sub in sub_data["items"]:
        result = test_module_by_id(page, sub["id"], sub["label"])
        sub_results[sub["label"]] = result
    
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
        
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        
        for role in ["admin", "operator", "anggota", "perusahaan"]:
            print(f"\n{'='*60}")
            print(f"🧪 TESTING ROLE: {role.upper()}")
            print(f"{'='*60}")
            
            if role != "admin":
                logout(page)
                page.wait_for_timeout(500)
            
            if role == "perusahaan":
                login_success = login_manual(page, role)
            else:
                login_success = login_via_quick_button(page, role)
            
            results["login_tests"][role] = {"success": login_success}
            
            if not login_success:
                results["errors_found"].append({"role": role, "error": "Login failed"})
                continue
            
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)
            
            sidebar_menus = get_sidebar_menus(page)
            expected = EXPECTED_MENUS.get(role, [])
            
            print(f"\n  📋 Sidebar menus ({len(sidebar_menus)}):")
            for m in sidebar_menus:
                print(f"    - {m}")
            
            missing = [m for m in expected if not any(m.lower() in s.lower() for s in sidebar_menus)]
            extra = [s for s in sidebar_menus if not any(e.lower() in s.lower() for e in expected)]
            
            if missing:
                print(f"  ⚠️  Missing: {missing}")
                results["warnings"].append({"role": role, "type": "missing_menus", "menus": missing})
            
            results["sidebar_tests"][role] = {
                "found": sidebar_menus, "expected": expected,
                "missing": missing, "extra": extra
            }
            
            print(f"\n  🔬 Testing modules...")
            module_results = {}
            skip = ["Ganti Tema", "Keluar Aplikasi", "Keluar", "Logout"]
            parent_menus = ["Simpanan (Savings)", "Pinjaman (Loans)"]
            
            # Test non-parent menus first
            non_parent_menus = [m for m in sidebar_menus if m not in skip and m not in parent_menus][:12]
            
            for menu in non_parent_menus:
                result = test_module(page, menu)
                module_results[menu] = result
            
            # Test parent menus with their sub-menus
            if role in ["admin", "operator"]:
                for parent, subs in SUB_MENUS.items():
                    if parent in sidebar_menus:
                        # Test parent menu
                        result = test_module(page, parent)
                        module_results[parent] = result
                        # Immediately test sub-menus while dropdown is open
                        sub_results = test_sub_menus(page, parent, subs)
                        module_results[f"{parent} (subs)"] = sub_results
            
            results["module_tests"][role] = module_results
        
        page.goto(f"{BASE_URL}/login")
        page.wait_for_load_state('networkidle')
        page.screenshot(path="/tmp/metrocoop_final_login.png", full_page=True)
        results["screenshots"].append("/tmp/metrocoop_final_login.png")
        
        browser.close()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    print("\n✅ Login:")
    for role, data in results["login_tests"].items():
        print(f"  {'✅' if data['success'] else '❌'} {role}")
    
    print(f"\n⚠️  Warnings: {len(results['warnings'])}")
    for w in results["warnings"]:
        print(f"  - {w['role']}: {w['menus']}")
    
    print(f"\n❌ Errors: {len(results['errors_found'])}")
    for e in results["errors_found"]:
        key = e.get('role', e.get('module', '?'))
        val = e.get('error', '?')
        print(f"  - {key}: {val}")
    
    print(f"\n📦 Module Tests:")
    for role, modules in results["module_tests"].items():
        clicked = sum(1 for m in modules.values() if isinstance(m, dict) and m.get('clicked'))
        loaded = sum(1 for m in modules.values() if isinstance(m, dict) and m.get('content_loaded'))
        print(f"  {role}: {clicked} clicked, {loaded} loaded")
    
    output_file = f"/tmp/metrocoop_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n💾 Results: {output_file}")
    
    return results

if __name__ == "__main__":
    run_deep_analysis()