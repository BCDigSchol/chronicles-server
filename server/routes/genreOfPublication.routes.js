const auth = require('../middleware/auth');
const limitRate = require('../middleware/limit-rate');

module.exports = app => {
  const controller = require('../controllers/genreOfPublication.controller.js');
  var router = require('express').Router();
    // Create a new item
    router.post('/', limitRate, auth.verifyAdminToken, controller.create);
    // Retrieve all item
    router.get('/', controller.findAll);
    // Retrieve a single item with id
    router.get('/:publicationId/:genreId', limitRate, controller.findOne);
    // Update an item with id
    router.put('/:publicationId/:genreId', limitRate, auth.verifyAdminToken, controller.update);
    // Delete a item with id
    router.delete('/:publicationId/:genreId', limitRate, auth.verifyAdminToken, controller.delete);
    // Delete all item
    router.delete('/', limitRate, auth.verifyAdminToken, controller.deleteAll);
  app.use('/api/genres-of-publications', router);
};
