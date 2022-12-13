const fs = require('fs');

//All tour data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkId = (req, res, next, val) => {
  const id = req.params.id * 1;
  let tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({ status: 'error', message: 'This tour not exist!' });
  }
  next();
};
const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ status: 'error', message: 'Values error' });
  }
  next();
};

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', requested: req.requestTime, data: { tours } });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  let tour = tours.find((el) => el.id === id);
  res.status(200).json({ status: 'success', data: { tour } });
};

const addTour = (req, res) => {
  const newId = req.body.id;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } }); //201 CREATED
    }
  );
};

const updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour...></Updated>' } });
};

const deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
  checkId,
  checkBody,
};
