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
      res.send(data);
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
      res.send({
        message: 'NarrationOfPublication was deleted successfully!'
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
      res.send({
        message: 'NarrationOfPublication was updated successfully.'
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
      res.send({ message: `${nums} NarrationsOfPublications were deleted successfully!` });
    });
};