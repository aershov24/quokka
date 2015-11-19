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
		res.sendFile(path.resolve('src/public/lists.html'));
    });

router.get('/search', customMw.isAuthentificated, function(req, res){
		res.sendFile(path.resolve('src/public/search.html'));
    });

router.get('/mybookmarks', customMw.isAuthentificated, function(req, res){
		res.sendFile(path.resolve('src/public/bookmarks.html'));
    });

router.get('/profile', customMw.isAuthentificated, function(req, res){
		res.sendFile(path.resolve('src/public/profile.html'));
    });

module.exports = router; 