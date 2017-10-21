const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const SuperHero = require('../models/superHero');
const ProtectionArea = require('../models/protectionArea');
const SuperPower = require('../models/superPower');
const roles = require('../roles');

const isAdmin = (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const payload = jwt.decode(token);

  if (payload.role !== roles.ADMIN) {
    // if there is no token
    // return an error
    res.status(403).send({
      success: false,
      message: 'Invalid permission for requested operation.',
    });
    return false;
  }

  return true;
};

const saveHero = (hero, res) => {
  // save the sample user
  hero.save((errSave) => {
    if (errSave) throw errSave;

    // User saved successfully
    res.json({ success: true });
  });
};

const updateHeroValue = (hero, key, value) => {
  if (value && hero[key] !== value) {
    hero[key] = value;
  }
};

const updateHero = (hero, json) => {
  updateHeroValue(hero, 'name', json.name);
  updateHeroValue(hero, 'alias', json.alias);
  updateHeroValue(hero, 'protection_area', json.protection_area.name);

  hero.save((err) => {
    if (err) throw err;
  });
};

const checkHeroInput = (json) => {
  if (!json || !json.name) {
    return false;
  }
  return true;
};

function addSuperHeroRoutes(apiRoutes) {
  // route 1
  apiRoutes.get('/ListHeroes', (req, res) => {
    SuperHero.find({}, (err, superHeros) => {
      res.json(superHeros);
    });
  });
  // route 2
  apiRoutes.post('/AddHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    SuperHero.find({ name: req.body.name }, (err, superHeroes) => {
      if (err) throw err;
      if (superHeroes.length > 0) {
        // If there is a hero with this name
        // return error message
        res.json({
          error: `Super Hero ${req.body.name} already exists!`,
          success: false,
        });
        res.end();
      } else {
        // check if hero information is complete
        if (!(req.body.name && req.body.alias && req.body.protection_area)) {
          res.json({ success: false, error: 'Incomplete hero, check your parameters.' });
          res.end();
        } else {
          // new hero, go on
          const protoHero = {
            name: req.body.name,
            alias: req.body.alias,
          };
          // complete hero data, go on

          // disable check, better code organization is this case
          /* eslint no-lonely-if: 0 */

          // if protection area is a strig
          // it must have been registered before
          if (typeof req.body.protection_area === 'string') {
            ProtectionArea.find({ name: req.body.protection_area }, (listErr, protectionArea) => {
              if (listErr) {
                res.json({ success: false, error: listErr });
                res.end();
              } else if (!protectionArea.length) {
                // if no protection area with given name is registerd
                res.json({ success: false, error: `No protection area ${protectionArea} registerd.` });
                res.end();
              } else {
                protoHero.protection_area = req.body.protection_area;
                const hero = new SuperHero(protoHero);
                // everything is ok, go on
                saveHero(hero, res);
              }
            });
          } else {
            // protection area is an object

            // find if there is a protection area with given name
            ProtectionArea.find({ name: req.body.protection_area.name }, (listErr, protectionArea) => {
              if (listErr) {
                res.json({ success: false, error: listErr });
                res.end();
              } else {
                if (!protectionArea.length) {
                  // there is no protection area with given name,
                  // create it
                  const newProtectionArea = new ProtectionArea(protectionArea[0]);
                  newProtectionArea.save((errSave) => {
                    if (errSave) throw errSave;
                    // TODO: deal with saving error
                  });
                }

                // save hero with the protection area name
                protoHero.protection_area = req.body.protection_area.name;
                const hero = new SuperHero(protoHero);
                saveHero(hero, res);
              }
            });
          }
        }
      }
    });
  });
  // route 3
  apiRoutes.post('/UpdateHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkHeroInput(req.body)) {
      res.json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperHero.findOne({ name: req.body.name }, (err, superHero) => {
      if (err) throw err;
      if (superHero) {
        // there is a hero with this name, update
        updateHero(superHero, req.body);
        res.json({
          success: true,
        });
      } else {
        res.json({
          error: `Super Hero ${req.body.name} doesn't exist!`,
          success: false,
        });
      }
    });
  });
  // route 4
  apiRoutes.post('/DeleteHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkHeroInput(req.body)) {
      res.json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }

    SuperHero.remove({ name: req.body.name }, (err) => {
      if (err) res.json({ success: false, error: err });
      else {
        res.json({
          success: true,
        });
      }
    });
  });
  // route 5
  apiRoutes.post('/Hero', (req, res) => {
    if (!checkHeroInput(req.body)) {
      res.json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperHero.findOne({ name: req.body.name }, (err, superHero) => {
      if (err) throw err;
      if (superHero) {
        res.json(superHero);
      } else {
        res.json({
          error: `Super Hero ${req.body.name} doesn't exist!`,
          success: false,
        });
      }

      res.end();
    });
  });
  // TODO: remove this route
  apiRoutes.get('/DeleteAllHeroes', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    SuperHero.remove({}, (err, removed) => {
      if (err) res.json({ success: false, error: err });
      else {
        res.json({
          success: true,
          message: 'All heroes removes.',
          count: removed,
        });
      }
    });
  });
}

module.exports = addSuperHeroRoutes;
