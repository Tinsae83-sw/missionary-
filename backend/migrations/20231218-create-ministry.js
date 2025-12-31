"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enable UUID extension if not already enabled
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create ministries table
    await queryInterface.createTable('ministries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      short_description: {
        type: Sequelize.STRING(500),
      },
      contact_email: {
        type: Sequelize.STRING(255),
      },
      contact_phone: {
        type: Sequelize.STRING(50),
      },
      contact_person: {
        type: Sequelize.STRING(255),
      },
      meeting_times: {
        type: Sequelize.TEXT,
      },
      meeting_location: {
        type: Sequelize.TEXT,
      },
      cover_image_url: {
        type: Sequelize.TEXT,
      },
      icon_class: {
        type: Sequelize.STRING(255),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create indexes
    await queryInterface.addIndex('ministries', ['is_active'], {
      name: 'idx_ministries_active'
    });

    await queryInterface.addIndex('ministries', ['name'], {
      name: 'idx_ministries_name_btree'
    });

    await queryInterface.addIndex('ministries', ['display_order'], {
      name: 'idx_ministries_order'
    });

    // For GIN index, we need to use raw query
    await queryInterface.sequelize.query(
      'CREATE INDEX idx_ministries_name_gin ON ministries USING gin(name gin_trgm_ops)'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ministries');
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
  },
};
