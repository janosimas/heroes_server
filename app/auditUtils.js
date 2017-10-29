const nodemailer = require('nodemailer');
const AuditEvent = require('./models/auditEvent');
/**
 * List of valid entities to audit
 */
const ENTITY = {
  SUPER_HERO: 'SuperHero',
  SUPER_POWER: 'SuperPower',
  USER: 'User',
};

/**
 * Possible actions over entities
 */
exports.ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

const pusherList = [];
/**
 * Register a subscriber to the audit messages.
 *
 * @param email
 *  Subscriber email.
 * @param [name]
 *  Name of the subscriber.
 */
exports.RegisterAuditSubscriber = (email, name) => {
  if (name) {
    pusherList.push(`${name} <${email}>`);
  } else {
    pusherList.push(email);
  }
};

let transporter = null;
let debug = null;
/**
 * Set the nodemailer transporter that should be used to audit messaging.
 *
 * @param {nodemailer.Transport} newTransporter
 *   Nodemailer transporter for sending audit messages.
 * @param {String} [debug]
 *   If set to true, audit messages will not be logged in the database.
 */
exports.setTransporter = (newTransporter, debug_) => {
  transporter = newTransporter;
  debug = debug_;
};

/**
 * Send the audit message to every subscriber.
 *
 * @param {String} auditMessage
 */
const sendMail = (auditMessage) => {
  if (!transporter || pusherList.length === 0) return;

  const message = {
    from: transporter.options.auth.user,
    bcc: pusherList.join(', '),
    subject: 'SuperHero REST Audit',
    text: auditMessage,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) throw err;

    const testUri = nodemailer.getTestMessageUrl(info);
    // Preview only available when sending through an Ethereal account
    if (testUri) console.log('Preview URL: %s', testUri);
  });
};

/**
 * Register action on an entity
 *
 * Will register time of the occurrence
 *
 * @param {ENTITY} entity
 * @param {String} entityID
 * Entity id from the database
 * @param {ACTION} action
 * Operation performed over the entity
 */
const audit = (entity, entityID, username, action) => {
  const now = new Date();
  const datetime = now.toUTCString();
  const err = 'Incomplete audit data.';
  if (!(entity, datetime, username, action)) throw err;

  if (!debug) {
    const auditEvent = new AuditEvent({ entity, entityID, datetime, username, action });
    auditEvent.save((errSave) => {
      if (errSave) throw errSave;

      sendMail(`${datetime} - ${username} ${action} ${entity} (${entityID})`);
    });
  } else {
    // debug mode only sends email
    sendMail(`${datetime} - ${username} ${action} ${entity} (${entityID})`);
  }
};

/**
 * Register action on a SuperHero
 *
 * Will register time of the occurrence
 *
 * @param {String} entityID
 * Entity id from the database
 * @param {ACTION} action
 * Operation performed over the entity
 */
exports.auditSuperHero = (entityID, username, action) => {
  audit(ENTITY.SUPER_HERO, entityID, username, action);
};

/**
 * Register action on a SuperPower
 *
 * Will register time of the occurrence
 *
 * @param {String} entityID
 * Entity id from the database
 * @param {ACTION} action
 * Operation performed over the entity
 */
exports.auditSuperPower = (entityID, username, action) => {
  audit(ENTITY.SUPER_POWER, entityID, username, action);
};

/**
 * Register action on a User
 *
 * Will register time of the occurrence
 *
 * @param {String} entityID
 * Entity id from the database
 * @param {ACTION} action
 * Operation performed over the entity
 */
exports.auditUser = (entityID, username, action) => {
  audit(ENTITY.USER, entityID, username, action);
};
