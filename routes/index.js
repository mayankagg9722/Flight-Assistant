var express = require('express');
var router = express.Router();
require("dotenv").config();
var passport=require("passport");
var GoogleStartegy=require("passport-google-oauth").OAuth2Strategy;
var User=require('../model/schema');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var options={
	clientID: process.env.Key,
    clientSecret: process.env.Secret,
    callbackURL: "http://localhost:3000/auth/google/callback"
}; 

passport.use(new GoogleStartegy(options,function(accessToken, refreshToken, profile, done){
	User.findOne({"fbid":profile.id},function(err,user){
		if(user) return done(null,user);
		else{
			var newUser= new User();
			newUser.fbid=profile.id;
			newUser.email=profile.emails[0].value;
			newUser.username=profile.displayName;
			newUser.photo=profile.photos[0].value;
			console.log(profile);
			newUser.save();
			return done(null,newUser);
		}
	});
}));

/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index');
});

router.get('/logout',function(req,res){
	res.redirect('/');
	req.logout();
});

router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' ,successRedirect:'/profile' }),function(req,res){
  	req.app.locals.userdata=req.user;
  });


module.exports = router;