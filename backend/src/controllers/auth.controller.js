import passport from 'passport';
import { registerUser, loginUser, getUser, signToken } from '../services/auth.services.js';
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

export const googleCallback = (req, res, next) => {
    passport.authenticate('google', {session: false}, (err, user, info) => {
        if(err || !user) {
            const message = encodeURIComponent(info?.message || 'Google sign-in failed');
            return res.redirect(`${process.env.CLIENT_URL}/login?error=${message}`);
        }

        const token = signToken(user._id);
        return res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    })(req, res, next);
};

export const getMe = asyncHandler(async(req, res) => {
    const result = await getUser(req.user.userId);
    res.status(200).json(
        new ApiResponse(
            200,
            result,
            'User fetched successfully'
        )
    );
});