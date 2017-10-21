// get an instance of dbSchema
const mongoose = require('mongoose');
// set up a db model and pass it using module.exports
module.exports = mongoose.model('SuperHero', new mongoose.Schema({
  name: String,
  alias: String,
  protection_area: String,
  super_powers: [String],
}));
