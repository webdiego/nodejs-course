import { Response } from 'express';

export const errorHandler = function (
  res: Response,
  status: number,
  message: String,
  err?: String
) {
  return res.status(status).json({ status: 'fail', message, err });
};
