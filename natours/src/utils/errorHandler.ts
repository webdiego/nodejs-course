export const errorHandler = function (res, status, message, err = '') {
  return res.status(status).json({ status: 'fail', message, err });
};
