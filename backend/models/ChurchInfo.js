module.exports = (sequelize, DataTypes) => {
  const ChurchInfo = sequelize.define('ChurchInfo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zip_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'USA',
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  youtube_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  instagram_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  twitter_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  google_maps_embed: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  tableName: 'church_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

  return ChurchInfo;
};
