/**
 * @file Configures database connection for models, gathers
 * models together in one location, and calls their respective
 * association functions.
 * @author David J. Thomas
 */

const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  dialectOptions: {
    // comment out the line below for running on ubuntu
    // socketPath: '/tmp/mysql.sock' //  Specify the socket file path
  },
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// make models available for reference by controllers
db.users = require('./user.model.js')(sequelize, Sequelize);
db.publications = require('./publication.model.js')(sequelize, Sequelize);
db.authors = require('./author.model.js')(sequelize, Sequelize);
db.authorsOfPublications = require('./authorOfPublication.model.js')(sequelize, Sequelize);
db.genres = require('./genre.model.js')(sequelize, Sequelize);
db.genresOfPublications = require('./genreOfPublication.model.js')(sequelize, Sequelize);
db.narrations = require('./narration.model.js')(sequelize, Sequelize);
db.narrationsOfPublications = require('./narrationOfPublication.model.js')(sequelize, Sequelize);

// call association functions on all models and set fk constraints
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
