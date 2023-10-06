'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      surname: {
        type: Sequelize.STRING
      },
      maidenName: {
        type: Sequelize.STRING
      },
      otherNames: {
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      nationality: {
        type: Sequelize.STRING
      },
      nonPerson: {
        type: Sequelize.BOOLEAN
      },
      notes: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Authors');
  }
};