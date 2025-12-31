const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sermon extends Model {}
  
  Sermon.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
        len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters' }
      }
    },
    speaker: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Speaker is required' },
        len: { args: [1, 255], msg: 'Speaker name must be between 1 and 255 characters' }
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    bible_passage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: { args: [0, 100], msg: 'Bible passage cannot exceed 100 characters' }
      }
    },
    sermon_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Sermon date is required' },
        isDate: { msg: 'Invalid date format. Use YYYY-MM-DD' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Thumbnail URL must be a valid URL' },
        len: { args: [0, 2000], msg: 'Thumbnail URL cannot exceed 2000 characters' }
      }
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'View count must be an integer' },
        min: { args: [0], msg: 'View count cannot be negative' }
      }
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'Like count must be an integer' },
        min: { args: [0], msg: 'Like count cannot be negative' }
      }
    },
    share_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'Share count must be an integer' },
        min: { args: [0], msg: 'Share count cannot be negative' }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    modelName: 'Sermon',
    tableName: 'sermons',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    indexes: [
      {
        name: 'idx_sermon_date',
        fields: ['sermon_date']
      },
      {
        name: 'idx_sermon_published',
        fields: ['is_published']
      },
      {
        name: 'idx_sermon_speaker',
        fields: ['speaker']
      },
      {
        name: 'idx_sermon_featured',
        fields: ['is_featured']
      },
      {
        name: 'idx_sermon_slug',
        fields: ['slug'],
        unique: true
      }
    ],
    hooks: {
      beforeCreate: (sermon) => {
        // Ensure the slug is set before creating
        if (!sermon.slug) {
          sermon.slug = sermon.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      },
      beforeUpdate: (sermon) => {
        // Update the slug if the title has changed
        if (sermon.changed('title') && !sermon.changed('slug')) {
          sermon.slug = sermon.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      }
    }
  });

  return Sermon;
};
