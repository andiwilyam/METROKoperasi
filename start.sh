#!/bin/bash
# MetroCoop — Startup script for Railway
# Runs migrations (best effort), then starts the production server

set -e

# Immediate logging to stderr so Railway captures it
echo "🚀 MetroCoop start.sh ENTRYPOINT" >&2
echo "PORT: ${PORT:-3000}" >&2
echo "NODE_ENV: ${NODE_ENV:-production}" >&2
echo "PWD: $(pwd)" >&2
ls -la >&2

# Wait for database to be ready (Railway PostgreSQL)
echo "⏳ Waiting for database..." >&2
for i in $(seq 1 30); do
  if node -e "
const {Pool}=require('pg');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.error('No DATABASE_URL'); process.exit(1); }
const p=new Pool({connectionString: conn});
p.query('SELECT 1').then(()=>{console.log('DB OK'); process.exit(0)}).catch(e=>{console.error('DB fail:',e.message); process.exit(1)});
" 2>&1; then
    echo "✅ Database connected" >&2
    break
  fi
  echo "  attempt $i/30..." >&2
  sleep 2
done

# Run migrations (best effort - don't fail startup if migration has issues)
echo "📦 Running migrations (best effort)..." >&2
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const conn = process.env.DATABASE_URL || process.env.DB_URL;
if (!conn) { console.log('⚠️ No DATABASE_URL, skipping migration'); process.exit(0); }
const pool = new Pool({ connectionString: conn, max: 5, idleTimeoutMillis: 10000 });
const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(process.cwd(), 'db', 'seed.sql'), 'utf8');
(async () => {
  try {
    await pool.query(schema);
    await pool.query(seed);
    console.log('✅ Schema + seed applied');
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error('⚠️ Migration warning (continuing anyway):', e.message);
    await pool.end();
    process.exit(0); // Don't fail startup
  }
})();
" 2>&1 || echo "⚠️ Migration step completed with warnings" >&2

# Start server
echo "🟢 Starting server on port ${PORT:-3000}..." >&2
exec node dist/server.cjs