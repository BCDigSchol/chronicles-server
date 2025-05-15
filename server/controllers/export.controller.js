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
  let { format } = req.query;
  if (!format) {
    format = 'json';
  }
  try {
    const [
      publicationData,
      authorData,
      genreData,
      narrationData,
      authorOfPublicationData,
      genreOfPublicationData,
      narrationOfPublicationData
    ] = await Promise.all([
      Publication.findAll(),
      Author.findAll(),
      Genre.findAll(),
      Narration.findAll(),
      AuthorOfPublication.findAll(),
      GenreOfPublication.findAll(),
      NarrationOfPublication.findAll()
    ]);

    const responseData = {
      publications: publicationData,
      authors: authorData,
      genres: genreData,
      narrations: narrationData,
      authorsOfPublications: authorOfPublicationData,
      genresOfPublications: genreOfPublicationData,
      narrationsOfPublications: narrationOfPublicationData
    };
    if (format === 'json') {
      res.send(responseData);
    }
    if (format === 'csv') {
      const csvData = [];
      const headers = [
        'Publication ID',
        'Publication Title',
        'Publication Type',
        'Publication Date',
        'Author ID',
        'Author Name',
        'Genre ID',
        'Genre Name',
        'Narration ID',
        'Narration Name'
      ];
      csvData.push(headers.join(','));

      publicationData.forEach((publication) => {
        const row = [
          publication.id,
          publication.title,
          publication.type,
          publication.date,
          publication.authorId,
          publication.authorName,
          publication.genreId,
          publication.genreName,
          publication.narrationId,
          publication.narrationName
        ];
        csvData.push(row.join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.send(csvData.join('\n'));
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving data.'
    });
  }
};