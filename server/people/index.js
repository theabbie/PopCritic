require('dotenv').config({path: './../.env'});

var axios = require("axios");

var DB = require("./../DB");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class People {
  constructor() {}

  static async get(id) {
  	var db = new DB();
  	var movie = await db.query("SELECT * FROM People WHERE people_id=$1", [id.toString()]);
  	await db.end();
  	if (movie.rows.length==0) throw new Exception(400,"Person Doesn't Exist in Database");
  	else return movie.rows[0];
  }

  static async getReviews(id) {
    var db = new DB();
    var reviews = await db.query("SELECT user_id,pic,name,review_id,review_text,rating FROM Reviews NATURAL JOIN Users WHERE people_id=$1;", [id.toString()]);
    await db.end();
    return reviews.rows;
  }

  static async getMovies(id) {
    var db = new DB();
    var movies = await db.query("SELECT movie_id,title,plot,poster,release_date,role FROM Casting NATURAL JOIN Movie WHERE people_id=$1;", [id.toString()]);
    await db.end();
    return movies.rows;
  }

  static async add(id,name,image,profession) {
  	var db = new DB();
  	await db.query("INSERT INTO People (people_id,name,image,profession) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING;", [id,name,image,profession]);
  	await db.end();
  	return true;
  }

  static async postReview(people_id,user_id,rating,review) {
    var db = new DB();
    await db.query("INSERT INTO Reviews (review_id,review_text,rating,user_id,people_id) VALUES (default,$1,$2,$3,$4) ON CONFLICT DO NOTHING;", [review,rating,user_id,people_id]);
    await db.end();
    return true;
  }

  static async fetch(id) {
  	try {
  	  var movie = await axios({
  	  	url: "https://api.themoviedb.org/3/movie/"+id+"?api_key="+process.env.TMDB,
  	  	method: "GET"
  	  });
  	  return movie.data;
  	}
  	catch (e) {
  	  throw new Exception(400,"Invalid Movie ID");
  	}
  }

  static async fetchCast(id) {
    try {
      var movie = await axios({
        url: "https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+process.env.TMDB,
        method: "GET"
      });
      return movie.data.cast;
    }
    catch (e) {
      throw new Exception(400,"Invalid Movie ID");
    }
  }
}

module.exports = People;