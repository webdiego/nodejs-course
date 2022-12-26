const express = require('express');

const router = express.Router();
const { protect, restrictTo } = require('../middleware/protect');
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} = require('../controllers/tourController');

router.route('/').get(protect, getAllTours).post(protect, addTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictTo('ADMIN', 'LEAD-GUIDE'), deleteTour);

module.exports = router;
