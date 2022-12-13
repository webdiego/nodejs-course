const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} = require('../controllers/tourController.js');

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
