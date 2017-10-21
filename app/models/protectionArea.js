// get an instance of dbSchema
const mongoose = require('mongoose');

// set up a db model and pass it using module.exports
module.exports = mongoose.model('ProtectionArea', new mongoose.Schema({
  name: String,
  lat: Number,
  long: Number,
  radius: Number,
}));
