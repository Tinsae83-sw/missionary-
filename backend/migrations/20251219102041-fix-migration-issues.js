// In 20251219102041-fix-migration-issues.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column exists before trying to add it
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'deleted_at'
    `);

    if (results.length === 0) {
      await queryInterface.addColumn('blogs', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    // Mark the problematic migration as done
    const [migration] = await queryInterface.sequelize.query(
      `SELECT * FROM "SequelizeMeta" WHERE "name" = '20231219130000-add-deleted-at-to-blogs.js'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!migration || migration.length === 0) {
      await queryInterface.sequelize.query(
        `INSERT INTO "SequelizeMeta" ("name") VALUES ('20231219130000-add-deleted-at-to-blogs.js')`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // No need to do anything in the down migration
  }
};