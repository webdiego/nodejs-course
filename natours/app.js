const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev')); // GET /api/v1/tours 200 1.637 ms - 8628
// Middleware
app.use(express.json()); //Is a middleware as all our routes

app.use((req, res, next) => {
  console.log('Hello from a middleware!🖖');
  req.requestTime = new Date().toISOString();
  next();
});

//All tour data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', requested: req.requestTime, data: { tours } });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  let tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'error', message: 'This tour not exist!' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
};
const addTour = (req, res) => {
  const newId = req.body.id;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } }); //201 CREATED
    }
  );
};
const updateTour = (req, res) => {
  const id = req.params.id * 1;
  let tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({ status: 'error', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: { tour: newTour } });
};
const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  let tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({ status: 'error', message: 'Invalid ID' });
  }
  res.status(204).json({ status: 'success', data: null });
};

//Routes tours
const tourRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
tourRouter.route('/').get(getAllTours).post(addTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

//------ USERS
const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'Route is not yet defined' });
};
const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'Route is not yet defined' });
};
const addUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'Route is not yet defined' });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'Route is not yet defined' });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'Route is not yet defined' });
};
//Routes users
const userRouter = express.Router();
app.use('/api/v1/users', userRouter);
userRouter.route('/').get(getAllUsers).post(addUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
