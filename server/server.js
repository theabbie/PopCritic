require('dotenv').config({path: './.env'});

var express = require("express");
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var Auth = require("./auth");
var DB = require("./DB");
var CAPTCHA = require("./CAPTCHA");
var User = require("./user");
var Movie = require("./movie");
var People = require("./people");

var app = express();
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','https://popcritic.web.app');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('json spaces', 2);

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

app.get('/login', async function(req,res) {
  res.redirect(307, Auth.redirectURL());
});

app.get('/callback', async function(req,res) {
  try {
    if (!req.query.code) throw new Exception(400,"Invalid Request");
    var access_token = await Auth.getAccessToken(req.query.code);
    var user = await Auth.getUser(access_token);
    var token = await Auth.createUser(user);
    res.redirect(307,"https://popcritic.web.app/login?token="+token);
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/me', async function(req,res) {
  try {
    if (!req.header("token")) throw new Exception(400,"Not Logged In");
    var db = new DB();
    var my_data = await db.query("SELECT * FROM Sessions NATURAL JOIN Users WHERE session_id=$1;",[req.header("token")]);
    await db.end();
    res.json(my_data.rows[0]);
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/users', async function(req,res) {
  try {
  	var db = new DB();
    var users = await db.query("SELECT * FROM Users;");
    await db.end();
    res.json(users.rows);
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/movies', async function(req,res) {
  try {
  	var db = new DB();
    var movies = await db.query("SELECT * FROM Movie;");
    await db.end();
    res.json(movies.rows);
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.post('/add/:id', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid Movie ID");
    await CAPTCHA.check(req);
    await User.getID(req.header("token"));
    await Movie.add(req.params.id);
    res.end("Done");
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/movie/:id', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid Movie ID");
    var movie = await Movie.get(req.params.id);
    var cast = await Movie.getCast(req.params.id);
    movie.cast = cast;
    res.json(movie);
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.get('/movie/:id/reviews', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid Movie ID");
    var reviews = await Movie.getReviews(req.params.id);
    res.json(reviews);
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.post('/movie/:id/reviews', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid Movie ID");
    if (!req.body.rating) throw new Exception(400,"Parameter Missing: rating");
    await CAPTCHA.check(req);
    var user_id = await User.getID(req.header("token"));
    await Movie.postReview(req.params.id,user_id,req.body.rating,req.body.review);
    res.end("Done");
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/people/:id', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid People ID");
    var people = await People.get(req.params.id);
    var movies = await People.getMovies(req.params.id);
    people.movies = movies;
    res.json(people);
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.get('/people/:id/reviews', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid People ID");
    var reviews = await People.getReviews(req.params.id);
    res.json(reviews);
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.post('/people/:id/reviews', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid People ID");
    if (!req.body.rating) throw new Exception(400,"Parameter Missing: rating");
    await CAPTCHA.check(req);
    var user_id = await User.getID(req.header("token"));
    await People.postReview(req.params.id,user_id,req.body.rating,req.body.review);
    res.end("Done");
  }
  catch (e) {
    if (e instanceof Exception) res.status(e.code).end(e.message);
    else res.json(e);
  }
});

app.get('/user/:id', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid User ID");
    var user = await User.get(req.params.id);
    res.json(user);
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.get('/user/:id/reviews', async function(req,res) {
  try {
    if (req.params.id.length==0) throw new Exception(400,"Invalid User ID");
    var movies = await User.getMovieReviews(req.params.id);
    var people = await User.getPeopleReviews(req.params.id);
    res.json({ movies, people });
  }
  catch (e) {
    res.status(e.code).end(e.message);
  }
});

app.post('/*', async function(req,res) {
  res.status(404).end("Not Found");
});

app.get('/*', async function(req,res) {
  res.status(404).end("Not Found");
});

app.listen(process.env.PORT || 8080);