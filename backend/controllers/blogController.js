// controllers/blogController.js
const { Blog } = require('../models');
const { Op } = require('sequelize');

// Get all blogs with pagination and search
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const whereClause = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ]
    };

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      paranoid: !req.query.includeDeleted
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Error fetching blogs' });
  }
};

// Get single blog by ID or slug
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let blog;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      blog = await Blog.findByPk(id);
    } else {
      blog = await Blog.findOne({
        where: { slug: id }
      });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Error fetching blog post' });
  }
};

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, publish } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        errors: ['Title and content are required']
      });
    }

    // Set a default author ID for public submissions
    // In a production environment, you might want to use a system user ID here
    const defaultAuthorId = '00000000-0000-0000-0000-000000000000';

    // Clean and validate title
    const cleanTitle = title.trim();
    if (cleanTitle.length < 5 || cleanTitle.length > 255) {
      return res.status(400).json({
        success: false,
        errors: ['Title must be between 5 and 255 characters']
      });
    }

    // Generate slug from title
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/-+/g, '-')       // Replace multiple - with single -
      .substring(0, 100);        // Limit length

    // Prepare blog data with optional author_id
    const blogData = {
      title: cleanTitle,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featured_image: featured_image || null,
      published_at: publish ? new Date() : null
    };

    // Add author_id if user is authenticated
    if (req.user?.id) {
      blogData.author_id = req.user.id;
    }

    console.log('Creating blog with data:', blogData);
    
    const blog = await Blog.create(blogData);

    res.status(201).json({ 
      success: true, 
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    const errors = error.errors 
      ? error.errors.map(err => err.message) 
      : ['Error creating blog post'];
    res.status(400).json({ success: false, errors });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image, publish } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const updateData = {
      title,
      content,
      excerpt,
      featured_image
    };

    // Only update published_at if explicitly set to publish
    if (publish && !blog.published_at) {
      updateData.published_at = new Date();
    }

    await blog.update(updateData);

    res.json({ 
      success: true, 
      data: blog,
      message: 'Blog post updated successfully' 
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Error updating blog post' });
  }
};

// Delete a blog post (soft delete)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await blog.destroy();
    res.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Error deleting blog post' });
  }
};