'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash a default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword123!', salt);
    
    // Update all NULL passwords to the hashed default
    await queryInterface.sequelize.query(
      `UPDATE users SET password = :hashedPassword WHERE password IS NULL`,
      {
        replacements: { hashedPassword },
        type: Sequelize.QueryTypes.UPDATE
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // No need to revert this as it's a data fix
    // If needed, you can set passwords back to NULL, but that would break the NOT NULL constraint
  }
};
