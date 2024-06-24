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
        as: 'narration',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Narrations',
          key: 'id'
        }
      });
      NarrationOfPublication.belongsTo(models.publications, {
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
  NarrationOfPublication.init({
    narrationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Narrations',
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
    modelName: 'NarrationOfPublication',
    primaryKey: ['narrationId', 'authorId']
  });
  return NarrationOfPublication;
};