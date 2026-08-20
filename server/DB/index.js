require('dotenv').config({path: './../.env'});
const { Pool } = require('pg');

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

// Shared connection pool (module-level) instead of a fresh Client per request.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000
});

class DB {
  constructor() {
    this.client = pool;
  }

  async query(query,params) {
    try {
      return await this.client.query(query,params);
    }
    catch (e) {
      throw new Exception(500, e.message);
    }
  }

  async end() {
    // no-op: connections are returned to the shared pool automatically
  }
}

module.exports = DB;
