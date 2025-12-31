'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraint if it exists
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;
    `);

    // Then alter the column to allow null
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      ALTER COLUMN author_id DROP NOT NULL;
    `);

    // Recreate the foreign key constraint with ON DELETE SET NULL
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      ADD CONSTRAINT blogs_author_id_fkey 
      FOREIGN KEY (author_id) 
      REFERENCES users(id) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;
    `);

    // Set any NULL values to a default user ID (you'll need to provide a valid user ID)
    // This is just an example - replace '00000000-0000-0000-0000-000000000001' with a valid user ID
    await queryInterface.sequelize.query(`
      UPDATE blogs 
      SET author_id = '00000000-0000-0000-0000-000000000001' 
      WHERE author_id IS NULL;
    `);

    // Alter the column to NOT NULL
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      ALTER COLUMN author_id SET NOT NULL;
    `);

    // Recreate the foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs 
      ADD CONSTRAINT blogs_author_id_fkey 
      FOREIGN KEY (author_id) 
      REFERENCES users(id) 
      ON DELETE RESTRICT 
      ON UPDATE CASCADE;
    `);
  }
};
