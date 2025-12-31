const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/upload');
const handleBlogImageUpload = upload.handleBlogImageUpload;

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Blog management routes
// Upload middleware for blog posts
const blogUploadMiddleware = upload.createUploadMiddleware('blogs');

router.post('/', blogUploadMiddleware, (req, res, next) => {
  console.log(' Creating new blog post with data:', req.body);
  
  // If there's a file, update the featured image URL
  if (req.file) {
    req.body.featuredImage = `/uploads/blogs/${req.file.filename}`;
  }
  next();
}, blogController.createBlog);

router.put('/:id', blogUploadMiddleware, (req, res, next) => {
  console.log(` Updating blog post ${req.params.id} with data:`, req.body);
  
  // If there's a file, update the featured image URL
  if (req.files && req.files.featuredImage) {
    req.body.featuredImage = `/uploads/blogs/${req.files.featuredImage.name}`;
  }
  next();
}, blogController.updateBlog);

router.delete('/:id', blogController.deleteBlog);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(' Blog route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = router;