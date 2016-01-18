var mongoose    = require('mongoose');
var logger = require('../helpers/logger.js');
var random = require('mongoose-simple-random');
var math = require('mathjs');

var listItemSchema = mongoose.Schema({
  title:        String,
  url:          String, 
  description:  String,
  image:        String,
  imageId:      String,
  listId:       { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  location:     { type: [Number], index: '2dsphere'},
  locationName: String,
  orderId:      Number
});

var listSchema = mongoose.Schema({
  title:        String,
  description:  String,
  items:        [listItemSchema],
  tags:         [String],
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created:      { type: Date },
  updated:      { type: Date },
  image:        String,
  imageId:      String
});

listSchema.plugin(random);

listSchema.pre('save', function(next){
  now = new Date();
  this.updated = now;
  if ( !this.created ) {
    this.created = now;
  }
  next();
});

var List = mongoose.model('List', listSchema);

exports.create = function(list, cb) {
  var newList = new List({
    title: list.title,
    description: list.description,
    items: list.items,
    tags : list.tags,
    userId : list.userId
  });
  
  newList.save(function(err, list){
    if(!err){
      cb(null, list);
    }
    else
      cb(err, null);
  });
};

exports.update = function(editList, cb) {
  List.findOne({ _id : editList.id } , function (err, list) {
    if(err){
      cb(err, null);
    } else {
      list.title = editList.title;
      list.description = editList.description;
      list.save(function (err, list) {
        if(!err){
          cb(null, list)
        }
        else
          cb(err, null);
        });
      }
    } 
  );
};

exports.updateImage = function(editList, cb) {
  List.findOne({ _id : editList.id } , function (err, list) {
    if(err){
      cb(err, null);
    } else {
      list.imageId = editList.imageId;
      list.image = editList.image;
      list.save(function (err, list) {
        if(!err){
          cb(null, list)
        }
        else
          cb(err, null);
        });
      }
    } 
  );
};

exports.delete = function(listId, cb) {
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list){
          list.remove(function(err, list){
            if(!err){
              cb(null, { id: listId } );
            }
            else
              cb(err, null);
          });
        }
        else
          cb(null, null);
      }
      else
        cb(err, null);
    }
  );
};

exports.deleteItem = function(listId, itemId, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list){
          list.items.id(itemId).remove();
          list.save(function(err, list){
            if(!err){
              cb(null, list.items);
            }
            else
              cb(err, null);
          });
        }
        else
          cb(null, null);
      }
      else
        cb(err, []);
    }
  );
};

exports.addItem = function(listId, item, cb){
  logger.debug(item);
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list){
          list.items.push(item);
          list.save(function(err, list){
            if(!err){
              logger.pdata(list);
              cb(null, list.items);
            }
            else
            {
              logger.error(err);
              cb(err, null);
            }
          });
        }
        else
          cb(null, null);
      }
      else
      {
        logger.error(err);
        cb(err, []);
      }
    }
  );
}

exports.updateItem = function(editListItem, cb) {
  logger.pdata("update listItem: ", editListItem);
  List.findOne({ _id : editListItem.listId } , function (err, list) {
    if(err){
      cb(err, null);
    } 
    else 
    {
      if (list){
        var item = list.items.id(editListItem._id);
        if (item)
        {
          item.title = editListItem.title;
          item.description = editListItem.description;
          item.url = editListItem.url;
          item.location = editListItem.location;
          item.locationName = editListItem.locationName;
          item.imageId = editListItem.imageId;
          item.image = editListItem.image;
          logger.pdata("new listItem: ", item.description);
          list.save(function(err, list){
            if(!err){
              cb(null, list.items);
            }
            else
              cb(err, null);
            });
        }
        else
          cb(null, null);
      }
      else
        cb(null, null);
    }
  });
}

exports.updateItemImage = function(editListItem, cb) {
  List.findOne({ _id : editListItem.listId } , function (err, list) {
    if(err){
      cb(err, null);
    } 
    else 
    {
      if (list){
        var item = list.items.id(editListItem._id);
        if (item)
        {
          item.imageId = editListItem.imageId;
          item.image = editListItem.image;
          logger.pdata('editListItem: ', editListItem);
          list.save(function(err, list){
            if(!err){
              cb(null, item);
            }
            else
              cb(err, null);
            });
        }
        else
          cb(null, null);
      }
      else
        cb(null, null);
    }
  });
};

exports.updateTags = function(listId, tags, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list){
          list.tags = tags;
          list.save(function(err, list){
            if(!err){
              cb(null, list.tags);
            }
            else
              cb(err, null);
          });
        }
        else
          cb(null, null);
      }
      else
        cb(err, []);
    }
  );
}

exports.items = function(listId, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list)
          cb(null, list.items);
        else
          cb(null, null);
      }
      else
        cb(err, []);
    }
  );
};

exports.sortItems = function(listId, oldIndex, newIndex, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list)
        {
          var i,j,k,z;
          // sort items by id
          list.items.sort(function (a, b) {
            if (a.orderId > b.orderId) {
              return 1;
            }
            if (a.orderId < b.orderId) {
              return -1;
            }
            return 0;
          });

          var min = math.min(oldIndex, newIndex);
          var max = math.max(oldIndex, newIndex);

          if (newIndex < oldIndex)
          {
            for (i = min; i < max; i++)
              list.items[i].orderId = list.items[i].orderId+1;

            list.items[max].orderId = min;

            list.items.sort(function (a, b) {
              if (a.orderId > b.orderId) {
                return 1;
              }
              if (a.orderId < b.orderId) {
                return -1;
              }
              return 0;
            });
          }
          else
          {
            for (i = min+1; i <= max; i++)
              list.items[i].orderId = list.items[i].orderId-1;

            list.items[min].orderId = max;

            list.items.sort(function (a, b) {
              if (a.orderId > b.orderId) {
                return 1;
              }
              if (a.orderId < b.orderId) {
                return -1;
              }
              return 0;
            });
          }

          list.save(function(err, list){
            if(!err){
              cb(null, list);
            }
            else
              cb(err, null);
          });
        }
        else
          cb(null, null);
      }
      else
        cb(err, null);
    }
  );
};

exports.tags = function(listId, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){
        if (list)
          cb(null, list.tags);
        else
          cb(null, null);
      }
      else
        cb(err, []);
    }
  );
};

exports.findByUser = function(userId, cb){
  List.find({ userId : userId }, 
    function (err, lists){
      if (!err){ cb(null, lists); }
      else
        cb(err, []);
    }
  ).sort('-updated');
};

exports.searchByName = function(str, cb){
  var re = new RegExp(str, 'i');
  List.find({ $or:[ {'title': { $regex: re }}, {'description': { $regex: re }} ]})
    .populate('userId')
    .exec(function(err, lists) {
    if(!err) 
      cb(null, lists); 
  });
};

exports.random = function(cb){
  List.findRandom({}, {}, {limit: 3, populate:'userId'}, function(err, results) {
      cb(err, results)
  });
};

exports.searchByTags = function(tags, cb){
  logger.pdata('search tags', tags);
  List.find({ tags: { "$all" : tags} })
    .populate('userId') 
    .exec(function(err, lists) {
    if(!err) 
      cb(null, lists); 
  });
};

exports.getById = function(listId, cb){
  List.findOne({ _id : listId }).populate('userId').exec( 
    function (err, list){
      if (!err){
        if (list)     
          cb(null, list); 
        else
          cb(null, null); 
      }
      else
        cb(err, null);
    }
  );
};

exports.checkUserPermission = function(listId, userId, cb){
  List.findOne({ _id : listId }).populate('userId').exec(
    function (err, list){
      if (!err){
        if (list.userId.facebookId === userId)
          cb(null);
        else
          cb('Permission error'); 
      }
      else
        cb('Error');
    }
  );
};

exports.getItemById = function(listId, itemId, cb){
  List.findOne({ _id : listId }, 
    function (err, list){
      if (!err){ 
        if (list)
          cb(null, list.items.id(itemId)); 
        else
          cb(null, null);
      }
      else
        cb(err, []);
    }
  );
};