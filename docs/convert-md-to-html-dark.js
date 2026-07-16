#!/usr/bin/env node
/**
 * MetroCoop Documentation Converter - Dark Theme Version
 * Converts Markdown files to styled HTML with dark theme, closed captions support, and wallpaper enhancement.
 * Usage: node convert-md-to-html-dark.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

const DOCS_DIR = import.meta.dirname;

const FILES = [
  { dir: '01-proposal',    file: 'proposal-teknis-komersial.md',     title: 'Proposal Teknis & Komersial' },
  { dir: '02-company-profile', file: 'company-profile-portofolio.md', title: 'Company Profile & Portofolio' },
  { dir: '03-nda',         file: 'nda-draft.md',                     title: 'Draft NDA' },
  { dir: '04-brd',         file: 'brd-urs.md',                       title: 'BRD / URS' },
  { dir: '05-srs',         file: 'srs-specification.md',             title: 'SRS' },
  { dir: '06-ui-ux',       file: 'ui-ux-design-spec.md',            title: 'UI/UX Design' },
  { dir: '07-project-plan', file: 'project-plan.md',                  title: 'Project Plan' },
];

// Dark theme CSS with enhanced wallpaper and closed captions support
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* Dark Theme Colors - Wallpaper Inspired */
  --primary: #bfdbfe;           /* Sky blue - bright but soft */
  --primary-light: #93c5fd;     /* Sky blue light */
  --primary-dark: #1e40af;      /* Dark blue */
  --accent: #06b6d4;            /* Cyan accent */
  --bg: #0a0c14;                /* Very dark blue - wallpaper */
  --bg-alt: #111827;            /* Slightly lighter dark */
  --bg-code: #151821;           /* Dark code background */
  --text: #e5e7eb;              /* Off white */
  --text-muted: #a5b4fc;        /* Muted blue */
  --text-caption: #93c5fd;      /* Closed captions text */
  --border: #374151;            /* Dark border */
  --shadow: 0 4px 12px rgba(20, 20, 40, 0.4); /* Enhanced shadow */
  --sidebar-w: 280px;
}

/* Ensure dark mode is default - override light mode variables */

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
  background: var(--bg);
  background-image: 
    linear-gradient(135deg, rgba(3, 7, 18, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  background-attachment: fixed;
  display: flex;
}

/* Closed Captions Panel (Top Banner) */
.closed-captions-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(20, 28, 50, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
  color: var(--text-caption);
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.closed-captions-panel .cc-icon {
  margin-right: 8px;
  color: var(--accent);
  font-weight: 700;
}

.closed-ca examples {
  display: inline-flex;
  gap: 16px;
  margin-left: auto;
}

.closed-captions-panel .cc-example {
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--text-caption);
  font-family: 'JetBrains Mono', monospace;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 40px; /* Leave space for closed captions panel */
  left: 0;
  width: var(--sidebar-w);
  height: calc(100vh - 40px);
  background: linear-gradient(180deg, #0f172a, #1e293b);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.sidebar-brand {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.3);
}
.sidebar-brand h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-light);
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.sidebar-brand small {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-nav a:hover {
  background: rgba(59, 130, 246, 0.15);
  color: #fff;
  border-left-color: var(--accent);
}

.sidebar-nav a.active {
  background: rgba(59, 130, 246, 0.25);
  color: #fff;
  border-left-color: var(--accent);
}

/* Main content - adjusted for closed captions */
.content {
  margin-left: var(--sidebar-w);
  flex: 1;
  min-height: 100vh;
  margin-top: 40px;
}

.content-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px;
}

/* Typography with improved contrast */
h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary-light);
  margin: 0 0 12px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 48px 0 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-dark);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
h3 { font-size: 20px; font-weight: 600; color: var(--text); margin: 32px 0 12px; }
h4 { font-size: 16px; font-weight: 600; color: var(--primary-light); margin: 24px 0 8px; }
h5 { font-size: 14px; font-weight: 600; color: var(--text-muted); margin: 20px 0 6px; text-transform: uppercase; }
p { margin: 0 0 12px; color: var(--text); line-height: 1.8; }
strong { font-weight: 600; color: #fff; }
a { color: var(--primary-light); text-decoration: none; }
a:hover { text-decoration: underline; color: #fff; }

/* Tables with better contrast */
table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; font-size: 13px; }
th { background: var(--primary-dark); color: #fff; font-weight: 600; padding: 12px 14px; }
td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: top; background: var(--bg-alt); }
tr:hover td { background: rgba(59, 130, 246, 0.15); }

/* Code blocks with better visibility */
code { background: var(--bg-code); color: var(--accent); }
pre {
  background: #0a0e17;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0 24px;
  line-height: 1.5;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Emphasizing important information with background */
.important-note {
  background: rgba(251, 146, 60, 0.15);
  border-left: 4px solid #fb923c;
  padding: 16px 20px;
  margin: 16px 0;
  border-radius: 0 8px 8px 0;
  color: #fff;
}

/* Enhanced scrollbars */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* Print styles optimized for dark theme */
@media print {
  .sidebar { display: none; }
  .content { margin-left: 0; }
  body { background-image: none; background-color: white; }
  h1, h2, h3 { color: black; }
  * { color: black !important; background: white !important; border-color: #ddd !important; }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  :root { --sidebar-w: 240px; }
  .content-inner { padding: 32px; }
}
@media (max-width: 768px) {
  body { flex-direction: column; }
  .sidebar { position: relative; width: 100%; height: auto; }
  .content { margin-left: 0; margin-top: 40px; }
  .closed-captions-panel { position: relative; height: auto; }
  .content-inner { padding: 24px 16px; }
}
`;

function markdownToHtml(md) {
  let html = md;

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images (enhanced for dark theme)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:12px 0;background: var(--bg-code);padding:8px;border:1px solid var(--border);">');

  // Checkmarks and closed captions
  html = html.replace(/✅/g, '<span class="check">✅</span>');
  html = html.replace(/❌/g, '<span class="cross">❌</span>');

  // Important notes
  html = html.replace(/💡|⚠️|🎯/g, '<span class="important-note">$&nbsp;</span>');

  // Tables (with dark theme styling)
  html = html.replace(/((?:^\|.+\|$\n?)+)/gm, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;

    const isSeparator = (r) => /^\|[\s\-:|]+\|$/.test(r);
    const parseRow = (r) => r.split('|').slice(1, -1).map(c => c.trim());

    let tableHtml = '<table class="dark-theme">';
    let headerParsed = false;

    for (const row of rows) {
      if (isSeparator(row)) {
        headerParsed = true;
        continue;
      }
      const cells = parseRow(row);
      if (!headerParsed) {
        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
      } else {
        tableHtml += '<tbody><tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr></tbody>';
      }
    }

    tableHtml += '</table>';
    return tableHtml;
  });

  // Fix tbody wrapping
  html = html.replace(/<\/tr><\/tbody><tbody><tr>/g, '</tr><tr>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="lang-${lang || 'text'}">${escaped}</code></pre>`;
  });

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

  // Wrap lists
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => `<ul>${match}</ul>`);

  // Clean up nested lists
  html = html.replace(/<ul>\s*<ul>/g, '<ul>');
  html = html.replace(/<\/ul>\s*<\/ul>/g, '</ul>');

  // Paragraphs
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<table') || block.startsWith('<pre') ||
        block.startsWith('<ul') || block.startsWith('<ol') || block.startsWith('<blockquote') ||
        block.startsWith('<hr') || block.startsWith('<img') || block.startsWith('<div') ||
        block.startsWith('<thead') || block.startsWith('<tbody') || block.includes('</table>') ||
        block.includes('</pre>')) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  return html;
}

function buildSidebar(files, activeIndex) {
  return files.map((f, i) => {
    const isActive = i === activeIndex;
    return `<a href="${basename(f.dir)}-${basename(f.file, '.md')}.html" class="${isActive ? 'active' : ''}">
      <span class="num">${i + 1}</span>
      ${f.title}
    </a>`;
  }).join('\n');
}

function buildPage(fileInfo, htmlContent, files, activeIndex) {
  // Add closed captions panel
  const closedCaptionsBanner = `
    <div class="closed-captions-panel">
      <span class="cc-icon">🔊</span>
      Penjelasan: Sistem MetroCoop adalah platform manajemen koperasi simpan pinjam terintegrasi yang dirancang khusus untuk memenuhi kebutuhan koperasi Indonesia, didukung oleh teknologi cloud modern dan AI intelligent scoring.
      <div class="examples">
        <span class="cc-example">🏦 KSP: Koperasi Simpan Pinjam</span>
        <span class="cc-example">💰 4 Jenis Simpanan</span>
        <span class="cc-example">🪙 RPA Mulai</span>
        <span class="cc-example">🤖 AI Credit Scoring</span>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileInfo.title} — MetroCoop (Dark Theme)</title>
  <style>${CSS}</style>
</head>
<body>
  ${closedCaptionsBanner}
  <nav class="sidebar">
    <div class="sidebar-brand">
      <h2>MetroCoop</h2>
      <small>Documentation Suite - Dark Theme</small>
    </div>
    <div class="sidebar-nav">
      ${buildSidebar(files, activeIndex)}
    </div>
    <div class="sidebar-footer">
      MetroCoop © 2026<br>
      Theme: Dark | Wallpaper: Cyberpunk Blue<br>
      Generated: ${new Date().toLocaleDateString('id-ID')}
    </div>
  </nav>
  <main class="content">
    <div class="content-inner">
      ${htmlContent}
    </div>
  </main>
</body>
</html>`;
}

// Main conversion process
console.log('MetroCoop Documentation Converter - Dark Theme');
console.log('====================================');

let success = 0;
let failed = 0;

for (let i = 0; i < FILES.length; i++) {
  const f = FILES[i];
  const mdPath = join(DOCS_DIR, f.dir, f.file);
  const outName = `${f.dir}-${basename(f.file, '.md')}-dark.html`;
  const outPath = join(DOCS_DIR, outName);

  try {
    const md = readFileSync(mdPath, 'utf-8');
    const htmlContent = markdownToHtml(md);
    const fullPage = buildPage(f, htmlContent, FILES, i);
    writeFileSync(outPath, fullPage, 'utf-8');
    const lines = fullPage.split('\n').length;
    console.log(`  ✅ ${outName} (${lines} lines)`);
    success++;
  } catch (err) {
    console.error(`  ❌ ${f.dir}/${f.file}: ${err.message}`);
    failed++;
  }
}

// Index page with dark theme
const indexHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MetroCoop — Dark Theme Documentation Suite</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="closed-captions-panel">
    <span class="cc-icon">🔊</span>
    Penjelasan: Dokumentasi MetroCoop hadir dalam tema gelap dengan wallpaper cyberpunk, UI/UX yang ditingkatkan, dan panduan yang terstruktur rapi.
    <div class="examples">
      <span class="cc-example">🖥️ Tema Gelap</span>
      <span class="cc-example">🖼️ Wallpaper Kustom</span>
      <span class="cc-example">📚 Navigasi Rapi</span>
      <span class="cc-example">🎨 UI/UX yang Ditingkatkan</span>
    </div>
  </div>
  <nav class="sidebar">
    <div class="sidebar-brand">
      <h2>MetroCoop</h2>
      <small>Documentation Suite - Dark Theme</small>
    </div>
    <div class="sidebar-nav">
      ${FILES.map((f, i) => `<a href="${f.dir}-${basename(f.file, '.md')}-dark.html" class="${i === 0 ? 'active' : ''}">
        <span class="num">${i + 1}</span>
        ${f.title}
      </a>`).join('\n')}
    </div>
    <div class="sidebar-footer">
      MetroCoop © 2026<br>
      Theme: Dark | Enhanced UI/UX<br>
      Generated: ${new Date().toLocaleDateString('id-ID')}
    </div>
  </nav>
  <main class="content">
    <div class="content-inner">
      <h1>🌙 Dokumentasi MetroCoop - Tema Gelap</h1>
      <p style="color:var(--text-muted);font-size:16px;margin-bottom:32px;">
        Dokumentasi lengkap dengan tema gelap, wallpaper kustom, dan navigasi yang ditingkatkan. Semua dokumen disajikan dalam visual yang nyaman untuk pengguna dengan preferensi dark theme.
      </p>
      ${FILES.map((f, i) => `
      <div style="padding:16px 20px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;transition:all 0.15s;cursor:pointer;background:linear-gradient(135deg, var(--bg-alt) 0%, var(--bg) 100%);" onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 8px 24px rgba(59,130,246,0.3)'" onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none'">
        <a href="${f.dir}-${basename(f.file, '.md')}-dark.html" style="font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px;">
          <span style="background:linear-gradient(135deg, var(--primary-dark), var(--accent));color:#fff;font-size:12px;font-weight:700;padding:3px 8px;border-radius:4px;min-width:28px;text-align:center;">${i + 1}</span>
          ${f.title}
        </a>
        <p style="margin-top:8px;font-size:14px;color:var(--text-muted);line-height:1.5;">
          ${f.title.split(' ').slice(0, 3).join(' ')}... - Dokumentasi lengkap dalam tema gelap.
        </p>
      </div>`).join('')}
    </div>
  </main>
</body>
</html>`;

writeFileSync(join(DOCS_DIR, 'index-dark.html'), indexHtml, 'utf-8');
console.log(`  ✅ index-dark.html`);
success++;

console.log(`\nDone: ${success} dark theme files generated, ${failed} failed.`);
