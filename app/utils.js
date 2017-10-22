const roles = require('./roles');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// function to remove the atributes used internally by the DB
const clearDbAtributes = (elements) => {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      // recursive call
      clearDbAtributes(element);
    });
  } else {
    delete element._id;
    delete element.__v;
  }
};
module.exports = clearDbAtributes;

const isAdmin = (req, res) => {
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
module.exports = isAdmin;
