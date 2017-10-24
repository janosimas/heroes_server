const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// must be here to use with mongoose
// don't reorder or remove
const tungus = require('tungus');

global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true };
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs');

const apiRoutes = require('./routes');
const { setTransporter } = require('./auditUtils');

/**
 * Server creation function.
 *
 * @param port
 * Listening por of the server.
 * @param dbPath
 * Folder to storage the db files.
 * @param {nodemailer.Transport} transporter
 * Nodemailer transporter to send audit messages
 * @param {Bool} [debug]
 * If set to true, audit messages will not be logged in the database.
 * @returns {http.Server}
 * Returns the http.Server.
 */
module.exports = (port, dbPath, transporter, debug) => {
  // if no dbPath, use database as folder name
  const databaseFolder = dbPath || `${path.dirname(process.argv[1])}/database`;

  // check if folder exists
  if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
  }

  const database = `tingodb://${databaseFolder}`;
  mongoose.connect(database); // connect to database

  setTransporter(transporter, debug);

  const app = express();
  // =======================
  // configuration =========
  // =======================

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // use morgan to log requests to the console
  app.use(morgan('dev'));

  // apply the routes to our application with the prefix /api
  app.use('/api', apiRoutes);

  // =======================
  // start the server ======
  // =======================
  const server = app.listen(port);
  console.log(`Magic happens at http://localhost:${port}`);

  return server;
};
