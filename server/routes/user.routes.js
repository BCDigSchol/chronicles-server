/**
 * @file Routes for registering, updating, and logging users in.
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/user.controller.js');
  var router = require('express').Router();
  // Retrieve all Users
  router.get('/', limitRate, auth.verifyAdminToken, controller.findAll);
  // Login
  router.post('/login', limitRate, controller.login);
  // Register
  router.post('/register', limitRate, controller.register);
  // Update
  router.put('/update/:username', limitRate, auth.verifyToken, controller.update);
  app.use('/api/user', router);
};
