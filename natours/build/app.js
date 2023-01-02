"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const tourRoutes_1 = require("./routes/tourRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const notFound_1 = require("./middleware/notFound");
//Rate limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again in an hour!',
});
const app = (0, express_1.default)();
exports.app = app;
//Security HTTP headers
app.use((0, helmet_1.default)());
//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev')); // GET /api/v1/tours 200 1.637 ms - 8628
}
//Limit requests from same API
app.use('/api', limiter);
//Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
//Routes -> tourRouter & userRouter are middleware
app.use('/api/v1/tours', tourRoutes_1.router);
app.use('/api/v1/users', userRoutes_1.router);
//404 handler
app.use('*', notFound_1.notFound);
