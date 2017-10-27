const { getAuth, asyncGETRequest, asyncPOSTRequest } = require('./utils');

const removeHero = (heroesArray, callback) => {
  if (!callback) throw 'Undefined callback';
  // console.info('callback', callback);
  // console.info('heroesArray', heroesArray);
  if (heroesArray.length) {
    // console.info('heroesArraylength', heroesArray.length);
    const hero = heroesArray.pop();
    getAuth((token) => {
      asyncPOSTRequest('DeleteSuperHero', token, () => {
        // remove next hero
        removeHero(heroesArray, callback);
      }, { name: hero.name });
    });
  } else callback();
};

exports.removeAllHeroes = (callback) => {
  getAuth((token) => {
    asyncGETRequest('ListSuperHeroes', token, (err, res, body) => {
      if (err) throw err;
      const heroesArray = JSON.parse(body);
      removeHero(heroesArray, callback);
    });
  });
};

exports.listHeroes = (callback) => {
  getAuth((token) => {
    asyncGETRequest('ListSuperHeroes', token, (err, res, body) => {
      callback(err, res, body);
    });
  });
};

exports.createBatman = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('AddSuperHero', token, (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    }, {
        name: 'Batman',
        alias: 'Bruce Waine',
        protection_area: {
          name: 'Gothan City',
          lat: 12,
          long: 13,
          radius: 100,
        },
        powers: null,
      });
  });
};

exports.createFlyingMan = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('AddSuperHero', token, (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    }, {
        name: 'FlyingMan',
        alias: 'John Bird',
        protection_area: {
          name: 'Air City',
          lat: 24,
          long: 26,
          radius: 1000,
        },
        powers: ['Flight'],
      });
  });
};

exports.updateBatmansIdentity = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('UpdateSuperHero', token, (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    }, {
        name: 'Batman',
        alias: 'Dick Grayson',
      });
  });
};

exports.killBatman = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('DeleteSuperHero', token, (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    }, {
        name: 'Batman',
      });
  });
};
