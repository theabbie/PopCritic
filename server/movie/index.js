require('dotenv').config({path: './../.env'});

var axios = require("axios");

var DB = require("./../DB");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class Movie {
  constructor() {}

  static async get(id) {
  	var db = new DB();
  	var movie = await db.query("SELECT * FROM Movie WHERE movie_id=$1", [id.toString()]);
  	await db.end();
  	if (movie.rows.length==0) throw new Exception(400,"Movie Doesn't Exist in Database");
  	else return movie.rows[0];
  }

  static async getReviews(id) {
    var db = new DB();
    var reviews = await db.query("SELECT user_id,pic,name,review_id,review_text,rating FROM Reviews NATURAL JOIN Users WHERE movie_id=$1;", [id.toString()]);
    await db.end();
    return reviews.rows;
  }

  static async add(id) {
  	var movie = await Movie.fetch(id);
  	var db = new DB();
  	await db.query("INSERT INTO Movie (movie_id,title,plot,poster,release_date) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING;", [movie.id,movie.original_title,movie.overview,movie.poster_path,movie.release_date]);
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

module.exports = Movie;