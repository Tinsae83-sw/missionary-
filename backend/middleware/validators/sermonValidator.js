const { body, param, query } = require('express-validator');

// Common validation rules for sermon creation and update
const sermonValidationRules = [
    // Title validation
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
    
    // Speaker validation
    body('speaker')
        .trim()
        .notEmpty().withMessage('Speaker is required')
        .isLength({ min: 1, max: 255 }).withMessage('Speaker name must be between 1 and 255 characters'),
    
    // Bible passage validation
    body('bible_passage')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 }).withMessage('Bible passage cannot be longer than 100 characters'),
    
    // Sermon date validation
    body('sermon_date')
        .notEmpty().withMessage('Sermon date is required')
        .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
        .toDate()
        .custom((value) => {
            const date = new Date(value);
            
            // Allow dates from 1900 to 1 year in the future
            const minDate = new Date('1900-01-01');
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            
            if (date < minDate || date > maxDate) {
                throw new Error(`Date must be between 1900-01-01 and ${maxDate.toISOString().split('T')[0]}`);
            }
            return true;
        }),
    
    // Description validation
    body('description')
        .optional({ checkFalsy: true })
        .isString().withMessage('Description must be a string'),
    
    // Transcript validation
    body('transcript')
        .optional({ checkFalsy: true })
        .isString().withMessage('Transcript must be a string'),
    
    // Thumbnail URL validation
    body('thumbnail_url')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Thumbnail must be a valid URL')
        .isLength({ max: 2000 }).withMessage('Thumbnail URL cannot be longer than 2000 characters'),
    
    // Status validations
    body('is_published')
        .optional()
        .isBoolean().withMessage('Published status must be a boolean value')
        .toBoolean(),
    
    body('is_featured')
        .optional()
        .isBoolean().withMessage('Featured status must be a boolean value')
        .toBoolean(),
    
    // Count validations
    body('view_count')
        .optional()
        .isInt({ min: 0 }).withMessage('View count must be a non-negative integer')
        .toInt(),
    
    body('like_count')
        .optional()
        .isInt({ min: 0 }).withMessage('Like count must be a non-negative integer')
        .toInt(),
    
    body('share_count')
        .optional()
        .isInt({ min: 0 }).withMessage('Share count must be a non-negative integer')
        .toInt(),
    
    // Notes validation
    body('sermon_notes')
        .optional({ checkFalsy: true })
        .isString().withMessage('Sermon notes must be a string')
];

// Validation rules for getting sermons with filters
const getSermonsValidationRules = [
    // Pagination
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt()
        .default(1),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt()
        .default(10),
    
    // Search and filters
    query('search')
        .optional()
        .trim()
        .isString().withMessage('Search term must be a string'),
    
    query('speaker')
        .optional()
        .trim()
        .isString().withMessage('Speaker filter must be a string'),
    
    query('bible_passage')
        .optional()
        .trim()
        .isString().withMessage('Bible passage filter must be a string'),
    
    // Date range filters
    query('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((value) => {
            const date = new Date(value);
            const minDate = new Date('1900-01-01');
            if (date < minDate) {
                throw new Error(`Start date must be after ${minDate.toISOString().split('T')[0]}`);
            }
            return true;
        }),
    
    query('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((value, { req }) => {
            const date = new Date(value);
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            
            if (date > maxDate) {
                throw new Error(`End date must be before ${maxDate.toISOString().split('T')[0]}`);
            }
            
            if (req.query.startDate && date < new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            
            return true;
        }),
    
    // Status filters
    query('is_published')
        .optional()
        .isIn(['true', 'false']).withMessage('Published must be either true or false')
        .toBoolean(),
    
    query('is_featured')
        .optional()
        .isIn(['true', 'false']).withMessage('Featured must be either true or false')
        .toBoolean(),
    
    // Sorting
    query('sortBy')
        .optional()
        .isIn(['sermon_date', 'title', 'speaker', 'view_count', 'like_count', 'created_at'])
        .withMessage('Invalid sort field'),
    
    query('order')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Order must be either asc or desc')
        .default('desc')
];

// Validation rules for ID parameters
const idValidationRules = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isUUID().withMessage('Invalid ID format')
        .customSanitizer(value => value.trim())
];

// Validation rules for download count increment
const downloadCountValidationRules = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isUUID().withMessage('Invalid ID format')
        .customSanitizer(value => value.trim())
];

// Validation rules for like/unlike
const likeValidationRules = [
    param('id')
        .notEmpty().withMessage('Sermon ID is required')
        .isUUID().withMessage('Invalid sermon ID format')
        .customSanitizer(value => value.trim()),
    
    body('action')
        .isIn(['like', 'unlike']).withMessage('Action must be either "like" or "unlike"')
];

// Validation rules for sharing
const shareValidationRules = [
    param('id')
        .notEmpty().withMessage('Sermon ID is required')
        .isUUID().withMessage('Invalid sermon ID format')
        .customSanitizer(value => value.trim()),
    
    body('platform')
        .optional()
        .isIn(['facebook', 'twitter', 'whatsapp', 'email', 'link'])
        .withMessage('Invalid platform')
];

module.exports = {
    sermonValidationRules,
    getSermonsValidationRules,
    idValidationRules,
    downloadCountValidationRules,
    likeValidationRules,
    shareValidationRules
};
