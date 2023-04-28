const { Client } = require('pg');
const { DATABASE_URL } = process.env;
console.log(process.env);

const connectionString = DATABASE_URL || 'postgres://localhost:5432/our_pets';

const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = { client };
