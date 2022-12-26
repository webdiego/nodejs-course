const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const notFound = require('./middleware/notFound');

const app = express();
// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // GET /api/v1/tours 200 1.637 ms - 8628
}
app.use(express.json());

//Routes
app.use('/api/v1/tours', tourRouter); //tourRouter & userRouter are middleware
app.use('/api/v1/users', userRouter);

//404 handler
app.use('*', notFound);

module.exports = app;
