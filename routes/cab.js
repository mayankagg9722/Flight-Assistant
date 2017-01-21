var express = require('express');
var router = express.Router();
require("dotenv").config();
var getCab = require('../model/getcab');
var postCab = require('../model/postcab');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
    console.log(req.user);
    res.json({
        status: "working cab page"
    });
});

router.post('/getcab', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res, json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        });
    }
    else {
        var getcab = new getCab({
            username: req.user.username,
            date: req.body.date,
            time: req.body.time,
            current_location: req.body.current_location,
            destination: req.body.destination,
            car: req.body.car,
            number_of_person: req.body.number_of_person
        });
        getcab.save(function (err) {
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
                    message: "Car Request Successfully"
                });
            }
        });
    }
});

router.post('/postcab', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res, json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        });
    }
    else {
        var postcab = new postCab({
            username: req.user.username,
            date: req.body.date,
            time: req.body.time,
            current_location: req.body.current_location,
            destination: req.body.destination,
            car: req.body.car,
            car_seats: req.body.car_seats
        });
        postcab.save(function (err) {
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
                    message: "Car Posted Successfully"
                });
            }
        });
    }
});

router.get('/cabposted', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res.json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        });
    }
    else {
        postCab.find({ username: req.user.username }, function (err, data) {
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
                        status: true,
                        message: "Not posted any cab."
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

router.get('/cabrequested', function (req, res, next) {
    if (!req.user) {
        res.status = 401;
        res.json({
            status: false,
            redirect: 'login',
            message: "Authentication Failed"
        });
    }
    else {
        getCab.findOne({ username: req.user.username }, function (err, data) {
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
                        status: true,
                        message: "Not posted any cab."
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