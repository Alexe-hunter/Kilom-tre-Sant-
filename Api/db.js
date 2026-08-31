// Connexion PostgreSQL avec fallback local JS
require('dotenv').config();
const { Pool } = require('pg');
const localDb = require('./data/localDb');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  // use a consistent default DB name (no accents) to match other scripts
  database: process.env.PGDATABASE || 'kilometresante',
});

let useLocalDb = false;

// Allow forcing the local JS DB via environment variable for development/debug
if (String(process.env.FORCE_LOCAL_DB || '').toLowerCase() === 'true') {
  useLocalDb = true;
}

async function query(text, params = []) {
  if (useLocalDb) {
    return localDb.query(text, params);
  }

  try {
    return await pool.query(text, params);
  } catch (err) {
    console.warn('PostgreSQL indisponible, bascule sur la base locale JavaScript.');
    console.warn(err.message);
    useLocalDb = true;
    return localDb.query(text, params);
  }
}

pool.on('error', (err) => {
  console.warn('Erreur du pool PostgreSQL, activation du mode local JS.');
  console.warn(err.message);
  useLocalDb = true;
});

module.exports = {
  query,
  pool,
  useLocalDb: () => useLocalDb,
  // helper to toggle programmatically (useful in tests or admin endpoints)
  setUseLocalDb: (val) => { useLocalDb = Boolean(val); }
};
