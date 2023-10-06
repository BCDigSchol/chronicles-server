'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Author.belongsToMany(models.publications, {
        through: 'AuthorOfPublications',
        foreignKey: 'authorId',
        as: 'publications'
      });
    }
  }
  Author.init({
    surname: DataTypes.STRING,
    maidenName: DataTypes.STRING,
    otherNames: DataTypes.STRING,
    label: DataTypes.STRING,
    gender: DataTypes.STRING,
    nationality: DataTypes.STRING,
    nonPerson: DataTypes.BOOLEAN,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Author',
  });
  return Author;
};