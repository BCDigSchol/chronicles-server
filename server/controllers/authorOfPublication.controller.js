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

  let { publishedName, page, size } = req.query;
  let where = {};
  let { limit, offset } = getPagination(page, size);
  if (publishedName) {
    where.publishedName = { [Op.like]: `%${publishedName}%` };
  }
  
  // if no page or size info is passed, return all items with minimal extra info
  if (page === undefined || size === undefined) {
    AuthorOfPublication.findAll({
      where
    })
      .then(data => {
        res.send(data);
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
      });
  }
  
};

// Find a single item with an id
exports.findOne = (req, res) => {
  const publicationId = req.params.publicationId;
  const authorId = req.params.authorId;
  AuthorOfPublication.findOne({
    where: { publicationId: publicationId, authorId: authorId },
    include: [{
      model: Author,
      as: 'author',
      attributes: ['surname', 'maidenName', 'otherNames', 'label', 'gender', 'nationality', 'specificNationality'],
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
      res.send({
        message: 'AuthorOfPublication was deleted successfully!'
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
      res.send({
        message: 'AuthorOfPublication was updated successfully.'
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
    });
};