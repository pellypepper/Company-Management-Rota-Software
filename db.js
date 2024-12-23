const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
 
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

module.exports = pool;


