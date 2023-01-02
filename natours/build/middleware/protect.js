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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../prisma.client");
const errorHandler_1 = require("../utils/errorHandler");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get token from header
            token = req.headers.authorization.split(' ')[1];
            //verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            //Get user from the token
            const currentUser = yield prisma_client_1.prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            //Check if user still exists
            if (!currentUser) {
                (0, errorHandler_1.errorHandler)(res, 401, 'User not exist');
            }
            //Grant access to protected route, pass user to the next middleware function
            req.user = currentUser;
            next();
        }
        catch (err) {
            (0, errorHandler_1.errorHandler)(res, 401, 'Not authorized!', err);
            // res.status(401).json({ status: 'fail', message: 'Not authorized' });
            next(err);
        }
    }
    if (!token) {
        (0, errorHandler_1.errorHandler)(res, 401, 'Your are not login!');
    }
});
exports.protect = protect;
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return (0, errorHandler_1.errorHandler)(res, 403, 'You do not have permission to perform this action');
    }
    next();
};
exports.restrictTo = restrictTo;
