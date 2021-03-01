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

  static async getID(token) {
    var db = new DB();
    var ID = await db.query("SELECT * FROM Sessions WHERE session_id=$1;",[token]);
    await db.end();
    if (ID.rows.length>0) return ID.rows[0].user_id;
    else throw new Exception(400,"Invalid Token");
  }

  static async get(id) {
    var db = new DB();
    var users = await db.query("SELECT * FROM Users WHERE user_id=$1", [id.toString()]);
    await db.end();
    if (users.rows.length==0) throw new Exception(400,"User Doesn't Exist");
    else return users.rows[0];
  }

  static async getMovieReviews(id) {
    var db = new DB();
    var reviews = await db.query("SELECT movie_id,title,poster,review_id,review_text,rating FROM Reviews NATURAL JOIN Movie WHERE user_id=$1;", [id.toString()]);
    await db.end();
    return reviews.rows;
  }

  static async getPeopleReviews(id) {
    var db = new DB();
    var reviews = await db.query("SELECT people_id,name,image,profession,review_id,review_text,rating FROM Reviews NATURAL JOIN People WHERE user_id=$1;", [id.toString()]);
    await db.end();
    return reviews.rows;
  }
}

module.exports = User;