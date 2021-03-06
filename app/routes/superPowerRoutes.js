const SuperHero = require('../models/superHero');
const SuperPower = require('../models/superPower');
const { clearDbAtributes, isAdmin, checkInput, updateValue } = require('../utils');
const { ACTION, auditSuperPower } = require('../auditUtils');

/**
  * Save and audit super power
  */
const savePower = (power, user, res) => {
  power.save((errSave) => {
    if (errSave) throw errSave;

    // Power saved successfully
    res.status(200).json({ success: true });
    auditSuperPower(power.id, user, ACTION.CREATE);
  });
};


const updatePower = (power, user, json, res) => {
  updateValue(power, 'name', json.name);
  updateValue(power, 'description', json.description);

  power.save((errSave) => {
    if (errSave) {
      res.status(500).json({ success: false });
      return;
    }

    // User saved successfully
    res.status(200).json({ success: true });
    auditSuperPower(power.id, user, ACTION.CREATE);
  });
};

function addSuperPowerRoutes(apiRoutes) {
  // route 6
  apiRoutes.post('/ListSuperPowers', (req, res) => {
    let { skip, limit } = req.body;
    if (typeof limit !== 'number'
      || limit > 100) limit = 100;

    if (typeof skip !== 'number') skip = 0;

    SuperPower.count(null, (err, number) => {
      const query = SuperPower.find().skip(skip).limit(limit);
      query.exec((errQ, superPowers) => {
        clearDbAtributes(superPowers);

        res.status(200).json({ total_count: number, powers: superPowers });
      });
    });
  });
  // route 7
  apiRoutes.post('/AddSuperPower', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    SuperPower.findOne({ name: req.body.name }, (err, superPower) => {
      if (err) throw err;
      if (superPower) {
        // If there is a power with this name
        // return error message
        res.status(400).json({
          error: `Super Power ${req.body.name} already exists!`,
          success: false,
        });
      } else {
        // check if power information is complete
        if (!(req.body.name && req.body.description)) {
          res.status(400).json({ success: false, error: 'Incomplete power, check your parameters.' });
          return;
        }

        // new hero, go on
        const protoPower = {
          name: req.body.name,
          description: req.body.description,
        };

        const user = req.decoded.user;
        const power = new SuperPower(protoPower);
        savePower(power, user, res);
      }
    });
  });
  // route 8
  apiRoutes.post('/UpdateSuperPower', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No power name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperPower.findOne({ name: req.body.name }, (err, superPower) => {
      if (err) throw err;
      if (superPower) {
        const user = req.decoded.user;
        // there is a power with this name, update
        updatePower(superPower, user, req.body, res);
      } else {
        res.status(400).json({
          error: `Super Power ${req.body.name} doesn't exist!`,
          success: false,
        });
      }
    });
  });
  // route 9
  apiRoutes.post('/DeleteSuperPower', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No Super Power name provided',
        success: false,
      });
      res.end();
      return;
    }

    SuperHero.findOne({ super_power: [req.body.name] }, (errHero, superHero) => {
      if (errHero) {
        res.status(500).json({ success: false, error: errHero });
        return;
      }
      if (superHero) {
        // There is a hero with this power,
        // return error
        res.status(400).json({ success: false, error: 'There are Super Heros currently with this power.' });
        return;
      }

      SuperPower.remove({ name: req.body.name }, (errPower) => {
        if (errPower) res.status(500).json({ success: false, error: errPower });
        else {
          res.status(200).json({
            success: true,
          });
        }
      });
    });
  });
  // route 10
  apiRoutes.post('/SuperPower', (req, res) => {
    if (!checkInput(req.body)) {
      res.status(400).json({
        error: 'No Super Power name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperPower.findOne({ name: req.body.name }, (err, superPower) => {
      if (err) throw err;
      if (superPower) {
        clearDbAtributes(superPower);
        res.status(200).json(superPower);
      } else {
        res.status(400).json({
          error: `Super Power ${req.body.name} doesn't exist!`,
          success: false,
        });
      }

      res.end();
    });
  });
}

module.exports = addSuperPowerRoutes;
