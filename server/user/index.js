require('dotenv').config({path: './../.env'});

var DB = require("./../DB");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class User {
  constructor() {}

  static async isValid(token) {
  	var db = new DB();
    var isValid = await db.query("SELECT EXISTS(SELECT * FROM Sessions WHERE session_id=$1);",[token]);
    await db.end();
    if (!isValid.rows[0].exists) throw new Exception(400,"Invalid Token");
    else return true;
  }
}

module.exports = User;