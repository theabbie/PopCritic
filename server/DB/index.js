require('dotenv').config({path: './../.env'});
const { Client } = require('pg');

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class DB {
  constructor() {
  	this.client = new Client({
      connectionString: process.env.DATABASE_URL,
  	  ssl: { rejectUnauthorized: false }
	  });
	  this.client.connect();
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
  	await this.client.end();
  }
}

module.exports = DB;