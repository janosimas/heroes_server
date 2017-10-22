const express = require('express');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const User = require('./app/models/user'); // get our mongoose model
const config = require('./config'); // get our config file
const roles = require('./app/roles');

// ======================
// create default user

User.find({ role: roles.ADMIN }, (err, list) => {
  if (err) throw err;
  if (!list.length) {
    const admin = new User({
      name: 'admin',
      password: 'admin',
      role: roles.ADMIN,
    });

    admin.save((errSave) => {
      if (errSave) throw errSave;
    });
  }
});

// =======================
// routes ================
// =======================

const apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {
  // find the user
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          role: user.role,
        };
        const tokenStr = jwt.sign(payload, config.secret, {
          expiresIn: '24h', // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: tokenStr,
        });
      }
    }
  });
});

// route middleware to verify a token
apiRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    res.status(403).send({
      success: false,
      message: 'No token provided.',
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

const addSuperHeroRoutes = require('./app/routes/superHeroRoutes');

addSuperHeroRoutes(apiRoutes);

module.exports = apiRoutes;
