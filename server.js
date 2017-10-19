const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const tungus = require('tungus');
global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true };
const mongoose = require('mongoose');

const User = require('./app/models/user'); // get our mongoose model

//init database
const path = require('path');
const database_folder = path.dirname(process.argv[1]);
mongoose.connect('tingodb://' + database_folder + '/database'); // connect to database

let apiRoutes = require('./routes')
let app = express();
// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

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
app.listen(port);
console.log('Magic happens at http://localhost:' + port);