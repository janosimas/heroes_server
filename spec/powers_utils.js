const { getAuth, asyncGETRequest, asyncPOSTRequest } = require('./utils');

const removePowers = (powersArray, callback) => {
  if (!callback) throw 'Undefined callback';

  if (powersArray.length) {
    const power = powersArray.pop();
    getAuth((token) => {
      asyncPOSTRequest('DeleteSuperPower', token, () => {
        // remove next hero
        removePowers(powersArray, callback);
      }, { name: power.name });
    });
  } else callback();
};
exports.removePowers = removePowers;

exports.removeAllPowers = (callback) => {
  getAuth((token) => {
    asyncGETRequest('ListSuperPowers', token, (err, res, body) => {
      if (err) throw err;
      const powersArray = JSON.parse(body);
      removePowers(powersArray, callback);
    });
  });
};

exports.listPowers = (callback) => {
  getAuth((token) => {
    asyncGETRequest('ListSuperPowers', token, (err, res, body) => {
      callback(err, res, body);
    });
  });
};

exports.createPower = (powername, powerdescription, callback) => {
  if (!callback) throw 'Undefined callback';

  getAuth((token) => {
    asyncPOSTRequest('AddSuperPower', token, () => {
      callback();
    }, {
        name: powername,
        description: powerdescription,
      });
  });
};

exports.updatePower = (powername, powerdescription, callback) => {
  if (!callback) throw 'Undefined callback';

  getAuth((token) => {
    asyncPOSTRequest('UpdateSuperPower', token, () => {
      callback();
    }, {
        name: powername,
        description: powerdescription,
      });
  });
};
