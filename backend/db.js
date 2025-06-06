
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:HelpmeGod89@@db.qkuaihszliaeqjjxskpe.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});


pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

module.exports = pool;