var logger = require('../helpers/logger.js');

exports.logerror = function(err, req, res, next){
    logger.error(err.stack);
    return next(err);
  };
  
exports.handler_404 = function(req, res, next){
    var err;
    logger.debug('404: Page not found...');
    err = new Error;
    err.status = 404;
    return next(err);
  };
  
exports.handler_500 = function(err, req, res, next){
    if (req.xhr) {
      return res.status(500).send({
        error: 'Something blew up!'
      });
    } else {
      return next(err);
    }
  };
  
exports.render_404 = function(err, req, res, next){
    if (err.status !== 404) {
      logger.debug('next');
      return next(err);
    }
    return res.send(err.message || '** Page not found! **');
  };
  
exports.render_500 = function(err, req, res, next){
    res.status(500);
    return res.send({
      error: err.stack
    });
  };