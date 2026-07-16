#!/usr/bin/env node
/**
 * MetroCoop Documentation Converter
 * Converts Markdown files to styled HTML with navigation sidebar.
 * Usage: node convert-md-to-html.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --primary: #0f3d91;
  --primary-light: #1a56db;
  --primary-dark: #0a2a6e;
  --accent: #16a34a;
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --bg-code: #f1f5f9;
  --text: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --shadow: 0 1px 3px rgba(0,0,0,0.08);
  --sidebar-w: 280px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --bg-alt: #1e293b;
    --bg-code: #1e293b;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
    --border: #334155;
    --shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
  background: var(--bg);
  display: flex;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-w);
  height: 100vh;
  background: var(--primary-dark);
  color: #e2e8f0;
  overflow-y: auto;
  z-index: 100;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.sidebar-brand {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.sidebar-brand h2 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.sidebar-brand small {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.sidebar-nav {
  flex: 1;
  padding: 12px 0;
}
.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  border-left: 3px solid transparent;
}
.sidebar-nav a:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.sidebar-nav a.active {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border-left-color: var(--accent);
}
.sidebar-nav a .num {
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 22px;
  text-align: center;
}
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

/* Main content */
.content {
  margin-left: var(--sidebar-w);
  flex: 1;
  min-height: 100vh;
}
.content-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 40px 80px;
}

/* Typography */
h1 { font-size: 32px; font-weight: 800; color: var(--primary); margin: 0 0 8px; line-height: 1.2; }
h2 { font-size: 24px; font-weight: 700; color: var(--text); margin: 48px 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--primary); }
h3 { font-size: 20px; font-weight: 600; color: var(--text); margin: 32px 0 12px; }
h4 { font-size: 16px; font-weight: 600; color: var(--primary-light); margin: 24px 0 8px; }
h5 { font-size: 14px; font-weight: 600; color: var(--text-muted); margin: 20px 0 6px; text-transform: uppercase; letter-spacing: 0.5px; }
p { margin: 0 0 12px; }
strong { font-weight: 600; }
a { color: var(--primary-light); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Lists */
ul, ol { margin: 0 0 16px; padding-left: 24px; }
li { margin-bottom: 4px; }
li ul, li ol { margin-top: 4px; margin-bottom: 0; }

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 24px;
  font-size: 13px;
}
th {
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
}
td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
tr:hover td { background: var(--bg-alt); }
tr:nth-child(even) td { background: var(--bg-alt); }

/* Code */
code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--primary);
}
pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0 24px;
  line-height: 1.5;
  border: 1px solid var(--border);
}
pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 13px;
}

/* Blockquote */
blockquote {
  border-left: 4px solid var(--primary);
  background: var(--bg-alt);
  padding: 12px 20px;
  margin: 16px 0;
  border-radius: 0 8px 8px 0;
  color: var(--text-muted);
  font-style: italic;
}

/* Horizontal rule */
hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 32px 0;
}

/* Emoji & checkmarks */
.check { color: var(--accent); font-weight: 700; }
.cross { color: #dc2626; }

/* Print styles */
@media print {
  .sidebar { display: none; }
  .content { margin-left: 0; }
  .content-inner { max-width: 100%; padding: 20px; }
  h1, h2 { page-break-after: avoid; }
  table { page-break-inside: avoid; }
  pre { white-space: pre-wrap; word-wrap: break-word; }
}

/* Responsive */
@media (max-width: 1024px) {
  :root { --sidebar-w: 240px; }
  .content-inner { padding: 32px 24px; }
}
@media (max-width: 768px) {
  body { flex-direction: column; }
  .sidebar { position: relative; width: 100%; height: auto; max-height: 300px; }
  .content { margin-left: 0; }
  .content-inner { padding: 24px 16px; }
  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
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

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:12px 0;">');

  // Checkmarks
  html = html.replace(/✅/g, '<span class="check">✅</span>');
  html = html.replace(/❌/g, '<span class="cross">❌</span>');
  html = html.replace(/🔄/g, '<span class="check">🔄</span>');

  // Tables
  html = html.replace(/((?:^\|.+\|$\n?)+)/gm, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;

    const isSeparator = (r) => /^\|[\s\-:|]+\|$/.test(r);
    const parseRow = (r) => r.split('|').slice(1, -1).map(c => c.trim());

    let tableHtml = '<table>';
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

  // Fix tbody wrapping per row issue
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

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
    if (match.includes('<ol>')) return match;
    return `<ul>${match}</ul>`;
  });

  // Clean up nested <ul> inside <ul>
  html = html.replace(/<ul>\s*<ul>/g, '<ul>');
  html = html.replace(/<\/ul>\s*<\/ul>/g, '</ul>');

  // Paragraphs: wrap remaining text lines
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
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileInfo.title} — MetroCoop</title>
  <style>${CSS}</style>
</head>
<body>
  <nav class="sidebar">
    <div class="sidebar-brand">
      <h2>MetroCoop</h2>
      <small>Documentation Suite</small>
    </div>
    <div class="sidebar-nav">
      ${buildSidebar(files, activeIndex)}
    </div>
    <div class="sidebar-footer">
      MetroCoop © 2026<br>
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

// Main
console.log('MetroCoop Documentation Converter');
console.log('==================================');

let success = 0;
let failed = 0;

for (let i = 0; i < FILES.length; i++) {
  const f = FILES[i];
  const mdPath = join(DOCS_DIR, f.dir, f.file);
  const outName = `${f.dir}-${basename(f.file, '.md')}.html`;
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

// Index page
const indexHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MetroCoop — Documentation Suite</title>
  <style>${CSS}</style>
</head>
<body>
  <nav class="sidebar">
    <div class="sidebar-brand">
      <h2>MetroCoop</h2>
      <small>Documentation Suite</small>
    </div>
    <div class="sidebar-nav">
      ${FILES.map((f, i) => `<a href="${f.dir}-${basename(f.file, '.md')}.html" class="${i === 0 ? 'active' : ''}">
        <span class="num">${i + 1}</span>
        ${f.title}
      </a>`).join('\n')}
    </div>
    <div class="sidebar-footer">
      MetroCoop © 2026<br>
      Generated: ${new Date().toLocaleDateString('id-ID')}
    </div>
  </nav>
  <main class="content">
    <div class="content-inner">
      <h1>📋 Documentation Suite — MetroCoop</h1>
      <p style="color:var(--text-muted);font-size:16px;margin-bottom:32px;">
        Dokumentasi lengkap Sistem Informasi Koperasi Simpin Pinjam Terintegrasi.<br>
        Pilih dokumen dari sidebar atau klik tautan di bawah.
      </p>
      ${FILES.map((f, i) => `
      <div style="padding:16px 20px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;transition:all 0.15s;cursor:pointer;" onmouseover="this.style.borderColor='var(--primary)';this.style.boxShadow='var(--shadow)'" onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none'">
        <a href="${f.dir}-${basename(f.file, '.md')}.html" style="font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px;">
          <span style="background:var(--primary);color:#fff;font-size:12px;font-weight:700;padding:3px 8px;border-radius:4px;min-width:28px;text-align:center;">${i + 1}</span>
          ${f.title}
        </a>
      </div>`).join('')}
    </div>
  </main>
</body>
</html>`;

writeFileSync(join(DOCS_DIR, 'index.html'), indexHtml, 'utf-8');
console.log(`  ✅ index.html`);
success++;

console.log(`\nDone: ${success} files generated, ${failed} failed.`);
