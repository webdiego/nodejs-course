import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../prisma.client.js';
import { errorHandler } from '../utils/errorHandler.js';
import { Response, NextFunction } from 'express';
import { UserRequest } from '../types/index.js';

export const protect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(' ')[1];
      //verify token
      const decoded: string | JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      //Get user from the token

      if (typeof decoded === 'string') {
        return errorHandler(res, 401, 'Invalid token');
      }

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

export const restrictTo =
  (...roles: string[]) =>
  (req: UserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return errorHandler(
        res,
        403,
        'You do not have permission to perform this action'
      );
    }
    next();
  };
