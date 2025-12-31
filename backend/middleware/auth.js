const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Protect routes middleware
const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const User = require('../models/User');
    const currentUser = await User.findByPk(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or session expired. Please log in again.'
    });
  }
};

// Restrict to certain roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // For now, we'll just check if the user has a token
    // In a real app, you would check the user's role from the token or database
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     status: 'error',
    //     message: 'You do not have permission to perform this action.'
    //   });
    // }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
