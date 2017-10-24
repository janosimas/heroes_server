// get an instance of dbSchema
const mongoose = require('mongoose');

/**
 * Audit event mongoose schema
 */
module.exports = mongoose.model('AuditEvent', new mongoose.Schema({
  entity: String,
  entityID: String,
  datetime: String,
  username: String,
  action: String,
}));
