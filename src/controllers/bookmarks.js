var express = require('express')
  , router = express.Router()
  , Bookmark = require('../models/bookmark')

var logger = require('../helpers/logger.js');
var customMw = require('../middlewares/middleware.js');

router.get('/', customMw.isAuthentificated, function(req, res) {
	Bookmark.findByUser(req.session.user._id, function (err, bookmarks) {
		res.send(bookmarks);
	})
});

router.post('/', customMw.isAuthentificated, function(req, res) {
	var newBookmark = {
		listId:       req.body.listId,
		userId:       req.session.user._id
	}
	
	Bookmark.create(newBookmark, function(err, bookmark){
		if (!err){
			res.send(bookmark);
		}
		else{
			logger.error('Error create bookmark: '+ err);
			res.send({ error: err });
		}
	});
});


router.delete('/:bookmarkId', customMw.isAuthentificated, function(req, res) {
	Bookmark.delete(req.params.bookmarkId, function (err, bookmark) {
		res.send(bookmark);
	})
});

module.exports = router