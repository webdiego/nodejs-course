const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const notFound = require('./middleware/notFound');

//Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1h)
  message: 'Too many requests from this IP, please try again in an hour!',
});

const app = express();

//Security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // GET /api/v1/tours 200 1.637 ms - 8628
}
//Limit requests from same API
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Routes -> tourRouter & userRouter are middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//404 handler
app.use('*', notFound);

module.exports = app;
