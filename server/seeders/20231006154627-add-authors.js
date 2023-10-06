const importData = require('./import/data/authors.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      await queryInterface.bulkInsert('Authors', [
          {
            id: item.id,
            surname: item.surname,
            maidenName: item.maidenName,
            otherNames: item.otherNames,
            label: item.label,
            gender: item.gender,
            nationality: item.nationality,
            nonPerson: item.nonPerson,
            notes: item.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors');
  }
};