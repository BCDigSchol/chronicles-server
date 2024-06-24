const importData = require('./import/data/narrations.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      await queryInterface.bulkInsert('Narrations', [
        {
          id: item.id,
          narration: item.genre,
          notes: item.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Narrations');
  }
};