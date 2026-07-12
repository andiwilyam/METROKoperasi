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

const pool = process.env.DATABASE_URL
  ? new pg.Pool({ 
      connectionString: process.env.DATABASE_URL, 
      max: 20, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false }
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
