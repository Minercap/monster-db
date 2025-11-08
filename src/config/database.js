const { Pool } = require('pg');

// Configure via environment variables for deploys. Supports DATABASE_URL or individual vars.
const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false }
    : {
          user: process.env.DB_USER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          database: process.env.DB_NAME || 'opti_database',
          password: process.env.DB_PASS || 'migue314',
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      };

// For serverless environments (like Vercel) reuse the pool across invocations
const pool = global.__pgPool ? global.__pgPool : new Pool(config);
if (!global.__pgPool) global.__pgPool = pool;

module.exports = pool;