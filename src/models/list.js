var mongoose    = require('mongoose');

var listItemSchema = mongoose.Schema({
  title:        String,
  description:  String
});

var listSchema = mongoose.Schema({
  title:        String,
  description:  String,
  items:    	[listItemSchema],
  tags:         [String],
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
	List.findOne({ _id : listId }, 
		function (err, list){
			if (!err){
				if (list){
					list.items.push(item);
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
}

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
	);
};

exports.searchByName = function(str, cb){
	var re = new RegExp(str, 'i');
	List.find({ $or:[ {'title': { $regex: re }}, {'description': { $regex: re }} ]}, function(err, lists) {
		if(!err) 
			cb(null, lists); 
	});
};

exports.searchByTags = function(tags, cb){
	List.find({ tags: { "$all" : tags} }, function(err, lists) {
		if(!err) 
			cb(null, lists); 
	});
};

exports.getById = function(listId, cb){
	List.findOne({ _id : listId }, 
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