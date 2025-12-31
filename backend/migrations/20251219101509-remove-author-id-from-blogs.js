'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the foreign key constraint first
    await queryInterface.removeConstraint('blogs', 'blogs_author_id_fkey');
    
    // Remove the index on author_id
    await queryInterface.removeIndex('blogs', 'idx_blogs_author_id');
    
    // Finally, remove the column
    await queryInterface.removeColumn('blogs', 'author_id');
  },

  async down(queryInterface, Sequelize) {
    // Add the column back
    await queryInterface.addColumn('blogs', 'author_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });
    
    // Add the index back
    await queryInterface.addIndex('blogs', ['author_id'], {
      name: 'idx_blogs_author_id'
    });
  }
};