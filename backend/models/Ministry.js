const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ministry = sequelize.define('Ministry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 5000]
      }
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
        len: [0, 255]
      }
    },
    contact_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [0, 50]
      }
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    meeting_times: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meeting_location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon_class: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'ministries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_ministries_active',
        fields: ['is_active']
      },
      {
        name: 'idx_ministries_name_btree',
        fields: ['name']
      },
      {
        name: 'idx_ministries_order',
        fields: ['display_order']
      }
    ]
  });

  return Ministry;
};