var fs = require('fs');
var ENV = process.env.NODE_ENV || 'DEV';

var fbcall;
if (ENV == 'production')
	fbcall = 'https://quokka-the-lists.herokuapp.com/auth/facebook/callback';
else
	fbcall = 'http://localhost:3000/auth/facebook/callback';

var log = {
    file: "./logs/all-logs.log",
};

var loggly = {
    token: "5301da7e-cdac-4b4c-b222-980382c5b5ef",
    subdomain: "mytop5",
    tags: ["Winston-NodeJS"],
    json:true
};

var mongo = {
	connectionString: "mongodb://mytop5-node:ghjdthrf@ds063869.mongolab.com:63869/mytop5"
}

var sslcert = {
    key: fs.readFileSync('./src/sslcerts/server.key'),
    cert: fs.readFileSync('./src/sslcerts/server.crt')
}
 
var facebook = {
    apiKey: '1641569646091283',
    apiSecret: '27cc6a4c90c35c3fba25177364e9fd2f',
	callback: fbcall,
    fields: ["id", "birthday", "email", "first_name", "gender", "last_name"]
}

var cloudinary = ({ 
  cloud_name: 'quokka', 
  api_key: '128924843972333', 
  api_secret: 'yQkx4lCLTBW0mNKnkBoPlHHrAzQ' 
});

exports.ENV = ENV;
exports.facebook = facebook;
exports.sslcert = sslcert;
exports.log = log;
exports.loggly = loggly;
exports.mongo = mongo;
exports.cloudinary = cloudinary;