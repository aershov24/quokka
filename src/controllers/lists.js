var express = require('express')
  , router = express.Router()
  , cloudinary = require('cloudinary')
  , cfg = require('../config.js')
  , List = require('../models/list')
  , logger = require('../helpers/logger.js')
  , customMw = require('../middlewares/middleware.js')

var multer = require('multer');

var upload = multer({ dest: './uploads/' })
  
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
    });
});

router.post('/:listId/sortItems', customMw.isAuthentificated, function(req, res) {
    List.sortItems(req.params.listId, req.body.oldIndex, req.body.newIndex, function (err, list) {
        res.send(list);
    });
});

router.post('/:listId/upload', customMw.isAuthentificated, upload.single('file'), function(req, res) {
    logger.pdata('load file', req.file);
    console.dir(req.file);
     if(req.file) {
        cloudinary.config({ 
          cloud_name: cfg.cloudinary.cloud_name, 
          api_key: cfg.cloudinary.api_key, 
          api_secret: cfg.cloudinary.api_secret
        });

        cloudinary.uploader.upload(req.file.path, function(result) {
           if (result.url) {
              logger.pdata('file uploaded', result.url);
                var editList = {
                    id:     req.params.listId,
                    image:  result.url,
                }
          
                List.updateImage(editList, function (err, item) {
                    res.send(item);
                });
            } 
            else {
              res.send({});
            }
       });
    } else {
       res.send({});
    }
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
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err)
    {
        if (!err){
            var editList = {
                id:     req.params.listId,
                title:  req.body.title,
                description: req.body.description
            }
            
            List.update(editList, function (err, items) {
                res.send(items);
            });
        }
        else
            res.send({error: err});
    });
});

router.post('/:listId/items', customMw.isAuthentificated, function(req, res) {
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err)
    {
        if (!err){
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
        }
        else
            res.send({error: err});
    });
});


router.get('/:listId/tags', customMw.isAuthentificated, function(req, res) {
    List.tags(req.params.listId, function (err, tags) {
        res.send(tags); 
    })
});

router.post('/:listId/tags', customMw.isAuthentificated, function(req, res) {
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err){
        if (!err){
            List.updateTags(req.params.listId, req.body.tags, function (err, tags) {
                res.send(tags);
            });
        }
        else
            res.send({error: err});
    });
});

router.get('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
    List.getItemById(req.params.listId, req.params.itemId, function (err, item) {
        res.send(item);
    })
});

router.post('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err){
        if (!err){
            var editListItem = {
                _id:    req.params.itemId,
                listId: req.body.listId,
                title:  req.body.title,
                description: req.body.description,
                url: req.body.url,
                location: req.body.location,
                locationName: req.body.locationName
            }
            
            List.updateItem(editListItem, function (err, items) {
                res.send(items);
            });
        }
        else
            res.send({error: err});
    });
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
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err){
        if (!err){
            List.delete(req.params.listId, function (err, list) {
                res.send(list);
            });
        }
        else
            res.send({error: err});
    });
});


router.delete('/:listId/items/:itemId', customMw.isAuthentificated, function(req, res) {
    List.checkUserPermission(req.params.listId, req.session.user.facebookId, function(err){
        if (!err){
            List.deleteItem(req.params.listId, req.params.itemId, function (err, items) {
                res.send(items);
            });
        }
        else
            res.send({error: err});
    });
});

module.exports = router;