const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MongoServerSelectionError } = require('mongodb'); // Import MongoServerSelectionError


exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === null  || token === 'null' ) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {

    console.log('error inside middleware', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired' });
    }
    if (error instanceof MongoServerSelectionError) {
      return res.status(503).json({ message: 'Service Unavailable' }); 
    }
    if(error.name === 'JsonWebTokenError'){
      return res.status(400).json( { message: 'Token malformed' })
    }

    return res.status(401).json({ message: 'Not authorized' });
  }
};
