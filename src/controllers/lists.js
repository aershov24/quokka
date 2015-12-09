var express = require('express')
  , router = express.Router()
  , List = require('../models/list')

var logger = require('../helpers/logger.js');
var customMw = require('../middlewares/middleware.js');
  
router.get('/', customMw.isAuthentificated, function(req, res) {
	List.findByUser(req.session.user._id, function (err, lists) {
		res.send(lists);
	})
});

router.get('/random', function(req, res) {
	logger.debug('random');
	List.random(function (err, lists) {
		res.send(lists);
	})
});

router.get('/preview/:listId', function(req, res) {
	List.getById(req.params.listId, function (err, list) {
		if (list.items.length > 5)
			list.items =  list.items.slice(0,5);
		res.render('preview', {list: list});
	})
});

router.post('/search/name', customMw.isAuthentificated, function(req, res) {
	logger.pdata('Search string: ', req.body.str);
	List.searchByName(req.body.str, function (err, lists) {
		res.send(lists);
	})
});

router.post('/:listId/sortItems', customMw.isAuthentificated, function(req, res) {
	List.sortItems(req.params.listId, req.body.oldIndex, req.body.newIndex, function (err, list) {
		res.send(list);
	})
});

router.post('/search/tags', customMw.isAuthentificated, function(req, res) {
	List.searchByTags(req.body.tags, function (err, lists) {
		res.send(lists);
	})
});

router.get('/:listId/items', customMw.isAuthentificated, function(req, res) {
	List.items(req.params.listId, function (err, items) {
		res.send(items);
	})
});

router.post('/:listId', customMw.isAuthentificated, function(req, res) {
	var editList = {
		id: 	req.params.listId,
		title:  req.body.title,
		description: req.body.description
	}
	
	List.update(editList, function (err, items) {
		res.send(items);
	})
});

router.post('/:listId/items', customMw.isAuthentificated, function(req, res) {
	var newListItem = {
		title:        req.body.title,
		description:  req.body.description,
		listId:       req.body.listId,
		orderId:      req.body.orderId,
		location:     req.body.location,
		locationName: req.body.locationName
	}
	logger.pdata('item', newListItem);
	List.addItem(req.params.listId, newListItem, function (err, items) {
		res.send(items);
	})
});


router.get('/:listId/tags', customMw.isAuthentificated, function(req, res) {
	List.tags(req.params.listId, function (err, tags) {
		res.send(tags); 
	})
});

router.post('/:listId/tags', customMw.isAuthentificated, function(req, res) {
	List.updateTags(req.params.listId, req.body.tags, function (err, tags) {
		res.send(tags);
	})
});

router.get('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
	List.getItemById(req.params.listId, req.params.itemId, function (err, item) {
		res.send(item);
	})
});

router.post('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
	logger.pdata('Body: ', req.body);
	var editListItem = {
		_id: 	req.params.itemId,
		listId: req.body.listId,
		title:  req.body.title,
		description: req.body.description,
		url: req.body.url,
		location: req.body.location,
		locationName: req.body.locationName
	}
	
	List.updateItem(editListItem, function (err, items) {
		res.send(items);
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
			res.send(list);
		}
		else{
			logger.error('Error create list: '+ err);
			res.send({ error: err });
		}
	});
});
  
router.get('/:listId', customMw.isAuthentificated, function(req, res) {
	List.getById(req.params.listId, function (err, list) {
		res.send(list);
	})
});


router.delete('/:listId', customMw.isAuthentificated, function(req, res) {
	List.delete(req.params.listId, function (err, list) {
		res.send(list);
	})
});


router.delete('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
	List.deleteItem(req.params.listId, req.params.itemId, function (err, items) {
		res.send(items);
	})
});

module.exports = router;