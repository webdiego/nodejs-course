const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/protect');
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
  .delete(protect, deleteTour);

module.exports = router;
