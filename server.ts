import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { runMigrations } from "./server/migrate.js";
import authRoutes from "./server/routes/auth.js";
import dataRoutes from "./server/routes/data.js";
import { authMiddleware } from "./server/middleware.js";

dotenv.config();

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000');

  // Health check (Railway) — MUST return 200 immediately, no DB dependency
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'initializing...' // don't block on DB
    });
  });

  // Security middleware
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:'],
          frameSrc: ["'self'"],
        },
      },
    })
  );
  // Same-origin SPA dihidangkan oleh server ini sendiri, jadi defaultnya menolak
  // semua cross-origin. Izinkan domain ekstra via CORS_ORIGIN bila frontend terpisah.
  app.use(
    cors({
      origin: allowedOrigins.length ? allowedOrigins : false,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));

  // Run database migrations (non-blocking for fast healthcheck)
  runMigrations()
    .then(() => console.log('Database ready.'))
    .catch(err => console.warn('Migration warning (non-fatal):', err));

  // ==================== PUBLIC AUTH ROUTES ====================
  app.use('/api/auth', authRoutes);

  // ==================== PUBLIC LANDING PAGE (no auth) ====================
  app.get('/api/public/landing', async (_req: any, res: any) => {
    try {
      const pool = (await import('./server/db.js')).default;
      const settings = await pool.query("SELECT * FROM landing_settings WHERE id='landing_main'");
      const hero = await pool.query("SELECT * FROM landing_hero WHERE id='hero_main'");
      const features = await pool.query('SELECT * FROM landing_features WHERE is_active=true ORDER BY sort_order ASC');
      const team = await pool.query('SELECT * FROM landing_team ORDER BY sort_order ASC');
      const testimonials = await pool.query('SELECT * FROM landing_testimonials ORDER BY sort_order ASC');
      const pricing = await pool.query('SELECT * FROM landing_pricing ORDER BY sort_order ASC');
      const contact = await pool.query("SELECT * FROM landing_contact WHERE id='contact_main'");
      return res.json({
        settings: settings.rows[0] || {},
        hero: hero.rows[0] || {},
        features: features.rows || [],
        team: team.rows || [],
        testimonials: testimonials.rows || [],
        pricing: pricing.rows || [],
        contact: contact.rows[0] || {},
      });
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  });

  // ==================== PROTECTED DATA ROUTES ====================
  app.use('/api/data', dataRoutes);

  // ==================== GEMINI AI AUDIT ====================
  app.post("/api/gemini/audit", authMiddleware, async (req: any, res: any) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini API Key tidak terkonfigurasi. Silakan tambahkan GEMINI_API_KEY di Settings > Secrets."
        });
      }

      const { investment } = req.body;
      if (!investment) {
        return res.status(400).json({ error: "Data investasi tidak ditemukan." });
      }

      const formattedNominal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(investment.nominalInvestasi);

      const prompt = `Lakukan audit risiko investasi saham (penyertaan modal) koperasi simpan pinjam "MetroCoop" pada investee berikut:
- Nama Perusahaan: ${investment.namaPerusahaan}
- Sektor Industri: ${investment.sektorIndustri}
- Nama Founder: ${investment.namaFounder}
- Nominal Investasi: ${formattedNominal}
- Persentase Kepemilikan Saham: ${investment.persentaseSaham}%
- Estimasi Dividen/Imbal Hasil: ${investment.estimasiDividen}%
- Tanggal Investasi: ${investment.tanggalInvestasi}
- Masa Tenor Kontrak: ${investment.tenorTahun} Tahun
- Status Investasi Saat Ini: ${investment.status}

Sediakan audit komprehensif berbasis standar koperasi Indonesia dan regulasi berikut:
1. UU 25/1992 tentang Perkoperasian.
2. Permenkop No. 2/2024 tentang Koperasi Simpan Pinjam.
3. Standar Akuntansi Keuangan SAK ETAP Bab 22 tentang Penurunan Nilai (Impairment).

Format respons harus berupa JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah auditor koperasi senior & pakar akuntansi SAK ETAP di Indonesia.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perusahaan: { type: Type.STRING },
              sektor: { type: Type.STRING },
              statusKesehatan: { type: Type.STRING },
              analisisKeuangan: { type: Type.STRING },
              analisisRegulasi: { type: Type.STRING },
              penilaianPenurunanNilai: { type: Type.STRING },
              langkahStrategis: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["perusahaan", "sektor", "statusKesehatan", "analisisKeuangan", "analisisRegulasi", "penilaianPenurunanNilai", "langkahStrategis"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Respons dari Gemini AI kosong.");
      const auditResult = JSON.parse(resultText);
      res.json(auditResult);
    } catch (error: any) {
      console.error("AI Audit Error:", error);
      res.status(500).json({ error: error.message || "Gagal melakukan audit AI." });
    }
  });

  // ==================== FRONTEND (Static files) ====================
  const landingPath = path.join(process.cwd(), 'landing');
  const webDistPath = path.join(process.cwd(), 'apps', 'web', 'dist');

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(process.cwd(), 'apps', 'web'),
    });
    app.use(vite.middlewares);
  } else {
    // Serve landing page static files (CSS, JS, SVG, etc.)
    app.use('/assets', express.static(path.join(landingPath, 'assets')));
    // Serve landing page at root
    app.get('/', (req, res) => {
      res.sendFile(path.join(landingPath, 'index.html'));
    });
    // Serve React app assets
    app.use('/assets', express.static(path.join(webDistPath, 'assets')));
    // SPA fallback: serve React app for any non-API, non-landing route
    app.all('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(webDistPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MetroCoop server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
  });
}

startServer();
