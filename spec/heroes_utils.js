const { getAuth, asyncGETRequest, asyncPOSTRequest } = require('./utils');

const removeHero = (heroesArray, callback) => {
  if (!callback) throw 'Undefined callback';
  // console.info('callback', callback);
  // console.info('heroesArray', heroesArray);
  if (heroesArray.length) {
    // console.info('heroesArraylength', heroesArray.length);
    const hero = heroesArray.pop();
    getAuth(asyncPOSTRequest, {
      path: 'DeleteSuperHero',
      json: {
        name: hero.name,
      },
      callback: () => {
        // remove next hero
        removeHero(heroesArray, callback);
      },
    });
  } else callback();
};

exports.removeAllHeroes = (callback) => {
  // console.info('removeAllHeros');
  // console.info(callback);
  getAuth(asyncGETRequest, {
    path: 'ListSuperHeroes',
    callback: (err, res, body) => {
      if (err) throw err;
      // console.info(body);
      const heroesArray = JSON.parse(body);
      removeHero(heroesArray, callback);
    },
  });
};

exports.listHeroes = (callback) => {
  // console.info('ListSuperHeroes');
  getAuth(asyncGETRequest, {
    path: 'ListSuperHeroes',
    callback: (err, res, body) => {
      callback(err, res, body);
    },
  });
};

exports.createBatman = (callback) => {
  getAuth(asyncPOSTRequest, {
    path: 'AddSuperHero',
    json: {
      name: 'Batman',
      alias: 'Bruce Waine',
      protection_area: {
        name: 'Gothan City',
        lat: 12,
        long: 13,
        radius: 100,
      },
      powers: null,
    },
    callback: (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    },
  });
};

exports.updateBatmansIdentity = (callback) => {
  getAuth(asyncPOSTRequest, {
    path: 'UpdateSuperHero',
    json: {
      name: 'Batman',
      alias: 'Dick Grayson',
    },
    callback: (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    },
  });
};

exports.killBatman = (callback) => {
  getAuth(asyncPOSTRequest, {
    path: 'DeleteSuperHero',
    json: {
      name: 'Batman',
    },
    callback: (errCreate, responseCreate, bodyCreate) => {
      if (errCreate) throw errCreate;
      callback(errCreate, responseCreate, bodyCreate);
    },
  });
};
