"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTour = exports.deleteTour = exports.updateTour = exports.getTour = exports.getAllTours = void 0;
/* eslint-disable node/no-unsupported-features/es-syntax */
const prisma_client_1 = require("../prisma.client");
const errorHandler_1 = require("../utils/errorHandler");
//TODO: add validator--> ZOD?
const getAllTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield prisma_client_1.prisma.tour.findMany();
        res.status(200).json({
            status: 'success',
            requested: req.requestTime,
            data: { tours },
        });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found', error);
        next(error);
    }
});
exports.getAllTours = getAllTours;
const getTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield prisma_client_1.prisma.tour.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!tour) {
            return (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found');
        }
        res.status(200).json({ status: 'success', data: { tour } });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found');
        next(error);
    }
});
exports.getTour = getTour;
const addTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield prisma_client_1.prisma.tour.create({
            data: req.body,
        });
        res.status(200).json({ status: 'success', data: { tour: newTour } });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, 400, 'Tour not created');
        next(error);
    }
});
exports.addTour = addTour;
const updateTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, rating, price } = req.body;
        const tour = yield prisma_client_1.prisma.tour.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name,
                price,
            },
        });
        if (!tour) {
            return (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found');
        }
        res.status(200).json({ status: 'success', data: { tour: tour } });
    }
    catch (err) {
        (0, errorHandler_1.errorHandler)(res, 400, 'Tour not updated', err);
        next(err);
    }
});
exports.updateTour = updateTour;
const deleteTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield prisma_client_1.prisma.tour.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!tour) {
            return (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found');
        }
        res.status(204).json({ status: 'success', data: null });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(res, 400, 'Tour not found');
        next(error);
    }
});
exports.deleteTour = deleteTour;
