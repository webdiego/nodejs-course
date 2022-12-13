const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
  checkId,
} = require('../controllers/tourController.js');

//Middleware param
router.param('id', checkId);

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
