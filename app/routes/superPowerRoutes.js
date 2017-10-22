const SuperHero = require('../models/superHero');
const SuperPower = require('../models/superPower');
const { clearDbAtributes, isAdmin, checkInput } = require('../utils');

const savePower = () => {};
const updatePower = () => {};

function addSuperPowerRoutes(apiRoutes) {
  // route 6
  apiRoutes.get('/ListSuperPowers', (req, res) => {
    SuperPower.find({}, (err, superPowers) => {
      clearDbAtributes(superPowers);

      res.json(superPowers);
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
        res.json({
          error: `Super Power ${req.body.name} already exists!`,
          success: false,
        });
      } else {
        // check if power information is complete
        if (!(req.body.name && req.body.description)) {
          res.json({ success: false, error: 'Incomplete power, check your parameters.' });
          return;
        }

        // new hero, go on
        const protoPower = {
          name: req.body.name,
          description: req.body.description,
        };

        const power = new SuperPower(protoPower);
        savePower(power, res);
      }
    });
  });
  // route 8
  apiRoutes.post('/UpdateSuperPower', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    if (!checkInput(req.body)) {
      res.json({
        error: 'No power name provided',
        success: false,
      });
      res.end();
      return;
    }
    SuperPower.findOne({ name: req.body.name }, (err, superPower) => {
      if (err) throw err;
      if (superPower) {
        // there is a power with this name, update
        updatePower(superPower, req.body);
        res.json({
          success: true,
        });
      } else {
        res.json({
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
      res.json({
        error: 'No Super Power name provided',
        success: false,
      });
      res.end();
      return;
    }

    SuperHero.findOne({ super_power: [req.body.name] }, (errHero, superHero) => {
      if (errHero) {
        res.json({ success: false, error: errHero });
        return;
      }
      if (superHero) {
        // There is a hero with this power,
        // return error
        res.json({ success: false, error: 'There are Super Heros currently with this power.' });
        return;
      }

      SuperPower.remove({ name: req.body.name }, (errPower) => {
        if (errPower) res.json({ success: false, error: errPower });
        else {
          res.json({
            success: true,
          });
        }
      });
    });
  });
  // route 10
  apiRoutes.post('/SuperPower', (req, res) => {
    if (!checkInput(req.body)) {
      res.json({
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
        res.json(superPower);
      } else {
        res.json({
          error: `Super Power ${req.body.name} doesn't exist!`,
          success: false,
        });
      }

      res.end();
    });
  });
  // TODO: remove this route
  apiRoutes.get('/DeleteAllPowera', (req, res) => {
    // check role for permission
    if (!isAdmin(req, res)) return;

    SuperPower.remove({}, (err, removed) => {
      if (err) res.json({ success: false, error: err });
      else {
        res.json({
          success: true,
          message: 'All powers removes.',
          count: removed,
        });
      }
    });
  });
}

module.exports = addSuperPowerRoutes;