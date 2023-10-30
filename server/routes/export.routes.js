/**
 * @file Routes for exporting database data for backup
 * @author David J. Thomas
 */

const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/export.controller.js');
  var router = require('express').Router();
  // Retrieve all
  router.get('/', controller.findAll);
  app.use('/api/export', auth.verifyAdminToken, router);
};
