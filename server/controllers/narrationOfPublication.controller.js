const db = require('../models');
const Op = db.Sequelize.Op;

const NarrationOfPublication = db.narrationsOfPublications;
const Author = db.authors;
const Publication = db.publications;
const Genre = db.genres;
const Narration = db.narrations;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.narrationId) {
    errorMsgs.push('Must contain a \'narrationId\' field!');
  }
  if (!req.body.publicationId) {
    errorMsgs.push('Must contain an \'publicationId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const requestObj = {
    narrationId: req.body.narrationId,
    publicationId: req.body.publicationId,
    notes: req.body.notes || '',
  };
  // Save Inscription in the database
  NarrationOfPublication.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the NarrationOfPublication.'
      });
    });
};

// Retrieve all items from the database.
exports.findAll = (req, res) => {

  // calculate limit and offset values from page and size values
  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  let { page, size } = req.query;
  let { limit, offset } = getPagination(page, size);
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    NarrationOfPublication.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving narrations of publications.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    NarrationOfPublication.findAndCountAll({
      limit,
      offset,
      distinct: true,
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving narrations of publications.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const publicationId = req.params.publicationId;
  const narrationId = req.params.narrationId;
  NarrationOfPublication.findOne({
    where: {
        publicationId: publicationId,
        narrationId: narrationId
    },
    include: [
      {
        model: Narration,
        as: 'narration',
      },
      {
        model: Publication,
        as: 'publication',
        attributes: ['title', 'subtitle', 'settingName', 'settingCategory', 'period', 'timeScale', 'protagonistCategory', 'protagonistGroupType'],
        include: [
          {
            model: Author,
            as: 'authors',
          },
          {
            model: Genre,
            as: 'genres',
          }
        ]
      }
    ],
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find NarrationOfPublication with publicationId=${publicationId} and narrationId=${narrationId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving NarrationOfPublication with publicationId=' + publicationId + ' and narrationId=' + narrationId
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const publicationId = req.params.publicationId;
  const narrationId = req.params.narrationId;
  NarrationOfPublication.destroy({
    where: { publicationId: publicationId, narrationId: narrationId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'NarrationOfPublication was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete NarrationOfPublication with publicationId=${publicationId} and narrationId=${narrationId}. Maybe NarrationOfPublication was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete NarrationOfPublication with publication=' + publicationId + ' and narrationId=' + narrationId
      });
    });
};

// Update an item by the id in the request
exports.update = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.publicationId) {
    errorMsgs.push('Must contain an \'publicationId\' field!');
  }
  if (!req.body.narrationId) {
    errorMsgs.push('Must contain an \'narrationId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const publicationId = req.params.publicationId;
  const narrationId = req.params.narrationId;
  NarrationOfPublication.update(req.body, {
    where: { publicationId: publicationId, narrationId: narrationId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'NarrationOfPublication was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update NarrationOfPublication with publicationId=${publicationId} and narrationId=${narrationId}. Maybe NarrationOfPublication was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating NarrationOfPublication with publicationId=' + publicationId + ' and narrationId=' + narrationId
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  NarrationOfPublication.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} NarrationOfPublication were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all narrations of publications.'
      });
    });
};