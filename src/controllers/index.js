var express = require('express')
  , router = express.Router()
  , path = require('path')
  , customMw = require('../middlewares/middleware.js');
  
var logger = require('../helpers/logger.js');
  
router.use('/users', require('./users'))
router.use('/auth', require('./facebook'))
router.use('/lists', require('./lists'))
router.use('/bookmarks', require('./bookmarks'))

router.get('/', customMw.isAuthentificated, function(req, res){
		res.render('lists');
    });

router.get('/search', customMw.isAuthentificated, function(req, res){
		res.render('search');
    });

router.get('/mybookmarks', customMw.isAuthentificated, function(req, res){
		res.render('bookmarks');
    });

router.get('/profile', customMw.isAuthentificated, function(req, res){
		res.render('profile');
    });

router.get('/login', function(req, res) {
        res.render('login');
    });

module.exports = router; 