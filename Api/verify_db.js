require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'kilometresante'
});

pool.query('SELECT count(*) AS count FROM users')
  .then((res) => {
    console.log('users count:', res.rows[0].count);
    return pool.end();
  })
  .catch((err) => {
    console.error('verification error:', err.message);
    return pool.end();
  });
