'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GenreOfPublications', {
      genreId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      publicationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
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
    await queryInterface.dropTable('GenreOfPublications');
  }
};