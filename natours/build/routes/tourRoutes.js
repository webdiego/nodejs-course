"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const protect_1 = require("../middleware/protect");
const tourController_1 = require("../controllers/tourController");
router.route('/').get(protect_1.protect, tourController_1.getAllTours).post(protect_1.protect, tourController_1.addTour);
router
    .route('/:id')
    .get(protect_1.protect, tourController_1.getTour)
    .patch(protect_1.protect, tourController_1.updateTour)
    .delete(protect_1.protect, (0, protect_1.restrictTo)('ADMIN', 'LEAD-GUIDE'), tourController_1.deleteTour);
