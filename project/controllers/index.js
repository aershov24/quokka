var express = require('express')
  , router = express.Router()

router.use('/users', require('./users'))
router.use('/auth', require('./facebook'))
router.use('/lists', require('./lists'))

router.get('*', function(req, res) {
        res.sendfile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
router.get('/test', function(req, res) {
        res.sendfile('../public/test.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

module.exports = router;