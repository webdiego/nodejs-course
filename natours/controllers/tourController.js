/* eslint-disable node/no-unsupported-features/es-syntax */
const prisma = require('../prisma.client');

//TODO: add validator--> ZOD?

const getAllTours = async (req, res, next) => {
  try {
    const tours = await prisma.tour.findMany();
    res.status(200).json({
      status: 'success',
      requested: req.requestTime,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Tour not found' });
    next(error);
  }
};

const getTour = async (req, res, next) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!tour) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Tour not found' });
    }
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Tour not found' });
    next(error);
  }
};

const addTour = async (req, res, next) => {
  try {
    const newTour = await prisma.tour.create({
      data: req.body,
    });
    res.status(200).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Tour not created' });

    next(error);
  }
};

const updateTour = async (req, res, next) => {
  try {
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

    if (!tour)
      return res
        .status(400)
        .json({ status: 'error', message: 'Tour not found' });

    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Tour not updated' });
    next(error);
  }
};

const deleteTour = async (req, res, next) => {
  try {
    const tour = await prisma.tour.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!tour)
      return res
        .status(400)
        .json({ status: 'error', message: 'Tour not found' });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Tour not found' });
    next(error);
  }
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
};
