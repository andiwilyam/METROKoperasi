/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden px-4">
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Login Main Container */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 relative z-10 my-8">
        <div className="w-full grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left column: Presentational Info & branding */}
          <div className="md:col-span-5 text-white flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  MetroMitra <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">v2.0</span>
                </h1>
                <p className="text-xs text-slate-400">Sistem Informasi Koperasi Terintegrasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Platform Digitalisasi Koperasi Masa Kini
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kelola data anggota, transaksi simpanan, pengajuan pinjaman, akuntansi jurnal otomatis, serta unit usaha perdagangan (toko) dalam satu ekosistem cloud terintegrasi.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/30 p-3 rounded-lg">
                <div className="text-xl font-bold text-blue-400">100%</div>
                <div className="text-xs text-slate-400">Auto Journaling</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/30 p-3 rounded-lg">
                <div className="text-xl font-bold text-amber-400">Multi</div>
                <div className="text-xs text-slate-400">Portal Anggota & Admin</div>
              </div>
            </div>

            {/* Helper credentials */}
            <div className="bg-slate-800/40 backdrop-blur border border-slate-700/40 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Test Credentials (Klik untuk mengisi otomatis):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                <button 
                  onClick={() => autofillCredentials('admin', 'admin123', 'admin')}
                  className="text-left bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg cursor-pointer transition"
                >
                  <div className="font-medium text-slate-200">🔑 Admin / Pengurus</div>
                  <div>User: <span className="text-blue-400">admin</span> / Pass: <span className="text-blue-400">admin123</span></div>
                </button>
                <button 
                  onClick={() => autofillCredentials('operator', 'admin123', 'admin')}
                  className="text-left bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg cursor-pointer transition"
                >
                  <div className="font-medium text-slate-200">⚙️ Operator Staff</div>
                  <div>User: <span className="text-emerald-400">operator</span> / Pass: <span className="text-emerald-400">admin123</span></div>
                </button>
                <button 
                  onClick={() => autofillCredentials('1234567890', '123456', 'member')}
                  className="text-left bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/50 p-2 rounded-lg cursor-pointer transition sm:col-span-2"
                >
                  <div className="font-medium text-slate-200">👤 Anggota (Marmad Tuaian)</div>
                  <div>NIK: <span className="text-amber-400">1234567890</span> / Pass: <span className="text-amber-400">123456</span></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Login Form Box */}
          <div className="md:col-span-7 flex justify-center">
            <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all-custom border border-slate-100 ${shake ? 'animate-shake' : ''}`}>
              {/* Tabs for Portal Mode */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setError('');
                  }}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === 'admin'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
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
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === 'member'
                      ? 'border-amber-500 text-amber-500 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
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
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === 'perusahaan'
                      ? 'border-purple-600 text-purple-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Perusahaan
                </button>
              </div>

              {/* Login Form Body */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeTab === 'admin' ? 'Masuk Back Office' : activeTab === 'perusahaan' ? 'Masuk Portal Perusahaan' : 'Masuk Portal Anggota'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[1.5rem] flex items-center justify-center">
                    <span className="typing-caret pb-0.5">{typingText}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-start gap-2">
                    <span className="font-bold">❌</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      {activeTab === 'perusahaan' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          Username Perusahaan
                        </>
                      ) : activeTab === 'admin' ? (
                        <>
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Username Admin/Operator
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          NIK Anggota (Nomor Induk Kependudukan)
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={activeTab === 'perusahaan' ? 'Username perusahaan (misal: hijau_agri)' : activeTab === 'admin' ? 'Masukkan username (misal: admin)' : 'Masukkan NIK 10 digit'}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      Kata Sandi (Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
                      } ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
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
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegister(!showRegister)}
                      className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
                    >
                      {showRegister ? '« Kembali ke Login' : '+ Daftar Perusahaan Baru'}
                    </button>

                    {showRegister && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2 text-left">
                        <h4 className="text-xs font-bold text-purple-800">Registrasi Perusahaan Baru</h4>
                        <input value={regForm.namaPerusahaan} onChange={e => setRegForm(f => ({ ...f, namaPerusahaan: e.target.value }))} placeholder="Nama Perusahaan *" className="w-full border p-1.5 rounded text-xs" />
                        <input value={regForm.username} onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} placeholder="Username *" className="w-full border p-1.5 rounded text-xs" />
                        <input type="password" value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} placeholder="Password * (min 6 karakter)" className="w-full border p-1.5 rounded text-xs" />
                        <input value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full border p-1.5 rounded text-xs" />
                        <input value={regForm.telepon} onChange={e => setRegForm(f => ({ ...f, telepon: e.target.value }))} placeholder="Telepon" className="w-full border p-1.5 rounded text-xs" />
                        <input value={regForm.sektorIndustri} onChange={e => setRegForm(f => ({ ...f, sektorIndustri: e.target.value }))} placeholder="Sektor Industri" className="w-full border p-1.5 rounded text-xs" />
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
                              // Set the token and user in auth store
                              localStorage.setItem('token', data.token);
                              localStorage.setItem('user', JSON.stringify(data.user));
                              window.location.reload();
                            } catch (err: any) { setError(err.message); }
                          }}
                          className="w-full py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 cursor-pointer"
                        >Daftar Sekarang</button>
                      </div>
                    )}

                    <div className="mt-2 text-[10px] text-slate-400">
                      Test: <button onClick={() => autofillCredentials('hijau_agri', 'perusahaan123', 'perusahaan')} className="text-blue-600 hover:underline cursor-pointer">hijau_agri / perusahaan123</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer terms */}
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                Aplikasi ini dilindungi oleh sertifikat enkripsi SSL. <br />
                © 2026 MetroMitra v2.0 — Sistem Koperasi Terintegrasi.
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic global copyright and identity */}
        <div className="text-[11px] font-bold text-slate-400/90 tracking-widest text-center mt-2 uppercase select-none">
          METRO KOMUNIKA ASIA @2026 &nbsp;&bull;&nbsp; Design By Andi WIlyam
        </div>
      </div>
    </div>
  );
}
