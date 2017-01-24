var express = require('express');
var router = express.Router();
require("dotenv").config();
var Details = require('../model/flight');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
    console.log(req.user);
    res.json({
        status: "working details page"
    });
});

router.post('/flight', function (req, res, next) {

    // var flight_code = "6E";
    // var flight_number = "302";
    // var date = "2017/1/21";

    var flight_code = req.body.flight_code;
    var flight_number = req.body.flight_number;
    var date = req.body.date;

    var url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/" + flight_code + "/" + flight_number + "/" + "dep/" + date + "?appId=" + process.env.appId + "&appKey=" + process.env.appKey + "&utc=false";
    unirest.get(url)
        .end(function (data) {
            res.json({
                status: true,
                body:data.body
            //     airline_name: data.body.appendix.airlines,
            //     flightStatuses: data.body.flightStatuses
            });
        });

});

router.post('/weather', function (req, res, next) {
    // var airport = "DEL";
    var airport = req.body.airport;
    var url = "https://api.flightstats.com/flex/weather/rest/v1/json/all/" + airport + "?appId=" + process.env.appId + "&appKey=" + process.env.appKey + "&utc=false";
    unirest.get(url)
        .end(function (data) {
            if (!req.user) {
                res.status = 401;
                res.json({
                    status: false,
                    redirect: 'login',
                    message: "Authentication Failed"
                })
            }
            else {
                res.status = 200;
                res.json({
                    status: data.statusCode,
                    weather: data.body.metar
                });
            }
        });
});

router.post('/nearby', function (req, res, next) {
    // var lat="13.0827";
    // var lng="80.2707";
    var lat = req.body.lat;
    var lng = req.body.lng;
    var querry = req.body.querry;
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

    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=+" + lat + "," + lng + "&radius=500&type=+" + querry + "&key=" + process.env.place_api;
    unirest.get(url)
        .end(function (data) {
            res.json({
                status: true,
                data:data.body.results
            });
        });
});

router.post('/addflight', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res.json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        })
    } else {
        var flight = new Details({
            username: req.user.username,
            flight: req.body
        });
        console.log(flight);
        flight.save(function (err) {
            if (err) {
                res.status = 401;
                res.json({
                    success: false,
                    message: "Unable to save data"
                });
            }
            else {
                res.status = 200;
                res.json({
                    success: true,
                    message: "Added Successfully"
                });
            }
        });
    }
});

router.get('/flighthistory', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res.json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        })
    } else {
         Details.findOne({ username: req.user.username }, function (err, data) {
            if (err) {
                res.status = 401;
                res.json({
                    status: false,
                    message: "Error"
                });
            } else {
                if (data == null) {
                    res.status = 200;
                    res.json({
                        status: false,
                        message: "Not added any flight."
                    });
                } else {
                    res.status = 200;
                    res.json({
                        status: true,
                        data: data
                    });
                }
            }
        });
    }
});

module.exports = router;