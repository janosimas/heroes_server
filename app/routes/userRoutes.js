const User = require('../models/user');
const { clearDbAtributes, isAdmin } = require('../utils');
const { ACTION, auditUser } = require('../auditUtils');
const ROLE = require('../roles');
const { createUser, updateUser } = require('../utils');

/**
 * Remove the password from the users objects
 * @param {User} elements
 */
const removePassword = (elements) => {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      // recursive call
      removePassword(element);
    });
  } else {
    elements.password = undefined;
  }
};

const addUserRoutes = (apiRoutes) => {
  /**
   * List users route
   */
  apiRoutes.post('/ListUsers', (req, res) => {
    if (!isAdmin(req, res)) return;

    let { skip, limit } = req.body;
    if (typeof limit !== 'number'
      || limit > 100) limit = 100;

    if (typeof skip !== 'number') skip = 0;

    User.count(null, (err, number) => {
      const query = User.find().skip(skip).limit(limit);
      query.exec((errQ, users_) => {
        if (errQ) {
          res.json({
            success: false,
            error: err,
          });
          return;
        }

        clearDbAtributes(users_);
        removePassword(users_);
        res.json({ total_count: number, users: users_ });
      });
    });
  });

  /**
   * Remove user route
   */
  apiRoutes.post('/DeleteUser', (req, res) => {
    if (!isAdmin(req, res)) return;

    User.findOne({ name: req.body.name }, (err, user) => {
      if (err) {
        res.json({
          success: false,
          error: err,
        });
        return;
      }

      if (!user) {
        res.json({
          error: `User ${req.body.name} not registered.`,
          success: false,
        });
        return;
      }

      // check if it's the last admin user
      User.find({ role: ROLE.ADMIN }, (err, users) => {
        if (users.length === 1 && users[0].id === user.id) {
          res.json({
            error: 'Unable to remove last admin user.',
            success: false,
          });
          return;
        }

        user.remove((errRem) => {
          if (errRem) {
            res.json({
              error: `Error removing user ${req.body.name}.`,
              success: false,
            });
          } else {
            res.json({
              success: true,
            });
            const userName = req.decoded.user;
            auditUser(user.id, userName, ACTION.DELETE);
          }
        });
      });
    });
  });

  /**
   * Create user route
   */
  apiRoutes.post('/CreateUser', (req, res) => {
    if (!isAdmin(req, res)) return;

    const userProto = req.body;
    if (!(userProto.name && userProto.password && userProto.role)) {
      res.json({
        error: 'Incomplete user information.',
        success: false,
      });

      return;
    }

    createUser(userProto.name, userProto.password, userProto.role, (err, user) => {
      if (err) {
        res.json({
          error: err,
          success: false,
        });
        return;
      }

      res.json({
        success: true,
      });
      const userName = req.decoded.user;
      auditUser(user.id, userName, ACTION.CREATE);
    });
  });

  /**
   * Create user route
   */
  apiRoutes.post('/UpdateUser', (req, res) => {
    if (!isAdmin(req, res)) return;

    const userProto = req.body;
    if (!(userProto.name && (userProto.password || userProto.role))) {
      res.json({
        error: 'Incomplete user information.',
        success: false,
      });

      return;
    }

    updateUser(userProto.name, userProto.password, userProto.role, (err, user) => {
      if (err) {
        res.json({
          error: err,
          success: false,
        });
        return;
      }

      res.json({
        success: true,
      });
      const userName = req.decoded.user;
      auditUser(user.id, userName, ACTION.UPDATE);
    });
  });
};

module.exports = addUserRoutes;
