import express, { Router } from 'express';

const router: Router = express.Router();
import { protect, restrictTo } from '../middleware/protect.js';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} from '../controllers/tourController.js';

router.route('/').get(protect, getAllTours).post(protect, addTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictTo('ADMIN', 'LEAD-GUIDE'), deleteTour);

export { router };
