var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import { prisma } from '../prisma.client.js';
import { errorHandler } from '../utils/errorHandler.js';
import { createPswResetToken } from '../utils/createPswResetToken.js';
import { sendEmail } from '../service/email.js';
import { signSendToken } from '../utils/signSendToken.js';
/*
POST /api/v1/users/signup
*/
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, passwordConfirm, role } = req.body;
        //TODO: check if email is valid
        if (password !== passwordConfirm) {
            return errorHandler(res, 400, 'Psw not match');
        }
        const userAlreadyExist = yield prisma.user.findUnique({ where: { email } });
        if (userAlreadyExist) {
            return errorHandler(res, 400, 'User already exist');
        }
        bcrypt.hash(password, 12, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return errorHandler(res, 500, 'Psw not hashed');
            }
            const newUser = yield prisma.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                    role: role || 'USER',
                },
                select: { name: true, email: true, role: true },
            });
            return signSendToken(newUser, res, 200);
        }));
    }
    catch (err) {
        errorHandler(res, 400, 'User not created');
        return next(err);
    }
});
/*
[POST] /api/v1/users/login
*/
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // 1) Check if email and password exist
        if (!email || !password) {
            return errorHandler(res, 400, 'Email or psw missing');
        }
        // 2) Check if user exists with that email
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                password: true,
            },
        });
        if (!user) {
            return errorHandler(res, 404, 'User not found');
        }
        // 3) If everything ok, send token to client
        bcrypt.compare(password, user.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err || !result) {
                return errorHandler(res, 400, 'Psw not match');
            }
            return signSendToken(user, res, 200);
        }));
    }
    catch (error) {
        errorHandler(res, 400, 'User not logged in');
        next(error);
    }
});
/*
[POST] /api/v1/users/forgotPassword
*/
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // 1) Get user based on POSTed email
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return errorHandler(res, 404, 'User not found!');
        }
        // 2) If user exists, generate the random reset token
        const passwordResetToken = createPswResetToken();
        const currentDate = new Date();
        const passwordResetExpires = new Date(currentDate.getTime() + 10 * 60 * 1000);
        yield prisma.user.update({
            where: { email },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });
        // 3) Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${passwordResetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} . If you didn't forget your password, please ignore this email!`;
        yield sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
        res.status(200).json({ status: 'success', message: 'Token sent to email' });
    }
    catch (err) {
        errorHandler(res, 500, `There was an erro sending the email. Try again later`, err);
        return next(err);
    }
});
/*
[PATCH] /api/v1/users/resetPassword/:token
*/
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const { password, passwordConfirm } = req.body;
    try {
        const getUser = yield prisma.user.findFirst({
            where: { passwordResetToken: req.params.token },
            select: {
                id: true,
                email: true,
                passwordResetExpires: true,
            },
        });
        if (!getUser) {
            return errorHandler(res, 400, 'Not user with this token');
        }
        if (getUser.passwordResetExpires < new Date()) {
            return errorHandler(res, 400, 'Token is invalid or has expired');
        }
        if (password !== passwordConfirm) {
            return errorHandler(res, 400, 'Psw not match');
        }
        // 2) If token has not expired, and there is user, set the new password
        bcrypt.hash(password, 12, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return errorHandler(res, 500, 'Psw not hashed');
            }
            yield prisma.user.update({
                where: { id: getUser.id },
                data: {
                    password: hash,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                },
                select: {
                    id: true,
                },
            });
            res.status(200).json({ status: 'success', message: 'Psw changed' });
        }));
    }
    catch (err) {
        errorHandler(res, 500, 'Something went wrong', err);
        return next(err);
    }
});
/*
[PATCH] /api/v1/users/updatePassword
*/
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { passwordCurrent, password, passwordConfirm } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                password: true,
            },
        });
        if (!user) {
            return errorHandler(res, 404, 'User not found');
        }
        if (password !== passwordConfirm) {
            return errorHandler(res, 400, 'Psw not match');
        }
        bcrypt.compare(passwordCurrent, user.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return errorHandler(res, 400, 'Psw not match');
            }
            if (result) {
                bcrypt.hash(password, 12, (hashErr, hash) => __awaiter(void 0, void 0, void 0, function* () {
                    if (hashErr) {
                        return errorHandler(res, 500, 'Psw not hashed');
                    }
                    yield prisma.user.update({
                        where: { id: req.user.id },
                        data: {
                            password: hash,
                        },
                    });
                    res.status(200).json({ status: 'success', message: 'Psw changed' });
                }));
            }
        }));
    }
    catch (err) {
        errorHandler(res, 500, 'Something went wrong', err);
        return next(err);
    }
});
export { signup, login, forgotPassword, resetPassword, updatePassword };
//# sourceMappingURL=authController.js.map