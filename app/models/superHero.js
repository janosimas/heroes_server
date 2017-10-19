// get an instance of dbSchema
const mongoose = require('mongoose');
const SuperPower = require('./superPower');
const ProtectionArea = require('./protectionArea');

const Schema = mongoose.Schema;
// set up a db model and pass it using module.exports
module.exports = mongoose.model('SuperHero', new Schema({
    name: String,
    alias: String,
    // mogoose doesn't allow nested schema unless array or ref
    // fake array, ensure only one protection_area
    protection_area: [ProtectionArea],
    super_powers: [SuperPower]
}));