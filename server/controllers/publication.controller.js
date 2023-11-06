const db = require('../models');
const Op = db.Sequelize.Op;

const Publication = db.publications;
const Author = db.authors;
const Genre = db.genres;
const Narration = db.narrations;

// Create and Save a new Inscription
exports.create = (req, res) => {
  var errorMsgs = [];
  // Validate request
  if (!req.body.title) {
    errorMsgs.push('Must contain a \'title\' field!');
  }
  if (!req.body.settingCategory) {
    errorMsgs.push('Must contain an \'settingCategory\' field!');
  }
  if (!req.body.period) {
    errorMsgs.push('Must contain a \'period\' field!');
  }
  if (!req.body.timeScale) {
    errorMsgs.push('Must contain a \'timeScale\' field!');
  }
  if (!req.body.protagonistCategory) {
    errorMsgs.push('Must contain a \'protagonistCategory\' field!');
  }
  if (!req.body.protagonistGroupType) {
    errorMsgs.push('Must contain a \'protagonistGroupType\' field!');
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
    title: req.body.title,
    subtitle: req.body.subtitle,
    settingName: req.body.settingName,
    settingCategory: req.body.settingCategory,
    period: req.body.period,
    timeScale: req.body.timeScale,
    protagonistCategory: req.body.protagonistCategory,
    protagonistGroupType: req.body.protagonistGroupType,
    notes: req.body.notes || '',
  };
  // Save Inscription in the database
  Publication.create(requestObj)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Publication.'
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

  let { title, subtitle, setting, settingCategory, period, scale, protagonist, group, page, size, genre, narration, author } = req.query;
  let where = {};
  let genreWhere = {};
  let narrationWhere = {};
  let authorWhere = {};
  let { limit, offset } = getPagination(page, size);
  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (subtitle) {
    where.subtitle = { [Op.like]: `%${subtitle}%` };
  }
  if (setting) {
    where.settingName = { [Op.like]: `%${setting}%` };
  }
  if (settingCategory) {
    where.settingCategory = { [Op.like]: `%${settingCategory}%` };
  }
  if (period) {
    where.period = { [Op.like]: `%${period}%` };
  }
  if (scale) {
    where.timeScale = { [Op.like]: `%${scale}%` };
  }
  if (protagonist) {
    where.protagonistCategory = { [Op.like]: `%${protagonist}%` };
  }
  if (group) {
    where.protagonistGroupType = { [Op.like]: `%${group}%` };
  }
  if (genre) {
    genreWhere.genre = { [Op.like]: `%${genre}%` };
  }
  if (narration) {
    narrationWhere.narration = { [Op.like]: `%${narration}%` };
  }
  if (author) {
    authorWhere.surname = { [Op.substring]: `%${author}`};
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    Publication.findAll({
      where
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving publications.'
        });
      });
  }
  // otherwise return all data for specified items
  else {
    Publication.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      include: [{
        model: Genre,
        as: 'genres',
        where: genreWhere,
        required: genreWhere.genre != undefined  
      }, {
        model: Narration,
        as: 'narrations',
        where: narrationWhere,
        required: narrationWhere.narration != undefined
      }, {
        model: Author,
        as: 'authors',
        where: authorWhere,
        required: authorWhere.surname != undefined
      }]
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving publications.'
      });
    });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Publication.findByPk(id, {
    include: [
      {
        model: Genre,
        as: 'genres',
      }, {
        model: Narration,
        as: 'narrations',
      }, 
      {
        model: Author,
        as: 'authors',
        through: {
          attributes: ['publicationId', 'authorId', 'publishedHonorific', 'publishedName', 'notes']
        }
      },
    ],
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Publication with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Publication with id=' + id
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Publication.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Publication was deleted successfully!'
        });
      } else {
        res.send({
          message: `Cannot delete Publication with id=${id}. Maybe Publication was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete Publication with id=' + id
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
  Publication.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Publication was updated successfully.'
        });
      } else {
        res.send({
          message: `Cannot update Publication with id=${id}. Maybe Publication was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating Publication with id=' + id
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  Publication.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Publications were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all publications.'
      });
    });
};