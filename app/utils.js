const roles = require('./roles');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcrypt');
const User = require('./models/user');

/**
 * Remove the atributes used internally by the DB
 * @param {Model<any>} elements Elements from a mongoose model
 */
const clearDbAtributes = (elements) => {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      // recursive call
      clearDbAtributes(element);
    });
  } else {
    elements._id = undefined;
    elements.__v = undefined;
  }
};
exports.clearDbAtributes = clearDbAtributes;

exports.updateValue = (obj, key, value) => {
  if (value && obj[key] !== value) {
    obj[key] = value;
  }
};

/**
 * Check if the user is an admin
 *
 * Returns 403 to res if not admin
 *
 * @param {Request} req http request
 * @param {Response} res http response
 * @returns {boolean} Returns true if the user is an admin
 */
exports.isAdmin = (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const payload = jwt.decode(token);

  if (payload.role !== roles.ADMIN) {
    // if there is no token
    // return an error
    res.status(403).send({
      success: false,
      message: 'Invalid permission for requested operation.',
    });
    return false;
  }
  return true;
};

exports.checkInput = (json) => {
  if (!json || !json.name) {
    return false;
  }
  return true;
};

const createUser = (username, password, userrole, callback) => {
  if (!(username && password && userrole)) {
    const err = 'Incomplete user information.';
    throw err;
  }

  User.findOne({ name: username }, (errExist, userExists) => {
    if (errExist) {
      if (callback) callback(errExist);
      return;
    }
    if (userExists) {
      if (callback) callback('User already registered.');
      return;
    }

    let userOk = false;

    // TODO: alternative to 'for'?
    const roleKeys = Object.keys(roles);
    for (const key of roleKeys) {
      if (userrole !== roles[key]) continue;

      const hash = bcrypt.hashSync(password, 12);
      const user = new User({
        name: username,
        password: hash,
        role: userrole,
      });

      userOk = true;
      user.save((errSave) => {
        if (errSave) {
          if (callback) callback(errSave);
          return;
        }

        if (callback) callback(null, user);
      });

      if (userOk) return;
    }

    const errRole = 'Invalid role provided.';
    if (!userOk) if (callback) callback(errRole);
  });
};
exports.createUser = createUser;

const updateUser = (username, password, userrole, callback) => {
  if (!(username && (password || userrole))) {
    const err = 'Incomplete user information.';
    throw err;
  }

  User.findOne({ name: username }, (errExist, user) => {
    if (errExist) {
      callback(errExist);
      return;
    }
    if (!user) {
      callback('User not registered.');
      return;
    }

    if (password) {
      const hash = bcrypt.hashSync(password, 12);
      user.password = hash;
    }

    let roleOk = false;
    if (userrole) {
      // TODO: alternative to 'for'?
      const roleKeys = Object.keys(roles);
      for (const key of roleKeys) {
        if (userrole !== roles[key]) continue;

        roleOk = true;
        user.role = userrole;
      }
    }

    if (!roleOk) {
      const errRole = 'Invalid role provided.';
      if (!userOk) callback(errRole);
    }

    user.save((errSave) => {
      if (errSave) {
        callback(errSave);
        return;
      }

      callback(null, user);
    });
  });
};
exports.updateUser = updateUser;

exports.checkDefaultUser = () => {
  // ======================
  // create default user

  User.find({ role: roles.ADMIN }, (err, list) => {
    if (err) throw err;
    if (!list.length) {
      createUser('admin', 'admin', roles.ADMIN);
    }
  });
};
