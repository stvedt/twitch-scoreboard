var User = require('./models/UserModel');
var sessionUser = new User;

function logInUser(user){
  User.findOne({ username: user.username }, function (err, doc){
    console.log('found user',doc);

    if (doc === null ){
      //create new user
      var currentUser = new User (
        user
      );
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
var Service = { logInUser };
module.exports = Service;
