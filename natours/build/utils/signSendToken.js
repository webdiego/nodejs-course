import jwt from 'jsonwebtoken';
export const signSendToken = (user, res, statusCode = 200) => {
    //Expires in 24h
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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
module.exports = signSendToken;
//# sourceMappingURL=signSendToken.js.map