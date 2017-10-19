const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const tungus = require('tungus');
global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true };
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file

const User = require('./app/models/user'); // get our mongoose model

//init database
const path = require('path');
const database_folder = path.dirname(process.argv[1]);
mongoose.connect('tingodb://' + database_folder + '/database'); // connect to database

let app = express();
// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

apiRoutes.get('/setup', (req, res) => {

    let user_name = 'Jano Simas';
    let user_pass = 'password';
    // create a sample user
    let nick = new User({
        name: user_name,
        password: user_pass,
        admin: true
    });


    User.find({ name: user_name }, (err, list) => {
        if (err) throw err;

        // check if there is a user with the given name
        if (list.length > 0) {
            res.json({
                error: 'User ' + 'Jano Simas' + ' already exists!',
                success: false
            });
        } else {
            // save the sample user
            nick.save((err) => {
                if (err) throw err;

                console.log('User saved successfully');
                res.json({ success: true });
            });
        }
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);