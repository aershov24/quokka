var express = require('express')
  , router = express.Router()
  , path = require('path')
  , User = require('../models/user')

var logger = require('../helpers/logger.js');
var customMw = require('../middlewares/middleware.js');

router.get('/profile', customMw.isAuthentificated, function(req, res) {
	res.send(req.session.user);
});

router.get('/profile/:userId', customMw.isAuthentificated, function(req, res) {
	User.getById(req.params.userId, function (err, user) {
		res.send(user);
	})
});

router.get('/logout', customMw.isAuthentificated, function(req, res) {
	req.session.destroy(function(err) {
		if (!err){
			res.redirect('/users/login');
		}
		else {
			logger.warn(err);
			res.redirect('/users/login');
		}
	})
});

router.get('/login', function(req, res) {
        res.sendFile(path.resolve('src/public/login.html')); // load the single view file (angular will handle the page changes on the front-end)
    });

module.exports = router