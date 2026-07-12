#!/bin/bash
# MetroCoop — Startup script for Railway
# Starts HTTP server IMMEDIATELY for healthcheck, DB migrations in background

set -e

echo "🚀 MetroCoop starting on Railway..."
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV:-production}"
echo "PWD: $(pwd)"
ls -la dist/ 2>&1 | head -5 || echo "dist/ not found"

# ---- START HTTP SERVER IMMEDIATELY ----
echo "🟢 Starting HTTP server NOW..."
node -e "
const http = require('http');
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok', timestamp: new Date().toISOString()}));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ DEBUG HTTP server listening on', PORT);
});
" &
DEBUG_PID=$!
echo "🟢 Debug server PID: $DEBUG_PID"

sleep 2
if ! kill -0 $DEBUG_PID 2>/dev/null; then
  echo "❌ DEBUG server died!"
  exit 1
fi
echo "✅ Debug server alive"

# Now try real server
echo "🟢 Starting REAL server..."
# Kill debug server first
kill $DEBUG_PID 2>/dev/null
sleep 1
node dist/server.cjs &
SERVER_PID=$!
echo "🟢 Real server PID: $SERVER_PID"

sleep 2
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Real server died! Check server.cjs for errors"
  # Kill debug server
  kill $DEBUG_PID 2>/dev/null
  exit 1
fi
echo "✅ Real server alive"

# ---- DB MIGRATIONS IN BACKGROUND ----
(
  echo "📦 [bg] Waiting for database..."
  for i in $(seq 1 30); do
    if node -e "
const {Pool}=require('pg');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.error('No DATABASE_URL'); process.exit(1); }
const p=new Pool({connectionString: conn, family: 4});
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
const pool = new Pool({ connectionString: conn, max: 5, idleTimeoutMillis: 10000, family: 4 });
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

# Wait for real server
wait $SERVER_PID