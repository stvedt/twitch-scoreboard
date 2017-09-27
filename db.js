var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

//mongoose
mongoose.connect(process.env.MONGODB_URI);
module.exports.db = mongoose.connection;
