const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

async function run() {
  const env = process.env;
  const dbName = env.PGDATABASE || 'kilometresante';
  const adminPool = new Pool({
    host: env.PGHOST || 'localhost',
    port: parseInt(env.PGPORT) || 5432,
    user: env.PGUSER || 'postgres',
    password: env.PGPASSWORD,
    database: 'postgres'
  });

  try {
    const exists = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (exists.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${dbName};`);
      console.log('Database created:', dbName);
    } else {
      console.log('Database already exists:', dbName);
    }
  } finally {
    await adminPool.end();
  }

  const sqlFile = path.join(__dirname, 'data', 'pharma.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  const appPool = new Pool({
    host: env.PGHOST || 'localhost',
    port: parseInt(env.PGPORT) || 5432,
    user: env.PGUSER || 'postgres',
    password: env.PGPASSWORD,
    database: dbName
  });

  try {
    await appPool.query(sql);
    console.log('Schema and seed data imported successfully.');
  } finally {
    await appPool.end();
  }
}

run().catch((err) => {
  console.error('Initialization error:', err.message || err);
  process.exit(1);
});
