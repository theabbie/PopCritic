require('dotenv').config({path: './../.env'});
var axios = require("axios");
var crypto = require('crypto');

var DB = require("./../DB");

class Exception {
  constructor(code,message) {
    this.code = code;
    this.message = message;
  }
}

var CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

var scope = "https://www.googleapis.com/auth/userinfo.email";

class Auth {
  constructor() {}

  static redirectURL() {
  	return CREDENTIALS.web["auth_uri"]+"?scope="+scope+"&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri="+CREDENTIALS.web["redirect_uris"][0]+"&response_type=code&client_id="+CREDENTIALS.web["client_id"]
  }

  static async getAccessToken(code) {
  	try {
  	  var access_token = await axios({
       	  url: CREDENTIALS.web["token_uri"],
    	  method: "POST",
    	  data: {
    	    client_id: CREDENTIALS.web["client_id"],
    	    client_secret: CREDENTIALS.web["client_secret"],
    	    code: code,
    	    grant_type: "authorization_code",
    	    redirect_uri: CREDENTIALS.web["redirect_uris"][0]
    	  }
      });
      return access_token.data.access_token;
    }
    catch (e) {
      throw new Exception(500,e.message);
    }
  }

  static async getUser(access_token) {
  	try {
  	  var user = await axios({
        url: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token,
        method: "GET"
      });
      return user.data;
    }
    catch (e) {
      throw new Exception(500,e.message);
    }
  }

  static async createUser(user) {
  	var db = new DB();
    await db.query("INSERT INTO Users (user_id,join_date,authenticity,email,pic) VALUES ($1,current_timestamp,0,$2,$3) ON CONFLICT DO NOTHING;",[user.id,user.email,user.picture]);
    var token = crypto.randomBytes(8).toString('hex');
    await db.query("DELETE FROM Sessions WHERE user_id=$1",[user.id]);
    await db.query("INSERT INTO Sessions (session_id,user_id,created) VALUES ($1,$2,current_timestamp)",[token,user.id]);
    await db.end();
    return token;
  }
}

module.exports = Auth;