'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GenreOfPublication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GenreOfPublication.belongsTo(models.genres, {
        foreignKey: 'genreId',
        as: 'genre'
      });
      GenreOfPublication.belongsTo(models.publications, {
        foreignKey: 'publicationId',
        as: 'publication'
      });
    }
  }
  GenreOfPublication.init({
    genreId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    publicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'GenreOfPublication',
  });
  return GenreOfPublication;
};