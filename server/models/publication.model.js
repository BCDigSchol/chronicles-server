'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Publication.hasMany(models.genres, { as: 'genres' });
      Publication.hasMany(models.narrations, { as: 'narrations' });
      Publication.belongsToMany(models.authors, {
        through: 'AuthorOfPublications',
        foreignKey: 'publicationId',
        as: 'authors'
      });
    }
  }
  Publication.init({
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    settingCategory: DataTypes.STRING,
    period: DataTypes.STRING,
    timeScale: DataTypes.STRING,
    settingName: DataTypes.STRING,
    protagonistCategory: DataTypes.STRING,
    protagonistGroupType: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};