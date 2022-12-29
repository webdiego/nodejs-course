const express = require('express');
const { protect } = require('../middleware/protect');

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
} = require('../controllers/userController');

//Auth controller
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
