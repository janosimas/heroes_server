const SuperHero = require('../models/superHero');
const ProtectionArea = require('../models/protectionArea');
const SuperPower = require('../models/superPower');


function addSuperHeroRoutes(apiRoutes) {
    apiRoutes.get('/SuperHeroes', (req, res) => {
        SuperHero.find({}, (err, super_heros) => {
            res.json(super_heros);
        });
    });
}

module.exports = addSuperHeroRoutes;