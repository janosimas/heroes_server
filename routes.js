const express = require('express');
const User = require('./app/models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// =======================
// routes ================
// =======================

function routes(app) {
    // get an instance of the router for api routes
    let apiRoutes = express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/authenticate', (req, res) => {

        // find the user
        User.findOne({
            name: req.body.name
        }, (err, user) => {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        admin: user.admin
                    };
                    let token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn: "2h" // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

    // route middleware to verify a token
    apiRoutes.use((req, res, next) => {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    // route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/', (req, res) => {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    });

    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', (req, res) => {
        User.find({}, (err, users) => {
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

    return apiRoutes;
}

module.exports = routes;