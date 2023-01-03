import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const signSendToken = (
  user: { id?: number; role?: string },
  res: Response,
  statusCode: number = 200
) => {
  //Expires in 24h
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    expires: new Date(),
    // new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
    secure: true, //HTTPS
    httpOnly: true, //Client can't access cookie and modify it
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
