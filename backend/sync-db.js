const { sequelize } = require('./config/database');
const db = require('./models');

async function syncDatabase() {
  try {
    console.log('🔌 Connecting to the database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    console.log('🔄 Syncing database...');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
