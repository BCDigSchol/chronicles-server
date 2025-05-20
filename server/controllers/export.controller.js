/**
 * @file Controller for exporting database data for backup
 * @author David J. Thomas
 */

const db = require('../models');
const Op = db.Sequelize.Op;

const Publication = db.publications;
const Author = db.authors;
const Genre = db.genres;
const Narration = db.narrations;
const AuthorOfPublication = db.authorsOfPublications;
const GenreOfPublication = db.genresOfPublications;
const NarrationOfPublication = db.narrationsOfPublications;


// retrieve all items from the database.
exports.findAll = async (req, res) => {
  const tableModelMap = {
    publications: Publication,
    authors: Author,
    genres: Genre,
    narrations: Narration,
    authorsOfPublications: AuthorOfPublication,
    genresOfPublications: GenreOfPublication,
    narrationsOfPublications: NarrationOfPublication
  };
  let { format, table } = req.query;
  if (!format) {
    format = 'json';
  }
  if (!table) {
    res.setHeader('Content-Type', 'text/json');
    res.send({
      message: 'No table specified. Please specify a table to export.',
      tables: [
        'publications',
        'authors',
        'genres',
        'narrations',
        'authorsOfPublications',
        'genresOfPublications',
        'narrationsOfPublications'
      ]
    });
  }
  if (!['json', 'csv'].includes(format)) {
    res.setHeader('Content-Type', 'text/json');
    res.send({
      message: 'Invalid format specified. Please specify a valid format.',
      formats: ['json', 'csv']
    });
  }
  const model = tableModelMap[table];
  if (!model) {
    res.setHeader('Content-Type', 'text/json');
    res.send({
      message: 'Invalid table specified. Please specify a valid table.',
      tables: [
        'publications',
        'authors',
        'genres',
        'narrations',
        'authorsOfPublications',
        'genresOfPublications',
        'narrationsOfPublications'
      ]
    });
  }
  let records;
  try {
    records = await model.findAll();
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving data.'
    });
    return;
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'text/json');
    res.send(records);
    return;
  }
  // Convert records to CSV format
  const csvData = [];
  const headers = Object.keys(records[0].dataValues);
  csvData.push(headers.join(','));
  records.forEach(record => {
    const values = Object.values(record.dataValues);
    csvData.push(values.join(','));
  });
  const csvString = csvData.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${table}.csv`);
  res.send(csvString);
  return;
};