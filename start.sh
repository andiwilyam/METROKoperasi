#!/bin/bash
# MetroCoop — Startup script for Railway
# Start HTTP server IMMEDIATELY for healthcheck, then run DB migrations in background

set -e

# Immediate logging
echo "🚀 MetroCoop start.sh ENTRYPOINT" >&2
echo "PORT: ${PORT:-3000}" >&2
echo "NODE_ENV: ${NODE_ENV:-production}" >&2

# ---- START HTTP SERVER IMMEDIATELY ----
# This must happen FIRST so /api/health responds within 100s healthcheck window
echo "🟢 Starting HTTP server NOW..." >&2
node dist/server.cjs &
SERVER_PID=$!

# ---- DB MIGRATIONS IN BACKGROUND (non-blocking) ----
(
  echo "📦 [bg] Waiting for database..." >&2
  for i in $(seq 1 30); do
    if node -e "
const {Pool}=require('pg');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.error('No DATABASE_URL'); process.exit(1); }
const p=new Pool({connectionString: conn});
p.query('SELECT 1').then(()=>{console.log('DB OK'); process.exit(0)}).catch(e=>{console.error('DB fail:',e.message); process.exit(1)});
" 2>&1; then
      echo "✅ [bg] Database connected" >&2
      break
    fi
    echo "  [bg] attempt $i/30..." >&2
    sleep 2
  done

  echo "📦 [bg] Running migrations (best effort)..." >&2
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
" 2>&1 || echo "⚠️ [bg] Migration completed with warnings" >&2
) &

# Wait for server (this keeps container alive)
wait $SERVER_PID