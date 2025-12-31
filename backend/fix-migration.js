const { sequelize } = require('./config/database');

async function fixMigration() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Mark the migration as complete
    await sequelize.query(
      `INSERT INTO "SequelizeMeta" ("name") VALUES ('20231219130000-add-deleted-at-to-blogs.js')`
    );
    
    console.log('✅ Migration marked as complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixMigration();
