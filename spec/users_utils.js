const { getAuth, asyncPOSTRequest } = require('./utils');

const removeUser = (usersArray, callback) => {
  if (!callback) throw 'Undefined callback';

  if (usersArray.length) {
    const user = usersArray.pop();
    getAuth((token) => {
      asyncPOSTRequest('DeleteUser', token, () => {
        // remove next hero
        removeUser(usersArray, callback);
      }, { name: user.name });
    });
  } else callback();
};

exports.removeAllUsers = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('ListUsers', token, (err, res, body) => {
      if (err) throw err;
      const heroesArray = JSON.parse(body);
      removeUser(heroesArray.users, callback);
    });
  });
};

exports.listUsers = (callback) => {
  getAuth((token) => {
    asyncPOSTRequest('ListUsers', token, (err, res, body) => {
      callback(err, res, body);
    });
  });
};

exports.createUser = (username, userpass, userrole, callback) => {
  if (!callback) throw 'Undefined callback';

  getAuth((token) => {
    asyncPOSTRequest('CreateUser', token, () => {
      callback();
    }, {
        name: username,
        password: userpass,
        role: userrole,
      });
  });
};

exports.updateUser = (username, userpass, userrole, callback) => {
  if (!callback) throw 'Undefined callback';

  getAuth((token) => {
    asyncPOSTRequest('UpdateUser', token, () => {
      callback();
    }, {
        name: username,
        password: userpass,
        role: userrole,
      });
  });
};
