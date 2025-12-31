const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  // Define the model
  const ChurchHistory = sequelize.define('ChurchHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    tableName: 'church_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  // Add class methods
  ChurchHistory.associate = function(models) {
    // Define associations here if needed
  };

  // Add instance methods
  ChurchHistory.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Add static methods
  ChurchHistory.getAll = async function() {
    try {
      const items = await this.findAll({
        order: [
          ['year', 'ASC'],
          ['display_order', 'ASC']
        ]
      });
      return items.map(item => item.get({ plain: true }));
    } catch (error) {
      console.error('Error in ChurchHistory.getAll:', error);
      throw error;
    }
  };

  // Find by ID
  ChurchHistory.getById = async function(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      const item = await this.findByPk(id);
      return item ? item.get({ plain: true }) : null;
    } catch (error) {
      console.error('Error in ChurchHistory.getById:', error);
      throw error;
    }
  };

  // Create new history item
  ChurchHistory.createItem = async function(data) {
    try {
      const historyItem = await this.create({
        ...data,
        display_order: data.display_order || 0,
        image_url: data.image_url || null,
        year: parseInt(data.year) || new Date().getFullYear()
      });
      return historyItem.get({ plain: true });
    } catch (error) {
      console.error('Error in ChurchHistory.createItem:', {
        error: error.message,
        stack: error.stack,
        data: data
      });
      throw error;
    }
  };

  // Update history item
  ChurchHistory.updateItem = async function(id, data) {
    try {
      // Make sure we don't try to update the ID
      delete data.id;
      
      const [updated] = await this.update(data, {
        where: { id },
        returning: true
      });
      
      if (!updated) {
        throw new Error('No records were updated');
      }
      
      const updatedItem = await this.findByPk(id);
      return updatedItem ? updatedItem.get({ plain: true }) : null;
    } catch (error) {
      console.error('Error in ChurchHistory.updateItem:', {
        error: error.message,
        stack: error.stack,
        id,
        data
      });
      throw error;
    }
  };

  // Delete history item
  ChurchHistory.deleteItem = async function(id) {
    try {
      const deleted = await this.destroy({
        where: { id }
      });
      
      if (!deleted) {
        throw new Error('No records were deleted');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in ChurchHistory.deleteItem:', {
        error: error.message,
        stack: error.stack,
        id
      });
      throw error;
    }
  };

  return ChurchHistory;
};
