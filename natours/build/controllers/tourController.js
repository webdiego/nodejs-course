var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable node/no-unsupported-features/es-syntax */
import { prisma } from '../prisma.client.js';
import { errorHandler } from '../utils/errorHandler.js';
//TODO: add validator--> ZOD?
const getAllTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield prisma.tour.findMany();
        res.status(200).json({
            status: 'success',
            data: { tours },
        });
    }
    catch (error) {
        errorHandler(res, 400, 'Tour not found', error);
        next(error);
    }
});
const getTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield prisma.tour.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!tour) {
            return errorHandler(res, 400, 'Tour not found');
        }
        res.status(200).json({ status: 'success', data: { tour } });
    }
    catch (error) {
        errorHandler(res, 400, 'Tour not found');
        next(error);
    }
});
const addTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield prisma.tour.create({
            data: req.body,
        });
        res.status(200).json({ status: 'success', data: { tour: newTour } });
    }
    catch (error) {
        errorHandler(res, 400, 'Tour not created');
        next(error);
    }
});
const updateTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, rating, price } = req.body;
        const tour = yield prisma.tour.update({
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
    }
    catch (err) {
        errorHandler(res, 400, 'Tour not updated', err);
        next(err);
    }
});
const deleteTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield prisma.tour.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!tour) {
            return errorHandler(res, 400, 'Tour not found');
        }
        res.status(204).json({ status: 'success', data: null });
    }
    catch (error) {
        errorHandler(res, 400, 'Tour not found');
        next(error);
    }
});
export { getAllTours, getTour, updateTour, deleteTour, addTour };
//# sourceMappingURL=tourController.js.map