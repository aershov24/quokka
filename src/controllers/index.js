var express = require('express')
  , router = express.Router()
  , path = require('path')
  , customMw = require('../middlewares/middleware.js');
  
var logger = require('../helpers/logger.js');
  
router.use('/users', require('./users'))
router.use('/auth', require('./facebook'))
router.use('/lists', require('./lists'))

router.get('/', customMw.isAuthentificated, function(req, res){
		res.sendFile(path.resolve('src/public/lists.html'));
    });

module.exports = router;