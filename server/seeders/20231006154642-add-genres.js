const importData = require('./import/data/genres.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      await queryInterface.bulkInsert('Genres', [
        {
          id: item.id,
          genre: item.genre,
          notes: item.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Genres');
  }
};