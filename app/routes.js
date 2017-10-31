const express = require('express');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const User = require('./models/user'); // get our mongoose model
const config = require('../config'); // get our config file
const { checkDefaultUser, isAdmin } = require('./utils');
const { RegisterAuditSubscriber } = require('./auditUtils');

const bcrypt = require('bcrypt');


// =======================
// routes ================
// =======================

const apiRoutes = express.Router();

// Check if there is an admin user
checkDefaultUser();

// ================================
// test route for push messages
// ================================
// apiRoutes.post('/Connect', (req, res) => {
//   res.write('teste');

//   setTimeout(() => {
//     res.write('teste2');

//     setTimeout(() => {
//       res.write('teste3');
//       res.end();
//     }, 60000);
//   }, 30000);
// });
// ================================

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {
  // find the user
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(403).json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      // console.info(`admin hash: ${user.password}`);
      // console.info(`authenticating pass: ${req.body.password}`);
      bcrypt.compare(req.body.password, user.password, (errCompare, same) => {
        if (errCompare) {
          res.status(500).json({ success: false, message: 'Unable to authenticate.' });
          return;
        }

        if (!same) {
          res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            role: user.role,
            user: user.name,
          };
          const tokenStr = jwt.sign(payload, config.secret, {
            expiresIn: '24h', // expires in 24 hours
          });

          // return the information including token as JSON
          res.status(200).json({
            success: true,
            message: 'Enjoy your token!',
            token: tokenStr,
          });
        }
      });
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
        res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
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
  res.status(200).json({ message: 'Welcome to the SuperHero API!\nFor more information access: https://github.com/janosimas/heroes_server' });
});

apiRoutes.post('/AuditAccess', (req, res) => {
  if (!isAdmin(req, res)) return;

  const { email, name } = req.body;
  if (!email) {
    res.status(400).json({
      error: 'Incomplete address information.',
      success: false,
    });
    return;
  }

  RegisterAuditSubscriber(email, name);
  res.status(200).json({
    success: true,
  });
});

const addUserRoutes = require('./routes/userRoutes');
const addSuperHeroRoutes = require('./routes/superHeroRoutes');
const addSuperPowersRoutes = require('./routes/superPowerRoutes');

addUserRoutes(apiRoutes);
addSuperHeroRoutes(apiRoutes);
addSuperPowersRoutes(apiRoutes);

module.exports = apiRoutes;
