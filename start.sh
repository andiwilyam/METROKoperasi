#!/bin/bash
# MetroCoop — Startup script for Railway
# Runs migrations + seeds, then starts the production server

set -e

echo "🚀 MetroCoop starting on Railway..."

# Wait for database to be ready (Railway PostgreSQL)
echo "⏳ Waiting for database..."
for i in $(seq 1 30); do
  if node -e "const {Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL||process.env.DB_URL});p.query('SELECT 1').then(()=>process.exit(0)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "✅ Database connected"
    break
  fi
  echo "  attempt $i/30..."
  sleep 2
done

# Run migrations (includes seeding via server/migrate.ts)
echo "📦 Running migrations..."
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.DB_URL });
const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(process.cwd(), 'db', 'seed.sql'), 'utf8');
(async () => {
  try {
    await pool.query(schema);
    await pool.query(seed);
    console.log('✅ Schema + seed applied');
    await pool.end();
  } catch (e) {
    console.error('Migration error:', e.message);
    process.exit(1);
  }
})();
" || echo "⚠️ Migration failed, server will retry"

# Start server
echo "🟢 Starting server..."
exec node dist/server.cjs
