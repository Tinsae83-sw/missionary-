module.exports = (sequelize, DataTypes) => {
  const Belief = sequelize.define('Belief', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  icon_class: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'beliefs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

  return Belief;
};
