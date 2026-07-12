const {Pool} = require('pg');
const conn = 'postgresql://postgres.brrjbrrgmjgbcylpccdz:yd4h@h73CHERIO@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true';
const p = new Pool({connectionString: conn, family: 4, connectionTimeoutMillis: 10000});
p.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'perusahaan' ORDER BY ordinal_position").then(r => console.log(r.rows.map(x => x.column_name).join(', '))).catch(e => console.error(e.message)).finally(() => p.end());