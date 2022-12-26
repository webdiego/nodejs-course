const errorHandler = (res, status, message, err) => {
  res.status(status).json({ status: 'fail', message, err });
};
module.exports = errorHandler;
