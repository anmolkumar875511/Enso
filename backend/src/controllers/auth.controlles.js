import { registerUser, loginUser } from '../services/auth.services.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async(req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(
        new ApiResponse(
            201,
            result,
            'Registered successfully'
        )
    );
});

export const login = asyncHandler(async(req, res) => {
    const result = await loginUser(req.body);
    res.status(200).json(
        new ApiResponse(
            200,
            result,
            'Login successfully'
        )
    );
});