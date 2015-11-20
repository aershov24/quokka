var logger = require('../helpers/logger.js');
var path = require('path');

exports.sessionCookie = function(req, res, next){
    logger.pdata('Current session:', req.session);
	logger.pdata('Current user:', req.session.user);
    logger.pdata('Current cookie:', req.headers.cookie);
    return next();
  };
  
exports.isAuthentificated = function(req, res, next){
    if (req.session.isAuthentificated) {
		return next();
    }
    return res.redirect('/login');
};