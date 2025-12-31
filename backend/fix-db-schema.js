const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with your connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

async function fixCoreValuesColumn() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to the database has been established successfully.');

    // First, check the current data type of core_values
    const [results] = await sequelize.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mission_vision' AND column_name = 'core_values';
    `);

    console.log('Current core_values column type:', results[0]?.data_type);

    // Create a temporary column to store the converted data
    await sequelize.query(`
      ALTER TABLE mission_vision 
      ADD COLUMN IF NOT EXISTS core_values_temp JSONB;
    `);

    // Convert the data to JSONB and store in the temporary column
    await sequelize.query(`
      UPDATE mission_vision 
      SET core_values_temp = 
        CASE 
          WHEN core_values IS NULL THEN NULL 
          WHEN core_values = '' THEN NULL
          WHEN jsonb_typeof(core_values::jsonb) IS NOT NULL THEN core_values::jsonb
          ELSE NULL
        END;
    `);

    // Drop the original column
    await sequelize.query(`
      ALTER TABLE mission_vision 
      DROP COLUMN IF EXISTS core_values;
    `);

    // Rename the temporary column
    await sequelize.query(`
      ALTER TABLE mission_vision 
      RENAME COLUMN core_values_temp TO core_values;
    `);

    console.log('✅ Successfully converted core_values to JSONB type');
    
  } catch (error) {
    console.error('❌ Error fixing core_values column:', error);
  } finally {
    await sequelize.close();
  }
}

fixCoreValuesColumn();
