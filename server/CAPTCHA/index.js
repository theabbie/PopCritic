require('dotenv').config({path: './../.env'});

var axios = require("axios");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

class CAPTCHA {
  constructor() {}

  static async check(req) {
  	try {
  	  if (!req.body["g-recaptcha-response"]) throw new Exception(400,"Parameter Missing: g-recaptcha-response");
  	  var score = await axios({
  	  	url: "https://www.google.com/recaptcha/api/siteverify",
  	  	method: "POST",
  	  	data: {
  	  	  secret: process.env.RECAPTCHA,
  	  	  response: req.body["g-recaptcha-response"]
  	  	}
  	  });
  	  if (!score.data.success) throw new Exception(400,"Not A Human");
  	}
  	catch (e) {
  	  throw new Exception(400,"Not A Human");
  	}
  }
}

module.exports = CAPTCHA;