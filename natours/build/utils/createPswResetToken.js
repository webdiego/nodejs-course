"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPswResetToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createPswResetToken = () => {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const hash = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    return hash;
};
exports.createPswResetToken = createPswResetToken;
