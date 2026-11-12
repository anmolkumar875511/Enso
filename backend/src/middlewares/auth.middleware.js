import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'No token provided, access denied');
    }

    const token = authHeader.split(' ')[1];

    let decode;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired token');
    }
    
    if (decode.purpose) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    req.user = decode;
    next();
});

export default verifyJWT;