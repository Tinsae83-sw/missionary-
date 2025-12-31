const { sequelize } = require('./config/database');
const bcrypt = require('bcrypt');

async function fixNullPasswords() {
  try {
    // Hash a default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword123!', salt);
    
    // Update all NULL passwords to the hashed default
    const [updatedCount] = await sequelize.query(
      `UPDATE users SET password = :hashedPassword WHERE password IS NULL`,
      {
        replacements: { hashedPassword },
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log(`✅ Successfully updated ${updatedCount} user(s) with NULL passwords`);
    console.log('All users have been updated with the default password: defaultPassword123!');
    console.log('IMPORTANT: Please change these passwords after logging in!');
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  } finally {
    await sequelize.close();
  }
}

fixNullPasswords();
