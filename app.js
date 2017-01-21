var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
var app = express();



var index = require('./routes/index');
var details=require('./routes/details');
var cab=require('./routes/cab');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/flight');

// var GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
// var session=require('express-session');

// app.use(session({
// 	secret:'dontknow',
// 	saveUninitialized:true,
// 	resave:true
// }));

// app.use(passport.session());
// app.get('/profile',function(req,res){
//   res.render('userdata',{userdata:req.user});
// });
// require("./utils/passportAuth")(passport);

app.use(passport.initialize());


require(require('path').join(__dirname, './utils/passportAuth'))(passport);

app.all('*', function(req, res, next){
  passport.authenticate('jwt', {session: false}, function(err, user){
      if(!err){
        // console.log("user",user);
        req.user = user;
        return next();
      } else{
        return next(err);
      }
    })(req, res, next);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/details',details);
app.use('/cab',cab);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
