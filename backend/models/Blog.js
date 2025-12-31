'use strict';
const { Model } = require('sequelize');
const path = require('path');
const fs = require('fs');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      // Define the association with User model
      Blog.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
    }

    // Get public URL for the featured image
    getFeaturedImageUrl() {
      if (!this.featured_image) return null;
      // In production, you might want to return a CDN URL here
      return this.featured_image.startsWith('http') 
        ? this.featured_image 
        : `${process.env.APP_URL || 'http://localhost:3000'}${this.featured_image}`;
    }

    // Handle file upload
    static async uploadFile(file) {
      const uploadDir = path.join(__dirname, '../../public/uploads/blogs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name).toLowerCase();
      const filename = `blog-${uniqueSuffix}${ext}`;
      const filepath = path.join(uploadDir, filename);

      await file.mv(filepath);
      return `/uploads/blogs/${filename}`;
    }
  }

  Blog.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
        len: {
          args: [5, 255],
          msg: 'Title must be between 5 and 255 characters'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Slug is required' },
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: 'Slug can only contain letters, numbers, and hyphens'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Content is required' },
        min: {
          args: 50,
          msg: 'Content must be at least 50 characters long'
        }
      }
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return this.getDataValue('excerpt') || 
               (this.content ? this.content.substring(0, 200) + '...' : '');
      }
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    authorId: {
      type: DataTypes.UUID,
      field: 'author_id', // This tells Sequelize to use 'author_id' in the database
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Blog',
    paranoid: true,  // Enable soft deletes
    deletedAt: 'deleted_at',  // Use the deleted_at column for soft deletes
    tableName: 'blogs',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: (blog) => {
        // Generate slug from title if not provided
        if (blog.title && !blog.slug) {
          blog.slug = blog.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .substring(0, 100);
        }
      }
    }
  });

  return Blog;
};