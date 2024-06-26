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
  if (!req.body.surname) {
    errorMsgs.push('Must contain a \'surname\' field!');
  }
  if (!req.body.gender) {
    errorMsgs.push('Must contain an \'gender\' field!');
  }
  if (!req.body.nationality) {
    errorMsgs.push('Must contain a \'nationality\' field!');
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
    surname: req.body.surname,
    maidenName: req.body.maidenName || '',
    otherNames: req.body.otherNames || '',
    label: req.body.label || '',
    gender: req.body.gender,
    nationality: req.body.nationality,
    specificNationality: req.body.specificNationality || '',
    nonPerson: req.body.nonPerson || false,
    notes: req.body.notes || '',
  };
  // Save Inscription in the database
  Author.create(requestObj)
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

  let { surname, maidenName, otherNames, label, gender, nationality, specificNationality, page, size } = req.query;
  let where = {};
  let { limit, offset } = getPagination(page, size);
  if (surname) {
    where.surname = { [Op.like]: `%${surname}%` };
  }
  if (maidenName) {
    where.maidenName = { [Op.like]: `%${maidenName}%` };
  }
  if (otherNames) {
    where.otherNames = { [Op.like]: `%${otherNames}%` };
  }
  if (label) {
    where.label = { [Op.like]: `%${label}%` };
  }
  if (gender) {
    where.gender = { [Op.like]: `%${gender}%` };
  }
  if (nationality) {
    where.nationality = { [Op.like]: `%${nationality}%` };
  }
  if (specificNationality) {
    where.specificNationality = { [Op.like]: `%${specificNationality}%` };
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    Author.findAll({
      where
    })
      .then(data => {
        res.send(data);
      });
  }
  // otherwise return all data for specified items
  else {
    Author.findAndCountAll({
      where,
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
  const id = req.params.id;
  Author.findByPk(id, {
    include: [
      {
        model: Publication,
        as: 'publications',
        through: {
          attributes: ['publicationId', 'authorId', 'publishedHonorific', 'publishedName', 'notes']
        },
        include: [
          {
            model: Genre,
            as: 'genres'
          }, {
            model: Narration,
            as: 'narrations'
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
  const id = req.params.id;
  Author.destroy({
    where: { id: id }
  })
    .then(num => {
      res.send({
        message: 'Author was deleted successfully!'
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
  Author.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      res.send({
        message: 'Author was updated successfully.'
      });
    });
};

// Delete all item from the database.
exports.deleteAll = (req, res) => {
  Author.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Authors were deleted successfully!` });
    });
};