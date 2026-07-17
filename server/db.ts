import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Parse numeric types to numbers (pg returns them as strings by default)
const pgTypes = pg.types;
pgTypes.setTypeParser(20, (val: string) => parseInt(val, 10));  // INT8
pgTypes.setTypeParser(1700, (val: string) => {                  // NUMERIC
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
});
pgTypes.setTypeParser(701, (val: string) => parseFloat(val));  // FLOAT8

// Also set on the default types
const { defaults } = pg;
if (defaults && defaults.parseInt8 !== undefined) {
  defaults.parseInt8 = true;
}

// Only enable TLS when explicitly required (cloud DBs like Supabase/Railway).
// Local PostgreSQL (and many servers) reject SSL entirely, so forcing it
// makes pool.connect() fail with "The server does not support SSL connections".
const dbUrl = process.env.DATABASE_URL || '';
const sslEnabled =
  /sslmode=require/i.test(dbUrl) || process.env.DB_SSL === 'true';

const pool = dbUrl
  ? new pg.Pool({
      connectionString: dbUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
      family: 4, // Force IPv4 for Supabase/Railway compatibility
    })
  : new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'metromitra',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
    });

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export default pool;
