const SuperHero = require('../models/superHero');
const ProtectionArea = require('../models/protectionArea');
const SuperPower = require('../models/superPower');
const { clearDbAtributes, isAdmin, checkInput, updateValue } = require('../utils');
const { ACTION, auditSuperHero } = require('../auditUtils');

/**
 * Find and optionally creates a protection area
 *
 * @param {String|ProtectionArea} protectionAreaObj Name or protection area object.
 * @param {getProtectionArea~callback} callback Callback called after protectionAreaObj found.
 * @param {boolean} createIfPossible If true, tries to create a protection area.
 */
const getProtectionArea = (protectionAreaObj, callback, createIfPossible) => {
  // if no input, return null
  if (!protectionAreaObj) {
    callback(null);
    return;
  }

  // if we get a name, find the area or return null
  if (typeof protectionAreaObj === 'string') {
    ProtectionArea.findOne({ name: protectionAreaObj }, (err, protectionArea) => {
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
  ProtectionArea.findOne({ name: protectionAreaObj.name }, (err, protectionArea) => {
    if (err) callback(null);
    else if (protectionArea) callback(protectionArea);
    else if (createIfPossible === true) {
      // if there is no protection area with given name
      // try to create one
      const newProtectionArea = new ProtectionArea(protectionAreaObj);
      newProtectionArea.save((errSave) => {
        if (errSave) callback(null);
        else callback(newProtectionArea);
      });
    } else callback(null);
  });
};

/**
 * Callback called after protectionAreaObj found.
 * @callback getProtectionArea~callback
 * @param {ProtectioArea} protectionArea Protection area object, may be null
 */

/**
 * Check if all Super Powers of the list exist.
 *
 * @param {Array<SuperPower>} superPowerList Array of Super Powers
 * @param {checkSuperPowerList~callback} callback Callback called after every Super Power is checked.
 */
const checkSuperPowerList = (superPowerList, callback) => {
  if (superPowerList && superPowerList.length) {
    const superPower = superPowerList.pop();
    SuperPower.findOne({ name: superPower }, (errPower, power) => {
      if (power) checkSuperPowerList(superPowerList, callback);
      else callback(`Unable to find Super power: ${superPower}`);
    });
  } else {
    callback();
  }
};

/**
 * Callback called after every Super Power is checked.
 * @callback checkSuperPowerList~callback
 * @param {string} err Error message, null if every Super Power is valid
 */

/**
  * Save and audit super hero
  */
const saveHero = (hero, user, res) => {
  hero.save((errSave) => {
    if (errSave) throw errSave;

    // User saved successfully
    res.status(200).json({ success: true });
    auditSuperHero(hero.id, user, ACTION.CREATE);
  });
};

const updateProtectionArea = (protectionArea, json) => {
  if (!json) return;

  updateValue(protectionArea, 'name', json.name);
  updateValue(protectionArea, 'lat', json.lat);
  updateValue(protectionArea, 'long', json.long);
  updateValue(protectionArea, 'radius', json.radius);
};

const updateHero = (hero, user, json, res) => {
  updateValue(hero, 'name', json.name);
  updateValue(hero, 'alias', json.alias);
  getProtectionArea(hero.protection_area, (protectionArea) => {
    if (protectionArea) {
      updateProtectionArea(protectionArea, json.protection_area);
      updateValue(hero, 'protection_area', protectionArea.name);

      protectionArea.save((errProt) => {
        if (errProt) throw errProt;
        hero.save((err) => {
          if (err) {
            res.status(500).json({ success: false });
            return;
          }
          res.status(200).json({ success: true });
          auditSuperHero(hero.id, user, ACTION.UPDATE);
        });
      });
    } else {
      // if no protection area
      // save with the same area from before
      hero.save((err) => {
        if (err) {
          res.status(500).json({ success: false });
          return;
        }
        res.status(200).json({ success: true });
        auditSuperHero(hero.id, user, ACTION.UPDATE);
      });
    }
  }, true);
};

const getHero = (heroName, callback) => {
  SuperHero.findOne({ name: heroName }, (err, superHero) => {
    if (err) throw err;
    if (superHero) {
      clearDbAtributes(superHero);
      getProtectionArea(superHero.protection_area, (protectionArea) => {
        clearDbAtributes(protectionArea);

        // create json object from hero before assigning a protection area
        // if not protection area returns [object Object]
        const hero = superHero.toJSON();
        hero.protection_area = protectionArea.toJSON();

        callback(hero);
      }, false);
    } else {
      callback(null);
    }
  });
};

const addSuperHeroRoutes = (apiRoutes) => {
  // route 1
  apiRoutes.post('/ListSuperHeroes', (req, res) => {
    let { skip, limit } = req.body;
    if (typeof limit !== 'number'
      || limit > 100) limit = 100;

    if (typeof skip !== 'number') skip = 0;

    SuperHero.count(null, (err, number) => {
      const query = SuperHero.find().skip(skip).limit(limit);
      query.exec((errQ, superHeros) => {
        if (errQ) {
          res.status(500).json({
            success: false,
            error: errQ,
          });
          return;
        }

        if (superHeros.length === 0) {
          // no heros available
          res.status(200).json({ total_count: number, heroes: superHeros });
          return;
        }

        const outputHeroList = [];
        superHeros.forEach((hero) => {
          getHero(hero.name, (heroJson) => {
            outputHeroList.push(heroJson);
            if (outputHeroList.length === superHeros.length) {
              res.status(200).json({ total_count: number, heroes: outputHeroList });
            }
          });
        }, this);
      });
    });
  });
  // route 2
  apiRoutes.post('/AddSuperHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    SuperHero.find({ name: req.body.name }, (err, superHeroes) => {
      if (err) throw err;
      if (superHeroes.length > 0) {
        // If there is a hero with this name
        // return error message
        res.status(400).json({
          error: `Super Hero ${req.body.name} already exists!`,
          success: false,
        });
      } else {
        // check if hero information is complete
        if (!(req.body.name && req.body.alias && req.body.protection_area)) {
          res.status(400).json({ success: false, error: 'Incomplete hero, check your parameters.' });
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
            res.status(400).json({ success: false, error: 'Error identifying protection area.' });
            return;
          }

          protoHero.protection_area = protectionArea.name;
          protoHero.super_powers = req.body.powers ? req.body.powers.slice() : [];
          checkSuperPowerList(req.body.powers, (errPower) => {
            if (errPower) {
              res.status(404).json({ success: false, error: errPower });
              return;
            }
            const user = req.decoded.user;
            const hero = new SuperHero(protoHero);
            saveHero(hero, user, res);
          });
        }, true);
      }
    });
  });
  // route 3
  apiRoutes.post('/UpdateSuperHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperHero.findOne({ name: req.body.name }, (err, superHero) => {
      if (err) throw err;
      if (superHero) {
        const user = req.decoded.user;
        // there is a hero with this name, update
        updateHero(superHero, user, req.body, res);
      } else {
        res.status(400).json({
          error: `Super Hero ${req.body.name} doesn't exist!`,
          success: false,
        });
      }
    });
  });
  // route 4
  apiRoutes.post('/DeleteSuperHero', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }

    SuperHero.findOne({ name: req.body.name }, (errHero, superHero) => {
      if (errHero) {
        res.status(500).json(errHero);
        res.end();
        return;
      }

      if (!superHero) {
        res.status(404).json({ success: false, error: `No SuperHero named ${req.body.name}` });
        res.end();
        return;
      }

      SuperHero.remove({ name: req.body.name }, (err) => {
        if (err) res.status(500).json({ success: false, error: err });
        else {
          const user = req.decoded.user;
          auditSuperHero(superHero.id, user, ACTION.DELETE);

          res.status(200).json({
            success: true,
          });
        }
      });
    });
  });
  // route 5
  apiRoutes.post('/ListSuperHero', (req, res) => {
    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No hero name provided',
        success: false,
      });
      res.end();
      return;
    }
    getHero(req.body.name, (hero) => {
      if (hero) {
        res.status(200).json(hero);
      } else {
        res.status(400).json({
          error: `Super Hero ${req.body.name} doesn't exist!`,
          success: false,
        });
      }
    });
  });
};

module.exports = addSuperHeroRoutes;
