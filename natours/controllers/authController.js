const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma.client');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'fail', message: 'Psw not match' });
    }

    const userAlreadyExist = await prisma.user.findUnique({ where: { email } });

    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'User already exist' });
    }

    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Psw not hashed' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          role: role || 'USER',
        },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res
        .status(200)
        .json({ status: 'success', data: { user: newUser, token } });
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'User not created' });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      res.status(400).json({ status: 'fail', message: 'Email or psw missing' });
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
      res.status(400).json({ status: 'fail', message: 'User not found' });
    }
    // 3) If everything ok, send token to client
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(400).json({ status: 'fail', message: 'Psw not match' });
      }
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json({ status: 'success', data: { user, token } });
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'User not logged in' });
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
