var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('../helpers/logger.js');
var users_model = require('../models/user.js')

length = function(it){
    return it.length;
  };

facebookAuth = function(rq, accessToken, refreshToken, profile, done){
    process.nextTick(function(){
		logger.debug('Facebook login...');
		if (length(profile.emails) !== 0) {
			logger.pdata("Facebook: ", profile);
			users_model.findByEmail(profile.emails[0].value, 
				function (err, users){
					if (!err){
						if (length(users) == 0){
							// create new user
							var newUser = {
								facebookId: profile.id,
								name: profile.name.givenName+' '+profile.name.familyName,
								email: profile.emails[0].value
							}
							users_model.create(newUser, function(err, user){
								if (!err){
									rq.session.user = user;
									rq.session.isAuthentificated = true;
									logger.debug('User authentificated');
									return done(null, profile);
								}
								else{
									logger.error('Error create user'+ err);
									return done(null, profile);
								}
							});
						}
						else{
							// TODO: refactor
							rq.session.user = users[0];
							rq.session.isAuthentificated = true;
							logger.debug('User authentificated');
							return done(null, profile);
						}
					}
					else{
						logger.warn("Error getting user with email: " + profile.emails[0].value);
						return done(null, profile);
					}
				});
			}
		else {
			logger.warn("Error facebook login: "+ profile);
			return done(null, profile);
		}
    });
};
  
exports.facebookAuth = facebookAuth;