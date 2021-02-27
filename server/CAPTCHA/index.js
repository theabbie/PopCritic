require('dotenv').config({path: './../.env'});

var axios = require("axios");
var fd = require("form-data");

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
  	  if (!req.header("g-recaptcha-response")) throw new Exception(400,"Parameter Missing: g-recaptcha-response");
  	  var data = new fd();
      data.append("secret",process.env.RECAPTCHA);
      data.append("response",req.header("g-recaptcha-response"));
      var score = await axios({
  	  	url: "https://www.google.com/recaptcha/api/siteverify",
  	  	method: "POST",
  	  	data,
        headers: data.getHeaders()
  	  });
  	  if (!score.data.success) throw new Exception(400,"Not A Human");
  	}
  	catch (e) {
      console.log(e.message);
  	  throw new Exception(400,"Not A Human");
  	}
  }
}

module.exports = CAPTCHA;