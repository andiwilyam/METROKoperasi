/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { Shield, User, Eye, EyeOff, Key, Sparkles, Building, Building2, Briefcase } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen({ onLogin: _onLogin, users: _users }: { onLogin?: (s: any) => void; users?: any[] }) {
  const loginStore = useAuthStore((s) => s.login);
  const [activeTab, setActiveTab] = useState<'admin' | 'member' | 'perusahaan'>('admin');
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ namaPerusahaan: '', username: '', password: '', email: '', telepon: '', sektorIndustri: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic typing effect for subtitle
  useEffect(() => {
    const fullText = activeTab === 'admin' 
      ? 'Portal Back Office — Admin, Operator & Pengurus' 
      : activeTab === 'perusahaan'
      ? 'Portal Perusahaan — Pembiayaan Ventura & Modal Investasi'
      : 'Portal Anggota — Akses Mandiri Simpanan & Pinjaman';
    setTypingText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypingText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [activeTab]);

  // Particles background effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number }[] = [];
    const count = Math.min(60, Math.floor(width / 25));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.5 - 0.1,
        o: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShake(false);

    if (!username.trim() || !password.trim()) {
      setError('Username/NIK dan password wajib diisi');
      setShake(true);
      return;
    }

    setIsProcessing(true);

    try {
      await loginStore(username.trim(), password.trim());
    } catch (err: any) {
      setError(err.message || 'Kredensial tidak cocok');
      setShake(true);
      setIsProcessing(false);
    }
  };

  const autofillCredentials = (user: string, pass: string, type: 'admin' | 'member' | 'perusahaan') => {
    setActiveTab(type);
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  // Warna aksen per tab via token semantik
  const getTabActiveStyle = (tab: 'admin' | 'member' | 'perusahaan') => {
    if (tab === 'admin') return { borderColor: 'var(--mc-accent)', color: 'var(--mc-accent)' };
    if (tab === 'member') return { borderColor: 'var(--mc-accent)', color: 'var(--mc-accent)' };
    // perusahaan: pakai aksen ungu via variabel inline (tidak ada token ungu di theme, gunakan default)
    return { borderColor: '#a855f7', color: '#a855f7' };
  };

  const getSubmitBtnClass = (tab: 'admin' | 'member' | 'perusahaan') => {
    const base = 'w-full py-3 px-4 rounded-lg font-semibold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer mc-focus';
    if (tab === 'admin') return `${base} mc-btn-primary`;
    if (tab === 'member') return `${base} mc-btn-primary`; // pakai aksen emas
    return `${base} bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/20`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center mc-bg overflow-hidden px-4">
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Decorative Blur Spheres — pakai token aksen */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--mc-accent)]/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--mc-primary)]/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Login Main Container */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 relative z-10 my-8">
        <div className="w-full grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left column: Presentational Info & branding */}
          <div className="md:col-span-5 text-white flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--mc-accent)] to-[var(--mc-accent-2)] flex items-center justify-center shadow-lg shadow-[var(--mc-accent)]/30">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  MetroCoop <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--mc-accent)]/20 text-[var(--mc-accent)] border border-[var(--mc-accent)]/30">v2.0</span>
                </h1>
                <p className="text-xs mc-muted">Sistem Informasi Koperasi Terintegrasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Platform Digitalisasi Koperasi Masa Kini
              </h2>
              <p className="mc-muted text-sm leading-relaxed">
                Kelola data anggota, transaksi simpanan, pengajuan pinjaman, akuntansi jurnal otomatis, serta unit usaha perdagangan (toko) dalam satu ekosistem cloud terintegrasi.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="mc-surface-2 backdrop-blur mc-border p-3 rounded-lg">
                <div className="text-xl font-bold text-[var(--mc-accent)]">100%</div>
                <div className="text-xs mc-muted">Auto Journaling</div>
              </div>
              <div className="mc-surface-2 backdrop-blur mc-border p-3 rounded-lg">
                <div className="text-xl font-bold text-[var(--mc-primary)]">Multi</div>
                <div className="text-xs mc-muted">Portal Anggota & Admin</div>
              </div>
            </div>

            {/* Helper credentials */}

            <div className="mc-surface-2 backdrop-blur mc-border p-4 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[var(--mc-accent)]" />
                Test Credentials (Klik untuk mengisi otomatis):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mc-muted">
                <button 
                  onClick={() => autofillCredentials('admin', 'admin123', 'admin')}
                  className="text-left mc-surface-2 hover:opacity-80 mc-border p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="font-medium text-slate-200">🔑 Admin / Pengurus</div>
                  <div>User: <span className="text-[var(--mc-accent)]">admin</span> / Pass: <span className="text-[var(--mc-accent)]">admin123</span></div>
                </button>
                <button 
                  onClick={() => autofillCredentials('operator', 'admin123', 'admin')}
                  className="text-left mc-surface-2 hover:opacity-80 mc-border p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="font-medium text-slate-200">⚙️ Operator Staff</div>
                  <div>User: <span className="text-[var(--mc-success)]">operator</span> / Pass: <span className="text-[var(--mc-success)]">admin123</span></div>
                </button>
                <button 
                  onClick={() => autofillCredentials('1234567890', '123456', 'member')}
                  className="text-left mc-surface-2 hover:opacity-80 mc-border p-2 rounded-lg cursor-pointer transition-colors sm:col-span-2"
                >
                  <div className="font-medium text-slate-200">👤 Anggota (Marmad Tuaian)</div>
                  <div>NIK: <span className="text-[var(--mc-primary)]">1234567890</span> / Pass: <span className="text-[var(--mc-primary)]">123456</span></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Login Form Box */}
          <div className="md:col-span-7 flex justify-center">
            <div className={`w-full max-w-md mc-card shadow-2xl overflow-hidden ${shake ? 'animate-shake' : ''}`}>
              {/* Tabs for Portal Mode */}
              <div className="flex border-b mc-border mc-surface-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setError('');
                  }}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'admin'
                      ? 'mc-sidebar-active'
                      : 'border-transparent mc-muted hover:mc-ink'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin & Operator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('member');
                    setError('');
                  }}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'member'
                      ? 'border-transparent'
                      : 'border-transparent mc-muted hover:mc-ink'
                  }`}
                  style={activeTab === 'member' ? getTabActiveStyle('member') : undefined}
                >
                  <User className="w-4 h-4" />
                  Portal Anggota
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('perusahaan');
                    setError('');
                  }}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'perusahaan'
                      ? ''
                      : 'border-transparent mc-muted hover:mc-ink'
                  }`}
                  style={activeTab === 'perusahaan' ? getTabActiveStyle('perusahaan') : undefined}
                >
                  <Building2 className="w-4 h-4" />
                  Perusahaan
                </button>
              </div>

              {/* Login Form Body */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold mc-ink-strong">
                    {activeTab === 'admin' ? 'Masuk Back Office' : activeTab === 'perusahaan' ? 'Masuk Portal Perusahaan' : 'Masuk Portal Anggota'}
                  </h3>
                  <p className="text-xs mc-muted mt-1 min-h-[1.5rem] flex items-center justify-center">
                    <span className="typing-caret pb-0.5">{typingText}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 mc-danger-bg mc-border text-[var(--mc-danger)] text-xs font-semibold rounded-lg flex items-start gap-2">
                    <span className="font-bold">❌</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mc-ink mb-1.5 flex items-center gap-1.5">
                      {activeTab === 'perusahaan' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 mc-muted" />
                          Username Perusahaan
                        </>
                      ) : activeTab === 'admin' ? (
                        <>
                          <User className="w-3.5 h-3.5 mc-muted" />
                          Username Admin/Operator
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3.5 h-3.5 mc-muted" />
                          NIK Anggota (Nomor Induk Kependudukan)
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={activeTab === 'perusahaan' ? 'Username perusahaan (misal: hijau_agri)' : activeTab === 'admin' ? 'Masukkan username (misal: admin)' : 'Masukkan NIK 10 digit'}
                      className="w-full px-3.5 py-2.5 rounded-lg mc-border text-sm font-mono mc-ink mc-surface focus:mc-surface focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[var(--mc-accent)] transition-colors mc-focus"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mc-ink mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 mc-muted" />
                      Kata Sandi (Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-lg mc-border text-sm font-mono mc-ink mc-surface focus:mc-surface focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[var(--mc-accent)] transition-colors mc-focus"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 mc-muted hover:mc-ink cursor-pointer mc-focus"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`${getSubmitBtnClass(activeTab)} ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Memvalidasi...
                        </>
                      ) : (
                        <>
                          <span>Masuk Sistem</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Register & quick credentials for Perusahaan */}
                {activeTab === 'perusahaan' && (
                  <div className="mt-4 pt-4 border-t mc-border text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegister(!showRegister)}
                      className="text-xs font-semibold hover:underline cursor-pointer mc-icon-accent"
                    >
                      {showRegister ? '« Kembali ke Login' : '+ Daftar Perusahaan Baru'}
                    </button>

                    {showRegister && (
                      <div className="mt-3 p-3 mc-surface-2 mc-border rounded-lg space-y-2 text-left">
                        <h4 className="text-xs font-bold mc-ink">Registrasi Perusahaan Baru</h4>
                        <input value={regForm.namaPerusahaan} onChange={e => setRegForm(f => ({ ...f, namaPerusahaan: e.target.value }))} placeholder="Nama Perusahaan *" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <input value={regForm.username} onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} placeholder="Username *" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <input type="password" value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} placeholder="Password * (min 6 karakter)" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <input value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <input value={regForm.telepon} onChange={e => setRegForm(f => ({ ...f, telepon: e.target.value }))} placeholder="Telepon" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <input value={regForm.sektorIndustri} onChange={e => setRegForm(f => ({ ...f, sektorIndustri: e.target.value }))} placeholder="Sektor Industri" className="w-full mc-border mc-surface p-1.5 rounded text-xs mc-ink" />
                        <button
                          onClick={async () => {
                            if (!regForm.namaPerusahaan || !regForm.username || !regForm.password) { setError('Nama, username, password wajib diisi!'); return; }
                            if (regForm.password.length < 6) { setError('Password minimal 6 karakter!'); return; }
                            try {
                              const res = await fetch('/api/auth/register-perusahaan', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(regForm)
                              });
                              if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
                              const data = await res.json();
                              localStorage.setItem('token', data.token);
                              localStorage.setItem('user', JSON.stringify(data.user));
                              window.location.reload();
                            } catch (err: any) { setError(err.message); }
                          }}
                          className="w-full py-1.5 mc-btn-primary rounded-lg text-xs font-bold cursor-pointer"
                        >Daftar Sekarang</button>
                      </div>
                    )}

                    {import.meta.env.DEV && (
                    <div className="mt-2 text-[10px] mc-muted">
                      Test: <button onClick={() => autofillCredentials('hijau_agri', 'perusahaan123', 'perusahaan')} className="text-[var(--mc-accent)] hover:underline cursor-pointer">hijau_agri / perusahaan123</button>
                    </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer terms */}
              <div className="px-8 py-4 mc-surface-2 mc-border text-[10px] mc-muted text-center">
                Aplikasi ini dilindungi oleh sertifikat enkripsi SSL. <br />
                © 2026 MetroCoop v2.0 — Sistem Koperasi Terintegrasi.
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic global copyright and identity */}
        <div className="text-[11px] font-bold mc-muted tracking-widest text-center mt-2 uppercase select-none">
          METRO KOMUNIKA ASIA @2026 &nbsp;&bull;&nbsp; Design By Andi WIlyam
        </div>
      </div>
    </div>
  );
}