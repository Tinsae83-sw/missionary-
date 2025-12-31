'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if the column exists and is not already JSONB
    const tableInfo = await queryInterface.describeTable('mission_vision');
    
    if (tableInfo.core_values) {
      // Convert the column to JSONB using a raw SQL query
      await queryInterface.sequelize.query(
        'ALTER TABLE mission_vision ALTER COLUMN core_values TYPE JSONB USING core_values::jsonb',
        { raw: true }
      );
    } else {
      // If column doesn't exist, create it as JSONB
      await queryInterface.addColumn('mission_vision', 'core_values', {
        type: Sequelize.JSONB,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column back to TEXT type if needed
    await queryInterface.sequelize.query(
      'ALTER TABLE mission_vision ALTER COLUMN core_values TYPE TEXT USING core_values::text',
      { raw: true }
    );
  }
};
