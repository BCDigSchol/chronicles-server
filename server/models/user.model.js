/**
 * @file Defines the model for users
 * @author David J. Thomas
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    // username
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    // email (unverified)
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    // role (e.g. User, Editor, Owner)
    role: DataTypes.STRING,
    // password encrypted with md5
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
