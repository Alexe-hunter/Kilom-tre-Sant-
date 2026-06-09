//Connexion à la base de données PostgreSQL
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'Kilometre-Santé',
});

//fonction helper pour exécuter mes requêtes
const query = (text, params) => {
  return pool.query(text, params);
};

//test de connexion au démarrage
pool.on('error', (err) => {
  console.error('Erreur de pool PostgreSQL:', err);
});

module.exports = {
  query,
  pool,
};
