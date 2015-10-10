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
	
	newList.save(function(err, user){
		if(!err){
			cb(null, user);
		}
		else
			cb(err, null);
	});
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

exports.findById = function(id, cb){
	List.find({ _id : id }, 
		function (err, lists){
			if (!err){ cb(null, lists); }
			else
				cb(err, []);
		}
	);
};