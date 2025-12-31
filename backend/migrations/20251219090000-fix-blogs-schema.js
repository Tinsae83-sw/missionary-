// Create a new file: migrations/20231219090000-update-blogs-schema.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make author_id nullable
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs ALTER COLUMN author_id DROP NOT NULL;
    `);

    // Add published_at column
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    // Remove status column if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name='blogs' AND column_name='status'
        ) THEN
          ALTER TABLE blogs DROP COLUMN status;
        END IF;
      END $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs ALTER COLUMN author_id SET NOT NULL;
      ALTER TABLE blogs DROP COLUMN IF EXISTS published_at;
    `);
  }
};