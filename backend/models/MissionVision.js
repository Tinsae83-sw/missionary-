// backend/models/MissionVision.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database').sequelize;

class MissionVision extends Model {
  // Custom methods can be added here
  static async getMissionVision() {
    return await this.findOne({
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'mission',
        'vision',
        'core_values',
        'purpose',
        'created_at',
        'updated_at'
      ]
    });
  }

  static async updateMissionVision({ mission, vision, coreValues, purpose }) {
    const [instance, created] = await this.findOrCreate({
      where: {},
      defaults: { 
        mission, 
        vision, 
        core_values: coreValues, 
        purpose 
      },
      order: [['created_at', 'DESC']]
    });

    if (!created) {
      instance.mission = mission;
      instance.vision = vision;
      instance.core_values = coreValues;
      instance.purpose = purpose;
      await instance.save();
    }

    return instance;
  }
}

MissionVision.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  core_values: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'MissionVision',
  tableName: 'mission_vision',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MissionVision;