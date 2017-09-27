var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: Number,
  username: String,
  displayName: String,
  email: String,
  teamName: String,
  currentScore : {
    type: Object,
    opponent: String,
    wins: Number,
    losses: Number,
    ties: Number
  }
});

var UserModel = mongoose.model('User', userSchema);
module.export = UserModel
