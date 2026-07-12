const {Pool} = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true';
const p = new Pool({connectionString: conn, family: 4, connectionTimeoutMillis: 10000});
p.query("UPDATE users SET password_hash = '$2b$10$6awUwNIuzQOyYY7L3shB9OE8AGT6oRV4TBJpu3AOFG9VRmiA5N8Mq' WHERE username = $1", ['admin']).then(r => console.log('Updated:', r.rowCount)).catch(e => console.error('FAIL:', e.message)).finally(() => p.end());