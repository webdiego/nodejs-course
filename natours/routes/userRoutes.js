const express = require('express');
const { protect } = require('../middleware/protect');

const router = express.Router();

const {
  updateMe,
  deleteMe,
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

//Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//Protect all routes after this middleware (protect)
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
