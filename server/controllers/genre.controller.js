const db = require('../models');
const Op = db.Sequelize.Op;

const Author = db.authors;
const Publication = db.publications;
const Genre = db.genres;
const Narration = db.narrations;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.genre) {
    errorMsgs.push('Must contain an \'genre\' field!');
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
    genre: req.body.genre,
    notes: req.body.notes
  };
  // Save Inscription in the database
  Genre.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Genre.'
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

  let { genre, page, size } = req.query;
  let where = {};
  let { limit, offset } = getPagination(page, size);
  if (genre) {
    where.genre = { [Op.like]: `%${genre}%` };
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    Genre.findAll({
      where
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving genres.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    Genre.findAndCountAll({
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
          err.message || 'Some error occurred while retrieving genres.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Genre.findByPk(id, {
    include: [
      {
        model: Publication,
        as: 'publications',
        /*
        include: [
            {
                model: Author,
                as: 'authors',
                attributes: ['surname', 'maidenName', 'otherNames', 'label', 'gender', 'nationality', 'specificNationality'],
                through: {
                    attributes: ['publicationId', 'authorId', 'publishedHonorific', 'publishedName']
                }
            }, {
                model: Narration,
                as: 'narrations',
                attributes: ['narration']
            }
        ]
        */
      }
    ],
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Genre with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Genre with id=' + id
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Genre.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Genre was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Genre with id=${id}. Maybe Genre was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Genre with id=' + id
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
  Genre.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Genre was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Genre with id=${id}. Maybe Genre was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Genre with id=' + id
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  Genre.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Genres were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all genres.'
      });
    });
};