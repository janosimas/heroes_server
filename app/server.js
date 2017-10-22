const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const tungus = require('tungus');

global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true };
const mongoose = require('mongoose');
const apiRoutes = require('./routes');

// init database
const path = require('path');
const fs = require('fs');

module.exports = (port) => {
  const databaseFolder = `${path.dirname(process.argv[1])}/database`;
  // check if folder exists
  if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
  }

  const database = `tingodb://${databaseFolder}`;
  mongoose.connect(database); // connect to database

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
