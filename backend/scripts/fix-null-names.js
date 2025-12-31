const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function fixNullNames() {
  try {
    console.log('🔍 Checking for NULL names in users table...');
    
    // First, check if there are any NULL names
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM users WHERE name IS NULL`,
      { type: QueryTypes.SELECT }
    );
    
    if (results.count > 0) {
      console.log(`🔄 Found ${results.count} users with NULL names. Updating to default value...`);
      
      // Update NULL names to a default value
      await sequelize.query(
        `UPDATE users SET name = 'Anonymous User' WHERE name IS NULL`,
        { type: QueryTypes.UPDATE }
      );
      
      console.log('✅ Successfully updated NULL names to default value');
    } else {
      console.log('✅ No NULL names found in users table');
    }
    
    // Verify the update
    const [verify] = await sequelize.query(
      `SELECT COUNT(*) as count FROM users WHERE name IS NULL`,
      { type: QueryTypes.SELECT }
    );
    
    if (verify.count === 0) {
      console.log('✅ Verification passed: No NULL names remain in the users table');
    } else {
      console.log(`❌ Warning: ${verify.count} NULL names still exist after update`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing NULL names:', error);
    process.exit(1);
  }
}

fixNullNames();
