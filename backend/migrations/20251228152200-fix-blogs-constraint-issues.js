'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Check if the column exists
      const [columnResults] = await queryInterface.sequelize.query(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'blogs' AND column_name = 'author_id'`,
        { transaction }
      );

      if (columnResults.length > 0) {
        // 2. Safely drop the constraint if it exists
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE "blogs" DROP CONSTRAINT IF EXISTS "blogs_author_id_fkey"`,
            { transaction }
          );
          console.log('Dropped blogs_author_id_fkey constraint if it existed');
        } catch (error) {
          console.log('No blogs_author_id_fkey constraint to drop, continuing...');
        }

        // 4. Check if we need to remove the column (based on later migrations)
        const [migrationResults] = await queryInterface.sequelize.query(
          `SELECT 1 FROM "SequelizeMeta" 
           WHERE "name" = '20251219101509-remove-author-id-from-blogs.js'`,
          { transaction }
        );

        if (migrationResults.length === 0) {
          // If the remove-author-id migration hasn't run yet, we'll just update the column to be nullable
          await queryInterface.changeColumn('blogs', 'author_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'users',
              key: 'id'
            }
          }, { transaction });
        } else {
          // If the migration exists, we should remove the column
          await queryInterface.removeColumn('blogs', 'author_id', { transaction });
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error in migration:', error);
      throw error;
    }
  },

  async down() {
    // This is a one-way migration
    return Promise.resolve();
  }
};
