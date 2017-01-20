var express = require('express');
var router = express.Router();
require("dotenv").config();
var jwt=require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../model/user');
var passport = require("passport");
// var GoogleStartegy=require("passport-google-oauth").OAuth2Strategy;


router.get('/', function (req, res, next) {
	console.log(req.user);
	res.json({
        status: "working"
    });
});

router.post('/login',function(req, res, next){
User.findOne({username:req.body.username},function(err,user){
	if(err){
		err.status=401;
		next(err);
	}
	if(!user){
		 res.status(401).json({ success: false, message: 'User not registered' });
	}else{
		if(user.comparePassword(req.body.password)){
			var token=jwt.sign({
				username:user.username,
				name:user.name,
				email:user.email
			},process.env.secret_key,{
        expiresIn: 31536000
        });
				res.status(200).json({
					success:true,
					token:token,
					message:"Authentication Success"
				});
		}else{
			res.status(401).json({
					success:false,
					message:"Authentication Failed"
				});
		}
	}
});
});

router.post('/register', function (req, res, next) {
	var newUsr = new User({
		username: req.body.username,
		password: req.body.password,
		name: req.body.name,
		mobile_number: req.body.mobile_number,
		email: req.body.email
	});

	newUsr.save(function(err){
		if(err){
			res.status=401;
			res.json({
				success:false,
				message:"Unable to save data"
			});
		}
		else{
			res.status=200;
			res.json({
				success:true,
				message:"Registered Successfully"
			});
		}
	});
});


// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// var options={
// 	clientID: process.env.Key,
//     clientSecret: process.env.Secret,
//     callbackURL: "http://localhost:3000/auth/google/callback"
// }; 

// passport.use(new GoogleStartegy(options,function(accessToken, refreshToken, profile, done){
// 	User.findOne({"fbid":profile.id},function(err,user){
// 		if(user) return done(null,user);
// 		else{
// 			var newUser = new User({
// 			fbid:profile.id,
// 			email:profile.emails[0].value,
// 			username:profile.displayName,
// 			photo:profile.photos[0].value
// 			});
// 			console.log(profile);
// 			newUser.save(); //err handling should be impemented here
// 			return done(null,newUser);
// 		}
// 	});
// }));


/* GET home page. */


// router.get('/logout', function (req, res) {
// 	res.redirect('/');
// 	req.logout();
// });

// router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' ,successRedirect:'/profile' }),function(req,res){
//   	req.app.locals.userdata=req.user;
//   });


module.exports = router;