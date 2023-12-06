'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Narration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Narration.belongsToMany(models.publications, {
        through: 'NarrationOfPublications',
        foreignKey: 'narrationId',
        as: 'publications'
      });
    }
  }
  Narration.init({
    narration: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Narration',
  });
  return Narration;
};