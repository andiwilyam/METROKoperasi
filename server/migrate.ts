import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');

    // Check if migrations table exists and if schema was applied
    const { rows } = await client.query(
      `SELECT COUNT(*) as count FROM migrations WHERE name = '001_initial_schema'`
    );

    if (parseInt(rows[0].count) === 0) {
      console.log('Running initial schema migration...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schemaSQL);
      await client.query(
        `INSERT INTO migrations (name) VALUES ('001_initial_schema')`
      );
      console.log('Schema migration applied.');
    }

    const { rows: seedRows } = await client.query(
      `SELECT COUNT(*) as count FROM migrations WHERE name = '002_seed_data'`
    );

    if (parseInt(seedRows[0].count) === 0) {
      console.log('Running seed data migration...');
      const seedSQL = fs.readFileSync(seedPath, 'utf-8');
      // Seed might have conflicts, that's OK
      try {
        await client.query(seedSQL);
      } catch (err: any) {
        // Ignore duplicate key errors in seed
        if (!err.message?.includes('duplicate key')) {
          console.warn('Seed warning:', err.message);
        }
      }
      await client.query(
        `INSERT INTO migrations (name) VALUES ('002_seed_data')`
      );
      console.log('Seed data applied.');
    }

    // GL Module migration (re-run schema + seed to add GL tables idempotently)
    const { rows: glRows } = await client.query(
      `SELECT COUNT(*) as count FROM migrations WHERE name = '003_general_ledger'`
    );
    if (parseInt(glRows[0].count) === 0) {
      console.log('Running General Ledger migration...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
      const seedSQL = fs.readFileSync(seedPath, 'utf-8');
      try { await client.query(schemaSQL); } catch (err: any) {
        if (!err.message?.includes('already exists')) console.warn('GL schema warning:', err.message);
      }
      try { await client.query(seedSQL); } catch (err: any) {
        if (!err.message?.includes('duplicate key')) console.warn('GL seed warning:', err.message);
      }
      await client.query(`INSERT INTO migrations (name) VALUES ('003_general_ledger')`);
      console.log('General Ledger migration applied.');
    }

    // Landing Page CMS migration
    const { rows: landingRows } = await client.query(
      `SELECT COUNT(*) as count FROM migrations WHERE name = '004_landing_cms'`
    );
    if (parseInt(landingRows[0].count) === 0) {
      console.log('Running Landing Page CMS migration...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
      try { await client.query(schemaSQL); } catch (err: any) {
        if (!err.message?.includes('already exists')) console.warn('Landing CMS schema warning:', err.message);
      }
      await client.query(`INSERT INTO migrations (name) VALUES ('004_landing_cms')`);
      console.log('Landing Page CMS migration applied.');
    }

    console.log('Migrations complete.');
  } finally {
    client.release();
  }
}
