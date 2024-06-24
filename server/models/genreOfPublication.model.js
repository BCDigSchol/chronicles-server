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
        as: 'genre',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Genres',
          key: 'id'
        }
      });
      GenreOfPublication.belongsTo(models.publications, {
        foreignKey: 'publicationId',
        as: 'publication',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Publications',
          key: 'id'
        }
      });
    }
  }
  GenreOfPublication.init({
    genreId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Genres',
        key: 'id'
      }
    },
    publicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Publications',
        key: 'id'
      }
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'GenreOfPublication',
    primaryKey: ['genreId', 'authorId']
  });
  return GenreOfPublication;
};