var logger = require('./helpers/logger.js');
var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , port = process.env.PORT || 3000

var cookieParser = require('cookie-parser');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose    = require('mongoose');
var cfg    = require('./config.js');
var passport = require('passport');
var https = require('https');
var morgan = require('morgan');
var FacebookStrategy = require('passport-facebook').Strategy;
var errorhandler = require('./middlewares/errorhandler.js');
var auth = require('./helpers/auth.js');
var customMw = require('./middlewares/middleware.js');

var opt = {
  server:{
       socketOptions: { keepAlive: 1}
  } 
};

logger.debug("Connect to db...");
logger.debug(cfg.mongo.connectionString);

mongoose.connect(cfg.mongo.connectionString, function(err) {
    if (err) {
      logger.error(err);
        throw err;
    }
	else
		logger.debug("Connection to DB established...");
});

app.use(session({
	secret: 'foo',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
	resave: false,
    saveUninitialized: true
}));
  
app.set('views', __dirname + '/views')
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(customMw.sessionCookie);
app.use(morgan('combined', {
    "stream": logger.stream
}));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}))

passport.use(new FacebookStrategy({
    clientID: cfg.facebook.apiKey,
    clientSecret: cfg.facebook.apiSecret,
    callbackURL: cfg.facebook.callback,
    profileFields: cfg.facebook.fields,
    passReqToCallback: true
  }, auth.facebookAuth));
  
passport.serializeUser(function(user, done){
    return done(null, user);
});

passport.deserializeUser(function(obj, done){
    return done(null, obj);
});

app.use(require('./controllers'))
app.get('*', errorhandler.handler_404);

app.use(errorhandler.logerror);
app.use(errorhandler.handler_500);
app.use(errorhandler.render_404);
app.use(errorhandler.render_500);

sslport = 443;
httpsServer = https.createServer(cfg.sslcert, app);
httpsServer.listen(sslport, function(){
	logger.info("worker " + process.pid + " is ready (:" + sslport + ")")
});