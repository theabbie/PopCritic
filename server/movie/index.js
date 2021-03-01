require('dotenv').config({path: './../.env'});

var axios = require("axios");

var DB = require("./../DB");
var People = require("./../people");

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

  static async getCast(id) {
    var db = new DB();
    var cast = await db.query("SELECT people_id,name,image,profession,role FROM Casting NATURAL JOIN People WHERE movie_id=$1;", [id.toString()]);
    await db.end();
    return cast.rows;
  }

  static async postReview(movie_id,user_id,rating,review) {
    var db = new DB();
    await db.query("INSERT INTO Reviews (review_id,review_text,rating,user_id,movie_id) VALUES (default,$1,$2,$3,$4) ON CONFLICT DO NOTHING;", [review,rating,user_id,movie_id]);
    await db.end();
    return true;
  }

  static async add(id) {
  	var movie = await Movie.fetch(id);
    var cast = await Movie.fetchCast(id);
  	var db = new DB();
  	await db.query("INSERT INTO Movie (movie_id,title,plot,poster,release_date,imdb_id) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING;", [movie.id,movie.original_title,movie.overview,movie.poster_path,movie.release_date,movie.imdb_id]);
  	for (var people of cast) {
      await People.add(people.id,people.name,people.profile_path,people.known_for_department);
      await db.query("INSERT INTO Casting (role,people_id,movie_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING;", [people.known_for_department,people.id,movie.id]); 
    }
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
      return movie.data.cast.slice(0,10);
    }
    catch (e) {
      throw new Exception(400,"Invalid Movie ID");
    }
  }
}

module.exports = Movie;