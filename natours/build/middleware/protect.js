var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.client.js';
import { errorHandler } from '../utils/errorHandler.js';
export const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get token from header
            token = req.headers.authorization.split(' ')[1];
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //Get user from the token
            if (typeof decoded === 'string') {
                return errorHandler(res, 401, 'Invalid token');
            }
            const currentUser = yield prisma.user.findUnique({
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
                errorHandler(res, 401, 'User not exist');
            }
            //Grant access to protected route, pass user to the next middleware function
            req.user = currentUser;
            next();
        }
        catch (err) {
            errorHandler(res, 401, 'Not authorized!', err);
            // res.status(401).json({ status: 'fail', message: 'Not authorized' });
            next(err);
        }
    }
    if (!token) {
        errorHandler(res, 401, 'Your are not login!');
    }
});
export const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return errorHandler(res, 403, 'You do not have permission to perform this action');
    }
    next();
};
//# sourceMappingURL=protect.js.map