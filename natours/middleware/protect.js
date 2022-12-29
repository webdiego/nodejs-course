const jwt = require('jsonwebtoken');
const prisma = require('../prisma.client');
const errorHandler = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(' ')[1];
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get user from the token
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      //Check if user still exists
      if (!currentUser) {
        errorHandler(res, 401, 'User not exist');
      }
      //Grant access to protected route, pass user to the next middleware function
      req.user = currentUser;
      next();
    } catch (err) {
      errorHandler(res, 401, 'Not authorized!', err);
      // res.status(401).json({ status: 'fail', message: 'Not authorized' });
      next(err);
    }
  }

  if (!token) {
    errorHandler(res, 401, 'Your are not login!');
  }
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorHandler(
        res,
        403,
        'You do not have permission to perform this action'
      );
    }
    next();
  };

module.exports = {
  protect,
  restrictTo,
};
