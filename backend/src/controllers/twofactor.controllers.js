import { startSetup, confirmSetup, disableTwoFactor } from '../services/twofactor.services.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const setup = asyncHandler(async(req, res) => {
    const data = await startSetup(req.user.userId);
    res.status(200).json(new ApiResponse(200, data, 'Scan the QR-Code and confirm with a code'));
});

export const enable = asyncHandler(async(req, res) => {
    const code = req.body?.code;
    if(!code) {
        throw new ApiError(400, 'Code is required');
    }

    const backupCodes = await confirmSetup(req.user.userId, code);
    res.status(200).json(new ApiResponse(200, data, {backupCodes}, 'Two factor authentication enabled'));
});

export const disable = asyncHandler(async(req, res) => {
    const code = req.body?.code;
    if(!code) {
        throw new ApiError(400, 'Code is required');
    }

    await disableTwoFactor(req.user.userId, code);
    res.status(200).json(new ApiResponse(200, null, 'Two factor authentication disabled'));
});