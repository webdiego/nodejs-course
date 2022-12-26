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

router.route('/').get(protect, getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
