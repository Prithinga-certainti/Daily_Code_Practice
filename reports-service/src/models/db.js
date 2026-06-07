const { Pool } = require('pg');
const pool = new Pool({
  host     : process.env.DB_HOST     || 'localhost',
  port     : process.env.DB_PORT     || 5432,
  database : process.env.DB_NAME     || 'foodiego',
  user     : process.env.DB_USER     || 'prithingasenthilkumar',
  password : process.env.DB_PASSWORD || '',
});
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully — prithingasenthilkumar');
    release();
  }
});

module.exports = pool;