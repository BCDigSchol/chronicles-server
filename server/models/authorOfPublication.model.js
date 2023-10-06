'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthorOfPublication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuthorOfPublication.belongsTo(models.authors, {
        foreignKey: 'authorId',
        as: 'author'
      });
      AuthorOfPublication.belongsTo(models.publications, {
        foreignKey: 'publicationId',
        as: 'publication'
      });
    }
  }
  AuthorOfPublication.init({
    publicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    publishedHonorific: DataTypes.STRING,
    publishedName: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'AuthorOfPublication',
  });
  return AuthorOfPublication;
};