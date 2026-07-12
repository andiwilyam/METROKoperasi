#!/bin/bash
# MetroCoop — Startup script for Railway
# Starts HTTP server IMMEDIATELY for healthcheck, DB migrations in background

set -e

echo "🚀 MetroCoop starting on Railway..."
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV:-production}"
echo "PWD: $(pwd)"
ls -la dist/ 2>&1 | head -5 || echo "dist/ not found"
ls -la landing/ 2>&1 | head -3 || echo "landing/ not found"

# ---- START HTTP SERVER IMMEDIATELY ----
# This MUST happen first so /api/health responds within 100s healthcheck window
echo "🟢 Starting HTTP server NOW..."
node dist/server.cjs &
SERVER_PID=$!
echo "🟢 Server PID: $SERVER_PID"

# Verify server started
sleep 1
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ ERROR: Server process died immediately!" >&2
  exit 1
fi
echo "✅ Server process alive"

# ---- DB MIGRATIONS IN BACKGROUND (non-blocking) ----
(
  echo "📦 [bg] Waiting for database..."
  for i in $(seq 1 30); do
    if node -e "
const {Pool}=require('pg');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.error('No DATABASE_URL'); process.exit(1); }
const p=new Pool({connectionString: conn});
p.query('SELECT 1').then(()=>{console.log('DB OK'); process.exit(0)}).catch(e=>{console.error('DB fail:',e.message); process.exit(1)});
" 2>&1; then
      echo "✅ [bg] Database connected"
      break
    fi
    echo "  [bg] attempt $i/30..."
    sleep 2
  done

  echo "📦 [bg] Running migrations (best effort)..."
  node -e "
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.log('[bg] No DATABASE_URL, skipping'); process.exit(0); }
const pool = new Pool({ connectionString: conn, max: 5, idleTimeoutMillis: 10000 });
const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(process.cwd(), 'db', 'seed.sql'), 'utf8');
(async () => {
  try {
    await pool.query(schema);
    await pool.query(seed);
    console.log('✅ [bg] Schema + seed applied');
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error('⚠️ [bg] Migration warning:', e.message);
    await pool.end();
    process.exit(0);
  }
})();
" 2>&1 || echo "⚠️ [bg] Migration completed with warnings"
) &
MIGRATION_PID=$!
echo "📦 [bg] Migration PID: $MIGRATION_PID"

# Wait for server (this keeps container alive)
wait $SERVER_PID