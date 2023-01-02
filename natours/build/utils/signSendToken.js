"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signSendToken = (user, res, statusCode = 200) => {
    //Expires in 24h
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const cookieOptions = {
        expires: new Date(),
        // new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
        secure: true,
        httpOnly: true, //Client can't access cookie and modify it
    };
    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};
exports.signSendToken = signSendToken;
module.exports = exports.signSendToken;
