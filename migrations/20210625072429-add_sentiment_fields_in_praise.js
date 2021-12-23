module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('praises', 'score', {
        type: Sequelize.FLOAT,
      }),
      queryInterface.addColumn('praises', 'magnitude', {
        type: Sequelize.FLOAT,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('praises', 'score'),
      queryInterface.removeColumn('praises', 'magnitude'),
    ]);
  },
};
