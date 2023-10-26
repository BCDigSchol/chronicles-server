'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NarrationOfPublication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrationOfPublication.belongsTo(models.narrations, {
        foreignKey: 'narrationId',
        as: 'narration'
      });
      NarrationOfPublication.belongsTo(models.publications, {
        foreignKey: 'publicationId',
        as: 'publication'
      });
    }
  }
  NarrationOfPublication.init({
    narrationId: {
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
    modelName: 'NarrationOfPublication',
  });
  return NarrationOfPublication;
};