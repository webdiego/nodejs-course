const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma.client');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      res.status(400).json({ status: 'fail', message: 'Psw not match' });
    }

    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        res.status(400).json({ status: 'fail', message: 'Psw not hashed' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
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
module.exports = {
  signup,
};
