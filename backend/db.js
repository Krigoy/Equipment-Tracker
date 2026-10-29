const { Pool, types } = require('pg');

// Return DATE columns as plain 'YYYY-MM-DD' strings. By default pg turns them into
// JS Dates at local midnight, which shifts the day when the server isn't on UTC.
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// An idle client error (e.g. Postgres restarting) would otherwise crash the process.
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};


