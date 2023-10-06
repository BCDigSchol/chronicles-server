const db = require('../models');
const Op = db.Sequelize.Op;

const AuthorOfPublication = db.authorsOfPublications;
const Author = db.authors;
const Publication = db.publications;
const Genre = db.genres;
const Narration = db.narrations;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.authorId) {
    errorMsgs.push('Must contain a \'authorId\' field!');
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
    authorId: req.body.authorId,
    publicationId: req.body.publicationId,
    publishedHonorific: req.body.publishedHonorific || '',
    publishedName: req.body.publishedName || '',
    notes: req.body.notes || '',
  };
  // Save Inscription in the database
  AuthorOfPublication.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the AuthorOfPublication.'
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

  let { published_name, page, size } = req.query;
  let where = {};
  let { limit, offset } = getPagination(page, size);
  if (published_name) {
    where.publishedName = { [Op.like]: `%${published_name}%` };
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    AuthorOfPublication.findAll({
      where
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving authors of publications.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    AuthorOfPublication.findAndCountAll({
      where,
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
          err.message || 'Some error occurred while retrieving authors of publications.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const publicationId = req.params.publicationId;
  const authorId = req.params.authorId;
  AuthorOfPublication.findOne({
    where: {
        publicationId: publicationId,
        authorId: authorId
    },
    include: [{
        model: Author,
        as: 'author',
        attributes: ['surname', 'maidenName', 'otherNames', 'label', 'gender', 'nationality'],
      },
      {
        model: Publication,
        as: 'publication',
        attributes: ['title', 'subtitle', 'settingName', 'settingCategory', 'period', 'timeScale', 'protagonistCategory', 'protagonistGroupType'],
        include: [
            {
                model: Genre,
                as: 'genres',
                attributes: ['genre']
            }, {
                model: Narration,
                as: 'narrations',
                attributes: ['narration']
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
          message: `Cannot find AuthorOfPublication with publicationId=${publicationId} and authorId=${authorId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving AuthorOfPublication with publicationId=' + publicationId + ' and authorId=' + authorId
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const publicationId = req.params.publicationId;
  const authorId = req.params.authorId;
  AuthorOfPublication.destroy({
    where: { publicationId: publicationId, authorId: authorId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'AuthorOfPublication was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete AuthorOfPublication with publicationId=${publicationId} and authorId=${authorId}. Maybe AuthorOfPublication was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete AuthorOfPublication with publication=' + publicationId + ' and authorId=' + authorId
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
  if (!req.body.authorId) {
    errorMsgs.push('Must contain an \'authorId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const publicationId = req.params.publicationId;
  const authorId = req.params.authorId;
  AuthorOfPublication.update(req.body, {
    where: { publicationId: publicationId, authorId: authorId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'AuthorOfPublication was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Author with publicationId=${publicationId} and authorId=${authorId}. Maybe AuthorOfPublication was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Author with publicationId=' + publicationId + ' and authorId=' + authorId
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  AuthorOfPublication.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} AuthorsOfPublications were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all authors of publications.'
      });
    });
};