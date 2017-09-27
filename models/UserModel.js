var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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

var User = mongoose.model('User', userSchema);
module.exports = User;
