const prisma = require('../prisma.client');

const getAllTours = async (req, res) => {
  const tours = await prisma.tour.findMany();
  res
    .status(200)
    .json({ status: 'success', requested: req.requestTime, data: { tours } });
};

const getTour = async (req, res) => {
  const tour = await prisma.tour.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!tour) {
    res.status(400).json({ status: 'error', message: 'Tour not found' });
    throw new Error('Tour not found');
  }

  res.status(200).json({ status: 'success', data: { tour } });
};

const addTour = async (req, res) => {
  //TODO: add validator--> ZOD?
  const { name, rating, price } = req.body;
  const newTour = await prisma.tour.create({
    data: {
      name,
      rating,
      price,
    },
  });

  // if (!newTour) {
  //   res.status(400).json({ status: 'error', message: 'Tour not created' });
  //   throw new Error('Tour not created');
  // }
  res.status(201).json({ status: 'success', data: { tour: newTour } }); //201 CREATED
};

const updateTour = async (req, res) => {
  const { name, rating, price } = req.body;
  const tour = await prisma.tour.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      name,
      rating,
      price,
    },
  });
  res.status(200).json({ status: 'success', data: { tour: tour } });
};

const deleteTour = async (req, res) => {
  await prisma.tour.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.status(204).json({ status: 'success', data: null });
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
};
