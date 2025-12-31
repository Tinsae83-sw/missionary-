const { Event } = require('../models');

// Helper function to handle errors
const handleError = (res, error, status = 500) => {
  console.error('Error:', error);
  res.status(status).json({
    status: 'error',
    message: error.message || 'An error occurred'
  });
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      event_type,
      start_date,
      end_date,
      is_public,
      sortBy = 'start_date',
      order = 'ASC'
    } = req.query;

    const where = {};
    
    // Build WHERE clause
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    if (event_type) {
      where.event_type = event_type;
    }
    if (start_date) {
      where.start_date = { [Op.gte]: new Date(start_date) };
    }
    if (end_date) {
      where.end_date = { [Op.lte]: new Date(end_date) };
    }
    if (is_public !== undefined) {
      where.is_public = is_public === 'true';
    }

    const options = {
      where,
      order: [[sortBy, order.toUpperCase()]]
    };

    // Add pagination if limit is provided
    if (limit && limit !== 'all') {
      options.limit = parseInt(limit);
      options.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    const events = await Event.findAll(options);
    
    res.json({ 
      status: 'success', 
      data: events 
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }
    
    res.json({ 
      status: 'success', 
      data: event 
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'event_type', 'start_date', 'location'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `${field.replace('_', ' ')} is required`
        });
      }
    }

    // Validate event_type
    const validEventTypes = [
      'Worship Service',
      'Bible Study',
      'Prayer Meeting',
      'Fellowship',
      'Outreach',
      'Conference',
      'Other'
    ];
    
    if (!validEventTypes.includes(req.body.event_type)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid event type'
      });
    }

    // Validate dates
    if (req.body.start_date) {
      const startDate = new Date(req.body.start_date);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid start date'
        });
      }
      req.body.start_date = startDate;
    }

    if (req.body.end_date) {
      const endDate = new Date(req.body.end_date);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid end date'
        });
      }
      
      // Check if end date is after start date
      if (req.body.start_date && endDate <= new Date(req.body.start_date)) {
        return res.status(400).json({
          status: 'fail',
          message: 'End date must be after start date'
        });
      }
      req.body.end_date = endDate;
    }

    // Validate recurring pattern if event is recurring
    if (req.body.is_recurring && req.body.recurring_pattern) {
      const validPatterns = ['daily', 'weekly', 'biweekly', 'monthly'];
      if (!validPatterns.includes(req.body.recurring_pattern)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid recurring pattern'
        });
      }
    }

    // Create event
    const event = await Event.create(req.body);
    
    res.status(201).json({ 
      status: 'success', 
      data: event 
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    // Validate event exists
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }

    // Validate dates if provided
    if (req.body.start_date) {
      const startDate = new Date(req.body.start_date);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid start date'
        });
      }
      req.body.start_date = startDate;
    }

    if (req.body.end_date) {
      const endDate = new Date(req.body.end_date);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid end date'
        });
      }
      
      // Check if end date is after start date
      const startDate = req.body.start_date || event.start_date;
      if (endDate <= startDate) {
        return res.status(400).json({
          status: 'fail',
          message: 'End date must be after start date'
        });
      }
      req.body.end_date = endDate;
    }

    // Update event
    await event.update(req.body);
    
    // Get updated event
    const updatedEvent = await Event.findByPk(req.params.id);
    
    res.json({ 
      status: 'success', 
      data: updatedEvent 
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }

    await event.destroy();
    
    res.status(204).json({ 
      status: 'success', 
      data: null 
    });
  } catch (error) {
    handleError(res, error);
  }
};