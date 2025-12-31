'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Add the published_at column if it doesn't exist
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs 
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
      `, { transaction });

      // 2. Make author_id nullable
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN author_id DROP NOT NULL;
      `, { transaction });

      // 3. Add foreign key constraint with CASCADE on update and delete
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs
        DROP CONSTRAINT IF EXISTS blogs_author_id_fkey,
        ADD CONSTRAINT blogs_author_id_fkey
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL;
      `, { transaction });

      // 4. Add any missing indexes
      await queryInterface.addIndex('blogs', ['slug'], {
        name: 'idx_blogs_slug',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('blogs', ['author_id'], {
        name: 'idx_blogs_author_id',
        transaction
      });

      await queryInterface.addIndex('blogs', ['published_at'], {
        name: 'idx_blogs_published_at',
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove the foreign key constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs
        DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;
      `, { transaction });

      // Make author_id required again
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN author_id SET NOT NULL;
      `, { transaction });

      // Re-add the original foreign key constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs
        ADD CONSTRAINT blogs_author_id_fkey
        FOREIGN KEY (author_id)
        REFERENCES users(id);
      `, { transaction });

      // Remove the published_at column
      await queryInterface.sequelize.query(`
        ALTER TABLE blogs 
        DROP COLUMN IF EXISTS published_at;
      `, { transaction });

      // Remove indexes
      await queryInterface.removeIndex('blogs', 'idx_blogs_slug', { transaction });
      await queryInterface.removeIndex('blogs', 'idx_blogs_author_id', { transaction });
      await queryInterface.removeIndex('blogs', 'idx_blogs_published_at', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Migration rollback failed:', error);
      throw error;
    }
  }
};