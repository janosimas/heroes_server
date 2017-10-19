const express = require('express');
const User = require('./app/models/user'); // get our mongoose model

// =======================
// routes ================
// =======================

// get an instance of the router for api routes
let apiRoutes = express.Router();

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

module.exports = apiRoutes;