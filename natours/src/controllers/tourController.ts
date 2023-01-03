/* eslint-disable node/no-unsupported-features/es-syntax */
import { prisma } from '../prisma.client.js';
import { errorHandler } from '../utils/errorHandler.js';
import { Request, Response, NextFunction } from 'express';

//TODO: add validator--> ZOD?

const getAllTours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tours = await prisma.tour.findMany();
    res.status(200).json({
      status: 'success',
      data: { tours },
    });
  } catch (error) {
    errorHandler(res, 400, 'Tour not found', error);
    next(error);
  }
};

const getTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!tour) {
      return errorHandler(res, 400, 'Tour not found');
    }
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    errorHandler(res, 400, 'Tour not found');
    next(error);
  }
};

const addTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTour = await prisma.tour.create({
      data: req.body,
    });
    res.status(200).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    errorHandler(res, 400, 'Tour not created');
    next(error);
  }
};

const updateTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, rating, price } = req.body;
    const tour = await prisma.tour.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,

        price,
      },
    });

    if (!tour) {
      return errorHandler(res, 400, 'Tour not found');
    }

    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    errorHandler(res, 400, 'Tour not updated', err);
    next(err);
  }
};

const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tour = await prisma.tour.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!tour) {
      return errorHandler(res, 400, 'Tour not found');
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    errorHandler(res, 400, 'Tour not found');

    next(error);
  }
};

export { getAllTours, getTour, updateTour, deleteTour, addTour };
