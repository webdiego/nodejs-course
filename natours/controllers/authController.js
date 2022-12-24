const bcrypt = require('bcrypt');
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
      res.status(200).json({ status: 'success', data: { user: newUser } });
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'User not created' });
    next(error);
  }
};
module.exports = {
  signup,
};
