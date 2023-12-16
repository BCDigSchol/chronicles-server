const importData = require('./import/data/narrations-of-publications.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (const item of importData) {
      await queryInterface.bulkInsert('NarrationOfPublications', [
        {
          narrationId: item.narrationId,
          publicationId: item.publicationId,
          notes: item.notes || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('NarrationOfPublications');
  }
};
