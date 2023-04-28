const { Client } = require('pg');
const { DATABASE_URL } = process.env;

const connectionString = DATABASE_URL || 'postgres://localhost:5432/our_pets';

const client = new Client(connectionString);

module.exports = { client };
