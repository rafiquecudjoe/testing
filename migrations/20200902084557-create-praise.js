'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('praises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      team_id: {
        type: Sequelize.STRING,
      },
      team_domain: {
        type: Sequelize.STRING,
      },
      channel_id: {
        type: Sequelize.STRING,
      },
      channel_name: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      user_name: {
        type: Sequelize.STRING,
      },
      command: {
        type: Sequelize.STRING,
      },
      text: {
        type: Sequelize.STRING,
      },
      api_app_id: {
        type: Sequelize.STRING,
      },
      response_url: {
        type: Sequelize.STRING,
      },
      trigger_id: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('praises');
  },
};
