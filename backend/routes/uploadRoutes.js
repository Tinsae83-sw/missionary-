const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadDir;
    
    // Get the folder from the request body or use a default
    const folder = req.body.folder || 'uploads';
    
    // Create subdirectory based on the folder parameter
    uploadPath = path.join(uploadDir, folder);
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`Created directory: ${uploadPath}`);
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'img-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Handle file upload
const handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'No file uploaded' 
    });
  }

  // Get the folder from the request or use 'uploads' as default
  const folder = req.body.folder || 'uploads';
  
  // Create the file path
  const filePath = `/uploads/${folder}/${req.file.filename}`;

  res.status(200).json({
    success: true,
    url: filePath,
    filename: req.file.filename,
  });
};

// Generic file upload with folder support
router.post('/', (req, res, next) => {
  // Parse the folder from the request body
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
  }).single('file');
  
  // Handle the upload
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading file' 
      });
    }
    // Pass control to the next middleware
    next();
  });
}, handleUpload);

// Blog image upload
router.post('/blog', upload.single('file'), handleUpload);

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  next();
});

module.exports = router;