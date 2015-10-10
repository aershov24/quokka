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
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
  
app.set('views', __dirname + '/views')
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('./controllers'))

app.post('/info',function(req,res){
  req.session.name=req.body.name;
  res.redirect('/info');
});
app.get('/info',function(req,res){
  res.send('<div style="color:red;font-size:30;">'+req.session.name+'</div>'+'<div><a href="/">back</a></div>');
});

app.listen(port, function() {
  logger.info('Listening on port ' + port)
})