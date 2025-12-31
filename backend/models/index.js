const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const { sequelize, Sequelize, DataTypes } = require('../config/database');

const db = {
  sequelize,
  Sequelize,
  DataTypes
};

// Import all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .sort((a, b) => {
    // Load User model first to avoid circular dependencies
    if (a === 'User.js') return -1;
    if (b === 'User.js') return 1;
    return a.localeCompare(b);
  })
  .forEach(file => {
    try {
      const modelModule = require(path.join(__dirname, file));
      const modelName = file.replace('.js', '');
      
      // If the model is a function, initialize it with sequelize and DataTypes
      if (typeof modelModule === 'function') {
        try {
          // Many Sequelize models export a factory function (sequelize, DataTypes)
          const model = modelModule(sequelize, DataTypes);
          if (model && model.name) {
            db[model.name] = model;
          } else if (model) {
            db[modelName] = model;
          }
        } catch (err) {
          // If the module is an ES6 class (constructor) or otherwise cannot be
          // invoked as a factory function, fall back to attaching the export
          // directly so the app won't crash on require.
          if (err instanceof TypeError && /without 'new'/.test(err.message)) {
            db[modelName] = modelModule;
          } else {
            console.error(`Error initializing model ${file}:`, err);
          }
        }
      } else if (modelModule && typeof modelModule === 'object') {
        db[modelName] = modelModule;
      }
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

// Set up associations if any model has an associate method
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync all models with the database
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Error syncing database models:', error);
  }
};

// Make sure Ministry model is available with both naming conventions
db.Ministry = db.ministries || db.Ministry;
db.ministries = db.Ministry || db.ministries;

// Make sure ChurchHistory model is available with both naming conventions
db.ChurchHistory = db.ChurchHistory || db.churchhistory;
db.churchhistory = db.ChurchHistory || db.churchhistory;

module.exports = db;