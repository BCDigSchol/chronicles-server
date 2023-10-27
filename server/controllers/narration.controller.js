const db = require('../models');
const Op = db.Sequelize.Op;

const Author = db.authors;
const Publication = db.publications;
const Narration = db.narrations;
const Genre = db.genres;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.publicationId) {
    errorMsgs.push('Must contain a \'publicationId\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const requestObj = {
    id: req.body.id || null,
    narration: req.body.narration,
    notes: req.body.notes
  };
  // Save Inscription in the database
  Narration.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Narration.'
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

  let { narration, page, size } = req.query;
  let where = {};
  let { limit, offset } = getPagination(page, size);
  if (narration) {
    where.narration = { [Op.like]: `%${narration}%` };
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    Narration.findAll({
      where
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving narrations.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    Narration.findAndCountAll({
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
          err.message || 'Some error occurred while retrieving narrations.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Narration.findByPk(id, {
    include: [
      {
        model: Publication,
        as: 'publications',
        attributes: ['title', 'subtitle', 'settingName', 'settingCategory', 'period', 'timeScale', 'protagonistCategory', 'protagonistGroupType'],
        include: [
            {
                model: Author,
                as: 'authors',
                attributes: ['surname', 'maidenName', 'otherNames', 'label', 'gender', 'nationality', 'specificNationality'],
                through: {
                    attributes: ['publicationId', 'authorId', 'publishedHonorific', 'publishedName']
                }
            }, {
                model: Genre,
                as: 'genres',
                attributes: ['genre']
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
          message: `Cannot find Narration with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Narration with id=' + id
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Narration.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Narration was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Narration with id=${id}. Maybe Narration was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Narration with id=' + id
      });
    });
};

// Update an item by the id in the request
exports.update = (req, res) => {
  var errorMsgs = [];
  // validate request
  if (!req.body.id) {
    errorMsgs.push('Must contain an \'id\' field!');
  }
  if (errorMsgs.length > 0) {
    res.send({
      status: 0,
      messages: errorMsgs
    });
    return;
  }
  const id = req.params.id;
  Narration.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Narration was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Narration with id=${id}. Maybe Narration was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Narration with id=' + id
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  Narration.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Narrations were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all narrations.'
      });
    });
};