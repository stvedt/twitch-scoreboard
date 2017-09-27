var User = require('./models/UserModel');
var sessionUser = new User;

function logInUser(user){
  User.findOne({ username: user.username }, function (err, doc){
    if (doc === null ){
      //create new user
      user.currentScore = { wins: 0, losses: 0};
      var currentUser = new User ( user );
      currentUser.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('successfully saved to mongo');
        }
      });
    } else {
      doc = Object.assign(doc, user);
      doc.markModified(doc);
      doc.save();
    }
  });
}

function getUser(user){
  console.log('getUser()');
  User.findOne({ username: user.username }, function (err, doc){
      return doc;
    }
  );
}

function updateScoreWin(channel){
  User.findOne({ username: channel }, function (err, doc){
    console.log('update score win');
    //create new user
    doc.currentScore.wins++;
    doc.markModified('currentScore.wins');
    doc.save();
  });
}

function updateScoreLoss(channel){
  User.findOne({ username: channel }, function (err, doc){
    console.log('update score loss');
    //create new user
    doc.currentScore.losses++;
    doc.markModified('currentScore.losses');
    doc.save();
  });
}

var Service = { logInUser, getUser, updateScoreWin, updateScoreLoss };
module.exports = Service;
