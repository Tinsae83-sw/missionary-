'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sermons', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      speaker: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bible_passage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sermon_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      transcript: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      thumbnail_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      audio_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      like_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      share_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      download_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      duration: {
        type: Sequelize.INTEGER, // in seconds
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('sermons', ['sermon_date']);
    await queryInterface.addIndex('sermons', ['is_published']);
    await queryInterface.addIndex('sermons', ['is_featured']);
    await queryInterface.addIndex('sermons', ['speaker']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sermons');
  }
};

// To run this migration:
// npx sequelize-cli db:migrate --migrations-path=./migrations
// Or using your npm script: npm run migrate
