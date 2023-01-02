"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = function (res, status, message, err = '') {
    return res.status(status).json({ status: 'fail', message, err });
};
exports.errorHandler = errorHandler;
