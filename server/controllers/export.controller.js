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
exports.findAll = (req, res) => {
  let responseData = {
    publications: [],
    authors: [],
    genres: [],
    narrations: [],
    authorsofPublications: [],
    genresOfPublications: [],
    narrationsOfPublications: []
  };

  Publication.findAll()
    .then(publicationData => {
      Author.findAll()
        .then(authorData => {
          Genre.findAll()
            .then(genreData => {
              Narration.findAll()
                .then(narrationData => {
                  AuthorOfPublication.findAll()
                    .then(authorOfPublicationData => {
                      GenreOfPublication.findAll()
                        .then(genreOfPublicationData => {
                          NarrationOfPublication.findAll()
                            .then(narrationOfPublicationData => {
                              responseData = {
                                publications: publicationData,
                                authors: authorData,
                                genres: genreData,
                                narrations: narrationData,
                                authorsOfPublications: authorOfPublicationData,
                                genresOfPublications: genreOfPublicationData,
                                narrationsOfPublications: narrationOfPublicationData
                              };
                              res.send(responseData);
                            });
                        });
                    });
                });
            });
        });
    });

};