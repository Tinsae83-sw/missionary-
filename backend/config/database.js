const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  process.exit(1);
}

console.log('🔌 Initializing Sequelize connection...');
console.log(`🔗 Connection string: ${process.env.DATABASE_URL.split('@')[1]}`);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// Run connection test on startup
if (process.env.NODE_ENV !== 'test') {
  testConnection().catch(console.error);
}

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await sequelize.close();
    console.log('\nDatabase connection closed through Sequelize');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database connection:', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// For backward compatibility with existing code that expects a pool
const pool = {
  async query(sql, params) {
    try {
      const [results, metadata] = await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.RAW
      });
      // For SELECT queries, return rows. For INSERT/UPDATE/DELETE, return the result metadata
      return { 
        rows: Array.isArray(results) ? results : [],
        rowCount: metadata ? metadata.rowCount : 0
      };
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  async execute(sql, params) {
    try {
      const [results, metadata] = await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.INSERT
      });
      return [results, metadata];
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  },
  
  async getConnection() {
    const transaction = await sequelize.transaction();
    return {
      async query(sql, params) {
        try {
          const [results, metadata] = await sequelize.query(sql, {
            replacements: params,
            type: sequelize.QueryTypes.RAW,
            transaction
          });
          return { 
            rows: Array.isArray(results) ? results : [],
            rowCount: metadata ? metadata.rowCount : 0
          };
        } catch (error) {
          console.error('Transaction query error:', error);
          throw error;
        }
      },
      
      async execute(sql, params) {
        try {
          const [results, metadata] = await sequelize.query(sql, {
            replacements: params,
            type: sequelize.QueryTypes.INSERT,
            transaction
          });
          return [results, metadata];
        } catch (error) {
          console.error('Transaction execute error:', error);
          throw error;
        }
      },
      
      beginTransaction: () => Promise.resolve(),
      commit: () => transaction.commit(),
      rollback: () => transaction.rollback(),
      release: () => {}
    };
  }
};

// Export Sequelize and DataTypes for model definitions
const db = {
  sequelize,
  Sequelize,
  DataTypes: Sequelize.DataTypes,
  ...pool
};

module.exports = db;