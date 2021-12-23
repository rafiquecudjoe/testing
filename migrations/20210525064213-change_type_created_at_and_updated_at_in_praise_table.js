'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('praises', 'updated_at', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn('praises', 'created_at', {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('praises', {
      updated_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
    });
  },
};
