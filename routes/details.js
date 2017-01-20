var express = require('express');
var router = express.Router();
require("dotenv").config();
var jwt=require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../model/user');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
	console.log(req.user);
	res.json({
        status: "working details page"
    });
});

router.get('/flight',function(req,res,next){

    // var flight_code="6E";
    // var flight_number="302";
    // var date="2017/1/21";

    var flight_code=req.body.flight_code;
    var flight_number=req.body.flight_number;
    var date=req.body.date;


    var url="https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/"+flight_code+"/"+flight_number+"/"+"dep/"+date+"?appId="+process.env.appId+"&appKey="+process.env.appKey+"&utc=false";
    unirest.get(url)
    .end(function(data){
        res.json({
        status: data.statusCode,
        airline_name:data.body.appendix.airlines,
        flightStatuses:data.body.flightStatuses
    });
    });

});

router.get('/weather',function(req,res,next){
    // var airport="MAA";
    var airport=req.body.airport;
    var url="https://api.flightstats.com/flex/weather/rest/v1/json/all/"+airport+"?appId="+process.env.appId+"&appKey="+process.env.appKey+"&utc=false";
    unirest.get(url)
    .end(function(data){
        res.json({
        status: data.statusCode,
        weather:data.body.metar
    });
    });
});

router.get('/nearby',function(req,res,next){

    var lat=req.body.lat;
    var lng=req.body.lng;
    var querry=req.body.querry;
    // var lat="13.0827";
    // var lng="80.2707";
    // var querry=
// amusement_park
// aquarium
// art_gallery
// atm
// bakery
// bank
// bar
// cafe
// casino
// hospital
// liquor_store
// lodging
// movie_theater
// museum
// night_club
// plumber
// police
// restaurant
// shopping_mall
// stadium
// taxi_stand
// train_station
// zoo

    
    var url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=+"+lat+","+lng+"&radius=500&type=+"+querry+"&key="+process.env.place_api;
    unirest.get(url)
    .end(function(data){
        res.json({
        status: data.body.results
        // weather:data
    });
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

module.exports = router;