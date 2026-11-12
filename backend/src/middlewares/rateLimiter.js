import rateLimit from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';

const createLimiter = (limit) => {
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
            next(new ApiError(429, 'Too many tries, please try again later'))
        }
    });
};

export const loginLimiter = createLimiter(10);
export const twoFactorLimiter = createLimiter(5);