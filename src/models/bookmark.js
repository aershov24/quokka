var mongoose    = require('mongoose')
  , List = require('./list')
  , User = require('./user')

var bookmarkSchema = mongoose.Schema({
  listId:   { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var Bookmark = mongoose.model('Bookmark', bookmarkSchema);

exports.create = function(bookmark, cb) {
	var newBookmark = new Bookmark({
		listId : bookmark.listId,
		userId : bookmark.userId
	});
	
	newBookmark.save(function(err, bookmark){
		if(!err){
			cb(null, bookmark);
		}
		else
			cb(err, null);
	});
};

exports.delete = function(bookmarkId, cb) {
	Bookmark.findOne({ _id : bookmarkId }, 
		function (err, bookmark){
			if (!err){
				if (bookmark){
					bookmark.remove(function(err, bookmark){
						if(!err){
							cb(null, { id: bookmarkId } );
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

exports.findByUser = function(userId, cb){
	Bookmark.find({ userId : userId }).populate('listId').populate('userId').exec( 
		function (err, bookmarks){
			if (!err){ cb(null, bookmarks); }
			else
				cb(err, []);
		}
	);
};

