const {Pool} = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true';
const p = new Pool({connectionString: conn, family: 4, connectionTimeoutMillis: 10000});
p.query('SELECT * FROM users WHERE username=$1', ['admin']).then(r => console.log('OK:', r.rows)).catch(e => console.error('FAIL:', e.message)).finally(() => p.end());