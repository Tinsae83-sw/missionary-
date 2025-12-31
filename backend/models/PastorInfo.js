const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database').sequelize;

class PastorInfo extends Model {}

PastorInfo.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order'
  },
  pastor_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'pastor_name'
  },
  pastor_title: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'pastor_title'
  },
  pastor_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'pastor_message'
  },
  pastor_bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'pastor_bio'
  },
  pastor_photo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'pastor_photo_url'
  },
  pastor_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    },
    field: 'pastor_email'
  },
  facebook_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'facebook_url'
  },
  twitter_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'twitter_url'
  },
  instagram_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'instagram_url'
  }
}, {
  sequelize,
  modelName: 'PastorInfo',
  tableName: 'pastor_info',
  timestamps: true,
  underscored: true,
  paranoid: true
});

module.exports = PastorInfo;
