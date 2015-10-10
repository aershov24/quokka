var express = require('express')
  , router = express.Router()

var logger = require('../helpers/logger.js');
var customMw = require('../middlewares/middleware.js');

router.get('/profile', customMw.isAuthentificated, function(req, res) {
	res.send({ user: req.session.user });
});

router.get('/logout', customMw.isAuthentificated, function(req, res) {
	req.session.destroy(function(err) {
		if (!err){
			res.redirect('/');
		}
		else {
			logger.warn(err);
			res.redirect('/');
		}
	})
});

module.exports = router