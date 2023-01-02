"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateMe = exports.addUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const prisma_client_1 = require("../prisma.client");
/*
[PATCH] /api/v1/users/updateMe
*/
const updateMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return (0, errorHandler_1.errorHandler)(res, 400, 'This route is not for password updates. Please use /updatePassword');
    }
    try {
        const { name, email } = req.body;
        //2) Update user document
        const updatedUser = yield prisma_client_1.prisma.user.update({
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
        (0, errorHandler_1.errorHandler)(res, 500, 'Error updating user', err);
    }
});
exports.updateMe = updateMe;
/*
[DELETE] /api/v1/users/deleteMe
*/
//Deactivate user
const deleteMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.user.update({
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
        (0, errorHandler_1.errorHandler)(res, 500, 'Error deleting user', err);
    }
});
exports.deleteMe = deleteMe;
const getAllUsers = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
exports.getUser = getUser;
const addUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
exports.addUser = addUser;
const updateUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'Route is not yet defined' });
};
exports.deleteUser = deleteUser;
