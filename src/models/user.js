var mongoose = require("mongoose");
var version = require('mongoose-version2');

var userSchema = new mongoose.Schema({
  facebookId : String,
  name: String,
  email: { type: String, unique:true},
  createdOn: { type: Date, default: Date.now },
  lastLogin: Date
});

userSchema.plugin(version, {});

// Build the User model
var User = mongoose.model( 'User', userSchema );

exports.create = function(user, cb) {
  var newUser = new User({
    facebookId: user.facebookId,
    name: user.name,
    email: user.email,
    lastLogin : Date.now()
  });
  
  newUser.save(function(err, user){
    if(!err){
      cb(null, user);
    }
    else
      cb(err, null);
  });
};

exports.findByEmail = function(email, cb){
  User.find({ email : email }, 
    function (err, users){
      if (!err){ cb(null, users); }
      else
        cb(err, []);
    }
  );
};

exports.getById = function(userId, cb){
  User.find({ _id : userId }, 
    function (err, users){
      if (!err){ cb(null, users); }
      else
        cb(err, []);
    }
  );
};