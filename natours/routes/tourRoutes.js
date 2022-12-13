const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
  checkId,
  checkBody,
} = require('../controllers/tourController.js');

//Middleware param
router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBody, addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
