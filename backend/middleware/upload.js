const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
};

ensureUploadsDir();

// Process and save uploaded file
const processAndSaveFile = async (uploadedFile, folder, options = {}) => {
  try {
    const {
      width = 1200,
      height = 800,
      quality = 80,
      format = 'webp'
    } = options;

    const folderPath = path.join(UPLOADS_DIR, folder);
    
    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExt = path.extname(uploadedFile.name).toLowerCase();
    let filename, filepath;

    if (uploadedFile.mimetype === 'image/gif') {
      // Keep GIF as is for animations
      filename = `${folder}-${uniqueSuffix}${originalExt}`;
      filepath = path.join(folderPath, filename);
      
      // Move the temp file
      await uploadedFile.mv(filepath);
    } else {
      // Process other images with sharp
      const outputExt = format === 'jpeg' ? '.jpg' : `.${format}`;
      filename = `${folder}-${uniqueSuffix}${outputExt}`;
      filepath = path.join(folderPath, filename);

      // Read the temp file and process it
      await sharp(uploadedFile.tempFilePath)
        .resize({
          width,
          height,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFormat(format, { quality })
        .toFile(filepath);

      // Remove temp file
      fs.unlinkSync(uploadedFile.tempFilePath);
    }

    return {
      filename,
      filepath,
      url: `/uploads/${folder}/${filename}`,
      mimetype: uploadedFile.mimetype,
      size: fs.statSync(filepath).size
    };
  } catch (error) {
    console.error('Error processing file:', error);
    
    // Clean up temp file if exists
    if (uploadedFile.tempFilePath && fs.existsSync(uploadedFile.tempFilePath)) {
      fs.unlinkSync(uploadedFile.tempFilePath);
    }
    
    throw error;
  }
};

// Validate file
const validateFile = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
  }

  return true;
};

// Main upload middleware using express-fileupload
const createUploadMiddleware = (folder, options = {}) => {
  const {
    fieldName = 'file',
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize = 5 * 1024 * 1024,
    required = false
  } = options;

  return [
    // Ensure folder info is attached to request
    (req, res, next) => {
      req.uploadFolder = folder;
      next();
    },

    // Handle file upload
    async (req, res, next) => {
      try {
        // Check if files exist in request
        if (!req.files || Object.keys(req.files).length === 0) {
          if (required) {
            return res.status(400).json({
              success: false,
              message: `No file uploaded. Please upload a ${fieldName}.`
            });
          }
          return next();
        }

        // Get the file
        const uploadedFile = req.files[fieldName];
        
        if (!uploadedFile) {
          if (required) {
            return res.status(400).json({
              success: false,
              message: `No file uploaded in field: ${fieldName}`
            });
          }
          return next();
        }

        // Validate file
        validateFile(uploadedFile, allowedTypes, maxSize);

        // Process and save file
        const fileInfo = await processAndSaveFile(uploadedFile, folder, options);
        
        // Attach file info to request
        req.processedFile = fileInfo;
        
        console.log('✅ File uploaded and processed:', {
          filename: fileInfo.filename,
          size: fileInfo.size,
          folder: folder
        });

        next();
      } catch (error) {
        console.error('❌ Upload middleware error:', error);
        
        const status = error.message.includes('too large') ? 413 : 400;
        res.status(status).json({
          success: false,
          message: error.message
        });
      }
    }
  ];
};

// Specialized handlers
const handleBlogImageUpload = async (req, res, next) => {
  try {
    if (req.processedFile) {
      req.body.featured_image = req.processedFile.url;
      console.log('Blog image processed:', req.body.featured_image);
    }
    next();
  } catch (error) {
    console.error('Error in handleBlogImageUpload:', error);
    next(error);
  }
};

const handleMinistryImageUpload = async (req, res, next) => {
  try {
    if (req.processedFile) {
      req.body.cover_image_url = req.processedFile.url;
      console.log('Ministry image processed:', req.body.cover_image_url);
    }
    next();
  } catch (error) {
    console.error('Error in handleMinistryImageUpload:', error);
    next(error);
  }
};

// Delete uploaded file
const deleteUploadedFile = async (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
      console.log('Deleted file:', filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file URL
const getFileUrl = (folder, filename) => {
  if (!filename) return null;
  return `/uploads/${folder}/${filename}`;
};

// Process existing image
const processImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 1200,
    height = 800,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    await sharp(inputPath)
      .resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// Utility to get file from URL
const getFileFromUrl = (url) => {
  if (!url) return null;
  const filename = path.basename(url);
  const folder = url.split('/')[2]; // Assuming /uploads/folder/filename format
  return {
    filename,
    folder,
    path: path.join(UPLOADS_DIR, folder, filename)
  };
};

module.exports = {
  // Main middleware factory
  createUploadMiddleware,
  
  // Specialized handlers
  handleBlogImageUpload,
  handleMinistryImageUpload,
  
  // Utility functions
  deleteUploadedFile,
  getFileUrl,
  getFileFromUrl,
  processImage,
  processAndSaveFile,
  validateFile,
  
  // Constants
  UPLOADS_DIR
};