const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // If no auth header, continue without authentication
    if (!authHeader) {
      console.log('No Authorization header provided - proceeding without authentication');
      req.user = { role: 'guest' }; // Set default guest user
      return next();
    }

    // Check if token is in the format 'Bearer <token>'
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid token format. Expected: Bearer <token>');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format. Use: Bearer <token>' 
      });
    }

    const token = parts[1];
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.user) {
        throw new Error('Invalid token payload');
      }
      req.user = decoded.user;
      console.log(`Authenticated user: ${JSON.stringify(decoded.user)}`);
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      let errorMessage = 'Invalid token';
      
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
      }
      
      return res.status(401).json({ 
        success: false,
        message: errorMessage,
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

module.exports = {
  authenticate,
  isAdmin
};
