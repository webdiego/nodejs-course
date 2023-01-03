export const notFound = (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
    next();
};
//# sourceMappingURL=notFound.js.map