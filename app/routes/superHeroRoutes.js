const SuperHero = require('../models/superHero');
const ProtectionArea = require('../models/protectionArea');
const SuperPower = require('../models/superPower');
const { clearDbAtributes, isAdmin, checkInput } = require('../utils');

const getProtectionArea = (protectionArea_, callback, createIfPossible) => {
  // if no input, return null
  if (!protectionArea_) {
    callback(null);
    return;
  }

  // if we get a name, find the area or return null
  if (typeof protectionArea_ === 'string') {
    ProtectionArea.findOne({ name: protectionArea_ }, (err, protectionArea) => {
      if (protectionArea) callback(protectionArea);
      else {
        // homogenizing return value
        callback(null);
      }
    });
    return;
  }

  // if we get an object find the protection area
  // other data will be ignored
  ProtectionArea.findOne({ name: protectionArea_.name }, (err, protectionArea) => {
    if (err) callback(null);
    else if (protectionArea) callback(protectionArea);
    else if (createIfPossible === true) {
      // if there is no protection area with given name
      // try to create one
      const newProtectionArea = new ProtectionArea(protectionArea_);
      newProtectionArea.save((errSave) => {
        if (errSave) callback(null);
        else callback(newProtectionArea);
      });
    } else callback(null);
  });
};

const getSuperPower = (superPowerList, callback) => {
  if (superPowerList && superPowerList.length) {
    const superPower = superPowerList.pop();
    SuperPower.findOne({ name: superPower }, (errPower, power) => {
      if (power) getSuperPower(superPowerList, callback);
      else callback(`Unable to find Super power: ${superPower}`);
    });
  } else {
    callback();
  }
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
  getProtectionArea(json.protection_area, (protectionArea) => {
    if (protectionArea) {
      updateHeroValue(hero, 'protection_area', protectionArea.name);
    }
    // if no protection area
    // save with the same area from before
    hero.save((err) => {
      if (err) throw err;
    });
  }, true);
};

function addSuperHeroRoutes(apiRoutes) {
  // route 1
  apiRoutes.get('/ListHeroes', (req, res) => {
    SuperHero.find({}, (err, superHeros) => {
      clearDbAtributes(superHeros);
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
      } else {
        // check if hero information is complete
        if (!(req.body.name && req.body.alias && req.body.protection_area)) {
          res.json({ success: false, error: 'Incomplete hero, check your parameters.' });
          return;
        }

        // new hero, go on
        const protoHero = {
          name: req.body.name,
          alias: req.body.alias,
        };
        // complete hero data, go on
        getProtectionArea(req.body.protection_area, (protectionArea) => {
          if (!protectionArea) {
            res.json({ success: false, error: 'Error identifying protection area.' });
            return;
          }

          protoHero.protection_area = protectionArea.name;
          protoHero.powers = req.body.powers;
          getSuperPower(req.body.powers, (errPower) => {
            if (errPower) {
              res.json({ success: false, error: errPower });
              return;
            }

            const hero = new SuperHero(protoHero);
            saveHero(hero, res);
          });
        }, true);
      }
    });
  });
  // route 3
  apiRoutes.post('/UpdateHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
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

    if (!checkInput(req.body)) {
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
    if (!checkInput(req.body)) {
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
        clearDbAtributes(superHero);
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
}

module.exports = addSuperHeroRoutes;
