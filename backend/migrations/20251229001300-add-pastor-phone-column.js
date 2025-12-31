'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pastor_info', 'pastor_phone', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pastor_info', 'pastor_phone');
  }
};
