module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        },
        len: {
          args: [1, 255],
          msg: 'Title must be between 1 and 255 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Event type is required'
        },
        isIn: {
          args: [['Worship Service', 'Bible Study', 'Prayer Meeting', 'Fellowship', 'Outreach', 'Conference', 'Other']],
          msg: 'Invalid event type'
        }
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Start date is required'
        },
        isDate: {
          msg: 'Start date must be a valid date'
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'End date must be a valid date'
        },
        isAfterStartDate(value) {
          if (value && value <= this.start_date) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Location is required'
        },
        len: {
          args: [1, 255],
          msg: 'Location must be between 1 and 255 characters'
        }
      }
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isImageUrlOrBase64(value) {
          if (!value) return;
          
          // Check if it's a valid URL
          try {
            new URL(value);
            return;
          } catch (e) {
            // Not a URL, check if it's a base64 image
            const base64Regex = /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/;
            if (!base64Regex.test(value)) {
              throw new Error('Image must be a valid URL or base64-encoded image');
            }
          }
        }
      }
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurring_pattern: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isIn: {
          args: [['daily', 'weekly', 'biweekly', 'monthly']],
          msg: 'Invalid recurring pattern'
        }
      }
    }
  }, {
    tableName: 'events',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['start_date']
      },
      {
        fields: ['event_type']
      },
      {
        fields: ['is_public']
      },
      {
        fields: ['is_recurring']
      }
    ]
  });

  return Event;
};