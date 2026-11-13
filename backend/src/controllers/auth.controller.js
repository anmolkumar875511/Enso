import passport from 'passport';
import { registerUser, loginUser, getUser, getLoginResult, completeTwoFactorLogin } from '../services/auth.services.js';
import { getRequestContext, logEvent } from '../services/audit.services.js';
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
    const result = await loginUser(req.body, getRequestContext(req));
    res.status(200).json(
        new ApiResponse(
            200,
            result,
            result.requires2FA ? 'Two-factor code required' : 'Login successfully'
        )
    );
});

export const verifyTwoFactorLogin = asyncHandler(async(req, res) => {
    const { tempToken, code } = req.body || {};
    const token = await completeTwoFactorLogin(tempToken, code, getRequestContext(req));
    res.status(200).json(
        new ApiResponse(
            200,
            { token },
            'Login successfully'
        )
    );
});

export const googleCallback = (req, res, next) => {
    passport.authenticate('google', {session: false}, async(err, user, info) => {
        if(err || !user) {
            const message = encodeURIComponent(info?.message || 'Google sign-in failed');
            return res.redirect(`${process.env.CLIENT_URL}/login?error=${message}`);
        }

        try {
            const result = await getLoginResult(user._id);

            if(result.requires2FA) {
                return res.redirect(`${process.env.CLIENT_URL}/login?tempToken=${result.tempToken}`);
            }

            await logEvent({ userId: user._id, action: 'login', ctx: getRequestContext(req) });

            return res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${result.token}`);
        } catch (error) {
            const message = encodeURIComponent('Google sign-in failed');
            return res.redirect(`${process.env.CLIENT_URL}/login?error=${message}`);
        }
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