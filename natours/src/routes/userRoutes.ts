import express, { Router } from 'express';
import { protect } from '../middleware/protect.js';

const router: Router = express.Router();

import {
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
} from '../controllers/userController.js';

//Auth controller
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';

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

export { router };
