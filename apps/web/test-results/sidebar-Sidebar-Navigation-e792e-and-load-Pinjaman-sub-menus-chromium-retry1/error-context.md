# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sidebar.spec.ts >> Sidebar Navigation >> admin role >> should expand and load Pinjaman sub-menus
- Location: tests\e2e\sidebar.spec.ts:249:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e9]
        - generic [ref=e12]:
          - heading "MetroCoop v2.0" [level=1] [ref=e13]
          - paragraph [ref=e14]: Sistem Informasi Koperasi Terintegrasi
      - generic [ref=e15]:
        - heading "Platform Digitalisasi Koperasi Masa Kini" [level=2] [ref=e16]
        - paragraph [ref=e17]: Kelola data anggota, transaksi simpanan, pengajuan pinjaman, akuntansi jurnal otomatis, serta unit usaha perdagangan (toko) dalam satu ekosistem cloud terintegrasi.
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: 100%
          - generic [ref=e21]: Auto Journaling
        - generic [ref=e22]:
          - generic [ref=e23]: Multi
          - generic [ref=e24]: Portal Anggota & Admin
      - generic [ref=e25]:
        - generic [ref=e26]:
          - img [ref=e27]
          - text: "Test Credentials (Klik untuk mengisi otomatis):"
        - generic [ref=e30]:
          - 'button "🔑 Admin / Pengurus User: admin / Pass: admin123" [ref=e31] [cursor=pointer]':
            - generic [ref=e32]: 🔑 Admin / Pengurus
            - generic [ref=e33]: "User: admin / Pass: admin123"
          - 'button "⚙️ Operator Staff User: operator / Pass: admin123" [ref=e34] [cursor=pointer]':
            - generic [ref=e35]: ⚙️ Operator Staff
            - generic [ref=e36]: "User: operator / Pass: admin123"
          - 'button "👤 Anggota (Marmad Tuaian) NIK: 1234567890 / Pass: 123456" [ref=e37] [cursor=pointer]':
            - generic [ref=e38]: 👤 Anggota (Marmad Tuaian)
            - generic [ref=e39]: "NIK: 1234567890 / Pass: 123456"
    - generic [ref=e41]:
      - generic [ref=e42]:
        - button "Admin & Operator" [ref=e43]:
          - img [ref=e44]
          - text: Admin & Operator
        - button "Portal Anggota" [ref=e46]:
          - img [ref=e47]
          - text: Portal Anggota
        - button "Perusahaan" [ref=e50]:
          - img [ref=e51]
          - text: Perusahaan
      - generic [ref=e55]:
        - generic [ref=e56]:
          - heading "Masuk Back Office" [level=3] [ref=e57]
          - paragraph [ref=e58]:
            - generic [ref=e59]: Prtal Back Office — Admin, Operator & Pengurus
        - generic [ref=e60]:
          - generic [ref=e61]:
            - generic [ref=e62]:
              - img [ref=e63]
              - text: Username Admin/Operator
            - 'textbox "Masukkan username (misal: admin)" [ref=e66]'
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e69]
              - text: Kata Sandi (Password)
            - generic [ref=e73]:
              - textbox "••••••" [ref=e74]
              - button "Tampilkan kata sandi" [ref=e75] [cursor=pointer]:
                - img [ref=e76]
          - button "Masuk Sistem" [ref=e80] [cursor=pointer]:
            - generic [ref=e81]: Masuk Sistem
            - img [ref=e82]
      - generic [ref=e85]:
        - text: Aplikasi ini dilindungi oleh sertifikat enkripsi SSL.
        - text: © 2026 MetroCoop v2.0 — Sistem Koperasi Terintegrasi.
  - generic [ref=e86]: METRO KOMUNIKA ASIA @2026 • Design By Andi WIlyam
```