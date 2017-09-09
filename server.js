var dotenv = require('dotenv');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var app = express();
var bot = require('./bot');

bot();

dotenv.load();
// var HerokuDB = require('./keys/mlab');
// console.log(HerokuDB);
//console.log(process.env);
app.set('port', process.env.PORT);
app.use(express.static(__dirname + '/public'));

app.use(session({secret: 'ssshhhhh'}));
// view engine setup - If using a templating language
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//mongoose
mongoose.connect(process.env.MONGODB_URI);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.log('dev');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res) {
  console.log('session: ',req.session);
  console.log('req.user: ',req.session.user);
  res.render('pages/index', { user: req.session.user });
});

/**** Twitch auth *****/
//Twitch Login Auth
var passport       = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;

app.use(passport.initialize());
passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: "http://127.0.0.1:5000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken',accessToken);
    console.log(profile.username);
    //req.user = profile.username;
    return done(null, profile);

  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  //console.log(user.username);
   done(null, user.username);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserializeUser');
   done(null, obj);
});

app.get("/auth/twitch", passport.authenticate("twitch", {session: true}));
app.get("/auth/twitch/callback", passport.authenticate("twitch", {
   failureRedirect: "/"
 }), function(req, res) {
    // Successful authentication, redirect home.
    console.log('Succesfully Authenticated', req.user);
    req.session.user = req.user.username;
    res.redirect("/");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running a local server at http://localhost:', app.get('port'));
});
