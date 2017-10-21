const SuperHero = require('../models/superHero');
const ProtectionArea = require('../models/protectionArea');
const SuperPower = require('../models/superPower');

function saveHero(hero, res) {
  // save the sample user
  hero.save((errSave) => {
    if (errSave) throw errSave;

    // User saved successfully
    res.json({ success: true });
  });
}

function addSuperHeroRoutes(apiRoutes) {
  apiRoutes.get('/ListHeroes', (req, res) => {
    SuperHero.find({}, (err, superHeros) => {
      res.json(superHeros);
    });
  });

  apiRoutes.get('/DeleteAllHeroes', (req, res) => {
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

  apiRoutes.post('/AddHero', (req, res) => {
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
}

module.exports = addSuperHeroRoutes;
