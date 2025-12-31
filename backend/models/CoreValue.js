const { DataTypes, Model } = require('sequelize');

class CoreValue extends Model {}

module.exports = (sequelize) => {
  CoreValue.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'display_order'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon_class: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'CoreValue',
    tableName: 'core_values',
    timestamps: true,
    paranoid: false,
    underscored: true,
  });

  return CoreValue;
};
