'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Check if the deleted_at column exists
      const [deletedAtColumn] = await queryInterface.sequelize.query(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'blogs' AND column_name = 'deleted_at'`,
        { transaction }
      );

      // 2. Check if the author_id column exists
      const [authorIdColumn] = await queryInterface.sequelize.query(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'blogs' AND column_name = 'author_id'`,
        { transaction }
      );

      // 3. Check if the author_id foreign key constraint exists
      const [constraintResults] = await queryInterface.sequelize.query(
        `SELECT 1 FROM information_schema.table_constraints 
         WHERE constraint_name = 'blogs_author_id_fkey' 
         AND table_name = 'blogs'`,
        { transaction }
      );

      // 4. If the constraint exists, remove it
      if (constraintResults.length > 0) {
        await queryInterface.removeConstraint(
          'blogs', 
          'blogs_author_id_fkey',
          { transaction }
        );
      }

      // 5. If author_id column exists, make it nullable
      if (authorIdColumn.length > 0) {
        await queryInterface.changeColumn('blogs', 'author_id', {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          }
        }, { transaction });
      }

      await transaction.commit();
      
      // 6. Mark all blog-related migrations as executed
      await queryInterface.sequelize.query(
        `INSERT INTO "SequelizeMeta" (name) VALUES 
          ('20231219130000-add-deleted-at-to-blogs.js'),
          ('20251219090000-fix-blogs-schema.js'),
          ('20251219101209-update-blogs-allow-null-author-id.js'),
          ('20251219101509-remove-author-id-from-blogs.js'),
          ('20251219102041-fix-migration-issues.js'),
          ('20251226000000-update-blogs-author-id-nullable.js'),
          ('20251226000001-fix-blogs-author-id-nullable.js')
        ON CONFLICT (name) DO NOTHING`
      );
      
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
