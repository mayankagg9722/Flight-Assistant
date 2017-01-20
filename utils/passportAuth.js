var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var path = require('path');
var User =   require('../model/user');
require('dotenv').config();

module.exports = function(passport) {
  const opts = {};

  opts.jwtFromRequest = ExtractJwt.fromHeader('auth-token');

  opts.secretOrKey = process.env.SECRET_KEY;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({username: jwt_payload.username}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (!user) {
              done(null, false);//Invalid username
          }
          else {
              console.log(user);
              done(null, user);//User Verified
          }
        });
  }));
}