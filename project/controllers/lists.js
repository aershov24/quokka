var express = require('express')
  , router = express.Router()
  , List = require('../models/list')

var logger = require('../helpers/logger.js');
var customMw = require('../middlewares/middleware.js');
  
router.get('/', customMw.isAuthentificated, function(req, res) {
	List.findByUser(req.session.user._id, function (err, lists) {
		res.send({lists: lists})
	})
});
  
router.post('/', customMw.isAuthentificated, function(req, res) {
	var newList = {
		title:        req.body.title,
		description:  req.body.description,
		items:        [],
		tags:         [],
		userId:       req.session.user._id
	}
	
	List.create(newList, function(err, list){
		if (!err){
			res.send({ list: list });
		}
		else{
			logger.error('Error create list: '+ err);
			res.send({ error: err });
		}
	});
});
  
router.get('/:id', customMw.isAuthentificated, function(req, res) {
	List.findById(req.params.id, function (err, list) {
		res.send( { list: list} )
	})
});

module.exports = router;