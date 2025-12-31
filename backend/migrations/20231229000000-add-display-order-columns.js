'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add display_order column to pastor_info table
    await queryInterface.addColumn('pastor_info', 'display_order', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      after: 'id'
    });

    // Add display_order column to core_values table
    await queryInterface.addColumn('core_values', 'display_order', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      after: 'id'
    });

    // Update existing records to have a default display order
    await queryInterface.sequelize.query(
      'UPDATE pastor_info SET display_order = id::text::int WHERE display_order IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE core_values SET display_order = id::text::int WHERE display_order IS NULL;'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pastor_info', 'display_order');
    await queryInterface.removeColumn('core_values', 'display_order');
  }
};
