import bcrypt from 'bcrypt';
import { prisma } from '../prisma.client';
import { errorHandler } from '../utils/errorHandler';
import { createPswResetToken } from '../utils/createPswResetToken';
import { sendEmail } from '../service/email';
import { signSendToken } from '../utils/signSendToken';

/*
POST /api/v1/users/signup
*/

const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    //TODO: check if email is valid

    if (password !== passwordConfirm) {
      return errorHandler(res, 400, 'Psw not match');
    }

    const userAlreadyExist = await prisma.user.findUnique({ where: { email } });

    if (userAlreadyExist) {
      return errorHandler(res, 400, 'User already exist');
    }

    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        return errorHandler(res, 500, 'Psw not hashed');
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          role: role || 'USER',
        },
        select: { name: true, email: true, role: true },
      });
      return signSendToken(newUser, res, 200);
    });
  } catch (err) {
    errorHandler(res, 400, 'User not created');
    return next(err);
  }
};

/*
[POST] /api/v1/users/login
*/

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 1) Check if email and password exist
    if (!email || !password) {
      return errorHandler(res, 400, 'Email or psw missing');
    }
    // 2) Check if user exists with that email
    const user = await prisma.user.findUnique({
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
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err || !result) {
        return errorHandler(res, 400, 'Psw not match');
      }
      return signSendToken(user, res, 200);
    });
  } catch (error) {
    errorHandler(res, 400, 'User not logged in');
    next(error);
  }
};

/*
[POST] /api/v1/users/forgotPassword
*/
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    // 1) Get user based on POSTed email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return errorHandler(res, 404, 'User not found!');
    }
    // 2) If user exists, generate the random reset token
    const passwordResetToken = createPswResetToken();
    const currentDate = new Date();
    const passwordResetExpires = new Date(
      currentDate.getTime() + 10 * 60 * 1000
    );

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${passwordResetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} . If you didn't forget your password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (err) {
    errorHandler(
      res,
      500,
      `There was an erro sending the email. Try again later`,
      err
    );
    return next(err);
  }
};

/*
[PATCH] /api/v1/users/resetPassword/:token
*/

const resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const { password, passwordConfirm } = req.body;

  try {
    const getUser = await prisma.user.findFirst({
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
    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        return errorHandler(res, 500, 'Psw not hashed');
      }

      await prisma.user.update({
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
    });
  } catch (err) {
    errorHandler(res, 500, 'Something went wrong', err);
    return next(err);
  }
};

/*
[PATCH] /api/v1/users/updatePassword
*/

const updatePassword = async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  try {
    const user = await prisma.user.findUnique({
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

    bcrypt.compare(passwordCurrent, user.password, async (err, result) => {
      if (err) {
        return errorHandler(res, 400, 'Psw not match');
      }

      if (result) {
        bcrypt.hash(password, 12, async (hashErr, hash) => {
          if (hashErr) {
            return errorHandler(res, 500, 'Psw not hashed');
          }

          await prisma.user.update({
            where: { id: req.user.id },
            data: {
              password: hash,
            },
          });

          res.status(200).json({ status: 'success', message: 'Psw changed' });
        });
      }
    });
  } catch (err) {
    errorHandler(res, 500, 'Something went wrong', err);
    return next(err);
  }
};

export { signup, login, forgotPassword, resetPassword, updatePassword };
