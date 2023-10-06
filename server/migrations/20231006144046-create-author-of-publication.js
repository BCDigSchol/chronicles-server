'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuthorOfPublications', {
      publicationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'NO ACTION'
      },
      authorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'NO ACTION'
      },
      publishedHonorific: {
        type: Sequelize.STRING
      },
      publishedName: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('AuthorOfPublications');
  }
};