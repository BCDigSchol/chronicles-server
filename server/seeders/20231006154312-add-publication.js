const importData = require('./import/data/publications.json');

module.exports = {
  async up (queryInterface, Sequelize) {

    for (const item of importData) {
      await queryInterface.bulkInsert('Publications', [
        {
          id: item.id,
          title: item.title,
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Publications');
  }
};
