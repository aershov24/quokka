var express = require('express')
  , router = express.Router()
  , cloudinary = require('cloudinary')
  , cfg = require('../config.js')
  , List = require('../models/list')
  , logger = require('../helpers/logger.js')
  , customMw = require('../middlewares/middleware.js')
  , request = require('request')
  , fs = require('fs')
  , googleImages = require('google-images');

var googleClient = googleImages(cfg.googleSE.SEID, cfg.googleSE.Key);

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
        //if (list.items.length > 5)
        //    list.items =  list.items.slice(0,5);
        res.render('preview', {list: list});
    })
});

router.post('/search/name', customMw.isAuthentificated, function(req, res) {
    logger.pdata('Search string: ', req.body.str);
    List.searchByName(req.body.str, req.body.pg, function (err, lists) {
        res.send(lists);
    });
});

router.post('/search/user', customMw.isAuthentificated, function(req, res) {
    logger.pdata('Search userId: ', req.body.userId);
    List.searchByUser(req.body.userId, req.body.pg, function (err, lists) {
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
              logger.pdata('image id', result.public_id);
                var editList = {
                    id:       req.params.listId,
                    imageId:  result.public_id,
                    image:    result.url
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

router.post('/:listId/items/:itemId/upload', customMw.isAuthentificated, upload.single('file'), function(req, res) {
    logger.pdata('load item file', req.file);
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
              logger.pdata('image id', result.public_id);
                var editListItem = {
                    _id:       req.params.itemId,
                    listId:   req.params.listId,
                    imageId:  result.public_id,
                    image:    result.url
                }
          
                List.updateItemImage(editListItem, function (err, item) {
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

router.delete('/:listId/image/:imageId', customMw.isAuthentificated, function(req, res) {
    logger.pdata('delete image', req.params.imageId);

    cloudinary.config({ 
          cloud_name: cfg.cloudinary.cloud_name, 
          api_key: cfg.cloudinary.api_key, 
          api_secret: cfg.cloudinary.api_secret
        });

    cloudinary.uploader.destroy(req.params.imageId, function(result) { 
        logger.pdata('image deleted', result);
        var editList = {
            id:       req.params.listId,
            imageId:  null,
            image:    null
        }

        List.updateImage(editList, function (err, item) {
            res.send(item);
        });
    });
});

router.delete('/:listId/items/:itemId/image/:imageId', customMw.isAuthentificated, function(req, res) {
    logger.pdata('delete image', req.params.imageId);

    cloudinary.config({ 
          cloud_name: cfg.cloudinary.cloud_name, 
          api_key: cfg.cloudinary.api_key, 
          api_secret: cfg.cloudinary.api_secret
        });

    cloudinary.uploader.destroy(req.params.imageId, function(result) { 
        logger.pdata('image deleted', result);
        var editListItem = {
            _id:       req.params.itemId,
            listId:  req.params.listId,
            imageId:  null,
            image:    null
        }

        List.updateItemImage(editListItem, function (err, item) {
            res.send(item);
        });
    });
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
                description: req.body.description,
                published: req.body.published,
                image: req.body.image,
                imageId: req.body.imageId
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
                locationName: req.body.locationName,
                image:        null,
                imageId:      null
            }
            logger.pdata('item', newListItem);

             // do google image search and save image
            googleClient.search(req.body.title, {
              page: random(1, 5)
            })
            .then(function (images) {
              var rnd = random(0,images.length-1);
              logger.pdata("random", rnd);
              logger.pdata("images len", images.length);
              logger.pdata("images", images[rnd]);

              download(images[rnd].url, './uploads/google', function(){
                logger.debug('download done');

                cloudinary.config({ 
                  cloud_name: cfg.cloudinary.cloud_name, 
                  api_key: cfg.cloudinary.api_key, 
                  api_secret: cfg.cloudinary.api_secret
                });

                cloudinary.uploader.upload('./uploads/google', function(result) {
                   if (result.url) {
                      logger.pdata('file uploaded', result.url);
                      logger.pdata('image id', result.public_id);
                      newListItem.imageId =  result.public_id;
                      newListItem.image = result.url;
                      logger.pdata('item', newListItem);

                      List.addItem(req.params.listId, newListItem, function (err, items) {
                        if (!err){
                            res.send(items);
                        }
                        else{
                            logger.error('Error create list item: '+ err);
                            res.send({ error: err });
                        }
                      });
                    } 
                    else {
                      res.send({});
                    }
               });
              });
            });
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
                locationName: req.body.locationName,
                image: req.body.image,
                imageId: req.body.imageId
            }
            
            List.updateItem(editListItem, function (err, items) {
                res.send(items);
            });
        }
        else
            res.send({error: err});
    });
});

function download(uri, filename, callback){
  logger.pdata('downloading:', uri);
  logger.pdata('destination:', filename);

  request.head(uri, function(err, res, body){
    logger.pdata('content-type:', res.headers['content-type']);
    logger.pdata('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function random(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

router.post('/', customMw.isAuthentificated, function(req, res) {
    var newList = {
        title:        req.body.title,
        description:  req.body.description,
        items:        [],
        tags:         [],
        userId:       req.session.user._id,
        published:    false,
        imageId:      null,
        image:        null
    }

    // do google image search and save image
    googleClient.search(req.body.title, {
      page: random(1, 5)
    })
    .then(function (images) {
      var rnd = random(0,images.length-1);
      logger.pdata("random", rnd);
      logger.pdata("images len", images.length);
      logger.pdata("images", images[rnd]);

      download(images[rnd].url, './uploads/google', function(){
        logger.debug('download done');

        cloudinary.config({ 
          cloud_name: cfg.cloudinary.cloud_name, 
          api_key: cfg.cloudinary.api_key, 
          api_secret: cfg.cloudinary.api_secret
        });

        cloudinary.uploader.upload('./uploads/google', function(result) {
           if (result.url) {
              logger.pdata('file uploaded', result.url);
              logger.pdata('image id', result.public_id);
              newList.imageId =  result.public_id;
              newList.image = result.url;
              logger.pdata('list', newList);
              List.create(newList, function(err, list){
                if (!err){
                    res.send(list);
                }
                else{
                    logger.error('Error create list: '+ err);
                    res.send({ error: err });
                }
              });
            } 
            else {
              res.send({});
            }
       });
      });
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