var dotenv = require('dotenv');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var app = express();
var bot = require('./bot');

bot();

dotenv.load();
// var HerokuDB = require('./keys/mlab');
// console.log(HerokuDB);
console.log(process.env);
app.set('port', process.env.PORT);
app.use(express.static(__dirname + '/public'));
// view engine setup - If using a templating language
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//mongoose
// mongoose.connect('mongodb://localhost/decision-task');
//remote
mongoose.connect(process.env.MONGODB_URI);

var exampleSchema = mongoose.Schema({
  results: {
    type: Object,
      total_amount: Number,
      session_completed: Boolean,
      choice_problem_1: {
        samples : [
          {
            option: String,
            value: Number
          }
        ],
        completed: Boolean,
        final_decision: {
          type: Object,
            option: String,
            value: Number
        }
      }
  }
});

exampleSchema.plugin(timestamps);
var Session = mongoose.model('Session', exampleSchema);
var baseSession = {
  results: {
      choice_problem_1: {
        completed: false,
        samples : [],
        final_decision: {
          option: null,
          value: null
        }
      },
      session_completed: false,
      total_amount: 9
  }
};
// error handlers

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
  res.render('pages/index');
});

app.get('/get-total/', function(req, res){
  console.log('get-total');
  Session.findOne({ _id: req.query.id }, function (err, doc){
    console.log(doc)
    res.json(doc.results.total_amount);
  });
});

app.use('/create-session/', function(req, res){

  console.log('create new session');

  var newSession = new Session(baseSession);

  newSession.save(function (err, savedSession) {
    console.log('save started');
    if (err) {
      console.log(err);
    } else {

      console.log('Session created successfully with id: ', newSession._id);
      res.json(savedSession)
    }
  });

  // res.json({id: newSession._id });
});

app.put('/send-option/', function(req, res){
  // console.log("req: ", req);
  req.params.problemNumber;

  Session.findOne({ _id: req.query.id }, function (err, doc){

    doc.results[req.query.problem].samples.push({
        option: req.query.option,
        value: req.query.value
      });

      doc.markModified('results.'+req.query.problem +'.samples');
      doc.save(function (err, updatedSample) {
        if (err) return handleError(err);
        res.send(updatedSample);
      });
  });
});

app.put('/send-final-decision/', function(req, res){
  // console.log("req: ", req);
  req.params.problemNumber;

  Session.findOne({ _id: req.query.id }, function (err, doc){

    if ( doc.results[req.query.problem].completed ) {
      console.log('already marked as completed');
      // res.status(401);
      res.send({"status": 401, "message": "already submitted"});
    } else {
      doc.results[req.query.problem].final_decision = {
        option: req.query.option,
        value: req.query.value
      };
      doc.results[req.query.problem].completed = true;
      console.log('query value', req.query.value);
      doc.results.total_amount += Number(req.query.value);
      console.log('new total amount',doc.results.total_amount );
      doc.markModified('results.'+req.query.problem);
      doc.markModified('results.total_amount');
      doc.save(function (err, updatedSample) {
        if (err) return handleError(err);
        res.send(updatedSample);
      });
    }
  });
});

app.put('/mark-completed/', function(req, res){
  // console.log("req: ", req);
  req.params.problemNumber;

  Session.findOne({ _id: req.query.id }, function (err, doc){

    if ( doc.results.session_completed ) {
      console.log('Session already marked as completed');
      // res.status(401);
      res.send({"status": 401, "message": "Session already completed"});
    } else {
      doc.results.session_completed = true;
      console.log('mark session as completed');

      doc.markModified('results.session_completed');
      doc.save(function (err, updatedSample) {
        if (err) return handleError(err);
        res.send(updatedSample);
      });
    }
  });
});

/**** Twitch auth *****/
//Twitch Login Auth
var passport       = require("passport");
var twitchStrategy = require("passport-twitch").Strategy;

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: "http://127.0.0.1:5000/auth/twitch/callback",
    redirect_uri:"http://127.0.0.1:5000/",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    /*User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
    return;
  }
));

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    console.log('have auth');
    res.redirect("/");
});





app.listen(app.get('port'), function() {
  console.log('Node app is running a local server at http://localhost:', app.get('port'));
});
