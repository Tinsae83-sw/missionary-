'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, update any NULL names to a default value
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET name = 'Anonymous User' 
      WHERE name IS NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // No need to revert the update for NULL values
    return Promise.resolve();
  }
};
