require('dotenv').config({path: './../.env'});

var axios = require("axios");

var DB = require("./../DB");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class Review {
  constructor() {}

  static async add(movie_id,user_id,rating,review) {
  	var db = new DB();
  	await db.query("INSERT INTO Reviews (review_id,review_text,rating,user_id,movie_id) VALUES (default,$1,$2,$3,$4) ON CONFLICT DO NOTHING;", [review,rating,user_id,movie_id]);
  	await db.end();
  	return true;
  }
}

module.exports = Review;