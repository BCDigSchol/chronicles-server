const importData = require('./import/data/publications.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      try {
        await queryInterface.bulkInsert('Publications', [
          {
            id: item.id,
            title: item.title,
            date: item.date,
            subtitle: item.subtitle,
            settingCategory: item.settingCategory,
            period: item.period,
            timeScale: item.timeScale,
            settingName: item.settingName,
            protagonistCategory: item.protagonistCategory,
            protagonistGroupType: item.protagonistgroupType,
            notes: item.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {});
      }
      catch (error) {
        console.error(`Error inserting publication with id ${item.id}:`, error);
        throw new Error(`Failed to insert publication with id ${item.id}`);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Publications');
  }
};
