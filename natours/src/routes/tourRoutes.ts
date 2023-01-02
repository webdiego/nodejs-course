import express, { Router } from 'express';

const router: Router = express.Router();
import { protect, restrictTo } from '../middleware/protect';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} from '../controllers/tourController';

router.route('/').get(protect, getAllTours).post(protect, addTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictTo('ADMIN', 'LEAD-GUIDE'), deleteTour);

export { router };
