require('dotenv').config();
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const migrationFiles = [
    path.join(__dirname, '../migrations/20231219-enable-uuid-extension.js')
  ];

  try {
    for (const file of migrationFiles) {
      console.log(`Running migration: ${path.basename(file)}`);
      const migration = require(file);
      await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
      console.log(`✅ Migration completed: ${path.basename(file)}`);
    }
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
