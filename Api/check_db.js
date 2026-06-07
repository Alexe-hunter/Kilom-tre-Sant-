require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'kilometresante'
});

(async () => {
  try {
    const result = await pool.query('SELECT arrondissement, COUNT(*) AS count FROM pharmacies GROUP BY arrondissement ORDER BY arrondissement');
    console.log('arrondissements:');
    result.rows.forEach(row => console.log(`${row.arrondissement}: ${row.count}`));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();