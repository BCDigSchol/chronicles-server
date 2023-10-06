const importData = require('./import/data/authors-of-publications.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      await queryInterface.bulkInsert('AuthorOfPublications', [
          {
            publicationId: item.publicationId,
            authorId: item.authorId,
            publishedHonorific: item.publishedHonorific,
            publishedName: item.publishedName,
            notes: item.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
      {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AuthorOfPublications');
  }
};