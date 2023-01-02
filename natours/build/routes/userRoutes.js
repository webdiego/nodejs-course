"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
exports.router = router;
const userController_1 = require("../controllers/userController");
//Auth controller
const authController_1 = require("../controllers/authController");
//Auth routes
router.post('/signup', authController_1.signup);
router.post('/login', authController_1.login);
router.post('/forgotPassword', authController_1.forgotPassword);
router.patch('/resetPassword/:token', authController_1.resetPassword);
//Protect all routes after this middleware (protect)
router.patch('/updatePassword', protect_1.protect, authController_1.updatePassword);
router.patch('/updateMe', protect_1.protect, userController_1.updateMe);
router.delete('/deleteMe', protect_1.protect, userController_1.deleteMe);
router.route('/').get(userController_1.getAllUsers).post(userController_1.addUser);
router.route('/:id').get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
