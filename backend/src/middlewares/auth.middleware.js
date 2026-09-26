import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'No token provided, access denied');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired token')
    }
});

export default verifyJWT;