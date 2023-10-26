const db = require('../models');
const Op = db.Sequelize.Op;

const GenreOfPublication = db.genresOfPublications;
const Author = db.authors;
const Publication = db.publications;
const Genre = db.genres;
const Narration = db.narrations;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.genreId) {
    errorMsgs.push('Must contain a \'genreId\' field!');
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
    genreId: req.body.genreId,
    publicationId: req.body.publicationId,
    notes: req.body.notes || '',
  };
  // Save Inscription in the database
  GenreOfPublication.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the GenreOfPublication.'
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
    GenreOfPublication.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving genres of publications.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    GenreOfPublication.findAndCountAll({
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
          err.message || 'Some error occurred while retrieving genres of publications.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const publicationId = req.params.publicationId;
  const genreId = req.params.genreId;
  GenreOfPublication.findOne({
    where: {
        publicationId: publicationId,
        genreId: genreId
    },
    include: [
      {
        model: Genre,
        as: 'genre'
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
            model: Narration,
            as: 'narrations',
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
          message: `Cannot find GenreOfPublication with publicationId=${publicationId} and genreId=${genreId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving GenreOfPublication with publicationId=' + publicationId + ' and genreId=' + genreId
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const publicationId = req.params.publicationId;
  const genreId = req.params.genreId;
  GenreOfPublication.destroy({
    where: { publicationId: publicationId, genreId: genreId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'GenreOfPublication was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete GenreOfPublication with publicationId=${publicationId} and genreId=${genreId}. Maybe GenreOfPublication was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete GenreOfPublication with publication=' + publicationId + ' and genreId=' + genreId
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
  if (!req.body.genreId) {
    errorMsgs.push('Must contain an \'genreId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const publicationId = req.params.publicationId;
  const genreId = req.params.genreId;
  GenreOfPublication.update(req.body, {
    where: { publicationId: publicationId, genreId: genreId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'GenreOfPublication was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update GenreOfPublication with publicationId=${publicationId} and genreId=${genreId}. Maybe GenreOfPublication was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating GenreOfPublication with publicationId=' + publicationId + ' and genreId=' + genreId
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  GenreOfPublication.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} GenreOfPublication were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all genres of publications.'
      });
    });
};