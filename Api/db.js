// Connexion PostgreSQL avec fallback local JS
require('dotenv').config();
const { Pool } = require('pg');
const localDb = require('./data/localDb');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'Kilometre-Santé',
});

let useLocalDb = false;

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
};
