var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorHandler } from '../utils/errorHandler.js';
import { prisma } from '../prisma.client.js';
/*
[PATCH] /api/v1/users/updateMe
*/
const updateMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return errorHandler(res, 400, 'This route is not for password updates. Please use /updatePassword');
    }
    try {
        const { name, email } = req.body;
        //2) Update user document
        const updatedUser = yield prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                email,
            },
        });
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    }
    catch (err) {
        errorHandler(res, 500, 'Error updating user', err);
    }
});
/*
[DELETE] /api/v1/users/deleteMe
*/
//Deactivate user
const deleteMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.user.update({
            where: { id: req.user.id },
            data: {
                active: false,
            },
        });
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (err) {
        errorHandler(res, 500, 'Error deleting user', err);
    }
});
const getAllUsers = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
const getUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
const addUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
const updateUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
const deleteUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
export { getAllUsers, getUser, updateUser, deleteUser, addUser, updateMe, deleteMe, };
//# sourceMappingURL=userController.js.map