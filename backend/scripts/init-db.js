// backend/scripts/init-db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create mission_vision table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS mission_vision (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mission TEXT NOT NULL,
        vision TEXT NOT NULL,
        core_values TEXT,
        purpose TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create church_history table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS church_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        year INTEGER,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

// Export the initDb function instead of calling it directly
module.exports = { initDb };
